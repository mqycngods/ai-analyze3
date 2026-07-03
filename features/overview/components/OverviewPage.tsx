"use client";

import { TrendingUp, Sparkles, Calendar, Bell, ChevronRight } from "lucide-react";
import { Button, Card } from "@/ui";
import { overviewMetrics, visibilityTrend, shareOfVoice, sourceCoverage, actionRecommendations, brands } from "@/features/overview/data/overview.mock";
import type { NavId } from "@/types";

type PageProps = {
  navigate?: (page: NavId) => void;
  notify?: (message: string) => void;
};

type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
  deltaType: "positive" | "negative" | "neutral";
  note: string;
  badge?: string;
  badgeType?: "success" | "warning" | "neutral";
};

function MetricCard({ label, value, delta, deltaType, note, badge, badgeType }: MetricCardProps) {
  const deltaColor =
    deltaType === "positive"
      ? "text-success"
      : deltaType === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <Card className="flex flex-col justify-between p-5 h-full border border-border/60 shadow-none bg-card">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <span className="text-muted-foreground/60">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 6.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="7" cy="4.5" r="0.75" fill="currentColor" />
          </svg>
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {delta ? <span className={`text-sm font-medium ${deltaColor}`}>{delta}</span> : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{note}</span>
        {badge ? (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              badgeType === "success" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

function TrendChart() {
  const maxVal = Math.max(...visibilityTrend.map((d) => d.value));
  const minVal = Math.min(...visibilityTrend.map((d) => d.value));
  const w = 520;
  const h = 200;
  const pad = 20;

  const points = visibilityTrend.map((d, i) => {
    const x = pad + (i / (visibilityTrend.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.value - minVal) / (maxVal - minVal)) * (h - pad * 2);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z`;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3366FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3366FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={pad}
            x2={w - pad}
            y1={pad + ratio * (h - pad * 2)}
            y2={pad + ratio * (h - pad * 2)}
            stroke="#E5E7EB"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}
        <path d={areaPath} fill="url(#trendGradient)" />
        <path d={linePath} fill="none" stroke="#3366FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="4" fill="#3366FF" />
            <circle cx={p.x} cy={p.y} r="7" fill="#3366FF" fillOpacity="0.15" />
            <text x={p.x} y={p.y - 14} textAnchor="middle" className="text-[10px] font-semibold" fill="#111827">
              {p.value}%
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between px-5 mt-2 text-xs text-muted-foreground">
        {visibilityTrend.map((d) => (
          <span key={d.date}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart() {
  const size = 160;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = shareOfVoice.reduce((sum, item) => sum + item.value, 0);

  let offset = 0;
  const segments = shareOfVoice.map((item) => {
    const fraction = item.value / total;
    const dash = fraction * circumference;
    const segment = {
      ...item,
      dashArray: `${dash} ${circumference - dash}`,
      dashOffset: -offset,
    };
    offset += dash;
    return segment;
  });

  return (
    <div className="flex items-center gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
          {segments.map((seg) => (
            <circle
              key={seg.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">52%</span>
          <span className="text-xs text-muted-foreground">CreativeHit</span>
        </div>
      </div>
      <div className="grid gap-3 text-sm">
        {shareOfVoice.map((item) => (
          <div key={item.name} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
            <span className={`font-medium ${item.name === "CreativeHit" ? "text-foreground" : "text-muted-foreground"}`}>
              {item.name}
            </span>
            <span className="text-muted-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandRankTable() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[28px_minmax(0,1fr)_auto_80px] gap-3 items-center py-2.5 text-xs font-medium text-muted-foreground border-b border-border/50">
        <span>#</span>
        <span>品牌</span>
        <span className="text-right">可见性</span>
        <span className="text-right">排名</span>
      </div>
      {brands.map((brand, index) => (
        <div
          key={brand.name}
          className="grid grid-cols-[28px_minmax(0,1fr)_auto_80px] gap-3 items-center py-2.5 border-b border-border/30 text-sm last:border-0"
        >
          <span className="text-muted-foreground font-medium">{index + 1}</span>
          <span className="flex items-center gap-2.5 font-medium">
            <span
              className={`w-6 h-6 grid place-items-center rounded-full text-[10px] font-bold ${
                brand.name === "CreativeHit" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {brand.name.slice(0, 1)}
            </span>
            {brand.name}
          </span>
          <span className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${brand.score}%`,
                    background: brand.name === "CreativeHit" ? "#3366FF" : "#D1D5DB",
                  }}
                />
              </div>
              <span className="font-semibold tabular-nums w-8 text-right">{brand.score}%</span>
            </div>
          </span>
          <span className="text-right font-semibold tabular-nums">#{brand.position}</span>
        </div>
      ))}
    </div>
  );
}

function SourceCoverageBars() {
  const maxVal = Math.max(...sourceCoverage.map((d) => d.value));
  return (
    <div className="grid gap-4">
      {sourceCoverage.map((source) => (
        <div key={source.name} className="grid grid-cols-[80px_minmax(0,1fr)_32px] gap-3 items-center">
          <span className="text-xs text-muted-foreground font-medium">{source.name}</span>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(source.value / maxVal) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums text-right">{source.value}%</span>
        </div>
      ))}
    </div>
  );
}

function ActionCard({ icon, title, description, priority }: { icon: string; title: string; description: string; priority: "高优先" | "中优先" | "低优先" }) {
  const priorityColor =
    priority === "高优先"
      ? "bg-destructive/10 text-destructive"
      : priority === "中优先"
        ? "bg-warning/10 text-warning"
        : "bg-muted text-muted-foreground";

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
      <span className="text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium">{title}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColor}`}>{priority}</span>
        </div>
        <p className="text-xs text-muted-foreground m-0">{description}</p>
      </div>
      <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1" />
    </div>
  );
}

export function OverviewPage({ navigate, notify }: PageProps) {
  return (
    <div className="grid gap-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight m-0">
            👋 早上好！<span className="text-primary">CreativeHit</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1 m-0">这是您今日的 AI 可见性概览报告</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted/50 transition-colors" type="button">
            <Calendar size={16} className="text-muted-foreground" />
            最近 7 天
          </button>
          <button className="w-9 h-9 grid place-items-center rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors relative" type="button">
            <Bell size={16} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          </button>
        </div>
      </section>

      <section className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10">
        <div>
          <h3 className="text-lg font-semibold mb-1 tracking-tight m-0">你的品牌已出现在 67% 的监测 AI 回答中</h3>
          <p className="text-sm text-muted-foreground m-0 max-w-2xl leading-relaxed">
            当前在核心 Topic 中保持领先，但引用来源仍过度集中于 UGC。下一步建议优先补齐媒体站、企业站和可复用 URL 级来源。
          </p>
        </div>
      </section>

      <section className="grid grid-cols-5 gap-4">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-white/5 blur-xl" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20">AI 洞察</span>
            </div>
            <h3 className="text-base font-semibold mb-1 m-0">您的品牌在中文创意工具领域已领先竞品 3 倍以上</h3>
            <p className="text-sm text-primary-foreground/80 m-0 max-w-2xl leading-relaxed">
              建议进一步优化 Perplexity 和 Bing Copilot 的内容覆盖，这两处仍有较大增长空间。同时扩展 Reddit 和技术博客来源以提升引用率。
            </p>
          </div>
          <button
            className="shrink-0 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
            type="button"
            onClick={() => notify?.("AI 洞察已保存到行动建议。")}
          >
            查看完整分析
          </button>
        </div>
      </section>

      <section className="grid grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] gap-6">
        <Card className="p-6 min-w-0 border border-border/60 shadow-none bg-card">
          <div className="flex justify-between items-start gap-3 mb-6">
            <div>
              <h3 className="text-base font-semibold mb-1 m-0">可见性趋势</h3>
              <p className="text-xs text-muted-foreground m-0">过去 7 天品牌在 AI 回答中的可见性变化</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-success" />
              <span className="font-semibold text-success">+35%</span>
              <span className="text-muted-foreground text-xs">较上周</span>
            </div>
          </div>
          <TrendChart />
        </Card>

        <Card className="p-6 min-w-0 border border-border/60 shadow-none bg-card">
          <div className="flex justify-between items-start gap-3 mb-6">
            <div>
              <h3 className="text-base font-semibold mb-1 m-0">声量份额</h3>
              <p className="text-xs text-muted-foreground m-0">按品牌拆分当前提及占比</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <DonutChart />
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)_minmax(280px,0.8fr)] gap-6">
        <Card className="p-6 min-w-0 border border-border/60 shadow-none bg-card">
          <div className="flex justify-between items-start gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold mb-1 m-0">品牌可见性排名</h3>
              <p className="text-xs text-muted-foreground m-0">各品牌在 AI 回答中的可见性得分</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate?.("insights")} type="button">
              查看全部
            </Button>
          </div>
          <BrandRankTable />
        </Card>

        <Card className="p-6 min-w-0 border border-border/60 shadow-none bg-card">
          <div className="flex justify-between items-start gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold mb-1 m-0">来源覆盖分布</h3>
              <p className="text-xs text-muted-foreground m-0">各 AI 模型对你品牌的引用率</p>
            </div>
          </div>
          <SourceCoverageBars />
        </Card>

        <Card className="p-6 min-w-0 border border-border/60 shadow-none bg-card">
          <div className="flex justify-between items-start gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold mb-1 m-0">行动建议</h3>
              <p className="text-xs text-muted-foreground m-0">基于当前数据生成的优化建议</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate?.("insights")} type="button">
              查看全部
            </Button>
          </div>
          <div className="grid gap-2">
            {actionRecommendations.map((rec) => (
              <ActionCard key={rec.title} {...rec} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
