'use strict'

/**
 * 引用块剥离器。
 *
 * 事实依据（已抽样核实）：`>` 引用块里是群友提问、他人公众号原文、书籍摘录、
 * 链接清单、营销话术——**没有一段是幽哥本人写的**。所以无条件整块删除，不做占比判断。
 *
 * 三个易错点：
 *   1. 只删 `^>` 行会留下半截句子：块内存在"两空格缩进续行"（知乎抓取段尤其明显）。
 *   2. `>` 单独一行（`^>\s*$`）是块内分段符，不是块结束。
 *   3. 空行才是块边界；空行之后的普通段落必须保留。
 */

const QUOTE_START = /^\s{0,3}>/
/** 块内惰性续行：两空格以上缩进开头的行（微信/知乎抓取被拍平的正文） */
const LAZY_CONTINUATION = /^\s{2,}\S/
/** 只含 > 的行：块内分段符 */
const QUOTE_BLANK = /^\s{0,3}>\s*$/

/**
 * @param {string[]} lines
 * @returns {{lines: string[], stats: {blocks:number, lines:number, continuationLines:number, samples:string[]}}}
 */
function stripBlockquotes(lines) {
  const out = []
  const stats = { blocks: 0, lines: 0, continuationLines: 0, samples: [] }
  let i = 0

  while (i < lines.length) {
    if (!QUOTE_START.test(lines[i])) {
      out.push(lines[i])
      i++
      continue
    }

    // 进入引用块
    stats.blocks++
    if (stats.samples.length < 8) {
      const first = lines[i].replace(QUOTE_START, '').replace(/\*+/g, '').trim()
      stats.samples.push(first.slice(0, 40))
    }

    let j = i
    let removed = 0
    while (j < lines.length) {
      const line = lines[j]
      if (QUOTE_START.test(line)) {
        j++
        removed++
        continue
      }
      if (line.trim() === '') break // 空行 = 块结束
      if (LAZY_CONTINUATION.test(line)) {
        j++
        removed++
        stats.continuationLines++
        continue
      }
      break // 顶格普通段落 = 块结束（例如引用之后的幽哥评述）
    }

    stats.lines += removed
    i = j

    // 吞掉块与后续内容之间的空行，避免留下三个以上连续空行
    while (i < lines.length && lines[i].trim() === '' && out.length && out[out.length - 1].trim() === '') {
      i++
    }
  }

  return { lines: out, stats }
}

/** 清洗后的文本里若仍有行首 `>`，说明续行/嵌套处理有漏 */
function findResidualQuotes(text) {
  return String(text)
    .split(/\r?\n/)
    .map((line, idx) => ({ line, no: idx + 1 }))
    .filter(({ line }) => QUOTE_START.test(line))
}

/** 只判断单行是否是引用行（供 corpus 里逐行兜底） */
function isQuoteLine(line) {
  return QUOTE_START.test(line) || QUOTE_BLANK.test(line)
}

module.exports = { stripBlockquotes, findResidualQuotes, isQuoteLine, QUOTE_START }
