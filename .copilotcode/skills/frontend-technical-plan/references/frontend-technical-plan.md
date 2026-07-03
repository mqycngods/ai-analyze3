# GEO Beacon Dashboard UI Design Specification

> Version: 2.0
> Product: GEO Beacon AI
> Style: Soft Minimal
> Design Language: OpenAI + Vercel + Linear
> Updated: 2026-07

---

# 1. 背景

当前 Dashboard 已具备完整的数据分析能力，但整体视觉仍偏传统 Dashboard，主要问题：

- 卡片层级较弱
- 页面阅读节奏不明显
- AI 产品特色不足
- 数据展示缺乏重点
- Card 同质化严重
- 用户进入页面无法第一时间获取关键信息

本次重构目标：

> 从 "Dashboard" 升级为 "AI Decision Workspace"

让页面不仅展示数据，更主动提供洞察和行动建议。

---

# 2. Design Principle

## 2.1 Content First

所有设计服务于内容。

减少：

- 线框
- 边框
- 分割线

增加：

- 留白
- Typography
- 信息层级

---

## 2.2 AI Native

整个产品不是后台。

而是：

AI Workspace

因此：

每个页面都应该拥有：

AI Summary

Recommendation

Insight

Action

而不是只有图表。

---

## 2.3 Soft Minimal

视觉关键词：

Soft

Calm

Readable

Professional

Natural

Clean

大量留白。

轻阴影。

弱边框。

---

# 3. Page Layout

页面采用四层结构：

```
Hero
↓
Metrics
↓
Insights
↓
Analytics
↓
Details
```

页面宽度：

```css
max-width:1360px;
```

左右 Padding：

```css
40px
```

Section Gap：

```css
40px
```

Card Gap：

```css
24px
```

---

# 4. Hero

位于页面顶部。

高度：

160~220px

包含：

```
Dashboard Title
↓
Brand Name
↓
Core KPI
↓
Description
↓
Action Button
```

例如：

```
CreativeHit
Brand Visibility
67%
↑12%
You outperform 86% competitors.
[View Recommendations]
```

目的：

用户 3 秒内知道：

目前表现

是否提升

下一步建议

---

# 5. KPI Section

采用：

```
1 Large Card
+
4 Small Cards
```

不要：

```
5 个一样大的 Card
```

推荐：

```
+----------------------+
Visibility Score
67%
↑12%
Good
+----------------------+
Voice
Citation
Ranking
Sentiment
```

主指标：

宽度：

2 Columns

其它：

1 Column

Card：

Radius：

16

Padding：

24

Shadow：

```css
0 1px 2px rgba(15,23,42,.04)
```

Hover：

```css
translateY(-2)
```

---

# 6. AI Insight

新增模块。

位置：

Hero 下方。

采用：

```
✨ AI Summary
CreativeHit is consistently cited by GPT and Gemini.
Main weakness:
Source diversity.
Recommendation:
Increase citations from Reddit and technical blogs.
```

组成：

Icon

Title

Paragraph

Confidence

Action Button

背景：

Blue 5%

Radius：

16

Padding：

24

---

# 7. Analytics

采用：

```
2 Column
```

左：

Trend

右：

Distribution

例如：

```
Line Chart
Donut Chart
```

Card Header：

```
Title
Description
Menu
```

Card Footer：

```
Summary
View Details
```

不要：

只有 Chart。

---

# 8. Brand Ranking

改造当前：

```
CreativeHit
67%
Midjourney
19%
```

改成：

```
Logo
Brand Name
Progress
67%
↑12%
```

增加：

Avatar

Progress Bar

Trend

Hover

方便快速识别。

---

# 9. Source Distribution

新增：

Stacked Bar

例如：

```
GPT
██████
Gemini
████
Claude
███
Perplexity
██
```

比 Pie 更容易比较。

---

# 10. Recommendation

页面底部新增：

Action Center

```
Priority
Improve Reddit
High
Publish Technical Blog
Medium
Increase FAQ
Medium
```

支持：

Dismiss

Complete

Generate Prompt

---

# 11. Sidebar

宽度：

240

背景：

```css
#FCFCFC
```

Hover：

```css
#F5F5F5
```

Active：

```css
White
Shadow
Blue Icon
```

Icon：

18

Label：

14

Gap：

12

不要：

深色 Active。

---

# 12. Typography

Title：

32

Weight：

600

Section：

22

Card：

18

Body：

14

Caption：

13

Line Height：

1.6

字体：

Inter

PingFang SC

---

# 13. Color

Primary：

```css
#2563EB
```

Background：

```css
#FAFAFA
```

Card：

```css
White
```

Text：

```css
#111827
```

Secondary：

```css
#6B7280
```

Border：

```css
#EEF2F7
```

Success：

```css
#22C55E
```

Warning：

```css
#F59E0B
```

Danger：

```css
#EF4444
```

---

# 14. Component

统一组件：

PageHeader

MetricCard

InsightCard

ChartCard

RankingCard

RecommendationCard

Empty

Loading

Badge

Tag

Avatar

Search

Dropdown

Button

Progress

Stat

Tooltip

ChartLegend

DescriptionList

---

# 15. Card Rule

统一：

Radius：

16

Padding：

24

Background：

White

Border：

Transparent

Shadow：

```css
0 1px 3px rgba(0,0,0,.04)
```

Hover：

```css
translateY(-2)
shadow++
```

---

# 16. Motion

Hover：

200ms

Ease-out

Card：

TranslateY

Button：

Background Fade

Chart：

Opacity

Drawer：

Slide

禁止：

复杂动画。

---

# 17. Empty State

统一：

```
Icon
↓
Title
↓
Description
↓
Primary Button
```

不要：

插画。

保持极简。

---

# 18. Responsive

Desktop：

≥1440

Laptop：

1280

Tablet：

768

Phone：

375

Grid：

Desktop：

```css
12 Columns
```

Tablet：

```css
6 Columns
```

Phone：

```css
1 Column
```

---

# 19. Technical Stack

Framework：

Next.js

Language：

TypeScript

UI：

shadcn/ui

Style：

TailwindCSS

State：

Zustand

Data：

TanStack Query

Chart：

Recharts

Form：

React Hook Form

Validation：

Zod

Theme：

next-themes

Animation：

Framer Motion

Icon：

Lucide

---

# 20. Folder Structure

```txt
src/
components/
layout/
dashboard/
MetricCard/
InsightCard/
ChartCard/
RankingCard/
RecommendationCard/
shared/
Button/
Card/
Badge/
Tag/
Avatar/
Progress/
Search/
Chart/
layout/
Sidebar/
Topbar/
PageHeader/
theme/
tokens/
styles/
pages/
dashboard/
```

---

# 21. Future Evolution

V2

✅ Soft Minimal

✅ Dashboard

✅ AI Summary

---

V3

AI Copilot

Conversation Panel

Realtime Analytics

Dark Mode

Workspace

---

V4

Custom Dashboard

Widget Drag

Plugin

Personalization

Multi Workspace

---

# 22. Design Goal

最终 Dashboard 不再只是数据展示工具。

而是：

AI Workspace

Data Insight

Recommendation Engine

Action Center

形成：

Discover

↓

Understand

↓

Decide

↓

Take Action

完整闭环。
