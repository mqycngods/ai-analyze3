"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  ChevronDown,
  Download,
  ExternalLink,
  MessageSquare,
  MoreHorizontal,
  Quote,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Button, Card } from "@/ui";
import { InsightsPage } from "@/features/insights/components";
import {
  averagePositionTrend,
  rankingRows,
  sentimentRows,
  sentimentTrend,
  shareOfVoice,
  shareRows,
  visibilityRows,
  visibilityTrend,
} from "@/features/overview/data/overview.mock";
import { DonutChart, HorizontalBarChart, LineTrendChart, MultiLineTrendChart } from "@/features/shared/components/charts";
import type { BrandMetric, GlobalFilterState, ShareOfVoiceItem } from "@/types/analytics";
import type { NavId } from "@/types";
import { cn } from "@/lib/utils";

type PageProps = {
  filters: GlobalFilterState;
  navigate?: (page: NavId) => void;
  notify?: (message: string) => void;
};

type ChartPanelProps = {
  title: string;
  value: string;
  children: React.ReactNode;
  legend: readonly ChartLegendItem[];
  onLegendToggle?: (label: string) => void;
};

type ChartLegendItem = {
  label: string;
  color: string;
  active?: boolean;
};

type RankingTableProps = {
  title: string;
  value: string;
  valueLabel: string;
  rows: BrandMetric[];
  mode: "score" | "share" | "rank" | "sentiment";
  selectedBrand?: string;
  onExpand?: () => void;
};

type OverviewTab = "visibility" | "citation" | "sentiment" | "insights" | "chats";

type CitationRow = {
  domain: string;
  value: string;
  color: string;
};

type CitationCategory = {
  label: string;
  name: string;
  value: number;
  color: string;
};

type CitationKind = "社交" | "赢得媒体" | "其他";

type PopularCitationDomain = {
  rank: string;
  domain: string;
  kind: CitationKind;
  share: string;
  tag: string;
  color: string;
};

type PopularCitationPage = {
  rank: string;
  page: string;
  kind: CitationKind;
  mentioned: "未提及" | "已提及" | "Not Checked";
  firstCitation: string;
  share: string;
  tag: string;
  color: string;
};

type ChatRecord = {
  prompt: string;
  answer: string;
  submitter: string;
  sources: string[];
  features: string;
  status: string;
  location: string;
  created: string;
  accent: string;
};

const overviewTabs: { id: OverviewTab; label: string }[] = [
  { id: "visibility", label: "可见性" },
  { id: "citation", label: "引用" },
  { id: "sentiment", label: "情绪" },
  { id: "insights", label: "洞察" },
  { id: "chats", label: "所有聊天" },
];

const citationTrend = [
  { date: "07-01", value: 0 },
  { date: "07-02", value: 0 },
];

const citationRows: CitationRow[] = [
  { domain: "reddit.com", value: "21.4%", color: "#FF4500" },
  { domain: "youtube.com", value: "21.4%", color: "#FF0033" },
  { domain: "creativeainews.com", value: "14.3%", color: "#111827" },
  { domain: "businessinsider.com", value: "7.1%", color: "#1D4ED8" },
  { domain: "cre8journal.com", value: "7.1%", color: "#22C55E" },
];

const citationCategories: CitationCategory[] = [
  { label: "Corporate", name: "企业", value: 35, color: "#F97316" },
  { label: "Editorial", name: "编辑内容", value: 26, color: "#3B82F6" },
  { label: "UGC", name: "用户生成内容", value: 18, color: "#06B6D4" },
  { label: "Other", name: "其他", value: 11, color: "#6B7280" },
  { label: "Reference", name: "参考", value: 6, color: "#A855F7" },
  { label: "Institutional", name: "机构", value: 2, color: "#65A30D" },
  { label: "Competitor", name: "竞争对手", value: 1, color: "#EF4444" },
];

