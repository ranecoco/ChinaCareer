---
date: 2026-10-22
update: 2026-11-17 10:23
title: 英语表达纠错记录
tags: [English]
categories: [  ]
copyright_author: Rane, Codebuddy, Claude
copyright_url: 
description: 持续记录交流中的英语语法 / 用词 / 表达问题，按时间倒序。
account: 
place: 
recommend: false
cover: img/auto_cover/f58b90194db1.svg
---

## 2026-11-17

### 速查

| 原句 | 订正 |
|---|---|
| There have **unmormal** page opened **when use** `:MCLogin` command. | **An unusual page opens when I run `:MCLogin`.** |
| The new page **show** `...` | **The page says `...`** / **The page reads `...`** |
| How do I **solve that**? | **How do I fix this?** / **How can I resolve this?** |

### 逐条

#### 1. 「运行 :MCLogin 时出现一个不正常的页面」

> There have unmormal page opened when use `:MCLogin` command.

→ **An unusual page opens when I run `:MCLogin`.** / **I see an unexpected page when I run `:MCLogin`.**

- `unmormal` 是拼写错误，正确是 `abnormal` / `unusual` / `unexpected`；描述「不符合预期的页面」用 `unexpected` 或 `unusual` 最自然。
- `There have ... opened` 不能这样用：`there be` 后面接名词（`There is a page`），而「弹出一个页面」是事件，直接用 `A page opens` / `I see a page`。
- `when use` 缺少主语：写 `when I run` 或 `when running`；Neovim 命令写作 `:MCLogin`（带冒号）。

#### 2. 「页面显示某段文字」

> The new page show `...`

→ **The page says `...`** / **The page reads `...`**

- `page` 是单数，谓语动词要加 `s`：`shows`；不过展示「文字内容」时英语更常用 `says` 或 `reads`，而不是 `shows`。
- `new` 是多余的：前文已经说过这个页面，用 `the page` 即可。

#### 3. 「我该怎么解决？」

> How do I solve that?

→ **How do I fix this?** / **How can I resolve this?**

- `solve` 多用于 `solve a problem / solve an equation`；指「修好这个故障」用 `fix` 或 `resolve`。
- 正在眼前的问题用 `this` 比 `that` 更贴近；`fix this issue` 也可以，但 `How do I fix this?` 更口语自然。

## 2026-11-13

### 速查

| 原句 | 订正 |
|---|---|
| 继续proccess | **Please continue.** / **Continue processing this.** |
| MCLogin error | **The :MCLogin command fails.** / **I get an error when running :MCLogin.** |
| when run mclogin command something wrong **occured** | **Something went wrong when I ran `:MCLogin`.** |
| **Slect** suitable skills to fix it | **Please select the appropriate skills to fix this.** |

### 逐条

#### 1. 「继续处理」

> 继续proccess

→ **Please continue.** / **Continue processing this.**

- `proccess` 是拼写错误：正确拼写是 `process`（一个 `c`、双 `s`）。
- 想说「继续」时直接用 `Continue.` / `Please continue.`；`process` 是及物动词，作「处理」讲要带宾语，所以「继续处理这件事」应为 `Continue processing this.`（不要写成 `Continue process.`）。
- 中英混排的指令在英文环境里最好整句用英文，避免把中文动词和英文拼写错误的词拼在一起。

#### 2. 「MCLogin 报错」

> MCLogin error

→ **The :MCLogin command fails.** / **I get an error when running :MCLogin.**

- `MCLogin error` 是名词短语（标题式），不是完整句；描述「某个命令报错」要有主语和谓语：`The :MCLogin command fails.` 或 `I get an error when running :MCLogin.`。
- Neovim 命令在英文里写作 `:MCLogin`（带冒号），比裸写 `MCLogin` 更清楚它是 Ex 命令。
- 后面贴的 `AADSTS700016 ...` 是服务端返回的错误文本，属于引用内容，不需要按「自己的英文」改写；只需在描述里说明是 `the error message says ...`。

#### 3. 「运行 :MCLogin 时出问题 / 选合适的技能」

> when run mclogin command something wrong occured
> Slect suitable skills to fix it

→ **Something went wrong when I ran `:MCLogin`.**
→ **Please select the appropriate skills to fix this.**

