---
name: ui-design
description: Guide for implementing the UI Design System. Use this skill when you need to create or refactor UI components, pages, or layouts to ensure they follow the established design guidelines, tokens, and component specifications.
---

# GEO Beacon UI Design System

This skill provides the design guidelines and specifications for the GEO Beacon UI.

## Core Principles

- **Card First**: Organize all information using Cards. Avoid tables and form stacking where possible.
- **Typography First**: Use typography to establish visual hierarchy (Inter, PingFang SC).
- **Spacing First**: Strictly adhere to the 8px grid system.
- **Border over Shadow**: Prefer 1px solid borders (`#E5E7EB`) over heavy shadows.
- **Feature First**: 业务组件必须优先落在 `features/`，跨 feature 复用组件落在 `components/`，纯基础组件落在 `ui/`。
- **Layer Split**: 组件必须按 UI / Logic / Style 分层。复杂组件至少拆成 `Component.tsx`、`useComponent.ts`、`Component.module.scss`。
- **Agent Friendly**: 目录必须满足 `feature → component → layer → file` 的可定位路径，禁止把业务逻辑散落在页面或全局组件中。

## Design Tokens

The design system relies on specific tokens for colors, spacing, and radius.

- **Colors**: Primary (`#111827`), Background (`#FAFAFA`), Card (`#FFFFFF`), Border (`#E5E7EB`), etc.
- **Spacing**: 8px grid (4, 8, 12, 16, 24, 32, 40, 48, 64).
- **Radius**: 8px, 12px, 16px, 999px (full).

## Components

The system includes standardized components like Button, Card, Badge, Tag, Input, Select, and Description.

## Detailed Specifications

For the complete and detailed design specifications, including layout structures, component details, and color codes, please refer to the full design document:

## Component-Level Prompt Library (Soft Minimal)

> 用于生成一致风格 UI 组件（Card / KPI / Chart / Table / Insight）

---

# 一、Card 组件 Prompt

## 1. 通用 Card（基础容器）

### Prompt

请设计一个 AI SaaS 风格的 Card 组件，用于数据展示。

要求：

- Soft Minimal 风格
- OpenAI / Linear / Vercel 风格
- 白色背景
- 极浅边框或无边框
- 柔和阴影
- 16px 圆角
- 内边距 24px
- 内容优先
- 不要视觉噪音

特点：

- 用于承载任何模块（KPI / 图表 / 列表 / Insight）
- hover 时轻微上浮（-2px）
- 阴影轻微增强
- 200ms 动画

禁止：

- 重边框
- 强阴影
- 花哨装饰

---

## 2. 信息型 Card（Info Card）

### Prompt

设计一个信息展示 Card，用于展示说明型内容。

结构：

- 标题（18px）
- 描述文本（13px）
- 辅助说明（可选）
- 图标（左侧或顶部）

风格：

- Soft Minimal
- 空气感
- 高可读性
- 不要密集信息

---

## 3. 行动型 Card（Action Card）

### Prompt

设计一个用于“推荐行动”的 Card。

必须包含：

- 标题
- 行动描述
- 优先级标签（High / Medium / Low）
- CTA 按钮

风格：

- AI 推荐系统风格
- 清晰层级
- 按钮突出但不过度强调

---

# 二、KPI 组件 Prompt

## 1. 单 KPI 卡（Primary Metric）

### Prompt

设计一个 AI SaaS KPI Card，用于展示核心指标。

必须包含：

- 指标名称（例如 Visibility Score）
- 大数字（如 67%）
- 趋势变化（↑12% / ↓8%）
- 状态标签（Good / Risk / Stable）
- mini trend line（折线趋势）

视觉要求：

- 数字最大
- 信息极简
- 强层级对比
- Soft Minimal 风格
- 白底卡片
- 轻阴影

重点：

👉 数字必须是视觉焦点

---

## 2. 次级 KPI 卡（Secondary Metric）

### Prompt

设计多个小型 KPI Card（4个一组）

特点：

- 仅显示标题 + 数值 + 趋势
- 无复杂图表
- 紧凑布局
- 用于辅助指标

示例指标：

- Voice Share
- Citation Rate
- Ranking
- Sentiment Score

---

## 3. KPI Grid Layout

### Prompt

设计 KPI 区域布局：

- 1 个主 KPI（大卡）
- 4 个次 KPI（小卡）
- 横向排列 + 自动换行

要求：

- 层级清晰
- 主次分明
- 不要同等重要

