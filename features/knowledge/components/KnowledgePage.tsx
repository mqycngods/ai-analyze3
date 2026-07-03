"use client";

import { useState } from "react";
import {
  ChevronDown,
  Database,
  FileText,
  Folder,
  Grid2X2,
  Link,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { Button, Card } from "@/ui";
import { cn } from "@/lib/utils";

type PageProps = {
  notify?: (message: string) => void;
};

type KnowledgeBase = {
  id: string;
  name: string;
  folders: number;
  files: number;
  updatedAt: string;
};

type ModalType =
  | "createKnowledge"
  | "renameKnowledge"
  | "sourcePicker"
  | "url"
  | "upload"
  | "website"
  | "text"
  | "notion"
  | "drive"
  | null;

const initialKnowledgeBases: KnowledgeBase[] = [
  { id: "kb-1", name: "助咖啦", folders: 0, files: 0, updatedAt: "Jul 3, 2026" },
  { id: "kb-2", name: "123", folders: 0, files: 1, updatedAt: "Jul 2, 2026" },
];

const sourceOptions = [
  {
    id: "url" as const,
    title: "抓取页面",
    description: "添加一个或多个 URL，以提取结构化内容",
    icon: "browser",
  },
  {
    id: "upload" as const,
    title: "上传文件",
    description: "提取并分析文件内容",
    icon: "pdf",
  },
  {
    id: "website" as const,
    title: "抓取网站",
    description: "添加整个网站（包含多个页面）",
    icon: "site",
  },
  {
    id: "text" as const,
    title: "粘贴文本",
    description: "直接输入或粘贴文本内容",
    icon: "text",
  },
  {
    id: "notion" as const,
    title: "从 Notion 导入",
    description: "同步已连接的 Notion 工作区中的页面",
    icon: "notion",
  },
  {
    id: "drive" as const,
    title: "从 Google Drive 导入",
    description: "从已连接的 Google Drive 帐户导入文件",
    icon: "drive",
  },
];

function ModalFrame({
  children,
  onClose,
  width = "max-w-[620px]",
}: {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/25 px-4" role="dialog" aria-modal="true">
      <button aria-label="关闭弹窗背景" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <div className={cn("relative w-full rounded-lg border border-border bg-card shadow-2xl", width)}>{children}</div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
      <h2 className="m-0 text-sm font-semibold">{title}</h2>
      <button
        aria-label="关闭"
        className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onClose}
        type="button"
      >
        <X size={14} />
      </button>
    </header>
  );
}

function SourceIcon({ type }: { type: string }) {
  if (type === "pdf") {
    return (
      <div className="grid h-16 w-16 place-items-center rounded-md border border-border bg-card text-xs font-bold text-destructive">
        PDF
      </div>
    );
  }

  if (type === "notion") {
    return <div className="grid h-16 w-16 place-items-center text-5xl font-black">N</div>;
  }

  if (type === "drive") {
    return <div className="grid h-16 w-16 place-items-center text-4xl">△</div>;
  }

  if (type === "text") {
    return (
      <div className="h-16 w-20 rounded-md border border-border bg-muted/30 p-2">
        <div className="mb-2 h-2 w-8 rounded bg-border" />
        <div className="h-2 w-full rounded bg-border/60" />
      </div>
    );
  }

  return (
    <div className="h-16 w-20 rounded-md border border-border bg-card p-2">
      <div className="mb-2 flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
      </div>
      <div className="h-8 rounded bg-muted" />
    </div>
  );
}

function CreateKnowledgeModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <ModalFrame onClose={onClose} width="max-w-[420px]">
      <ModalHeader title="添加知识库" onClose={onClose} />
      <div className="grid gap-4 px-4 py-4">
        <label className="grid gap-2 text-sm font-medium">
          知识库名称
          <input
            className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary/60"
            onChange={(event) => setName(event.target.value)}
            placeholder="例如：品牌工具包"
            value={name}
          />
        </label>
      </div>
      <footer className="flex justify-end gap-2 border-t border-border/70 px-4 py-3">
        <Button size="sm" type="button" variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button size="sm" type="button" onClick={() => onCreate(name || "未命名知识库")}>
          添加知识库
        </Button>
      </footer>
    </ModalFrame>
  );
}

