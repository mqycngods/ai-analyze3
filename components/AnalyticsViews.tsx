"use client";

import {
  brandInsights,
  brands,
  chats,
  citationLevels,
  citationSources,
  overviewMetrics,
  prompts,
  settingsSections,
  sourceDetails,
  sourceGapRows,
  topics
} from "@/lib/mock-data";
import type { NavId } from "@/lib/mock-data";
import { useMemo, useState } from "react";

type PageProps = {
  navigate?: (page: NavId) => void;
  notify?: (message: string) => void;
};

type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
  note: string;
};

function MetricCard({ label, value, delta, note }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-label">
        <span>{label}</span>
        <span>{note}</span>
      </div>
      <div className="metric-value">{value}</div>
      <span className="delta">{delta}</span>
    </article>
  );
}

function VisibilityBars() {
  return (
    <div className="bar-chart" aria-label="品牌可见性柱状图">
      {brands.map((brand) => (
        <div className="bar-item" key={brand.name}>
          <div
            className="bar"
            style={{
              height: `${Math.max(brand.score * 1.8, 10)}px`,
              background: brand.name === "CreativeHit" ? "var(--color-brand)" : "var(--color-ink)"
            }}
          />
          <span className="bar-label">{brand.name.slice(0, 2)}</span>
        </div>
      ))}
    </div>
  );
}

function RankRows({ valueKey = "score" }: { valueKey?: "score" | "position" }) {
  return (
    <div className="rank-list">
      {brands.map((brand, index) => (
        <div className="rank-row" key={brand.name}>
          <span>{index + 1}</span>
          <span>
            <span className="logo-dot">{brand.name.slice(0, 1)}</span> {brand.name}
          </span>
          <strong>
            {brand[valueKey]}
            {valueKey === "position" ? "" : "%"}
          </strong>
        </div>
      ))}
    </div>
  );
}

