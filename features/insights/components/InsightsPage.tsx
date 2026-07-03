"use client";

import { Download, MoreHorizontal } from "lucide-react";
import { Button, Card, Tag } from "@/ui";
import {
  insightSummaryMetrics,
  performanceBuckets,
  topRankingRows,
  visibilityTrend,
  type InsightTrendPoint,
  type TopRankingRow,
} from "@/features/insights/data/insights.mock";
import { cn } from "@/lib/utils";
import type { GlobalFilterState } from "@/types/analytics";

type PageProps = {
  filters: GlobalFilterState;
  notify?: (message: string) => void;
};

type TrendSeries = "visibility" | "domains";

const trendSeries: { key: TrendSeries; label: string; color: string }[] = [
  { key: "visibility", label: "可见性", color: "hsl(var(--primary))" },
  { key: "domains", label: "你的域名", color: "#94A3B8" },
];

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="m-0 text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function HeaderAction({ notify }: { notify?: (message: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        className="h-8 gap-1.5 rounded-md px-3 text-xs"
        onClick={() => notify?.("洞察数据导出任务已创建。")}
        type="button"
        variant="secondary"
      >
        <Download size={13} />
        导出
      </Button>
    </div>
  );
}

function SummaryStrip() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {insightSummaryMetrics.map((metric) => {
        const tone =
          metric.tone === "positive"
            ? "text-success"
            : metric.tone === "negative"
              ? "text-destructive"
              : "text-muted-foreground";

        return (
          <Card className="rounded-lg border border-border/70 bg-card p-4 shadow-none" key={metric.label}>
            <div className="flex items-start justify-between gap-3">
              <p className="m-0 text-xs font-medium text-muted-foreground">{metric.label}</p>
              <span className={cn("text-xs font-semibold tabular-nums", tone)}>{metric.delta}</span>
            </div>
            <strong className="mt-2 block text-2xl font-semibold tracking-tight">{metric.value}</strong>
            <p className="m-0 mt-1 text-xs text-muted-foreground">{metric.note}</p>
          </Card>
        );
      })}
    </section>
  );
}

function TrendChart({ data }: { data: InsightTrendPoint[] }) {
  const width = 960;
  const height = 300;
  const padX = 44;
  const padY = 26;
  const plotWidth = width - padX * 2;
  const plotHeight = height - padY * 2;
  const yTicks = [100, 75, 50, 25, 0];

  function pointsFor(key: TrendSeries) {
    return data.map((point, index) => {
      const x = padX + (index / Math.max(data.length - 1, 1)) * plotWidth;
      const y = padY + (1 - point[key] / 100) * plotHeight;
      return { x, y, value: point[key] };
    });
  }

  function pathFor(key: TrendSeries) {
    return pointsFor(key)
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
      .join(" ");
  }

  return (
    <div className="w-full overflow-hidden">
      <svg aria-label="可见性趋势图" className="h-[260px] w-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        {yTicks.map((tick) => {
          const y = padY + (1 - tick / 100) * plotHeight;
          return (
            <g key={tick}>
              <line
                stroke="hsl(var(--border))"
                strokeDasharray="4 6"
                strokeOpacity="0.85"
                strokeWidth="1"
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
              />
              <text fill="hsl(var(--muted-foreground))" fontSize="11" x="0" y={y + 4}>
                {tick}
              </text>
            </g>
          );
        })}
        {trendSeries.map((series) => (
          <path
            d={pathFor(series.key)}
            fill="none"
            key={series.key}
            stroke={series.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={series.key === "visibility" ? "2.5" : "2"}
          />
        ))}
        {trendSeries.map((series) =>
          pointsFor(series.key).map((point, index) => (
            <circle
              cx={point.x}
              cy={point.y}
              fill="hsl(var(--card))"
              key={`${series.key}-${index}`}
              r={series.key === "visibility" ? 3.6 : 3}
              stroke={series.color}
              strokeWidth="2"
            />
          ))
        )}
      </svg>
      <div className="flex justify-between px-10 text-[10px] text-muted-foreground">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function filterTrendByDate<T>(items: T[], dateRange: GlobalFilterState["dateRange"]) {
  const rangeSize = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  }[dateRange];

  return items.slice(-rangeSize);
}

function filterRankingRows(rows: TopRankingRow[], filters: GlobalFilterState) {
  return rows.filter((row) => {
    const matchesModel = filters.models.length === 0 || filters.models.includes(row.model);
    const matchesTopic = filters.topics.length === 0 || filters.topics.includes(row.intent);
    const matchesBrand =
      filters.brands.length === 0 ||
      filters.brands.some((brand) => `${row.query} ${row.domain}`.toLowerCase().includes(brand.toLowerCase()));

    return matchesModel && matchesTopic && matchesBrand;
  });
}

