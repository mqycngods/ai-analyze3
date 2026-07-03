# AI 可见性分析平台页面风格预估

目标：先生成可判断的风格方向，不直接覆盖当前主页面。你确认方向后，再进入 token、组件和页面的统一改造。

当前产品是 B2B 分析台，信息密度高，核心用户需要快速比较品牌、模型、Prompt、引用来源和行动建议。因此风格不能做成营销页或展示型大屏，而应该保持高效、可扫描、适合长期使用。

## 推荐优先级

我建议优先考虑 **方案 A：Editorial Analyst**。

原因：

- 和 Profound / Peec 参考最贴近，但比当前默认 shadcn 风格更有品牌识别度。
- 适合高密度表格、指标卡、来源分析、Agent 运行记录。
- 后续实现成本最低，主要改 token、卡片、表格、导航和图表配色。
- 不会过度依赖深色背景或强视觉效果，适合客户演示和真实工作台。

## 方案 A：Editorial Analyst

关键词：专业、克制、编辑部、可信、轻量品牌感。

适用场景：默认推荐。适合 SaaS 分析台、咨询交付、客户报告、长期使用。

### 视觉方向

- 背景：温和灰白，不使用纯白铺满，降低长时间阅读疲劳。
- 卡片：白底、细边框、轻阴影，半径 8px。
- 强调色：品牌绿 + 深墨黑，少量蓝色用于信息态。
- 图表：黑/绿主色，灰色作为对照。
- 表格：紧凑、行高低、分隔线轻，hover 只做浅色提示。

### Token 草案

```css
:root {
  --background: 84 20% 97%;
  --foreground: 105 10% 10%;
  --card: 0 0% 100%;
  --muted: 90 14% 93%;
  --muted-foreground: 96 8% 42%;
  --primary: 105 12% 8%;
  --primary-foreground: 0 0% 98%;
  --accent: 112 56% 45%;
  --border: 90 12% 86%;
  --ring: 112 56% 45%;
  --radius: 0.5rem;
}
```

### 组件规则

| 组件 | 样式 |
| --- | --- |
| Sidebar | 白底、深色 active、绿色小图标 |
| Topbar | 半透明浅灰，sticky，细边框 |
| MetricCard | 数字大、标题小、delta 用绿色 |
| Table | 12-13px 字号，轻分隔线，紧凑行高 |
| Chart | 以黑/绿柱图、热力矩阵为主 |
| Badge | 背景浅色，文字高对比 |

### 风险

- 如果品牌想更科技或更有冲击力，这套会显得偏稳。

## 方案 B：Signal Command

关键词：指挥中心、深色、实时监控、技术感。

适用场景：希望 Demo 第一眼更有冲击力，强调 Agent、MCP、实时分析。

### 视觉方向

- 背景：近黑蓝或墨黑。
- 卡片：深色面板，边框带轻微发光。
- 强调色：电光绿 + 青蓝。
- 图表：高亮线条、发光热力矩阵、状态灯。
- 信息密度：仍然高，但需要更强分区，避免暗色疲劳。

### Token 草案

```css
:root {
  --background: 220 28% 7%;
  --foreground: 150 20% 94%;
  --card: 220 24% 10%;
  --muted: 220 18% 15%;
  --muted-foreground: 160 8% 66%;
  --primary: 142 78% 56%;
  --primary-foreground: 220 28% 7%;
  --accent: 190 92% 56%;
  --border: 220 18% 22%;
  --ring: 142 78% 56%;
  --radius: 0.5rem;
}
```

### 组件规则

| 组件 | 样式 |
| --- | --- |
| Sidebar | 深色，active 使用绿色描边/填充 |
| Topbar | 深色玻璃态，状态信息更突出 |
| MetricCard | 数字发光感，delta 用状态色 |
| Table | 深色斑马纹，边框弱化 |
| Chart | 绿色/青色高亮，矩阵更像监控热图 |
| Badge | 低透明背景 + 高亮文字 |

### 风险

- 客户实际长期使用可能更累。
- 表格和长文本可读性需要额外打磨。
- 与 Peec/Profound 参考的白底生产工具差异较大。

## 方案 C：Executive Briefing

关键词：咨询报告、高端、留白、客户交付。

适用场景：客户诊断、对外报告、销售演示、投资人/管理层汇报。

### 视觉方向

- 背景：冷白 + 微暖纸感。
- 卡片：更大留白、更少边框、模块像报告章节。
- 强调色：深海军蓝 + 金色/绿色小面积点缀。
- 图表：简洁、少色、突出结论。
- 表格：行高更大，适合阅读，不追求极限密度。