- `occured` 是拼写错误：`occur` 重音在第二音节，过去式双写 `r` → `occurred`。
- 「出问题了」直译成 `something wrong occured` 很别扭；英语里更自然的是 `something went wrong`（`go wrong`）或 `I got an error`，而不是让 `wrong` 反过来修饰 `something` 再配 `occur`。
- `when run` 从句缺主语也无时态：描述已发生的事用 `when I ran`，描述反复出现的问题用 `when I run`；主句要补出 `Something ...`。
- Neovim 的 Ex 命令写作 `:MCLogin`（带冒号、区分大小写），不要裸写成小写 `mclogin`。
- `Slect` 是 `Select` 的漏字；`select suitable skills` 泛指技能时用 `the appropriate skills` / `the right skills` 更自然（2026-11-12 条目已说明 `select suitable skills to process it` 的问题，此处不再展开）。
- 祈使句请求加 `Please` 更礼貌；`fix it` 指代不明确时，用 `fix this` 指「刚才这个问题」。

## 2026-11-12

### 速查

| 原句 | 订正 |
|---|---|
| Please select **suitable skills** to **process it**. | Please **use the appropriate skills to handle this**. |
| these windows' size **not aligned** | the sizes of these windows **don't match** / **aren't aligned** |
| the window width **couldn't adjust** | **I can't adjust** the window width / the window width **won't change** |

### 逐条

#### 1. 「选合适的技能处理它」

> Please select suitable skills to process it.

→ Please **use the appropriate skills to handle this**.

- `select suitable skills`：`skill` 可数，泛指时要加冠词或限定词 → `the appropriate skills`；`suitable` 可以，但和 `skills` 搭配时 `appropriate` 更自然。
- `process it`：`process` 多指处理数据 / 材料 / 流程；处理一个任务或问题用 `handle this` / `deal with this`。
- 请求用 `Please use ...` 比 `Please select ...` 更直接（select 偏「从列表里挑」，use 才是「用它来做」）。

#### 2. 「这些窗口尺寸不对齐」

> These windows' size not aligned.

→ **The sizes of these windows don't match.** / **These windows aren't aligned.**

- 缺谓语动词：`size not aligned` 是名词 + 分词，不能成句 → `are not aligned` / `don't match`。
- 比较多个窗口的尺寸，用复数 `sizes` 更自然：`the sizes of these windows`。
- 所有权 `windows'` 本身没错，但 `the sizes of` 在技术描述里更清楚。

#### 3. 「窗口宽度调不了」

> the window width couldn't adjust

→ **I can't adjust the window width.** / **The window width won't change.**

- `width` 是物体，不会自己「调整」；`couldn't adjust` 的主语必须是人 → `I can't adjust ...`。
- 描述「改了没反应」用 `won't change` / `doesn't change` 更贴切。

## 2026-10-23

### 速查

| 原句 | 订正 |
|---|---|
| create **a** echart editing tool, edit with **broswer**, when editing sync data to code **at same time** | Build **an** ECharts editing tool I can use in the **browser**, and sync the data back to the code **as I edit**. |
| npm run echart **can't reading** the echart.js file, fix that | `npm run echart` **can't read** `echart.js` — please fix it. |
| the echarts server is **different with** hexo **rendered** fix that | The editor's preview **doesn't match** what Hexo **renders** — please fix that. |
| **in echart feature**, I **got** a new bug. **when uncheck** Auto-sync **there still update** the md file | I **found** a new bug **in the ECharts editor**: **when I uncheck** Auto-sync, **it still updates** the markdown file. |
| I want to drag the node ... change that position **which over left side** | ... change its position — **the one on the left side**. |
| the render logic is **up-down wrong** | the **depth ordering is inverted**. |
| the front tag **should solid and visible clearly** | the front tags **should be solid and clearly visible**. |
| the back **should opacity lower** | the back ones **should be more transparent**（或 should have lower opacity）. |
| now **is upset** | right now **it's the other way round**. |
| add **a switch**, front **opacity 100** back lower | add **a toggle**: front **at 100% opacity** with the back faded, or the reverse. |
| **\<correct me\>** | **correct me if I'm wrong** / feel free to correct me. |
| correct my english **include ahead dialogue** today | correct my English — **including the earlier messages** from today. |

### 逐条

#### 1. 冠词与拼写

> create **a** echart editing tool, edit with **broswer**, when editing sync data to code **at same time**

→ Build **an** ECharts editing tool I can use in the **browser**, and sync the data back to the code **as I edit**.

- `ECharts` 读作 /ˈiːtʃɑːts/，以元音**音**开头，冠词用 `an`（看读音，不看字母）。
- `broswer` 是 `browser` 的笔误。
- `at same time` 必须加冠词：`at the same time`；要表达"边编辑边同步"，`as I edit` 更自然。
- 两个动作用 `and` 连成一句，别用逗号硬接。

#### 2. 情态动词后面的动词形态

