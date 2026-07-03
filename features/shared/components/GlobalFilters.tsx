"use client";

import { Calendar, Check, ChevronDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/ui";
import {
  brandFilterOptions,
  dateRangeOptions,
  defaultGlobalFilters,
  modelFilterOptions,
  topicFilterOptions,
} from "@/features/shared/data/filter-options";
import { cn } from "@/lib/utils";
import type { GlobalDateRange, GlobalFilterOption, GlobalFilterState } from "@/types/analytics";

type FilterKey = "date" | "brands" | "models" | "topics";

type GlobalFiltersProps = {
  className?: string;
  value: GlobalFilterState;
  onChange: (value: GlobalFilterState) => void;
};

function getSelectedLabel(options: GlobalFilterOption[], selected: string[], fallback: string) {
  if (selected.length === 0) return fallback;

  const first = options.find((option) => option.value === selected[0])?.label ?? selected[0];
  return selected.length === 1 ? first : `${first} +${selected.length - 1}`;
}

function isDefaultFilters(value: GlobalFilterState) {
  return (
    value.dateRange === defaultGlobalFilters.dateRange &&
    value.brands.length === 0 &&
    value.models.length === 0 &&
    value.topics.length === 0
  );
}

export function GlobalFilters({ className, value, onChange }: GlobalFiltersProps) {
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenKey(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const selectedCount = value.brands.length + value.models.length + value.topics.length;
  const activeDateLabel = useMemo(
    () => dateRangeOptions.find((option) => option.value === value.dateRange)?.label ?? "最近 7 天",
    [value.dateRange]
  );

  function update(next: Partial<GlobalFilterState>) {
    onChange({ ...value, ...next });
  }

  function toggleMulti(key: "brands" | "models" | "topics", optionValue: string) {
    const current = value[key];
    const next = current.includes(optionValue)
      ? current.filter((item) => item !== optionValue)
      : [...current, optionValue];
    update({ [key]: next });
  }

  function clearMulti(key: "brands" | "models" | "topics") {
    update({ [key]: [] });
  }

  function renderMultiDropdown(key: "brands" | "models" | "topics", options: GlobalFilterOption[]) {
    return (
      <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-60 rounded-lg border border-border bg-popover p-1.5 shadow-lg">
        <div className="max-h-72 overflow-y-auto">
          {options.map((option) => {
            const checked = value[key].includes(option.value);
            return (
              <button
                aria-checked={checked}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted/60"
                key={option.value}
                onClick={() => toggleMulti(key, option.value)}
                role="menuitemcheckbox"
                type="button"
              >
                <span
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded border",
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-transparent"
                  )}
                >
                  <Check size={11} />
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
        {value[key].length > 0 ? (
          <div className="mt-1 border-t border-border/70 pt-1">
            <button
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              onClick={() => clearMulti(key)}
              type="button"
            >
              <X size={12} />
              清空
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 shadow-none lg:flex-row lg:items-center lg:justify-between",
        className
      )}
      ref={rootRef}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-muted px-2.5 text-xs font-semibold text-foreground">
          <SlidersHorizontal size={13} />
          全局筛选
        </span>

        <div className="relative">
          <Button
            aria-expanded={openKey === "date"}
            className="h-8 gap-1.5 rounded-md px-3 text-xs"
            onClick={() => setOpenKey(openKey === "date" ? null : "date")}
            type="button"
            variant="secondary"
          >
            <Calendar size={13} />
            {activeDateLabel}
            <ChevronDown size={12} />
          </Button>
          {openKey === "date" ? (
            <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-44 rounded-lg border border-border bg-popover p-1.5 shadow-lg">
              {dateRangeOptions.map((option) => {
                const active = option.value === value.dateRange;
                return (
                  <button
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted/60",
                      active ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}
                    key={option.value}
                    onClick={() => {
                      update({ dateRange: option.value as GlobalDateRange });
                      setOpenKey(null);
                    }}
                    type="button"
                  >
                    <Check className={active ? "text-primary" : "text-transparent"} size={12} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <FilterButton
          active={openKey === "brands"}
          count={value.brands.length}
          label={getSelectedLabel(brandFilterOptions, value.brands, "全部品牌")}
          onClick={() => setOpenKey(openKey === "brands" ? null : "brands")}
        >
          {openKey === "brands" ? renderMultiDropdown("brands", brandFilterOptions) : null}
        </FilterButton>

        <FilterButton
          active={openKey === "models"}
          count={value.models.length}
          label={getSelectedLabel(modelFilterOptions, value.models, "全部模型")}
          onClick={() => setOpenKey(openKey === "models" ? null : "models")}
        >
          {openKey === "models" ? renderMultiDropdown("models", modelFilterOptions) : null}
        </FilterButton>

        <FilterButton
          active={openKey === "topics"}
          count={value.topics.length}
          label={getSelectedLabel(topicFilterOptions, value.topics, "全部主题")}
          onClick={() => setOpenKey(openKey === "topics" ? null : "topics")}
        >
          {openKey === "topics" ? renderMultiDropdown("topics", topicFilterOptions) : null}
        </FilterButton>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{selectedCount > 0 ? `已选 ${selectedCount} 项` : "未限定维度"}</span>
        <Button
          className="h-8 gap-1.5 rounded-md px-3 text-xs"
          disabled={isDefaultFilters(value)}
          onClick={() => onChange(defaultGlobalFilters)}
          type="button"
          variant="ghost"
        >
          <RotateCcw size={12} />
          重置
        </Button>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  children,
  count,
  label,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="relative">
      <Button
        aria-expanded={active}
        className={cn("h-8 gap-1.5 rounded-md px-3 text-xs", count > 0 ? "border-primary/30 text-foreground" : "")}
        onClick={onClick}
        type="button"
        variant="secondary"
      >
        <span className="max-w-36 truncate">{label}</span>
        {count > 0 ? (
          <span className="grid h-4 min-w-4 place-items-center rounded bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
            {count}
          </span>
        ) : null}
        <ChevronDown size={12} />
      </Button>
      {children}
    </div>
  );
}
