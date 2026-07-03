// Insights feature mock 数据
import type { BrandInsightGroup } from "@/types/analytics";

export const sourceGapRows = [
  ["cloud.tencent.com", "host", "Canva / Adobe", "未覆盖", "89"],
  ["future.a16z.com", "host", "Canva", "低覆盖", "76"],
  ["toolchase.com/best-ai-tools", "url", "Midjourney", "未覆盖", "71"],
] as const;

export const brandInsights: BrandInsightGroup[] = [
  {
    title: "优势",
    items: ["在中文 AI 创意工具 Topic 中保持第一提及", "提示词与证据链表达完整"],
  },
  {
    title: "弱项",
    items: ["权威媒体来源仍偏少", "竞品对比场景下商业型 Prompt 覆盖不足"],
  },
  {
    title: "建议动作",
    items: [
      "优先补齐媒体与企业站来源",
      "从 Source Gap 一键生成内容任务和新增 Prompt",
    ],
  },
];