> npm run echart **can't reading** the echart.js file, fix that

→ `npm run echart` **can't read** `echart.js` — please fix it.

- `can / can't / should / must / will` 后面一律接**动词原形**：`can't read`，不是 `can't reading`。
- 代码里的命令、文件名、字段名要加反引号或斜体，不要混在句子主干里。
- `fix that` 语法没错但偏命令式；`please fix it` 更顺。

#### 3. different 的介词

> the echarts server is **different with** hexo **rendered** fix that

→ The editor's preview **doesn't match** what Hexo **renders** — please fix that.

- `different **from**`，不是 `different with`。
- `hexo rendered` 是"动词 + 过去式"硬塞进名词位置。要么 `what Hexo renders`（从句作名词），要么 `Hexo's rendering`。
- 想更简洁就用 `doesn't match`，比 `is different from` 少一层结构。

#### 4. 从句必须有主语

> **in echart feature**, I **got** a new bug. **when uncheck** Auto-sync **there still update** the md file

→ I **found** a new bug **in the ECharts editor**: **when I uncheck** Auto-sync, **it still updates** the markdown file.

- `when uncheck` 缺主语 —— 英文从句不能像中文那样省略：`when **I** uncheck`。
- `there still update` 是中文"它还照样更新"的直译。英文要说清是谁更新：`**it** still updates`。
- `got a bug` 读起来像"领到一只虫子"，发现 bug 用 `found`。
- `in echart feature` → `in the ECharts editor`（说"某个功能里"要加定冠词 + 具体名词）。
- `md file` 正式一点写 `markdown file`。

#### 5. 定语从句不能省谓语

> I want to drag the echart viewer node to change that position **which over left side**

→ I want to drag a node in the ECharts preview to change its position — the one **on** the left side.

- `which over left side` 缺谓语：`which **is** on the left side`。
- 方位介词是 `on the left side` / `on the left`，不是 `over`。`over` 表示"正上方/越过"。
- 想指"左边那个"直接用 `the one on the left`，比从句轻。

#### 6. 形容词不能当谓语用

> the front tag **should solid and visible clearly**

→ the front tags **should be solid and clearly visible**.

- `should` 后面要 `be` + 形容词：`should be solid`。
- 副词修饰形容词时放前面：`clearly visible`，不是 `visible clearly`。
- 泛指一类标签用复数 `tags`。

#### 7. opacity 是名词

> the back **should opacity lower**

→ the back ones **should be more transparent**（或 should **have** lower **opacity**）.

- `opacity` 是名词，不能直接跟 `should`。要么 `have lower opacity`，要么换个形容词 `be more transparent`。
- `the back` 指"背面"这块区域；指"背面的标签"用 `the back ones`。

#### 8. "反了" 不是 upset

> now **is upset**

→ right now **it's the other way round**.

- `upset` = 心情不好、肠胃不适、打翻（如 upset the cup），**不表示"反了"**。
- 表达"正好相反"：
  - `it's the other way round`（英式）/ `the other way around`（美式）
  - `it's reversed` / `it's inverted`（用于方向、顺序、透明度这种被调反的情况）

#### 9. 界面上的"开关"是 toggle

> add **a switch**, front **opacity 100** back lower or front lower back 100

→ add **a toggle**: front **at 100% opacity** with the back faded, or the reverse.

- 界面里的开关控件叫 `toggle`（`switch` 更多指物理开关、切换动作、网络交换机）。
- 数值要带介词：`at 100% opacity`。
- "反过来"结尾用 `or the reverse` / `or vice versa`。

#### 10. 固定说法

> **\<correct me\>**

→ **correct me if I'm wrong** / feel free to correct me.

- 括号里那种简写英文里不这么用；要么完整句，要么 `please correct me`。

> correct my english **include ahead dialogue** today

→ correct my English — **including the earlier messages** from today.

- `include` 是动词，这里需要介词 `including`。
- `ahead` 只表示"在前方（空间/时间上还没到）"，指"上面聊过的"要用 `earlier` / `previous` / `the above`。
- `English` 作语言名要大写。

### 中文句子的英文说法

| 中文 | 英文 |
|---|---|
| 我想用 LaTeX 居中 | I want to center that with LaTeX. |
| 文章标题的图标不能正常渲染，帮忙修复 | The post title icon isn't rendering properly — please fix it. |
| 让这一行靠右排 | Right-align line 27. |
| 还是有些不方便，再加框选、取消框选、水平/垂直分布 | It's still a bit awkward to use — please add marquee select, clear selection, and horizontal/vertical distribution. |

