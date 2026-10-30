'use strict'

/**
 * style:eval —— 「像不像」的量化
 *
 * 做法（盲测区分度）：
 *   1. 从语料里取 N 段原作当"标准答案"
 *   2. 让模型把原作反写成"平实口述稿"（去掉风格，只留信息）
 *   3. 跑完整改写管线，得到"改写稿"
 *   4. 把【原作 / 改写稿 / 无关段落】三者打乱，让裁判盲判哪段是原作者写的
 *   5. 裁判选中改写稿的比例 = 误判率。**越接近 1/3，说明越难分辨，即越像**
 */

const fs = require('fs')
const { FILES, config } = require('./env')
const { chat } = require('./llm')
const { readChunks } = require('./retriever')
const { computeMetrics, compare } = require('./metrics')
const { pipeline, loadGuide } = require('./rewrite')

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickSamples(chunks, count) {
  const bySource = new Map()
  for (const chunk of chunks) {
    if (chunk.charCount < 300) continue
    if (!bySource.has(chunk.source)) bySource.set(chunk.source, chunk)
  }
  return shuffle([...bySource.values()]).slice(0, count)
}

function avgDrift(rows) {
  const map = new Map()
  for (const row of rows) {
    for (const item of row) {
      const cur = map.get(item.name) || { name: item.name, target: item.target, deltas: [] }
      cur.deltas.push(item.delta)
      map.set(item.name, cur)
    }
  }
  return [...map.values()].map((item) => ({
    name: item.name,
    target: item.target,
    avgDelta: Math.round((item.deltas.reduce((a, b) => a + b, 0) / item.deltas.length) * 100) / 100,
  }))
}

async function despokenize(chunk) {
  const out = await chat(
    [
      {
        role: 'system',
        content:
          '把下面这篇文章改写成一篇"平实、没有个人风格"的口述稿：只保留信息点与事实，去掉所有个人化表达、口头禅、设问和情绪。像一个人对着录音笔随口讲一遍。不要用小标题和列表，只输出正文。',
      },
      { role: 'user', content: chunk.text },
    ],
    { temperature: 0.7, maxTokens: 2000, label: 'eval-despokenize' }
  )
  return out.replace(/^```[a-z]*\n?|```$/g, '').trim()
}

async function judge(original, candidate, decoy, author) {
  const items = shuffle([
    { key: 'A', text: original.text },
    { key: 'B', text: candidate },
    { key: 'C', text: decoy.text },
  ])
  const prompt = [
    `作者是「${author}」。下面三段文字，其中只有一段是${author}本人写的，另外两段是别人模仿或无关内容。`,
    '请判断哪一段最可能是原作者本人写的。只输出一个字母（A/B/C），不要解释。',
    '',
    ...items.map((item) => `${item.key}：\n${item.text.slice(0, 900)}\n`),
  ].join('\n')

  const answer = await chat(
    [
      { role: 'system', content: '你是中文文风鉴定专家，只输出一个字母。' },
      { role: 'user', content: prompt },
    ],
    { temperature: 0, maxTokens: 10, label: 'eval-judge' }
  )

  const letter = (answer.match(/[ABC]/) || [''])[0]
  const picked = items.find((item) => item.key === letter)
  return { letter, picked: picked ? picked.text : '', items }
}

async function run({ options }) {
  const cfg = config()
  if (!cfg.hasLlm) {
    const err = new Error('缺少 LLM 配置，无法评估。请先创建 .env')
    err.code = 'STYLE_NO_LLM_CONFIG'
    throw err
  }

  const chunks = readChunks()
  const author = options.author || (chunks[0] && chunks[0].author) || '幽哥'
  const count = Number(options.samples) || 10
  const guide = loadGuide(options['style-guide'] !== true ? options['style-guide'] : undefined)
  const profile = JSON.parse(fs.readFileSync(FILES.profile, 'utf8'))

  const samples = pickSamples(chunks, count)
  console.log(`[eval] 取 ${samples.length} 篇原作做盲测，模型 ${cfg.provider}/${cfg.model}`)

  const rows = []
  const details = []
  let judgePickedOriginal = 0
  let judgePickedCandidate = 0

  for (let i = 0; i < samples.length; i++) {
    const original = samples[i]
    const decoyPool = chunks.filter((c) => c.source !== original.source && Math.abs(c.charCount - original.charCount) < 150)
    const decoy = decoyPool[Math.floor(Math.random() * decoyPool.length)] || chunks[0]

    console.log(`\n[eval] (${i + 1}/${samples.length}) ${original.source}`)
    const transcript = await despokenize(original)
    const { draft } = await pipeline(transcript, { guide, author, k: 3, critique: false })
    const metrics = computeMetrics([{ text: draft, source: 'candidate' }])
    rows.push(compare(profile, metrics))

    const result = await judge(original, draft, decoy, author)
    const isOriginal = result.picked === original.text
    const isCandidate = result.picked === draft
    if (isOriginal) judgePickedOriginal++
    if (isCandidate) judgePickedCandidate++

    details.push({
      source: original.source,
      pickedOriginal: isOriginal,
      pickedCandidate: isCandidate,
      letter: result.letter,
      draftChars: draft.length,
    })
    console.log(
      `[eval]   裁判选了 ${result.letter}：${isOriginal ? '原作' : isCandidate ? '改写稿 ✅' : '无关段落'}`
    )
  }

  const drift = avgDrift(rows)
  const total = details.length || 1
  const confusion = judgePickedCandidate / total
  const baseline = 1 / 3

  const lines = [
    `# 文风模仿评估报告`,
    '',
    `> 生成时间：${new Date().toISOString()}　模型：${cfg.provider}/${cfg.model}　样本：${details.length} 篇`,
    '',
    '## 结论',
    '',
    `- 裁判把**改写稿误认为原作**的比例：**${(confusion * 100).toFixed(0)}%**（随机盲猜基线 33%）`,
    `- 裁判正确认出原作的次数：${judgePickedOriginal}/${details.length}`,
    `- 解读：这个比例越接近 33% 越好（说明裁判分不出来）；明显低于 33% 说明改写稿"AI 味"太重。`,
    '',
    '## 逐样本结果',
    '',
    '| 原文 | 裁判选择 | 改写稿字数 |',
    '| --- | --- | --- |',
    ...details.map(
      (d) => `| ${d.source} | ${d.pickedOriginal ? '原作' : d.pickedCandidate ? '改写稿' : '无关段落'} | ${d.draftChars} |`
    ),
    '',
    '## 指标漂移（改写稿 vs 语料均值）',
    '',
    '| 指标 | 语料 | 改写稿偏差 |',
    '| --- | --- | --- |',
    ...drift.map((row) => `| ${row.name} | ${row.target} | ${row.avgDelta > 0 ? '+' : ''}${row.avgDelta} |`),
    '',
    '## 怎么用它迭代',
    '',
    '1. 偏差大的指标，优先改 `style/style-guide.md` 的第 2 节（句式与节奏）。',
    '2. 误判率过低时，先看逐样本表里"裁判选了无关段落"的条目——往往是改写稿信息密度骤降。',
    '3. 手里有真实口述稿时，用 `style:rewrite` 跑几篇人工对比，比盲测更直观。',
    '',
  ]

  fs.writeFileSync(FILES.evalReport, lines.join('\n'))
  console.log(`\n[eval] 误判率 ${(confusion * 100).toFixed(0)}%（基线 33%）→ ${FILES.evalReport}`)
  return 0
}

module.exports = { run }
