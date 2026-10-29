#!/usr/bin/env node
'use strict'

/**
 * 按需重建的开发服务器：不主动生成，**刷新页面时才重建**。
 *
 * 和 `hexo server` 的区别：
 *   hexo server  一有文件变动就立刻重建（还带 browsersync 自动刷浏览器）
 *   这个          文件变动只打个「脏」标记，页面请求进来时才 _generate()
 *
 * 为什么这么绕：hexo 的 `source.process()` 是全量扫描，这个站 1400+ 篇文章要 37 秒；
 * 而真正的 `_generate({cache:true})` 只要 1.5 秒。所以变更检测交给 box 的监听器
 * （chokidar，单文件几十毫秒），重建只做 generate 那一步。
 *
 * 用法：
 *   node tools/serve.js            # 默认 4000
 *   PORT=4100 node tools/serve.js
 *
 * 改 `_config.yml` / `_config.butterfly.yml` / 主题配置，重启一次更稳妥。
 */

const http = require('http')
const path = require('path')
const mime = require('mime')
const Hexo = require('hexo')

const PORT = Number(process.env.PORT) || 4000

const hexo = new Hexo(process.cwd(), { silent: false })

let dirty = false
let building = null

function markDirty(where) {
  dirty = true
  if (process.env.SERVE_DEBUG) console.log(`[serve] dirty (${where})`)
}

/** 只跑 generate，前面 process 的活监听器已经做完了 */
function rebuild() {
  if (building) return building

  building = (async () => {
    dirty = false
    const started = Date.now()

    await hexo._generate({ cache: true })

    console.log(`[serve] rebuilt in ${Date.now() - started}ms`)
  })().finally(() => {
    building = null
  })

  return building
}

const typeOf = (file) =>
  (typeof mime.getType === 'function' ? mime.getType(file) : mime.lookup(file)) || 'application/octet-stream'

/** 页面请求才值得重建；css/js/图片直接走路由 */
function wantsPage(req) {
  const url = req.url.split('?')[0]
  return url.endsWith('/') || /\.html?$/i.test(url) || !path.extname(url)
}

async function send(req, res) {
  const requestUrl = req.url.split('?')[0]

  let url = hexo.route.format(decodeURIComponent(requestUrl))
  let stream = hexo.route.get(url)

  if (!stream) {
    const asHtml = hexo.route.get(`${url}.html`)
    if (asHtml) {
      url = `${url}.html`
      stream = asHtml
    } else if (hexo.route.get(`${url}/index.html`)) {
      res.writeHead(301, { Location: `/${url}/` })
      return res.end('Redirecting')
    }
  }

  if (!stream) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    return res.end(`404 ${requestUrl}`)
  }

  res.setHeader('Content-Type', typeOf(url))
  res.setHeader('Cache-Control', 'no-store')
  if (stream.modified) res.setHeader('Last-Modified', new Date(stream.modified).toUTCString())

  if (req.method === 'HEAD') {
    res.end()
    return
  }

  stream.pipe(res)
}

async function handle(req, res) {
  try {
    if (wantsPage(req)) {
      if (building) await building
      else if (dirty) await rebuild()
    }

    await send(req, res)
  } catch (err) {
    console.error('[serve]', err)
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(`serve.js: ${err.message}`)
  }
}

async function main() {
  console.log('[serve] starting hexo…')

  await hexo.init()
  await hexo.load()

  // 只挂监听器：文件变了由 box 自己处理那一个文件，这里只记一个标记
  await Promise.all([hexo.source.watch(), hexo.theme.watch()])
  hexo.source.on('processAfter', () => markDirty('source'))
  hexo.theme.on('processAfter', () => markDirty('theme'))

  const server = http.createServer(handle)

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[serve] port ${PORT} is busy — try: PORT=${PORT + 1} node tools/serve.js`)
      process.exit(1)
    }
    throw err
  })

  server.listen(PORT, () => {
    const mode = process.env.SERVE_DEBUG ? 'dirty 会打印出来' : '安静模式'
    console.log(`[serve] ready · http://localhost:${PORT}/  （${mode}）`)
    console.log('[serve] 改完文件刷新页面即可，页面不会被自动刷新')
  })
}

main().catch((err) => {
  console.error('[serve] failed:', err.message)
  process.exit(1)
})
