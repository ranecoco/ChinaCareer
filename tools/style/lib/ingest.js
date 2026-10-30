'use strict'

/**
 * style:ingest —— 建语料库
 *
 * 输出：
 *   style/corpus/chunks.jsonl   段落块（下游唯一依赖的数据契约）
 *   style/corpus/stats.json     统计
 *   style/corpus/report.json    逐篇去留原因（可审计）
 */

const fs = require('fs')
const path = require('path')
const { POSTS_DIR, FILES, ensureStyleDirs } = require('./env')
const { buildCorpus } = require('./corpus')

function pct(a, b) {
  return b ? `${Math.round((a / b) * 100)}%` : '0%'
}

function printSummary(stats, report) {
  const lines = []
  lines.push('')
  lines.push('─'.repeat(52))
  lines.push(`扫描文章      ${stats.scanned}`)
  lines.push(`保留文章      ${stats.kept}   (${pct(stats.kept, stats.scanned)})`)
  lines.push(`剔除文章      ${stats.droppedCount}`)
  const reasons = Object.entries(report.rules).filter(([k]) => !/^B\d/.test(k))
  if (reasons.length) {
    for (const [reason, count] of reasons.sort((a, b) => b[1] - a[1])) {
      lines.push(`  · ${reason.padEnd(16)} ${count}`)
    }
  }
  lines.push(`引用块删除    ${stats.rules.B4 || 0} 块 / 续行 ${stats.continuationLinesTrimmed} 行`)
  lines.push(`产出段落块    ${stats.chunks}   平均 ${stats.avgChars} 字，中位 ${stats.medianChars} 字`)
  lines.push(`总字数        ${stats.totalChars}`)
  if (stats.duplicateChunks) lines.push(`去重丢弃块    ${stats.duplicateChunks}`)
  lines.push(`引用残留      ${stats.residualQuotes === 0 ? '无（断言通过）' : `${stats.residualQuotes} 处 ⚠`}`)
  lines.push('─'.repeat(52))
  console.log(lines.join('\n'))
}

function printDrops(report, count) {
  const byReason = new Map()
  for (const item of report.dropped) {
    const list = byReason.get(item.reason) || []
    if (list.length < count) list.push(item)
    byReason.set(item.reason, list)
  }
  for (const [reason, list] of byReason) {
    console.log(`\n[${reason}]`)
    for (const item of list) {
      console.log(`  - ${item.source}`)
      console.log(`    ${item.evidence}`)
    }
  }
}

async function run(argv) {
  const options = argv.options
  ensureStyleDirs()

  const author = options.author || '幽哥'
  console.log(`[ingest] 扫描 ${POSTS_DIR}  作者=${author}`)

  const started = Date.now()
  const { chunks, report, stats } = await buildCorpus({
    author,
    postsDir: POSTS_DIR,
    allowCoauthor: Boolean(options['allow-coauthor']),
    dropGuestWhole: Boolean(options['drop-guest-whole']),
    limit: options.limit ? Number(options.limit) : 0,
  })

  if (options['dry-run']) {
    console.log('\n=== 保留块抽样（5） ===')
    const step = Math.max(1, Math.floor(chunks.length / 5))
    for (let i = 0; i < chunks.length && i < step * 5; i += step) {
      const chunk = chunks[i]
      console.log(`\n--- ${chunk.source}  (${chunk.charCount} 字)`)
      console.log(chunk.text.slice(0, 180).replace(/\n/g, ' '))
    }
    console.log('\n=== 被删引用块首行（5） ===')
    for (const sample of (report.quoteSamples || []).slice(0, 5)) console.log(`  > ${sample}`)
    console.log('\n=== 剔除篇目（按原因各 2 篇） ===')
    printDrops(report, 2)
    console.log('\n[dry-run] 未写入任何文件')
    return 0
  }

  fs.writeFileSync(FILES.chunks, chunks.map((c) => JSON.stringify(c)).join('\n') + (chunks.length ? '\n' : ''))
  fs.writeFileSync(FILES.stats, JSON.stringify(stats, null, 2) + '\n')
  fs.writeFileSync(FILES.report, JSON.stringify(report, null, 2) + '\n')

  printSummary(stats, report)
  console.log(`[ingest] 用时 ${Date.now() - started}ms → ${path.relative(process.cwd(), FILES.chunks)}`)

  if (stats.residualQuotes > 0) {
    console.error('\n[ingest] 断言失败：清洗后仍存在行首 `>`，说明引用块续行处理有漏：')
    for (const item of report.residual.slice(0, 10)) console.error(`  - ${item.source}: ${item.line}`)
    return 1
  }
  return 0
}

module.exports = { run }
