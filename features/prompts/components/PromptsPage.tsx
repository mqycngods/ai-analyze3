"use client";

import { useState } from "react";
import { Button, Card, Input, Tag } from "@/ui";
import { prompts, topics } from "@/features/prompts/data/prompts.mock";

type PageProps = {
  notify?: (message: string) => void;
};

export function PromptsPage({ notify }: PageProps) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const statusCounts = {
    total: prompts.length,
    active: prompts.filter((p) => p.status === "启用中").length,
    suggested: prompts.filter((p) => p.status === "建议中").length,
    archived: prompts.filter((p) => p.status === "已归档").length,
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      searchQuery === "" ||
      prompt.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-6">
      <div className="flex flex-col gap-4">
        <Card className="p-5 min-w-0 h-fit border border-border/40 shadow-none bg-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-0.5">Topic 分组</h3>
            <p className="text-xs text-muted-foreground">按主题查看 Prompt 覆盖范围</p>
          </div>
          <div className="grid gap-1">
            {topics.map((topic, index) => (
              <button
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  activeTopicIndex === index
                    ? "bg-primary/8 text-primary font-medium border border-primary/20"
                    : "hover:bg-muted/50 text-muted-foreground border border-transparent"
                }`}
                key={topic.name}
                type="button"
                onClick={() => setActiveTopicIndex(index)}
              >
                <span>{topic.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    activeTopicIndex === index ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {topic.count}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">提示词管理台</h2>
            <p className="text-sm text-muted-foreground">支持 Topic 分组、状态管理、批量归档与生成扩展。</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => notify?.("已打开 Prompt 生成器占位。下一步可接入生成 API。")}
              type="button"
            >
              生成扩展
            </Button>
            <Button
              size="sm"
              onClick={() => notify?.("已触发新增 Prompt 抽屉占位。")}
              type="button"
              className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            >
              + 新增 Prompt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "全部 Prompt", value: statusCounts.total, note: "较上周 +6", icon: "📋", color: "text-foreground" },
            {
              label: "启用中",
              value: statusCounts.active,
              note: `占比 ${Math.round((statusCounts.active / statusCounts.total) * 100)}%`,
              icon: "✅",
              color: "text-success",
            },
            {
              label: "建议中",
              value: statusCounts.suggested,
              note: `占比 ${Math.round((statusCounts.suggested / statusCounts.total) * 100)}%`,
              icon: "💡",
              color: "text-warning",
            },
            {
              label: "已归档",
              value: statusCounts.archived,
              note: `占比 ${Math.round((statusCounts.archived / statusCounts.total) * 100)}%`,
              icon: "📦",
              color: "text-muted-foreground",
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="p-4 border border-border/40 shadow-none bg-card hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <span className="text-base">{stat.icon}</span>
              </div>
              <div className={`text-2xl font-bold tracking-tight mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.note}</div>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-3 py-1">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <Input
              className="pl-9 bg-card border-border/50 text-sm h-9"
              aria-label="搜索 Prompt"
              placeholder="搜索 Prompt、Topic 或标签"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary" size="sm" type="button" className="h-9 gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            筛选
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" type="button" className="h-9 text-muted-foreground">
            批量操作
            <svg className="ml-1" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" type="button" className="h-9 w-9 text-muted-foreground">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.text}
              className="group bg-card border border-border/40 rounded-xl px-5 py-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                  <div className="w-4 h-4 rounded border border-border/60 bg-background group-hover:border-primary/40 transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-sm text-foreground truncate">{prompt.topic}</span>
                      <Tag
                        className={`shrink-0 text-[11px] px-2 py-0.5 ${
                          prompt.status === "启用中"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : prompt.status === "建议中"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : "bg-muted text-muted-foreground border border-border/40"
                        }`}
                      >
                        {prompt.status}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        type="button"
                        className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors"
                        onClick={() => notify?.("编辑 Prompt")}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground transition-colors"
                        onClick={() => notify?.("更多操作")}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="3" r="1" fill="currentColor" />
                          <circle cx="7" cy="7" r="1" fill="currentColor" />
                          <circle cx="7" cy="11" r="1" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-1">{prompt.text}</p>

                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">可见性</span>
                      <span className="text-sm font-semibold text-foreground">{prompt.visibility}</span>
                      {prompt.sentiment ? (
                        <span
                          className={`text-xs font-medium ${
                            prompt.sentiment.startsWith("+") ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {prompt.sentiment}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">排名</span>
                      <span className="text-sm font-semibold text-foreground">{prompt.position}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Volume</span>
                      <span className="text-sm font-medium text-foreground">{prompt.volume}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Intent</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground font-medium">{prompt.intent}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Branding</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground font-medium">{prompt.branding}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">地区</span>
                      <span className="text-xs text-foreground font-medium">{prompt.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {prompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-primary/8 text-primary/80 font-medium border border-primary/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 pb-1">
          <span className="text-xs text-muted-foreground">共 {filteredPrompts.length} 条</span>
          <div className="flex items-center gap-1">
            <button type="button" className="px-2.5 py-1.5 text-xs rounded-md border border-border/50 text-muted-foreground hover:bg-muted/40 transition-colors disabled:opacity-40" disabled>
              {"<"}
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                  page === 1 ? "bg-primary text-primary-foreground font-medium" : "border border-border/50 text-muted-foreground hover:bg-muted/40"
                }`}
              >
                {page}
              </button>
            ))}
            <button type="button" className="px-2.5 py-1.5 text-xs rounded-md border border-border/50 text-muted-foreground hover:bg-muted/40 transition-colors">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
