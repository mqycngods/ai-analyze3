"use client";

import React, { useEffect, useState } from "react";
import { Bot, ExternalLink, MessageSquare, Quote, Sparkles, X } from "lucide-react";
import { Card, Tag } from "@/ui";
import { chats, sourceDetails } from "@/features/chats/data/chats.mock";

function ChatDetailModal({
  chat,
  onClose,
}: {
  chat: (typeof chats)[number];
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const mentionCount = (chat.answer.match(/CreativeHit/g) || []).length;

  const levelColor: Record<string, string> = {
    domain: "bg-primary/10 text-primary",
    host: "bg-warning/10 text-warning",
    url: "bg-muted text-muted-foreground",
  };

  return (
    <div
      className="fixed inset-0 z-50 animate-chat-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="对话详情"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <aside
        className="absolute top-0 right-0 h-full w-full max-w-[480px] bg-card border-l border-border shadow-2xl flex flex-col animate-chat-drawer-content"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex justify-between items-start gap-4 px-6 py-5 border-b border-border bg-muted/20">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Bot size={12} />
                {chat.model}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{chat.topic}</span>
            </div>
            <h2 className="text-lg font-semibold leading-snug m-0">{chat.prompt}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex items-center gap-6 px-6 py-3 border-b border-border/60 bg-card">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">排名</span>
            <span className="text-sm font-semibold tabular-nums">#{chat.position}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">情绪</span>
            <span className="text-sm font-semibold text-success tabular-nums">+{chat.sentiment}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">提及次数</span>
            <span className="text-sm font-semibold tabular-nums">{chat.mentions}</span>
          </div>
        </div>

        <section className="px-6 py-5 overflow-y-auto flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} className="text-muted-foreground" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider m-0">回答正文</h3>
            </div>
            <div className="relative p-4 pl-5 bg-muted/20 rounded-xl text-sm leading-7 border border-border/60">
              <Quote size={16} className="absolute top-3 left-2.5 text-muted-foreground/40" />
              {chat.answer.split("CreativeHit").map((part, index, parts) => (
                <React.Fragment key={`${part}-${index}`}>
                  {part}
                  {index < parts.length - 1 ? (
                    <mark className="bg-primary/15 text-primary font-semibold px-1 py-0.5 rounded">CreativeHit</mark>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-muted-foreground" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider m-0">品牌提及</h3>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/20 transition-colors">
              <span className="w-9 h-9 grid place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0">C</span>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium">CreativeHit</span>
                <span className="text-xs text-muted-foreground">正文出现 {mentionCount} 次</span>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold tabular-nums">{chat.mentions}</span>
                <span className="text-[10px] text-muted-foreground">总提及</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink size={14} className="text-muted-foreground" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider m-0">引用来源</h3>
            </div>
            <div className="grid gap-2.5">
              {sourceDetails.map((source) => (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover:border-border hover:bg-muted/20 transition-all cursor-pointer group"
                  key={source.title}
                >
                  <div className="flex-1 min-w-0">
                    <strong className="block text-sm font-medium mb-0.5 truncate">{source.title}</strong>
                    <span className="text-xs text-muted-foreground truncate block">{source.domain}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${levelColor[source.level] ?? "bg-muted text-muted-foreground"}`}>
                    {source.level}
                  </span>
                  <div className="text-right shrink-0">
                    <span className="block text-sm font-semibold tabular-nums">{source.rate}</span>
                    <span className="text-[10px] text-muted-foreground">被引用</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}

export function ChatsPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? chats[selectedIndex] : null;

  return (
    <>
      <Card className="p-0 min-w-0 overflow-hidden">
        <div className="flex justify-between items-start gap-3 p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold mb-1">全部对话</h2>
            <p className="text-xs text-muted-foreground m-0">点击任意一行查看对话详情与引用来源。</p>
          </div>
        </div>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium text-[13px]">
              <tr>
                <th className="px-4 py-3">Prompt</th>
                <th className="px-4 py-3">模型</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">品牌提及</th>
                <th className="px-4 py-3">情绪</th>
                <th className="px-4 py-3">排名</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chats.map((row, index) => (
                <tr
                  key={`${row.model}-${row.prompt}`}
                  onClick={() => setSelectedIndex(index)}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">{row.prompt}</td>
                  <td className="px-4 py-3">{row.model}</td>
                  <td className="px-4 py-3">{row.topic}</td>
                  <td className="px-4 py-3">{row.mentions}</td>
                  <td className="px-4 py-3">
                    <Tag className="bg-green-100 text-green-800">+{row.sentiment}</Tag>
                  </td>
                  <td className="px-4 py-3 font-semibold">#{row.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected ? <ChatDetailModal chat={selected} onClose={() => setSelectedIndex(null)} /> : null}
    </>
  );
}
