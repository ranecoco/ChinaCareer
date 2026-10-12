---
date: 2026-10-11 10:20
update: 2026-10-12 12:00
title: 从技术转管理：对话记录（原样堆，不提炼）
tags: [Career]
categories: [ 06. 如何选职务？ ]
copyright_author: 云飞
copyright_url: 
description: 这篇文章的决策过程记录。每轮对话原样追加，不提炼、不合并、不删字。
account: JumpFrog
place: Shanghai
cover: 
---

# 对话记录（原样堆，不提炼）

约定：此后每轮对话原样追加到本文件末尾，不提炼、不合并、不删字。公开稿里不再保留对话。

## 目录与当前结论（索引，读这一段就知道状态）

* 第一轮 稿子的形态问题 → 清 UI 残留、换真案例
* 第二轮 目的纠偏 → 不是改稿，是重建 PM 身份，面向面试
* 第三轮 落定 → 同步式站位、三个怀疑做骨架、不背说辞
* 第四轮 收口 → 原稿降级为素材、14 件排序挑 10/8/13
* 第五轮 追问三件深做是否成立 → 补回协作机制、①换成需求变更控制、标签重排、对话拆出来
* 第六轮 地基怎么打 → 两条线并行、补底三条硬指标、不许纯输入、不考证、工具够导出就行、只留硬指标
* 第七轮 第一周任务 → 三样交付、清单体系 5 张、对象是老板、发现真正的卡点是机械件与 PCB BOM
* 第八轮 四线的角色分工 → 他在硬件线亲手做、另外三条别人做他 monitoring；外部验收标准这次就用；deadline 三件套
* **第九轮 已经在做管理动作 → 第一条记录走接口契约（有时间窗口）；③改为"用标准替代上手"；monitoring 升级为三字段（待拍板 / 已拍板分开）**

当前公开稿站位：**通用方法论**（第五轮推翻第三轮的"同步式第一人称"）。
当前三件深做：**10 接口契约 / 6 需求变更控制 / 13 外部交付验收 + 4 SOP**（13 的对象待改，见第七轮 Q4）。
当前指标原则：**只留硬指标**（阻塞问题条数、变更字段、一次通过率、延期天数），自觉记录类数字一律换掉。
**关键事实（第七轮）**：美术外包还没启动、且不是关键影响部分；真正卡住项目的是**机械（结构件）与 PCB BOM 未确认，PCB 无法打样**；3D 模型已打样两次不合格，正在向外找人返工。
**关键事实（第八轮）**：项目 4 条线并行——app 开发 / PCB 与模型图 / 后端 API 与数据库 / 硬件开发；**他自己在硬件线亲手做，另外三条是别人做、他 monitoring**（即"技术执行 + 跨线协调"的混合岗位）。
**关键事实（第九轮）**：**2026-08-10 他已经写过一份 SOP 带新人**，并设两条验收规则（构建无错、ESP 不无故重启）——③「放手」的证据**已经存在**，只缺结果数字。

读取提示：本文件只追加、不倒序。要看最新内容读末尾；要省 token 就读上面这段索引。

---

## 第一轮：稿子的形态问题

**Q1｜AI 界面残留要不要清干净？**
稿子里有四处 UI 残留：Google favicon「成长 +1」、「禅道图书馆 +1」、「0/5 完成」进度标记、"你给的微信公众号文章目前无法直接读取"的开场白。
→ 结论：全部删除。

**Q2｜假案例要不要换成真的？**
原稿唯一的完整案例是"假设你负责一个 AI 陪伴玩偶嵌入式项目"，但全文结论是"先有事实和案例，再有方法论"——自相矛盾。
→ 结论：换成真实经历。这一条在重新定位后自然解决：我要写的就是我自己这一年的真实事件。

**Q3｜这篇该归到「06 如何选职务？」吗？**
→ 结论：重新定位后成立了。"从技术转管理"本身就是一个职务选择问题。

**Q4｜人称统一成哪种？**
→ 结论：第一人称自述为底，提炼出的规则用通用语气。既是面试叙事底稿，也能公开发。

**Q5｜两个清单是不是重复了？**
→ 结论：五步是节奏，六问是每张案例卡填什么，合并说明。

## 第二轮：目的纠偏

我提出"这篇文章的目的是什么"，得到的答案是：**不是改稿子，是重建项目经理身份，面向面试与个人形象塑造。**

于是上一轮的结构问题全部作废，重新问：

