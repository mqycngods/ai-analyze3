---
name: frontend-architecture
description: SaaS 前端架构规范（Feature First + 三层样式分离 + Agent Friendly）。当需要创建新功能模块、新增页面、新增业务组件、重构目录结构、编写 SCSS 样式或规划 Feature 时使用此 skill，确保代码符合 Feature First 架构、Page/PageStyle/Component 三层分离以及 Agent 可解析的结构标准。
---

# SaaS 前端架构规范 v3（Feature First + 三层样式 + Agent Friendly）

> Next.js App Router + TypeScript + SCSS Modules + Tailwind
> 核心目标：可扩展 / 可定位 / 强复用 / Agent 可开发

---

## 核心原则

1. **Feature First**：业务模块按业务域划分，每个 Feature 是可独立开发、维护、扩展的业务单元。
2. **Page 是编排层**：Page 只负责组织业务组件，不负责实现业务组件。
3. **三层样式分离**：Global Style → Page Style → Component Style，各司其职，禁止越界。
4. **Agent Friendly**：每次修改控制在当前业务单元内，满足 `feature → page/component → layer → file` 可定位路径。

---

## 一、标准项目目录结构

```
项目根目录/
├── app/                        # Next.js App Router（仅路由层）
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css             # Tailwind 入口（保留）
│
├── features/                   # 业务模块（核心，按业务域划分）
│   └── prompt/
│       ├── page/               # 页面编排层
│       │   ├── PromptPage.tsx
│       │   ├── PromptPage.module.scss
│       │   ├── PromptPage.hooks.ts
│       │   ├── PromptPage.types.ts
│       │   ├── PromptPage.constants.ts
│       │   └── index.ts
│       ├── components/         # 业务组件
│       │   └── PromptCard/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── utils/
│       ├── types/
│       ├── constants/
│       └── index.ts
│
├── components/                 # 跨 feature 通用业务组件
│   └── layout/
│       ├── AppShell/
│       └── DashboardApp/
│
├── ui/                         # Design System 基础组件（无业务逻辑）
│   ├── Button/
│   ├── Card/
│   ├── Badge/
│   ├── Input/
│   └── Tag/
│
├── styles/                     # 全局 SCSS 样式
│   ├── _tokens.scss            # 设计 token（SCSS 变量，供 .module.scss @use）
│   └── _mixins.scss            # 可复用 mixin（供 .module.scss @use）
│
├── lib/                        # 工具函数 + tokens
├── services/                   # 全局 API 层
├── store/                      # 全局状态管理
├── types/                      # 全局类型定义
└── hooks/                      # 全局通用 hooks
```

---

## 二、Feature 规范（Business First）

Feature 是一个完整的业务模块（Business Domain），负责组织页面、业务组件、状态、接口及配置。**Feature 不负责基础 UI，也不负责通用组件。**

### 2.1 Feature 目录结构

```
features/prompt/
├── page/                # 页面编排层
├── components/          # 业务组件（PromptCard / PromptFilter / PromptToolbar / PromptTable）
├── hooks/               # 逻辑 hooks
├── services/            # API 调用
├── store/               # 状态（Zustand）
├── utils/               # 工具函数
├── types/               # 类型定义
├── constants/           # 常量
└── index.ts             # 统一对外入口
```

### 2.2 Feature 隔离规则

```
✅ 允许：
  features/prompts 内部自由引用
  import { PromptCard } from '@/features/prompts'  // 通过 index.ts 入口

❌ 禁止：
  import X from '@/features/citations/components/InternalComponent'
  // 不允许直接引用其他 feature 的内部文件
```

---

## 三、Page 规范（页面编排层）

Page **不是组件**，而是页面编排层（Orchestration Layer）。

### 3.1 Page 只负责

- 页面布局
- 页面级状态
- 路由参数
- 页面权限
- SEO / Metadata
- 业务组件编排

### 3.2 Page 禁止

- 编写复杂 UI（Card / Table / Chart）
- 编写 API 请求
- 编写复杂业务逻辑

### 3.3 Page 文件结构

```
page/
├── PromptPage.tsx              # JSX 编排
├── PromptPage.module.scss      # 页面布局样式
├── PromptPage.hooks.ts         # 页面级逻辑
├── PromptPage.types.ts         # 页面级类型
├── PromptPage.constants.ts     # 页面级常量
└── index.ts
```

### 3.4 PromptPage.tsx 示例

```tsx
export default function PromptPage() {
  return (
    <div className={styles.page}>
      <PromptToolbar />
      <PromptFilter />
      <PromptTable />
      <Pagination />
    </div>
  )
}
```

> **页面只负责组织业务组件，不负责实现业务组件。**

---

## 四、Page Style 规范（页面样式）

每一个 Page 必须拥有独立的样式文件：`PromptPage.module.scss`。

### 4.1 Page Style 只负责

- Grid / Flex / Container / Layout
- Section / Gap
- Responsive / Sidebar / Main Area

