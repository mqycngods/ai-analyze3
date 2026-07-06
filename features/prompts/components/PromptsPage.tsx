"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Download,
  Edit3,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button, Card } from "@/ui";
import { cn } from "@/lib/utils";

type PageProps = {
  notify?: (message: string) => void;
};

type PromptItem = {
  id: string;
  topic: string;
  text: string;
  translation: string;
  type: "可见性" | "情绪";
  language: string;
  region: string;
  tags: string[];
  platform: string;
  updated: string;
  created: string;
  selected?: boolean;
};

type TopicAnalysisRow = {
  topic: string;
  total: number;
  prompts: string[];
  visibilityRank: string;
  visibilityScore: string;
  shareOfVoice: string;
  averagePosition: string;
  citationShare: string;
  citationRank: string;
  runs: number;
};

const topicRows: TopicAnalysisRow[] = [
  {
    topic: "advertisement ai tools",
    total: 10,
    prompts: [
      "best advertisement AI platform for video content creation",
      "best advertisement AI software for AI content creation teams",
      "best advertisement AI tool for AI content creation",
      "best advertisement AI tools for AI content creation compared",
      "best AI advertising tool for content creators",
      "best value advertisement AI tool for content creation",
      "top advertisement AI tools for AI content creation",
      "top-rated advertisement AI tools for content creators",
      "which ad AI tool is best for social media content creation",
    ],
    visibilityRank: "-",
    visibilityScore: "0%",
    shareOfVoice: "0%",
    averagePosition: "-",
    citationShare: "0%",
    citationRank: "-",
    runs: 0,
  },
  {
    topic: "best ai creative tools",
    total: 1,
    prompts: ["Evaluate the AI Content Creation company CreativeHit on best ai creative tools"],
    visibilityRank: "-",
    visibilityScore: "0%",
    shareOfVoice: "0%",
    averagePosition: "-",
    citationShare: "0%",
    citationRank: "-",
    runs: 2,
  },
];

const promptItems: PromptItem[] = [
  {
    id: "prompt-1",
    topic: "best ai creative tools",
    text: "Evaluate the AI Content Creation company CreativeHit on best ai creative tools",
    translation: "请评价 AI 内容创作公司 CreativeHit 在 AI 创意工具方面的表现。",
    type: "情绪",
    language: "English (en-US) 英语（美国版）",
    region: "United States 美国",
    tags: ["标签"],
    platform: "ChatGPT",
    updated: "01 Jul, 2026 2026 年 7 月 1 日",
    created: "01 Jul, 2026 2026 年 7 月 1 日",
  },
  {
    id: "prompt-2",
    topic: "best ai creative tools",
    text: "best ai creative tools 最优秀的 AI 创意工具",
    translation: "",
    type: "可见性",
    language: "English (en-US) 英语（美国版）",
    region: "United States 美国",
    tags: ["标签"],
    platform: "ChatGPT",
    updated: "03 Jul, 2026 2026 年 7 月 3 日",
    created: "03 Jul, 2026 2026 年 7 月 3 日",
    selected: true,
  },
];

function ToolbarButton({ children }: { children: React.ReactNode }) {
  return (
    <Button className="h-8 gap-1.5 rounded-md px-3 text-xs" size="sm" type="button" variant="secondary">
      {children}
    </Button>
  );
}

function MetricCell({ value }: { value: string | number }) {
  return <span className="font-semibold tabular-nums text-foreground">{value}</span>;
}

