'use strict'

/**
 * 极简 front matter 解析器（不引 js-yaml）。
 *
 * 这个站的 front matter 形态很杂，必须容忍：
 *   - 文件开头有空行 / BOM
 *   - 字段被注释掉：`# date: Sep 5, 2019, 1:29 PM`
 *   - 数组：`tags: [Career, 八神]`、`categories: [ 10. 面试技巧 ]`
 *   - 值里带中文逗号、冒号、引号
 *   - 值缺失：`copyright_url:`（空值）
 */

function unquote(value) {
  const v = value.trim()
  if (!v) return ''
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  return v
}

/** `[a, b]` → ['a','b']；否则返回字符串 */
function parseValue(raw) {
  const v = unquote(raw)
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim()
    if (!inner) return []
    return inner
      .split(',')
      .map((s) => unquote(s))
      .filter(Boolean)
  }
  return v
}

/**
 * @param {string} raw 文件全文
 * @returns {{data: Record<string, any>, body: string, startLine: number, hasFm: boolean}}
 */
function parse(raw) {
  const text = String(raw).replace(/^\uFEFF/, '')
  const lines = text.split(/\r?\n/)

  let i = 0
  while (i < lines.length && !lines[i].trim()) i++
  if (i >= lines.length || lines[i].trim() !== '---') {
    return { data: {}, body: text, startLine: 0, hasFm: false }
  }

  const data = {}
  let j = i + 1
  for (; j < lines.length; j++) {
    const line = lines[j]
    if (line.trim() === '---') break
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue // 被注释掉的字段一律忽略
    const colon = line.indexOf(':')
    if (colon <= 0) continue
    const key = line.slice(0, colon).trim()
    if (!/^[\w\u4e00-\u9fa5-]+$/.test(key)) continue
    data[key] = parseValue(line.slice(colon + 1))
  }

  const body = lines.slice(j + 1).join('\n')
  return { data, body, startLine: j + 1, hasFm: true }
}

/** 作者字段 → 名字数组 */
function authorNames(data) {
  const raw = data.copyright_author
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : String(raw).split(/[,，、/|｜]/)
  return list
    .map((s) => String(s).replace(/\*+/g, '').trim())
    .filter(Boolean)
}

module.exports = { parse, authorNames, parseValue }