```scss
.page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}
```

### 4.2 Page Style 禁止

禁止在 `PromptPage.module.scss` 中编写：Button / Card / Table / Input / Modal / Tooltip / Badge / Typography。这些样式必须放到对应组件的 `.module.scss` 中。

---

## 五、Business Component 规范

业务组件负责：UI / 交互 / 内部状态 / 内部样式 / 内部事件。

### 5.1 组件文件结构

```
PromptCard/
├── index.ts                    # 统一导出
├── PromptCard.tsx              # JSX 结构层
├── PromptCard.module.scss      # 样式层（SCSS Module）
├── PromptCard.hooks.ts         # 逻辑层（复杂时必须）
├── PromptCard.types.ts         # 类型定义（可选）
└── PromptCard.constants.ts     # 常量（可选）
```

组件拥有自己的样式，**禁止页面修改组件样式**。

### 5.2 TSX 组件内部结构顺序

```tsx
// 1. imports
// 2. types
export function PromptCard({ data }: Props) {
  // 3. hooks
  // 4. state
  // 5. computed（useMemo）
  // 6. handlers
  // 7. render
  return <div className={styles.card}>...</div>
}
```

---

## 六、样式职责划分（三层分离）

```
Global Style  →  Page Style  →  Component Style
```

| 层级 | 位置 | 职责 |
|------|------|------|
| Global | `styles/` + `app/globals.css` | Reset / Theme / Token / Font / Variable（Tailwind 管全局 CSS，SCSS `_tokens`/`_mixins` 供 module 引用） |
| Page | `PromptPage.module.scss` | 页面布局 / Grid / Container / Responsive / Section |
| Component | `PromptCard.module.scss` | Card / Button / Typography / Color / Hover / Animation / Padding / Border Radius |

### 6.1 样式修改原则

- 修改页面布局 → ✅ 修改 `PromptPage.module.scss`
- 修改组件样式 → ✅ 修改 `PromptCard.module.scss`
- ❌ 禁止在 `PromptPage.module.scss` 中修改 `PromptCard` 样式

### 6.2 SCSS Module 命名（BEM-lite）

```scss
.card { }              // 块
.cardHeader { }        // 元素（驼峰）
.card--active { }      // 修饰符（双中横线）
```

### 6.3 SCSS 禁止行为

- 全局 class（所有 class 必须通过 SCSS Module 隔离）
- `style={{}}` inline style（设计 token 变量除外）
- 在 Page Style 中写组件样式

### 6.4 SCSS 基础设施

项目已配置 `styles/` 目录，通过 `sassOptions.includePaths` 可直接 `@use`：

```scss
// 在任意 .module.scss 中
@use 'tokens' as *;
@use 'mixins' as *;

.card {
  @include card-base;
  @include card-hover;
}
```

---

## 七、Agent 定位规范

### 7.1 修改页面时

```
需求 → Feature → Page → PromptPage.tsx → PromptPage.module.scss
```

### 7.2 修改组件时

```
需求 → Business Component → PromptCard → PromptCard.tsx → PromptCard.module.scss
```

每一次修改都应控制在当前业务单元内，避免跨模块、跨页面或跨组件修改。

### 7.3 代码定位路径

```
feature名称 → component名称 → layer（tsx/hook/scss） → 文件
```

示例：
```
prompts → PromptCard → tsx   → features/prompts/components/PromptCard/PromptCard.tsx
prompts → PromptCard → hook  → features/prompts/components/PromptCard/PromptCard.hooks.ts
prompts → PromptCard → style → features/prompts/components/PromptCard/PromptCard.module.scss
```

### 7.4 修改范围

Agent 每次修改只能：
- 修改某一个 feature 的内部文件
- 修改 ui 层的基础组件
- 修改 services 层的 API 封装
- **不允许在单次任务中跨多个 feature 重构**

---

## 八、复用层级模型

```
ui/           →  基础 UI 原子组件（Button, Card, Input）
components/   →  跨 feature 通用业务组件（AppShell, DashboardApp）
features/     →  业务特定组件（PromptCard, CitationChart）
```

引用方向只能从上到下：
```
features → components → ui   ✅
ui → features                ❌ 禁止反向依赖
```

---

## 九、命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `PromptCard.tsx` |
| Hook 文件 | camelCase + use前缀 | `usePromptList.ts` |
| Service 文件 | camelCase + .service | `prompts.service.ts` |
| Store 文件 | camelCase + .store | `prompts.store.ts` |
| 类型文件 | `types.ts` 或 `index.ts` | `types/index.ts` |
| SCSS Module | 同组件名 + .module.scss | `PromptCard.module.scss` |
| Feature 目录 | kebab-case | `features/prompts/` |

---

## 十、详细规范

完整的 Hooks / Service / Store / Page Layer / UI Layer 规范、SCSS 标准模板、TSX 示例及迁移映射，请参阅：

See [development-conventions.md](references/development-conventions.md) for complete specifications.
