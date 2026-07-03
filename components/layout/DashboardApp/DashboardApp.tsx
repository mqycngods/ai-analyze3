"use client";

import { useMemo, useState } from "react";
import { OverviewPage } from "@/features/overview/components";
import { BrandsPage } from "@/features/brands/components";
import { PromptsPage } from "@/features/prompts/components";
import { KnowledgePage } from "@/features/knowledge/components";
import { InsightsPage } from "@/features/insights/components";
import { SettingsPage } from "@/features/settings/components";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalFilters } from "@/features/shared/components";
import { defaultGlobalFilters } from "@/features/shared/data/filter-options";
import { navItems } from "@/features/shared/data/nav.data";
import type { NavId } from "@/types";
import type { GlobalFilterState } from "@/types/analytics";

type RouteState = {
  title: string;
  description: string;
  currentPath: string;
};

export function DashboardApp() {
  const [activePage, setActivePage] = useState<NavId>("overview");
  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>(defaultGlobalFilters);
  const [toast, setToast] = useState("");

  const routeState = useMemo<RouteState>(() => {
    const item = navItems.find((navItem) => navItem.id === activePage);

    return {
      title: item?.label ?? "概览分析",
      description: item?.description ?? "AI 可见性核心概览",
      currentPath: item?.href ?? "/?view=overview",
    };
  }, [activePage]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  const page = {
    overview: <OverviewPage filters={globalFilters} navigate={setActivePage} notify={notify} />,
    brands: <BrandsPage notify={notify} />,
    prompts: <PromptsPage notify={notify} />,
    knowledge: <KnowledgePage notify={notify} />,
    insights: <InsightsPage filters={globalFilters} notify={notify} />,
    settings: <SettingsPage notify={notify} />,
  }[activePage];

  const showGlobalFilters = activePage === "overview" || activePage === "insights";

  return (
    <>
      <AppShell
        activePage={activePage}
        currentPath={routeState.currentPath}
        description={routeState.description}
        onExport={() => notify("已为当前筛选视图创建导出任务。")}
        onNavigate={setActivePage}
        title={routeState.title}
      >
        {showGlobalFilters ? (
          <GlobalFilters className="mb-6" onChange={setGlobalFilters} value={globalFilters} />
        ) : null}
        {page}
      </AppShell>
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
