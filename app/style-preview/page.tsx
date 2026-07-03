const options = [
  {
    id: "A",
    name: "Editorial Analyst",
    recommendation: "推荐",
    description: "专业、克制、编辑部式分析台，最适合默认产品形态。",
    bg: "bg-[#f6f7f4]",
    panel: "bg-white border-[#dfe5dc]",
    ink: "text-[#171a16]",
    muted: "text-[#687163]",
    primary: "bg-[#171a16] text-white",
    accent: "bg-[#4bb62f]",
    accentText: "text-[#1d5f10]",
    chart: ["bg-[#171a16]", "bg-[#4bb62f]", "bg-[#9aa39a]", "bg-[#cbd5c5]"]
  },
  {
    id: "B",
    name: "Signal Command",
    recommendation: "冲击力强",
    description: "深色指挥中心，适合突出 Agent、MCP 和实时监控。",
    bg: "bg-[#08111f]",
    panel: "bg-[#0e1a2c] border-[#26364f]",
    ink: "text-[#e7fff2]",
    muted: "text-[#8ea59b]",
    primary: "bg-[#47f08a] text-[#06110b]",
    accent: "bg-[#47f08a]",
    accentText: "text-[#47f08a]",
    chart: ["bg-[#47f08a]", "bg-[#28d7ff]", "bg-[#315173]", "bg-[#1b2b41]"]
  },
  {
    id: "C",
    name: "Executive Briefing",
    recommendation: "交付感强",
    description: "咨询报告式风格，适合客户诊断、导出报告和演示。",
    bg: "bg-[#f8f6ef]",
    panel: "bg-white border-[#ded7c6]",
    ink: "text-[#17213a]",
    muted: "text-[#687083]",
    primary: "bg-[#17213a] text-white",
    accent: "bg-[#2f7a53]",
    accentText: "text-[#2f7a53]",
    chart: ["bg-[#17213a]", "bg-[#2f7a53]", "bg-[#c6a85a]", "bg-[#d9d4c6]"]
  },
  {
    id: "D",
    name: "Ops Console",
    recommendation: "效率优先",
    description: "高密度后台工具感，适合 Prompt 管理和团队日常运营。",
    bg: "bg-[#f5f7fa]",
    panel: "bg-white border-[#d6dde7]",
    ink: "text-[#162033]",
    muted: "text-[#647084]",
    primary: "bg-[#1d5fd1] text-white",
    accent: "bg-[#18a957]",
    accentText: "text-[#1d5fd1]",
    chart: ["bg-[#1d5fd1]", "bg-[#18a957]", "bg-[#f59e0b]", "bg-[#cbd5e1]"]
  }
];

function MiniDashboard({ option }: { option: (typeof options)[number] }) {
  return (
    <article className={`${option.bg} ${option.ink} rounded-xl border border-black/10 p-4 shadow-sm`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={`${option.accent} h-3 w-3 rounded-sm`} />
            <span className="text-xs font-bold tracking-[0.16em]">STYLE {option.id}</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{option.name}</h2>
          <p className={`${option.muted} mt-1 text-sm`}>{option.description}</p>
        </div>
        <span className={`${option.primary} rounded-md px-3 py-1 text-xs font-semibold`}>
          {option.recommendation}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_0.85fr]">
        <div className={`${option.panel} rounded-lg border p-3`}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className={`${option.muted} text-xs`}>Visibility Score</p>
              <strong className="text-3xl">67%</strong>
            </div>
            <span className={`${option.accentText} text-xs font-bold`}>+12 pts</span>
          </div>
          <div className="flex h-32 items-end gap-3 rounded-md bg-black/[0.03] p-3">
            {option.chart.map((color, index) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={color}>
                <div
                  className={`${color} w-full max-w-8 rounded-t`}
                  style={{ height: `${[92, 118, 54, 38][index]}px` }}
                />
                <span className={`${option.muted} text-[10px]`}>{["CH", "Ca", "Ad", "Fo"][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${option.panel} rounded-lg border p-3`}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Source Gap</p>
            <span className={`${option.accentText} text-xs font-bold`}>P0</span>
          </div>
          <div className="grid gap-2 text-xs">
            {["domain", "host", "url"].map((level, index) => (
              <div className="grid grid-cols-[64px_1fr_auto] items-center gap-2 border-b border-black/10 pb-2 last:border-0" key={level}>
                <span className={option.muted}>{level}</span>
                <span>{["zhihu.com", "cloud.tencent.com", "/developer/article"][index]}</span>
                <span className={`${option.accentText} font-bold`}>{[89, 53, 24][index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${option.panel} mt-3 rounded-lg border p-3`}>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">Prompt Library</p>
          <div className="flex gap-1">
            <span className="rounded-full bg-black/5 px-2 py-1 text-[10px]">Active</span>
            <span className="rounded-full bg-black/5 px-2 py-1 text-[10px]">Suggested</span>
          </div>
        </div>
        <div className="grid gap-2 text-xs">
          {[
            "Best AI creative tools for content teams",
            "Canva vs CreativeHit for marketing workflows",
            "Which tools generate fan-out search queries?"
          ].map((prompt, index) => (
            <div className="grid grid-cols-[1fr_56px_56px] gap-2 border-b border-black/10 pb-2 last:border-0" key={prompt}>
              <span>{prompt}</span>
              <span className={option.accentText}>{["67%", "100%", "-"][index]}</span>
              <span className={option.muted}>{["US", "CN", "US"][index]}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function StylePreviewPage() {
  return (
    <main className="min-h-screen bg-[#f3f4f1] px-6 py-8 text-[#171a16]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#697064]">
              CreativeHit Style Preview
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">页面风格预估方案</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#697064]">
              这页只用于判断风格方向，不影响当前主应用页面。确认后再统一改 token、组件和具体页面。
            </p>
          </div>
          <a
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#dfe5dc] bg-white px-4 text-sm font-semibold"
            href="/"
          >
            返回主应用
          </a>
        </header>

        <section className="grid gap-5 xl:grid-cols-2">
          {options.map((option) => (
            <MiniDashboard key={option.id} option={option} />
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-[#dfe5dc] bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold">选择建议</h2>
          <div className="grid gap-3 text-sm text-[#4f5a4c] md:grid-cols-4">
            <p><strong className="text-[#171a16]">A</strong>：最稳，最适合真实产品默认风格。</p>
            <p><strong className="text-[#171a16]">B</strong>：最酷，适合强调 AI Agent 和实时监控。</p>
            <p><strong className="text-[#171a16]">C</strong>：最像客户交付报告，适合演示。</p>
            <p><strong className="text-[#171a16]">D</strong>：最高效，适合内部运营后台。</p>
          </div>
        </section>
      </div>
    </main>
  );
}
