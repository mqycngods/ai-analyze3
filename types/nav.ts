// 导航相关类型
export type NavId =
  | "assistant"
  | "overview"
  | "prompts"
  | "knowledge"
  | "insights"
  | "brands"
  | "settings";

export type NavGroupId = "assistant" | "general" | "setting";

export type NavItem = {
  id: NavId;
  label: string;
  icon: string;
  description: string;
  href: string;
  priority: "P0" | "P1" | "P2";
  group: NavGroupId;
};
