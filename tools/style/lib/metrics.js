'use strict'

/**
 * 统计指纹：把"文风"变成一堆可以回归测试的数字。
 *
 * 为什么不能只靠 embedding：向量只能表达"写了什么"，
 * 句长节奏、口头禅、设问密度、加粗习惯这些"怎么写"，必须单独量化。
 */

/** 作者的高频口头禅种子词（可自行扩充；命中数会进 top 列表） */
const SEED_PHRASES = [
  '其实',
  '总之',
  '所以',
  '但是',
  '因为',
  '当然',
  '大家',
  '如下',
  '比如',
  '举个例子',
  '显然',
  '很明显',
  '记住',
  '一句话',
  '我当年',
  '我幽哥',
  '实际上',
  '反过来',
  '否则',
  '说到底',
  '说白了',
  '也就是说',
  '无非',
  '大多',
  '基本',
  '至少',
  '不要小瞧',
  '见怪不怪',
  '你会发现',
  '你有没有',
  '你看',
  '你想',
  '要知道',
  '关键是',
  '否则的话',
  '这就是',
  '而不是',
  '不如',
  '千万别',
  '一定要',
  '果断',
  '本质上',
  '换句话说',
  '简而言之',
]

const PUNCT = {
  comma: /，/g,
  period: /。/g,
  question: /[？?]/g,
  exclaim: /[！!]/g,
  colon: /：/g,
  semicolon: /；/g,
  pause: /、/g,
  dash: /—{2}|–{2}/g,
  ellipsis: /…{2}|\.{3,}/g,
  quote: /[“”"「」]/g,
  paren: /[（）()]/g,
}

const PRONOUNS = ['我们', '你们', '大家', '我', '你', '他', '她', '咱']

function splitSentences(text) {
  return String(text)
    .split(/(?<=[。！？!?…；;])|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function quantile(sorted, q) {
  if (!sorted.length) return 0
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base]
}

function per1000(count, chars) {
  return chars ? Math.round((count / chars) * 1000 * 10) / 10 : 0
}

/** 中文 3-gram 频次（粗略挖口头禅，不需要分词） */
function topNGrams(texts, n = 3, limit = 30) {
  const counter = new Map()
  const stop = /^[的了着过是在有不没这和与就都也很更最我你他她它们个上下中]/
  for (const text of texts) {
    const clean = text.replace(/[^\u4e00-\u9fa5]/g, ' ')
    for (const seg of clean.split(/\s+/)) {
      if (seg.length < n) continue
      for (let i = 0; i + n <= seg.length; i++) {
        const gram = seg.slice(i, i + n)
        if (stop.test(gram)) continue
        counter.set(gram, (counter.get(gram) || 0) + 1)
      }
    }
  }
  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([gram, count]) => ({ gram, count }))
}

/**
 * @param {Array<{text:string, source:string}>} chunks
 */
function computeMetrics(chunks) {
  const texts = chunks.map((c) => c.text)
  const joined = texts.join('\n')
  const chars = joined.length

  const sentenceLengths = []
  let questionSentences = 0
  for (const text of texts) {
    for (const s of splitSentences(text)) {
      sentenceLengths.push(s.length)
      if (/[？?]$/.test(s)) questionSentences++
    }
  }
  sentenceLengths.sort((a, b) => a - b)

  const paragraphLengths = []
  for (const text of texts) {
    for (const p of text.split(/\n{2,}/)) {
      const t = p.trim()
      if (t) paragraphLengths.push(t.length)
    }
  }
  paragraphLengths.sort((a, b) => a - b)

  const punctuation = {}
  for (const [key, re] of Object.entries(PUNCT)) {
    punctuation[key] = per1000((joined.match(re) || []).length, chars)
  }

  const pronouns = {}
  for (const word of PRONOUNS) {
    pronouns[word] = per1000(
      (joined.match(new RegExp(word, 'g')) || []).length,
      chars
    )
  }

  const catchphrases = SEED_PHRASES.map((phrase) => ({
    phrase,
    count: (joined.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length,
  }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)

  // 每篇文章的首句（用来看开篇套路）
  const firstSentenceBySource = new Map()
  for (const chunk of chunks) {
    if (firstSentenceBySource.has(chunk.source)) continue
    const first = splitSentences(chunk.text)[0]
    if (first) firstSentenceBySource.set(chunk.source, first.slice(0, 40))
  }
  const openingCounts = new Map()
  for (const first of firstSentenceBySource.values()) {
    const head = first.slice(0, 4)
    openingCounts.set(head, (openingCounts.get(head) || 0) + 1)
  }

  const boldPairs = ((joined.match(/\*\*/g) || []).length / 2) | 0
  const digits = (joined.match(/\d+/g) || []).length
  const money = (joined.match(/\d+\s*(万|块|元|k|K|w)/g) || []).length

  const totalSentences = sentenceLengths.length || 1
  const shortSentences = sentenceLengths.filter((n) => n <= 15).length
  const longSentences = sentenceLengths.filter((n) => n >= 60).length

  return {
    generatedAt: new Date().toISOString(),
    corpus: {
      chunks: chunks.length,
      chars,
      sources: new Set(chunks.map((c) => c.source)).size,
    },
    sentence: {
      count: sentenceLengths.length,
      mean: Math.round((sentenceLengths.reduce((a, b) => a + b, 0) / totalSentences) * 10) / 10,
      p50: Math.round(quantile(sentenceLengths, 0.5) * 10) / 10,
      p90: Math.round(quantile(sentenceLengths, 0.9) * 10) / 10,
      shortRatio: Math.round((shortSentences / totalSentences) * 1000) / 1000,
      longRatio: Math.round((longSentences / totalSentences) * 1000) / 1000,
    },
    paragraph: {
      mean: Math.round(paragraphLengths.reduce((a, b) => a + b, 0) / (paragraphLengths.length || 1)),
      p50: Math.round(quantile(paragraphLengths, 0.5)),
      p90: Math.round(quantile(paragraphLengths, 0.9)),
    },
    punctuation,
    pronouns,
    question: {
      sentences: questionSentences,
      per1000Sentences: Math.round((questionSentences / totalSentences) * 1000 * 10) / 10,
    },
    bold: { pairs: boldPairs, per1000Chars: per1000(boldPairs * 2, chars) },
    numbers: { tokens: digits, per1000Chars: per1000(digits, chars), moneyExamples: money },
    catchphrases: catchphrases.slice(0, 25),
    ngrams: topNGrams(texts, 3, 30),
    openings: [...openingCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([head, count]) => ({ head, count })),
    samples: [...firstSentenceBySource.entries()].slice(0, 8).map(([source, first]) => ({ source, first })),
  }
}

/** 指纹漂移表：改写稿 vs 语料 */
function compare(target, actual) {
  const rows = []
  const push = (name, a, b, unit = '') => rows.push({ name, target: a, actual: b, delta: round(b - a), unit })
  const round = (n) => Math.round(n * 100) / 100

  push('句长均值', target.sentence.mean, actual.sentence.mean, '字')
  push('句长 P90', target.sentence.p90, actual.sentence.p90, '字')
  push('短句占比', target.sentence.shortRatio, actual.sentence.shortRatio, '')
  push('段长均值', target.paragraph.mean, actual.paragraph.mean, '字')
  push('设问/千句', target.question.per1000Sentences, actual.question.per1000Sentences, '')
  push('加粗/千字', target.bold.per1000Chars, actual.bold.per1000Chars, '')
  push('数字/千字', target.numbers.per1000Chars, actual.numbers.per1000Chars, '')
  push('我/千字', target.pronouns['我'], actual.pronouns['我'], '')
  push('你/千字', target.pronouns['你'], actual.pronouns['你'], '')
  push('大家/千字', target.pronouns['大家'], actual.pronouns['大家'], '')
  push('逗号/千字', target.punctuation.comma, actual.punctuation.comma, '')
  push('感叹号/千字', target.punctuation.exclaim, actual.punctuation.exclaim, '')
  return rows
}

module.exports = { computeMetrics, compare, splitSentences, topNGrams, SEED_PHRASES }
