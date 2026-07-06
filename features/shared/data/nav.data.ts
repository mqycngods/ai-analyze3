// 导航配置数据
// 后续可迁移到 API 或配置文件

import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    id: "overview",
    label: "概览分析",
    icon: "📊",
    description: "可见性、份额、排名与行动入口",
    href: "/overview",
    priority: "P0",
    group: "general"
  },
  {
    id: "prompts",
    label: "提示词",
    icon: "🧠",
    description: "Topic 分组、生成、归档与指标管理",
    href: "/prompts",
    priority: "P0",
    group: "general"
  },
  {
    id: "knowledge",
    label: "知识库",
    icon: "📚",
    description: "多来源导入入口与后续结构扩展",
    href: "/knowledge",
    priority: "P2",
    group: "general"
  },
  {
    id: "insights",
    label: "洞察",
    icon: "💡",
    description: "竞品 Gap 分析、品牌洞察与行动建议",
    href: "/insights",
    priority: "P0",
    group: "general"
  },
  {
    id: "brands",
    label: "品牌",
    icon: "🏷️",
    description: "品牌名称、域名与追踪范围管理",
    href: "/brands",
    priority: "P0",
    group: "setting"
  },
  {
    id: "settings",
    label: "公司信息",
    icon: "⚙️",
    description: "品牌简介、目标市场、受众分布",
    href: "/settings",
    priority: "P1",
    group: "setting"
  }
];
