"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowUp, Bot, Clock3, Lightbulb, MessageSquareText, Sparkles, UserRound } from "lucide-react";
import { Button, Card } from "@/ui";
import { cn } from "@/lib/utils";

type AssistantMessage = {
  id: number;
  role: "agent" | "user";
  content: string;
};

const quickPrompts = [
  "帮我生成一份品牌可见性报告",
  "找出最近回答里没有引用我们的来源",
  "对比 CreativeHit 和主要竞品的 AI 推荐理由",
  "总结负面情绪驱动因素并给出行动建议",
];

const agentCapabilities = [
  {
    icon: Lightbulb,
    title: "诊断机会",
    description: "从提示词、引用来源和情绪变化里找增长切入点。",
  },
  {
    icon: MessageSquareText,
    title: "生成任务",
    description: "把自然语言问题拆成可执行的分析步骤。",
  },
  {
    icon: Clock3,
    title: "沉淀结论",
    description: "将聊天内容整理成报告、洞察或待办清单。",
  },
];

const initialMessages: AssistantMessage[] = [
  {
    id: 1,
    role: "agent",
    content:
      "你好，我是 CreativeHit 助手。你可以让我查看品牌可见性、解释指标变化、整理引用来源，或直接生成下一步优化建议。",
  },
];

function createAgentReply(input: string) {
  const normalized = input.trim();

  if (/报告|report/i.test(normalized)) {
    return "可以。我会按「品牌可见性、引用覆盖、竞品位置、情绪驱动、行动建议」五段来组织报告。当前建议先锁定近 7 天数据，并优先查看排名下降和未被引用的高权重来源。";
  }

  if (/竞品|竞争|compare/i.test(normalized)) {
    return "我会先把竞品按可见性份额、平均排名、被引用域名和正负情绪拆开比较。重点看两类差距：agent 更愿意推荐谁，以及这些推荐背后引用了哪些来源。";
  }

  if (/来源|引用|source|citation/i.test(normalized)) {
    return "可以从引用覆盖开始查。优先处理三类来源：高频出现但未提及 CreativeHit 的页面、竞品独占来源、以及带来负面语境的内容。";
  }

  if (/负面|情绪|sentiment/i.test(normalized)) {
    return "我会把负面情绪拆成产品能力、价格、可信度、学习成本和内容缺口几个维度。每个维度会对应到具体 prompt 与引用来源，方便决定是改内容、补页面，还是调整品牌叙事。";
  }

  return `收到。我会围绕「${normalized}」生成一个可执行分析路径：先确认目标指标，再定位相关 prompt 与引用来源，最后给出可落地的优化建议。`;
}

export function AssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const nextId = useRef(initialMessages.length + 1);

  const suggestedPrompt = useMemo(() => quickPrompts[messages.length % quickPrompts.length], [messages.length]);

  function submitMessage(value: string) {
    const trimmed = value.trim();

    if (!trimmed || isThinking) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      const agentMessage: AssistantMessage = {
        id: nextId.current++,
        role: "agent",
        content: createAgentReply(trimmed),
      };

      setMessages((current) => [...current, agentMessage]);
      setIsThinking(false);
    }, 520);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage(input);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-48px)] flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Bot size={20} />
          </span>
          <div>
            <h1 className="m-0 text-xl font-semibold tracking-tight">助手</h1>
            <p className="m-0 mt-1 text-sm text-muted-foreground">与 agent 对话，快速生成分析任务和行动建议。</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Agent ready
        </span>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] gap-4">
        <Card className="flex min-h-[620px] flex-col overflow-hidden p-0">
          <div className="border-b border-border/70 px-5 py-4">
            <p className="m-0 text-sm font-medium">对话</p>
            <p className="m-0 mt-1 text-xs text-muted-foreground">直接描述你想让 agent 分析、生成或检查的内容。</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-secondary/30 px-5 py-5">
            {messages.map((message) => {
              const isAgent = message.role === "agent";

              return (
                <div
                  className={cn("flex gap-3", isAgent ? "justify-start" : "justify-end")}
                  key={message.id}
                >
                  {isAgent ? (
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <Bot size={16} />
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[76%] rounded-2xl border px-4 py-3 text-sm leading-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]",
                      isAgent
                        ? "rounded-tl-md border-border/70 bg-card text-card-foreground"
                        : "rounded-tr-md border-primary bg-primary text-primary-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                  {!isAgent ? (
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-foreground text-background">
                      <UserRound size={16} />
                    </span>
                  ) : null}
                </div>
              );
            })}

            {isThinking ? (
              <div className="flex gap-3">
                <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Bot size={16} />
                </span>
                <div className="rounded-2xl rounded-tl-md border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground">
                  正在整理分析路径...
                </div>
              </div>
            ) : null}
          </div>

          <form className="border-t border-border/70 bg-card p-4" onSubmit={handleSubmit}>
            <div className="flex items-end gap-3 rounded-2xl border border-border bg-background p-2 focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/10">
              <textarea
                className="min-h-[48px] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage(input);
                  }
                }}
                placeholder={suggestedPrompt}
                rows={1}
                value={input}
              />
              <Button
                aria-label="发送消息"
                className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!input.trim() || isThinking}
                size="icon"
                type="submit"
              >
                <ArrowUp size={18} />
              </Button>
            </div>
          </form>
        </Card>

        <aside className="grid content-start gap-4">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h2 className="m-0 text-sm font-semibold">快速开始</h2>
            </div>
            <div className="grid gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  className="rounded-xl border border-border/70 bg-background px-3 py-2 text-left text-sm leading-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  key={prompt}
                  onClick={() => submitMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="m-0 mb-3 text-sm font-semibold">Agent 能做什么</h2>
            <div className="grid gap-3">
              {agentCapabilities.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="flex gap-3" key={item.title}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Icon size={15} />
                    </span>
                    <div>
                      <strong className="block text-sm font-medium">{item.title}</strong>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{item.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