function VisibilityPanel({ data, notify }: { data: InsightTrendPoint[]; notify?: (message: string) => void }) {
  return (
    <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
        <SectionHeading description="按日期追踪品牌在 AI 回答中的可见性，以及自有域名被引用的覆盖情况。" title="可见性" />
        <HeaderAction notify={notify} />
      </div>
      <div className="mt-3 border-b border-border/70 px-5">
        <div className="scrollbar-none flex items-center gap-6 overflow-x-auto">
          {trendSeries.map((series, index) => (
            <button
              aria-current={index === 0 ? "page" : undefined}
              className={cn(
                "relative h-10 shrink-0 text-sm font-medium transition-colors",
                index === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              key={series.key}
              type="button"
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: series.color }} />
              {series.label}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary transition-opacity",
                  index === 0 ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pb-3 pt-4">
        <TrendChart data={data} />
      </div>
    </Card>
  );
}

function PerformanceMatrix() {
  const maxCount = Math.max(...performanceBuckets.map((bucket) => bucket.count));

  return (
    <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <SectionHeading description="将提示词按可见性区间聚合，快速判断高表现与低表现主题的分布。" title="绩效评估矩阵" />
        <button
          aria-label="查看矩阵更多操作"
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          type="button"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
      <div className="px-5 pb-5 pt-6">
        <div className="grid min-h-[220px] grid-cols-6 items-end gap-2">
          {performanceBuckets.map((bucket) => (
            <div className="flex min-w-0 flex-col items-center gap-2" key={bucket.label}>
              <span className="text-xs font-semibold tabular-nums">{bucket.count}</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  background: bucket.color,
                  height: `${Math.max(18, (bucket.count / maxCount) * 150)}px`,
                }}
              />
              <span className="truncate text-[10px] text-muted-foreground">{bucket.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border/50 pt-3">
          {performanceBuckets.map((bucket) => (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground" key={bucket.label}>
              <span className="h-2 w-2 rounded-[2px]" style={{ background: bucket.color }} />
              {bucket.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function TopRankingsTable({ rows }: { rows: TopRankingRow[] }) {
  return (
    <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
        <SectionHeading description="展示当前最靠前的提示词、域名、模型组合，用于定位可复制的高表现主题。" title="排名靠前" />
        <Tag className="rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">前 5</Tag>
      </div>
      <div className="mt-4 w-full overflow-auto">
        <table className="w-full min-w-[820px] whitespace-nowrap text-left text-sm">
          <thead className="border-y border-border/60 text-[11px] font-medium text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">排名</th>
              <th className="px-5 py-3 font-medium">提示词 / 查询</th>
              <th className="px-5 py-3 font-medium">域名</th>
              <th className="px-5 py-3 text-right font-medium">可见性</th>
              <th className="px-5 py-3 text-right font-medium">位置</th>
              <th className="px-5 py-3 font-medium">变化</th>
              <th className="px-5 py-3 font-medium">意图</th>
              <th className="px-5 py-3 font-medium">模型</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.map((row) => {
              const isNegative = row.change.startsWith("-");
              const isPositive = row.change.startsWith("+");

              return (
                <tr className="transition-colors hover:bg-muted/20" key={`${row.rank}-${row.query}`}>
                  <td className="px-5 py-4 text-muted-foreground">{row.rank}.</td>
                  <td className="max-w-[320px] truncate px-5 py-4 font-medium">{row.query}</td>
                  <td className="px-5 py-4 text-muted-foreground">{row.domain}</td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums">{row.visibility}</td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums">{row.position}</td>
                  <td
                    className={cn(
                      "px-5 py-4 text-xs font-semibold",
                      isPositive ? "text-success" : isNegative ? "text-destructive" : "text-muted-foreground"
                    )}
                  >
                    {row.change}
                  </td>
                  <td className="px-5 py-4">
                    <Tag className="rounded-md bg-muted px-2 py-1 text-[11px] text-foreground">{row.intent}</Tag>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{row.model}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <div className="border-t border-border/50 px-5 py-8 text-center text-sm text-muted-foreground">
            当前筛选范围暂无排名数据
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function InsightsPage({ filters, notify }: PageProps) {
  const filteredTrend = filterTrendByDate(visibilityTrend, filters.dateRange);
  const filteredRows = filterRankingRows(topRankingRows, filters);

  return (
    <div className="grid gap-6">
      <SummaryStrip />
      <VisibilityPanel data={filteredTrend} notify={notify} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <PerformanceMatrix />
        <TopRankingsTable rows={filteredRows} />
      </div>
    </div>
  );
}
