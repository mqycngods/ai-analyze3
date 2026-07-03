// 导航配置数据
// 后续可迁移到 API 或配置文件

import type { NavItem } from "@/types";

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