function DomainTable({ level }: { level: "domain" | "host" | "url" }) {
  const rows = useMemo(() => citationSources.filter((row) => row.level === level), [level]);

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>来源层级</th>
          <th>来源标识</th>
          <th>检索率</th>
          <th>引用率</th>
          <th>类型</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.level}-${row.source}`}>
            <td>{row.level}</td>
            <td>{row.source}</td>
            <td>{row.retrieved}</td>
            <td>{row.citation}</td>
            <td>
              <span className="tag green">{row.type}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChatTable() {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Prompt</th>
          <th>模型</th>
          <th>Topic</th>
          <th>品牌提及</th>
          <th>情绪</th>
          <th>排名</th>
        </tr>
      </thead>
      <tbody>
        {chats.map((row) => (
          <tr key={`${row.model}-${row.prompt}`}>
            <td>{row.prompt}</td>
            <td>{row.model}</td>
            <td>{row.topic}</td>
            <td>{row.mentions}</td>
            <td>
              <span className="tag green">+{row.sentiment}</span>
            </td>
            <td>#{row.position}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CompetitorMatrix() {
  const columns = ["ChatGPT", "DeepSeek", "Claude", "Perplexity", "Gemini"];
  const rows = ["Adobe", "Canva", "Midjourney", "OpenAI", "CreativeHit"];

  return (
    <div className="matrix">
      <div className="matrix-grid">
        <div className="matrix-cell header">竞品 / 模型</div>
        {columns.map((column) => (
          <div className="matrix-cell header" key={column}>
            {column}
          </div>
        ))}
        {rows.map((row, rowIndex) => (
          <div className="matrix-row-fragment" key={row}>
            <div className="matrix-cell header">{row}</div>
            {columns.map((column, columnIndex) => {
              const heat = row === "CreativeHit" ? 0 : (rowIndex + columnIndex) % 5;
              const value = row === "CreativeHit" ? "0%" : `${[100, 67, 52, 28, 7][heat]}%`;
              return (
                <div className={`matrix-cell heat-${heat}`} key={`${row}-${column}`}>
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2>{title}</h2>
      <p className="small-label">{description}</p>
    </div>
  );
}

export function OverviewPage({ navigate, notify }: PageProps) {
  return (
    <>
      <section className="hero-notice">
        <div>
          <h2>你的品牌已出现在 67% 的监测 AI 回答中</h2>
          <p>
            当前在核心 Topic 中保持领先，但引用来源仍过度集中于 UGC。下一步建议优先补齐媒体站、企业站和可复用 URL 级来源。
          </p>
        </div>
        <button className="primary-button" onClick={() => notify?.("已将该洞察加入行动建议列表。")}
 type="button">
          发送到行动建议
        </button>
      </section>

      <section className="metrics-grid metrics-grid-5">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <SectionHeading title="品牌可见性分布" description="查看各品牌在 AI 回答中的出现频率。" />
          </div>
          <div className="split-panel">
            <VisibilityBars />
            <RankRows />
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <SectionHeading title="声量份额" description="按品牌拆分当前提及占比，并支持继续按 Topic / 模型扩展。" />
          </div>
          <div className="donut-wrap">
            <div className="donut" role="img" aria-label="声量份额环图" />
            <div className="legend">
              <div className="legend-item"><span className="legend-swatch" /> CreativeHit 52%</div>
              <div className="legend-item"><span className="legend-swatch swatch-blue" /> Canva 7.7%</div>
              <div className="legend-item"><span className="legend-swatch swatch-purple" /> Adobe 7.7%</div>
              <div className="legend-item"><span className="legend-swatch swatch-gray" /> 其他 25%</div>
            </div>
          </div>
        </article>

        <article className="table-panel">
          <div className="table-header">
            <SectionHeading title="重点引用来源" description="优先关注 domain 层来源分布，为 Source Gap 做准备。" />
            <button className="secondary-button" onClick={() => navigate?.("citations")} type="button">
              查看全部
            </button>
          </div>
          <DomainTable level="domain" />
        </article>

        <article className="panel">
          <div className="panel-header">
            <SectionHeading title="竞品矩阵预览" description="按模型查看品牌差距，后续可扩展到 Topic / 来源维度。" />
            <button className="secondary-button" onClick={() => navigate?.("insights")} type="button">
              查看洞察
            </button>
          </div>
          <CompetitorMatrix />
        </article>
      </section>

      <section className="table-panel evidence-panel">
        <div className="table-header">
          <SectionHeading title="AI Chat" description="最近回答明细，用于解释评分变化。" />
          <button className="secondary-button" onClick={() => navigate?.("chats")} type="button">
            查看全部对话
          </button>
        </div>
        <ChatTable />
      </section>
    </>
  );
}

export function PromptsPage({ notify }: PageProps) {
  return (
    <section className="prompt-layout">
      <aside className="panel">
        <div className="panel-header">
          <SectionHeading title="Topic 分组" description="按主题查看 Prompt 覆盖范围与数量。" />
        </div>
        <div className="topic-list">
          {topics.map((topic, index) => (
            <button className={`topic-button ${index === 0 ? "active" : ""}`} key={topic.name} type="button">
              <span>{topic.name}</span>
              <strong>{topic.count}</strong>
            </button>
          ))}
        </div>
      </aside>

      <section className="table-panel">
        <div className="table-header">
          <SectionHeading title="提示词管理台" description="支持 Topic 分组、状态管理、批量归档与生成扩展。" />
          <div className="row-actions">
            <button className="secondary-button" onClick={() => notify?.("已打开 Prompt 生成器占位。下一步可接入生成 API。")}
 type="button">
              生成扩展
            </button>
            <button className="primary-button" onClick={() => notify?.("已触发新增 Prompt 抽屉占位。")}
 type="button">
              新增 Prompt
            </button>
          </div>
        </div>
        <div className="search-row table-search-row">
          <input aria-label="搜索 Prompt" placeholder="搜索 Prompt、Topic 或标签" type="search" />
          <button className="secondary-button" type="button">
            批量归档
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Prompt</th>
              <th>可见性</th>
              <th>情绪</th>
              <th>排名</th>
              <th>Volume</th>
              <th>Intent</th>
              <th>Branding</th>
              <th>Tags</th>
              <th>地区</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt.text}>
                <td>
                  <strong>{prompt.topic}</strong>
                  <br />
                  <span className="small-label">{prompt.text}</span>
                </td>
                <td>{prompt.visibility}</td>
                <td>{prompt.sentiment}</td>
                <td>{prompt.position}</td>
                <td>{prompt.volume}</td>
                <td>{prompt.intent}</td>
                <td>{prompt.branding}</td>
                <td>
                  <div className="tag-stack">
                    {prompt.tags.map((tag) => (
                      <span className="tag orange" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{prompt.location}</td>
                <td>
                  <span className={`tag ${prompt.status === "启用中" ? "green" : prompt.status === "建议中" ? "orange" : "red"}`}>
                    {prompt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}

export function ChatsPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? chats[selectedIndex] : null;

  return (
    <>
      <section className="table-panel">
        <div className="table-header">
          <SectionHeading title="全部对话" description="点击任意一行查看对话详情与引用来源。" />
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Prompt</th>
              <th>模型</th>
              <th>Topic</th>
              <th>品牌提及</th>
              <th>情绪</th>
              <th>排名</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((row, index) => (
              <tr
                key={`${row.model}-${row.prompt}`}
                onClick={() => setSelectedIndex(index)}
                style={{ cursor: "pointer" }}
              >
                <td>{row.prompt}</td>
                <td>{row.model}</td>
                <td>{row.topic}</td>
                <td>{row.mentions}</td>
                <td>
                  <span className="tag green">+{row.sentiment}</span>
                </td>
                <td>#{row.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 详情弹窗 */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelectedIndex(null)}>
          <dialog className="modal-dialog" open onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div>
                <h2>{selected.prompt}</h2>
                <p className="small-label">{selected.model} · Topic: {selected.topic} · 排名 #{selected.position} · 情绪 +{selected.sentiment}</p>
              </div>
              <button className="secondary-button" onClick={() => setSelectedIndex(null)} type="button">
                关闭
              </button>
            </header>

            <section className="modal-body">
              <h3>回答正文</h3>
              <div className="answer-box">
                {selected.answer.split("CreativeHit").map((part, index, arr) => (
                  <span key={`${part}-${index}`}>
                    {part}
                    {index < arr.length - 1 ? <span className="highlight">CreativeHit</span> : null}
                  </span>
                ))}
              </div>

              <h3 className="section-subtitle">品牌提及</h3>
              <div className="rank-list">
                <div className="rank-row">
                  <span>1</span>
                  <span><span className="logo-dot">C</span> CreativeHit</span>
                  <strong>{selected.mentions}</strong>
                </div>
              </div>

              <h3 className="section-subtitle">引用来源</h3>
              <div className="source-list">
                {sourceDetails.map((source) => (
                  <div className="source-item" key={source.title}>
                    <strong>{source.title}</strong>
                    <span>
                      {source.domain} · 层级 {source.level} · 被引用 {source.rate}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </dialog>
        </div>
      )}
    </>
  );
}

export function CitationsPage({ notify }: PageProps) {
  const [level, setLevel] = useState<(typeof citationLevels)[number]>("domain");

  return (
    <>
      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <SectionHeading title="引用占比" description="按来源层级查看 AI 回答最常引用的来源。" />
          </div>
          <VisibilityBars />
        </article>
        <article className="panel">
          <div className="panel-header">
            <SectionHeading title="来源层级切换" description="支持 domain / host / url 三层钻取与后续 Source Gap 复用。" />
          </div>
          <div className="chip-row">
            {citationLevels.map((item) => (
              <button
                className={`filter-chip ${item === level ? "active-chip" : ""}`}
                key={item}
                onClick={() => setLevel(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="legend top-gap">
            <div className="legend-item"><span className="legend-swatch" /> UGC 57.1%</div>
            <div className="legend-item"><span className="legend-swatch swatch-blue" /> 媒体 28.6%</div>
            <div className="legend-item"><span className="legend-swatch swatch-gray" /> 其他 14.3%</div>
          </div>
        </article>
      </section>
      <section className="table-panel evidence-panel">
        <div className="table-header">
          <SectionHeading title="热点引用来源" description="切换层级后，表格会展示对应来源粒度。" />
          <div className="row-actions">
            <button className="secondary-button" onClick={() => notify?.(`已切换并准备导出 ${level} 层级引用数据。`)} type="button">
              导出 CSV
            </button>
          </div>
        </div>
        <DomainTable level={level} />
      </section>
    </>
  );
}



export function KnowledgePage({ notify }: PageProps) {
  const cards = [
    ["URL", "抓取网页", "添加一个或多个 URL，并抽取结构化内容。"],
    ["PDF", "上传文件", "解析 PDF、文档、演示稿及其他资料。"],
    ["SITE", "抓取网站", "导入整站内容，适合品牌官网或专题站。"],
    ["TXT", "粘贴文本", "录入品牌定位、卖点说明和内部笔记。"],
    ["NT", "导入 Notion", "同步连接工作区中的知识页面。"],
    ["GD", "导入 Google Drive", "使用已连接 Drive 文件作为知识来源。"]
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <SectionHeading title="知识库入口" description="P0 / P1 先保留入口与空状态，后续再扩展解析状态与同步状态。" />
        <button className="primary-button" onClick={() => notify?.("已触发知识源连接器占位。")}
 type="button">
          连接来源
        </button>
      </div>
      <div className="knowledge-grid">
        {cards.map((card) => (
          <article className="source-card" key={card[1]}>
            <div className="source-visual">{card[0]}</div>
            <h3>{card[1]}</h3>
            <p>{card[2]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function InsightsPage({ notify }: PageProps) {
  const actionItems = [
    ["扩展引用来源", "当前 UGC 来源占比过高，建议补齐媒体与企业站，提升可信度信号。", "高优先级"],
    ["生成 fan-out queries", "买家意图类 Prompt 与中文市场对比词覆盖仍然偏薄。", "中优先级"],
    ["创建竞品对比页", "当前 AI 回答频繁比较 CreativeHit 与 Canva，但引用第三方总结较多。", "高优先级"]
  ];

  return (
    <section className="stack-layout">
      {/* 竞品 Gap 矩阵 */}
      <article className="panel">
        <div className="panel-header">
          <SectionHeading title="竞品 Gap 矩阵" description="按模型 / Topic / 来源查看可见性、声量份额和引用差距。" />
          <div className="panel-actions">
            <button className="secondary-button" type="button">可见性</button>
            <button className="secondary-button" type="button">声量份额</button>
            <button className="secondary-button" type="button">来源差距</button>
          </div>
        </div>
        <CompetitorMatrix />
      </article>

      {/* Source Gap + Brand Insights */}
      <section className="insight-grid evidence-panel">
        <article className="table-panel">
          <div className="table-header">
            <SectionHeading title="Source Gap Analysis" description="找出竞品覆盖但我方尚未覆盖的关键来源。" />
            <button className="primary-button" onClick={() => notify?.("已从 Source Gap 生成行动建议。")} type="button">
              一键生成 Action
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>来源</th>
                <th>层级</th>
                <th>竞品覆盖</th>
                <th>我方覆盖</th>
                <th>Gap Score</th>
              </tr>
            </thead>
            <tbody>
              {sourceGapRows.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <div className="panel-header">
            <SectionHeading title="品牌洞察摘要" description="从矩阵和来源缺口中总结品牌强弱项。" />
          </div>
          <div className="insight-columns single-column">
            {brandInsights.map((group) => (
              <div className="insight-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul className="bullet-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* 行动建议 */}
    </section>
  );
}

export function SettingsPage({ notify }: PageProps) {
  return (
    <section className="stack-layout">
      {settingsSections.map((section) => (
        <section className="table-panel" key={section.title}>
          <div className="table-header">
            <SectionHeading title={section.title} description="采用结构化分组，便于后续接入真实配置和权限体系。" />
            {section.title === "Profile" ? (
              <button className="primary-button" onClick={() => notify?.("已保存设置中心示例配置。")}
 type="button">
                保存修改
              </button>
            ) : null}
          </div>
          <table className="data-table">
            <tbody>
              {section.rows.map((row) => (
                <tr key={row[0]}>
                  <th>{row[0]}</th>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </section>
  );
}
