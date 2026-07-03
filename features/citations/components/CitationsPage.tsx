"use client";

import { useMemo, useState } from "react";
import { Button, Card, Tag } from "@/ui";
import { citationLevels, citationSources, citationTypeCategory, citationTypeColors } from "@/features/citations/data/citations.mock";

type PageProps = {
  notify?: (message: string) => void;
};

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-xs text-muted-foreground m-0">{description}</p>
    </div>
  );
}

function DomainTable({ level }: { level: "domain" | "host" | "url" }) {
  const rows = useMemo(() => citationSources.filter((row) => row.level === level), [level]);

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="border-b border-border/50 text-muted-foreground font-medium">
          <tr>
            <th className="px-6 py-4 font-medium">来源层级</th>
            <th className="px-6 py-4 font-medium">来源标识</th>
            <th className="px-6 py-4 font-medium">检索率</th>
            <th className="px-6 py-4 font-medium">引用率</th>
            <th className="px-6 py-4 font-medium">类型</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {rows.map((row) => (
            <tr key={`${row.level}-${row.source}`} className="hover:bg-muted/20 transition-colors">
              <td className="px-6 py-4">{row.level}</td>
              <td className="px-6 py-4 font-medium">{row.source}</td>
              <td className="px-6 py-4">{row.retrieved}</td>
              <td className="px-6 py-4">{row.citation}</td>
              <td className="px-6 py-4">
                <Tag className="bg-muted text-foreground font-medium">{row.type}</Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CitationShareChart({ level }: { level: "domain" | "host" | "url" }) {
  const size = 160;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const rows = citationSources.filter((row) => row.level === level);
  const typeTotals: Record<string, number> = {};

  rows.forEach((row) => {
    const category = citationTypeCategory[row.type] ?? "其他";
    const value = parseFloat(row.citation);
    typeTotals[category] = (typeTotals[category] ?? 0) + (Number.isNaN(value) ? 0 : value);
  });

  const total = Object.values(typeTotals).reduce((sum, value) => sum + value, 0);
  const segments = Object.entries(typeTotals)
    .map(([name, value]) => ({
      name,
      value: total > 0 ? (value / total) * 100 : 0,
      color: citationTypeColors[name] ?? "#94A3B8",
    }))
    .sort((a, b) => b.value - a.value);

  let offset = 0;
  const arcs = segments.map((segment) => {
    const dash = (segment.value / 100) * circumference;
    const arc = {
      ...segment,
      dashArray: `${dash} ${circumference - dash}`,
      dashOffset: -offset,
    };
    offset += dash;
    return arc;
  });

  const topSegment = segments[0];

  return (
    <div className="flex items-center gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
          {arcs.map((arc) => (
            <circle
              key={arc.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        {topSegment ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{topSegment.value.toFixed(1)}%</span>
            <span className="text-xs text-muted-foreground">{topSegment.name}</span>
          </div>
        ) : null}
      </div>
      <div className="grid gap-3 text-sm">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: segment.color }} />
            <span className="font-medium text-foreground">{segment.name}</span>
            <span className="text-muted-foreground">{segment.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CitationsPage({ notify }: PageProps) {
  const [level, setLevel] = useState<(typeof citationLevels)[number]>("domain");

  return (
    <div className="grid gap-8">
      <Card className="p-6 min-w-0 border-none shadow-sm bg-surface">
        <div className="flex justify-between items-start gap-3 mb-6">
          <SectionHeading title="引用占比" description="按来源层级查看 AI 回答最常引用的来源类型分布。" />
          <div className="flex flex-wrap gap-2">
            {citationLevels.map((item) => (
              <button
                className={`inline-flex items-center px-4 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${item === level ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
                key={item}
                onClick={() => setLevel(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center py-4">
          <CitationShareChart level={level} />
        </div>
      </Card>

      <Card className="p-0 min-w-0 overflow-hidden border-none shadow-sm bg-surface">
        <div className="flex justify-between items-start gap-3 p-6 border-b border-border/50">
          <SectionHeading title="热点引用来源" description="切换层级后，表格会展示对应来源粒度。" />
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => notify?.(`已切换并准备导出 ${level} 层级引用数据。`)} type="button">
              导出 CSV
            </Button>
          </div>
        </div>
        <DomainTable level={level} />
      </Card>
    </div>
  );
}
