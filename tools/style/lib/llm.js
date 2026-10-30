'use strict'

/**
 * OpenAI 兼容客户端：chat + embed。
 *
 * 设计要点：
 *   - 零依赖，用 Node 20 内置 fetch + AbortSignal.timeout
 *   - 并发闸门（默认 3），长文批量不把对端打挂
 *   - 429 / 5xx / 网络错误指数退避重试 3 次
 *   - 按「model + 请求体」sha1 落盘缓存，重跑同一篇不重复花钱
 *   - 报错信息脱敏：绝不回显 Authorization
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { spawn } = require('child_process')
const { config, CACHE_DIR, ensureDir } = require('./env')

const TIMEOUT_MS = 60_000
const CLI_TIMEOUT_MS = 240_000
const RETRIES = 3
const EMBED_BATCH = 16

/** 不打算让 CLI 去读写文件或联网，纯文本生成即可 —— 也避免被权限检查拦住 */
const CLI_DENIED_TOOLS = 'Bash,Write,Edit,Read,Glob,Grep,WebFetch,WebSearch,Task'

let active = 0
const waiting = []

function acquire() {
  const limit = config().concurrency
  if (active < limit) {
    active++
    return Promise.resolve()
  }
  return new Promise((resolve) => waiting.push(resolve))
}

function release() {
  active--
  const next = waiting.shift()
  if (next) {
    active++
    next()
  }
}

function sha1(text) {
  return crypto.createHash('sha1').update(text).digest('hex')
}

function cachePath(kind, key) {
  return path.join(CACHE_DIR, kind, `${key}.json`)
}

function readCache(kind, key) {
  try {
    return JSON.parse(fs.readFileSync(cachePath(kind, key), 'utf8'))
  } catch {
    return null
  }
}

function writeCache(kind, key, value) {
  try {
    ensureDir(path.join(CACHE_DIR, kind))
    fs.writeFileSync(cachePath(kind, key), JSON.stringify(value))
  } catch {
    /* 缓存写失败不影响主流程 */
  }
}

function sanitize(message) {
  return String(message).replace(/sk-[A-Za-z0-9_-]{6,}/g, 'sk-***').slice(0, 500)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function postJson(url, body, apiKey, timeoutMs = TIMEOUT_MS) {
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  let lastError = null
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await sleep(500 * 2 ** (attempt - 1))
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      })
      const text = await res.text()
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}: ${sanitize(text)}`)
        // 只有限流与服务端错误值得重试
        if (res.status === 429 || res.status >= 500) {
          lastError = err
          continue
        }
        throw err
      }
      return JSON.parse(text)
    } catch (err) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        lastError = new Error(`请求超时（${timeoutMs}ms）`)
        continue
      }
      if (err.message && /^HTTP 4/.test(err.message)) throw err
      lastError = err
    }
  }
  throw lastError || new Error('请求失败')
}

function runCommand(bin, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    let child
    try {
      child = spawn(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (err) {
      reject(err)
      return
    }
    let stdout = ''
    let stderr = ''
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      reject(new Error(`CLI 超时（${Math.round(timeoutMs / 1000)}s）`))
    }, timeoutMs)

    child.stdout.on('data', (chunk) => (stdout += chunk))
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('error', (err) => {
      clearTimeout(timer)
      if (err.code === 'ENOENT') {
        const e = new Error(
          [
            `找不到命令 \`${bin}\`。`,
            '',
            'STYLE_PROVIDER=codebuddy 需要本机安装 CodeBuddy Code CLI，并已登录同一账号。',
            '安装后可自检：',
            '  codebuddy --version',
            '  codebuddy -p "回复 ok" --output-format json',
            '',
            '若命令名不同，用 STYLE_CODEBUDDY_BIN 指定路径。',
          ].join('\n')
        )
        e.code = 'STYLE_NO_CLI'
        reject(e)
        return
      }
      reject(err)
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (code !== 0) {
        const e = new Error(`codebuddy 退出码 ${code}：${sanitize(stderr || stdout)}`)
        e.code = 'STYLE_CLI_FAILED'
        reject(e)
        return
      }
      resolve(stdout)
    })
  })
}

/**
 * 走本机 CodeBuddy CLI 的无头模式（消耗账号积分，不需要 API Key）
 * 对应命令：codebuddy -p "<prompt>" --output-format json
 */
