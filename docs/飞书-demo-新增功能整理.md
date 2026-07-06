# 飞书 Demo 新增功能整理

读取页面：`方案设计以及demo页面`

本次重新读取后，文档相较上一版有明显更新：

- 图片/媒体 token 从 20 个增加到 49 个，新增 29 个普通图片/白板资源。
- 功能表从 5 列变为 6 列，新增了「优先级」列。
- 表格总行数从 18 行调整为 17 行，部分功能被合并和重排。
- 新增一个 MVP 验证思路白板资源。

## 1. 新增结构变化

### 新增「优先级」列

现在每个模块都标注了实现优先级：

| 模块 | 优先级 |
| --- | --- |
| 概览数据看板 | P0 |
| 引用 | P0 |
| 情绪 | P0 |
| 声量份额 | P0 |
| 平均排名 | P0 |
| 竞品 gap 分析 | P0 |
| Prompt 库 | P0 |
| Agent | P1 |
| 设置/Profile | P1 |
| 竞品配置 | P1 |
| 知识库 | P2 |
| 账单 | P2 |
| 客户诊断 | P2 |
| 项目管理 | P3 |

结论：当前 Demo 的真正首期范围应聚焦在 **概览分析 + Prompt 管理 + 核心指标拆解 + 竞品 gap**，Agent/设置为第二梯队，知识库/账单/客户诊断为后续增强。

## 2. P0 新增/增强功能

### 2.1 引用分析粒度增强

原先只有「引用」模块，现在新增了引用来源层级定义：

| 层级 | 示例 | 产品含义 |
| --- | --- | --- |
| domain | `tencent.com` | 公司/主域级别 |
| host | `cloud.tencent.com` | 产品线/子站级别 |
| url | `cloud.tencent.com/developer/article/2507661` | 具体文章/页面级别 |

前端需要支持：

- 引用来源按 `domain / host / url` 三层钻取。
- 引用表格支持来源层级切换。
- 引用详情页展示公司级、子站级、页面级贡献。
- 后续 Source Gap 可以复用这套来源数据结构。

### 2.2 情绪分析进入 P0

情绪从截图参考扩展为 P0 功能。

前端需要支持：

- 情绪得分卡：正向/中性/负向。
- 情绪趋势图。
- 按品牌、模型、Topic 过滤情绪。
- 在 AI Chats 中高亮情绪来源句子。
- 表格中展示 sentiment score 和 delta。

### 2.3 声量份额进入 P0 独立分析

声量份额不只是 Overview 的小图，而是 P0 指标。

前端需要支持：

- Share of Voice 环图/柱状图。
- 品牌排名表。
- 模型维度拆分。
- Topic 维度拆分。
- 与竞品对比的份额变化。

### 2.4 平均排名进入 P0 独立分析

平均排名被明确标为 P0。

前端需要支持：

- Average Position 指标卡。
- 品牌排名柱状图。
- 模型维度排名。
- Topic 维度排名。
- 趋势 delta：上升/下降/无变化。

### 2.5 竞品 gap 分析增强

原先是「竞品gap分析」，现在补充了两个明确子方向：

| 新增方向 | 含义 |
| --- | --- |
| Source-Gap Analysis | 竞品被引用但我方未覆盖的来源缺口 |
| Brand Insights | 品牌层面的可见性洞察、优势/劣势总结 |

前端需要支持：

- 竞品矩阵：品牌 x 模型 / 品牌 x Topic / 品牌 x 来源。
- Source Gap 表：来源、域名类型、竞品覆盖、我方覆盖、gap score。
- Brand Insights 卡片：强项、弱项、建议动作。
- 从 gap 项一键生成 Action。

## 3. Prompt 模块增强

Prompt 库仍为 P0，但新增截图强化了以下能力：

| 功能 | 说明 |
| --- | --- |
| Topic 分组 | 左侧 Topic 列表与数量统计 |
| Prompt 生成/扩展 | 从种子 Prompt 生成 fan-out queries |
| Prompt 指标列 | Visibility、Sentiment、Position、Mentions、Volume |
| Prompt 标签 | 支持 tags、intent、branding、location、status |
| Prompt 详情 | 单个 Prompt 下钻到 AI Chats / 引用 / 来源 |

前端需要把 Prompt 从普通列表升级为「提示词管理台」：

