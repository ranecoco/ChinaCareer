'use strict'

/**
 * style:rewrite —— 口述稿 / 语音转写稿 → 目标文风成稿
 *
 * 四阶段（事实零新增）：
 *   1. 清洗口述稿（去口水词、补断句，纯本地、免费）
 *   2. 抽信息点（JSON，作为"事实清单"，后面每一步都拿它对照）
 *   3. 风格改写（风格说明书 + 检索到的原文样例 + 上一块结尾）
 *   4. 自检与修订（数字保真、AI 腔黑名单、句长节奏偏差）
 */

const fs = require('fs')
const path = require('path')
const { FILES, config } = require('./env')
const { chat } = require('./llm')
const { query } = require('./retriever')
const { ensureIndex } = require('./indexCmd')
const { computeMetrics, compare } = require('./metrics')

const AI_SLOP = [
  '首先',
  '其次',
  '综上所述',
  '总而言之',
  '总的来说',
  '值得一提的是',
  '值得注意的是',
  '在当今社会',
  '随着社会的发展',
  '不可否认',
  '毋庸置疑',
  '让我们',
  '赋能',
  '闭环',
  '抓手',
  '底层逻辑',
  '多维度',
  '全方位',
  '深度剖析',
  '不难发现',
]

const FILLERS = /(嗯+|呃+|额+|啊(?:，|,)?(?=[\u4e00-\u9fa5]{0,2}，)|那个，|这个，|就是说，|然后呢，|对吧，|你知道吧，|怎么说呢，)/g

/** 阶段 1：本地清洗。只做确定性的事，不花钱 */
function cleanTranscript(raw) {
  let text = String(raw)
    .replace(/\r/g, '')
    .replace(FILLERS, '')
    .replace(/([，。！？；：])\1+/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .replace(/。{2,}/g, '。')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  // 长句补断句：口述稿常见一逗到底，超过 80 字仍无句末标点的段落按逗号切开
  text = text
    .split('\n')
    .map((line) => {
      if (line.length <= 80 || /[。！？]$/.test(line)) return line
      const parts = line.split('，')
      const out = []
      let buf = ''
      for (const part of parts) {
        buf += (buf ? '，' : '') + part
        if (buf.length >= 40) {
          out.push(`${buf}。`)
          buf = ''
        }
      }
      if (buf) out.push(buf)
      return out.join('')
    })
    .join('\n')

  return text
}

function loadGuide(customPath) {
  const file = customPath || FILES.guide
  if (!fs.existsSync(file)) {
    const err = new Error(`找不到风格说明书 ${file}，请先运行：npm run style:profile`)
    err.code = 'STYLE_NO_GUIDE'
    throw err
  }
  return fs.readFileSync(file, 'utf8')
}

function loadProfile() {
  try {
    return JSON.parse(fs.readFileSync(FILES.profile, 'utf8'))
  } catch {
    return null
  }
}

function splitBlocks(text, size = 800) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const blocks = []
  let buf = []
  let len = 0
  for (const p of paragraphs) {
    if (len && len + p.length > size) {
      blocks.push(buf.join('\n\n'))
      buf = []
      len = 0
    }
    buf.push(p)
    len += p.length
  }
  if (buf.length) blocks.push(buf.join('\n\n'))
  return blocks.length ? blocks : [text]
}

/** 阶段 2：抽信息点。用 JSON 模式，失败时退回原始文本（不阻塞主流程） */
async function extractOutline(transcript) {
  try {
    const content = await chat(
      [
        {
          role: 'system',
          content:
            '你是信息抽取器。从口述稿中抽取全部信息点，不评价、不总结、不美化。只输出 JSON。',
        },
        {
          role: 'user',
          content: `口述稿：\n\n${transcript}\n\n输出 JSON：{"topic":"一句话主题","points":[{"id":1,"claim":"信息点，保留原文中的数字/金额/时间/人名"}],"numbers":["原文出现的所有数字与金额"],"persons":["出现的公司/人名/岗位"]}`,
        },
      ],
      { json: true, temperature: 0.1, maxTokens: 2000, label: 'outline' }
    )
    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed.points)) throw new Error('结构不符')
    return parsed
  } catch (err) {
    console.warn(`[rewrite] 信息点抽取失败（${err.message}），退回逐段改写`)
    return { topic: '', points: [], numbers: extractNumbers(transcript), persons: [] }
  }
}

