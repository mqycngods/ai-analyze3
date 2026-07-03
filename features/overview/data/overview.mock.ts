// 概览分析 mock 数据
import type {
  ActionRecommendation,
  BrandMetric,
  OverviewMetric,
  ShareOfVoiceItem,
  SourceCoverageItem,
} from "@/types/analytics";

export const overviewMetrics: OverviewMetric[] = [
  {
    label: "可见性得分",
    value: "100%",
    delta: "持平",
    deltaType: "neutral",
    note: "最近 7 天保持满分",
    badge: "领先",
    badgeType: "success",
  },
  {
    label: "声量份额",
    value: "7.7%",
    delta: "+0.6%",
    deltaType: "positive",
    note: "较上周小幅提升",
  },
  {
    label: "平均排名",
    value: "3.5",
    delta: "↓ 0.2",
    deltaType: "positive",
    note: "排名数值越低越好",
  },
  {
    label: "AI 回答覆盖",
    value: "68%",
    delta: "+8%",
    deltaType: "positive",
    note: "ChatGPT 与 Gemini 贡献最高",
  },
  {
    label: "引用率",
    value: "43%",
    delta: "-4%",
    deltaType: "negative",
    note: "来源覆盖仍需补齐",
  },
];

export const visibilityTrend = [
  { date: "06-27", value: 100 },
  { date: "06-28", value: 100 },
  { date: "06-29", value: 100 },
  { date: "06-30", value: 100 },
  { date: "07-01", value: 100 },
  { date: "07-02", value: 100 },
  { date: "07-03", value: 100 },
];

export const averagePositionTrend = [
  { date: "06-27", value: 3.7 },
  { date: "06-28", value: 3.68 },
  { date: "06-29", value: 3.62 },
  { date: "06-30", value: 3.58 },
  { date: "07-01", value: 3.54 },
  { date: "07-02", value: 3.5 },
  { date: "07-03", value: 3.46 },
];

export const shareOfVoice: ShareOfVoiceItem[] = [
  { name: "Midjourney", value: 7.7, color: "#22C55E" },
  { name: "Adobe", value: 7.7, color: "#EF4444" },
  { name: "Canva", value: 7.7, color: "#3366FF" },
  { name: "ElevenLabs", value: 7.7, color: "#F97316" },
  { name: "Ideogram", value: 7.7, color: "#EC4899" },
  { name: "Other", value: 61.5, color: "#8A8F8D" },
];

export const visibilityRows: BrandMetric[] = [
  { name: "Midjourney", score: 100, sov: 7.7, sentiment: 58, position: 3.5 },
  { name: "Adobe", score: 100, sov: 7.7, sentiment: 54, position: 4.8 },
  { name: "Canva", score: 100, sov: 7.7, sentiment: 52, position: 4.2 },
  { name: "ElevenLabs", score: 100, sov: 7.7, sentiment: 49, position: 4 },
  { name: "Ideogram", score: 100, sov: 7.7, sentiment: 47, position: 5 },
];

export const shareRows: BrandMetric[] = visibilityRows;

export const rankingRows: BrandMetric[] = [
  { name: "OpenAI", score: 96, sov: 6.2, sentiment: 66, position: 1 },
  { name: "Autodraw", score: 84, sov: 5.4, sentiment: 55, position: 2 },
  { name: "Claude", score: 82, sov: 5.1, sentiment: 57, position: 2 },
  { name: "Jasper", score: 74, sov: 4.2, sentiment: 48, position: 3 },
  { name: "Midjourney", score: 100, sov: 7.7, sentiment: 58, position: 3.5 },
];

export const sourceCoverage: SourceCoverageItem[] = [
  { name: "ChatGPT", value: 100 },
  { name: "Gemini", value: 100 },
  { name: "Claude", value: 82 },
  { name: "Perplexity", value: 74 },
  { name: "Bing Copilot", value: 68 },
];

export const actionRecommendations: ActionRecommendation[] = [
  {
    icon: "1",
    title: "扩展 Perplexity 可引用来源",
    description: "补齐 3 篇对比评测与 2 个产品文档入口。",
    priority: "高优先",
  },
  {
    icon: "2",
    title: "更新 Midjourney 替代方案页面",
    description: "强化价格、商用授权和中文工作流内容。",
    priority: "中优先",
  },
  {
    icon: "3",
    title: "建立周度竞品排名监控",
    description: "跟踪 OpenAI、Canva、Adobe 的排名变化。",
    priority: "中优先",
  },
];
