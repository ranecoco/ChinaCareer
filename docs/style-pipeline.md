# 文风管线（tools/style）

把站内某一作者的文风"向量化"成可复用资产，再把口述稿 / 语音转写稿改写成接近他本人写法的成稿。

## 为什么不是"存一条向量"

单一 embedding 只能表达**写了什么**，表达不了**怎么写**。所以拆成三层，改写时同时注入：

| 层 | 产物 | 作用 |
| --- | --- | --- |
| 统计指纹 | `style/style-profile.json` | 句长/段长/标点/人称/设问/加粗/口头禅，可 diff、可回归 |
| 语义索引 | `style/index/`（向量或 BM25） | 每次改写注入 3-5 段**主题相近的原作者段落**当手感样例 |
| 风格说明书 | `style/style-guide.md` | 给人看也直接喂模型：句式模板、开头/收尾套路、禁用词、正反例 |

三层里**收益最高的是说明书**，且可以手改；改完重跑 `style:rewrite` 立即生效。

## 命令

```bash
nvm use 20          # 非交互 shell 里 node 可能不在 PATH

npm run style:ingest                    # 建语料（引用剥离）
npm run style:ingest -- --dry-run       # 只看清洗效果，不写文件
npm run style:index                     # 建索引（无 embedding key 自动走 BM25）
npm run style:profile                   # 统计指纹 + 风格说明书
npm run style:profile -- --no-llm       # 只出统计版，不调模型
npm run style:rewrite -- --in draft.txt --out source/_drafts/x.md
npm run style:eval -- --samples 10      # 盲测区分度
```

常用参数：

| 命令 | 参数 | 说明 |
| --- | --- | --- |
| ingest | `--author 幽哥` | 换作者（站内还有八神 37 篇、小苏 8 篇等） |
| ingest | `--allow-coauthor` | 收合著文章（`幽哥, 萱萱` 这类，默认剔除） |
| ingest | `--drop-guest-whole` | 他人投稿整篇丢弃（默认只截断正文、保留幽哥导语） |
| ingest | `--limit 50` | 只处理前 N 篇，调试用 |
| rewrite | `--title/--tags/--categories` | 写进草稿 front matter |
| rewrite | `--force` | 目标文件已存在时允许覆盖 |
| rewrite | `--no-critique` | 跳过自检与二次修订（省钱） |
| rewrite | `--k 3` | 每次注入的原文样例数（默认 5） |
| rewrite | `--verbose` | 打印指标漂移表 |

## 引用剥离规则

语料里混着大量**不是幽哥写的**内容。实测规模如下（扫描 1100 个 md）：

### A. 整篇级剔除

| 编号 | 规则 | 实测 |
| --- | --- | --- |
| A1 | `copyright_author` 不含目标作者 | 146 篇（别人的文章） |
| A2 | 合著（`幽哥, 萱萱`）默认剔除，无法逐句归属 | 19 篇 |
| A3 | 文内他人署名（`作者：` / `本文作者：` / `关于作者：` / `文 \|`） | 靠前（≤25 行）整篇丢；靠后**只截断**，保留幽哥导语 |
| A4 | 条文 / 抓取页 / 索引页 / 问答库 / 群聊日志 | 见下 |
| A5 | 列表行占比 >30%（群友问答罗列） | 32 篇 |
| A6 | 清洗后正文 <600 字（说明主要是引用） | 37 篇 |

A4 的判据（不依赖文件名）：

- `第X条` ≥100 次 → 法条（劳动合同法 109 次）
- `你的位置:[首页]` 或 `目录` + `gov.cn` → 政府网站抓取页
- `{% post_link %}` ≥20 行且占非空行 >30% → 索引页（`Main.md`）
- 编号小标题 ≥20 + `【思路】`/`Hint:` → 问答库（`中文面试100问`）
- `2026-10-29 15:47` 形式的时间戳 ≥5 行 → 群聊日志（`Knowledge.md`）

### B. 段落级剔除

