// Settings feature mock 数据
import type { SettingsSection } from "@/types/analytics";

export const settingsSections: SettingsSection[] = [
  {
    title: "Profile",
    rows: [
      ["市场", "中国、美国"],
      ["语言", "中文、英文"],
      ["品类", "AI 创意工具、内容运营、品牌可见性"],
      ["受众", "营销团队、增长团队、品牌策略团队"],
    ],
  },
  {
    title: "Tags",
    rows: [
      ["Prompt 标签", "品牌词、竞品对比、功能词、高意图"],
      ["Topic 标签", "AI 创意工具、Prompt 扩展、设计工作流"],
      ["来源标签", "UGC、媒体、企业站、报告页"],
    ],
  },
  {
    title: "Competitors",
    rows: [
      ["监控品牌", "Canva、Adobe、Midjourney、Fotor、Jasper、Ideogram、OpenAI"],
      ["域名规则", "支持主域、子站和别名监控"],
      ["监控范围", "品牌词、功能词、对比词"],
    ],
  },
  {
    title: "Usage / Billing",
    rows: [
      ["Prompt 数", "50 个启用中，12 个建议中"],
      ["模型调用量", "本月 12,480 次"],
      ["套餐状态", "Growth 年付版"],
      ["账单状态", "正常，下一次扣费 2026-07-18"],
    ],
  },
];
