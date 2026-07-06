"use client";

import { useRef, useState } from "react";
import { Camera, Check, ChevronDown, Info, Maximize2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/ui";
import { brandProfileSettings } from "@/features/settings/data/settings.mock";
import { cn } from "@/lib/utils";

type PageProps = {
  notify?: (message: string) => void;
};

type Audience = {
  name: string;
  description: string;
  share: number;
  enabled?: boolean;
};

type ProfileState = {
  name: string;
  domain: string;
  description: string;
  industry: string;
  identity: string[];
  products: string[];
  market: {
    scope: string;
    note: string;
  };
  audiences: Audience[];
  avatarText: string;
  avatarColor: string;
  avatarImage: string;
};

const avatarColors = ["#2563EB", "#38BDF8", "#0F766E", "#F97316", "#111827"];

function createInitialProfile(): ProfileState {
  return {
    ...brandProfileSettings,
    audiences: brandProfileSettings.audiences.map((audience) => ({ ...audience, enabled: true })),
    avatarText: "热",
    avatarColor: "#2563EB",
    avatarImage: "",
  };
}

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

function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}

function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[104px] w-full resize-none rounded-xl border border-border bg-background p-4 text-sm leading-6 text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/15",
        className
      )}
      {...props}
    />
  );
}

function RemovablePill({
  label,
  editable,
  onRemove,
}: {
  label: string;
  editable: boolean;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2.5 text-sm font-medium text-foreground/80">
      {label}
      {editable ? (
        <button
          aria-label={`移除${label}`}
          className="-mr-1 grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
          onClick={onRemove}
          type="button"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}

function ProductItem({
  label,
  editable,
  onRemove,
}: {
  label: string;
  editable: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex min-h-[58px] items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm font-medium text-foreground/75">
      <span>{label}</span>
      {editable ? (
        <button
          aria-label={`删除${label}`}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-background hover:text-destructive"
          onClick={onRemove}
          type="button"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function AudienceRow({
  audience,
  editable,
  onToggle,
  onShareChange,
}: {
  audience: Audience;
  editable: boolean;
  onToggle: () => void;
  onShareChange: (share: number) => void;
}) {
  return (
    <div className="grid grid-cols-[36px_minmax(0,1fr)_82px] items-center gap-3">
      <button
        aria-label={`${audience.name}${audience.enabled ? "已启用" : "已停用"}`}
        aria-pressed={Boolean(audience.enabled)}
        className={cn(
          "h-5 w-9 rounded-full p-0.5 transition",
          audience.enabled ? "bg-blue-600" : "bg-muted-foreground/25",
          editable ? "cursor-pointer" : "cursor-default"
        )}
        disabled={!editable}
        onClick={onToggle}
        type="button"
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            audience.enabled ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{audience.name}</div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{audience.description}</p>
      </div>
      {editable ? (
        <TextInput
          aria-label={`${audience.name}占比`}
          className="h-9 rounded-lg px-2 text-center tabular-nums"
          max={100}
          min={0}
          onChange={(event) => onShareChange(Number(event.target.value))}
          type="number"
          value={audience.share}
        />
      ) : (
        <div className="rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm font-semibold text-foreground/80">
          {audience.share}%
        </div>
      )}
    </div>
  );
}

function MarketMap({ note }: { note: string }) {
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
        <Check className="h-4 w-4 text-blue-600" aria-hidden="true" />
        {note}
      </div>
    </div>
  );
}

function compactList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

export function SettingsPage({ notify }: PageProps) {
  const [profile, setProfile] = useState<ProfileState>(() => createInitialProfile());
  const [draft, setDraft] = useState<ProfileState>(() => createInitialProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [identityInput, setIdentityInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProfile = isEditing ? draft : profile;
  const audienceTotal = draft.audiences.reduce((total, audience) => total + audience.share, 0);
  const canSave =
    draft.name.trim().length > 0 &&
    draft.domain.trim().length > 0 &&
    audienceTotal === 100;

  function beginEditing() {
    setDraft(profile);
    setIdentityInput("");
    setProductInput("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setIdentityInput("");
    setProductInput("");
    setIsEditing(false);
  }

  function saveChanges() {
    if (!canSave) {
      notify?.("请填写公司名称、域名，并确保受众占比合计为 100%。");
      return;
    }

    setProfile({
      ...draft,
      name: draft.name.trim(),
      domain: draft.domain.trim(),
      description: draft.description.trim(),
      industry: draft.industry.trim(),
      identity: compactList(draft.identity),
      products: compactList(draft.products),
      avatarText: draft.avatarText.trim().slice(0, 2) || "企",
      market: {
        scope: draft.market.scope.trim() || "全球",
        note: draft.market.note.trim() || "包含所有区域",
      },
    });
    setIsEditing(false);
    notify?.("已保存公司信息。");
  }

  function updateDraft(partial: Partial<ProfileState>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function addIdentity() {
    const nextItem = identityInput.trim();

    if (!nextItem) {
      return;
    }

    setDraft((current) => ({ ...current, identity: [...current.identity, nextItem] }));
    setIdentityInput("");
  }

  function addProduct() {
    const nextItem = productInput.trim();

    if (!nextItem) {
      return;
    }

    setDraft((current) => ({ ...current, products: [...current.products, nextItem] }));
    setProductInput("");
  }

  function handleAvatarFile(file?: File) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({ ...current, avatarImage: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-[760px] pb-24">
      <section className="border-b border-border pb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">公司信息</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              定义公司与品牌的身份、受众和定位，更改将用于生成提示建议。
            </p>
          </div>
          {!isEditing ? (
            <Button className="w-fit gap-2" onClick={beginEditing} size="sm" type="button">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              编辑信息
            </Button>
          ) : null}
        </div>

        <div className="mt-12">
          <div
            className="h-36 rounded-2xl border border-border/50"
            style={{
              background: `linear-gradient(135deg, ${activeProfile.avatarColor}33, #dbeafe 44%, ${activeProfile.avatarColor}66)`,
            }}
          />
          <div className="-mt-8 flex items-end gap-4 px-1">
            <div
              className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-background shadow-sm"
              style={{ background: activeProfile.avatarColor }}
            >
              {activeProfile.avatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={`${activeProfile.name}头像`} className="h-full w-full object-cover" src={activeProfile.avatarImage} />
              ) : (
                <span className="text-3xl font-black text-white">{activeProfile.avatarText}</span>
              )}
              {isEditing ? (
                <button
                  aria-label="上传头像"
                  className="absolute inset-0 grid place-items-center bg-black/35 text-white opacity-0 transition hover:opacity-100"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              {isEditing ? (
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px]">
                  <TextInput
                    aria-label="公司名称"
                    onChange={(event) => updateDraft({ name: event.target.value })}
                    placeholder="公司名称"
                    value={draft.name}
                  />
                  <TextInput
                    aria-label="头像文字"
                    maxLength={2}
                    onChange={(event) => updateDraft({ avatarText: event.target.value })}
                    placeholder="头像文字"
                    value={draft.avatarText}
                  />
                  <TextInput
                    aria-label="公司域名"
                    className="sm:col-span-2"
                    onChange={(event) => updateDraft({ domain: event.target.value })}
                    placeholder="company.com"
                    value={draft.domain}
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-foreground">{profile.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{profile.domain}</p>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
              <input
                ref={fileInputRef}
                accept="image/*"
                className="sr-only"
                onChange={(event) => handleAvatarFile(event.target.files?.[0])}
                type="file"
              />
              {avatarColors.map((color) => (
                <button
                  aria-label={`选择头像颜色${color}`}
                  aria-pressed={draft.avatarColor === color}
                  className={cn(
                    "h-7 w-7 rounded-md border transition",
                    draft.avatarColor === color ? "border-foreground ring-2 ring-foreground/15" : "border-border"
                  )}
                  key={color}
                  onClick={() => updateDraft({ avatarColor: color })}
                  style={{ background: color }}
                  type="button"
                />
              ))}
              <Button className="gap-2" onClick={() => fileInputRef.current?.click()} size="sm" type="button" variant="secondary">
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                更换头像
              </Button>
              {draft.avatarImage ? (
                <Button className="gap-2" onClick={() => updateDraft({ avatarImage: "" })} size="sm" type="button" variant="ghost">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  移除图片
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-10 grid gap-8">
          <div>
            <FieldHeader title="描述" description="品牌背景。" />
            {isEditing ? (
              <TextArea
                onChange={(event) => updateDraft({ description: event.target.value })}
                value={draft.description}
              />
            ) : (
              <div className="min-h-[86px] rounded-xl border border-border bg-background p-4 text-sm leading-6 text-foreground/75">
                {profile.description}
              </div>
            )}
          </div>

          <div>
            <FieldHeader title="行业" description="品牌所属行业。" />
            {isEditing ? (
              <TextInput
                onChange={(event) => updateDraft({ industry: event.target.value })}
                value={draft.industry}
              />
            ) : (
              <div className="h-11 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground/80">
                {profile.industry}
              </div>
            )}
          </div>

          <div>
            <FieldHeader title="品牌标识" description="定义品牌的形容词。" />
            <div className="flex flex-wrap gap-2">
              {activeProfile.identity.map((item, index) => (
                <RemovablePill
                  editable={isEditing}
                  key={`${item}-${index}`}
                  label={item}
                  onRemove={() =>
                    setDraft((current) => ({
                      ...current,
                      identity: current.identity.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                />
              ))}
            </div>
            {isEditing ? (
              <div className="mt-3 flex gap-2">
                <TextInput
                  className="h-9"
                  onChange={(event) => setIdentityInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addIdentity();
                    }
                  }}
                  placeholder="添加品牌形容词"
                  value={identityInput}
                />
                <Button className="h-9 shrink-0 gap-1.5" onClick={addIdentity} type="button">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  添加
                </Button>
              </div>
            ) : null}
          </div>

          <div>
            <FieldHeader title="产品与服务" description="品牌所提供的服务与产品。" />
            <div className="grid gap-2 sm:grid-cols-2">
              {activeProfile.products.map((item, index) => (
                <ProductItem
                  editable={isEditing}
                  key={`${item}-${index}`}
                  label={item}
                  onRemove={() =>
                    setDraft((current) => ({
                      ...current,
                      products: current.products.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                />
              ))}
            </div>
            {isEditing ? (
              <div className="mt-3 flex gap-2">
                <TextInput
                  className="h-9"
                  onChange={(event) => setProductInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addProduct();
                    }
                  }}
                  placeholder="添加产品或服务"
                  value={productInput}
                />
                <Button className="h-9 shrink-0 gap-1.5" onClick={addProduct} type="button">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  添加
                </Button>
              </div>
            ) : null}
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
            {isEditing ? (
              <TextInput
                aria-label="目标市场范围"
                className="h-9 w-28 rounded-lg"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    market: { ...current.market, scope: event.target.value },
                  }))
                }
                value={draft.market.scope}
              />
            ) : (
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground"
                type="button"
              >
                {profile.market.scope}
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </button>
            )}
            <button
              aria-label="展开目标市场"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground"
              type="button"
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        {isEditing ? (
          <TextInput
            aria-label="目标市场说明"
            className="mb-4"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                market: { ...current.market, note: event.target.value },
              }))
            }
            value={draft.market.note}
          />
        ) : null}
        <MarketMap note={activeProfile.market.note} />
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
          {isEditing ? (
            <p className={cn("mt-3 text-xs font-semibold", audienceTotal === 100 ? "text-blue-600" : "text-destructive")}>
              当前合计：{audienceTotal}%
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-7">
          {activeProfile.audiences.map((audience, index) => (
            <AudienceRow
              audience={audience}
              editable={isEditing}
              key={audience.name}
              onShareChange={(share) =>
                setDraft((current) => ({
                  ...current,
                  audiences: current.audiences.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, share } : item
                  ),
                }))
              }
              onToggle={() =>
                setDraft((current) => ({
                  ...current,
                  audiences: current.audiences.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, enabled: !item.enabled } : item
                  ),
                }))
              }
            />
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            {isEditing ? "保存后将应用到当前页面预览。" : "公司信息用于生成提示建议与品牌语境。"}
          </p>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={cancelEditing} type="button" variant="secondary">
                  取消
                </Button>
                <Button
                  className="gap-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!canSave}
                  onClick={saveChanges}
                  type="button"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  保存
                </Button>
              </>
            ) : (
              <Button className="gap-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-700" onClick={beginEditing} type="button">
                <Pencil className="h-4 w-4" aria-hidden="true" />
                编辑
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