function PromptAnalysisTable({ onEdit }: { onEdit: (prompt?: PromptItem) => void }) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  function toggleTopic(topic: string) {
    setExpandedTopics((current) => {
      const next = new Set(current);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  }

  return (
    <Card className="overflow-hidden rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="scrollbar-none overflow-x-auto">
        <div className="min-w-[1180px]">
          <div className="grid grid-cols-[minmax(340px,1fr)_110px_110px_110px_120px_110px_110px_80px_52px] border-b border-border/60 bg-muted/20 px-4 py-3 text-[11px] font-medium text-muted-foreground">
            <span>Topic</span>
            <span>可见度排名</span>
            <span>可见性得分</span>
            <span>声量份额</span>
            <span>平均位置</span>
            <span>引用占比</span>
            <span>引用排名</span>
            <span>运行</span>
            <span />
          </div>
          {topicRows.map((topic) => {
            const isExpanded = expandedTopics.has(topic.topic);

            return (
            <div key={topic.topic}>
              <div
                className="grid w-full cursor-pointer grid-cols-[minmax(340px,1fr)_110px_110px_110px_120px_110px_110px_80px_52px] items-center border-b border-border/50 px-4 py-3 text-left text-xs hover:bg-muted/20"
                onClick={() => toggleTopic(topic.topic)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleTopic(topic.topic);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      size={13}
                      className={cn(
                        "text-muted-foreground transition-transform",
                        isExpanded ? "rotate-0" : "-rotate-90"
                      )}
                    />
                    <span className="truncate font-semibold text-foreground">{topic.topic}</span>
                  </div>
                  <p className="m-0 ml-5 mt-0.5 text-[11px] text-muted-foreground">{topic.total} 个提示词</p>
                </div>
                <span className="text-muted-foreground">{topic.visibilityRank}</span>
                <MetricCell value={topic.visibilityScore} />
                <MetricCell value={topic.shareOfVoice} />
                <span className="text-muted-foreground">{topic.averagePosition}</span>
                <MetricCell value={topic.citationShare} />
                <span className="text-muted-foreground">{topic.citationRank}</span>
                <MetricCell value={topic.runs} />
                <button
                  aria-label="编辑主题提示词"
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(promptItems.find((item) => item.topic === topic.topic));
                  }}
                  type="button"
                >
                  <Edit3 size={14} />
                </button>
              </div>
              {isExpanded ? topic.prompts.map((prompt) => (
                <div
                  className="grid grid-cols-[minmax(340px,1fr)_110px_110px_110px_120px_110px_110px_80px_52px] items-center border-b border-border/40 px-4 py-3 text-xs last:border-b-0 hover:bg-muted/20"
                  key={prompt}
                >
                  <span className="truncate pl-6 text-foreground">{prompt}</span>
                  <span className="text-muted-foreground">-</span>
                  <MetricCell value="0%" />
                  <MetricCell value="0%" />
                  <span className="text-muted-foreground">-</span>
                  <MetricCell value="0%" />
                  <span className="text-muted-foreground">-</span>
                  <MetricCell value={topic.runs === 0 ? 0 : topic.runs} />
                  <button
                    aria-label="编辑提示词"
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => onEdit(promptItems.find((item) => item.text === prompt) ?? promptItems[0])}
                    type="button"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              )) : null}
            </div>
          );
          })}
        </div>
      </div>
    </Card>
  );
}

