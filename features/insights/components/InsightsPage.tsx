"use client";

import { Button, Card, Tag } from "@/ui";
import { brandInsights, sourceGapRows } from "@/features/insights/data/insights.mock";

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

function CompetitorMatrix() {
  const columns = ["ChatGPT", "DeepSeek", "Claude", "Perplexity", "Gemini"];
  const rows = ["Adobe", "Canva", "Midjourney", "OpenAI", "CreativeHit"];

  return (
    <div className="w-full overflow-auto">
      <div className="grid grid-cols-[120px_repeat(5,minmax(80px,1fr))] gap-1 text-sm">
        <div className="p-3 text-muted-foreground font-medium">竞品 / 模型</div>
        {columns.map((column) => (
          <div className="p-3 text-muted-foreground font-medium text-center" key={column}>
            {column}
          </div>
        ))}
        {rows.map((row, rowIndex) => (
          <div key={row} className="contents">
            <div className="p-3 font-medium flex items-center text-muted-foreground">{row}</div>
            {columns.map((column, columnIndex) => {
              const heat = row === "CreativeHit" ? 0 : (rowIndex + columnIndex) % 5;
              const value = row === "CreativeHit" ? "0%" : `${[100, 67, 52, 28, 7][heat]}%`;
              const heatColors = [
                "bg-muted/5 text-muted-foreground",
                "bg-muted/20 text-foreground",
                "bg-muted/40 text-foreground font-medium",
                "bg-muted/60 text-foreground font-semibold",
                "bg-primary text-primary-foreground font-bold",
              ];

              return (
                <div className={`p-3 flex items-center justify-center rounded-md transition-colors ${heatColors[heat]}`} key={`${row}-${column}`}>
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightsPage({ notify }: PageProps) {
  const actionItems = [
    ["扩展引用来源", "当前 UGC 来源占比过高，建议补齐媒体与企业站，提升可信度信号。", "高优先级"],
    ["生成 fan-out queries", "买家意图类 Prompt 与中文市场对比词覆盖仍然偏薄。", "中优先级"],
    ["创建竞品对比页", "当前 AI 回答频繁比较 CreativeHit 与 Canva，但引用第三方总结较多。", "高优先级"],
  ] as const;

  return (
    <div className="grid gap-8">
      <Card className="p-6 border-none shadow-sm bg-surface">
        <div className="flex items-start justify-between gap-4 mb-6">
          <SectionHeading title="竞品 Gap 矩阵" description="按模型 / Topic / 来源查看可见性、声量份额和引用差距。" />
          <div className="flex items-center gap-2">
            <Button variant="secondary" type="button">可见性</Button>
            <Button variant="secondary" type="button">声量份额</Button>
            <Button variant="secondary" type="button">来源差距</Button>
          </div>
        </div>
        <CompetitorMatrix />
      </Card>

      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] gap-6">
        <Card className="p-0 border-none shadow-sm bg-surface overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-6 border-b border-border/50">
            <SectionHeading title="Source Gap Analysis" description="找出竞品覆盖但我方尚未覆盖的关键来源。" />
            <Button variant="secondary" onClick={() => notify?.("已从 Source Gap 生成行动建议。")} type="button">
              一键生成 Action
            </Button>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="border-b border-border/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4 font-medium">来源</th>
                  <th className="px-6 py-4 font-medium">层级</th>
                  <th className="px-6 py-4 font-medium">竞品覆盖</th>
                  <th className="px-6 py-4 font-medium">我方覆盖</th>
                  <th className="px-6 py-4 font-medium">Gap Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {sourceGapRows.map((row) => (
                  <tr key={row[0]} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{row[0]}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row[1]}</td>
                    <td className="px-6 py-4">{row[2]}</td>
                    <td className="px-6 py-4">{row[3]}</td>
                    <td className="px-6 py-4 font-semibold">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-surface">
          <div className="mb-6">
            <SectionHeading title="品牌洞察摘要" description="从矩阵和来源缺口中总结品牌强弱项。" />
          </div>
          <div className="grid gap-4">
            {brandInsights.map((group) => (
              <div className="rounded-2xl bg-muted/20 p-5" key={group.title}>
                <h3 className="text-base font-semibold mb-3 tracking-tight">{group.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 border-none shadow-sm bg-surface">
        <div className="mb-6">
          <SectionHeading title="Action Center" description="基于当前洞察自动生成优先级行动项，帮助团队快速推进下一步。" />
        </div>
        <div className="grid gap-3">
          {actionItems.map((item) => (
            <div className="flex items-center justify-between rounded-2xl bg-muted/20 px-5 py-4" key={item[0]}>
              <div>
                <div className="text-sm font-semibold mb-1">{item[0]}</div>
                <div className="text-sm text-muted-foreground">{item[1]}</div>
              </div>
              <Tag className="bg-muted text-foreground font-medium">{item[2]}</Tag>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