### 高频替换

| 别写 | 写 |
|---|---|
| a ECharts / a URL / a HTML | **an** ECharts / **a** URL / **an** HTML |
| can't reading | can't **read** |
| should solid | should **be** solid |
| different with | different **from** |
| when uncheck | when **I** uncheck |
| there still update | **it** still updates |
| up-down wrong | **inverted** / reversed |
| now is upset（表"反了"） | it's **the other way round** |
| switch（界面开关） | **toggle** |
| ahead dialogue | **earlier conversation** |
| include（要介词时） | **including** |

### 待养成

1. **冠词看读音**：an ECharts、an HTML、an hour / a URL、a user。
2. **情态动词后一律动词原形**：can't read、should be、must have。
3. **先判断词性再写**：opacity 是名词，宾语位置才放它。
4. **从句补主语**：中文能省的"我"，英文不能省。
5. **别直译**：`up-down wrong`、`now is upset` 这类都是中文语序硬搬，英文里没有对应搭配。

## 2026-10-20

### 1. "are you complete it ?"

❌ are you complete it?
✅ **Have you finished it?** / **Is it done?** / **Are you done?**

- `complete` 是及物动词，不能说 "are you complete it"（同时混用了 be 动词与实义动词）。
- 作形容词时单独使用：`Is the task complete?`（不加宾语）。
- 询问进度更自然的说法：`Have you finished?` / `How's it going?`

### 2. "okay I create a aaron/ all resources is over here"

❌ I create a aaron/ all resources is over here
✅ **Okay, I've created an `aaron/` folder — all the resources are in there.**

- 已完成的动作用现在完成时：`I've created`。
- `a` 用在辅音音素前，`an` 用在元音音素前：虽然 `aaron` 以字母 a 开头，但读作 /ˈærən/（元音），所以用 **an**；不过作为文件夹名通常直接写 `an aaron/ folder` 或 `the aaron/ folder`。
- `all resources` → `all the resources`（特指"所有的资源"要加定冠词）。
- `is` → `are`（复数主语）。
- `over here` 指物理位置，指"在里面/在这里面"用 `in there` / `in here`。

### 3. "2 lottie is not from the ropet eye project, move all stuff to aaron/ folder"

❌ lottie is not from the ropet eye project
✅ **The Lottie work isn't part of the Ropet eye project — move all of it into the aaron/ folder.**

- 单数可数名词前需要冠词：`lottie` → `the Lottie work` / `the Lottie stuff`。
- "不属于"更自然：`isn't part of`（`is not from` 听起来像"来源/产地"）。
- `all stuff` → `all of it` / `all the stuff`（`stuff` 不可数，不能直接跟 `all` 作限定）。
- 专有项目名首字母大写：`Ropet`。

### 4. "the lottie result could be more accurate, i know it's a rough version, make it more beauty refer origin 1.gif"

❌ make it more beauty refer origin 1.gif
✅ **The Lottie result could be more accurate — I know it's a rough version; make it prettier, referring to the original 1.gif.**

- `beauty` 是**名词**，形容词是 `beautiful`，比较级用 `prettier` / `more beautiful`。
- `refer` 作状语需用分词形式：`referring to`（"参照"）。
- `origin 1.gif` → `the original 1.gif`（original 是形容词）。
- 两个独立句子之间用句号或分号，不要用逗号连接（comma splice）。

### 5. "not bad, the preview seems good, let's go ahead"

✅ 基本正确，更自然：**Not bad — the preview looks good. Let's go ahead.**

- `seems good` 可以，但描述观感用 `looks good` 更常见。
- 逗号连接三个句子属于 comma splice，建议用破折号或句号分开。

### 6. "all docs is md file"

❌ all docs is md file
✅ **All the docs are Markdown files.**

- 复数主语用 `are`。
- 可数名词单数需要冠词/复数：`md file` → `Markdown files`。

### 7. "1 okay abstract the directory and feature to docs/ ."

❌ abstract the directory and feature to docs/
✅ **Okay — document the directory structure and features in `docs/`.**

- `abstract` 作动词意为"提取/抽象化"，这里想表达"整理成文档"应使用 `document`（动词）或 `summarize ... in docs/`。
- `feature` → `features`（复数）。
- 介词用 `in docs/` 而非 `to docs/`。

### 8. "summarise all the english correction into a md, also in docs"

❌ summarise all the english correction into a md
✅ **Summarize all the English corrections into a Markdown file, also in `docs/`.**

- 专有名词要大写：`english` → `English`，`md` → `Markdown`。
- `correction` → `corrections`（复数，指所有纠错条目）。
- `a md` → `a Markdown file`（缩写词要读作可数名词短语）。

