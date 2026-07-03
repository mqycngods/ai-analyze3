export type InsightTrendPoint = {
  date: string;
  visibility: number;
  domains: number;
};

export type PerformanceBucket = {
  label: string;
  count: number;
  color: string;
};

export type TopRankingRow = {
  rank: number;
  query: string;
  domain: string;
  visibility: string;
  position: string;
  change: string;
  intent: string;
  model: string;
};

export type InsightSummaryMetric = {
  label: string;
  value: string;
  note: string;
  delta: string;
  tone: "positive" | "negative" | "neutral";
};

export const insightSummaryMetrics: InsightSummaryMetric[] = [
  {
    label: "可见性",
    value: "100%",
    note: "所有核心提示词均被提及",
    delta: "持平",
    tone: "neutral",
  },
  {
    label: "你的域名",
    value: "64%",
    note: "引用域名覆盖率",
    delta: "+8%",
    tone: "positive",
  },
  {
    label: "平均排名",
    value: "3.5",
    note: "排名数值越低越好",
    delta: "↓ 0.2",
    tone: "positive",
  },
  {
    label: "前 10 提示词",
    value: "18",
    note: "进入前 10 的问题数量",
    delta: "+3",
    tone: "positive",
  },
];

export const visibilityTrend: InsightTrendPoint[] = [
  { date: "06-27", visibility: 92, domains: 42 },
  { date: "06-28", visibility: 94, domains: 46 },
  { date: "06-29", visibility: 95, domains: 51 },
  { date: "06-30", visibility: 97, domains: 55 },
  { date: "07-01", visibility: 98, domains: 58 },
  { date: "07-02", visibility: 100, domains: 61 },
  { date: "07-03", visibility: 100, domains: 64 },
];

export const performanceBuckets: PerformanceBucket[] = [
  { label: "0-20%", count: 2, color: "#CBD5E1" },
  { label: "21-40%", count: 4, color: "#93C5FD" },
  { label: "41-60%", count: 7, color: "#60A5FA" },
  { label: "61-80%", count: 10, color: "#3366FF" },
  { label: "81-90%", count: 8, color: "#0EA5E9" },
  { label: "91-100%", count: 14, color: "#111827" },
];

export const topRankingRows: TopRankingRow[] = [
  {
    rank: 1,
    query: "best AI image generators for brand teams",
    domain: "creativeainews.com",
    visibility: "100%",
    position: "1.0",
    change: "+2",
    intent: "商业比较",
    model: "ChatGPT",
  },
  {
    rank: 2,
    query: "跨平台设计工具哪个最适合零基础用户",
    domain: "youtube.com",
    visibility: "100%",
    position: "2.0",
    change: "+1",
    intent: "方案选择",
    model: "Gemini",
  },
  {
    rank: 3,
    query: "AI创意灵感推荐能帮公司节省多少策划时间",
    domain: "businessinsider.com",
    visibility: "96%",
    position: "2.5",
    change: "持平",
    intent: "效率评估",
    model: "Perplexity",
  },
  {
    rank: 4,
    query: "Midjourney alternatives for marketing teams",
    domain: "toolchase.com",
    visibility: "94%",
    position: "3.0",
    change: "+4",
    intent: "竞品替代",
    model: "Claude",
  },
  {
    rank: 5,
    query: "AI图像生成技术真的能替代专业设计师吗",
    domain: "reddit.com",
    visibility: "91%",
    position: "3.5",
    change: "-1",
    intent: "风险判断",
    model: "ChatGPT",
  },
];