* **Q1 从什么状态重建？** → 答：几年前是技术人，现在想转管理，有一年学习期。
* **Q2 第一读者是谁？** → 答：我自己，要学会怎么讲给面试官听而不被怀疑。
* **Q3 面试是出口还是牵引？** → 答：要一整套方法论/追问链条。
* **Q4 personality build up 指哪层？** → 答：内在决定表达与对外形象，先把地基修好（从内往外推）。
* **Q5 公开发还是私人底稿？** → 答：先补知识，再谈其他。

## 第三轮：落定

* **Q1 文章站在哪个时间点？** → **同步式**：边学边写，第一年结束时它既是学习记录也是面试底稿。
* **Q2 一年学哪一层知识？** → **工具与产出** + **情境判断力**。体系知识只花三个月打底。
* **Q3 拿三个怀疑做骨架？** → 确认。
* **Q4 怎么做到"背了也不被追穿"？** → 不背。在这一年里真实制造出 3 件可以讲的事。已列出 4 件，其余由我补充。
* **Q5 原稿怎么处置？** → **拆开**：只保留"案例卡六问"和"产出物 SOP/模板/Checklist"两块，塞进以三个怀疑为骨架的新文里，其余（简历建议、补救计划）砍掉。

## 第四轮：收口

* **Q1 原稿文件怎么处置？** → 留作素材：清掉 UI 残留和"假设案例"，事实部分改成待填占位，移进 `source/_drafts/`。
* **Q2 5-14 条怎么挑？** → 按可行性排序，挑 10 / 8 / 13 三件做深，三个怀疑各一件；其余按机会处理。

## 第五轮：追问三件深做的是否成立

**Q1｜产出物三类够不够装下你要做的三件事**
第六节把可留的产出物写成三类：流程资产（SOP/模板/Checklist）、判断规则（决策规则/案例库）、成果证据（前后对比数据）。但按这个分类，深做的三件里有两件的产物无处安放：8 向上同步机制的产物是一套沟通节奏，13 外包验收的产物是验收节点+里程碑付款规则——它们既不是 SOP，也不是判断规则，更不是数据。原稿里有第四类「协作与管理机制（RACI、沟通机制、问题闭环）」，被我砍掉了。现在看，砍错了吗？

→ 用户答：I have no idea that is true or wrong, but the more problem view the more I comprehend the role, project manager is
→ 结论：补回第四类「协作与管理机制」，并且这才是③「我会放手」的主产出。四类：流程资产 / 判断规则 / 协作机制 / 成果证据。

**Q2｜8 向上同步机制撑得住「我能主导」吗**
①的怀疑是"你没管过人，凭什么管"。给它的证据是 8——固定节奏汇报，让老板不用追着问。但拆开看：这证明的是"我能同步信息"，不是"我能主导"。面试官追问"那你主导的那件事，最后是谁拍的板？"，周报机制答不上来。周报是让别人看见你的通道，不是主导本身。是不是该给①换一件真正在改变别人行为的动作？候选：5 风险主动升级、6 需求变更控制、7 主持复盘。

→ 用户答：the weekly report, I didn't through it clearly, just have send several e-mails to my mentor before 2years ago. Didnt continue to end over that duration. so what is the 'lead' experience exactely is, okay i'll learn from your advices
→ 结论：换。①主证据改用 6 需求变更控制（不硬挡，把代价摆出来让对方自己决定），5 作为机会性补位，8 降级为"不打①、只做可见度"。
→ 附带真实基线：向上同步不是全新动作——两年前给 mentor 发过几封邮件，但没坚持下来。所以这次定最小频率（两周一次），而不是每周，避免再次断掉。
→ 附带定义（写进正文）：主导的三个判据——①你改变了别人的决定，而不只是传递信息；②你能说清换个人来结果会有什么不同；③拍板的人不是你，但拍板依据是你给的。反例：周报、参会、转发进度只是同步。

**Q3｜③的证据会不会跟「已在做的四件」重复计算**
第 3 条（协调外包美术）已标成打①，第 4 条（写 SOP 让新人上手）标成打①，而深做的 13（外包验收节点）也是围绕外包。两件证据来自同一堆事实，面试官会觉得只有一件事翻来覆去讲。更要命的是：写 SOP 让新人能独立做事，本身就是"我没自己做，我让别人能做"——它天然是③的证据，却标成了①。

