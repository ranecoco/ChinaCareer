'use strict'

/**
 * 语料抽取：扫描 md → 作者判定 → 引用剥离 → 段落清洗 → 分块去重。
 *
 * 规则编号与 docs/style-pipeline.md 一一对应：
 *   A1 他人署名  A2 合著降级  A3 正文为他人投稿  A4 条文/清单/索引页
 *   A5 列表主导  A6 清洗后过短
 *   B1 inc 包含  B2 post_link  B3 群友对话列表  B4 `>` 引用块  B5 整段引文
 *   B6 他人署名行  B7 营销导流  B8 微信排版噪音  B9 🍭 标记  B10 代码/图片/HTML/表格/标题  B11 过短碎片
 *   B12 整段招聘 JD（幽哥常在文中复述岗位描述）
 */

const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const { parse, authorNames } = require('./frontmatter')
const { stripBlockquotes, findResidualQuotes } = require('./blockquote')

const SKIP_DIRS = new Set(['node_modules', 'public', '.git', '.github', '.deploy_git'])

/** 强营销信号：出现在任何位置都删 */
const MARKETING_STRONG = [
  /阅读原文/,
  /赞赏/,
  /打赏/,
  /扫码/,
  /二维码/,
  /加微/,
  /youge2016/i,
  /微信号\s*[:：]?/,
  /微信公众号/,
  /投稿须知/,
  /欢迎.{0,8}投稿/,
  /点击蓝字/,
  /长按.{0,10}(二维码|识别)/,
  /星球/,
  /入群|进群|QQ群|微信群/,
  /\[Read more\]/i,
  /^Reads\s+\d+/i,
  /<iframe/i,
  /点星标|星标.{0,4}置顶/,
  /跳槽课程|副业课程|课程.{0,6}(优惠|折|报名|恢复原价)/,
  /领取.{0,6}(资料|模板)/,
  /续费/,
  /加我/,
  /优惠券/,
  /一对一.{0,6}(咨询|指导|辅导)/,
  /付费咨询/,
]

/** 招聘 JD 特征词：幽哥常在文中整段引用岗位描述，那不是他的文风 */
const JD_CUES = [/岗位职责/, /任职要求/, /任职资格/, /福利待遇/, /薪资待遇/, /五险一金/, /工作地点/, /上班地址/]

/** 弱营销信号：只在文末区域删（避免误删正文里讨论"课程/优惠"的段落） */
const MARKETING_WEAK = [/课程/, /优惠/, /折扣/, /报名/, /资料包/, /私信/]

const TAIL_CUE =
  /^(\[Read more|Reads\s+\d+|!\[赞赏二维码\]|<iframe|如需跳槽课程|如下扫码|可加微|点击.{0,8}阅读原文|点星标|欢迎给我们投稿|投稿须知|想加入知识星球|知识星球|关注幽哥|长按.{0,10}二维码|赞赏即|本文作者|作者[：:]|—{3,})/

const GUEST_LINE = /^\s{0,3}(本文作者|关于作者|作者|文\s*[|｜]|来源)\s*[:：|｜]\s*(.+)$/
const GUEST_NAME_BAD = /[是在有都就还把被让给和与的了着过我们他们大家]/ // 名字里出现这些词多半是句子

const LIST_ITEM = /^\s{0,3}([-*+]|\d+[.、)])\s+\S/
const LIST_CONTINUATION = /^\s{2,}\S/

const SEPARATOR = /^[-—*=_]{3,}\s*$/
const HEADING = /^#{1,6}\s+/
const TABLE_ROW = /^\s*\|/

const QUESTION_END = /[？?]/
const SENTENCE_END = /[。！？!?…；;]/

function sha1(text) {
  return crypto.createHash('sha1').update(text).digest('hex')
}