const popularCitationDomains: PopularCitationDomain[] = [
  { rank: "1.", domain: "reddit.com", kind: "社交", share: "21.43%", tag: "+21.43%", color: "#FF4500" },
  { rank: "1.", domain: "youtube.com", kind: "社交", share: "21.43%", tag: "+21.43%", color: "#FF0033" },
  { rank: "3.", domain: "creativeainews.com", kind: "赢得媒体", share: "14.29%", tag: "+14.29%", color: "#111827" },
  { rank: "4.", domain: "businessinsider.com", kind: "赢得媒体", share: "7.14%", tag: "+7.14%", color: "#1D4ED8" },
  { rank: "4.", domain: "cre8journal.com", kind: "其他", share: "7.14%", tag: "+7.14%", color: "#22C55E" },
  { rank: "4.", domain: "fast.io", kind: "其他", share: "7.14%", tag: "+7.14%", color: "#111827" },
  { rank: "4.", domain: "toolchase.com", kind: "赢得媒体", share: "7.14%", tag: "+7.14%", color: "#14B8A6" },
  { rank: "4.", domain: "toolradar.com", kind: "社交", share: "7.14%", tag: "+7.14%", color: "#60A5FA" },
  { rank: "4.", domain: "zapier.com", kind: "其他", share: "7.14%", tag: "+7.14%", color: "#FF4F00" },
];

const popularCitationPages: PopularCitationPage[] = [
  {
    rank: "1.",
    page: "creativeainews.com/articles/best-ai-image-generators-2026/",
    kind: "赢得媒体",
    mentioned: "未提及",
    firstCitation: "Jun 30, 2026",
    share: "14.29%",
    tag: "+14.29%",
    color: "#111827",
  },
  {
    rank: "1.",
    page: "youtube.com/watch?v=HSHGqG3vBIA",
    kind: "社交",
    mentioned: "未提及",
    firstCitation: "Jun 30, 2026",
    share: "14.29%",
    tag: "+14.29%",
    color: "#FF0033",
  },
  {
    rank: "3.",
    page: "cre8journal.com/news/magazine-best-ai-tools-for-designers-2026",
    kind: "其他",
    mentioned: "Not Checked",
    firstCitation: "Jul 2, 2026",
    share: "7.14%",
    tag: "+7.14%",
    color: "#22C55E",
  },
  {
    rank: "3.",
    page: "reddit.com/r/AIToolCompare/comments/1rplayt/best_ai_video_creators/",
    kind: "社交",
    mentioned: "未提及",
    firstCitation: "Jul 2, 2026",
    share: "7.14%",
    tag: "+7.14%",
    color: "#FF4500",
  },
  {
    rank: "3.",
    page: "reddit.com/r/AI_Agents/comments/1tadlie/tested_4_best_ai_video_generators_in_2026_for/",
    kind: "社交",
    mentioned: "未提及",
    firstCitation: "Jun 30, 2026",
    share: "7.14%",
    tag: "+7.14%",
    color: "#FF4500",
  },
];

const chatRecords: ChatRecord[] = [
  {
    prompt: "中小企业做社交媒体营销需要多少视觉素材才够用？",
    answer: "做社交媒体营销，中小企业最容易掉进的陷阱就是每天都在发想今天发什么，所以每天都在现做素材。结果就是消耗大量时间，排版还乱七八糟。",
    submitter: "Gemini",
    sources: ["BI"],
    features: "-",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#4F7CFF",
  },
  {
    prompt: "跨平台设计工具哪个最适合零基础用户？",
    answer: "对于零基础用户，上手最快的跨平台设计工具根据您的具体设计需求：平面与网页设计、海报、社交媒体图、PPT，首推 Canva。",
    submitter: "Google",
    sources: ["YT", "RD", "+3"],
    features: "网页",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#4285F4",
  },
  {
    prompt: "自由设计师如何利用AI图像生成提高工作效率？",
    answer: "自由设计师可以利用AI图像生成技术，在项目创意、灵感发散、素材制作和样机展示等核心阶段实现10倍以上的效率提升。",
    submitter: "Google",
    sources: ["LE", "G", "+1"],
    features: "网页",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#4285F4",
  },
  {
    prompt: "数字内容创作中的自动化工具值得投入学习吗？",
    answer: "答案是：非常值得，甚至可以说是同等数字内容创作者的必修课。无论你是在运营社交媒体账号、做视频剪辑、写作还是视觉设计。",
    submitter: "Gemini",
    sources: [],
    features: "-",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#4F7CFF",
  },
  {
    prompt: "跨平台设计工具哪个最适合零基础用户？",
    answer: "对于零基础用户来说，选择跨平台设计工具的核心是：操作洞察、模板丰富、拖拽式操作，且不需要安装庞大的本地软件。",
    submitter: "Gemini",
    sources: ["BI"],
    features: "-",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#4F7CFF",
  },
  {
    prompt: "设计师如何持续获得创意思路避免灵感枯竭？",
    answer: "以下内容给设计师的实用路径，帮助持续获得创意思路，避免灵感枯竭。打造日常灵感仓，养成收集习惯。",
    submitter: "Perplexity",
    sources: ["S", "GM", "+2"],
    features: "网页",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#22B8CF",
  },
  {
    prompt: "AI创意灵感推荐能帮公司节省多少策划时间？",
    answer: "AI创意灵感建议通常短暂公司节省40%到70%的策划时间。通过处理自动化市场调研、文案生成和视觉风暴等重复性工作。",
    submitter: "Google",
    sources: ["WP", "G", "+2"],
    features: "网页",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#4285F4",
  },
  {
    prompt: "AI创意灵感推荐能帮公司节省多少策划时间？",
    answer: "在快节奏的十大生态中，AI创意灵感推荐平均能帮助公司节省50%到70%的核心策划时间。",
    submitter: "Gemini",
    sources: [],
    features: "-",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#4F7CFF",
  },
  {
    prompt: "使用现成设计模板会不会让品牌视觉千篇一律？",
    answer: "会，而且关键不是不能用模板，而在怎么用。真正存在结果的决定不是模板本身，而是你直接套模板，还是建立自己的品牌规范。",
    submitter: "ChatGPT",
    sources: ["YT", "+7"],
    features: "网页",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#111827",
  },
  {
    prompt: "AI图像生成技术真的能替代专业设计师吗？",
    answer: "简短回答：不能完全替代，但已经能够替代一部分设计工作，并且正在重塑设计师的工作方式。",
    submitter: "ChatGPT",
    sources: ["CB", "RD", "+10"],
    features: "网页",
    status: "-",
    location: "全球",
    created: "今天",
    accent: "#111827",
  },
];