→ 用户答：now I realized, what should I think & what should I experienced
→ 结论：重新分配标签，让三件证据落在三段不同事实上——④写 SOP 改打③（新人独立交付耗时前后对比）；13 保留打③但必须切出独立数字（机制上线前后我主动催办的次数，或验收一次通过率）；第 3 条外包协调继续打①，但只讲预算与时间偏差，不碰机制。
→ 附带回答：该想的是"我这次的判断依据是什么，下次能不能复用"；该经历的是"必须有一次放手让别人做、结果还成了"的事件。

**Q4｜附录「本次对话记录」在最终稿里留不留**
文章末尾挂着三轮半的决策过程，包括"我从技术转管理""我担心面试被戳穿"这类自述。它现在有用——是这次思考的账本。但文章定位是"一年结束既是学习记录也是面试底稿"，如果公开发，这段等于把底牌摊给读者：一个还没做过管理的人在教人怎么建立管理身份。

→ 用户答：okay duplicate all dialogs to _draft md, do not abstract from now on. and that public md abstract to methodology
→ 结论：对话全部搬进本文件（`source/_drafts/GPTManagementDialog.md`），原样堆不提炼；公开稿删掉附录。
→ 追加确认：公开稿是"只删对话附录"还是"整篇改通用方法论语气"？→ 答：整篇改通用方法论。即去掉"我还没做过管理""我的焦虑"这类第一人称自述，改成读者导向（"技术转管理的人怎么准备这一年"）。
→ **站位变更记录**：第三轮 Q1 定的"同步式第一人称"站位，在第五轮被推翻，改为通用方法论。对话 log 另开独立文件，不并入素材草稿。

**附：用户附带要求**
"correct me, for my english skill and interview" → 后续回复中顺手纠正他的英文表达（拼写、时态、冠词、搭配），按面试场景给更地道的说法。

## 第六轮：地基（foundation）怎么打

**Q1｜三个月后，什么算"打完了"**
第七节写"前三个月补体系与工具的底（PMP/敏捷框架、禅道/Jira、WBS、风险登记册）"，但没写验收标准。没有标准的打底一定会膨胀——文章自己刚警告过"别把一年耗在读书上"，而读书是最容易无限延期的事。三个月结束那天，凭什么说自己打完了？

→ 用户答：I got u. 1 setup the work breakdown structure of current stage. 2 honestly, the detail have no thought. 3 the terminalogies is easy to learn
→ 结论：三条硬指标，到点就停——①拆得出 WBS（从当前阶段拆，把估算写下来）；②三件深做的台账跑起来（有真实条目，不是空模板）；③10 个术语各对上一件真事。
→ 遗留：工期估算的口径他还没想（"the detail have no thought"）→ 进公开稿第九节待确认。

**Q2｜"先补三个月知识"是不是在打自己的脸**
第五节的规则是"先有事实和案例，再有规律和方法论"，第九节又强调"顺序不能倒"。但第七节安排的恰恰是先学三个月体系知识。如果打底是纯输入，学完只会多一堆术语，仍然没有可讲的事。

→ 用户答：okay, step by step, truth tell the story
→ 结论：补底的规矩是"不许纯输入"——每学一个工具立刻用在正在做的项目上；三个月内没在自己项目里用过的知识一律不算打完。原话 "truth tell the story" 直接写进正文（事实会带出故事）。

**Q3｜"三个月打底 + 九个月情境"这个分期站不站得住**
三件深做的启动条件都是"现在就能开始"——10 联调正在发生、6 变更被动触发躲不掉、13 外包已在协调。它们不会等你三个月。如果打底是串行的，会错过第一批真实事件，而第一批最容易拿到（人还没习惯你管这些事，阻力最小）。

→ 用户答：okay, jump in the situation exactly
→ 结论：改成两条线并行——做事线第一周启动；补底线每周≤5 小时、三个月后停止。"三个月"从阶段变成约束。

**Q4｜PMP 到底考不考**
PMP 报名费加培训是四位数到五位数、准备 3–6 个月，而且它验证的是"你学过体系"，不是"你管过人"。面试官对技术转管理者的三个怀疑，没有一个能被证书消掉。一年里最稀缺的资源是真实事件，不是知识。

→ 用户答：definitily not, too expensive and didn't have too much Values. yes, agree with u
→ 结论：不考。例外只有两种——目标岗位把证书写成硬性要求，或公司报销且确实有余力。

**Q5｜工具：用哪个，以及它只是工具还是证据载体**
写"禅道/Jira"容易变成假动作——装一个、点两天、然后回去用聊天软件管项目。真正的分界是：三件深做产生的记录有没有落在里面。一年后要导出的是证据，不是工具使用经验。

