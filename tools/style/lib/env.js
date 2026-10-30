'use strict'

/**
 * 配置中心：路径常量 + .env 解析 + provider 归一化。
 *
 * 只读环境变量，绝不把密钥写进日志。
 * 自写 .env 解析（不引 dotenv），支持注释、空行、引号包裹。
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..', '..')
const POSTS_DIR = path.join(ROOT, 'source', '_posts')
const DRAFTS_DIR = path.join(ROOT, 'source', '_drafts')
const STYLE_DIR = path.join(ROOT, 'style')
const CORPUS_DIR = path.join(STYLE_DIR, 'corpus')
const INDEX_DIR = path.join(STYLE_DIR, 'index')
const CACHE_DIR = path.join(STYLE_DIR, '.cache')

const FILES = {
  chunks: path.join(CORPUS_DIR, 'chunks.jsonl'),
  stats: path.join(CORPUS_DIR, 'stats.json'),
  report: path.join(CORPUS_DIR, 'report.json'),
  profile: path.join(STYLE_DIR, 'style-profile.json'),
  guide: path.join(STYLE_DIR, 'style-guide.md'),
  vectors: path.join(INDEX_DIR, 'vectors.jsonl'),
  indexMeta: path.join(INDEX_DIR, 'meta.json'),
  evalReport: path.join(STYLE_DIR, 'eval-report.md'),
}

/** provider 预设：同一套 OpenAI 兼容协议，换 baseUrl/model 即可 */
const PRESETS = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    embedModel: '',
  },
  qwen: {
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    embedModel: 'text-embedding-v3',
  },
  siliconflow: {
    baseUrl: 'https://api.siliconflow.cn/v1',
    model: 'Qwen/Qwen2.5-72B-Instruct',
    embedModel: 'BAAI/bge-m3',
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    embedModel: 'text-embedding-3-small',
  },
  ollama: {
    baseUrl: 'http://localhost:11434/v1',
    model: 'qwen2.5:7b',
    embedModel: '',
  },
  // 走本机 CodeBuddy CLI 的无头模式（消耗账号积分，不需要 API Key）
  codebuddy: {
    baseUrl: '',
    model: 'codebuddy',
    embedModel: '',
    cli: true,
  },
}

function parseDotEnv(text) {
  const out = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

let envLoaded = false

function loadDotEnv() {
  if (envLoaded) return
  envLoaded = true
  const envPath = path.join(ROOT, '.env')
  let text = ''
  try {
    text = fs.readFileSync(envPath, 'utf8')
  } catch {
    return
  }
  const parsed = parseDotEnv(text)
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) process.env[key] = value
  }
}

function config() {
  loadDotEnv()
  const provider = (process.env.STYLE_PROVIDER || '').trim().toLowerCase()
  const preset = PRESETS[provider] || {}

  const baseUrl = (process.env.STYLE_BASE_URL || preset.baseUrl || '').replace(/\/+$/, '')
  const model = process.env.STYLE_MODEL || preset.model || ''
  const embedModel = process.env.STYLE_EMBED_MODEL || preset.embedModel || ''
  const apiKey = process.env.STYLE_API_KEY || ''
  const isCli = Boolean(preset.cli)
  // CLI 每次调用都是一次完整会话，并发默认压到 1
  const defaultConcurrency = isCli ? 1 : 3
  const concurrency = Math.max(1, Number(process.env.STYLE_CONCURRENCY) || defaultConcurrency)

  return {
    provider: provider || (baseUrl ? 'custom' : ''),
    baseUrl,
    model,
    embedModel,
    apiKey,
    concurrency,
    cli: isCli,
    cliBin: process.env.STYLE_CODEBUDDY_BIN || 'codebuddy',
    hasLlm: isCli ? true : Boolean(baseUrl && model && (apiKey || provider === 'ollama')),
    hasEmbed: isCli ? false : Boolean(baseUrl && embedModel && (apiKey || provider === 'ollama')),
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function ensureStyleDirs() {
  for (const dir of [STYLE_DIR, CORPUS_DIR, INDEX_DIR, CACHE_DIR]) ensureDir(dir)
}

/** 缺配置时给一条可直接照做的报错，而不是 500 堆栈 */
function requireLlm() {
  const cfg = config()
  if (cfg.hasLlm) return cfg
  const err = new Error(
    [
      '缺少 LLM 配置，无法调用模型。',
      '',
      '在仓库根目录新建 .env（已被 .gitignore 忽略），写入其中一种：',
      '',
      '  # 方式一：DeepSeek（推荐，中文好且便宜）',
      '  STYLE_PROVIDER=deepseek',
      '  STYLE_API_KEY=sk-xxxx',
      '',
      '  # 方式二：通义千问',
      '  STYLE_PROVIDER=qwen',
      '  STYLE_API_KEY=sk-xxxx',
      '',
      '  # 方式三：本地 Ollama（无需 key）',
      '  STYLE_PROVIDER=ollama',
      '',
      '  # 方式四：本机 CodeBuddy CLI（用账号积分，无需 key；需先安装并登录）',
      '  STYLE_PROVIDER=codebuddy',
      '',
      '详见 .env.example 与 docs/style-pipeline.md',
    ].join('\n')
  )
  err.code = 'STYLE_NO_LLM_CONFIG'
  throw err
}

module.exports = {
  ROOT,
  POSTS_DIR,
  DRAFTS_DIR,
  STYLE_DIR,
  CORPUS_DIR,
  INDEX_DIR,
  CACHE_DIR,
  FILES,
  PRESETS,
  config,
  ensureDir,
  ensureStyleDirs,
  requireLlm,
  parseDotEnv,
}
