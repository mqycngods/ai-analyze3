// Citations feature mock 数据
import type { CitationSourceRow } from "@/types/analytics";

export const citationLevels = ["domain", "host", "url"] as const;

export const citationSources: CitationSourceRow[] = [
  { level: "domain", source: "zhihu.com", retrieved: "79.2%", citation: "2.6", type: "UGC" },
  { level: "host", source: "www.zhihu.com", retrieved: "62.4%", citation: "2.1", type: "UGC" },
  {
    level: "url",
    source: "zhihu.com/question/650120178",
    retrieved: "38.6%",
    citation: "1.4",
    type: "问答页",
  },
  { level: "domain", source: "a16z.com", retrieved: "54.2%", citation: "1.6", type: "媒体" },
  {
    level: "host",
    source: "future.a16z.com",
    retrieved: "42.8%",
    citation: "1.2",
    type: "专栏",
  },
  {
    level: "url",
    source: "future.a16z.com/ai-marketing-stack-guide",
    retrieved: "21.3%",
    citation: "0.9",
    type: "文章页",
  },
  {
    level: "domain",
    source: "creativeai.news",
    retrieved: "33.3%",
    citation: "1.4",
    type: "媒体",
  },
  {
    level: "host",
    source: "insights.creativeai.news",
    retrieved: "28.9%",
    citation: "1.1",
    type: "专题页",
  },
  {
    level: "url",
    source: "insights.creativeai.news/brand-visibility-report",
    retrieved: "16.7%",
    citation: "0.7",
    type: "报告页",
  },
];

export const citationTypeColors: Record<string, string> = {
  UGC: "#3366FF",
  媒体: "#22C55E",
  企业站: "#F59E0B",
  其他: "#94A3B8",
};

export const citationTypeCategory: Record<string, string> = {
  UGC: "UGC",
  问答页: "UGC",
  媒体: "媒体",
  专栏: "媒体",
  专题页: "媒体",
  文章页: "媒体",
  报告页: "媒体",
};
