export type BrandRow = {
  id: string;
  color: string;
  name: string;
  trackedName: string;
  domains: string[];
  mentions: number;
  isCurrent?: boolean;
};

export const brandRows: BrandRow[] = [
  {
    id: "creative-hit",
    color: "#EC4899",
    name: "Creative Hit 创意成功",
    trackedName: "Creative Hit 创意成功",
    domains: ["creativehit.ai"],
    mentions: 133,
    isCurrent: true,
  },
  {
    id: "fotor",
    color: "#2F5DB8",
    name: "Fotor",
    trackedName: "Fotor",
    domains: ["fotor.com", "fotor.com.cn"],
    mentions: 97,
  },
  {
    id: "midjourney",
    color: "#7A7D82",
    name: "Midjourney",
    trackedName: "Midjourney",
    domains: ["midjourney.com"],
    mentions: 39,
  },
  {
    id: "gaoding",
    color: "#1D4DFF",
    name: "稿定设计",
    trackedName: "稿定设计",
    domains: ["gaoding.com"],
    mentions: 10,
  },
  {
    id: "jimeng",
    color: "#80848B",
    name: "即梦AI 即梦 AI",
    trackedName: "即梦AI 即梦 AI",
    domains: ["jimeng.com"],
    mentions: 4,
  },
  {
    id: "libtv",
    color: "#64748B",
    name: "Libtv",
    trackedName: "Libtv",
    domains: ["www.lilib.tv"],
    mentions: 0,
  },
  {
    id: "tapnow",
    color: "#64748B",
    name: "Tapnow 塔普诺威",
    trackedName: "Tapnow 塔普诺威",
    domains: ["www.tapnow.ai"],
    mentions: 0,
  },
];