function extractNumbers(text) {
  return [...new Set((String(text).match(/\d+(?:\.\d+)?\s*(?:万|亿|千|百|元|块|k|K|w|W|%|年|月|天|岁)?/g) || []).map((s) => s.trim()))].filter(
    (s) => s.length <= 12
  )
}

function styleSystemPrompt(guide, author) {
  return [
    `你在模仿「${author}」的文风改写文章。下面是他本人的风格说明书：`,
    '',
    guide,
    '',
    '硬约束：',
    '1. 不新增任何事实、案例、数字、人名、公司名。信息点清单里没有的，一律不写。',
    '2. 原文的数字、金额、时间、公司名、岗位名必须原样保留，不得换算或省略。',
    '3. 只输出正文，不要标题、不要"以下是改写"之类的说明，不要 Markdown 代码块包裹。',
    '4. 不要使用说明书第 5 节列出的禁用词。',
  ].join('\n')
}

/** 阶段 3：分块风格改写，带上一块结尾做衔接 */
async function rewriteBlocks(transcript, { guide, author, outline, examples, k }) {
  const blocks = splitBlocks(transcript)
  const results = []
  let tail = ''

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const related = examples?.length ? examples : await query(block, k)
    const exampleBlock = related
      .map((item, idx) => `【原文样例${idx + 1}｜${item.chunk.category || '未分类'}】\n${item.chunk.text.slice(0, 500)}`)
      .join('\n\n')

    const points = outline.points?.length
      ? outline.points.map((p) => `- ${p.claim}`).join('\n')
      : '（抽取失败，按原文信息点如实用词）'

    const user = [
      `这是第 ${i + 1}/${blocks.length} 段口述稿，请按目标文风改写：`,
      '',
      block,
      '',
      '【必须覆盖的信息点】',
      points,
      '',
      outline.numbers?.length ? `【必须原样保留的数字】${outline.numbers.join('、')}` : '',
      '',
      '【同一作者的真实段落，学它的句式和语气，不要抄内容】',
      exampleBlock,
      '',
      tail ? `【上一段结尾（衔接用，不要重复）】\n${tail}` : '',
      '',
      '直接输出改写后的正文段落。',
    ]
      .filter(Boolean)
      .join('\n')

    const out = await chat(
      [
        { role: 'system', content: styleSystemPrompt(guide, author) },
        { role: 'user', content: user },
      ],
      { temperature: 0.9, maxTokens: 2500, label: `rewrite-block-${i + 1}` }
    )

    const cleaned = out.replace(/^```[a-z]*\n?|```$/g, '').trim()
    results.push(cleaned)
    tail = cleaned.slice(-120)
    console.log(`[rewrite] 第 ${i + 1}/${blocks.length} 段完成（${cleaned.length} 字）`)
  }

  return results.join('\n\n')
}

/** 阶段 4：自检（本地指标 + 可选模型修订） */
function localCritique(draft, { sourceText, profile }) {
  const issues = []

  const missing = extractNumbers(sourceText).filter((num) => !draft.includes(num))
  if (missing.length) issues.push(`数字/金额可能丢失：${missing.slice(0, 10).join('、')}`)

  const slopHits = AI_SLOP.filter((word) => draft.includes(word))
  if (slopHits.length) issues.push(`AI 腔词汇：${slopHits.join('、')}`)

  if (draft.includes('——')) issues.push('出现破折号 ——（该作者少用，建议改口语化断句）')

  let drift = []
  if (profile) {
    const draftMetrics = computeMetrics([{ text: draft, source: 'draft' }])
    drift = compare(profile, draftMetrics)
    const sentenceDrift = Math.abs((drift.find((r) => r.name === '句长均值') || {}).delta || 0)
    if (sentenceDrift > 10) issues.push(`句长均值偏离 ${sentenceDrift.toFixed(1)} 字（目标 ${profile.sentence.mean}）`)
  }

  return { issues, drift }
}

