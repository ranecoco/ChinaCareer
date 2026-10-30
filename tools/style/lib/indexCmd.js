'use strict'

/**
 * style:index —— 建/更新检索索引
 *
 * 配了 STYLE_EMBED_MODEL 走向量（增量：只补新块，内容 sha1 寻址）
 * 没配就写一个 bm25 标记，检索时用中文二元组匹配 —— 离线可用
 */

const { config } = require('./env')
const { buildIndex, indexStatus } = require('./retriever')

async function run({ options }) {
  const cfg = config()
  console.log(`[index] provider=${cfg.provider || '(未配置)'} embedModel=${cfg.embedModel || '(无 → BM25 降级)'}`)

  const started = Date.now()
  const result = await buildIndex({ force: Boolean(options.force) })

  if (result.type === 'bm25') {
    console.log(`[index] 未配置 embedding 模型，检索将使用 BM25（离线可用，${result.chunks} 块）`)
  } else {
    console.log(
      `[index] 向量索引就绪：${result.chunks} 块，本次新向量化 ${result.embedded} 块，维度 ${result.dim}`
    )
  }
  const status = indexStatus()
  console.log(`[index] 用时 ${Date.now() - started}ms　meta=${JSON.stringify(status)}`)
  return 0
}

async function ensureIndex() {
  const status = indexStatus()
  if (status.type && status.type !== 'none' && status.chunks) return status
  await buildIndex({})
  return indexStatus()
}

module.exports = { run, ensureIndex }
