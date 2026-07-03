// 分析数据相关类型

export type FilterChip = {
  label: string;
  value: string;
};

export type GlobalDateRange = "7d" | "30d" | "90d";

export type GlobalFilterState = {
  brands: string[];
  dateRange: GlobalDateRange;
  models: string[];
  topics: string[];
};

export type GlobalFilterOption = {
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

export type OverviewMetric = {
  label: string;
  value: string;
  delta: string;
  deltaType: "positive" | "negative" | "neutral";
  note: string;
  badge?: string;
  badgeType?: "success" | "warning" | "neutral";
};

export type ShareOfVoiceItem = {
  name: string;
  value: number;
  color: string;
};

export type SourceCoverageItem = {
  name: string;
  value: number;
};

export type ActionRecommendation = {
  icon: string;
  title: string;
  description: string;
  priority: "高优先" | "中优先" | "低优先";
};

export type BrandInsightGroup = {
  title: string;
  items: readonly string[];
};

export type SettingsSection = {
  title: string;
  rows: readonly (readonly string[])[];
};

export type SourceDetail = {
  title: string;
  domain: string;
  rate: string;
  level: string;
};
