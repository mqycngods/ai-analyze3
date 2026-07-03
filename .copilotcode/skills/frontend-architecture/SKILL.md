---
name: frontend-architecture
description: SaaS 前端架构规范（Feature First + 三层分离）。当需要创建新功能模块、重构组件结构、添加业务逻辑或规划目录结构时使用此 skill，确保代码符合 Feature First 架构、UI/Logic/Style 三层分离以及 Agent 可解析的结构标准。
---

# SaaS 前端架构规范 v2（Feature First + Agent Friendly）

> Next.js + TypeScript + SCSS Modules  
> 核心目标：可扩展 / 可定位 / 强复用 / Agent 可开发

---

## 一、标准项目目录结构

```
项目根目录/
├── app/                        # Next.js App Router（仅路由层，不写业务逻辑）
│   ├── layout.tsx
│   ├── page.tsx
│   └── [route]/
│       └── page.tsx
│
├── features/                  # 业务模块（核心，按业务域划分）
│   ├── overview/              # 概览分析
│   │   ├── components/        # 该 feature 的 UI 组件
│   │   ├── hooks/             # 该 feature 的逻辑 hooks
│   │   ├── services/          # 该 feature 的 API 调用
│   │   ├── store/             # 该 feature 的状态
│   │   ├── types/             # 该 feature 的类型
│   │   └── index.ts           # 统一对外入口
│   ├── prompts/
│   ├── chats/
│   ├── citations/
│   ├── knowledge/
│   ├── insights/
│   └── settings/
│
├── components/                # 跨 feature 的通用业务组件
│   └── layout/
│       ├── AppShell/
│       │   ├── AppShell.tsx
│       │   ├── AppShell.module.scss
│       │   └── index.ts
│       └── DashboardApp/
│
├── ui/                        # Design System 基础组件（无任何业务逻辑）
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.scss
│   │   └── index.ts
│   ├── Card/
│   ├── Badge/
│   ├── Input/
│   ├── Select/
│   └── Tag/
│
├── hooks/                     # 全局通用 hooks
│   └── useToast.ts
│
├── services/                  # 全局 API 层
│   ├── http.ts                # HTTP 客户端封装
│   └── [domain].service.ts
│
├── store/                     # 全局状态管理
│   └── [domain].store.ts
│
├── types/                     # 全局类型定义
│   ├── nav.ts
│   ├── analytics.ts
│   └── index.ts
│
├── lib/                       # 工具函数
│   ├── utils.ts
│   └── tokens/                # Design tokens
│
└── styles/                    # 全局样式
    └── globals.scss
```

---

## 二、组件文件结构规范（必须遵守）

每个组件必须采用**目录结构**，包含以下文件：

```
ComponentName/
├── index.ts              # 统一导出
├── ComponentName.tsx     # JSX 结构层
├── ComponentName.module.scss  # 样式层（SCSS Module）
├── useComponentName.ts   # 逻辑层（可选，复杂时必须）
└── types.ts              # 类型定义（可选）
```

### 示例：PromptCard

```
features/prompts/components/PromptCard/
├── index.ts
├── PromptCard.tsx
├── PromptCard.module.scss
├── usePromptCard.ts
└── types.ts
```

---

## 三、TSX 组件规范

### 3.1 组件内部结构顺序（必须遵守）

```tsx
// 1. imports
import styles from './PromptCard.module.scss'
import { usePromptCard } from './usePromptCard'

// 2. types（内联或从 types.ts 导入）
type Props = { ... }

export function PromptCard({ data }: Props) {
  // 3. hooks
  const { isLoading } = usePromptCard(data.id)

  // 4. state
  const [open, setOpen] = useState(false)

  // 5. computed（useMemo）
  const status = useMemo(() => {
    return data.score > 80 ? 'high' : 'low'
  }, [data.score])

  // 6. handlers
  function handleClick() { ... }

  // 7. render
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{data.title}</h3>
    </div>
  )
}
```

### ❌ 禁止行为

- JSX 内写复杂逻辑（三元嵌套超过2层必须提取）
- 组件内直接调用 API
- render 中写业务计算逻辑
- 一个文件超过 200 行（拆分为子组件）

---

## 四、SCSS Module 规范

### 4.1 命名规范（BEM-lite）

```scss
// 块
.card { ... }

// 元素（驼峰）
.cardHeader { ... }
.cardTitle { ... }
.cardBody { ... }
.cardFooter { ... }

// 修饰符（双中横线）
.card--active { ... }
.card--disabled { ... }
```

### 4.2 标准模板

```scss
.card {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
  }
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cardTitle {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}
```

### ❌ 禁止行为

- 全局 class（所有 class 必须通过 SCSS Module 隔离）
- Tailwind 与 SCSS Module 混合使用（选一种，feature 层统一用 SCSS Module）
- `style={{}}` inline style（设计 token 变量除外）

---

## 五、Feature 模块规范

### 5.1 Feature 目录结构