### Token 草案

```css
:root {
  --background: 45 18% 97%;
  --foreground: 220 26% 12%;
  --card: 0 0% 100%;
  --muted: 42 20% 93%;
  --muted-foreground: 220 10% 44%;
  --primary: 220 50% 18%;
  --primary-foreground: 0 0% 98%;
  --accent: 145 45% 36%;
  --border: 42 14% 84%;
  --ring: 145 45% 36%;
  --radius: 0.375rem;
}
```

### 组件规则

| 组件 | 样式 |
| --- | --- |
| Sidebar | 更像目录，导航弱化 |
| Topbar | 报告标题感，保留导出/分享 |
| MetricCard | 更像管理层简报，附解释文案 |
| Table | 低密度，更清晰的列标题 |
| Chart | 用较少颜色表达结论 |
| Badge | 更克制，接近文档标签 |

### 风险

- 对高频运营人员来说可能不够紧凑。
- 复杂 Prompt 表格会显得占空间。

## 方案 D：Ops Console

关键词：高密度、操作台、产品后台、效率优先。

适用场景：团队内部日常运营、Prompt 批量管理、Agent 任务追踪。

### 视觉方向

- 背景：纯灰白，减少视觉装饰。
- 卡片：边框清晰，阴影极少。
- 强调色：蓝/绿组合，语义色更丰富。
- 表格：最强，高密度、多筛选、多状态。
- 图表：服务于扫描，不追求视觉冲击。

### Token 草案

```css
:root {
  --background: 210 18% 97%;
  --foreground: 220 18% 12%;
  --card: 0 0% 100%;
  --muted: 210 18% 94%;
  --muted-foreground: 220 8% 44%;
  --primary: 216 90% 42%;
  --primary-foreground: 0 0% 98%;
  --accent: 142 64% 40%;
  --border: 214 18% 84%;
  --ring: 216 90% 42%;
  --radius: 0.375rem;
}
```

### 组件规则

| 组件 | 样式 |
| --- | --- |
| Sidebar | 类后台导航，图标小，active 高亮清楚 |
| Topbar | 筛选优先，标题弱化 |
| MetricCard | 小尺寸，更多指标一屏展示 |
| Table | sticky header、紧凑行、强 hover |
| Chart | 小图表、sparkline、mini bars |
| Badge | 语义色丰富，支持批量状态 |

### 风险

- 品牌感弱，第一眼不如其他方案高级。
- 更像工具后台，客户演示时记忆点较弱。

## 字体建议

| 方案 | 标题字体 | 正文字体 | 说明 |
| --- | --- | --- | --- |
| A Editorial Analyst | IBM Plex Sans | Avenir Next / system sans | 专业、清晰、略有编辑气质 |
| B Signal Command | IBM Plex Mono / Geist Mono | IBM Plex Sans | 技术感强，适合 Agent/MCP |
| C Executive Briefing | Source Serif 4 | IBM Plex Sans | 报告感强，适合客户交付 |
| D Ops Console | Geist Sans | system sans | 高效后台工具感 |

## 状态规范

所有方案都需要保留：

- Loading：表格骨架屏、图表浅色占位。
- Empty：说明缺少数据，并提供一个主操作。
- Error：错误说明 + 重试按钮 + request id。
- Partial Data：部分模型/国家缺数据时用非阻塞 banner。
- Permission：说明缺失权限和下一步授权动作。
- Keyboard Focus：按钮、筛选器、表格行、抽屉关闭按钮都必须有清晰焦点环。

## 实现建议

选定风格后，建议按这个顺序改：

1. 修改 `app/globals.css` 中的 HSL token。
2. 调整 `components/ui/Button.tsx`、`Card.tsx`、`Badge.tsx`、`Input.tsx`、`Select.tsx`。
3. 调整 `components/Layout.tsx` 的 Sidebar / Topbar / Filter strip。
4. 调整 `components/AnalyticsViews.tsx` 的指标卡、表格、图表、矩阵。
5. 补齐响应式和空/加载/错误状态。
6. 运行 `yarn typecheck` 和 `yarn build`。

## 我建议你选择

- 想要最稳、最贴近产品真实形态：选 **A Editorial Analyst**。
- 想要 Demo 更酷、更像 AI/Agent 产品：选 **B Signal Command**。
- 想要对客户/老板汇报更高级：选 **C Executive Briefing**。
- 想要做成内部运营效率工具：选 **D Ops Console**。

本地可视化预览页：`/style-preview`

