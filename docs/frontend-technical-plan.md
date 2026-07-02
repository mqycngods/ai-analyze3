# AI 可见性分析平台前端技术方案

## 1. 背景

本方案基于飞书 Wiki 文档《方案设计以及demo页面》以及文档中的 Profound / Peec 截图参考整理。产品定位为面向品牌、竞品、Prompt、AI 回答、引用来源和行动建议的 **AI 可见性分析平台**。

方案不直接照搬任一参考产品，而是融合两类参考的优势：

- Profound 的分析表达：指标卡、图表、排名表、引用分析和竞品矩阵清晰。
- Peec 的运营密度：全局筛选、Prompt 管理、AI Chats 明细、Topic 分组和来源级追踪更适合生产场景。

第一阶段前端目标是先用 mock data 跑通核心用户路径，验证信息架构、页面密度和交互模式，再接入真实 API。

## 2. 产品范围

### P0 MVP

| 模块 | 定位 | 核心功能 |
| --- | --- | --- |
| 概览 Overview | 快速判断品牌在 AI 回答中的可见性健康度 | Visibility Score、Share of Voice、Average Position、Citation Rate、Top Domains、AI Chats、竞品矩阵预览 |
| Prompt 库 | 管理用于检测的提示词资产 | Topic 分组、Prompt 表格、模型/国家/语言标签、添加/编辑/归档、fan-out queries 生成入口 |
| AI Chats | 查看每个 Prompt 在模型中的回答证据 | 回答列表、品牌高亮、引用来源、情绪、排名、详情侧栏 |
| 设置 Settings | 配置项目基础信息 | 市场、国家、语言、品类、关键词、受众画像、竞品 |
| 项目切换 | 支持多品牌/多客户分析 | 当前项目、项目元信息、项目切换入口 |

### P1

| 模块 | 定位 | 核心功能 |
| --- | --- | --- |
| 引用分析 Citations | 分析 AI 回答引用了哪些域名和页面 | 引用占比、引用分类、热门域名、来源搜索 |
| 竞品分析 Competitors | 对比品牌与竞品在模型/主题/来源上的差距 | 热力矩阵、指标切换、竞品排名 |
| 知识库 Knowledge Base | 为分析和 Agent 提供品牌上下文 | 抓网页、上传文件、抓网站、粘贴文本、Notion 导入、Google Drive 导入 |
| Actions | 把分析结果转成可执行建议 | 内容缺口、引用机会、Prompt 扩展建议、可导出推荐项 |

### P2

| 模块 | 定位 | 核心功能 |
| --- | --- | --- |
| Agent | 自动化分析和内容生成 | 数据查询 Agent、内容生成 Agent、问答 Agent、MCP 配置 |
| 客户诊断 | 独立 onboarding / 交付工作流 | 模型选择、定时检测、历史对比、客户交付报告导出 |
| 用量与账单 | 商业化运营 | 用量统计、套餐展示、账单记录 |

## 3. 信息架构

主导航建议保留 8 个入口：

1. Overview
2. Prompts
3. AI Chats
4. Citations
5. Competitors
6. Knowledge Base
7. Actions
8. Settings

全局筛选建议放在顶部筛选条：

- Project
- Time Range
- Topic
- Prompt Type
- AI Model
- Country
- Language
- Competitor

生产实现中，筛选状态应同步到 URL，便于分享视图、刷新恢复和报告导出：

```txt
/overview?project=creativehit&range=7d&topic=best-ai-creative-tools&model=chatgpt&country=US
```

## 4. 核心 UX 流程

### 主分析流程

1. 用户选择项目和时间范围。
2. 概览页展示当前可见性趋势和核心得分。
3. 用户按 Topic、模型、国家继续筛选。
4. 用户从证据表打开某条 AI Chat。
5. 详情页高亮品牌提及、排名和引用来源。
6. 用户将问题发送到 Actions，或导出当前证据。

### Prompt 管理流程

