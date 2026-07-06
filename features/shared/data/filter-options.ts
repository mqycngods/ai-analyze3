import type { GlobalFilterOption, GlobalFilterState } from "@/types/analytics";

function formatDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);

  return {
    endDate: formatDateValue(endDate),
    startDate: formatDateValue(startDate),
  };
}

export const defaultGlobalFilters: GlobalFilterState = {
  brands: [],
  dateRange: getDefaultDateRange(),
  models: [],
  topics: [],
};

export const brandFilterOptions: GlobalFilterOption[] = [
  { label: "Midjourney", value: "Midjourney" },
  { label: "Adobe", value: "Adobe" },
  { label: "Canva", value: "Canva" },
  { label: "ElevenLabs", value: "ElevenLabs" },
  { label: "Ideogram", value: "Ideogram" },
  { label: "OpenAI", value: "OpenAI" },
  { label: "Claude", value: "Claude" },
];

export const dateRangeOptions: GlobalFilterOption[] = [
  { label: "最近 7 天", value: "7d" },
  { label: "最近 30 天", value: "30d" },
  { label: "最近 90 天", value: "90d" },
];

export const modelFilterOptions: GlobalFilterOption[] = [
  { label: "ChatGPT", value: "ChatGPT" },
  { label: "Gemini", value: "Gemini" },
  { label: "Perplexity", value: "Perplexity" },
  { label: "Claude", value: "Claude" },
  { label: "Google", value: "Google" },
];

export const topicFilterOptions: GlobalFilterOption[] = [
  { label: "商业比较", value: "商业比较" },
  { label: "方案选择", value: "方案选择" },
  { label: "效率评估", value: "效率评估" },
  { label: "竞品替代", value: "竞品替代" },
  { label: "风险判断", value: "风险判断" },
];