→ 用户答：my company not using project managment tools, just wechat... but I had explored the Dingding's part maybe can use this
→ 结论：不新搭，能用钉钉现成的那部分就用，用不了就用一张表。判断标准：随便一个同事能不能自己查到"上次那个变更是谁拍的板"。四份台账落在同一处。

**附问｜"催办次数"这类靠自觉记录的数字换不换**
→ 用户答：yes I prefer use the hard goal and not the feeling
→ 结论：只留硬指标。13 的口径改成「节点一次通过率 + 外包延期天数」，删掉"我催了几次"（自觉记录，事后补不出来也容易自欺）。公开稿第五节与第八节同步改，并写进第九节待确认："落不下去的指标宁可换掉，也不要靠印象补数"。

### 元问题：对话顺序要不要倒过来

用户问：if the dialogue sequence backward better? cuz i think u reading the doc is from begin, the times more and more the beginning of the token cost more. is my opinion true?

→ 回答要点（结论已执行）：
1. 方向对——成本确实随轮次增长；但原因不是顺序，**读全文件的 token 与顺序无关**。
2. 倒序反而更贵：新内容要插到文件头，每次都是一次改写；追加到末尾是最便宜的写入。
3. 注意力上不亏：长文档里开头和结尾都是高注意力位置，中间才是 lost in the middle。
4. 真正省成本的三条：只读尾部（offset）；顶部放结论索引；按轮次拆文件（已选单文件，不用）。
→ 已执行：本文件顶部加「目录与当前结论（索引）」，正文继续只追加不倒序。

**英文纠正（第六轮）**
- "construct the basement" → **build the foundation**（basement = 地下室；foundation = 地基）
- "the detail have no thought" → **I haven't thought through the details yet**
- "the terminalogies is easy to learn" → **the terminology is easy to learn**（terminology 通常作不可数）
- "truth tell the story" → **the facts tell the story** / **let the facts speak**
- "jump in the situation" → **jump into the real situation**
- "didn't have too much Values" → **doesn't add much value**
- "I prefer use the hard goal" → **I prefer hard metrics over feelings**
- "if the dialogue sequence backward better" → **Would it be better to put the dialogue in reverse order?**
- "the beginning of the token cost more" → **the earlier rounds cost more tokens**

## 第七轮：第一周任务（week-one mission）

**Q1｜第一周到底交付几样东西**
三件深做都能"现在开始"，但一周里真能完成的很有限。贪多会变成三张空表格，那是最糟的结果——空模板不是证据，反而让你觉得"我做过了"。第一周只该立起架子并产生第一条真实记录。

→ 用户答：okay
→ 结论：三样——①《设备端与 AI 服务端联调 checklist》初稿；②变更台账一张表，本周内至少填进一条真实变更；③当前阶段 WBS 一页 + 工期估算。补底 5 小时花在③，做事线花在①②。**第一周成功判据只有一条：台账里出现第一条真实记录。**

**Q2｜接口 checklist 到底列哪些字段**
字段草案：协议与版本号 / 数据格式与编码 / 采样率与帧长 / 超时与重试策略 / 异常返回码定义 / 鉴权方式 / 字段命名与单位（时间戳单位、字节序）/ 版本兼容与回退策略 / 双方确认人与确认方式。

→ 用户反问：except the api checklist is there have other list? how many list need pm checkout
→ 结论（已答复）：PM 不需要很多清单，原则是**每张 checklist 对应一个触发时机**，5 张足够覆盖 14 件动作：
1. **联调 checklist**（触发：设备端与服务端联调前）← 第一周做
2. **需求确认清单**（触发：新需求进来）——字段：验收标准是什么、影响哪些模块、谁拍板、会挤掉什么
3. **发布/验收 checklist = DoD**（触发：有人说"做完了"的时候）
4. **外部交付验收标准**（触发：外部交付物到手；对象待改，见 Q4）
5. **风险清单**（不是 checklist，是活的登记表，每周看一次）
另有**变更台账**（不是 checklist，是流水账）。

**Q3｜第一次变更向谁开口、用什么形式**
6 的主证据是"把代价摆出来让对方自己决定"。如果是微信群口头说，一年后连自己说过什么都不记得。

→ 用户答：usually request the boss
→ 结论：对象是老板，话术要短、带选项（老板不看长篇）：「这个改动要 X 天，会挤掉 Y，二选一——A 做这个把 Y 推掉，B 两个都做延 Z 天。你定。」形式用邮件或钉钉留痕，不在微信群口头说。

