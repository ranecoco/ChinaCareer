'use strict'

/**
 * 风格样例检索（RAG 的"手感"部分）
 *
 * 两条路：
 *   vector —— 配了 STYLE_EMBED_MODEL 就用 embedding + cosine（语义相近）
 *   bm25   —— 没配就退化为中文二元组 BM25（字面相近），**离线也能跑**
 *
 * 向量以 Float32Array + base64 存储，比 JSON 数字数组小一个数量级。
 */

const fs = require('fs')
const path = require('path')
const { FILES, INDEX_DIR, config } = require('./env')
const { embed } = require('./llm')

let bm25Cache = null
let vectorCache = null

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

function loadMeta() {
  try {
    return JSON.parse(fs.readFileSync(FILES.indexMeta, 'utf8'))
  } catch {
    return { type: 'none' }
  }
}

function saveMeta(meta) {
  fs.mkdirSync(INDEX_DIR, { recursive: true })
  fs.writeFileSync(FILES.indexMeta, JSON.stringify(meta, null, 2) + '\n')
}

function toBase64(vector) {
  const arr = Float32Array.from(vector)
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength).toString('base64')
}

function fromBase64(b64) {
  const buf = Buffer.from(b64, 'base64')
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4)
}

function loadVectors() {
  if (vectorCache) return vectorCache
  const map = new Map()
  if (!fs.existsSync(FILES.vectors)) {
    vectorCache = map
    return map
  }
  const text = fs.readFileSync(FILES.vectors, 'utf8')
  for (const line of text.split('\n')) {
    if (!line.trim()) continue
    try {
      const row = JSON.parse(line)
      map.set(row.id, fromBase64(row.v))
    } catch {
      /* 损坏行跳过，下次重建会补 */
    }
  }
  vectorCache = map
  return map
}

function saveVectors(map) {
  fs.mkdirSync(INDEX_DIR, { recursive: true })
  const lines = []
  for (const [id, vec] of map) lines.push(JSON.stringify({ id, v: toBase64(vec) }))
  fs.writeFileSync(FILES.vectors, lines.join('\n') + '\n')
}

/** 中文检索用二元组足够：不需要分词器，也不会把"试用期"切碎 */
function tokenize(text) {
  const tokens = []
  const clean = String(text).toLowerCase()
  const words = clean.match(/[a-z0-9]+/g) || []
  tokens.push(...words)
  const han = clean.replace(/[^\u4e00-\u9fa5]+/g, ' ')
  for (const seg of han.split(/\s+/)) {
    if (!seg) continue
    if (seg.length === 1) tokens.push(seg)
    for (let i = 0; i + 1 < seg.length; i++) tokens.push(seg.slice(i, i + 2))
  }
  return tokens
}

function buildBm25(chunks) {
  const docs = []
  const df = new Map()
  let totalLen = 0
  for (const chunk of chunks) {
    const tokens = tokenize(chunk.text)
    const tf = new Map()
    for (const token of tokens) tf.set(token, (tf.get(token) || 0) + 1)
    for (const token of tf.keys()) df.set(token, (df.get(token) || 0) + 1)
    totalLen += tokens.length
    docs.push({ chunk, tf, len: tokens.length })
  }
  return { docs, df, avgLen: totalLen / Math.max(docs.length, 1), n: docs.length }
}

function bm25Search(index, queryText, k) {
  const k1 = 1.2
  const b = 0.75
  const qTokens = [...new Set(tokenize(queryText))]
  const scored = []

  for (const doc of index.docs) {
    let score = 0
    for (const token of qTokens) {
      const f = doc.tf.get(token)
      if (!f) continue
      const idf = Math.log(1 + (index.n - (index.df.get(token) || 0) + 0.5) / ((index.df.get(token) || 0) + 0.5))
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + b * (doc.len / index.avgLen))))
    }
    if (score > 0) scored.push({ chunk: doc.chunk, score })
  }
  scored.sort((a, b2) => b2.score - a.score)
  return scored.slice(0, k)
}

function cosine(a, b) {
  let dot = 0
  let na = 0
  let nb = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (!na || !nb) return 0
  return dot / Math.sqrt(na * nb)
}

/**
 * 建/更新索引。内容 sha1 做 id，所以天然增量：只补新块。
 */
async function buildIndex({ force = false } = {}) {
  const chunks = readChunks()
  const cfg = config()

  if (!cfg.hasEmbed) {
    saveMeta({ type: 'bm25', builtAt: new Date().toISOString(), chunks: chunks.length })
    bm25Cache = null
    if (fs.existsSync(FILES.vectors)) fs.unlinkSync(FILES.vectors)
    return { type: 'bm25', chunks: chunks.length, embedded: 0 }
  }

  const meta = loadMeta()
  const reusable = !force && meta.type === 'vector' && meta.model === cfg.embedModel && meta.dim
  const map = reusable ? loadVectors() : new Map()
  if (!reusable) vectorCache = new Map()

  const missing = chunks.filter((c) => !map.has(c.id))
  let embedded = 0
  if (missing.length) {
    for (let i = 0; i < missing.length; i += 16) {
      const batch = missing.slice(i, i + 16)
      const vectors = await embed(batch.map((c) => c.text))
      batch.forEach((chunk, idx) => map.set(chunk.id, Float32Array.from(vectors[idx])))
      embedded += batch.length
      if (embedded % 160 === 0 || embedded === missing.length) {
        console.log(`[index] 已向量化 ${embedded}/${missing.length}`)
      }
    }
  }
  saveVectors(map)
  vectorCache = map
  const dim = map.size ? map.values().next().value.length : 0
  saveMeta({ type: 'vector', model: cfg.embedModel, dim, chunks: chunks.length, builtAt: new Date().toISOString() })
  return { type: 'vector', chunks: chunks.length, embedded, dim }
}

/**
 * 检索最相近的原作者段落
 * @param {string} text
 * @param {number} k
 * @returns {Promise<Array<{chunk:object, score:number}>>}
 */
async function query(text, k = 5) {
  const chunks = readChunks()
  const meta = loadMeta()

  if (meta.type === 'vector') {
    const map = loadVectors()
    if (map.size) {
      try {
        const [vector] = await embed([text])
        const q = Float32Array.from(vector)
        const scored = []
        for (const chunk of chunks) {
          const vec = map.get(chunk.id)
          if (!vec) continue
          scored.push({ chunk, score: cosine(q, vec) })
        }
        scored.sort((a, b) => b.score - a.score)
        return scored.slice(0, k)
      } catch (err) {
        console.warn(`[index] embedding 失败，降级 BM25：${err.message}`)
      }
    }
  }

  if (!bm25Cache) bm25Cache = buildBm25(chunks)
  return bm25Search(bm25Cache, text, k)
}

function indexStatus() {
  const meta = loadMeta()
  return { ...meta, vectors: fs.existsSync(FILES.vectors) ? fs.statSync(FILES.vectors).size : 0 }
}

module.exports = { buildIndex, query, indexStatus, readChunks, tokenize, buildBm25, bm25Search }
