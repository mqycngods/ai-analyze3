// 导航相关类型
export type NavId =
  | "overview"
  | "brands"
  | "prompts"
  | "knowledge"
  | "insights"
  | "settings";

export type NavItem = {
  id: NavId;
  label: string;
  icon: string;
  description: string;
  href: string;
  priority: "P0" | "P1" | "P2";
};
