"use client";

import { createContext, useContext, useId, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Download,
  Edit3,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button, Card } from "@/ui";
import { cn } from "@/lib/utils";

type PageProps = {
  notify?: (message: string) => void;
};

type PromptStatus = "启用" | "停用";
type PromptType = "可见性" | "情绪" | "引用" | "竞品";

type PromptItem = {
  id: string;
  status: PromptStatus;
  topics: string[];
  text: string;
  translation: string;
  types: PromptType[];
  languages: string[];
  regions: string[];
  tags: string[];
  platforms: string[];
  updated: string;
  created: string;
};

type PromptAnalysisRow = {
  group: string;
  total: number;
  prompts: PromptItem[];
  visibilityRank: string;
  visibilityScore: string;
  shareOfVoice: string;
  averagePosition: string;
  citationShare: string;
  citationRank: string;
  runs: number;
};

type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectGroupContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const MultiSelectGroupContext = createContext<MultiSelectGroupContextValue | null>(null);

function MultiSelectGroupProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return <MultiSelectGroupContext.Provider value={{ openId, setOpenId }}>{children}</MultiSelectGroupContext.Provider>;
}

type PromptFilters = {
  types: string[];
  topics: string[];
  languages: string[];
  tags: string[];
  regions: string[];
  platforms: string[];
};

type PromptGroupBy = "types" | "topics" | "tags" | "regions";

type EditableField = "status" | "text" | "types" | "topics" | "languages" | "regions" | "tags" | "platforms";

type EditingCell = {
  rowId: string;
  field: EditableField;
} | null;

const promptTypeOptions: MultiSelectOption[] = [
  { label: "可见性", value: "可见性" },
  { label: "情绪", value: "情绪" },
  { label: "引用", value: "引用" },
  { label: "竞品", value: "竞品" },
];

const topicOptions: MultiSelectOption[] = [
  { label: "advertisement ai tools", value: "advertisement ai tools" },
  { label: "best ai creative tools", value: "best ai creative tools" },
  { label: "AI 内容生产", value: "AI 内容生产" },
  { label: "Prompt 扩展", value: "Prompt 扩展" },
];

const languageOptions: MultiSelectOption[] = [
  { label: "English (en-US)", value: "English (en-US)" },
  { label: "简体中文", value: "简体中文" },
  { label: "日本語", value: "日本語" },
  { label: "Deutsch", value: "Deutsch" },
];

const regionOptions: MultiSelectOption[] = [
  { label: "United States 美国", value: "United States 美国" },
  { label: "中国", value: "中国" },
  { label: "Japan 日本", value: "Japan 日本" },
  { label: "Germany 德国", value: "Germany 德国" },
];

const tagOptions: MultiSelectOption[] = [
  { label: "核心 Topic", value: "核心 Topic" },
  { label: "品牌曝光", value: "品牌曝光" },
  { label: "竞品", value: "竞品" },
  { label: "增长", value: "增长" },
  { label: "新建", value: "新建" },
];

const platformOptions: MultiSelectOption[] = [
  { label: "ChatGPT", value: "ChatGPT" },
  { label: "Perplexity", value: "Perplexity" },
  { label: "Gemini", value: "Gemini" },
  { label: "Claude", value: "Claude" },
];

const promptGroupOptions: Array<{ label: string; value: PromptGroupBy }> = [
  { label: "提示词类型", value: "types" },
  { label: "主题", value: "topics" },
  { label: "标签", value: "tags" },
  { label: "区域", value: "regions" },
];

const todayLabel = "06 Jul, 2026 2026 年 7 月 6 日";

const initialPromptItems: PromptItem[] = [
  {
    id: "prompt-1",
    status: "启用",
    topics: ["best ai creative tools"],
    text: "Evaluate the AI Content Creation company CreativeHit on best ai creative tools",
    translation: "请评价 AI 内容创作公司 CreativeHit 在 AI 创意工具方面的表现。",
    types: ["情绪"],
    languages: ["English (en-US)"],
    regions: ["United States 美国"],
    tags: ["品牌曝光"],
    platforms: ["ChatGPT"],
    updated: "01 Jul, 2026 2026 年 7 月 1 日",
    created: "01 Jul, 2026 2026 年 7 月 1 日",
  },
  {
    id: "prompt-2",
    status: "启用",
    topics: ["best ai creative tools"],
    text: "best ai creative tools 最优秀的 AI 创意工具",
    translation: "",
    types: ["可见性"],
    languages: ["English (en-US)"],
    regions: ["United States 美国"],
    tags: ["核心 Topic"],
    platforms: ["ChatGPT"],
    updated: "03 Jul, 2026 2026 年 7 月 3 日",
    created: "03 Jul, 2026 2026 年 7 月 3 日",
  },
  {
    id: "prompt-3",
    status: "停用",
    topics: ["advertisement ai tools"],
    text: "best advertisement AI platform for video content creation",
    translation: "用于测试广告视频创作平台可见性的旧提示词。",
    types: ["可见性", "竞品"],
    languages: ["English (en-US)"],
    regions: ["United States 美国"],
    tags: ["竞品"],
    platforms: ["ChatGPT", "Perplexity"],
    updated: "02 Jul, 2026 2026 年 7 月 2 日",
    created: "01 Jul, 2026 2026 年 7 月 1 日",
  },
];