- 左侧 Topic Sidebar。
- 主区高密度 Prompt Table。
- 顶部状态 tab：Active / Suggested / Archived。
- 支持 Add Prompt、Generate、Archive、批量操作。
- Prompt 与 AI Chats、Actions 打通。

## 4. Agent 模块新增内容

Agent 模块优先级为 P1，本次新增内容更明确：

| 新增功能 | 说明 |
| --- | --- |
| 调用预置 skills/tools | Agent 可以调用内置工具能力 |
| 集成多个外部 MCP | 支持配置和调用外部 MCP 服务 |
| 预置 skills | 内置常见分析、查询、内容生成技能 |
| 数据查询 Agent | 根据自然语言查询分析数据 |
| 生文 Agent / 内容生成 | 基于洞察生成内容、报告或建议 |
| 问答 Agent | 基于项目数据和知识库回答问题 |

前端需要支持：

- Agent 工作台页面。
- Agent 类型卡片：数据查询、内容生成、问答。
- MCP 连接管理。
- Tools/Skills 列表。
- 调用历史和运行状态。
- 失败/权限不足/等待授权状态。

## 5. 知识库模块调整

知识库被标为 P2，但新增图继续强化「多来源」导入。

需要支持的来源：

- 抓取页面 URL。
- 上传文件。
- 抓取网站。
- 粘贴文本。
- Notion 导入。
- Google Drive 导入。

前端建议：

- P0/P1 阶段只保留入口和空状态。
- P2 阶段实现完整 Source 列表、解析状态、同步状态、失败重试。
- 与 Agent 打通，作为 Agent 的上下文来源。

## 6. Actions 模块变化

文档中新增说明：`行动建议：不一定需要界面，可包含在 agent 中`。

这意味着 Actions 有两种产品形态：

| 方案 | 优点 | 风险 |
| --- | --- | --- |
| 独立 Actions 页面 | 任务清单清晰，适合运营执行 | MVP 页面数增加 |
| 融入 Agent | 更轻量，和自动化建议结合紧密 | 建议沉淀和追踪弱 |

建议 MVP 处理：

- P0 保留 Overview / Gap 分析中的「Send to Actions」入口。
- P1 先做轻量建议列表。
- P2 再决定是否拆成完整 Actions 页面。

## 7. 设置模块增强

设置/Profile 被标为 P1，并新增了 Tags 相关参考。

设置模块应拆成：

| 子模块 | 内容 |
| --- | --- |
| Profile | 市场、国家、语言、品类、关键词、受众画像 |
| Tags | Prompt/Topic/来源/竞品的标签体系 |
| Competitors | 竞品品牌、域名、别名、监控范围 |
| Usage | Prompt 数、模型调用量、运行次数、配额 |
| Billing | 套餐、账单、付款状态 |

其中：

- Profile / Tags / Competitors：建议 P1。
- Usage / Billing：建议 P2。

## 8. 项目管理调整

项目管理被标为 P3，仅保留多项目切换。

说明当前 Demo 阶段不应深做项目管理，建议只实现：

- 顶部 Project Switcher。
- 当前项目基本信息。
- 多项目切换占位。

## 9. 客户诊断模块保留为 P2

客户诊断仍是独立 onboarding / 后台配置页，功能包括：

- 模型/平台选择。
- 排名、提及、引用、情绪、推荐位置。
- 历史对比。
- 定时检测。
- 客户交付报告导出。

建议作为后续「交付型工作流」单独设计，不并入当前主分析台首版。

## 10. 对当前 Next Demo 的影响

当前已实现的 Next Demo 已覆盖：

- Overview
- Prompts
- AI Chats
- Citations
- Competitors
- Knowledge Base
- Actions
- Settings

根据新增内容，下一轮应优先补充：

1. Citation 数据层级：`domain / host / url`。
2. Source Gap Analysis 页面或 Competitors 子视图。
3. Brand Insights 卡片。
4. Prompt 表格新增 Volume、Branding、Intent、Tags、Location、Status。
5. Agent 页面：Tools/Skills/MCP 配置与运行记录。
6. Settings 页面拆分 Profile、Tags、Competitors、Usage、Billing。
7. Actions 调整为「可独立，也可由 Agent 承载」的轻量建议系统。