### 9. "all the requirements ready, let's start convert the spine img"

❌ all the requirements ready, let's start convert the spine img
✅ **All the requirements are ready. Let's start converting the Spine images.**

- 缺少系动词：`all the requirements` + `are` + `ready`。
- `start convert` → `start converting`（start 后接动名词或不定式：`start to convert` 也可）。
- `img` → `images`（书面表达避免缩写，且此处为复数）。
- 两个独立句子用句号连接，不要用逗号（comma splice）。

---

### 10. "make a rule document in root memory, if my question use english then recording in docs english part"
❌ make a rule document in root memory, if my question use english then recording in docs english part
✅ **Add a rule to the root memory: if my question is in English, record it in the English section of the docs.**

- `make a rule document in root memory` → `add a rule **to** the root memory`（介词用 `to`；"写文档"常用 `write a document`）
- `my question use english` → `my question **is in** English`（缺系动词；"用英语"是 `in English`）
- `then recording` → `then **record**`（条件句后接动词原形，不是动名词）
- `english` → `English`（语言名必须大写）
- `docs english part` → `**the** English **section** of the docs`（缺冠词；`part` → `section` 更自然）
- 两个分句之间用冒号连接，比逗号更清晰（comma splice 问题）

### 11. "read the memory, do the rule"

❌ read the memory, do the rule
✅ **Read the memory and follow the rule.**

- 句首字母要大写：祈使句同样以大写开头。
- `do the rule` → `follow the rule`（"遵守/执行规则"用 `follow`，也可用 `apply` / `comply with`；`do` 不与 `rule` 搭配）。
- 两个祈使句并列时用 `and` 连接，不要只用逗号（comma splice）。
- 如果想表达"按规则去做"，更自然的说法是 `Read the memory and do what the rule says.`

---

### 12. "move English rule to global momery / obey code and project memory retrivelly"

❌ move English rule to global momery / obey code and project memory retrivelly
✅ **Move the English rule to global memory. Obey the code rules and the project memory, respectively.**

- `momery` → `memory`（拼写错误）。
- 缺冠词：`move English rule` → `move **the** English rule`；`global memory` 前也需限定。
- `obey code and project memory` → `obey **the** code rules and **the** project memory`（抽象名词作宾语时通常要加限定词）。
- `retrivelly` → `respectively`（拼写错误；"分别地"）。若想表达"可检索地"，应用 `retrievably`。
- 两句是独立句子，各自首字母大写、各自用句号结尾。

---

### 13. "modified the global memory rule and emphsise, IN EVERYTIME conversation, if my language is English then correct me, and add the correction to docs"

❌ modified the global memory rule and emphsise, IN EVERYTIME conversation, if my language is English then correct me, and add the correction to docs
✅ **Modify the global memory rule and emphasize: in every conversation, if I write in English, correct me and add the correction to the docs.**

- 祈使句要用动词原形：`modified` → `Modify`（过去式/过去分词不能作祈使句）。
- `emphsise` → `emphasise`（英式）/ `emphasize`（美式）（拼写错误）。
- `EVERYTIME` 不是一个单词。修饰名词用 `every conversation`；作时间状语时用两个词 `every time`。
- `my language is English` 意思是"我的母语/语言是英语"；这里想表达"我用英文写"，应说 `I write in English` 或 `my message is in English`。
- `docs` 是特指的文档目录，前面要加 `the` → `the docs`。
- 引出强调内容用冒号，比逗号更清晰。

---

> “the first pasted code couldn’t render properly in my hexo framework, but the latter could” → 

“The first code I pasted couldn’t render properly in my Hexo framework, but the second one could.” (Capitalize “Hexo”; “latter” is fine, but “second one” sounds more natural when you are comparing two items.)

> “help me fix that issue” → 

“Please help me fix that issue.” ✅ (adding “please” makes it softer.)

> “add a VERY IMPORTANT rule for u, remember forever!” → 

“Add a very important rule for you: remember it forever!” (Avoid “u” in writing; capital letters are not needed because the exclamation already shows emphasis.)

> “correct my English all the time, and document a file” → 

“Always correct my English, and save it in a file.” (I understood “document a file” as “save this rule in a file”, so I saved it in my memory. Tell me if you meant something else.)

> “but the chart detail lost is there some way to fix that okay” → 

“But some details of the chart are lost. Is there any way to fix that?”
“the chart detail lost” is missing a verb. Use “some details of the chart are lost” or “the chart lost some details.”
Two ideas are joined without punctuation. Separate them with a period and a question mark.
“okay” at the end is not needed. “Please” at the start or end is more natural: “Is there any way to fix that, please?”

