"use client";

import { Calendar, Check, ChevronDown, Download, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { zhCN } from "react-day-picker/locale";
import { Button } from "@/ui";
import {
  brandFilterOptions,
  defaultGlobalFilters,
  modelFilterOptions,
  topicFilterOptions,
} from "@/features/shared/data/filter-options";
import { cn } from "@/lib/utils";
import type { GlobalDateRange, GlobalFilterOption, GlobalFilterState } from "@/types/analytics";

const STUCK_OFFSET = 1;
const MONTH_NAV_START = new Date(2020, 0);
const MONTH_NAV_END = new Date(2030, 11);

type FilterKey = "date" | "brands" | "models" | "topics";

type DatePreset = {
  days: number;
  label: string;
};

const datePresets: DatePreset[] = [
  { days: 2, label: "最近 2 天" },
  { days: 7, label: "最近 7 天" },
  { days: 30, label: "最近 30 天" },
];

type GlobalFiltersProps = {
  className?: string;
  value: GlobalFilterState;
  onChange: (value: GlobalFilterState) => void;
  onExport?: () => void;
};

function getSelectedLabel(options: GlobalFilterOption[], selected: string[], fallback: string) {
  if (selected.length === 0) return fallback;

  const first = options.find((option) => option.value === selected[0])?.label ?? selected[0];
  return selected.length === 1 ? first : `${first} +${selected.length - 1}`;
}

function parseDateValue(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Date(`${value}T00:00:00`);
}

function formatDateValue(date?: Date) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRecentRange(days: number): GlobalDateRange {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (days - 1));

  return {
    endDate: formatDateValue(endDate),
    startDate: formatDateValue(startDate),
  };
}

function isSameDateRange(left: GlobalDateRange, right: GlobalDateRange) {
  return left.startDate === right.startDate && left.endDate === right.endDate;
}

function formatDateLabel(dateRange: GlobalDateRange) {
  if (!dateRange.startDate) {
    return "选择日期";
  }

  if (!dateRange.endDate) {
    return `${dateRange.startDate} 起`;
  }

  return `${dateRange.startDate} 至 ${dateRange.endDate}`;
}

function getCalendarModifiers(dateRange: GlobalDateRange) {
  const from = parseDateValue(dateRange.startDate);
  const to = parseDateValue(dateRange.endDate);

  return {
    range_end: to,
    range_middle: from && to && dateRange.startDate !== dateRange.endDate ? { after: from, before: to } : undefined,
    range_start: from,
    selected: from && !to ? from : undefined,
  };
}

function isDefaultFilters(value: GlobalFilterState) {
  return (
    value.dateRange.startDate === defaultGlobalFilters.dateRange.startDate &&
    value.dateRange.endDate === defaultGlobalFilters.dateRange.endDate &&
    value.brands.length === 0 &&
    value.models.length === 0 &&
    value.topics.length === 0
  );
}

export function GlobalFilters({ className, value, onChange, onExport }: GlobalFiltersProps) {
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [isStuck, setIsStuck] = useState(false);
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

  useEffect(() => {
    function updateStickyState() {
      const top = rootRef.current?.getBoundingClientRect().top ?? 0;
      setIsStuck(top <= STUCK_OFFSET);
    }

    updateStickyState();
    window.addEventListener("scroll", updateStickyState, { passive: true });

    return () => window.removeEventListener("scroll", updateStickyState);
  }, []);

  const selectedCount = value.brands.length + value.models.length + value.topics.length;
  const activeDateLabel = useMemo(() => formatDateLabel(value.dateRange), [value.dateRange]);

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

  function selectDatePreset(days: number) {
    update({ dateRange: getRecentRange(days) });
  }

  function selectDate(date: Date) {
    const nextDate = formatDateValue(date);

    if (!value.dateRange.startDate || value.dateRange.endDate) {
      update({
        dateRange: {
          endDate: "",
          startDate: nextDate,
        },
      });
      return;
    }

    if (nextDate < value.dateRange.startDate) {
      update({
        dateRange: {
          endDate: "",
          startDate: nextDate,
        },
      });
      return;
    }

    update({
      dateRange: {
        endDate: nextDate,
        startDate: value.dateRange.startDate,
      },
    });
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
        "sticky top-0 z-30 flex flex-col gap-3 border border-border/70 bg-card px-4 py-3 shadow-none transition-[border-radius,box-shadow] duration-200 lg:flex-row lg:items-center lg:justify-between",
        isStuck ? "rounded-md shadow-sm" : "rounded-lg",
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
            <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-[min(calc(100vw-2rem),560px)] overflow-hidden rounded-md border border-border/80 bg-popover shadow-xl shadow-slate-950/10">
              <div className="grid grid-cols-[112px_minmax(0,1fr)]">
                <div className="border-r border-border/70 bg-muted/20 py-3">
                  {datePresets.map((preset) => {
                    const range = getRecentRange(preset.days);
                    const active = isSameDateRange(value.dateRange, range);

                    return (
                      <button
                        aria-pressed={active}
                        className={cn(
                          "flex h-9 w-full items-center justify-between px-4 text-left text-xs font-medium transition-colors",
                          active ? "text-foreground" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                        )}
                        key={preset.days}
                        onClick={() => selectDatePreset(preset.days)}
                        type="button"
                      >
                        <span className="truncate">{preset.label}</span>
                        {active ? <Check size={12} /> : null}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-popover p-3">
                  <DayPicker
                    captionLayout="dropdown"
                    className="rdp-range-calendar"
                    defaultMonth={parseDateValue(value.dateRange.endDate || value.dateRange.startDate) ?? new Date()}
                    endMonth={MONTH_NAV_END}
                    fixedWeeks
                    formatters={{
                      formatWeekdayName: (date) => ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()],
                    }}
                    locale={zhCN}
                    modifiers={getCalendarModifiers(value.dateRange)}
                    modifiersClassNames={{
                      range_end: "rdp-range_end",
                      range_middle: "rdp-range_middle",
                      range_start: "rdp-range_start",
                      selected: "rdp-selected",
                    }}
                    navLayout="around"
                    numberOfMonths={1}
                    onDayClick={selectDate}
                    showOutsideDays
                    startMonth={MONTH_NAV_START}
                  />
                  <button
                    className="mt-3 flex h-9 w-full items-center justify-center rounded-md border border-border bg-background text-xs font-semibold text-foreground transition-colors hover:bg-muted/60"
                    onClick={() => update({ dateRange: defaultGlobalFilters.dateRange })}
                    type="button"
                  >
                    重置选择
                  </button>
                </div>
              </div>
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
        {/* <span className="tabular-nums">{selectedCount > 0 ? `已选 ${selectedCount} 项` : "未限定维度"}</span> */}
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
        {onExport ? (
          <Button className="h-8 gap-1.5 rounded-md px-3 text-xs" onClick={onExport} type="button" variant="secondary">
            <Download size={12} />
            导出
          </Button>
        ) : null}
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