const brandColors: Record<string, string> = {
  Midjourney: "#22C55E",
  Adobe: "#EF4444",
  Canva: "#3366FF",
  ElevenLabs: "#F97316",
  Ideogram: "#EC4899",
  OpenAI: "#111827",
  Autodraw: "#8B5CF6",
  Claude: "#F59E0B",
  Jasper: "#14B8A6",
  Other: "#8A8F8D",
};

const currentCycleLabel = "当前周期";
const comparisonLabel = "竞品对比";

const visibilityTrendSeries = [
  { key: "current", label: currentCycleLabel, color: "#3366FF", area: true },
  { key: "comparison", label: comparisonLabel, color: "#94A3B8", area: false },
];

const averagePositionTrendSeries = [
  { key: "current", label: currentCycleLabel, color: "#3366FF", area: true },
  { key: "comparison", label: comparisonLabel, color: "#94A3B8", area: false },
];

function filterBrandRows(rows: BrandMetric[], selectedBrands: string[]) {
  if (selectedBrands.length === 0) return rows;
  return rows.filter((row) => selectedBrands.includes(row.name));
}

function filterShareItems(items: ShareOfVoiceItem[], selectedBrands: string[]) {
  if (selectedBrands.length === 0) return items;
  return items.filter((item) => selectedBrands.includes(item.name));
}

function filterTrendByDate<T>(items: T[], dateRange: GlobalFilterState["dateRange"]) {
  if (!dateRange.startDate || !dateRange.endDate) {
    return items;
  }

  const start = new Date(`${dateRange.startDate}T00:00:00`);
  const end = new Date(`${dateRange.endDate}T23:59:59`);
  const rangeSize = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return items.slice(-rangeSize);
}

function brandInitial(name: string) {
  return name.slice(0, 1).toUpperCase();
}

function toggleLegendLabel(labels: string[], label: string) {
  return labels.includes(label) ? labels.filter((item) => item !== label) : [...labels, label];
}

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="m-0 text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <Button
        className="h-7 gap-1.5 rounded-md px-2.5 text-[11px]"
        size="sm"
        type="button"
        variant="secondary"
      >
        配置
        <ChevronDown size={12} />
      </Button>
    </div>
  );
}

