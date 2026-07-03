// 概览分析 mock 数据
import type { OverviewMetric, ShareOfVoiceItem, SourceCoverageItem, ActionRecommendation, BrandMetric } from "@/types/analytics";

export const overviewMetrics: OverviewMetric[] = [
  {
    label: "可见性得分",
    value: "67%",
    delta: "↑ 12%",
    deltaType: "positive",
    note: "较上周 +12 个点",
    badge: "良好",
    badgeType: "success",
  },
  {
    label: "AI 回答覆盖",
    value: "52%",
    delta: "↑ 7.4%",
    deltaType: "positive",
    note: "较上周 +7.4%",
  },
  {
    label: "平均排名",
    value: "#1.3",
    delta: "↑ 2",
    deltaType: "positive",
    note: "上升 2 位",
  },
  {
    label: "引用率",
    value: "43%",
    delta: "↓ 8%",
    deltaType: "negative",
    note: "来源覆盖缺口 -8%",
  },
  {
    label: "情绪得分",
    value: "+55",
    delta: "",
    deltaType: "neutral",
    note: "正向占比持续提升",
    badge: "积极",
    badgeType: "success",
  },
];

export const visibilityTrend = [
  { date: "06-27", value: 32 },
  { date: "06-28", value: 38 },
  { date: "06-29", value: 42 },
  { date: "06-30", value: 48 },
  { date: "07-01", value: 52 },
  { date: "07-02", value: 58 },
  { date: "07-03", value: 67 },
];

export const shareOfVoice: ShareOfVoiceItem[] = [
  { name: "CreativeHit", value: 52, color: "#3366FF" },
  { name: "Midjourney", value: 19, color: "#22C55E" },
  { name: "Fotor", value: 17, color: "#F59E0B" },
  { name: "Canva", value: 8, color: "#F97316" },
  { name: "Adobe", value: 6, color: "#EF4444" },
];

export const sourceCoverage: SourceCoverageItem[] = [
  { name: "GPT", value: 68 },
  { name: "Gemini", value: 52 },
  { name: "Claude", value: 36 },
  { name: "Perplexity", value: 28 },
  { name: "Bing Copilot", value: 18 },
];

export const actionRecommendations: ActionRecommendation[] = [
  {
    icon: "🎯",
    title: "加强 Reddit 内容布局",
    description: "在社区讨论中增加品牌曝光",
    priority: "高优先",
  },
  {
    icon: "📝",
    title: "发布技术博客文章",
    description: "提升在技术来源的覆盖",
    priority: "中优先",
  },
  {
    icon: "📖",
    title: "优化产品使用指南",
    description: "增加长尾关键词问题覆盖",
    priority: "中优先",
  },
  {
    icon: "❓",
    title: "扩展常见问题库",
    description: "提高信息完整性和引用率",
    priority: "低优先",
  },
];

export const brands: BrandMetric[] = [
  { name: "CreativeHit", score: 67, sov: 52, sentiment: 55, position: 1.3 },
  { name: "Midjourney", score: 19, sov: 8, sentiment: 52, position: 2.8 },
  { name: "Fotor", score: 17, sov: 3, sentiment: 50, position: 3.1 },
  { name: "Canva", score: 8, sov: 7.7, sentiment: 41, position: 3.8 },
  { name: "Adobe", score: 6, sov: 7.7, sentiment: 37, position: 5 },
];