1. 用户进入 Prompts。
2. 用户按 Topic 或状态筛选。
3. 用户新增 Prompt，或基于种子 Topic 生成 fan-out queries。
4. 用户审核生成结果。
5. 用户激活 Prompt，进入定时检测。

### 知识库导入流程

1. 用户进入 Knowledge Base。
2. 用户选择来源类型：网页、文件、整站抓取、粘贴文本、Notion、Google Drive。
3. 用户上传或连接数据源。
4. 数据源进入解析状态。
5. 解析后的知识被 Agent 和 Actions 使用。

## 5. 前端架构

推荐生产栈：

- Next.js App Router
- TypeScript
- Tailwind CSS 或 CSS Modules
- shadcn/ui 或 Radix UI primitives
- TanStack Query 管理服务端状态
- TanStack Table 支撑复杂高密度表格
- Recharts 或 ECharts 支撑分析图表
- Zustand 或 URL state 管理全局筛选
- Zod 校验 API 响应

当前实现采用 Next.js App Router + TypeScript + 全局 CSS，先不引入图表和表格第三方依赖，用 CSS 图形和 mock data 完成可运行 DEMO。这样可以减少安装复杂度，同时保留后续接入 Recharts、TanStack Table、真实 API 的空间。

当前目录结构：

```txt
app/
  globals.css
  layout.tsx
  page.tsx
components/
  AnalyticsViews.tsx
  DashboardApp.tsx
  Layout.tsx
lib/
  mock-data.ts
docs/
  frontend-technical-plan.md
package.json
tsconfig.json
next.config.mjs
```

## 6. 组件拆分

### Layout

| 组件 | 职责 |
| --- | --- |
| `AppShell` | 页面壳，承载侧边栏、顶部栏、筛选条和内容区 |
| `SidebarNav` | 主模块导航 |
| `TopFilterBar` | 全局筛选和保存视图入口 |
| `ProjectSwitcher` | 当前品牌/客户项目上下文 |

### Analytics

| 组件 | 职责 |
| --- | --- |
| `MetricCard` | KPI 数值、变化趋势和简短说明 |
| `ChartPanel` | 图表容器，包含标题、说明和操作 |
| `VisibilityBars` | 可见性/排名柱状图 |
| `ShareOfVoiceDonut` | 声量份额环形图和图例 |
| `RankTable` | 品牌/域名/模型排名 |
| `CompetitorMatrix` | 竞品差距热力矩阵 |
| `EvidenceTable` | AI 回答证据表 |

### Prompts

| 组件 | 职责 |
| --- | --- |
| `TopicSidebar` | Topic 分组和数量 |
| `PromptTable` | Prompt 指标、状态和标签 |
| `PromptEditorDrawer` | 新增/编辑 Prompt |
| `PromptGeneratorModal` | fan-out query 生成 |

### AI Chats

| 组件 | 职责 |
| --- | --- |
| `ChatList` | AI 回答记录 |
| `AnswerPanel` | AI 回答正文和品牌高亮 |
| `SourceSidebar` | 引用来源列表 |
| `MentionBadge` | 品牌/实体提及标签 |

### Knowledge Base

| 组件 | 职责 |
| --- | --- |
| `AddKnowledgeModal` | 选择导入来源类型 |
| `SourceTypeCard` | 网页/文件/整站/文本/Notion/Drive 选项 |
| `KnowledgeSourceTable` | 数据源解析状态和元信息 |

## 7. 数据模型

