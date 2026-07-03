# GEO Beacon UI 重构技术方案

> Version: v1.0
> Author: Frontend Team
> Last Update: 2026-07-03

---

# 一、项目背景

当前管理后台已具备完整功能，但整体视觉风格偏传统 CRUD 管理系统。

存在问题：

- 页面信息密度较低
- Table 使用过多
- 缺少 AI SaaS 产品质感
- 页面层级不明显
- 可复用组件较少
- 后续新增页面容易风格不统一

本次计划统一整个 GEO Beacon 的 UI 风格，建立 Design System，为后续 Prompt、Knowledge、Insight、Citation 等模块提供统一设计规范。

---

# 二、设计目标

## 产品定位

AI SaaS
GEO Platform
B2B 产品
专业感
现代化
国际化

---

## UI 风格

参考产品：

- Vercel
- Linear
- OpenAI Platform
- Resend
- Notion
- Anthropic Console

关键词：

Minimal, Clean, Professional, Readable, Card Layout, Typography First

---

# 三、整体设计原则

## 1. Card First

所有信息均使用 Card 组织。

避免：

- Table
- Form 堆积
- 大量横向布局

推荐：

```
Profile
────────────────────
Market
China
US

Language
Chinese
English

Audience
Marketing Team
Growth Team
```

---

## 2. Typography First

使用字体建立视觉层级。

建议：

Title: 32px
Section: 24px
Card Title: 18px
Body: 14px
Description: 13px
Caption: 12px

字体：
Inter, PingFang SC, 系统字体

---

## 3. Spacing First

统一采用 8px Grid。

```
4, 8, 12, 16, 24, 32, 40, 48, 64
```

禁止随意 padding。

例如：
Card: `padding: 24px;`
Section: `margin-top: 40px;`

---

## 4. Border 优先于阴影

推荐：
`border: 1px solid #E5E7EB`

Shadow：
`0 1px 2px rgba(...)`
尽量避免重阴影。

---

# 四、页面布局

整体 Layout：

```
+------------------------------------------------+
 Sidebar
-----------------------------------------------
Header
-----------------------------------------------
Section
Card
Card
Card
-----------------------------------------------
Footer
+------------------------------------------------+
```

页面宽度：
`max-width: 1200px;`
避免超宽阅读。

---

# 五、页面结构

## Settings

每个模块独立 Card。

## Overview

Statistics, Charts, Recent Activity, Recommendations

## Knowledge

Sources, Documents, Status, Embedding

## Citation

Statistics, Top Sources, Trend, Charts

---

# 六、组件规范

## Button

Primary: 黑色背景，白字
Secondary: 白底，灰边框
Ghost: 无背景，Hover 灰色
Danger: 红色

尺寸：
SM: 32
MD: 40
LG: 48

## Card

统一：
Radius: 12px
Padding: 24px
Border: 1px
Background: White
Hover: `border-color: gray-300`

## Badge

用于：国家、标签、Prompt、Topic
颜色：Primary, Gray, Green, Blue, Orange

## Tag

Prompt, Topic, Knowledge, Entity
均采用 Capsule：`padding: 6 12`
Radius: 999px

## Input

统一高度: 40px
Radius: 8px
Border: Gray-300
Focus: Primary Border, Blue Ring

## Select

支持：Search, Multi Select, Tag Mode
统一高度：40px

## Table

仅用于：数据、日志、搜索结果、分析结果
禁止：Profile, Settings, Metadata
全部改为 Description。

## Description

推荐替代 Table。

---

# 七、颜色规范

Primary: `#111827`
Background: `#FAFAFA`
Card: `#FFFFFF`
Border: `#E5E7EB`
Hover: `#F3F4F6`
Success: `#22C55E`
Warning: `#F59E0B`
Error: `#EF4444`
Info: `#3B82F6`

---

# 八、图标规范

统一：Lucide React
禁止：混用 Iconfont, Ant Design Icon, Material Icon
尺寸：16, 18, 20
推荐：Settings, Database, Book, Chart, Globe, Sparkles, Brain, Search, Message, Folder

---

# 九、响应式规范

Desktop: `>=1280`
Tablet: `768~1279`
Mobile: `<768`

Card 自动折行：
Desktop: 2~3 Columns
Tablet: 2 Columns
Phone: 1 Column

---

# 十、Design Token

colors.ts, spacing.ts, radius.ts

---

# 十一、目录结构

`src/components/...` 等

---

# 十二、推荐技术栈

React, Next.js, TypeScript, TailwindCSS, shadcn/ui, Radix UI, Lucide React, React Hook Form, Zod, TanStack Query, Framer Motion, clsx, tailwind-merge

---

# 十三、开发规范

组件优先，页面禁止重复 CSS，所有颜色来自 Token，统一 Radius，统一 Spacing，统一 Icon，禁止 Magic Number，禁止 Inline Style

---

# 十四、后续规划

Phase 1
- [ ] Design Token
- [ ] Button
- [ ] Card
- [ ] Badge
- [ ] Input

Phase 2
- [ ] Settings
- [ ] Overview
- [ ] Prompt

Phase 3
- [ ] Knowledge
- [ ] Citation
- [ ] Insight

Phase 4
Dark Theme, Animation, Accessibility, Internationalization, Design System 官网

---

# 十五、预期效果

- 产品风格统一
- AI SaaS 品牌感增强
- 页面开发效率提升
- UI 可维护性提升
- 新页面开发成本降低
- 后续支持 Dark Mode 与主题切换
- 为 GEO Beacon 建立长期可扩展的 Design System