---

# 三、Chart 组件 Prompt

## 1. 折线图 Card（Trend Chart）

### Prompt

设计一个折线图 Card，用于展示趋势变化。

必须包含：

- 标题（如 Visibility Trend）
- 描述（1 行解释）
- 折线图
- 时间范围选择（可选）
- AI Insight 简述

风格：

- Soft Minimal
- 蓝色主线
- 轻网格背景
- 无复杂装饰

重点：

👉 图表必须配解释，而不是单独存在

---

## 2. 环形图 Card（Distribution Chart）

### Prompt

设计一个环形图 Card，用于展示比例分布。

必须包含：

- 中心总数
- 分类 legend
- 各项比例
- 简短 AI 解读

示例：

- GPT 68%
- Gemini 52%
- Claude 36%

风格：

- 清晰优先
- 不要3D效果
- 不要渐变过度

---

## 3. 条形排名图（Ranking Chart）

### Prompt

设计一个排名型条形图 Card。

必须包含：

- 排名列表
- 品牌名称
- 占比进度条
- 数值变化（↑ ↓）

特点：

- 可快速比较
- 信息密度适中
- 用于竞争分析

---

# 四、Table 组件 Prompt（Soft Table）

## ⚠️ 重要：AI SaaS Table 规范

不要设计传统 ERP 表格。

必须转为：

👉 “Card Table（卡片表格）”

---

## 1. Prompt 管理 Table（卡片化）

### Prompt

设计一个 Prompt 管理列表组件，但禁止传统表格样式。

要求：

- 每一行是 Card，而不是 table row
- 每个 Card 包含：

  - Prompt 标题
  - 描述
  - 可见性（%）
  - 情绪评分
  - 排名
  - 搜索量
  - Intent
  - Tags
  - 地区
  - 状态 badge
  - 操作按钮

视觉要求：

- Soft Minimal
- 行间距 12-16px
- hover 卡片上浮
- 信息结构清晰

禁止：

❌ 表格线  
❌ grid 边框  
❌ 密集列布局  

---

## 2. Table Header Toolbar

### Prompt

设计 Table 上方工具栏：

必须包含：

- 搜索框（Prompt / Topic）
- Filter 按钮
- Batch Action
- Primary CTA（新增 Prompt）

风格：

- 浮动感
- 简洁
- 不占视觉重点

---

# 五、AI Insight 组件 Prompt

## 1. AI Insight Card（核心组件）

### Prompt

设计一个 AI Insight Card，用于展示 AI 自动分析结果。

必须包含：

- ✨ AI Summary 标题
- 当前分析结论（2~3行）
- 优势点（Strengths）
- 问题点（Weakness）
- 建议行动（Recommendations）
- CTA 按钮（View Details / Apply Action）

视觉要求：

- Soft Blue Background（5%）
- 大留白
- 强阅读性
- 非结构化文本优先

重点：

👉 这是“AI 解释数据”，不是“数据展示”

---

## 2. AI Recommendation Card

### Prompt

设计一个 AI 推荐行动 Card。

必须包含：

- 推荐标题
- 优先级（High / Medium / Low）
- 行动描述
- 预期收益
- CTA（Apply / Generate / Dismiss）

风格：

- 类 Linear Action System
- 非传统 ToDo list
- 更像智能决策系统

---

## 3. Insight Summary Block

### Prompt

设计一个纯文本 AI Summary 区块。

特点：

- 无边框
- 大段文字
- 强可读性
- 类 Notion AI 输出风格
- 重点词轻微加粗

---

# 六、组合规则（非常重要）

## 页面结构组合方式

所有页面必须遵循：

```
Hero
↓
KPI Cards
↓
AI Insight
↓
Charts
↓
Ranking
↓
Table (Card Style)
↓
Action Recommendations
```

---

## 禁止组合方式

❌ KPI + Table 混排  
❌ Chart 无说明  
❌ Card 无层级  
❌ 所有模块同权重  

---

## 推荐组合方式

✔ 主 KPI + 次 KPI  
✔ Chart + Insight  
✔ Table + Action  
✔ Ranking + Trend  

---

# 七、统一设计目标

所有组件必须表达：

- AI Native
- Decision Driven
- High Clarity
- Low Noise
- Soft Minimal
- Enterprise SaaS Level

---

# 八、最终目标体验

用户看到任何组件时必须：

1. 3秒内理解信息
2. 知道重要性排序
3. 知道下一步行动
