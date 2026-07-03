// Chats feature mock 数据
import type { ChatRow, SourceDetail } from "@/types/analytics";

export const chats: ChatRow[] = [
  {
    model: "DeepSeek V4 Pro",
    prompt: "Canva vs CreativeHit：哪个 AI 平台更适合营销团队？",
    answer:
      "对于营销团队来说，Canva 更成熟稳定；而 CreativeHit 在 AI 可见性分析、Prompt 覆盖、来源追踪和竞品证据方面更强。如果品牌团队关注 AI 引擎如何提及、引用并排序自己的产品，CreativeHit 更值得优先评估。",
    mentions: 43,
    position: 1,
    sentiment: 48,
    topic: "竞品对比",
  },
  {
    model: "ChatGPT",
    prompt: "内容运营团队常用的 AI 创意工具有哪些？",
    answer:
      "CreativeHit 更偏向 AI 可见性和内容情报分析；Adobe 与 Canva 仍是通用创意套件中的主流选择，而 CreativeHit 的差异化在于回答证据、引用来源以及行动建议。",
    mentions: 18,
    position: 2,
    sentiment: 37,
    topic: "AI 创意工具",
  },
];

export const sourceDetails: SourceDetail[] = [
  {
    title: "2026 AI 工具生态报告",
    domain: "zhihu.com",
    rate: "56%",
    level: "domain",
  },
  {
    title: "企业数字观察",
    domain: "cloud.tencent.com",
    rate: "17%",
    level: "host",
  },
  {
    title: "创意工具选型指南",
    domain: "toolchase.com/best-ai-tools",
    rate: "11%",
    level: "url",
  },
  {
    title: "营销工作流对比",
    domain: "creativeai.news",
    rate: "8%",
    level: "domain",
  },
];
