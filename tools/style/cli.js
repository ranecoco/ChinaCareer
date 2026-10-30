#!/usr/bin/env node
'use strict'

/**
 * style 管线统一入口
 *
 *   node tools/style/cli.js ingest  [--author 幽哥] [--limit N] [--dry-run]
 *                                   [--allow-coauthor] [--keep-intro]
 *   node tools/style/cli.js profile [--merge] [--no-llm] [--samples N]
 *   node tools/style/cli.js rewrite --in draft.txt --out source/_drafts/x.md [--title T]
 *                                   [--tags a,b] [--categories c] [--force] [--no-critique]
 *   node tools/style/cli.js eval    [--samples N]
 *
 * 退出码：0 成功 / 1 运行错误 / 2 缺配置
 */

const COMMANDS = {
  ingest: () => require('./lib/ingest'),
  index: () => require('./lib/indexCmd'),
  profile: () => require('./lib/profile'),
  rewrite: () => require('./lib/rewrite'),
  eval: () => require('./lib/evaluate'),
}

function parseArgv(argv) {
  const args = argv.slice(2)
  const command = args[0]
  const options = {}
  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    const next = args[i + 1]
    if (next !== undefined && !next.startsWith('--')) {
      options[key] = next
      i++
    } else {
      options[key] = true
    }
  }
  return { command, options }
}

function usage() {
  console.log(`用法：node tools/style/cli.js <命令> [选项]

命令：
  ingest    扫描 source/_posts 建语料库（引用剥离 → style/corpus/）
  index     建/更新检索索引（有 embedding 模型走向量，否则 BM25）
  profile   生成风格指纹 + 风格说明书（style/style-profile.json, style/style-guide.md）
  rewrite   口述稿 → 目标文风成稿
  eval      盲测区分度评估

示例：
  npm run style:ingest -- --dry-run
  npm run style:profile
  npm run style:rewrite -- --in draft.txt --out source/_drafts/demo.md
  npm run style:eval -- --samples 10

环境变量（写在仓库根目录 .env）：
  STYLE_PROVIDER=deepseek|qwen|openai|ollama|siliconflow
  STYLE_API_KEY=sk-xxx
  STYLE_MODEL=deepseek-chat            （可选，覆盖预设）
  STYLE_EMBED_MODEL=text-embedding-v3  （可选，缺省则检索降级为 BM25）
  STYLE_CONCURRENCY=3
`)
}

async function main() {
  const { command, options } = parseArgv(process.argv)

  if (!command || command === 'help' || options.help) {
    usage()
    return 0
  }
  const loader = COMMANDS[command]
  if (!loader) {
    console.error(`未知命令：${command}\n`)
    usage()
    return 1
  }

  const mod = loader()
  return mod.run({ options })
}

main()
  .then((code) => {
    process.exitCode = code || 0
  })
  .catch((err) => {
    if (err.code === 'STYLE_NO_LLM_CONFIG' || err.code === 'STYLE_NO_EMBED' || err.code === 'STYLE_NO_CLI') {
      console.error(`\n[配置缺失]\n${err.message}\n`)
      process.exitCode = 2
      return
    }
    console.error(`\n[失败] ${err.message}`)
    if (process.env.STYLE_DEBUG) console.error(err.stack)
    process.exitCode = 1
  })