async function chatViaCli(messages, opts, cfg) {
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n')
  const user = messages
    .filter((m) => m.role !== 'system')
    .map((m) => m.content)
    .join('\n\n')

  const prompt = opts.json ? `${user}\n\n只输出一个合法 JSON 对象，不要解释、不要代码块。` : user

  const args = ['-p', prompt, '--output-format', 'json']
  if (system) args.push('--append-system-prompt', system)
  args.push('--disallowedTools', CLI_DENIED_TOOLS)

  const key = sha1(`cli:${cfg.cliBin}\n${JSON.stringify(args)}`)
  if (opts.useCache !== false) {
    const hit = readCache('chat', key)
    if (hit && typeof hit.content === 'string') return hit.content
  }

  await acquire()
  let stdout
  try {
    stdout = await runCommand(cfg.cliBin, args, CLI_TIMEOUT_MS)
  } finally {
    release()
  }

  let content = stdout
  try {
    const parsed = JSON.parse(stdout)
    if (typeof parsed.result === 'string') content = parsed.result
    else if (typeof parsed.text === 'string') content = parsed.text
    else if (typeof parsed.content === 'string') content = parsed.content
  } catch {
    /* 非 JSON 输出（--output-format 被旧版本忽略）时直接用 stdout */
  }

  content = String(content).trim()
  if (!content) {
    const e = new Error(`codebuddy 返回空内容：${sanitize(stdout.slice(0, 300))}`)
    e.code = 'STYLE_CLI_FAILED'
    throw e
  }
  if (opts.useCache !== false) writeCache('chat', key, { content, model: cfg.cliBin, label: opts.label || '' })
  return content
}

/**
 * @param {Array<{role:string, content:string}>} messages
 * @param {{json?:boolean, temperature?:number, maxTokens?:number, useCache?:boolean, label?:string}} [opts]
 * @returns {Promise<string>}
 */
async function chat(messages, opts = {}) {
  const cfg = config()
  if (!cfg.hasLlm) {
    const err = new Error('缺少 LLM 配置（STYLE_BASE_URL / STYLE_MODEL / STYLE_API_KEY）')
    err.code = 'STYLE_NO_LLM_CONFIG'
    throw err
  }
  if (cfg.cli) return chatViaCli(messages, opts, cfg)

  const body = {
    model: cfg.model,
    messages,
    temperature: opts.temperature ?? 0.8,
    max_tokens: opts.maxTokens ?? 4096,
    stream: false,
  }
  if (opts.json) body.response_format = { type: 'json_object' }

  const key = sha1(`${cfg.model}\n${JSON.stringify(body)}`)
  if (opts.useCache !== false) {
    const hit = readCache('chat', key)
    if (hit && typeof hit.content === 'string') return hit.content
  }

  await acquire()
  let data
  try {
    data = await postJson(`${cfg.baseUrl}/chat/completions`, body, cfg.apiKey)
  } finally {
    release()
  }

  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error(`模型返回结构异常：${sanitize(JSON.stringify(data).slice(0, 300))}`)
  }
  if (opts.useCache !== false) {
    writeCache('chat', key, { content, model: cfg.model, label: opts.label || '' })
  }
  return content
}

/**
 * 批量向量化；未配置 embedding 模型时抛出 code=STYLE_NO_EMBED，由调用方降级 BM25
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
async function embed(texts) {
  const cfg = config()
  if (!cfg.hasEmbed) {
    const err = new Error('未配置 embedding 模型（STYLE_EMBED_MODEL）')
    err.code = 'STYLE_NO_EMBED'
    throw err
  }

  const out = []
  for (let i = 0; i < texts.length; i += EMBED_BATCH) {
    const batch = texts.slice(i, i + EMBED_BATCH)
    const key = sha1(`${cfg.embedModel}\n${JSON.stringify(batch)}`)

    const hit = readCache('embed', key)
    if (hit && Array.isArray(hit.vectors)) {
      out.push(...hit.vectors)
      continue
    }

    await acquire()
    let data
    try {
      data = await postJson(
        `${cfg.baseUrl}/embeddings`,
        { model: cfg.embedModel, input: batch, encoding_format: 'float' },
        cfg.apiKey
      )
    } finally {
      release()
    }

    const vectors = (data?.data || []).map((d) => d.embedding)
    if (vectors.length !== batch.length) {
      throw new Error(`embedding 返回条数不匹配：期望 ${batch.length}，实际 ${vectors.length}`)
    }
    writeCache('embed', key, { vectors })
    out.push(...vectors)
  }
  return out
}

module.exports = { chat, embed, sha1, sanitize }
