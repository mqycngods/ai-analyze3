"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react";
import { Button, Card } from "@/ui";
import { brandRows, type BrandRow } from "@/features/brands/data/brands.mock";
import { cn } from "@/lib/utils";

type PageProps = {
  notify?: (message: string) => void;
};

function BrandMark({ brand }: { brand: BrandRow }) {
  const initial = brand.name.replace(/\s+/g, "").slice(0, 1);

  return (
    <span
      aria-hidden="true"
      className="grid h-4 w-4 shrink-0 place-items-center rounded-[4px] text-[9px] font-semibold text-white"
      style={{ background: brand.color }}
    >
      {initial}
    </span>
  );
}

function HeaderCell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] font-medium leading-none text-muted-foreground", className)}>
      {children}
    </span>
  );
}

function BrandTable({
  rows,
  onOpenAddBrand,
  onDeleteBrand,
}: {
  rows: BrandRow[];
  onOpenAddBrand: () => void;
  onDeleteBrand: (brand: BrandRow) => void;
}) {
  return (
    <Card className="overflow-hidden rounded-lg border border-border/70 bg-card p-0 shadow-none">
      <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
          <input
            className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
            placeholder="搜索品牌"
            type="search"
          />
        </label>
        <Button
          className="h-8 gap-1.5 rounded-md bg-foreground px-3 text-xs text-background hover:bg-foreground/90"
          onClick={onOpenAddBrand}
          size="sm"
          type="button"
        >
          <Plus size={13} />
          添加品牌
        </Button>
      </div>

      <div className="scrollbar-none overflow-x-auto">
        <div className="min-w-[1120px]">
          <div className="grid grid-cols-[110px_minmax(220px,1.1fr)_minmax(220px,1.1fr)_minmax(260px,1.4fr)_110px_52px] items-center border-b border-border/60 bg-muted/20 px-4 py-3">
            <HeaderCell>品牌颜色</HeaderCell>
            <HeaderCell>显示名称</HeaderCell>
            <HeaderCell>记录名称</HeaderCell>
            <HeaderCell>领域 / 范围</HeaderCell>
            <HeaderCell className="text-right">提及</HeaderCell>
            <HeaderCell />
          </div>

          {rows.map((brand) => (
            <div
              className="grid grid-cols-[110px_minmax(220px,1.1fr)_minmax(220px,1.1fr)_minmax(260px,1.4fr)_110px_52px] items-center border-b border-border/50 px-4 py-3 text-xs last:border-b-0 hover:bg-muted/20"
              key={brand.id}
            >
              <span className="h-3 w-3 rounded-[3px]" style={{ background: brand.color }} />
              <div className="flex min-w-0 items-center gap-2">
                <BrandMark brand={brand} />
                <span className="truncate font-semibold text-foreground">{brand.name}</span>
                {brand.isCurrent ? (
                  <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    你
                  </span>
                ) : null}
              </div>
              <span className="truncate font-medium text-foreground">{brand.trackedName}</span>
              <span className="truncate text-foreground">{brand.domains.join(", ")}</span>
              <span className="text-right font-semibold tabular-nums text-foreground">{brand.mentions}</span>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    aria-label={`打开${brand.name}更多操作`}
                    className="ml-auto grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
                    type="button"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    className="z-50 w-64 rounded-lg border border-border bg-popover p-2 text-xs text-popover-foreground shadow-lg"
                    sideOffset={6}
                  >
                    <p className="m-0 px-2 pb-2 pt-1 leading-5 text-muted-foreground">
                      永久删除该品牌及其关联数据。
                    </p>
                    <DropdownMenu.Item
                      className="flex h-8 cursor-pointer items-center gap-2 rounded-md bg-destructive px-2.5 font-medium text-destructive-foreground outline-none transition-colors hover:bg-destructive/90 focus:bg-destructive/90"
                      onSelect={() => onDeleteBrand(brand)}
                    >
                      <Trash2 size={13} />
                      删除品牌
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
        共 {rows.length} 个品牌
      </div>
    </Card>
  );
}

function AddBrandDrawer({
  onClose,
  onCreateBrand,
}: {
  onClose: () => void;
  onCreateBrand: (brand: BrandRow) => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [trackedNames, setTrackedNames] = useState([""]);
  const [domains, setDomains] = useState([""]);
  const [useRegex, setUseRegex] = useState(false);

  const canCreate = displayName.trim().length > 0;

  function updateTrackedName(index: number, value: string) {
    setTrackedNames((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function updateDomain(index: number, value: string) {
    setDomains((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function createBrand() {
    if (!canCreate) {
      return;
    }

    const cleanTrackedNames = trackedNames.map((item) => item.trim()).filter(Boolean);
    const cleanDomains = domains.map((item) => item.trim()).filter(Boolean);
    const colors = ["#EC4899", "#2F5DB8", "#7A7D82", "#1D4DFF", "#80848B", "#64748B"];

    onCreateBrand({
      id: `brand-${Date.now()}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      name: displayName.trim(),
      trackedName: cleanTrackedNames.length > 0 ? cleanTrackedNames.join(", ") : displayName.trim(),
      domains: cleanDomains,
      mentions: 0,
    });
  }

  return (
    <div aria-label="添加品牌" aria-modal="true" className="fixed inset-0 z-50 animate-chat-drawer-overlay" role="dialog">
      <button className="absolute inset-0 cursor-default bg-black/35" onClick={onClose} type="button" aria-label="关闭添加品牌背景" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] animate-chat-drawer-content flex-col border-l border-border bg-card shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
          <div>
            <h2 className="m-0 text-lg font-semibold tracking-tight text-foreground">添加品牌</h2>
            <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">新增需要追踪的品牌名称、识别名称和域名范围。</p>
          </div>
          <button
            aria-label="关闭"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-6">
          <div className="h-28 rounded-t-lg bg-muted/45" />
          <div className="-mt-7 ml-1 h-12 w-12 rounded-lg border border-border bg-card shadow-sm" />

          <div className="mt-8 grid gap-6">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-muted-foreground">Display Name 显示名称</span>
              <input
                autoFocus
                className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>

            <section className="border-t border-border/70 pt-6">
              <h3 className="m-0 text-sm font-semibold text-foreground">Tracked Name 已记录的名称</h3>
              <p className="m-0 mt-2 text-xs leading-5 text-muted-foreground">
                Only the tracked name and its aliases are matched in AI answers to identify the brand.
              </p>
              <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
                在人工智能生成的回答中，只有被记录下来的名称及其别名会被用于识别品牌。
              </p>
              <div className="mt-4 grid gap-2">
                {trackedNames.map((trackedName, index) => (
                  <div className="flex items-center gap-2" key={`tracked-${index}`}>
                    <input
                      className="h-8 min-w-0 flex-1 rounded-md border border-border bg-card px-3 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                      placeholder="Tracked Name"
                      value={trackedName}
                      onChange={(event) => updateTrackedName(index, event.target.value)}
                    />
                    <button
                      aria-label="移除记录名称"
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setTrackedNames((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      type="button"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                <button
                  className="inline-flex w-fit items-center gap-1.5 rounded-md px-1 py-1 text-xs font-medium text-foreground hover:bg-muted"
                  onClick={() => setTrackedNames((current) => [...current, ""])}
                  type="button"
                >
                  <Plus size={12} />
                  Add Alias 添加别名
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <h4 className="m-0 text-xs font-semibold text-foreground">Advanced: Regular Expression</h4>
                  <p className="m-0 mt-2 text-xs leading-5 text-muted-foreground">Apply a regex to the company name for matching or transformation.</p>
                  <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">将正则表达式应用于公司名称，以实现匹配或转换操作。</p>
                </div>
                <button
                  aria-pressed={useRegex}
                  className={cn(
                    "relative h-5 w-9 shrink-0 rounded-full border transition-colors",
                    useRegex ? "border-primary bg-primary" : "border-border bg-muted"
                  )}
                  onClick={() => setUseRegex((current) => !current)}
                  type="button"
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-card shadow-sm transition-transform",
                      useRegex ? "translate-x-[17px]" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            </section>

            <section className="border-t border-border/70 pt-6">
              <h3 className="m-0 text-sm font-semibold text-foreground">Domains 领域/范围</h3>
              <div className="mt-3 grid gap-2">
                {domains.map((domain, index) => (
                  <div className="flex items-center gap-2" key={`domain-${index}`}>
                    <input
                      className="h-8 min-w-0 flex-1 rounded-md border border-border bg-card px-3 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                      placeholder="Domain"
                      value={domain}
                      onChange={(event) => updateDomain(index, event.target.value)}
                    />
                    <button
                      aria-label="移除域名"
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setDomains((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      type="button"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                <button
                  className="inline-flex w-fit items-center gap-1.5 rounded-md px-1 py-1 text-xs font-medium text-foreground hover:bg-muted"
                  onClick={() => setDomains((current) => [...current, ""])}
                  type="button"
                >
                  <Plus size={12} />
                  Add alternative domain 添加备用域名
                </button>
              </div>
            </section>
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t border-border/70 px-6 py-3">
          <Button className="h-8 rounded-md px-3 text-xs" onClick={onClose} size="sm" type="button" variant="secondary">
            Cancel 取消
          </Button>
          <Button
            className="h-8 rounded-md bg-foreground px-3 text-xs text-background hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground"
            disabled={!canCreate}
            onClick={createBrand}
            size="sm"
            type="button"
          >
            Create 创建
          </Button>
        </footer>
      </aside>
    </div>
  );
}

export function BrandsPage({ notify }: PageProps) {
  const [rows, setRows] = useState(brandRows);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  function deleteBrand(brand: BrandRow) {
    setRows((currentRows) => currentRows.filter((row) => row.id !== brand.id));
    notify?.(`已删除 ${brand.name}。`);
  }

  function createBrand(brand: BrandRow) {
    setRows((currentRows) => [brand, ...currentRows]);
    setIsAddDrawerOpen(false);
    notify?.(`已创建 ${brand.name}。`);
  }

  return (
    <>
      <div className="grid gap-4">
        <section className="flex flex-col gap-3 border-b border-border/70 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="m-0 text-xl font-semibold tracking-tight">品牌</h1>
            <p className="m-0 mt-2 text-sm text-muted-foreground">管理用于 AI 可见性追踪的品牌、监控名称和域名范围。</p>
          </div>
          <span className="text-xs text-muted-foreground">{rows.length} 个品牌正在追踪</span>
        </section>

        <BrandTable
          onDeleteBrand={deleteBrand}
          onOpenAddBrand={() => setIsAddDrawerOpen(true)}
          rows={rows}
        />
      </div>

      {isAddDrawerOpen ? (
        <AddBrandDrawer onClose={() => setIsAddDrawerOpen(false)} onCreateBrand={createBrand} />
      ) : null}
    </>
  );
}
