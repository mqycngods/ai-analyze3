export type NavId =
  | "overview"
  | "prompts"
  | "chats"
  | "citations"
  | "knowledge"
  | "insights"
  | "settings";

export type NavItem = {
  id: NavId;
  label: string;
  icon: string;
  description: string;
  href: string;
  priority: "P0" | "P1" | "P2";
};

export type FilterChip = {
  label: string;
  value: string;
};

export type BrandMetric = {
  name: string;
  score: number;
  sov: number;
  sentiment: number;
  position: number;
};

export type CitationSourceRow = {
  level: "domain" | "host" | "url";
  source: string;
  retrieved: string;
  citation: string;
  type: string;
};

export type PromptRow = {
  topic: string;
  text: string;
  visibility: string;
  sentiment: string;
  position: string;
  volume: string;
  intent: string;
  branding: string;
  tags: string[];
  location: string;
  status: "启用中" | "建议中" | "已归档";
};

export type ChatRow = {
  model: string;
  prompt: string;
  answer: string;
  mentions: number;
  position: number;
  sentiment: number;
  topic: string;
};

export type TopicGroup = {
  name: string;
  count: number;
};

export const navItems: NavItem[] = [
  {
    id: "overview",
    label: "概览分析",
    icon: "📊",
    description: "可见性、份额、排名与行动入口",
    href: "/?view=overview",
    priority: "P0"
  },
  {
    id: "prompts",
    label: "提示词",
    icon: "🧠",
    description: "Topic 分组、生成、归档与指标管理",
    href: "/?view=prompts",
    priority: "P0"
  },
  {
    id: "chats",
    label: "全部对话",
    icon: "💬",
    description: "AI 回答列表，点击查看对话详情与引用来源",
    href: "/?view=chats",
    priority: "P0"
  },
  {
    id: "citations",
    label: "引用分析",
    icon: "🔗",
    description: "支持 domain / host / url 三层钻取",
    href: "/?view=citations",
    priority: "P0"
  },
  {
    id: "knowledge",
    label: "知识库",
    icon: "📚",
    description: "多来源导入入口与后续结构扩展",
    href: "/?view=knowledge",
    priority: "P2"
  },
  {
    id: "insights",
    label: "洞察",
    icon: "💡",
    description: "竞品 Gap 分析、品牌洞察与行动建议",
    href: "/?view=insights",
    priority: "P0"
  },
  {
    id: "settings",
    label: "设置中心",
    icon: "⚙️",
    description: "Profile、Tags、竞品、用量、账单",
    href: "/?view=settings",
    priority: "P1"
  }
];

export const filterChips: FilterChip[] = [
  { label: "项目", value: "CreativeHit 中国站" },
  { label: "时间范围", value: "最近 7 天" },
  { label: "Topic", value: "AI 创意工具" },
  { label: "Prompt 类型", value: "全部" },
  { label: "模型", value: "ChatGPT / Claude / DeepSeek" },
  { label: "国家", value: "中国" },
  { label: "语言", value: "中文" },
  { label: "竞品", value: "已选择 9 个品牌" }
];

export const brands: BrandMetric[] = [
  { name: "CreativeHit", score: 67, sov: 52, sentiment: 55, position: 1.3 },
  { name: "Midjourney", score: 19, sov: 8, sentiment: 52, position: 2.8 },
  { name: "Fotor", score: 17, sov: 3, sentiment: 50, position: 3.1 },
  { name: "Canva", score: 8, sov: 7.7, sentiment: 41, position: 3.8 },
  { name: "Adobe", score: 6, sov: 7.7, sentiment: 37, position: 5 }
];

export const citationLevels = ["domain", "host", "url"] as const;

export const citationSources: CitationSourceRow[] = [
  {
    level: "domain",
    source: "zhihu.com",
    retrieved: "79.2%",
    citation: "2.6",
    type: "UGC"
  },
  {
    level: "host",
    source: "www.zhihu.com",
    retrieved: "62.4%",
    citation: "2.1",
    type: "UGC"
  },
  {
    level: "url",
    source: "zhihu.com/question/650120178",
    retrieved: "38.6%",
    citation: "1.4",
    type: "问答页"
  },
  {
    level: "domain",
    source: "a16z.com",
    retrieved: "54.2%",
    citation: "1.6",
    type: "媒体"
  },
  {
    level: "host",
    source: "future.a16z.com",
    retrieved: "42.8%",
    citation: "1.2",
    type: "专栏"
  },
  {
    level: "url",
    source: "future.a16z.com/ai-marketing-stack-guide",
    retrieved: "21.3%",
    citation: "0.9",
    type: "文章页"
  },
  {
    level: "domain",
    source: "creativeai.news",
    retrieved: "33.3%",
    citation: "1.4",
    type: "媒体"
  },
  {
    level: "host",
    source: "insights.creativeai.news",
    retrieved: "28.9%",
    citation: "1.1",
    type: "专题页"
  },
  {
    level: "url",
    source: "insights.creativeai.news/brand-visibility-report",
    retrieved: "16.7%",
    citation: "0.7",
    type: "报告页"
  }
];

