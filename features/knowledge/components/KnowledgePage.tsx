"use client";

import { Button, Card } from "@/ui";

type PageProps = {
  notify?: (message: string) => void;
};

export function KnowledgePage({ notify }: PageProps) {
  const cards = [
    ["URL", "抓取网页", "添加一个或多个 URL，并抽取结构化内容。"],
    ["PDF", "上传文件", "解析 PDF、文档、演示稿及其他资料。"],
    ["SITE", "抓取网站", "导入整站内容，适合品牌官网或专题站。"],
    ["TXT", "粘贴文本", "录入品牌定位、卖点说明和内部笔记。"],
    ["NT", "导入 Notion", "同步连接工作区中的知识页面。"],
    ["GD", "导入 Google Drive", "使用已连接 Drive 文件作为知识来源。"],
  ];

  return (
    <div className="grid gap-8">
      <Card className="p-6 border-none shadow-sm bg-surface">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight mb-2">知识库入口</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              将品牌官网、文档和内部资料统一沉淀到知识库，为 AI 分析、洞察生成和建议模块提供稳定上下文。
            </p>
          </div>
          <Button variant="secondary" onClick={() => notify?.("已触发知识源连接器占位。")} type="button">
            连接来源
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            className="p-6 border-none shadow-sm bg-surface hover:-translate-y-0.5 transition-transform duration-200"
            key={card[1]}
          >
            <div className="w-11 h-11 rounded-2xl bg-muted/60 flex items-center justify-center text-sm font-semibold text-foreground mb-5">
              {card[0]}
            </div>
            <h3 className="text-lg font-semibold mb-2 tracking-tight">{card[1]}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card[2]}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
