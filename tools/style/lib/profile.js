'use strict'

/**
 * style:profile —— 生成风格画像
 *
 * 两个产物：
 *   style/style-profile.json   统计指纹（可回归、可 diff）
 *   style/style-guide.md       给 LLM 看的"风格说明书"（也是给人看的）
 *
 * 说明书尽量用「模板 + 正反例」而不是抽象形容词，否则模型只会写出"AI 味十足"的空话。
 */

const fs = require('fs')
const { FILES, ensureStyleDirs, config } = require('./env')
const { computeMetrics } = require('./metrics')
const { chat } = require('./llm')

function readChunks() {
  if (!fs.existsSync(FILES.chunks)) {
    const err = new Error(`找不到 ${FILES.chunks}，请先运行：npm run style:ingest`)
    err.code = 'STYLE_NO_CORPUS'
    throw err
  }
  return fs
    .readFileSync(FILES.chunks, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

/** 分层抽样：按分类轮流取，保证覆盖面，而不是随机撞运气 */
function sampleChunks(chunks, size) {
  const byCategory = new Map()
  for (const chunk of chunks) {
    const key = chunk.category || '未分类'
    const list = byCategory.get(key) || []
    list.push(chunk)
    byCategory.set(key, list)
  }
  const buckets = [...byCategory.values()].map((list) => [...list])
  for (const bucket of buckets) {
    for (let i = bucket.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[bucket[i], bucket[j]] = [bucket[j], bucket[i]]
    }
  }
  const picked = []
  const seenSource = new Set()
  let round = 0
  while (picked.length < size && round < 50) {
    let added = false
    for (const bucket of buckets) {
      if (picked.length >= size) break
      // 优先取没出现过的文章，避免同一篇连出三段
      const idx = bucket.findIndex((c) => !seenSource.has(c.source))
      const chunk = idx >= 0 ? bucket.splice(idx, 1)[0] : bucket.pop()
      if (!chunk) continue
      seenSource.add(chunk.source)
      picked.push(chunk)
      added = true
    }
    if (!added) break
    round++
  }
  return picked
}

function metricsDigest(metrics) {
  return {
    sentence: metrics.sentence,
    paragraph: metrics.paragraph,
    punctuation: metrics.punctuation,
    pronouns: metrics.pronouns,
    question: metrics.question,
    bold: metrics.bold,
    numbers: metrics.numbers,
    catchphrases: metrics.catchphrases.slice(0, 20),
    ngrams: metrics.ngrams.slice(0, 20),
    openings: metrics.openings.slice(0, 10),
  }
}

function buildPrompt(metrics, samples, author) {
  const sampleBlock = samples
    .map((c, i) => `【样例${i + 1}｜${c.category || '未分类'}】\n${c.text}`)
    .join('\n\n')

  return [
    {
      role: 'system',
      content: [
        '你是中文写作风格分析专家。任务：根据给定作者的语料统计与原文样例，产出一份可直接给写作模型当 system prompt 的「风格说明书」。',
        '要求：',
        '1. 只描述可操作的写法，禁止使用"文字朴实""情感真挚""富有感染力"这类空话。',
        '2. 每条结论都必须能在样例里找到依据，必要时引用原句片段（不超过 20 字）。',
        '3. 输出中文 Markdown，严格使用下面 7 个二级标题，不要增删。',
        '4. 篇幅控制在 900-1400 字，信息密度优先，不要客套。',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        `作者：${author}`,
        '',
        '## 语料统计指纹（JSON）',
        '```json',
        JSON.stringify(metricsDigest(metrics), null, 2),
        '```',
        '',
        '## 原文样例',
        sampleBlock,
        '',
        '## 输出格式（必须严格照此 7 个二级标题）',
        '## 1. 总体调性',
        '## 2. 句式与节奏',
        '## 3. 开头 / 转折 / 收尾套路',
        '## 4. 高频词表（要保留的词与句式）',
        '## 5. 禁用词表（AI 腔、书面腔，务必避免）',
        '## 6. 正反例对照（5 组：口语原句 → 目标文风改写）',
        '## 7. 改写守则（给写作模型的 10 条以内硬约束）',
      ].join('\n'),
    },
  ]
}

/** 无 LLM 时的确定性版本：只把统计事实写清楚，不编造风格描述 */
function fallbackGuide(metrics, author) {
  const top = metrics.catchphrases.slice(0, 15).map((c) => `\`${c.phrase}\`(${c.count})`).join('、')
  const grams = metrics.ngrams.slice(0, 15).map((g) => `\`${g.gram}\`(${g.count})`).join('、')
  return `## 1. 总体调性

（未调用模型，本文件为统计版。配置 .env 后重跑 \`npm run style:profile\` 可生成完整说明书。）

作者：${author}；语料 ${metrics.corpus.chunks} 块 / ${metrics.corpus.chars} 字 / ${metrics.corpus.sources} 篇。

## 2. 句式与节奏

- 句长：均值 ${metrics.sentence.mean} 字，P50 ${metrics.sentence.p50} 字，P90 ${metrics.sentence.p90} 字
- 短句（≤15 字）占比 ${(metrics.sentence.shortRatio * 100).toFixed(1)}%，长句（≥60 字）占比 ${(metrics.sentence.longRatio * 100).toFixed(1)}%
- 段长：均值 ${metrics.paragraph.mean} 字，P50 ${metrics.paragraph.p50} 字
- 标点（每千字）：逗号 ${metrics.punctuation.comma}、句号 ${metrics.punctuation.period}、问号 ${metrics.punctuation.question}、感叹号 ${metrics.punctuation.exclaim}、冒号 ${metrics.punctuation.colon}
- 设问密度：每千句 ${metrics.question.per1000Sentences} 个问句
- 加粗：每千字 ${metrics.bold.per1000Chars} 个 \`**\`
- 人称：我 ${metrics.pronouns['我']}、你 ${metrics.pronouns['你']}、大家 ${metrics.pronouns['大家']}（每千字）

## 3. 开头 / 转折 / 收尾套路

- 开篇常用四字起手：${metrics.openings.map((o) => `\`${o.head}\`(${o.count})`).join('、') || '（样本不足）'}

## 4. 高频词表（要保留的词与句式）

- 口头禅：${top || '（无）'}
- 三字高频片段：${grams || '（无）'}

## 5. 禁用词表（AI 腔、书面腔，务必避免）

「首先/其次/最后」「综上所述」「在当今社会」「值得注意的是」「总而言之」「让我们一起」「赋能」「闭环」「抓手」「底层逻辑」

## 6. 正反例对照（5 组：口语原句 → 目标文风改写）

（需要模型生成，配置 .env 后重跑）

## 7. 改写守则（给写作模型的 10 条以内硬约束）

1. 不新增事实，不改变数字、金额、时间、公司与人名。
2. 句长均值压到 ${metrics.sentence.mean} 字附近，多用短句，长句拆开。
3. 每 3-5 段至少出现一次设问或反问。
4. 保留口头禅，但不要每段都用同一句。
5. 禁用第 5 节的 AI 腔词汇。
`
}

async function run({ options }) {
  ensureStyleDirs()
  const chunks = readChunks()
  const author = options.author || (chunks[0] && chunks[0].author) || '幽哥'
  const size = Number(options.samples) || 50

  console.log(`[profile] 语料 ${chunks.length} 块，作者=${author}`)
  const metrics = computeMetrics(chunks)
  fs.writeFileSync(FILES.profile, JSON.stringify(metrics, null, 2) + '\n')
  console.log(`[profile] 统计指纹 → ${FILES.profile}`)

  const cfg = config()
  const useLlm = !options['no-llm']

  if (!useLlm || !cfg.hasLlm) {
    fs.writeFileSync(FILES.guide, `# ${author} 文风说明书（统计版）\n\n${fallbackGuide(metrics, author)}`)
    console.log(`[profile] 风格说明书（统计版）→ ${FILES.guide}`)
    if (useLlm && !cfg.hasLlm) {
      console.log('[profile] 提示：未配置 LLM，只生成了统计版。要生成完整说明书请配置 .env 后重跑。')
    }
    return 0
  }

  const samples = sampleChunks(chunks, size)
  console.log(`[profile] 分层抽样 ${samples.length} 段，调用 ${cfg.provider}/${cfg.model} 蒸馏说明书…`)
  const body = await chat(buildPrompt(metrics, samples, author), {
    temperature: 0.4,
    maxTokens: 3000,
    label: 'style-guide',
  })

  const header = [
    `# ${author} 文风说明书`,
    '',
    `> 自动生成：${new Date().toISOString()}　模型：${cfg.provider}/${cfg.model}　抽样：${samples.length} 段`,
    `> 语料：${metrics.corpus.sources} 篇 / ${metrics.corpus.chunks} 块 / ${metrics.corpus.chars} 字`,
    '> 这份文件会被直接注入改写请求，可以手改；改完重跑 rewrite 立即生效。',
    '',
  ].join('\n')

  fs.writeFileSync(FILES.guide, `${header}${body.trim()}\n`)
  console.log(`[profile] 风格说明书 → ${FILES.guide}`)
  return 0
}

module.exports = { run, sampleChunks, buildPrompt }