| 编号 | 规则 | 备注 |
| --- | --- | --- |
| B1 | `{% inc %}` 行 | 会**复制其他文章的原文**，不删会导致跨篇重复 |
| B2 | `{% post_link %}` 行 | 链接不是正文 |
| B3 | 列表项及其缩进续行 | 多为群友微信对话（`- 上午11:23` + 缩进气泡） |
| B4 | **`>` 引用块（整块）** | 关键规则，见下节 |
| B5 | 整段被引号包裹（>60 字且无内层引号） | 他人原文摘录 |
| B6 | 他人署名行 | `作者：X` / `本文作者：X` |
| B7 | 营销导流 | `阅读原文` 249 篇、`赞赏` 166 篇、`微信/加微` 434 篇 |
| B8 | 微信排版噪音 | `你的位置:`、`原创 幽哥 职场蛙 _日期_`、分隔线 |
| B9 | 含 `🍭` 的段落 | `Main.md` 注明该标记为云飞所书（25 个文件） |
| B10 | 代码围栏、HTML、图片、表格、标题、裸 URL | 不是散文，进语料会污染句长统计 |
| B11 | <40 字且无句末标点的碎片 | 清洗残渣 |
| B12 | 整段招聘 JD（`岗位职责`/`任职要求`/`福利待遇` 命中 ≥2） | 幽哥常整段复述岗位描述 |

### `>` 引用块为什么必须整块删

实测：278 篇幽哥文章含 `>`，共 1873 条单级 `>` + 6 条缩进 `  >`，但每篇占比均值只有 **2.69%**（只有 3 篇超过 50%，没有一篇超过 90%）。整库一次运行会删掉 798 个引用块、1121 行续行。

→ 所以**不能**用"占比 >30% 就整篇丢弃"的阈值（只能命中 3 篇，会漏掉其余 275 篇里的引用块），必须逐块删除。

抽样内容全部是他人文本：

```
23采购职位入门/采购和供应链，是啥关系.md:33     > * 仓储部，**进料管理、出货仓管理**。
07求职，就是打败HR的过程/人事是如何收简历的.md:113  > 匿名用户提问:幽哥，我遇到了一个职场问题…
30职场互动/上"知乎"一年的惊讶感受.md:187        > 微信公众号：猫大叔的财会窝…正在热卖中
```

两个易错点：

1. **惰性续行**：块内有不带 `>` 的**两空格缩进**续行（知乎抓取段尤其明显），只删 `^>` 会留下半截句子。实测每次运行会连带删掉约 1000 行续行。
2. **块边界是空行**；`>` 单独成行（`^>\s*$`）只是块内分段符，不是结束。空行之后的顶格段落是幽哥正文，必须保留。

`ingest` 结束时会做**零残留断言**：`chunks.jsonl` 里若还有行首 `>` 直接报错退出。

### 判定顺序

```
先剥引用（B）→ 统计剩余字数 → 再决定整篇去留（A6）
```

反序（先按占比判整篇）会漏掉 270 多篇含少量引用块的文章。

## 数据契约

`style/corpus/chunks.jsonl` 每行一条，下游只依赖它：

```json
{"id":"sha1前12位","source":"10面试技巧/xxx.md","title":"…","category":"10. 面试技巧",
 "author":"幽哥","text":"…","charCount":312,"flags":["B3","B4","B7"]}
```

`style/corpus/report.json` 记录**每篇的去留原因与证据行**（可审计）：

```json
{"scanned":1100,"kept":858,
 "dropped":[{"source":"…","reason":"guest-author","evidence":"第 75 行「作者：山西小王」"}],
 "rules":{"other-author":146,"too-short":37,"B4":798},
 "quoteSamples":["匿名用户提问:幽哥，我遇到了一个职场问题…"]}
```

当前基线：1100 篇 → 保留 858 篇 / 5652 块 / 255 万字。

想换语料来源（例如以后抓外部站点）只需改 `corpus.js`，其余模块不用动。

## 配置

复制 `.env.example` 为 `.env`（已被 gitignore）：