**Q4｜外包美术现在处在哪个阶段**
13 的做法取决于现状：进行中的外包没法追溯加验收节点，硬加会让对方觉得你在改规则。

→ 用户答：waiting the boss command, then art outer start make that resources. cuz boss think that will not waste too much time. and the art resources is not the key influence part. the really stuck part is the machenical part and the pcb BOM sheet didnt confirm yet, so pcb cannot print
→ **重大事实**：美术外包还没启动（等老板命令），且不是关键影响部分；**真正的卡点是机械（结构件）与 PCB BOM 未确认，导致 PCB 无法打样**。
→ 由此产生三个待定（第八轮待问）：③的证据是否从"美术外包验收"移到"结构件 / PCB 打样验收"；14（BOM 成本与打样费用）是否从排序第 10 提前；第一周的第一条记录是否改用这条已存在的阻塞。

**Q5｜WBS 拆到多细、工期估用什么单位**
建议一块 = 8～40 小时，估两个字段：净工时 + 日历天数。

→ 用户答：just 1day(8h)/person, alright this is the wrong way. how to calculate the 'pure worktime' after then is that still the day person?
→ 结论（已答复）：
* **别用"1 天 = 8 小时"当净工时。** 人一天真正动手的有效时间是 4–6 小时（其余是会议、沟通、等待、切换），先按 **5 小时**记，一个月后按实际校准。
* 两个字段分开：**effort（净工时，小时）** 与 **duration（日历天数）**。duration ≠ effort÷5，还要单列"等待"（等 BOM 确认、等打样）。
* 单位：内部只用**小时 + 天**；"人天 / 人日"是 effort 与 duration 的混合体，只在对外报价时用，内部估算不要用它。
* 一个任务可以 effort 只有 2 小时、duration 却是 3 周（等 PCB 打样）——**他项目现在的卡点在 duration，不在 effort。**
* 一个月后算自己的**膨胀系数** = 实际 duration ÷ (effort ÷ 5)，这个数字比任何估算方法都值钱。

**英文纠正（第七轮）**
- "except the api checklist is there have other list? how many list need pm checkout" → **Besides the API checklist, are there other checklists? How many checklists does a PM need to go through?**
- "usually request the boss" → **the request usually comes from the boss**
- "waiting the boss command, then art outer start make that resources" → **we're waiting for the boss's go-ahead; then the external artist starts making the assets**（outer → external / outsourced）
- "cuz boss think that will not waste too much time" → **because the boss thinks it won't take much time**
- "the machenical part" → **the mechanical part**；"the pcb BOM sheet didnt confirm yet" → **the PCB BOM hasn't been confirmed yet**
- "how to calculate the 'pure worktime', after then is that still the day person?" → **how do I calculate pure working time? And after that, is it still measured in person-days?**

## 第八轮：四条线的角色分工与 deadline

（承接第七轮 Q4 的三个待定：③的证据、14 是否提前、第一周第一条记录）

**Q1｜这 4 条线里，哪些是你在亲手做、哪些是别人做你跟进**
这决定①「我能主导」到底有没有空间。主导只能发生在别人做的那条线上——你自己写代码写得再好，也只证明技术强，不证明你能管。如果 4 条线全是你自己干，那这一年得先想办法把其中一条交出去，否则①永远拿不到证据。

→ 用户答：I'm at hardware dev, and the others all other people doing i monitoring
→ **重大事实**：他自己做硬件开发；app 开发、PCB 与模型图、后端 API 与数据库三条线是别人在做、他跟进。
→ 结论（洞察）：**他不是"还没做过管理"，而是"正在做管理动作、但没有记录和命名"**。4 条线里 3 条别人在做他在跟进，这已经是"技术执行 + 跨线协调"的混合岗位，离 PM 只差证据与命名。这也修正了文章的前提：缺的不是经历，是把正在发生的事变成可讲的东西。

**Q2｜外部验收标准这次就用，还是等下一次**
现在正在向外找人做结构件（3D 模型已打样两次、装不上）。两个选择：A 这次就写一份验收标准（什么算合格、分几段、按哪段付款）；B 这次先随便做，等下一次再建机制。

→ 用户答：okay, then follow your advice
→ 结论：这次就上（A），哪怕只有三条——①装配到位（列出配合面与允许间隙）；②外观与支撑痕要求；③交付物格式（源文件 + .step）。加一条"分两段：样件确认 → 最终交付，样件过了才付第二笔"。理由：已经为"没写标准"付过两次打样费，第三次再不写，③的证据就只剩"我又自己上手改了"。