```ts
type Project = {
  id: string;
  name: string;
  brand: string;
  market: string;
  countries: string[];
  languages: string[];
};

type Prompt = {
  id: string;
  text: string;
  topicId: string;
  type: "visibility" | "citation" | "sentiment";
  language: string;
  country: string;
  models: string[];
  tags: string[];
  status: "active" | "suggested" | "archived";
};

type AiAnswer = {
  id: string;
  promptId: string;
  model: string;
  answer: string;
  mentions: string[];
  sentiment: number;
  position: number | null;
  citations: CitationSource[];
  createdAt: string;
};

type CitationSource = {
  id: string;
  domain: string;
  url: string;
  title: string;
  type: "ugc" | "editorial" | "corporate" | "institutional" | "reference" | "other";
  citationRate: number;
};

type MetricSnapshot = {
  visibilityScore: number;
  shareOfVoice: number;
  averagePosition: number;
  citationRate: number;
};
```

## 8. API 草案

```txt
GET  /api/projects
GET  /api/overview?projectId=&range=&topic=&model=&country=
GET  /api/prompts?projectId=&topic=&status=
POST /api/prompts
PATCH /api/prompts/:id
POST /api/prompts/generate
GET  /api/chats?projectId=&promptId=&model=&country=
GET  /api/chats/:id
GET  /api/citations?projectId=&range=&topic=
GET  /api/competitors/matrix?projectId=&metric=&model=
GET  /api/knowledge/sources?projectId=
POST /api/knowledge/sources
GET  /api/actions?projectId=&severity=&status=
```

## 9. UI 方向

视觉气质：克制、专业、高密度、偏工作台。

设计原则：

- 白底分析工作区，使用细边框和轻阴影建立层级。
- 品牌绿色只用于身份识别、正向状态和关键高亮。
- 图表和排名表成组出现，帮助用户同时看到趋势和证据。
- 表格需要支持排序、筛选、批量选择和行级更多操作。
- 避免营销落地页式布局，首屏必须是可用的产品界面。

设计 token 草案：

| Token | Value |
| --- | --- |
| `--color-bg` | `#f6f7f4` |
| `--color-surface` | `#ffffff` |
| `--color-border` | `#e1e5dd` |
| `--color-text` | `#171a16` |
| `--color-muted` | `#697064` |
| `--color-brand` | `#4bb62f` |
| `--color-ink` | `#111313` |
| `--radius-sm` | `6px` |
| `--radius-md` | `8px` |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |

## 10. 状态与可访问性

必须覆盖的状态：

- Loading：表格骨架屏、图表占位。
- Empty：说明缺少什么数据，并提供一个主操作。
- Error：提供重试入口和 request id。
- Partial Data：部分模型/国家缺数据时，用非阻塞提示说明。
- Permission：说明缺失的项目或来源访问权限。

可访问性要求：

- 所有交互控件可通过键盘访问。
- 焦点样式必须清晰。
- 表格行和按钮需要具备可读 label。
- 情绪、状态、涨跌不能只依赖颜色表达。
- 文本和控件对比度满足 WCAG AA。

## 11. 开发步骤

1. 搭建 Next.js App Router、TypeScript、全局样式和 mock data。
2. 实现 `AppShell`、侧边栏、顶部栏、全局筛选条和项目上下文。
3. 实现 Overview：指标卡、可见性图表、声量环图、域名表、竞品矩阵、AI Chats 证据表。
4. 实现 Prompts：Topic 分组、Prompt 表格、生成/新增入口。
5. 实现 AI Chats：回答详情、品牌高亮、引用来源侧栏。
6. 实现 Citations、Competitors、Knowledge Base、Actions、Settings 的 MVP 页面。
7. 补齐移动端布局。
8. 加入 API adapter 层，替换 mock data。
9. 引入 TanStack Query、TanStack Table 和图表库。
10. 增加测试、错误边界、权限态和导出流程。

## 12. 验收标准

- 用户可以在核心模块之间切换，无需整页刷新。
- Overview 能在 10 秒内传达当前品牌可见性状态。
- Prompt 库支持 Topic 扫描和状态识别。
- AI Chat 详情能清楚展示回答、品牌提及和引用来源。
- Knowledge Base 展示 6 种导入来源。
- 页面具备空状态、加载态、错误态的组件规范。
- 桌面端和移动端布局都可用。