function getGroupValues(item: PromptItem, groupBy: PromptGroupBy) {
  return item[groupBy].length > 0 ? item[groupBy] : ["未设置"];
}

function getAnalysisRows(items: PromptItem[], groupBy: PromptGroupBy): PromptAnalysisRow[] {
  const groups = new Map<string, PromptItem[]>();

  items.forEach((item) => {
    getGroupValues(item, groupBy).forEach((group) => {
      const current = groups.get(group) ?? [];
      current.push(item);
      groups.set(group, current);
    });
  });

  return Array.from(groups.entries()).map(([group, rows]) => ({
    group,
    total: rows.length,
    prompts: rows,
    visibilityRank: "-",
    visibilityScore: rows.some((row) => row.status === "启用") ? "0%" : "-",
    shareOfVoice: rows.some((row) => row.status === "启用") ? "0%" : "-",
    averagePosition: "-",
    citationShare: rows.some((row) => row.types.includes("引用")) ? "0%" : "-",
    citationRank: "-",
    runs: rows.filter((row) => row.status === "启用").length,
  }));
}

function ToolbarButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button className="h-8 gap-1.5 rounded-md px-3 text-xs" onClick={onClick} size="sm" type="button" variant="secondary">
      {children}
    </Button>
  );
}

function GroupBySelect({
  value,
  onChange,
}: {
  value: PromptGroupBy;
  onChange: (value: PromptGroupBy) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = promptGroupOptions.find((option) => option.value === value) ?? promptGroupOptions[1];

  return (
    <div className="relative inline-flex">
      <button
        className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-muted/20 px-3 text-left text-xs text-foreground outline-none transition-colors hover:border-muted-foreground/30 hover:bg-muted/50"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="text-muted-foreground">按:</span>
        <span className="font-medium">{selected.label}分组</span>
        <ChevronDown size={12} className={cn("text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-40 rounded-md border border-border bg-popover p-1 shadow-lg">
          {promptGroupOptions.map((option) => {
            const checked = option.value === value;
            return (
              <button
                className="flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                type="button"
              >
                <span>{option.label}</span>
                {checked ? <Check size={12} className="text-foreground" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function MetricCell({ value }: { value: string | number }) {
  return <span className="font-semibold tabular-nums text-foreground">{value}</span>;
}

function PromptAnalysisTable({
  groupBy,
  items,
  onEdit,
}: {
  groupBy: PromptGroupBy;
  items: PromptItem[];
  onEdit: (prompt?: PromptItem) => void;
}) {
  const groupRows = useMemo(() => getAnalysisRows(items, groupBy), [groupBy, items]);
  const groupLabel = promptGroupOptions.find((option) => option.value === groupBy)?.label ?? "主题";
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  function toggleGroup(group: string) {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }

  return (
    <Card className="overflow-hidden rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="scrollbar-none overflow-x-auto">
        <div className="min-w-[1180px]">
          <div className="grid grid-cols-[minmax(340px,1fr)_110px_110px_110px_120px_110px_110px_80px_52px] border-b border-border/60 bg-muted/20 px-4 py-3 text-[11px] font-medium text-muted-foreground">
            <span>{groupLabel}</span>
            <span>可见度排名</span>
            <span>可见性得分</span>
            <span>声量份额</span>
            <span>平均位置</span>
            <span>引用占比</span>
            <span>引用排名</span>
            <span>运行</span>
            <span />
          </div>
          {groupRows.map((topic) => {
            const isExpanded = expandedGroups.has(topic.group);

            return (
              <div key={topic.group}>
                <div
                  className="grid w-full cursor-pointer grid-cols-[minmax(340px,1fr)_110px_110px_110px_120px_110px_110px_80px_52px] items-center border-b border-border/50 px-4 py-3 text-left text-xs hover:bg-muted/20"
                  onClick={() => toggleGroup(topic.group)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleGroup(topic.group);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        size={13}
                        className={cn("text-muted-foreground transition-transform", isExpanded ? "rotate-0" : "-rotate-90")}
                      />
                      <span className="truncate font-semibold text-foreground">{topic.group}</span>
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
                      onEdit(topic.prompts[0]);
                    }}
                    type="button"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                {isExpanded
                  ? topic.prompts.map((prompt) => (
                      <div
                        className="grid grid-cols-[minmax(340px,1fr)_110px_110px_110px_120px_110px_110px_80px_52px] items-center border-b border-border/40 px-4 py-3 text-xs last:border-b-0 hover:bg-muted/20"
                        key={prompt.id}
                      >
                        <span className="truncate pl-6 text-foreground">{prompt.text}</span>
                        <span className="text-muted-foreground">-</span>
                        <MetricCell value="0%" />
                        <MetricCell value="0%" />
                        <span className="text-muted-foreground">-</span>
                        <MetricCell value="0%" />
                        <span className="text-muted-foreground">-</span>
                        <MetricCell value={topic.runs} />
                        <button
                          aria-label="编辑提示词"
                          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => onEdit(prompt)}
                          type="button"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    ))
                  : null}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function MultiSelect({
  label,
  options,
  values,
  onChange,
  compact = false,
  variant = "tag",
}: {
  label: string;
  options: MultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  compact?: boolean;
  variant?: "tag" | "field";
}) {
  const multiSelectId = useId();
  const group = useContext(MultiSelectGroupContext);
  const [localOpen, setLocalOpen] = useState(false);
  const open = group ? group.openId === multiSelectId : localOpen;
  const firstSelected = values[0];
  const selectedLabels = values.length > 0 ? values.join(", ") : label;

  function setOpen(nextOpen: boolean) {
    if (group) {
      group.setOpenId(nextOpen ? multiSelectId : null);
      return;
    }

    setLocalOpen(nextOpen);
  }

  function toggleValue(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <div className={cn("relative", variant === "tag" ? "inline-flex" : "w-full")}>
      <button
        className={cn(
          "flex items-center text-left text-xs text-foreground outline-none transition-colors",
          variant === "field"
            ? "w-full justify-between gap-2 rounded-md border border-border bg-card hover:bg-muted/40"
            : "w-auto max-w-[260px] justify-start gap-1 rounded-md border border-border bg-muted/20 hover:border-muted-foreground/30 hover:bg-muted/50",
          compact ? "min-h-8 px-2" : "min-h-8 px-2.5",
          open && "border-muted-foreground/40 bg-muted/50"
        )}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {variant === "tag" ? (
          <>
            <span className="shrink-0 text-muted-foreground">{label}</span>
            {firstSelected ? (
              <span className="max-w-[104px] truncate rounded bg-card px-1.5 py-0.5 font-medium text-foreground shadow-sm">
                {firstSelected}
              </span>
            ) : null}
            {values.length > 1 ? <span className="shrink-0 text-[11px] text-muted-foreground">+{values.length - 1}</span> : null}
            {values.length > 0 ? (
              <span
                className="grid h-4 w-4 shrink-0 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange([]);
                }}
                title={`清除${label}`}
              >
                <X size={10} />
              </span>
            ) : (
              <ChevronDown size={11} className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
            )}
          </>
        ) : (
          <>
            <span className={cn("truncate", values.length === 0 && "text-muted-foreground")}>{selectedLabels}</span>
            <ChevronDown size={12} className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
          </>
        )}
      </button>
      {open ? (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
          {options.map((option) => {
            const checked = values.includes(option.value);
            return (
              <button
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
                key={option.value}
                onClick={() => toggleValue(option.value)}
                type="button"
              >
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded border",
                    checked ? "border-foreground bg-foreground text-background" : "border-border bg-card"
                  )}
                >
                  {checked ? <Check size={11} /> : null}
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PromptTypeBadges({ types }: { types: string[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {types.map((type) => (
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
            type === "可见性" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-foreground"
          )}
          key={type}
        >
          {type}
        </span>
      ))}
    </span>
  );
}

function ReadonlyCell({
  children,
  className,
  onDoubleClick,
}: {
  children: React.ReactNode;
  className?: string;
  onDoubleClick: () => void;
}) {
  return (
    <button
      className={cn(
        "min-h-8 w-full rounded-md px-2 py-1.5 text-left text-xs outline-none hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      onDoubleClick={onDoubleClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ValuePreview({ values, placeholder }: { values: string[]; placeholder: string }) {
  return (
    <span className={cn("block truncate", values.length === 0 && "text-muted-foreground")}>
      {values.length > 0 ? values.join(", ") : placeholder}
    </span>
  );
}

function DesignerTopicList({
  items,
  selectedId,
  onSelect,
}: {
  items: PromptItem[];
  selectedId: string;
  onSelect: (item: PromptItem) => void;
}) {
  const topicCounts = topicOptions.map((topic) => ({
    ...topic,
    count: items.filter((item) => item.topics.includes(topic.value)).length,
  }));

  return (
    <aside className="border-r border-border/60 bg-muted/10">
      <div className="border-b border-border/60 px-3 py-3 text-xs text-muted-foreground">Topics ({topicCounts.length}) 主题</div>
      <div className="grid gap-1 p-2 text-xs">
        <button className="flex items-center justify-between rounded-md px-2 py-2 text-muted-foreground hover:bg-muted" type="button">
          <span>全部主题</span>
          <span>{items.length}</span>
        </button>
        {topicCounts.map((topic) => {
          const firstItem = items.find((item) => item.topics.includes(topic.value));
          const active = firstItem?.id === selectedId;
          return (
            <button
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-2 text-left",
                active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/70"
              )}
              disabled={!firstItem}
              key={topic.value}
              onClick={() => firstItem && onSelect(firstItem)}
              type="button"
            >
              <span className="truncate">{topic.label}</span>
              <span>{topic.count}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function EditablePromptTable({
  items,
  activeId,
  onSelect,
  onUpdate,
  onDelete,
}: {
  items: PromptItem[];
  activeId: string;
  onSelect: (prompt: PromptItem) => void;
  onUpdate: (id: string, patch: Partial<PromptItem>) => void;
  onDelete: (id: string) => void;
}) {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  function isEditing(rowId: string, field: EditableField) {
    return editingCell?.rowId === rowId && editingCell.field === field;
  }

  return (
    <div className="scrollbar-none overflow-x-auto">
      <div className="min-w-[1540px]">
        <div className="grid grid-cols-[92px_minmax(320px,1fr)_180px_180px_180px_170px_170px_180px_170px_170px_48px] border-b border-border/60 bg-muted/20 px-4 py-3 text-[11px] font-medium text-muted-foreground">
          <span>状态</span>
          <span>提示词（{items.length}）</span>
          <span>提示词类型</span>
          <span>主题</span>
          <span>语言</span>
          <span>区域</span>
          <span>Tags 标签</span>
          <span>平台</span>
          <span>已更新</span>
          <span>已创建</span>
          <span />
        </div>
        {items.map((item) => {
          const active = item.id === activeId;

          return (
            <div
              className={cn(
                "grid grid-cols-[92px_minmax(320px,1fr)_180px_180px_180px_170px_170px_180px_170px_170px_48px] items-start gap-2 border-b border-border/50 px-4 py-3 text-xs transition-colors",
                active ? "bg-emerald-50/80" : "hover:bg-muted/20"
              )}
              key={item.id}
              onFocusCapture={() => onSelect(item)}
            >
              <select
                className={cn(
                  "h-8 rounded-md border border-border bg-card px-2 text-xs outline-none focus:border-primary/60",
                  !isEditing(item.id, "status") && "hidden"
                )}
                value={item.status}
                onBlur={() => setEditingCell(null)}
                onChange={(event) => onUpdate(item.id, { status: event.target.value as PromptStatus, updated: todayLabel })}
              >
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
              {!isEditing(item.id, "status") ? (
                <ReadonlyCell onDoubleClick={() => setEditingCell({ rowId: item.id, field: "status" })}>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                      item.status === "启用" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.status}
                  </span>
                </ReadonlyCell>
              ) : null}

              {isEditing(item.id, "text") ? (
                <textarea
                  autoFocus
                  className="min-h-8 resize-y rounded-md border border-border bg-card px-2 py-1.5 text-xs leading-5 outline-none focus:border-primary/60"
                  value={item.text}
                  onBlur={() => setEditingCell(null)}
                  onChange={(event) => onUpdate(item.id, { text: event.target.value, updated: todayLabel })}
                />
              ) : (
                <ReadonlyCell className="leading-5 text-foreground" onDoubleClick={() => setEditingCell({ rowId: item.id, field: "text" })}>
                  <span className="line-clamp-2">{item.text}</span>
                </ReadonlyCell>
              )}

              {isEditing(item.id, "types") ? (
                <MultiSelect compact label="提示词类型" options={promptTypeOptions} values={item.types} onChange={(types) => onUpdate(item.id, { types: types as PromptType[], updated: todayLabel })} />
              ) : (
                <ReadonlyCell onDoubleClick={() => setEditingCell({ rowId: item.id, field: "types" })}>
                  <PromptTypeBadges types={item.types} />
                </ReadonlyCell>
              )}
              {isEditing(item.id, "topics") ? (
                <MultiSelect compact label="主题" options={topicOptions} values={item.topics} onChange={(topics) => onUpdate(item.id, { topics, updated: todayLabel })} />
              ) : (
                <ReadonlyCell onDoubleClick={() => setEditingCell({ rowId: item.id, field: "topics" })}>
                  <ValuePreview values={item.topics} placeholder="选择主题" />
                </ReadonlyCell>
              )}
              {isEditing(item.id, "languages") ? (
                <MultiSelect compact label="语言" options={languageOptions} values={item.languages} onChange={(languages) => onUpdate(item.id, { languages, updated: todayLabel })} />
              ) : (
                <ReadonlyCell onDoubleClick={() => setEditingCell({ rowId: item.id, field: "languages" })}>
                  <ValuePreview values={item.languages} placeholder="选择语言" />
                </ReadonlyCell>
              )}
              {isEditing(item.id, "regions") ? (
                <MultiSelect compact label="区域" options={regionOptions} values={item.regions} onChange={(regions) => onUpdate(item.id, { regions, updated: todayLabel })} />
              ) : (
                <ReadonlyCell onDoubleClick={() => setEditingCell({ rowId: item.id, field: "regions" })}>
                  <ValuePreview values={item.regions} placeholder="选择区域" />
                </ReadonlyCell>
              )}
              {isEditing(item.id, "tags") ? (
                <MultiSelect compact label="标签" options={tagOptions} values={item.tags} onChange={(tags) => onUpdate(item.id, { tags, updated: todayLabel })} />
              ) : (
                <ReadonlyCell onDoubleClick={() => setEditingCell({ rowId: item.id, field: "tags" })}>
                  <ValuePreview values={item.tags} placeholder="选择标签" />
                </ReadonlyCell>
              )}
              {isEditing(item.id, "platforms") ? (
                <MultiSelect compact label="平台" options={platformOptions} values={item.platforms} onChange={(platforms) => onUpdate(item.id, { platforms, updated: todayLabel })} />
              ) : (
                <ReadonlyCell onDoubleClick={() => setEditingCell({ rowId: item.id, field: "platforms" })}>
                  <ValuePreview values={item.platforms} placeholder="选择平台" />
                </ReadonlyCell>
              )}
              <span className="truncate pt-2 text-muted-foreground">{item.updated}</span>
              <span className="truncate pt-2 text-muted-foreground">{item.created}</span>
              <button
                aria-label="删除提示词"
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
                onClick={() => onDelete(item.id)}
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GeneratePromptModal({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: (items: PromptItem[]) => void;
}) {
  const [topics, setTopics] = useState<string[]>(["best ai creative tools"]);
  const [count, setCount] = useState(10);
  const [regions, setRegions] = useState<string[]>(["United States 美国"]);
  const [languages, setLanguages] = useState<string[]>(["English (en-US)"]);
  const [platforms, setPlatforms] = useState<string[]>(["ChatGPT"]);
  const [instructions, setInstructions] = useState("");

  function generateRows() {
    const safeCount = Math.max(1, Math.min(count, 50));
    const selectedTopics = topics.length > 0 ? topics : ["best ai creative tools"];
    const rows = selectedTopics.flatMap((topic, topicIndex) =>
      Array.from({ length: safeCount }).map((_, index) => {
        const platform = platforms[index % Math.max(platforms.length, 1)] ?? "ChatGPT";
        const prefix = instructions.trim() ? `${instructions.trim()} ` : "";

        return {
          id: `generated-${Date.now()}-${topicIndex}-${index}`,
          status: "启用" as PromptStatus,
          topics: [topic],
          text: `${prefix}What are the best ${topic} for brand visibility on ${platform}?`,
          translation: "由提示词生成器创建，可在表格中继续编辑。",
          types: ["可见性"] as PromptType[],
          languages: languages.length > 0 ? languages : ["English (en-US)"],
          regions: regions.length > 0 ? regions : ["United States 美国"],
          tags: ["新建"],
          platforms: platforms.length > 0 ? platforms : ["ChatGPT"],
          updated: todayLabel,
          created: todayLabel,
        };
      })
    );

    onGenerate(rows);
  }

  return (
    <MultiSelectGroupProvider>
      <div aria-label="生成提示词" aria-modal="true" className="fixed inset-0 z-[60] grid place-items-center bg-black/35 p-4" role="dialog">
        <section className="w-full max-w-[620px] rounded-lg border border-border bg-card shadow-2xl">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="m-0 text-base font-semibold">生成提示词</h3>
              <p className="m-0 mt-1 text-xs text-muted-foreground">选择主题、区域、语言和平台，生成后会追加到可编辑表格。</p>
            </div>
            <button aria-label="关闭生成弹窗" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onClose} type="button">
              <X size={17} />
            </button>
          </header>
          <div className="grid gap-4 px-5 py-5">
            <MultiSelect label="选择主题" options={topicOptions} values={topics} onChange={setTopics} variant="field" />
            <label className="grid gap-2 text-xs font-medium">
              每个主题的提示词数量
              <input
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary/60"
                max={50}
                min={1}
                type="number"
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
              />
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              <MultiSelect label="区域" options={regionOptions} values={regions} onChange={setRegions} variant="field" />
              <MultiSelect label="语言" options={languageOptions} values={languages} onChange={setLanguages} variant="field" />
              <MultiSelect label="平台" options={platformOptions} values={platforms} onChange={setPlatforms} variant="field" />
            </div>
            <label className="grid gap-2 text-xs font-medium">
              附加说明
              <textarea
                className="min-h-[92px] rounded-md border border-border bg-card px-3 py-2 text-sm leading-6 outline-none focus:border-primary/60"
                placeholder="输入任何用于生成提示词的附加说明..."
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </label>
          </div>
          <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
            <Button size="sm" type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button className="rounded-md bg-foreground text-background hover:bg-foreground/90" size="sm" type="button" onClick={generateRows}>
              生成
            </Button>
          </footer>
        </section>
      </div>
    </MultiSelectGroupProvider>
  );
}

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function csvList(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePromptCsv(csv: string): PromptItem[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = splitCsvLine(lines[0] ?? "").map((header) => header.trim().toLowerCase());

  return lines.slice(1).map((line, index) => {
    const values = splitCsvLine(line);
    const row = new Map(headers.map((header, valueIndex) => [header, values[valueIndex] ?? ""]));
    const text = row.get("text") || row.get("prompt") || row.get("提示词") || "";
    const topics = csvList(row.get("topics") || row.get("topic") || row.get("主题"));

    return {
      id: row.get("id") || `csv-${Date.now()}-${index}`,
      status: ((row.get("status") || row.get("状态") || "启用") === "停用" ? "停用" : "启用") as PromptStatus,
      topics: topics.length > 0 ? topics : ["best ai creative tools"],
      text,
      translation: row.get("translation") || row.get("中文说明") || "",
      types: (csvList(row.get("types") || row.get("type") || row.get("提示词类型")).length > 0
        ? csvList(row.get("types") || row.get("type") || row.get("提示词类型"))
        : ["可见性"]) as PromptType[],
      languages: csvList(row.get("languages") || row.get("language") || row.get("语言")),
      regions: csvList(row.get("regions") || row.get("region") || row.get("区域")),
      tags: csvList(row.get("tags") || row.get("标签")),
      platforms: csvList(row.get("platforms") || row.get("platform") || row.get("平台")),
      updated: todayLabel,
      created: todayLabel,
    };
  });
}

function PromptDesignerDrawer({
  prompt,
  items,
  activeStatus,
  search,
  onClose,
  onSelect,
  onStatusChange,
  onSearchChange,
  filters,
  onFiltersChange,
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onGenerateClick,
  onCsvUpload,
}: {
  prompt: PromptItem;
  items: PromptItem[];
  activeStatus: PromptStatus;
  search: string;
  onClose: () => void;
  onSelect: (prompt: PromptItem) => void;
  onStatusChange: (status: PromptStatus) => void;
  onSearchChange: (search: string) => void;
  filters: PromptFilters;
  onFiltersChange: (filters: PromptFilters) => void;
  onAddPrompt: () => void;
  onUpdatePrompt: (id: string, patch: Partial<PromptItem>) => void;
  onDeletePrompt: (id: string) => void;
  onGenerateClick: () => void;
  onCsvUpload: (file: File) => void;
}) {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  return (
    <MultiSelectGroupProvider>
      <div aria-label="提示词设计器" aria-modal="true" className="fixed inset-0 z-50 animate-chat-drawer-overlay" role="dialog">
        <button className="absolute inset-0 cursor-default bg-black/35" onClick={onClose} type="button" aria-label="关闭提示词设计器背景" />
        <aside className="absolute right-0 top-0 flex h-full w-full max-w-[1280px] animate-chat-drawer-content flex-col border-l border-border bg-card shadow-2xl">
          <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              <h2 className="m-0 text-xl font-semibold tracking-tight">提示词设计器</h2>
              <p className="m-0 mt-2 text-sm text-muted-foreground">管理提示词状态、维度和内容；表格内可直接编辑，CSV 可批量新增或更新。</p>
            </div>
            <button aria-label="关闭" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onClose} type="button">
              <X size={18} />
            </button>
          </header>

          <div className="flex items-center border-b border-border/60 px-6 py-3">
            <div className="flex items-center gap-4 text-sm">
              {(["启用", "停用"] as PromptStatus[]).map((status) => (
                <button
                  className={cn("pb-2", activeStatus === status ? "border-b-2 border-foreground font-medium" : "text-muted-foreground hover:text-foreground")}
                  key={status}
                  onClick={() => onStatusChange(status)}
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-6 py-3">
            <MultiSelect label="提示词类型" options={promptTypeOptions} values={filters.types} onChange={(types) => onFiltersChange({ ...filters, types })} />
            <MultiSelect label="主题" options={topicOptions} values={filters.topics} onChange={(topics) => onFiltersChange({ ...filters, topics })} />
            <MultiSelect label="语言" options={languageOptions} values={filters.languages} onChange={(languages) => onFiltersChange({ ...filters, languages })} />
            <MultiSelect label="标签" options={tagOptions} values={filters.tags} onChange={(tags) => onFiltersChange({ ...filters, tags })} />
            <MultiSelect label="区域" options={regionOptions} values={filters.regions} onChange={(regions) => onFiltersChange({ ...filters, regions })} />
            <MultiSelect label="平台" options={platformOptions} values={filters.platforms} onChange={(platforms) => onFiltersChange({ ...filters, platforms })} />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)]">
            <DesignerTopicList items={items} selectedId={prompt.id} onSelect={onSelect} />
            <section className="min-w-0 overflow-auto">
              <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <label className="relative block w-full max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/60"
                    placeholder="Search prompts..."
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <ToolbarButton>
                    <Download size={13} />
                    导出 {items.length} 提示词
                  </ToolbarButton>
                  <ToolbarButton onClick={onGenerateClick}>
                    <Sparkles size={13} />
                    生成
                  </ToolbarButton>
                  <ToolbarButton onClick={() => uploadInputRef.current?.click()}>
                    <Upload size={13} />
                    批量上传
                  </ToolbarButton>
                  <input
                    accept=".csv,text/csv"
                    className="hidden"
                    ref={uploadInputRef}
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        onCsvUpload(file);
                      }
                      event.currentTarget.value = "";
                    }}
                  />
                  <ToolbarButton onClick={onAddPrompt}>
                    <Plus size={13} />
                    添加提示词
                  </ToolbarButton>
                </div>
              </div>

              <EditablePromptTable
                activeId={prompt.id}
                items={items}
                onDelete={onDeletePrompt}
                onSelect={onSelect}
                onUpdate={onUpdatePrompt}
              />

              <div className="grid gap-4 px-6 py-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MoreHorizontal size={14} />
                  当前选中提示词详情
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">提示词内容</label>
                  <textarea
                    className="min-h-[96px] w-full rounded-lg border border-border bg-card px-3 py-2 text-sm leading-6 outline-none focus:border-primary/60"
                    value={prompt.text}
                    onChange={(event) => onUpdatePrompt(prompt.id, { text: event.target.value, updated: todayLabel })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">中文说明</label>
                  <textarea
                    className="min-h-[72px] w-full rounded-lg border border-border bg-card px-3 py-2 text-sm leading-6 outline-none focus:border-primary/60"
                    placeholder="为团队补充提示词说明"
                    value={prompt.translation}
                    onChange={(event) => onUpdatePrompt(prompt.id, { translation: event.target.value, updated: todayLabel })}
                  />
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </MultiSelectGroupProvider>
  );
}

export function PromptsPage({ notify }: PageProps) {
  const [prompts, setPrompts] = useState<PromptItem[]>(initialPromptItems);
  const [activePromptId, setActivePromptId] = useState(initialPromptItems[0].id);
  const [activeStatus, setActiveStatus] = useState<PromptStatus>("启用");
  const [groupBy, setGroupBy] = useState<PromptGroupBy>("topics");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PromptFilters>({
    types: [],
    topics: [],
    languages: [],
    tags: [],
    regions: [],
    platforms: [],
  });
  const [designerOpen, setDesignerOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const activePrompt = prompts.find((item) => item.id === activePromptId) ?? prompts[0];
  function matchesSearch(item: PromptItem) {
    const query = search.trim().toLowerCase();
    return (
      query.length === 0 ||
      [item.text, item.translation, ...item.topics, ...item.tags, ...item.languages, ...item.regions, ...item.platforms]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }

  function matchesFilters(item: PromptItem) {
    return (
      (filters.types.length === 0 || filters.types.some((filter) => item.types.includes(filter as PromptType))) &&
      (filters.topics.length === 0 || filters.topics.some((filter) => item.topics.includes(filter))) &&
      (filters.languages.length === 0 || filters.languages.some((filter) => item.languages.includes(filter))) &&
      (filters.tags.length === 0 || filters.tags.some((filter) => item.tags.includes(filter))) &&
      (filters.regions.length === 0 || filters.regions.some((filter) => item.regions.includes(filter))) &&
      (filters.platforms.length === 0 || filters.platforms.some((filter) => item.platforms.includes(filter)))
    );
  }

  const analysisPrompts = prompts.filter(matchesSearch);
  const filteredPrompts = prompts.filter((item) => item.status === activeStatus && matchesSearch(item) && matchesFilters(item));

  function openDesigner(prompt = prompts[0]) {
    setActivePromptId(prompt.id);
    setDesignerOpen(true);
    notify?.("已打开提示词设计器。");
  }

  function updatePrompt(id: string, patch: Partial<PromptItem>) {
    setPrompts((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addPrompt() {
    const newPrompt: PromptItem = {
      id: `prompt-${Date.now()}`,
      status: activeStatus,
      topics: ["best ai creative tools"],
      text: "New editable prompt",
      translation: "",
      types: ["可见性"],
      languages: ["English (en-US)"],
      regions: ["United States 美国"],
      tags: ["新建"],
      platforms: ["ChatGPT"],
      updated: todayLabel,
      created: todayLabel,
    };

    setPrompts((current) => [newPrompt, ...current]);
    setActivePromptId(newPrompt.id);
    notify?.("已添加一行新提示词，可直接编辑。");
  }

  function deletePrompt(id: string) {
    setPrompts((current) => {
      const next = current.filter((item) => item.id !== id);
      if (activePromptId === id && next.length > 0) {
        setActivePromptId(next[0].id);
      }
      return next;
    });
  }

  function mergePrompts(nextItems: PromptItem[]) {
    setPrompts((current) => {
      const merged = [...current];
      nextItems.forEach((item) => {
        const index = merged.findIndex((currentItem) => currentItem.id === item.id || currentItem.text === item.text);
        if (index >= 0) {
          merged[index] = { ...merged[index], ...item, id: merged[index].id, created: merged[index].created };
        } else {
          merged.unshift(item);
        }
      });
      return merged;
    });
  }

  function handleGenerated(items: PromptItem[]) {
    mergePrompts(items);
    setActivePromptId(items[0]?.id ?? activePromptId);
    setGenerateOpen(false);
    notify?.(`已生成 ${items.length} 条提示词。`);
  }

  function handleCsvUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parsePromptCsv(String(reader.result ?? "")).filter((row) => row.text.trim().length > 0);
      mergePrompts(rows);
      if (rows[0]) {
        setActivePromptId(rows[0].id);
      }
      notify?.(`CSV 已处理：新增或更新 ${rows.length} 条提示词。`);
    };
    reader.readAsText(file);
  }

  return (
    <>
      <div className="grid gap-4">
        <section className="flex flex-col gap-3 border-b border-border/70 pb-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <GroupBySelect value={groupBy} onChange={setGroupBy} />
            <label className="relative block w-full sm:w-56">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
              <input
                className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-xs outline-none focus:border-primary/60"
                placeholder="搜索 Topic"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
            <ToolbarButton>
              自定义列
              <ChevronDown size={12} />
            </ToolbarButton>
            <ToolbarButton>
              <Download size={13} />
              下载
            </ToolbarButton>
            <Button className="gap-2 rounded-md bg-foreground text-background hover:bg-foreground/90" size="sm" type="button" onClick={() => openDesigner()}>
              编辑提示词
              <ExternalLink size={13} />
            </Button>
          </div>
        </section>

        <PromptAnalysisTable groupBy={groupBy} items={analysisPrompts} onEdit={openDesigner} />
      </div>

      {designerOpen && activePrompt ? (
        <PromptDesignerDrawer
          activeStatus={activeStatus}
          filters={filters}
          items={filteredPrompts}
          prompt={activePrompt}
          search={search}
          onAddPrompt={addPrompt}
          onClose={() => setDesignerOpen(false)}
          onCsvUpload={handleCsvUpload}
          onDeletePrompt={deletePrompt}
          onGenerateClick={() => setGenerateOpen(true)}
          onFiltersChange={setFilters}
          onSearchChange={setSearch}
          onSelect={(prompt) => setActivePromptId(prompt.id)}
          onStatusChange={setActiveStatus}
          onUpdatePrompt={updatePrompt}
        />
      ) : null}

      {generateOpen ? <GeneratePromptModal onClose={() => setGenerateOpen(false)} onGenerate={handleGenerated} /> : null}
    </>
  );
}