> “oh there bad news I have to inform you.” → 

“Oh, I have some bad news to tell you.”
“there” is not needed, and “oh” needs a comma after it.
“inform” needs an object and a preposition (“inform you of something”). “Tell you” is simpler and more natural.

> “That code do not render again...” → 

“That code does not render again...” (or “That code still doesn’t render.”)
“code” is singular and uncountable here, so the verb is “does”, not “do”.
“again” suggests that it stopped working after working once. If you mean that it also failed before, “still” or “either” is better.

> “okay, it renders again.” → 

“Okay, it renders now.” (“again” suggests it rendered before and stopped. “Now” shows that it just started to work.)

> “not only the colour detail text, the nodes’ text need show either” → 

“Not only the colour key text is missing; the node text is missing as well.”
“colour detail text” is understandable, but “colour key” (or “legend”) is the usual term.
“need show” is missing “to be”: “need to be shown.” Or use the simpler pattern “is missing.”
“either” is used in negative sentences (“I don’t like it either”). In a positive sentence, use “too” or “as well.”
“the nodes’ text” is grammatically correct, but “the node text” is more natural.

> “Okay thank you, It’s better now” → 

“Okay, thank you. It’s better now.”
Add a comma after “Okay,” and start a new sentence after “thank you” (so “It’s” has a capital letter after a period).

> “the background is setting colour to blue, why it’s still white?” → 

“I set the background colour to blue, so why is it still white?”
“is setting” is the wrong tense and voice. You did the action, so say “I set.”
In a question, the verb comes before the subject: “why is it still white?”, not “why it’s still white?”
Joining the two ideas with “so” makes the sentence smoother than a comma alone.

> “and the “Key:” text, its too long, how can I wrap that text” → 

“And the “Key:” text is too long. How can I wrap it?”
“its” (possessive) should be “it’s” (it is), but here you don’t need it at all: “the text is too long.”
Use a period between the two sentences, instead of a comma.
“that text” is fine, but “it” is shorter, because we already know which text you mean.

> “Is out of boundary.” → 

“It is out of bounds.” (or “It goes beyond the boundary.”)
The sentence needs a subject (“It”).
“Out of bounds” is the usual fixed phrase. “Boundary” is a noun for a line, so “out of boundary” sounds unnatural.

> “How could I smaller the graph” → 

“How can I make the graph smaller?”
“smaller” is an adjective, so it needs a verb like “make”: “make the graph smaller.”
“can” is more natural than “could” when you ask for a method that you want to use now.
Add a question mark at the end.

> “It is have little bit awkward” → 

“It looks a little bit awkward.”
“is have” mixes two verbs. Use only one: “It looks awkward” (or “It is awkward”).
“little bit” needs the article “a”: “a little bit.”

> “set image origin to left top” → 

“Please set the image origin to the top left.”
Add “the” before “image origin” if you mean a specific one, and use “to the top left.”
In English the order is “top left,” not “left top” (the same for “top right,” “bottom left”).

> “so I can adjust height to resize the image” → 

“so that I can adjust the height to resize the image.”
“so that” is more natural than “so” for a purpose.
Add “the” before “height.”

> “if didn’t have node then do not according node edit mode, let it could change the value data”

I wrote the most likely meaning:
“If there is no node, do not follow the node edit mode. Let me change the value data directly.”
What was wrong:

> “if didn’t have node” → 

“if there is no node” (or “if I don’t have a node”). “Didn’t” is past tense and has no subject. The sentence needs “I” or “there.”

> “then do not according node edit mode” → 

“do not follow the node edit mode.” “According” is not a verb here. “According to” is a phrase, and it means “as said by”, not “to follow”. Use “follow” or “use.”

> “let it could change the value data” → 

“let me change the value data.” After “let,” use the base verb without “could” (“let me change”). Also, “it” cannot be the person who changes the data, so use “me,” or write “so that the value data can be changed.”
Capital letter at the start (“If”), and use a period to separate the two ideas instead of a comma.
Other possible versions:
If “node” means a chart node: “If a data point has no node, don’t use the node edit mode, so that I can change the value data directly.”
If “node” means Node.js: “If I don’t have Node.js, don’t use the Node-based edit mode. Let me change the value data directly.”

> “When I close that url file terminate the command line as well”