function RenameKnowledgeModal({
  base,
  onClose,
  onRename,
}: {
  base: KnowledgeBase;
  onClose: () => void;
  onRename: (name: string) => void;
}) {
  const [name, setName] = useState(base.name);

  return (
    <ModalFrame onClose={onClose} width="max-w-[420px]">
      <ModalHeader title="重命名知识库" onClose={onClose} />
      <div className="grid gap-4 px-4 py-4">
        <label className="grid gap-2 text-sm font-medium">
          名称
          <input
            className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary/60"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>
      </div>
      <footer className="flex justify-end gap-2 border-t border-border/70 px-4 py-3">
        <Button size="sm" type="button" variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button size="sm" type="button" onClick={() => onRename(name)}>
          保存
        </Button>
      </footer>
    </ModalFrame>
  );
}

function SourcePickerModal({ onClose, onSelect }: { onClose: () => void; onSelect: (type: ModalType) => void }) {
  return (
    <ModalFrame onClose={onClose} width="max-w-[760px]">
      <ModalHeader title="添加到知识库" onClose={onClose} />
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {sourceOptions.map((option) => (
          <button
            className="flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:bg-muted/30"
            key={option.id}
            onClick={() => onSelect(option.id)}
            type="button"
          >
            <SourceIcon type={option.icon} />
            <div>
              <h3 className="m-0 text-sm font-semibold">{option.title}</h3>
              <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="m-0 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
        仅上传您拥有或已获授权使用的内容，未经授权使用第三方内容可能违反我们的服务条款。
      </p>
    </ModalFrame>
  );
}

function UrlModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalFrame onClose={onClose} width="max-w-[820px]">
      <ModalHeader title="从 URL 添加" onClose={onClose} />
      <div className="grid grid-cols-[minmax(0,1fr)_180px_180px] gap-3 px-4 py-4 text-sm">
        <label className="grid gap-2">
          URL
          <input className="h-9 rounded-md border border-border px-3 outline-none focus:border-primary/60" placeholder="https://example.com/article" />
        </label>
        <label className="grid gap-2">
          文档名称（可选）
          <input className="h-9 rounded-md border border-border px-3 outline-none focus:border-primary/60" placeholder="my-document" />
        </label>
        <label className="grid gap-2">
          同步
          <button className="flex h-9 items-center justify-between rounded-md border border-border px-3 text-left text-sm" type="button">
            从不同步
            <ChevronDown size={14} />
          </button>
        </label>
      </div>
      <footer className="flex items-center justify-between border-t border-border/70 px-4 py-3">
        <button className="inline-flex items-center gap-2 text-sm" type="button">
          <Plus size={14} />
          添加另一个 URL
        </button>
        <Button size="sm" type="button" disabled>
          导入 URL
        </Button>
      </footer>
    </ModalFrame>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalFrame onClose={onClose} width="max-w-[490px]">
      <ModalHeader title="上传文件" onClose={onClose} />
      <div className="p-4">
        <div className="grid min-h-[160px] place-items-center rounded-lg border border-dashed border-border bg-card text-center">
          <div>
            <Upload className="mx-auto mb-3" size={28} />
            <p className="m-0 text-sm font-medium">Drop files here to upload</p>
            <p className="m-0 mt-2 text-xs text-muted-foreground">You can upload up to 25 files at once</p>
            <Button className="mt-3" size="sm" type="button" variant="secondary">
              Browse Files
            </Button>
          </div>
        </div>
      </div>
      <footer className="flex justify-end gap-2 border-t border-border/70 px-4 py-3">
        <Button size="sm" type="button" variant="ghost" onClick={onClose}>
          取消
        </Button>
        <Button size="sm" type="button" disabled>
          上传
        </Button>
      </footer>
    </ModalFrame>
  );
}

function WebsiteModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalFrame onClose={onClose} width="max-w-[540px]">
      <ModalHeader title="从网站导入" onClose={onClose} />
      <div className="grid gap-4 px-4 py-4">
        <div className="flex gap-5 border-b border-border/70 text-sm">
          <button className="border-b-2 border-foreground pb-2 font-medium" type="button">站点地图</button>
          <button className="pb-2 text-muted-foreground" type="button">Crawl</button>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          网站地图 URL <span className="text-destructive">*</span>
          <input className="h-9 rounded-md border border-border px-3 outline-none focus:border-primary/60" placeholder="example.com/sitemap.xml" />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-4 w-4 rounded-full border border-border" />
          包含/排除路径
        </label>
      </div>
      <footer className="flex items-center justify-between border-t border-border/70 px-4 py-3">
        <Button size="sm" type="button" variant="secondary">
          从不同步
          <ChevronDown size={13} />
        </Button>
        <Button size="sm" type="button" disabled>
          导入网站地图
        </Button>
      </footer>
    </ModalFrame>
  );
}

function TextModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalFrame onClose={onClose} width="max-w-[640px]">
      <ModalHeader title="上传文本" onClose={onClose} />
      <div className="grid gap-4 px-4 py-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px]">
          <label className="grid gap-2 text-sm font-medium">
            文档名称 <span className="text-destructive">*</span>
            <input className="h-9 rounded-md border border-border px-3 outline-none focus:border-primary/60" placeholder="my-document" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            格式
            <button className="flex h-9 items-center justify-between rounded-md border border-border px-3 text-left text-sm" type="button">
              Text (.txt)
              <ChevronDown size={14} />
            </button>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          内容 <span className="text-destructive">*</span>
          <textarea className="min-h-[260px] rounded-md border border-border px-3 py-2 outline-none focus:border-primary/60" placeholder="在此粘贴或输入内容..." />
        </label>
      </div>
      <footer className="flex justify-end border-t border-border/70 px-4 py-3">
        <Button size="sm" type="button" disabled>
          添加文档
        </Button>
      </footer>
    </ModalFrame>
  );
}

function ConnectAccountModal({ type, onClose }: { type: "Notion" | "Google Drive"; onClose: () => void }) {
  return (
    <ModalFrame onClose={onClose} width={type === "Notion" ? "max-w-[590px]" : "max-w-[490px]"}>
      <ModalHeader title={`从 ${type} 导入`} onClose={onClose} />
      <div className="p-4">
        <div className="grid min-h-[300px] place-items-center rounded-md border border-border bg-card text-center">
          <div>
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-md border border-border text-2xl font-black">
              {type === "Notion" ? "N" : "△"}
            </div>
            <p className="m-0 text-sm text-muted-foreground">尚未连接 {type} 帐户。</p>
            <Button className="mt-4 gap-2" size="sm" type="button" variant="secondary">
              <Plus size={13} />
              连接账户
            </Button>
          </div>
        </div>
      </div>
      {type === "Notion" ? (
        <footer className="flex items-center justify-between border-t border-border/70 px-4 py-3">
          <Button size="sm" type="button" variant="ghost">
            全选
          </Button>
          <div className="flex gap-2">
            <Button size="sm" type="button" variant="secondary" onClick={onClose}>
              取消
            </Button>
            <Button size="sm" type="button" disabled>
              导入
            </Button>
          </div>
        </footer>
      ) : null}
    </ModalFrame>
  );
}

