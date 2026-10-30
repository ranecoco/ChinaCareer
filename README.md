# ChinaCareer

## 本地开发

```bash
npm run server     # http://localhost:4000 ，按需重建
```

`tools/serve.js` 不会替你自动刷新：改完文章（Vim 里 `:w`、编辑器保存都算）**刷新浏览器**才重建，
一次约 1.5 秒；没有改动时刷新不会做任何事。改 `_config.yml` / 主题配置后重启一次。

想退回 hexo 原生行为（改文件即重建 + browsersync 自动刷新）：

```bash
npm i hexo-browsersync && npm run server:hexo
```

## ECharts 图表

文章里写 ```echarts 围栏，构建时渲染成图表：

- 直接写 option（JSON 或 JS 对象字面量）
- 或写 Markdown 表格，用 `type:` / `title:` / `subtitle:` / `colors:` / `radius:` / `center:` / `height:` 指令描述图表
- 多张图写在一个围栏里，用 `## 标签` 分节，`tabs: left` 生成左侧 tab 切换

编辑器：

```bash
npm run echart      # 浏览器里拖点、改数值，改动回写到源文件
```

## 引用其他文章

源文章用锚点圈一段，别的文章直接引用，不用复制：

```md
<!-- #region erp -->
要复用的内容
<!-- #endregion erp -->
```

```md
{% inc 21同事如何相处？/在职场中，该如何处理与同事之间的关系#erp %}
```

路径相对 `source/_posts`，扩展名可省。

## 文风改写（口述稿 → 本人文风）

把站内同一作者的文风建成可复用资产，再把口述/语音转写稿改写成接近他本人写法的文章草稿。

```bash
nvm use 20                        # 非交互 shell 里 node 可能不在 PATH

npm run style:ingest              # 扫 source/_posts 建语料（自动剥离引用、他人投稿、营销尾巴）
npm run style:profile             # 统计指纹 + 风格说明书（需 .env，见 .env.example）
npm run style:rewrite -- --in draft.txt --out source/_drafts/xxx.md
npm run style:eval -- --samples 10  # 盲测「像不像」
```

细节见 [`docs/style-pipeline.md`](docs/style-pipeline.md)：引用剥离规则、`>` 引用块处理、
风格说明书怎么手改、如何接语音转写。

# TODO

- [ ] add article play in post front matter