async function revise(draft, issues, guide, author) {
  const out = await chat(
    [
      { role: 'system', content: styleSystemPrompt(guide, author) },
      {
        role: 'user',
        content: [
          '下面是改写稿，请做**最小改动**的修订，只解决列出的问题，不要重写：',
          '',
          draft,
          '',
          '【必须解决的问题】',
          issues.map((s) => `- ${s}`).join('\n'),
          '',
          '只输出修订后的正文。',
        ].join('\n'),
      },
    ],
    { temperature: 0.5, maxTokens: 3000, label: 'revise' }
  )
  return out.replace(/^```[a-z]*\n?|```$/g, '').trim()
}

function buildMarkdown(body, options) {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  const tags = options.tags || 'Career'
  const categories = options.categories || '未分类'
  const title = options.title || '未命名草稿'
  const front = [
    '---',
    `title: ${title}`,
    `date: ${stamp}`,
    `tags: [${tags}]`,
    `categories: [ ${categories} ]`,
    `copyright_author: ${options.author || '幽哥'}`,
    '---',
    '',
  ].join('\n')
  return `${front}${body.trim()}\n`
}

function readInput(options) {
  if (options.in && options.in !== true) return fs.readFileSync(path.resolve(options.in), 'utf8')
  if (options.stdin) return fs.readFileSync(0, 'utf8')
  return null
}

/**
 * 完整管线（rewrite 与 eval 共用）
 * @param {string} transcript 已清洗的口述稿
 */
async function pipeline(transcript, { guide, author, k = 5, critique = true, profile = null, examples = null } = {}) {
  const outline = await extractOutline(transcript)
  console.log(`[rewrite] ② 信息点 ${outline.points?.length || 0} 条，数字 ${outline.numbers?.length || 0} 个`)

  let draft = await rewriteBlocks(transcript, { guide, author, outline, examples, k })
  console.log(`[rewrite] ③ 风格改写完成：${draft.length} 字`)

  let issues = []
  let drift = []
  if (critique) {
    const result = localCritique(draft, { sourceText: transcript, profile })
    issues = result.issues
    drift = result.drift
    if (issues.length) {
      console.log('[rewrite] ④ 自检发现问题：')
      for (const issue of issues) console.log(`   - ${issue}`)
      draft = await revise(draft, issues, guide, author)
      console.log('[rewrite] ④ 已修订')
    } else {
      console.log('[rewrite] ④ 自检通过（数字保真 / 无 AI 腔 / 节奏接近）')
    }
  }

  return { draft, outline, issues, drift }
}

async function run({ options }) {
  const cfg = config()
  if (!cfg.hasLlm) {
    const err = new Error('缺少 LLM 配置，无法改写。请先创建 .env（见 .env.example）')
    err.code = 'STYLE_NO_LLM_CONFIG'
    throw err
  }

  const raw = readInput(options)
  if (raw === null) {
    console.error('用法：npm run style:rewrite -- --in draft.txt [--out source/_drafts/x.md]')
    return 1
  }

  const author = options.author || '幽哥'
  const guide = loadGuide(options['style-guide'] !== true ? options['style-guide'] : undefined)
  const profile = loadProfile()
  const k = Number(options.k) || 5

  // 检索索引按需创建（无 embedding 模型时自动走 BM25）
  await ensureIndex()

  console.log(`[rewrite] 输入 ${raw.length} 字，模型 ${cfg.provider}/${cfg.model}`)

  const transcript = cleanTranscript(raw)
  console.log(`[rewrite] ① 清洗完成：${raw.length} → ${transcript.length} 字`)

  const { draft, drift } = await pipeline(transcript, {
    guide,
    author,
    k,
    critique: !options['no-critique'],
    profile,
  })

  if (drift.length && options.verbose) {
    console.table(drift.map((r) => ({ 指标: r.name, 语料: r.target, 改写稿: r.actual, 偏差: r.delta })))
  }

  const markdown = buildMarkdown(draft, { ...options, author })

  if (options.out && options.out !== true) {
    const target = path.resolve(options.out)
    if (fs.existsSync(target) && !options.force) {
      console.error(`\n[rewrite] 目标已存在，拒绝覆盖：${target}\n            确认要覆盖请加 --force`)
      return 1
    }
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, markdown)
    console.log(`\n[rewrite] 已写入 ${path.relative(process.cwd(), target)}`)
  } else {
    process.stdout.write(`\n${markdown}`)
  }

  return 0
}

module.exports = { run, pipeline, loadGuide, cleanTranscript, splitBlocks, extractOutline, localCritique, AI_SLOP }