export function KnowledgePage({ notify }: PageProps) {
  const [bases, setBases] = useState(initialKnowledgeBases);
  const [activeBase, setActiveBase] = useState<KnowledgeBase | null>(null);
  const [menuBaseId, setMenuBaseId] = useState<string | null>(null);
  const [editingBase, setEditingBase] = useState<KnowledgeBase | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  function closeModal() {
    setModal(null);
    setEditingBase(null);
  }

  function createKnowledge(name: string) {
    const next = {
      id: `kb-${Date.now()}`,
      name,
      folders: 0,
      files: 0,
      updatedAt: "Jul 3, 2026",
    };
    setBases((current) => [next, ...current]);
    setModal(null);
    notify?.("已添加知识库。");
  }

  function renameKnowledge(name: string) {
    if (!editingBase) return;
    setBases((current) => current.map((base) => (base.id === editingBase.id ? { ...base, name } : base)));
    setActiveBase((current) => (current?.id === editingBase.id ? { ...current, name } : current));
    closeModal();
    notify?.("已重命名知识库。");
  }

  function deleteKnowledge(baseId: string) {
    setBases((current) => current.filter((base) => base.id !== baseId));
    setActiveBase((current) => (current?.id === baseId ? null : current));
    setMenuBaseId(null);
    notify?.("已删除知识库。");
  }

  function renderModal() {
    if (modal === "createKnowledge") {
      return <CreateKnowledgeModal onClose={closeModal} onCreate={createKnowledge} />;
    }
    if (modal === "renameKnowledge" && editingBase) {
      return <RenameKnowledgeModal base={editingBase} onClose={closeModal} onRename={renameKnowledge} />;
    }
    if (modal === "sourcePicker") {
      return <SourcePickerModal onClose={closeModal} onSelect={setModal} />;
    }
    if (modal === "url") return <UrlModal onClose={closeModal} />;
    if (modal === "upload") return <UploadModal onClose={closeModal} />;
    if (modal === "website") return <WebsiteModal onClose={closeModal} />;
    if (modal === "text") return <TextModal onClose={closeModal} />;
    if (modal === "notion") return <ConnectAccountModal type="Notion" onClose={closeModal} />;
    if (modal === "drive") return <ConnectAccountModal type="Google Drive" onClose={closeModal} />;
    return null;
  }

  if (activeBase) {
    return (
      <>
        <div className="grid gap-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-3">
              <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setActiveBase(null)} type="button">
                知识库
              </button>
              <span className="text-muted-foreground">/</span>
              <h1 className="m-0 text-lg font-semibold">{activeBase.name}</h1>
            </div>
            <Button className="gap-2 rounded-md bg-foreground text-background hover:bg-foreground/90" size="sm" onClick={() => setModal("sourcePicker")} type="button">
              <Plus size={14} />
              添加文件
            </Button>
          </div>

          <Card className="rounded-lg border border-border/70 bg-card p-0 shadow-none">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <p className="m-0 text-sm font-medium">文件</p>
              <span className="text-xs text-muted-foreground">{activeBase.files} 个文件</span>
            </div>
            <div className="grid min-h-[320px] place-items-center text-center">
              <div>
                <FileText className="mx-auto mb-3 text-muted-foreground" size={36} />
                <p className="m-0 text-sm font-medium">还没有文件</p>
                <p className="m-0 mt-2 text-xs text-muted-foreground">添加文件、URL、网站或文本后会显示在这里。</p>
                <Button className="mt-4 gap-2" size="sm" type="button" onClick={() => setModal("sourcePicker")}>
                  <Plus size={13} />
                  添加文件
                </Button>
              </div>
            </div>
          </Card>
        </div>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        <div className="flex items-center gap-8 border-b border-border/70">
          <button className="border-b-2 border-foreground pb-3 text-sm font-medium" type="button">知识库</button>
          <button className="pb-3 text-sm text-muted-foreground" type="button">品牌工具包</button>
          <button className="pb-3 text-sm text-muted-foreground" type="button">受众分群</button>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/60" placeholder="搜索" />
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">已使用 0.02 / 100 MB</span>
            <div className="flex rounded-md border border-border bg-card">
              <button className="grid h-8 w-8 place-items-center bg-muted" type="button" aria-label="网格视图">
                <Grid2X2 size={14} />
              </button>
              <button className="grid h-8 w-8 place-items-center text-muted-foreground" type="button" aria-label="列表视图">
                <List size={14} />
              </button>
            </div>
            <Button className="gap-2 rounded-md bg-foreground text-background hover:bg-foreground/90" size="sm" onClick={() => setModal("createKnowledge")} type="button">
              <Plus size={14} />
              添加知识库
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bases.map((base) => (
            <Card
              className="relative cursor-pointer rounded-lg border border-border/70 bg-card p-5 shadow-none transition-colors hover:bg-muted/20"
              key={base.id}
              onClick={() => setActiveBase(base)}
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <Folder size={18} className="text-muted-foreground" />
                <button
                  aria-label="知识库操作"
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuBaseId(menuBaseId === base.id ? null : base.id);
                  }}
                  type="button"
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>
              <h2 className="m-0 text-sm font-semibold">{base.name}</h2>
              <p className="m-0 mt-2 text-xs text-muted-foreground">
                {base.folders} 文件夹 · {base.files} 文件 · {base.updatedAt}
              </p>
              {menuBaseId === base.id ? (
                <div className="absolute right-4 top-12 z-10 w-32 rounded-md border border-border bg-card p-1 shadow-lg">
                  <button
                    className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingBase(base);
                      setModal("renameKnowledge");
                      setMenuBaseId(null);
                    }}
                    type="button"
                  >
                    重命名
                  </button>
                  <button
                    className="w-full rounded px-2 py-1.5 text-left text-xs text-destructive hover:bg-destructive/5"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteKnowledge(base.id);
                    }}
                    type="button"
                  >
                    删除
                  </button>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </div>
      {renderModal()}
    </>
  );
}