**Q3｜没有历史数据，deadline 怎么给**
BOM 未敲定、又没有可参照的历史工期，硬说一个日期就是编；但"说不出日期"在老板那里等于"你没在管"。

→ 用户答：okay
→ 结论：不给单点日期，给"区间 + 前提 + 阻塞状态"三件套——
* **区间**：三点估算（乐观 / 最可能 / 悲观），报最可能、留悲观。
* **前提**：每句挂条件「在 BOM 于 D 日确认的前提下，打样 D+12 天回板」；前提不成立，日期自动作废，不算估错。
* **阻塞状态**：WBS 每行加状态字段 `go` / `blocked by X` / `waiting`；把 blocked 明写出来本身就是向老板的第一次升级，而且不需要给日期。
* 附：今天没有历史数据，正是因为以前没记；**第一条记录就是历史的起点**。

## 第九轮：你已经在做管理动作（含 2026-08-10 SOP 的事实）

**Q1｜第一周的第一条真实记录写在哪条线上**
候选：①PCB BOM 未确认（卡住整条线）；②结构件两次打样不合格、正在找外部人；③后端 API 与设备端联调契约。

→ 用户答：ok
→ 结论：选③接口契约，**因为它有时间窗口**——后端正在搭 API 和数据库，现在定契约成本最低，等它建完再改就是返工。第一周：接口 checklist 出初稿并找后端确认（第一条真实记录）；PCB BOM 那条同周内做风险登记 + 向老板升级一次（不需要给日期，只需标 blocked 与前提）；结构件验收标准排第三，等外部人落实后再写。

**Q2｜你在硬件线上亲手做，③「我会放手」的证据从哪来**
③是最致命的怀疑，而唯一的亲手活恰在硬件线——这条线上没有放手对象；另外三条本来就是别人在做，"不自己做"是现状不是选择，也证明不了会放手。

→ 用户答：oh yeah, not do it by myself, at 20260810 I create a SOP to help new employee do his task. setting rules 1 build proccess no error 2 esp not reboot suddenly
→ **重大事实**：**2026-08-10 他已经写过一份 SOP 帮新人上手**，并设了两条验收规则（构建过程无错误、ESP 不突然重启）——"我没自己做，我让别人能做"，这正是第 4 条打③的动作，且**已经发生过**。
→ 结论：③的证据不是"待制造"，而是"已存在、只缺数字"。硬套"新人上手耗时前后对比"做不出来（只有一个新人、没有对照组）→ 换成**介入次数**口径：新人遇到问题来找他的次数按周记，看是否下降；越早补录越好（趁人与记录还在，两周后回忆就不准）。
→ 待补事实：**新人现在还在吗？第一周大概找了他几次？**（决定这条证据能否立起来）

**Q3｜怎么把 monitoring 变成 managing**
"跟进"在面试官耳朵里等于"我负责进度跟踪"——正是被判为"不是主导"的那类。差的不是更努力地看，是把看的东西固定成字段。

→ 用户答：okay i recording: 1 what is the delievery item, and when. 2 how the proccess on, blocked by who and rely on what thing. 3 boss determin
→ 结论：接受三字段；但第 3 条口径要调——他写成了"老板定了什么"（已决），而本意是"这条线本周有没有需要老板拍板的事"（待办）。
→ **分成两处**：**待拍板**留在四行表里（每周同步时列出来让老板选，就是"把代价摆出来让他定"的动作）；**已拍板**进变更台账（来源、代价、决定人、日期）。一张表管未来，一本账管过去，不要混。

**英文纠正（第八、九轮）**
- "I'm at hardware dev, and the others all other people doing i monitoring" → **I'm hands-on in hardware development; the other three workstreams are done by other people, and I monitor them**
- "at 20260810 I create a SOP to help new employee do his task" → **on 2026-08-10 I created an SOP to help a new employee with his tasks**
- "setting rules 1 build proccess no error 2 esp not reboot suddenly" → **I set two rules: 1) the build must run without errors, 2) the ESP must not reboot unexpectedly**（proccess → process）
- "i recording: what is the delievery item, and when" → **I'll record: what the deliverable is and when it's due**（delievery → deliverable）
- "how the proccess on, blocked by who and rely on what thing" → **how the work is progressing — blocked by whom, dependent on what**
- "boss determin" → **what the boss decides**（determin → decide/decision）