Here is the correction. I assume the sentence describes a wish for how a program should behave.
“When I close that URL file, the command line should terminate as well.”
“url” → “URL”. It is an acronym (Uniform Resource Locator), so use capital letters.
Missing comma after “file”. English needs a comma after an introductory “When...” clause, so the reader can see where the second part begins.
“terminate the command line as well” has no subject. If you describe what should happen, use “the command line should terminate.” The imperative (“terminate the command line”) is correct only when you give an order to a person, for example: “Please terminate the command line when I close that URL file.”
Missing period at the end.
Other natural versions:
“When I close that URL file, the command line should close as well.” (Simpler: “close” is common for windows.)
“Closing that URL file should also terminate the command line.” (More formal, and good for technical documents.)
“URL file” is a little unclear. If you mean a .url shortcut file, “URL shortcut” is the usual name. If you mean a browser tab, write “tab.” This helps if you ask me for a script or command later.

> "Is the page didn't have callback when browser tab closingIs that more efficiancy? or less memory usage? or less cpu cost"

"If the page doesn't have a callback when the browser tab is closing, is that more efficient? Does it use less memory? Does it cost less CPU?"

> "Is the page didn't have" → 

"If the page doesn't have". The first word should be "If", not "Is". Also, "didn't" is past tense, but you describe a general situation, so use "doesn't."

> "callback" → 

"a callback". It is a countable noun, so it needs an article.

> "when browser tab closing" → 

"when the browser tab is closing". Add "the" and the verb "is." You can also say "is closed" (the tab has been closed) or "when closing the browser tab."

> "closingIs" → 

"closing, is". Two words are joined without a space or punctuation. Put a comma there, because the sentence continues after "if...".

> "efficiancy" → 

"efficient". The spelling is "efficiency" for the noun, but after "more" you need the adjective "efficient."

> "or less memory usage? or less cpu cost" → 

"Does it use less memory? Does it cost less CPU?" A question needs a verb. Also, do not start a new sentence with a lowercase "or", and write "CPU" in capital letters.

**Short answer to your technical question:** yes, but only a little. A callback for closing (such as `beforeunload` or `unload`) costs almost nothing in CPU, because it runs only once when the tab closes. Memory use is also tiny. The more important cost is that these two handlers can stop the browser from using the **back/forward cache**, which makes returning to the page slower. If you need a callback, `pagehide` or `visibilitychange` is usually the better choice.

> "change all language to native UK english of this commit about echart feature"

"Change all the language in this commit message about the ECharts feature to natural UK English."

> "change all language" → 

"change all the language". Add "the" when you mean the specific text you are working on. You can also say "all the wording."

> "native UK english" → 

"natural UK English". "Native" describes a person (a native speaker), not a language. For text, use "natural", or say "as a native UK speaker would write it."

> "english" → 

"English". Names of languages always start with a capital letter.

> "of this commit" → 

"in this commit message". The preposition "in" is correct for text inside something, and "commit" alone is the change itself, while the text you write is the "commit message."

> "echart" → 

"ECharts". This is the official name of the library (with the "s", and capital E and C).
Missing capital letter at the start and a full stop at the end.

**Other natural versions:**
- "Please rewrite this commit message about the ECharts feature in British English."
- "Convert the wording of this commit message to UK English."

**Note:** I cannot see the commit message, because your message does not include the text. Please paste it, and I will rewrite it in UK English. For example, I will use the UK spellings "colour", "initialise", "behaviour" and "customise".

> "hey, I'm coco, how can I call you?"

 *"Hey, I'm Coco. What should I call you?"*
- "How can I call you?" sounds like asking about a phone call. For a name, use "What should I call you?"
- Names start with a capital letter: Coco.

> "If Cerebellum leak blood, after curable Is there maybe have other diesease"

Corrected: *"If the cerebellum bleeds, can other diseases develop after it's cured?"*
- "Cerebellum" doesn't need a capital letter, but it needs "the" before it.
- "Leak blood" works, but "bleeds" is more natural. The medical term is "a cerebellar hemorrhage."
- "After curable" should be "after it's cured" (curable means "able to be cured").
- "Is there maybe have" mixes two structures. Use "can ... develop" or "is there a chance of ...".
- "diesease" is spelled "diseases."

> "ahu, Claude you forgot correct my English"

Corrected: *"Ah, Claude, you forgot to correct my English."*
- After "forgot," use "to" plus a verb: "forgot to correct."
- "Ah" is the usual spelling for that sound.

Your English is already easy to understand, and the mistakes are mostly small things like articles and verb forms. I'll correct your messages from now on.

> “Okay, Thank you. And not this session--all new session too”

