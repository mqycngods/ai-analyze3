"use client";

import { Check, ChevronDown, Info, Maximize2, Plus, X } from "lucide-react";
import { Button } from "@/ui";
import { brandProfileSettings } from "@/features/settings/data/settings.mock";

type PageProps = {
  notify?: (message: string) => void;
};

function FieldHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <span>{title}</span>
        <Info className="h-3.5 w-3.5 text-muted-foreground/70" aria-hidden="true" />
      </div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function RemovablePill({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2.5 text-sm font-medium text-foreground/80">
      {label}
      <X className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
    </span>
  );
}

function ProductItem({ label }: { label: string }) {
  return (
    <div className="flex min-h-[58px] items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm font-medium text-foreground/75">
      <span>{label}</span>
      <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

function AudienceRow({
  name,
  description,
  share,
}: {
  name: string;
  description: string;
  share: number;
}) {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)_64px] items-center gap-3">
      <button
        aria-label={`${name} 已启用`}
        className="h-4 w-8 rounded-full bg-emerald-500 p-0.5 transition"
        type="button"
      >
        <span className="block h-3 w-3 rounded-full bg-white shadow-sm" />
      </button>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{name}</div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm font-semibold text-foreground/80">
        {share}%
      </div>
    </div>
  );
}

function MarketMap() {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border bg-[#f1f2f2]">
      <div className="absolute inset-0 opacity-75">
        <div className="absolute left-[-8%] top-[8%] h-44 w-64 rounded-[45%] bg-white/95" />
        <div className="absolute left-[18%] top-[17%] h-28 w-40 rounded-[48%] bg-white/90" />
        <div className="absolute left-[28%] top-[45%] h-36 w-28 rounded-[50%] bg-white/85" />
        <div className="absolute left-[42%] top-[15%] h-28 w-40 rounded-[45%] bg-white/90" />
        <div className="absolute left-[52%] top-[34%] h-40 w-48 rounded-[48%] bg-white/90" />
        <div className="absolute right-[-5%] top-[22%] h-40 w-72 rounded-[45%] bg-white/90" />
        <div className="absolute right-[18%] bottom-[18%] h-20 w-28 rounded-[46%] bg-white/80" />
      </div>
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/90" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground shadow-sm">
        <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        {brandProfileSettings.market.note}
      </div>
    </div>
  );
}

export function SettingsPage({ notify }: PageProps) {
  return (
    <div className="mx-auto max-w-[760px] pb-24">
      <section className="border-b border-border pb-10">
        <h1 className="text-xl font-bold tracking-tight text-foreground">公司信息</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          定义公司与品牌的身份、受众和定位，更改将用于生成提示建议。
        </p>

        <div className="mt-12">
          <div className="h-36 rounded-2xl bg-neutral-300" />
          <div className="-mt-8 flex items-end gap-4 px-1">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-background bg-lime-400 shadow-sm">
              <span className="text-3xl font-black text-emerald-950">热</span>
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-foreground">{brandProfileSettings.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{brandProfileSettings.domain}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8">
          <div>
            <FieldHeader title="描述" description="品牌背景。" />
            <div className="min-h-[86px] rounded-xl border border-border bg-background p-4 text-sm leading-6 text-foreground/75">
              {brandProfileSettings.description}
            </div>
          </div>

          <div>
            <FieldHeader title="行业" description="品牌所属行业。" />
            <div className="h-11 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground/80">
              {brandProfileSettings.industry}
            </div>
          </div>

          <div>
            <FieldHeader title="品牌标识" description="定义品牌的形容词。" />
            <div className="flex flex-wrap gap-2">
              {brandProfileSettings.identity.map((item) => (
                <RemovablePill key={item} label={item} />
              ))}
              <button
                className="inline-flex h-8 items-center gap-1 rounded-md border border-dashed border-border bg-background px-3 text-sm font-medium text-muted-foreground"
                type="button"
              >
                添加
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div>
            <FieldHeader title="产品与服务" description="品牌所提供的服务与产品。" />
            <div className="grid gap-2 sm:grid-cols-2">
              {brandProfileSettings.products.map((item) => (
                <ProductItem key={item} label={item} />
              ))}
              <button
                className="flex min-h-[58px] items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-background text-sm font-medium text-muted-foreground"
                type="button"
              >
                添加
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">目标市场</h2>
            <p className="mt-1 text-sm text-muted-foreground">您的品牌运营所在之处。</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground"
              type="button"
            >
              {brandProfileSettings.market.scope}
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </button>
            <button
              aria-label="展开目标市场"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground"
              type="button"
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <MarketMap />
      </section>

      <section className="py-8">
        <h2 className="text-lg font-bold text-foreground">受众分布</h2>
        <p className="mt-1 text-sm text-muted-foreground">按用户类型定义您的受众。</p>

        <div className="mt-6 rounded-2xl bg-secondary/80 p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            此项目面向哪些人群？
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            选择您的目标受众以获得更相关的提示建议。百分比总和必须为 100%。
          </p>
        </div>

        <div className="mt-5 grid gap-7">
          {brandProfileSettings.audiences.map((audience) => (
            <AudienceRow key={audience.name} {...audience} />
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-4 py-4">
          <p className="text-sm text-muted-foreground">保存更改将刷新您的提示建议。</p>
          <Button
            className="bg-neutral-500 text-white hover:bg-neutral-600"
            onClick={() => notify?.("已保存品牌简介配置。")}
            type="button"
          >
            保存更改
          </Button>
        </div>
      </div>
    </div>
  );
}