function ChartPanel({ title, value, children, legend, onLegendToggle }: ChartPanelProps) {
  return (
    <Card className="min-h-[260px] rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div>
          <p className="m-0 text-xs font-medium text-muted-foreground">{title}</p>
          <p className="m-0 mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <button
          aria-label="下载图表"
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          type="button"
        >
          <Download size={13} />
        </button>
      </div>
      <div className="px-4 pb-3 pt-2">{children}</div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-border/50 px-5 py-3.5">
        {legend.map((item) => {
          const active = item.active ?? true;
          const interactive = Boolean(onLegendToggle);

          return (
            <button
              aria-pressed={interactive ? active : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 text-[11px] transition-colors",
                active ? "text-muted-foreground" : "text-muted-foreground/45",
                interactive ? "cursor-pointer hover:text-foreground" : "cursor-default"
              )}
              disabled={!interactive}
              key={item.label}
              onClick={() => onLegendToggle?.(item.label)}
              type="button"
            >
              <span
                className={cn("h-2 w-2 rounded-[2px] transition-opacity", active ? "opacity-100" : "opacity-30")}
                style={{ background: item.color }}
              />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function RankingTable({ title, value, valueLabel, rows, mode, selectedBrand = "Midjourney", onExpand }: RankingTableProps) {
  function getValue(row: BrandMetric) {
    if (mode === "rank") return row.position.toString();
    if (mode === "share") return `${row.sov}%`;
    if (mode === "sentiment") return `${row.sentiment}%`;
    return `${row.score}%`;
  }

  return (
    <Card className="min-h-[260px] rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="px-5 pt-4">
        <p className="m-0 text-xs font-medium text-muted-foreground">{title}</p>
        <p className="m-0 mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      </div>
      <div className="mt-4 grid grid-cols-[36px_minmax(0,1fr)_92px] border-b border-border/60 px-5 pb-2 text-[11px] font-medium text-muted-foreground">
        <span>序号</span>
        <span>品牌</span>
        <span className="text-right">{valueLabel}</span>
      </div>
      <div className="px-5">
        {rows.map((row, index) => {
          const isSelected = row.name === selectedBrand;
          return (
            <div
              className="grid grid-cols-[36px_minmax(0,1fr)_92px] items-center border-b border-border/50 py-2.5 text-xs last:border-b-0"
              key={row.name}
            >
              <span className="text-muted-foreground">{index + 1}.</span>
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-[4px] text-[9px] font-semibold text-white"
                  style={{ background: brandColors[row.name] ?? "hsl(var(--muted-foreground))" }}
                >
                  {brandInitial(row.name)}
                </span>
                <span className="truncate font-medium">{row.name}</span>
                {isSelected ? (
                  <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    已选
                  </span>
                ) : null}
              </span>
              <span className="text-right font-semibold tabular-nums">{getValue(row)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end px-5 py-3">
        <Button className="h-7 gap-1 rounded-md px-2.5 text-[11px]" onClick={onExpand} size="sm" type="button" variant="ghost">
          展开
          <MoreHorizontal size={13} />
        </Button>
      </div>
    </Card>
  );
}

function AnalysisBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <SectionIntro description={description} title={title} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.94fr)]">{children}</div>
    </section>
  );
}

function TabNavigation({
  activeTab,
  onChange,
}: {
  activeTab: OverviewTab;
  onChange: (tab: OverviewTab) => void;
}) {
  return (
    <div className="border-b border-border/70">
      <div className="scrollbar-none flex items-center gap-6 overflow-x-auto overflow-y-hidden">
        {overviewTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative h-10 shrink-0 px-0 text-sm font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              {tab.label}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary transition-opacity",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VisibilityContent({
  filters,
  onShowInsights,
}: {
  filters: GlobalFilterState;
  onShowInsights?: () => void;
}) {
  const [visibilityActiveLegend, setVisibilityActiveLegend] = useState([currentCycleLabel, comparisonLabel]);
  const [shareActiveLegend, setShareActiveLegend] = useState(shareOfVoice.map((item) => item.name));
  const [averageActiveLegend, setAverageActiveLegend] = useState([currentCycleLabel, comparisonLabel]);
  const filteredVisibilityRows = filterBrandRows(visibilityRows, filters.brands);
  const filteredShareRows = filterBrandRows(shareRows, filters.brands);
  const filteredRankingRows = filterBrandRows(rankingRows, filters.brands);
  const filteredShareOfVoice = filterShareItems(shareOfVoice, filters.brands);
  const visibleShareOfVoice = filteredShareOfVoice.filter((item) => shareActiveLegend.includes(item.name));
  const selectedBrand = filters.brands[0] ?? "Midjourney";
  const trendData = filterTrendByDate(visibilityTrend, filters.dateRange);
  const averageTrendData = filterTrendByDate(averagePositionTrend, filters.dateRange);
  const visibilityChartData = trendData.map((point, index) => ({
    date: point.date,
    current: point.value,
    comparison: Math.max(0, Math.min(100, point.value - 12 - Math.max(0, trendData.length - index - 1) * 0.7)),
  }));
  const averageChartData = averageTrendData.map((point, index) => ({
    date: point.date,
    current: point.value,
    comparison: Number((point.value + 0.42 + Math.max(0, averageTrendData.length - index - 1) * 0.03).toFixed(2)),
  }));
  const visibilityLegend = visibilityTrendSeries.map((item) => ({
    color: item.color,
    label: item.label,
    active: visibilityActiveLegend.includes(item.label),
  }));
  const averageLegend = averagePositionTrendSeries.map((item) => ({
    color: item.color,
    label: item.label,
    active: averageActiveLegend.includes(item.label),
  }));
  const shareLegend = filteredShareOfVoice.map((item) => ({
    label: item.name === "Other" ? "其他" : item.name,
    color: item.color,
    active: shareActiveLegend.includes(item.name),
  }));

  return (
    <>
      <AnalysisBlock
        description="品牌在人工智能生成回答中被提及的频率。"
        title="可见度得分"
      >
        <ChartPanel
          legend={visibilityLegend}
          onLegendToggle={(label) => setVisibilityActiveLegend((current) => toggleLegendLabel(current, label))}
          title="可见性得分"
          value="100%"
        >
          <MultiLineTrendChart
            data={visibilityChartData}
            height={168}
            max={100}
            min={0}
            series={visibilityTrendSeries.filter((item) => visibilityActiveLegend.includes(item.label))}
            showLegend={false}
          />
        </ChartPanel>
        <RankingTable
          mode="score"
          onExpand={onShowInsights}
          rows={filteredVisibilityRows}
          selectedBrand={selectedBrand}
          title="可见性得分排名"
          value="#1"
          valueLabel="可见性得分"
        />
      </AnalysisBlock>

      <AnalysisBlock
        description="品牌在人工智能生成回答中的提及量相对竞品的占比。"
        title="声量份额"
      >
        <ChartPanel
          legend={shareLegend}
          onLegendToggle={(label) =>
            setShareActiveLegend((current) => toggleLegendLabel(current, label === "其他" ? "Other" : label))
          }
          title="声量份额"
          value="7.7%"
        >
          <DonutChart data={visibleShareOfVoice} centerLabel={visibleShareOfVoice.length > 0 ? "7.7%" : "0%"} />
        </ChartPanel>
        <RankingTable
          mode="share"
          onExpand={onShowInsights}
          rows={filteredShareRows}
          selectedBrand={selectedBrand}
          title="声量份额排名"
          value="#1"
          valueLabel="声量份额"
        />
      </AnalysisBlock>

      <AnalysisBlock
        description="品牌在人工智能生成回答中的平均出现排名。"
        title="平均排名"
      >
        <ChartPanel
          legend={averageLegend}
          onLegendToggle={(label) => setAverageActiveLegend((current) => toggleLegendLabel(current, label))}
          title="平均排名"
          value="3.5"
        >
          <MultiLineTrendChart
            data={averageChartData}
            height={168}
            invert
            max={4.4}
            min={3.0}
            series={averagePositionTrendSeries.filter((item) => averageActiveLegend.includes(item.label))}
            showLegend={false}
            unit=""
          />
        </ChartPanel>
        <RankingTable
          mode="rank"
          onExpand={onShowInsights}
          rows={filteredRankingRows}
          selectedBrand={selectedBrand}
          title="平均排名榜"
          value="#5"
          valueLabel="平均排名"
        />
      </AnalysisBlock>
    </>
  );
}

function SentimentContent({
  filters,
  onShowInsights,
}: {
  filters: GlobalFilterState;
  onShowInsights?: () => void;
}) {
  const filteredSentimentRows = filterBrandRows(sentimentRows, filters.brands);
  const selectedBrand = filters.brands[0] ?? "Midjourney";
  const trendData = filterTrendByDate(sentimentTrend, filters.dateRange);
  const sentimentLegend = [
    { label: "当前周期", color: "hsl(var(--primary))" },
    { label: "竞品对比", color: "hsl(var(--muted-foreground))" },
  ];

  return (
    <AnalysisBlock description="品牌在人工智能生成回答中的整体情绪倾向。" title="情绪得分">
      <ChartPanel legend={sentimentLegend} title="情绪得分" value="58%">
        <LineTrendChart data={trendData} max={100} min={0} />
      </ChartPanel>
      <RankingTable
        mode="sentiment"
        onExpand={onShowInsights}
        rows={filteredSentimentRows}
        selectedBrand={selectedBrand}
        title="情绪得分排名"
        value="#2"
        valueLabel="情绪得分"
      />
    </AnalysisBlock>
  );
}

function CitationTable() {
  return (
    <Card className="min-h-[360px] rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="px-5 pt-5">
        <p className="m-0 text-xs font-medium text-muted-foreground">引用排名</p>
        <p className="m-0 mt-2 text-2xl font-semibold tracking-tight">-</p>
      </div>
      <div className="mt-6 grid grid-cols-[44px_minmax(0,1fr)_92px] border-b border-border/60 px-5 pb-2 text-[11px] font-medium text-muted-foreground">
        <span>序号</span>
        <span>域名</span>
        <span className="text-right">占比</span>
      </div>
      <div className="px-5">
        {citationRows.map((row, index) => (
          <div
            className="grid grid-cols-[44px_minmax(0,1fr)_92px] items-center border-b border-border/50 py-3 text-xs last:border-b-0"
            key={row.domain}
          >
            <span className="text-muted-foreground">{index + 1}.</span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white" style={{ background: row.color }}>
                {row.domain.slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate font-medium">{row.domain}</span>
            </span>
            <span className="text-right font-semibold tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end px-5 py-4">
        <Button className="h-7 rounded-md px-2.5 text-[11px]" size="sm" type="button" variant="ghost">
          展开
        </Button>
      </div>
    </Card>
  );
}

function CitationCategoryCard() {
  return (
    <section className="grid gap-3">
      <h2 className="m-0 text-[15px] font-semibold tracking-tight text-foreground">引用分类</h2>
      <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
        <div className="flex flex-col gap-2 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h3 className="m-0 text-sm font-semibold">域名类型</h3>
            <span className="text-sm font-medium text-muted-foreground">Domain types</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>总检索次数：1.1 千次</span>
            <span className="grid h-4 w-4 place-items-center rounded-full border border-border text-[10px] text-muted-foreground">
              i
            </span>
          </div>
        </div>
        <div className="px-5 py-5">
          <HorizontalBarChart
            data={citationCategories.map((category) => ({
              label: category.label,
              value: category.value,
              color: category.color,
            }))}
            height={320}
          />
        </div>
      </Card>
    </section>
  );
}

function CitationSearch({ placeholder }: { placeholder: string }) {
  return (
    <label className="relative block w-full sm:w-44">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
      <input
        className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}

function CategoryBadge({ kind }: { kind: CitationKind }) {
  const tone = {
    社交: "bg-purple-100 text-purple-700",
    赢得媒体: "bg-blue-100 text-blue-700",
    其他: "bg-muted text-muted-foreground",
  }[kind];

  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", tone)}>{kind}</span>;
}

function DomainIcon({ label, color }: { label: string; color: string }) {
  return (
    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-[4px] text-[9px] font-semibold text-white" style={{ background: color }}>
      {label.slice(0, 1).toUpperCase()}
    </span>
  );
}

function PopularCitationDomains() {
  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="m-0 text-[15px] font-semibold tracking-tight text-foreground">热门引用域名</h2>
          <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
            了解哪些网站在人工智能生成回答中被引用的频率最高
          </p>
        </div>
        <CitationSearch placeholder="搜索域名" />
      </div>
      <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
        <div className="scrollbar-none overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[56px_minmax(280px,1fr)_120px_96px_120px] border-b border-border/60 px-5 py-3 text-[11px] font-medium text-muted-foreground">
              <span>排名</span>
              <span>域名</span>
              <span>类别</span>
              <span className="text-right">占比</span>
              <span className="text-right">引用标签</span>
            </div>
            {popularCitationDomains.map((row, index) => (
              <div
                className="grid grid-cols-[56px_minmax(280px,1fr)_120px_96px_120px] items-center border-b border-border/50 px-5 py-3 text-xs last:border-b-0"
                key={`${row.domain}-${index}`}
              >
                <span className="text-muted-foreground">{row.rank}</span>
                <span className="flex min-w-0 items-center gap-2">
                  <DomainIcon color={row.color} label={row.domain} />
                  <span className="truncate font-medium">{row.domain}</span>
                </span>
                <span>
                  <CategoryBadge kind={row.kind} />
                </span>
                <span className="text-right font-medium tabular-nums">{row.share}</span>
                <span className="text-right font-semibold tabular-nums text-success">{row.tag}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border/50 px-5 py-3 text-right text-xs text-muted-foreground">显示 1-9 / 9 项</div>
      </Card>
    </section>
  );
}

function PopularCitationPages() {
  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="m-0 text-[15px] font-semibold tracking-tight text-foreground">热门引用页面</h2>
          <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
            探索人工智能回答中被引用频率最高的网页
          </p>
        </div>
        <CitationSearch placeholder="搜索页面" />
      </div>
      <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
        <div className="scrollbar-none overflow-x-auto">
          <div className="min-w-[1120px]">
            <div className="grid grid-cols-[56px_minmax(360px,1fr)_120px_104px_128px_96px_120px] border-b border-border/60 px-5 py-3 text-[11px] font-medium text-muted-foreground">
              <span>排名</span>
              <span>页面</span>
              <span>类别</span>
              <span>页面中提及</span>
              <span>首次被引用</span>
              <span className="text-right">占比</span>
              <span className="text-right">引用标签</span>
            </div>
            {popularCitationPages.map((row, index) => (
              <div
                className="grid grid-cols-[56px_minmax(360px,1fr)_120px_104px_128px_96px_120px] items-center border-b border-border/50 px-5 py-3 text-xs last:border-b-0"
                key={`${row.page}-${index}`}
              >
                <span className="text-muted-foreground">{row.rank}</span>
                <span className="flex min-w-0 items-center gap-2">
                  <DomainIcon color={row.color} label={row.page} />
                  <span className="truncate font-medium">{row.page}</span>
                </span>
                <span>
                  <CategoryBadge kind={row.kind} />
                </span>
                <span className={cn("font-medium", row.mentioned === "Not Checked" ? "text-muted-foreground" : "text-destructive")}>
                  {row.mentioned}
                </span>
                <span>{row.firstCitation}</span>
                <span className="text-right font-medium tabular-nums">{row.share}</span>
                <span className="text-right font-semibold tabular-nums text-success">{row.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

function CitationContent() {
  const citationLegend = [
    { label: "当前周期", color: "hsl(var(--primary))" },
    { label: "比较网站", color: "hsl(var(--muted-foreground))" },
  ];

  return (
    <>
      <section className="grid gap-3">
        <SectionIntro description="creativehit.ai 被人工智能生成回答引用的频率。" title="引用占比" />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.94fr)]">
          <ChartPanel legend={citationLegend} title="引用占比" value="0%">
            <LineTrendChart data={citationTrend} max={1} min={0} />
          </ChartPanel>
          <CitationTable />
        </div>
      </section>
      <CitationCategoryCard />
      <PopularCitationDomains />
      <PopularCitationPages />
    </>
  );
}

function ChatFilterButton({ label }: { label: string }) {
  return (
    <Button className="h-8 gap-1.5 rounded-md px-3 text-xs" size="sm" type="button" variant="secondary">
      {label}
      <ChevronDown size={12} />
    </Button>
  );
}

function SourcePills({ sources }: { sources: string[] }) {
  if (sources.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {sources.map((source, index) => (
        <span
          className={cn(
            "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-semibold",
            source.startsWith("+") ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}
          key={`${source}-${index}`}
        >
          {source}
        </span>
      ))}
    </div>
  );
}

function ChatRecordDetailDrawer({ chat, onClose }: { chat: ChatRecord; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      aria-label="全部对话内容详情"
      aria-modal="true"
      className="fixed inset-0 z-50 animate-chat-drawer-overlay"
      onClick={onClose}
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-[520px] animate-chat-drawer-content flex-col border-l border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border bg-muted/20 px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <Bot size={12} />
                {chat.submitter}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{chat.location}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{chat.created}</span>
            </div>
            <h2 className="m-0 text-lg font-semibold leading-snug">全部对话内容详情</h2>
          </div>
          <button
            aria-label="关闭"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <section className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare size={14} className="text-muted-foreground" />
              <h3 className="m-0 text-xs font-semibold text-muted-foreground">聊天提问</h3>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4 text-sm font-medium leading-7">
              {chat.prompt}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Quote size={14} className="text-muted-foreground" />
              <h3 className="m-0 text-xs font-semibold text-muted-foreground">回答正文</h3>
            </div>
            <div className="relative rounded-xl border border-border/60 bg-muted/20 p-4 text-sm leading-7 text-foreground">
              {chat.answer}
              <p className="m-0 mt-3 text-muted-foreground">
                这条回答来自 {chat.submitter}，用于分析品牌在相关问题中的可见性、引用来源和内容覆盖情况。
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-muted-foreground" />
              <h3 className="m-0 text-xs font-semibold text-muted-foreground">提取信息</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["提交", chat.submitter],
                ["特征", chat.features],
                ["位置", chat.location],
                ["状态", chat.status],
              ].map(([label, value]) => (
                <div className="rounded-xl border border-border/60 bg-card p-3" key={label}>
                  <p className="m-0 text-xs text-muted-foreground">{label}</p>
                  <p className="m-0 mt-1 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <ExternalLink size={14} className="text-muted-foreground" />
              <h3 className="m-0 text-xs font-semibold text-muted-foreground">来源</h3>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-3">
              <SourcePills sources={chat.sources} />
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}

function AllChatsContent({ filters }: { filters: GlobalFilterState }) {
  const [selectedChat, setSelectedChat] = useState<ChatRecord | null>(null);
  const filteredChats =
    filters.models.length === 0 ? chatRecords : chatRecords.filter((row) => filters.models.includes(row.submitter));

  return (
    <>
      <section className="grid gap-3">
        <div>
          <h2 className="m-0 text-[15px] font-semibold tracking-tight text-foreground">所有聊天记录</h2>
          <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">所有聊天记录都用于您的提示</p>
        </div>
        <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
          <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="m-0 text-sm font-medium">1至{filteredChats.length} 条，共{filteredChats.length} 条聊天记录</p>
            <div className="flex flex-wrap items-center gap-2">
              <ChatFilterButton label="所有品牌" />
              <ChatFilterButton label="所有功能" />
              <ChatFilterButton label="所有来源" />
            </div>
          </div>
          <div className="scrollbar-none overflow-x-auto">
            <div className="min-w-[1240px]">
              <div className="grid grid-cols-[minmax(520px,1fr)_92px_116px_92px_92px_76px_76px] border-b border-border/60 bg-muted/20 px-4 py-3 text-[11px] font-medium text-muted-foreground">
                <span>聊天</span>
                <span>提交</span>
                <span>来源</span>
                <span>特征</span>
                <span>位置</span>
                <span>状态</span>
                <span className="text-right">创建</span>
              </div>
              {filteredChats.map((row, index) => (
                <button
                  className="grid w-full grid-cols-[minmax(520px,1fr)_92px_116px_92px_92px_76px_76px] items-center border-b border-border/50 px-4 py-3 text-left text-xs transition-colors last:border-b-0 hover:bg-muted/20"
                  key={`${row.prompt}-${index}`}
                  onClick={() => setSelectedChat(row)}
                  type="button"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px]" style={{ background: row.accent }} />
                    <div className="min-w-0">
                      <p className="m-0 truncate text-sm font-semibold text-foreground">{row.prompt}</p>
                      <p className="m-0 mt-1 truncate text-xs leading-5 text-muted-foreground">{row.answer}</p>
                    </div>
                  </div>
                  <span className="font-medium">{row.submitter}</span>
                  <SourcePills sources={row.sources} />
                  <span className="text-muted-foreground">{row.features}</span>
                  <span className="text-muted-foreground">{row.location}</span>
                  <span className="text-muted-foreground">{row.status}</span>
                  <span className="text-right font-medium">{row.created}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              {["‹", "1", "2", "3", "4", "5", "...", "16", "›"].map((page, index) => (
                <button
                  className={cn(
                    "grid h-8 min-w-8 place-items-center rounded-md px-2 text-xs transition-colors",
                    page === "1" ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                  key={`${page}-${index}`}
                  type="button"
                >
                  {page}
                </button>
              ))}
            </div>
            <div className="text-right text-xs leading-5 text-muted-foreground">
              <p className="m-0 font-medium text-foreground">1至{filteredChats.length} 条，共{filteredChats.length} 条聊天记录</p>
              <p className="m-0">在当前筛选范围中展示全部聊天</p>
            </div>
          </div>
        </Card>
      </section>
      {selectedChat ? <ChatRecordDetailDrawer chat={selectedChat} onClose={() => setSelectedChat(null)} /> : null}
    </>
  );
}

export function OverviewPage({ filters, notify }: PageProps) {
  const [activeTab, setActiveTab] = useState<OverviewTab>("visibility");

  const tabContent = {
    visibility: <VisibilityContent filters={filters} onShowInsights={() => setActiveTab("insights")} />,
    citation: <CitationContent />,
    sentiment: <SentimentContent filters={filters} onShowInsights={() => setActiveTab("insights")} />,
    insights: <InsightsPage filters={filters} notify={notify} />,
    chats: <AllChatsContent filters={filters} />,
  }[activeTab];

  return (
    <div className="mx-auto grid gap-6">
      <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid gap-6">{tabContent}</div>
    </div>
  );
}