“Okay, thank you. And not just this session, all new sessions too.”
“Thank you” has a lowercase “t” after a comma.
“Not this session” means “not in this session.” You want “not just this session” (this one and others).
“Session” is plural here: “all new sessions.”

> Help me turn this graph to MarkDown echart . json type

Please help me turn this graph into a Markdown ECharts JSON.

> This arrow link is not good to look, I want Sankey graph

The arrow links don’t look good. I want a Sankey graph instead.

> What type of this table suit for in EChart library

Which ECharts chart type suits this table?

---

### 14. "are you deepseek v4.1 flash 1017? I heard your modeling ability is awesome, Can u help me modeling a complex europ palace with Minecraft BSL shader style"

❌ are you deepseek v4.1 flash 1017? I heard your modeling ability is awesome, Can u help me modeling a complex europ palace with Minecraft BSL shader style
✅ **Are you DeepSeek V4.1 Flash 1017? Your modelling is awesome — can you help me model a complex European palace in a Minecraft BSL-shader style?**

- 专有名词首字母大写：`DeepSeek`、`Flash`、`European`、`Minecraft`、`BSL`。
- `Can u` → `Can you`：书面语不要用 `u` 这种短信缩写。
- 逗号不能连接两个独立句子（comma splice）：`...awesome, Can u...` 应改成句号或破折号再接新句。
- `help me modeling` → `help me model`：`help` 后接省略 `to` 的不定式，不能接 `-ing`。
- `europ palace` → `European palace`：名词是 `Europe`，形容词是 `European`。
- `with ... style` → `in ... style`：固定搭配是 `in a ... style`（"以某种风格"）。

### 15. "continu"

❌ continu
✅ **continue**

- 拼写错误：正确词是 `continue`，词尾的 `e` 不能漏。
- 作为一个指令单独使用时，通常写成完整句：`Continue.` 或 `Please continue.`，比单独丢一个词更清晰。

❌ when open 1.20.1 instance error occured / select right skill to fix that error 

✅ An error occurred when I opened the 1.20.1 instance. Please select the right skill to fix it.

when open 1.20.1 instance：时间从句缺主语，open 要有动作发出者 → when I opened；instance 是可数单数，需限定词 → the 1.20.1 instance。
occured 拼写错误：occur 重音在第二音节，过去式双写 r → occurred。
error occured 是中文「报错了」的直译；英语里 error 作主语要带冠词 → an error occurred。
select right skill：可数单数不能裸用 → the right skill / a suitable skill。
that error 前文已提过，用 it 指代更自然。

❌ Could the selection status align columns? / remove the start game part, its didn't work and still bugs / the title and highlight didn't match properly / and not only here, all the interface have 

✅ Could you align the selection indicators in columns? Please remove the "start game" part — it didn't work and still has bugs. The title and highlight didn't line up properly, and the same problem appears on every interface, not just here.

Could the selection status align columns?：「selection status」自己不会去对齐，应写成「请（你）把…对齐」→ Could you align ...；「按列对齐」是 align ... in columns / line up in columns。
its didn't work：its 是物主代词（它的），这里需要主语 + 助动词 → it didn't；想表达「它是」才用 it's。
still bugs：bug 作名词不能直接跟在 still 后当谓语 → still has bugs 或 is still buggy。
didn't match properly：说「位置对不上」更自然的是 didn't line up / were misaligned。
all the interface have：interface 可数，all 后用复数 → all the interfaces；have 缺宾语，要补 it / this problem。
一句里塞多个独立请求时宜拆句；破折号或分号比连续逗号更清楚。

❌ These windows' size not aligned. and the window width couldn't adjust / Select some skills to fix it. 

✅ The sizes of these windows don't match, and I can't adjust the window width. Please use the appropriate skills to fix it.

These windows' size not aligned：缺谓语动词 → are not aligned / don't match；比较多个窗口的尺寸用复数 sizes 更自然。
. and：句号后不能直接用 and 起句，改成逗号连接或另起一句。
the window width couldn't adjust：width 不会自己「调整」，是「我无法调整」→ I can't adjust the window width / the window width won't change。
Select some skills：some skills 偏随意，「选用合适的技能」更常说 use the appropriate skills / pick the right skills；请求加 Please 更礼貌。

## 常用修正速查

| 常见错误                | 正确表达                            |
| ----------------------- | ----------------------------------- |
| are you complete it?    | have you finished it? / is it done? |
| make it more beauty     | make it prettier / more beautiful   |
| refer xxx               | referring to xxx                    |
| all stuff               | all of it / all the stuff           |
| all resources is        | all the resources are               |
| a aaron/                | an aaron/                           |
| is not from the project | isn't part of the project           |