```bash
STYLE_PROVIDER=deepseek        # deepseek | qwen | siliconflow | openai | ollama
STYLE_API_KEY=sk-xxxx          # ollama 不需要
# STYLE_MODEL=deepseek-chat            # 覆盖预设
# STYLE_EMBED_MODEL=text-embedding-v3  # 留空则检索降级 BM25
# STYLE_CONCURRENCY=3
```

全部走 OpenAI 兼容协议，换供应商只改这三行。

- 没配 `STYLE_API_KEY`：`ingest` / `index` / `profile --no-llm` 照常工作；`rewrite` / `eval` 退出码 2。
- 没配 `STYLE_EMBED_MODEL`：检索退化为中文二元组 BM25，**完全离线**，主体信息匹配够用。

### 用 CodeBuddy 的免费积分跑（`STYLE_PROVIDER=codebuddy`）

官方**不对外提供 API Key**，所以这条路走的是本机 CLI 的无头模式：

```bash
# 等价于管线内部实际执行的命令
codebuddy -p "<用户消息>" --append-system-prompt "<风格说明书>" \
          --output-format json --disallowedTools "Bash,Write,Edit,Read,Glob,Grep,WebFetch,WebSearch,Task"
```

```bash
# .env
STYLE_PROVIDER=codebuddy
# STYLE_CODEBUDDY_BIN=/usr/local/bin/cbc   # 命令名不同时指定
```

前提：本机已装 CodeBuddy Code CLI 且已登录同一账号（`codebuddy --version` 能通）。

取舍：

| | codebuddy | HTTP API（deepseek 等） |
| --- | --- | --- |
| 成本 | 账号积分 | 按 token 付费（分钱级） |
| 单次耗时 | 数秒到数十秒（一次完整 agent 会话） | 1-3 秒 |
| 并发 | 强制 1 | 默认 3，可调 |
| `style:eval` | 能做但很慢（几十次调用） | 推荐 |
| embedding | 无 → 检索自动降 BM25 | 可配 `text-embedding-v3` 等 |

管线已禁用文件/网络类工具，只做纯文本生成，避免它去读写仓库或触发权限确认。

**不要**用 `workbuddy2api` 这类第三方反代：非官方、违反条款、有封号风险（上游已于 2026-10-21 停止维护）。

## 风格说明书怎么调

`style/style-guide.md` 是纯文本，直接手改最有效：

1. 第 5 节（禁用词表）——发现模型写出"首先/其次/综上所述"，就把词加进去。
2. 第 6 节（正反例）——用真实口述稿和你的手改稿做对照，效果比任何形容词都好。
3. 第 7 节（改写守则）——就是 system prompt 的硬约束，条数别超过 10。

改完不需要重跑 `profile`，`rewrite` 每次都会重新读这个文件。

## 评估怎么读

`npm run style:eval` 会：原作 → 反写成"平实口述稿" → 跑完整改写 → 三段混排（原作/改写稿/无关段落）让裁判盲判。

- **误判率越接近 33% 越好**（裁判分不出来）；明显低于 33% 说明改写稿"AI 味"太重。
- 指标漂移表告诉你差距在句长还是加粗还是人称。
- 报告落在 `style/eval-report.md`。

## 接语音转写

管线输入统一是文本，语音环节只要产出同样格式的 `.txt` 即可：

```bash
# 任意转写工具（本地 whisper.cpp / 剪映 / 飞书妙记）导出 txt 后
npm run style:rewrite -- --in transcript.txt --out source/_drafts/x.md

# 或者直接管道
cat transcript.txt | npm run style:rewrite -- --stdin --out source/_drafts/x.md
```

后续若要内置转写，只需加一个 `style:asr` 命令产出同样文本，不用改改写逻辑。

## 成本

单篇 6000 字成稿约 8-12 次调用，每次约 4k token（说明书 1.5k + 样例 1.5k + 输入 0.8k）。DeepSeek 档位下基本在分钱级。`style/.cache/llm/` 按请求 sha1 缓存，重跑同一篇不重复花钱（已 gitignore）。