async function walkMarkdown(dir, out = []) {
  let entries = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkMarkdown(full, out)
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

/** 把 `**山西小王**` / `【群友小晶】**` 之类的写法归一成名字 */
function normalizeGuestName(raw) {
  return String(raw)
    .replace(/\*+/g, '')
    .replace(/[【】\[\]（）()“”"'’‘]/g, '')
    .split(/[，,、。.！!？?；;：:\s\t]/)[0]
    .trim()
}

/**
 * 找文内他人署名行。
 * 判据（据抽样核实）：顶格、行长 < 40、名字 ≤ 9 字、名字里没有谓语类词。
 */
function findGuestSignature(bodyLines, target) {
  const limit = Math.min(bodyLines.length, 400)
  for (let i = 0; i < limit; i++) {
    const line = bodyLines[i]
    if (!line || line.length > 40) continue
    if (/^\s/.test(line)) continue // 顶格才算署名行，排除列表/引用/对话缩进
    const m = line.match(GUEST_LINE)
    if (!m) continue
    const name = normalizeGuestName(m[2])
    if (!name || name.length > 9) continue
    if (GUEST_NAME_BAD.test(name)) continue
    if (name.includes(target) || target.includes(name)) continue // 幽哥本人，白名单
    return { index: i, name, line: line.trim() }
  }
  return null
}

/** A4：条文 / 抓取页 / 索引页 / 问答库 / 群聊日志 */
function detectNonAuthorPage(body) {
  const norm = body.replace(/\r/g, '')

  const statute = (norm.match(/第[一二三四五六七八九十百零〇\d]+条/g) || []).length
  if (statute >= 100) return { reason: 'statute', evidence: `法条「第X条」出现 ${statute} 次` }

  if (/^你的位置\s*[:：]/m.test(norm) || (/目\s*　*\s*录/.test(norm) && /gov\.cn|\.gov\b/i.test(norm))) {
    return { reason: 'gov-page', evidence: '含政府网站抓取残留（你的位置/目录/导航）' }
  }

  const lines = norm.split('\n').filter((l) => l.trim())
  const postLinks = lines.filter((l) => /\{%\s*post_link/.test(l)).length
  if (postLinks >= 20 && postLinks / Math.max(lines.length, 1) >= 0.3) {
    return {
      reason: 'index-page',
      evidence: `post_link 行 ${postLinks}/${lines.length}（${Math.round((postLinks / lines.length) * 100)}%）`,
    }
  }

  const numbered = (norm.match(/^#{2,3}\s*\d+[.、]/gm) || []).length
  if (numbered >= 20 && /【思路】|Hint:/.test(norm)) {
    return { reason: 'qa-bank', evidence: `问答库结构（编号小标题 ${numbered} 个 + 思路/范例）` }
  }

  const stamps = (norm.match(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}\s*$/gm) || []).length
  if (stamps >= 5) return { reason: 'chat-log', evidence: `群聊日志（时间戳行 ${stamps} 个）` }

  return null
}

function marketingHit(line) {
  for (const re of MARKETING_STRONG) if (re.test(line)) return true
  return false
}

/**
 * 文末导流截断：只在正文 75% 之后找第一个导流信号，再回退到最近的空行/分隔线。
 * 75% 约束是硬要求——否则会误截正文里正常提到"阅读原文"的段落。
 */
function truncateTail(bodyLines) {
  const startAt = Math.floor(bodyLines.length * 0.75)
  for (let i = startAt; i < bodyLines.length; i++) {
    if (!TAIL_CUE.test(bodyLines[i].trim())) continue
    let cut = i
    while (cut > startAt && bodyLines[cut - 1].trim() !== '' && !SEPARATOR.test(bodyLines[cut - 1])) cut--
    let end = bodyLines.length
    // 顺手把尾部残留的纯营销行一起去掉
    for (let j = bodyLines.length - 1; j >= cut; j--) {
      const line = bodyLines[j].trim()
      if (!line || marketingHit(line) || MARKETING_WEAK.some((re) => re.test(line))) {
        end = j
        continue
      }
      break
    }
    return { lines: bodyLines.slice(0, cut), cutFrom: cut + 1, removedTo: end }
  }
  return { lines: bodyLines, cutFrom: null }
}

/**
 * 段落级清洗（B 类规则）
 * @returns {{paragraphs: string[], flags: Set<string>, counters: Record<string, number>, quoteStats: object}}
 */
function cleanToParagraphs(bodyLines, target) {
  const flags = new Set()
  const counters = { blockquoteBlocks: 0, blockquoteLines: 0, continuationLines: 0, listItems: 0, lines: 0 }
  const samples = []

  // B4：先整块剥引用（必须在逐行处理之前，才能把续行一起带走）
  const { lines: noQuote, stats } = stripBlockquotes(bodyLines)
  if (stats.blocks) {
    flags.add('B4')
    counters.blockquoteBlocks = stats.blocks
    counters.blockquoteLines = stats.lines
    counters.continuationLines = stats.continuationLines
    samples.push(...stats.samples)
  }

  // B10：代码围栏整块去掉
  const kept = []
  let inFence = false
  for (const line of noQuote) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      flags.add('B10')
      continue
    }
    if (inFence) continue
    kept.push(line)
  }

  // 逐行过滤
  const out = []
  let skippingList = false
  for (const line of kept) {
    const trimmed = line.trim()

    if (!trimmed) {
      skippingList = false
      out.push('')
      continue
    }

    if (LIST_ITEM.test(line)) {
      flags.add('B3')
      counters.listItems++
      skippingList = true
      continue
    }
    if (skippingList && LIST_CONTINUATION.test(line)) {
      counters.listItems++
      continue
    }
    skippingList = false

    if (/^\{%/.test(trimmed)) {
      flags.add(/post_link/.test(trimmed) ? 'B2' : 'B1')
      continue
    }
    if (SEPARATOR.test(trimmed)) {
      flags.add('B8')
      continue
    }
    if (HEADING.test(trimmed)) {
      flags.add('B10')
      continue
    }
    if (TABLE_ROW.test(trimmed)) {
      flags.add('B10')
      continue
    }
    if (/^!\[.*\]\(.*\)\s*$/.test(trimmed) || /^<[a-zA-Z!/]/.test(trimmed) || /^https?:\/\//.test(trimmed)) {
      flags.add('B10')
      continue
    }
    if (trimmed.includes('🍭')) {
      flags.add('B9')
      continue
    }
    if (/你的位置\s*[:：]|^原创\s|^首发公众号|^公众号\s*[|｜]/.test(trimmed)) {
      flags.add('B8')
      continue
    }
    if (marketingHit(trimmed)) {
      flags.add('B7')
      continue
    }
    const guest = trimmed.match(/^\s*(本文作者|关于作者|作者)\s*[:：]/)
    if (guest) {
      const name = normalizeGuestName(trimmed.replace(/^\s*(本文作者|关于作者|作者)\s*[:：]\s*/, ''))
      if (!name.includes(target)) {
        flags.add('B6')
        continue
      }
    }
    out.push(trimmed)
    counters.lines++
  }

  // 段落重组
  const paragraphs = []
  let buf = []
  const flush = () => {
    if (!buf.length) return
    const text = buf
      .join(' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 行内图片（微信表情/二维码）
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 行内链接只留文字
      .replace(/\{%[\s\S]*?%\}/g, '') // 行内 Hexo 标签
      .replace(/<[^>]+>/g, '')
      .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    buf = []
    if (!text) return

    if (text.length < 40 && !SENTENCE_END.test(text)) {
      flags.add('B11')
      return
    }
    if (text.length > 60 && /^[“"].*[”"]$/.test(text) && (text.match(/[“"]/g) || []).length <= 2) {
      flags.add('B5')
      return
    }
    if (marketingHit(text) || MARKETING_WEAK.some((re) => re.test(text) && text.length < 80)) {
      flags.add('B7')
      return
    }
    // B12：整段引用的招聘 JD（岗位职责/任职要求/福利待遇…），不是作者文风
    if (JD_CUES.filter((re) => re.test(text)).length >= 2) {
      flags.add('B12')
      return
    }
    paragraphs.push(text)
  }

  for (const line of out) {
    if (!line) flush()
    else buf.push(line)
  }
  flush()

  return { paragraphs, flags, counters, quoteSamples: samples }
}

/** 段落 → 200~500 字块（不切断段落） */
function chunkParagraphs(paragraphs, meta, minChars = 200, maxChars = 500) {
  const chunks = []
  let buf = []
  let len = 0

  const flush = () => {
    if (!buf.length) return
    const text = buf.join('\n\n')
    if (text.length >= minChars || paragraphs.length === 1) {
      chunks.push({ ...meta, text, charCount: text.length })
    }
    buf = []
    len = 0
  }

  for (const p of paragraphs) {
    if (len && len + p.length > maxChars) flush()
    buf.push(p)
    len += p.length
    if (len >= maxChars) flush()
  }
  flush()

  // 单篇文章剩余不足 200 字但仍属正文，合并进最后一块或单独成块
  if (!chunks.length && paragraphs.length) {
    const text = paragraphs.join('\n\n')
    if (text.length >= minChars / 2) chunks.push({ ...meta, text, charCount: text.length })
  }
  return chunks
}

/**
 * 处理一篇文章
 * @returns {{status:'kept'|'dropped', reason?:string, evidence?:string, chunks:any[], flags:string[], counters:object, quoteSamples:string[]}}
 */
function processArticle(file, raw, opts) {
  const { author, allowCoauthor } = opts
  const rel = path.relative(opts.postsDir, file).split(path.sep).join('/')
  const { data, body } = parse(raw)

  // A1：作者字段命中目标作者。
  // 缺 copyright_author 的老文章视为本人（这是他的博客），但要打标记，
  // 且仍需通过 A4 的非散文页判定——法条/问答库/索引页照样剔除。
  const names = authorNames(data)
  const assumedAuthor = names.length === 0
  if (!assumedAuthor && !names.some((n) => n.includes(author))) {
    return { status: 'dropped', reason: 'other-author', evidence: `copyright_author: ${names.join(', ')}`, chunks: [] }
  }
  // A2：合著降级（无法逐句归属）
  if (names.length > 1 && !allowCoauthor) {
    return { status: 'dropped', reason: 'coauthor', evidence: `合著：${names.join(' / ')}`, chunks: [] }
  }

  // A4：整篇不是作者原创（条文 / 抓取页 / 索引页 / 问答库 / 群聊日志）
  const nonAuthor = detectNonAuthorPage(body)
  if (nonAuthor) {
    return { status: 'dropped', reason: nonAuthor.reason, evidence: nonAuthor.evidence, chunks: [] }
  }

  let bodyLines = body.split(/\r?\n/)

  // A5：列表主导（群友问答罗列）
  const nonEmpty = bodyLines.filter((l) => l.trim())
  const listLines = nonEmpty.filter((l) => LIST_ITEM.test(l)).length
  const listRatio = listLines / Math.max(nonEmpty.length, 1)
  if (listRatio > 0.3) {
    return {
      status: 'dropped',
      reason: 'list-dominant',
      evidence: `列表行 ${listLines}/${nonEmpty.length}（${Math.round(listRatio * 100)}%）`,
      chunks: [],
    }
  }

  // A3：文内他人署名。靠前的（≤25 行）判整篇转载；靠后的只截断，保留幽哥导语
  const guest = findGuestSignature(bodyLines, author)
  let guestNote = ''
  if (guest) {
    if (guest.index <= 25) {
      return {
        status: 'dropped',
        reason: 'guest-author',
        evidence: `第 ${guest.index + 1} 行「${guest.line.slice(0, 30)}」`,
        chunks: [],
      }
    }
    if (opts.dropGuestWhole) {
      return {
        status: 'dropped',
        reason: 'guest-author',
        evidence: `第 ${guest.index + 1} 行「${guest.line.slice(0, 30)}」`,
        chunks: [],
      }
    }
    guestNote = `第 ${guest.index + 1} 行起为他人正文（${guest.name}），已截断`
    bodyLines = bodyLines.slice(0, guest.index)
  }

  // 文末导流截断
  const tail = truncateTail(bodyLines)
  const hadTail = tail.cutFrom !== null
  bodyLines = tail.lines

  const { paragraphs, flags, counters, quoteSamples } = cleanToParagraphs(bodyLines, author)
  if (hadTail) flags.add('B7')
  if (guestNote) flags.add('A3-truncated')
  if (assumedAuthor) flags.add('A1-assumed')

  const cleanedChars = paragraphs.reduce((sum, p) => sum + p.length, 0)
  // A6：清洗后过短 —— 说明这篇主要是引用/他人内容
  if (cleanedChars < 600) {
    return {
      status: 'dropped',
      reason: 'too-short',
      evidence: `清洗后仅剩 ${cleanedChars} 字${guestNote ? `；${guestNote}` : ''}`,
      chunks: [],
    }
  }

  const meta = {
    source: rel,
    title: String(data.title || path.basename(file, '.md')).trim(),
    category: String(Array.isArray(data.categories) ? data.categories[0] || '' : data.categories || '').trim(),
    author: names.join(' / ') || author,
  }
  const chunks = chunkParagraphs(paragraphs, meta)
  for (const chunk of chunks) {
    chunk.id = sha1(chunk.text).slice(0, 12)
    chunk.flags = [...flags].sort()
  }

  return {
    status: 'kept',
    chunks,
    flags: [...flags].sort(),
    counters,
    quoteSamples: quoteSamples.slice(0, 3),
    evidence: guestNote || undefined,
  }
}

/**
 * 建库主入口
 * @param {{author?:string, postsDir:string, allowCoauthor?:boolean, keepIntro?:boolean, limit?:number}} opts
 */
async function buildCorpus(opts) {
  const author = opts.author || '幽哥'
  const files = await walkMarkdown(opts.postsDir)
  files.sort()
  const target = opts.limit ? files.slice(0, opts.limit) : files

  const report = {
    author,
    scanned: 0,
    kept: 0,
    dropped: [],
    rules: {},
    quoteTrimmed: 0,
    duplicateChunks: 0,
    totalChars: 0,
  }
  const seen = new Set()
  const chunks = []
  const quoteSamples = []

  for (const file of target) {
    let raw = ''
    try {
      raw = await fs.readFile(file, 'utf8')
    } catch (err) {
      report.dropped.push({ source: path.relative(opts.postsDir, file), reason: 'read-error', evidence: err.message })
      continue
    }
    report.scanned++
    const result = processArticle(file, raw, { ...opts, author, postsDir: opts.postsDir })
    const rel = path.relative(opts.postsDir, file).split(path.sep).join('/')

    if (result.status === 'dropped') {
      report.dropped.push({ source: rel, reason: result.reason, evidence: result.evidence })
      report.rules[result.reason] = (report.rules[result.reason] || 0) + 1
      continue
    }

    report.kept++
    report.rules['B4'] = (report.rules['B4'] || 0) + (result.counters?.blockquoteBlocks || 0)
    report.quoteTrimmed += result.counters?.continuationLines || 0
    if (quoteSamples.length < 12 && result.quoteSamples) quoteSamples.push(...result.quoteSamples.slice(0, 1))

    for (const chunk of result.chunks) {
      if (seen.has(chunk.id)) {
        report.duplicateChunks++
        continue
      }
      seen.add(chunk.id)
      chunks.push(chunk)
      report.totalChars += chunk.charCount
    }
  }

  // 引用零残留断言
  const residual = []
  for (const chunk of chunks) {
    const hit = findResidualQuotes(chunk.text)
    if (hit.length) residual.push({ source: chunk.source, line: hit[0].line.slice(0, 40) })
  }

  const sizes = chunks.map((c) => c.charCount).sort((a, b) => a - b)
  const stats = {
    author,
    scanned: report.scanned,
    kept: report.kept,
    droppedCount: report.dropped.length,
    chunks: chunks.length,
    totalChars: report.totalChars,
    avgChars: chunks.length ? Math.round(report.totalChars / chunks.length) : 0,
    medianChars: sizes.length ? sizes[Math.floor(sizes.length / 2)] : 0,
    duplicateChunks: report.duplicateChunks,
    continuationLinesTrimmed: report.quoteTrimmed,
    rules: report.rules,
    residualQuotes: residual.length,
  }

  return { chunks, report: { ...report, residual, quoteSamples }, stats }
}

module.exports = {
  buildCorpus,
  processArticle,
  cleanToParagraphs,
  chunkParagraphs,
  detectNonAuthorPage,
  findGuestSignature,
  truncateTail,
  walkMarkdown,
  sha1,
}