function DesignerTopicList({ selectedId, onSelect }: { selectedId: string; onSelect: (item: PromptItem) => void }) {
  return (
    <aside className="border-r border-border/60 bg-muted/10">
      <div className="border-b border-border/60 px-3 py-3 text-xs text-muted-foreground">Topics (2) 主题（2）</div>
      <div className="grid gap-1 p-2 text-xs">
        <button className="flex items-center justify-between rounded-md px-2 py-2 text-muted-foreground hover:bg-muted" type="button">
          <span>全部主题</span>
          <span>12</span>
        </button>
        {promptItems.map((item, index) => {
          const active = item.id === selectedId;
          const topic = index === 0 ? "advertisement ai tools 人..." : "best ai creative tools 最优秀的 ...";
          return (
            <button
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-2 text-left",
                active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/70"
              )}
              key={item.id}
              onClick={() => onSelect(item)}
              type="button"
            >
              <span className="truncate">{topic}</span>
              <span>{active ? 2 : 10}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function PromptTypeBadge({ type }: { type: PromptItem["type"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
        type === "可见性" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-foreground"
      )}
    >
      {type}
    </span>
  );
}

function PromptDesignerDrawer({
  prompt,
  onClose,
  onSelect,
}: {
  prompt: PromptItem;
  onClose: () => void;
  onSelect: (prompt: PromptItem) => void;
}) {
  const [draftText, setDraftText] = useState(prompt.text);
  const [draftTranslation, setDraftTranslation] = useState(prompt.translation);

  useEffect(() => {
    setDraftText(prompt.text);
    setDraftTranslation(prompt.translation);
  }, [prompt]);

  return (
    <div aria-label="提示词设计器" aria-modal="true" className="fixed inset-0 z-50 animate-chat-drawer-overlay" role="dialog">
      <button className="absolute inset-0 cursor-default bg-black/35" onClick={onClose} type="button" aria-label="关闭提示词设计器背景" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[1180px] animate-chat-drawer-content flex-col border-l border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="m-0 text-xl font-semibold tracking-tight">提示词设计器</h2>
            <p className="m-0 mt-2 text-sm text-muted-foreground">我们会在各个 AI 平台上运行这些提示词，以生成您在 Profound 中看到的洞察。</p>
          </div>
          <button
            aria-label="关闭"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex items-center justify-between border-b border-border/60 px-6 py-3">
          <div className="flex items-center gap-4 text-sm">
            <button className="border-b-2 border-foreground pb-2 font-medium" type="button">启用</button>
            <button className="pb-2 text-muted-foreground hover:text-foreground" type="button">停用</button>
          </div>
          <span className="text-xs text-muted-foreground">12 / 50 个提示词</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-6 py-3">
          {["提示词类型", "语言", "Tags 标签", "区域", "客户角色", "平台"].map((filter) => (
            <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2.5 text-xs text-muted-foreground hover:bg-muted" key={filter} type="button">
              {filter}
              <ChevronDown size={11} />
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)]">
          <DesignerTopicList selectedId={prompt.id} onSelect={onSelect} />
          <section className="min-w-0 overflow-auto">
            <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/60" placeholder="Search prompts..." type="search" />
              </label>
              <div className="flex flex-wrap gap-2">
                <ToolbarButton>
                  <Download size={13} />
                  导出 2 提示词
                </ToolbarButton>
                <ToolbarButton>
                  <Sparkles size={13} />
                  生成
                </ToolbarButton>
                <ToolbarButton>
                  <Upload size={13} />
                  批量上传
                </ToolbarButton>
                <ToolbarButton>
                  <Plus size={13} />
                  添加提示词
                </ToolbarButton>
              </div>
            </div>

            <div className="scrollbar-none overflow-x-auto">
              <div className="min-w-[1260px]">
                <div className="grid grid-cols-[36px_minmax(360px,1fr)_120px_160px_150px_140px_86px_180px_180px_48px] border-b border-border/60 bg-muted/20 px-4 py-3 text-[11px] font-medium text-muted-foreground">
                  <span />
                  <span>提示词（2）</span>
                  <span>提示词类型</span>
                  <span>语言</span>
                  <span>区域</span>
                  <span>Tags 标签</span>
                  <span>平台</span>
                  <span>已更新</span>
                  <span>已创建</span>
                  <span />
                </div>
                {promptItems.map((item) => {
                  const active = item.id === prompt.id;
                  return (
                    <button
                      className={cn(
                        "grid w-full grid-cols-[36px_minmax(360px,1fr)_120px_160px_150px_140px_86px_180px_180px_48px] items-center border-b border-border/50 px-4 py-3 text-left text-xs transition-colors",
                        active || item.selected ? "bg-emerald-50/80" : "hover:bg-muted/20"
                      )}
                      key={item.id}
                      onClick={() => onSelect(item)}
                      type="button"
                    >
                      <span className="h-3.5 w-3.5 rounded-sm border border-border bg-card" />
                      <span className="min-w-0">
                        <strong className={cn("block truncate text-xs", item.selected ? "text-emerald-700" : "text-foreground")}>{item.text}</strong>
                        {item.translation ? <span className="mt-1 block truncate text-xs text-muted-foreground">{item.translation}</span> : null}
                      </span>
                      <span>
                        <PromptTypeBadge type={item.type} />
                      </span>
                      <span className="truncate text-muted-foreground">{item.language}</span>
                      <span className="truncate text-muted-foreground">{item.region}</span>
                      <span className="text-muted-foreground">+ Tag 标签</span>
                      <span className="font-medium">{item.platform}</span>
                      <span className="truncate text-muted-foreground">{item.updated}</span>
                      <span className="truncate text-muted-foreground">{item.created}</span>
                      <span className="text-muted-foreground">
                        <MoreHorizontal size={14} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-sm font-medium">提示词内容</label>
                <textarea
                  className="min-h-[96px] w-full rounded-lg border border-border bg-card px-3 py-2 text-sm leading-6 outline-none focus:border-primary/60"
                  value={draftText}
                  onChange={(event) => setDraftText(event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">中文说明</label>
                <textarea
                  className="min-h-[72px] w-full rounded-lg border border-border bg-card px-3 py-2 text-sm leading-6 outline-none focus:border-primary/60"
                  placeholder="为团队补充提示词说明"
                  value={draftTranslation}
                  onChange={(event) => setDraftTranslation(event.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" type="button" variant="secondary" onClick={onClose}>
                  取消
                </Button>
                <Button size="sm" type="button">
                  保存修改
                </Button>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export function PromptsPage({ notify }: PageProps) {
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);

  function openDesigner(prompt = promptItems[0]) {
    setActivePrompt(prompt);
    notify?.("已打开提示词设计器。");
  }

  return (
    <>
      <div className="grid gap-4">
        <section className="flex flex-col gap-3 border-b border-border/70 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="m-0 text-xl font-semibold tracking-tight">提示词分析</h1>
            <p className="m-0 mt-2 text-sm text-muted-foreground">每天运行 12 个提示词，涵盖 2 个主题、0 个标签和 2 种分析类型</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">12 / 50 个提示词</span>
            <Button className="gap-2 rounded-md bg-foreground text-background hover:bg-foreground/90" size="sm" type="button" onClick={() => openDesigner()}>
              编辑提示词
              <ExternalLink size={13} />
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            <ToolbarButton>
              按: Topic分组
              <ChevronDown size={12} />
            </ToolbarButton>
            <ToolbarButton>
              自定义列
              <ChevronDown size={12} />
            </ToolbarButton>
            <ToolbarButton>
              <Download size={13} />
            </ToolbarButton>
            <label className="relative block w-52">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
              <input className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-xs outline-none focus:border-primary/60" placeholder="搜索 Topic" type="search" />
            </label>
          </div>
        </section>

        <PromptAnalysisTable onEdit={openDesigner} />
      </div>

      {activePrompt ? (
        <PromptDesignerDrawer
          prompt={activePrompt}
          onClose={() => setActivePrompt(null)}
          onSelect={(prompt) => setActivePrompt(prompt)}
        />
      ) : null}
    </>
  );
}