export const prompts: PromptRow[] = [
  {
    topic: "AI 创意工具",
    text: "适合中小营销团队的最佳 AI 创意工具有哪些？",
    visibility: "67%",
    sentiment: "+55",
    position: "#1.3",
    volume: "4.2k",
    intent: "信息型",
    branding: "品牌词",
    tags: ["核心 Topic", "中文", "品牌曝光"],
    location: "中国",
    status: "启用中"
  },
  {
    topic: "AI 设计工作流",
    text: "Canva 与 CreativeHit 是否能支撑完整 AI 设计工作流？",
    visibility: "100%",
    sentiment: "+39",
    position: "#1.0",
    volume: "2.1k",
    intent: "商业型",
    branding: "竞品对比",
    tags: ["高意图", "竞品", "工作流"],
    location: "中国",
    status: "启用中"
  },
  {
    topic: "Prompt 扩展",
    text: "哪些工具可以把种子 Prompt 扩展成 fan-out 搜索问题？",
    visibility: "-",
    sentiment: "-",
    position: "-",
    volume: "1.3k",
    intent: "信息型",
    branding: "功能词",
    tags: ["建议生成", "增长", "新建"],
    location: "中国",
    status: "建议中"
  },
  {
    topic: "品牌对比",
    text: "CreativeHit 与 Midjourney 在品牌内容团队场景中如何比较？",
    visibility: "42%",
    sentiment: "+26",
    position: "#2.1",
    volume: "980",
    intent: "商业型",
    branding: "竞品对比",
    tags: ["对比页", "品牌词", "北美扩展"],
    location: "美国",
    status: "已归档"
  }
];

export const chats: ChatRow[] = [
  {
    model: "DeepSeek V4 Pro",
    prompt: "Canva vs CreativeHit：哪个 AI 平台更适合营销团队？",
    answer:
      "对于营销团队来说，Canva 更成熟稳定；而 CreativeHit 在 AI 可见性分析、Prompt 覆盖、来源追踪和竞品证据方面更强。如果品牌团队关注 AI 引擎如何提及、引用并排序自己的产品，CreativeHit 更值得优先评估。",
    mentions: 43,
    position: 1,
    sentiment: 48,
    topic: "竞品对比"
  },
  {
    model: "ChatGPT",
    prompt: "内容运营团队常用的 AI 创意工具有哪些？",
    answer:
      "CreativeHit 更偏向 AI 可见性和内容情报分析；Adobe 与 Canva 仍是通用创意套件中的主流选择，而 CreativeHit 的差异化在于回答证据、引用来源以及行动建议。",
    mentions: 18,
    position: 2,
    sentiment: 37,
    topic: "AI 创意工具"
  }
];

export const sourceDetails = [
  {
    title: "2026 AI 工具生态报告",
    domain: "zhihu.com",
    rate: "56%",
    level: "domain"
  },
  {
    title: "企业数字观察",
    domain: "cloud.tencent.com",
    rate: "17%",
    level: "host"
  },
  {
    title: "创意工具选型指南",
    domain: "toolchase.com/best-ai-tools",
    rate: "11%",
    level: "url"
  },
  {
    title: "营销工作流对比",
    domain: "creativeai.news",
    rate: "8%",
    level: "domain"
  }
];

export const topics: TopicGroup[] = [
  { name: "全部 Topic", count: 40 },
  { name: "AI 创意工具", count: 13 },
  { name: "AI 内容生产", count: 7 },
  { name: "设计工作流", count: 6 },
  { name: "Prompt 扩展", count: 5 },
  { name: "视觉素材", count: 3 }
];

export const overviewMetrics = [
  {
    label: "可见性得分",
    value: "67%",
    delta: "较上周 +12 个点",
    note: "AI 回答覆盖"
  },
  {
    label: "声量份额",
    value: "52%",
    delta: "较上周 +7.4%",
    note: "品牌提及占比"
  },
  {
    label: "平均排名",
    value: "#1.3",
    delta: "上升 2 位",
    note: "跨模型均值"
  },
  {
    label: "引用率",
    value: "43%",
    delta: "来源覆盖缺口 -8%",
    note: "可信来源覆盖"
  },
  {
    label: "情绪得分",
    value: "+55",
    delta: "正向占比继续提升",
    note: "正向 / 中性 / 负向"
  }
];

export const sourceGapRows = [
  ["cloud.tencent.com", "host", "Canva / Adobe", "未覆盖", "89"],
  ["future.a16z.com", "host", "Canva", "低覆盖", "76"],
  ["toolchase.com/best-ai-tools", "url", "Midjourney", "未覆盖", "71"]
] as const;

export const brandInsights = [
  {
    title: "优势",
    items: ["在中文 AI 创意工具 Topic 中保持第一提及", "提示词与证据链表达完整"]
  },
  {
    title: "弱项",
    items: ["权威媒体来源仍偏少", "竞品对比场景下商业型 Prompt 覆盖不足"]
  },
  {
    title: "建议动作",
    items: ["优先补齐媒体与企业站来源", "从 Source Gap 一键生成内容任务和新增 Prompt"]
  }
] as const;

export const settingsSections = [
  {
    title: "Profile",
    rows: [
      ["市场", "中国、美国"],
      ["语言", "中文、英文"],
      ["品类", "AI 创意工具、内容运营、品牌可见性"],
      ["受众", "营销团队、增长团队、品牌策略团队"]
    ]
  },
  {
    title: "Tags",
    rows: [
      ["Prompt 标签", "品牌词、竞品对比、功能词、高意图"],
      ["Topic 标签", "AI 创意工具、Prompt 扩展、设计工作流"],
      ["来源标签", "UGC、媒体、企业站、报告页"]
    ]
  },
  {
    title: "Competitors",
    rows: [
      ["监控品牌", "Canva、Adobe、Midjourney、Fotor、Jasper、Ideogram、OpenAI"],
      ["域名规则", "支持主域、子站和别名监控"],
      ["监控范围", "品牌词、功能词、对比词"]
    ]
  },
  {
    title: "Usage / Billing",
    rows: [
      ["Prompt 数", "50 个启用中，12 个建议中"],
      ["模型调用量", "本月 12,480 次"],
      ["套餐状态", "Growth 年付版"],
      ["账单状态", "正常，下一次扣费 2026-07-18"]
    ]
  }
] as const;