```
features/prompts/
├── components/           # 该 feature 的 UI 组件
│   ├── PromptCard/
│   ├── PromptList/
│   └── PromptToolbar/
├── hooks/               # 逻辑 hooks
│   ├── usePromptList.ts
│   └── usePromptFilter.ts
├── services/            # API 调用
│   └── prompts.service.ts
├── store/               # 状态（Zustand / Jotai）
│   └── prompts.store.ts
├── types/               # 类型定义
│   └── index.ts
└── index.ts             # 统一对外入口（仅导出需要跨模块使用的内容）
```

### 5.2 Feature 隔离规则

```
✅ 允许：
  features/prompts 内部自由引用
  import { PromptCard } from '@/features/prompts'  // 通过 index.ts 入口

❌ 禁止：
  import something from '@/features/citations/components/InternalComponent'
  // 不允许直接引用其他 feature 的内部文件
```

---

## 六、Hooks 规范

```ts
// usePromptList.ts
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

### ❌ 禁止

- hooks 中包含 JSX
- 直接操作 DOM（除非封装成 useRef）
- hook 内部不可复用的逻辑

---

## 七、Service 层规范（API）

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

### ❌ 禁止

- API 调用写在组件内
- API 散落在 hooks 而不在 service 层统一管理
- 直接使用 fetch/axios 而不经过 http 封装

---

## 八、Store 规范（状态管理）

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

## 九、Page Layer 规范

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

### ❌ 禁止

- 页面中写业务逻辑
- 页面直接 fetch 数据
- 页面中写 store 操作

---

## 十、UI Layer 规范

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

## 十一、命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `PromptCard.tsx` |
| Hook 文件 | camelCase + use前缀 | `usePromptList.ts` |
| Service 文件 | camelCase + .service | `prompts.service.ts` |
| Store 文件 | camelCase + .store | `prompts.store.ts` |
| 类型文件 | 统一 `index.ts` 或 `types.ts` | `types/index.ts` |
| SCSS Module | 同组件名 + .module.scss | `PromptCard.module.scss` |
| Feature 目录 | kebab-case | `features/prompts/` |

---

## 十二、Agent 开发规则

### 12.1 修改范围

Agent 每次修改只能：
- 修改某一个 feature 的内部文件
- 修改 ui 层的基础组件
- 修改 services 层的 API 封装
- **不允许在单次任务中跨多个 feature 重构**

### 12.2 代码定位路径

```
feature名称 → component名称 → layer（tsx/hook/scss） → 文件
```

示例：
```
prompts → PromptCard → tsx → features/prompts/components/PromptCard/PromptCard.tsx
prompts → PromptCard → hook → features/prompts/components/PromptCard/usePromptCard.ts
prompts → PromptCard → style → features/prompts/components/PromptCard/PromptCard.module.scss
```

### 12.3 输出要求

每次代码变更必须说明：
1. **修改的文件列表**
2. **修改原因**（解决什么问题）
3. **影响范围**（哪些组件/页面会受影响）

---

## 十三、复用层级模型

```
ui/           →  基础 UI 原子组件（Button, Card, Input）
components/   →  跨 feature 的通用业务组件（AppShell, DashboardApp）
features/     →  业务特定组件（PromptCard, CitationChart）
```

引用方向只能从上到下：
```
features → components → ui   ✅
ui → features                ❌ 禁止反向依赖
```

---

## 十四、样式分层

| 层级 | 文件 | 作用 |
|------|------|------|
| Global | `styles/globals.scss` | CSS Reset、CSS 变量、主题 token |
| UI | `ui/*/Component.module.scss` | Design System 组件样式 |
| Component | `components/*/Component.module.scss` | 跨 feature 通用组件样式 |
| Feature | `features/*/components/*/Component.module.scss` | 业务特定样式 |

---

## 十五、当前项目迁移映射

| 原文件 | 迁移目标 |
|--------|---------|
| `components/ui/*.tsx` | `ui/*/` 目录结构 |
| `components/Layout.tsx` | `components/layout/AppShell/` |
| `components/DashboardApp.tsx` | `components/layout/DashboardApp/` |
| `components/AnalyticsViews.tsx`（OverviewPage等） | `features/[name]/components/` |
| `lib/mock-data.ts`（类型） | `types/analytics.ts` |
| `lib/mock-data.ts`（数据） | `features/[name]/services/` |
| `lib/utils.ts` | `lib/utils.ts`（保持） |
| `lib/tokens/` | `lib/tokens/`（保持） |

---

## 十六、设计目标验收标准

| 目标 | 验收标准 |
|------|---------|
| 可扩展 | 新增 feature 只需在 `features/` 创建新目录，不修改其他模块 |
| 可定位 | 任何组件 5 秒内通过 `feature → component → layer → file` 路径找到 |
| 可复用 | UI 组件可直接跨项目复用；feature 组件通过 index.ts 入口跨 feature 复用 |
| Agent 可开发 | 每个 feature 完全自治，AI 可安全修改单个 feature 不影响其他模块 |
| 可维护 | 代码规模翻倍时，目录结构不会失控 |
