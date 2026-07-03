# 开发规范详细参考

> 本文档是 `frontend-architecture` skill 的详细规范补充。
> 包含 Hooks / Service / Store / Page Layer / UI Layer / SCSS 完整模板与示例。

## 目录

1. [Hooks 规范](#一hooks-规范)
2. [Service 层规范](#二service-层规范api)
3. [Store 规范](#三store-规范状态管理)
4. [Page Layer 规范](#四page-layer-规范)
5. [UI Layer 规范](#五ui-layer-规范)
6. [SCSS Module 完整模板](#六scss-module-完整模板)
7. [TSX 组件完整示例](#七tsx-组件完整示例)
8. [样式分层详解](#八样式分层详解)
9. [当前项目迁移映射](#九当前项目迁移映射)
10. [设计目标验收标准](#十设计目标验收标准)

---

## 一、Hooks 规范

```ts
// features/prompts/hooks/usePromptList.ts
import { useState, useEffect } from 'react'
import type { PromptRow } from '../types'
import { promptsService } from '../services/prompts.service'

export function usePromptList() {
  const [data, setData] = useState<PromptRow[]>([])
  const [loading, setLoading] = useState(false)

  // 只写逻辑，不写 UI
  async function fetchList() {
    setLoading(true)
    const result = await promptsService.list()
    setData(result)
    setLoading(false)
  }

  useEffect(() => { fetchList() }, [])

  return { data, loading, refetch: fetchList }
}
```

### 禁止

- hooks 中包含 JSX
- 直接操作 DOM（除非封装成 useRef）
- hook 内部不可复用的逻辑

---

## 二、Service 层规范（API）

```ts
// services/http.ts
export const http = {
  get: <T>(url: string) => fetch(url).then(r => r.json() as Promise<T>),
  post: <T>(url: string, body: unknown) => fetch(url, {
    method: 'POST',
    body: JSON.stringify(body)
  }).then(r => r.json() as Promise<T>)
}

// features/prompts/services/prompts.service.ts
import { http } from '@/services/http'
import type { PromptRow } from '../types'

export const promptsService = {
  list: () => http.get<PromptRow[]>('/api/prompts'),
  detail: (id: string) => http.get<PromptRow>(`/api/prompts/${id}`),
  create: (data: Partial<PromptRow>) => http.post<PromptRow>('/api/prompts', data),
}
```

### 禁止

- API 调用写在组件内
- API 散落在 hooks 而不在 service 层统一管理
- 直接使用 fetch/axios 而不经过 http 封装

---

## 三、Store 规范（状态管理）

```ts
// features/prompts/store/prompts.store.ts
import { create } from 'zustand'
import type { PromptRow } from '../types'

type PromptsStore = {
  list: PromptRow[]
  selectedId: string | null
  setList: (list: PromptRow[]) => void
  setSelectedId: (id: string | null) => void
}

export const usePromptsStore = create<PromptsStore>((set) => ({
  list: [],
  selectedId: null,
  setList: (list) => set({ list }),
  setSelectedId: (id) => set({ selectedId: id }),
}))
```

### 规则

- Store 只存状态，不写 API 调用
- 不写 UI 逻辑
- 每个 feature 独立 store

---

## 四、Page Layer 规范

页面（`app/*/page.tsx`）只允许做**组件编排**：

```tsx
// app/page.tsx
import { DashboardApp } from '@/components/layout/DashboardApp'

export default function Home() {
  return <DashboardApp />
}

// 或功能页
export default function PromptsPage() {
  return (
    <>
      <PromptStats />
      <PromptToolbar />
      <PromptList />
    </>
  )
}
```

### 禁止

- 页面中写业务逻辑
- 页面直接 fetch 数据
- 页面中写 store 操作

---

## 五、UI Layer 规范

`ui/` 目录只允许存放**纯 UI 组件**：

```
ui/
├── Button/
├── Card/
├── Input/
├── Badge/
├── Tag/
├── Select/
└── Dialog/
```

### 规则

- 100% 无业务逻辑
- 100% 可复用（跨 feature / 跨项目）
- 不依赖任何 feature 的数据结构
- Props 只接受基础类型和回调函数

---

## 六、SCSS Module 完整模板

### 6.1 组件样式模板（PromptCard.module.scss）

```scss
@use 'tokens' as *;
@use 'mixins' as *;

.card {
  padding: $spacing-lg;
  border-radius: $radius-lg;
  background: $color-card;
  border: 1px solid $color-border;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
  }
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.cardTitle {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-foreground;
}

.card--active {
  border-color: $color-primary;
}
```

### 6.2 页面样式模板（PromptPage.module.scss）

```scss
@use 'tokens' as *;

.page {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.header {
  margin-bottom: $spacing-xl;
}

.content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: $spacing-lg;
}

.section {
  margin-top: 40px;
}
```

> 注意：Page Style 只写布局，不写组件视觉样式。

### 6.3 可用 Token 速查

| Token | 值 | 用途 |
|-------|-----|------|
| `$color-primary` | `#3366ff` | 主色 |
| `$color-foreground` | `#111827` | 文字主色 |
| `$color-background` | `#fafafa` | 页面背景 |
| `$color-card` | `#ffffff` | 卡片背景 |
| `$color-border` | `#e5e7eb` | 边框 |
| `$color-muted-foreground` | `#6b7280` | 次要文字 |
| `$spacing-md` | `16px` | 中间距 |
| `$spacing-lg` | `24px` | 大间距 |
| `$radius-lg` | `16px` | 大圆角 |
| `$transition-base` | `0.2s ease` | 基础过渡 |

### 6.4 可用 Mixin 速查

| Mixin | 用途 |
|-------|------|
| `@include flex($dir, $justify, $align, $gap)` | Flex 布局 |
| `@include flex-center` | 居中 |
| `@include flex-between` | 两端对齐 |
| `@include grid($columns, $gap)` | Grid 布局 |
| `@include truncate($lines)` | 文本截断 |
| `@include card-base` | 卡片基础样式 |
| `@include card-hover` | 卡片 hover 效果 |
| `@include focus-ring($color)` | 焦点环 |
| `@include breakpoint-up($size)` | 响应式（min-width） |
| `@include scrollbar-thin` | 美化滚动条 |

---

## 七、TSX 组件完整示例

```tsx
// features/prompts/components/PromptCard/PromptCard.tsx
import { useState, useMemo } from 'react'
import styles from './PromptCard.module.scss'
import { usePromptCard } from './PromptCard.hooks'
import type { PromptCardProps } from './PromptCard.types'

export function PromptCard({ data }: PromptCardProps) {
  // hooks
  const { isLoading } = usePromptCard(data.id)

  // state
  const [open, setOpen] = useState(false)

  // computed
  const status = useMemo(() => {
    return data.score > 80 ? 'high' : 'low'
  }, [data.score])

  // handlers
  function handleClick() {
    setOpen(!open)
  }

  // render
  return (
    <div className={`${styles.card} ${status === 'high' ? styles['card--active'] : ''}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{data.title}</h3>
      </div>
    </div>
  )
}
```

### 禁止行为

- JSX 内写复杂逻辑（三元嵌套超过 2 层必须提取）
- 组件内直接调用 API
- render 中写业务计算逻辑
- 一个文件超过 200 行（拆分为子组件）

---

## 八、样式分层详解

```
Global Style
    │
    ▼
Page Style
    │
    ▼
Component Style
```

### Global Style

位置：`styles/` + `app/globals.css`

负责：Reset / Theme / Token / Font / Variable

说明：
- `app/globals.css`（Tailwind）负责全局 CSS：reset、`:root` CSS 自定义属性、body 基础样式
- `styles/_tokens.scss` 提供 SCSS 变量，供 `.module.scss` 局部 `@use`，**不输出全局 CSS**
- `styles/_mixins.scss` 提供 mixin，供 `.module.scss` 局部 `@use`，**不输出全局 CSS**

> 重要：SCSS 的 `_tokens` / `_mixins` 是 partial 文件，仅作为编译时变量/mixin 被各 `.module.scss` 局部引用，不污染全局样式。全局样式统一由 Tailwind 管理，避免冲突。

### Page Style

位置：`features/*/page/PromptPage.module.scss`

负责：页面布局 / Grid / Container / Responsive / Section

### Component Style

位置：`features/*/components/PromptCard/PromptCard.module.scss`

负责：Card / Button / Typography / Color / Hover / Animation / Padding / Border Radius

### 样式修改原则

```
修改页面布局：
✅ 修改 PromptPage.module.scss

修改组件样式：
✅ 修改 PromptCard.module.scss

禁止：
PromptPage.module.scss → 修改 PromptCard 样式  ❌
```

---

## 九、当前项目迁移映射

| 原文件 | 迁移目标 |
|--------|---------|
| `components/ui/*.tsx` | `ui/*/` 目录结构 |
| `components/Layout.tsx` | `components/layout/AppShell/` |
| `components/DashboardApp.tsx` | `components/layout/DashboardApp/` |
| `components/AnalyticsViews.tsx`（OverviewPage 等） | `features/[name]/components/` |
| `lib/mock-data.ts`（类型） | `types/analytics.ts` |
| `lib/mock-data.ts`（数据） | `features/[name]/services/` |
| `lib/utils.ts` | `lib/utils.ts`（保持） |
| `lib/tokens/` | `lib/tokens/`（保持） + `styles/_tokens.scss`（SCSS 镜像，供 module 引用） |

---

## 十、设计目标验收标准

| 目标 | 验收标准 |
|------|---------|
| 可扩展 | 新增 feature 只需在 `features/` 创建新目录，不修改其他模块 |
| 可定位 | 任何组件 5 秒内通过 `feature → component → layer → file` 路径找到 |
| 可复用 | UI 组件可直接跨项目复用；feature 组件通过 index.ts 入口跨 feature 复用 |
| Agent 可开发 | 每个 feature 完全自治，AI 可安全修改单个 feature 不影响其他模块 |
| 可维护 | 代码规模翻倍时，目录结构不会失控 |
