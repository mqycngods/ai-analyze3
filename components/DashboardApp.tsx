"use client";

import { useMemo, useState } from "react";
import {
  ChatsPage,
  CitationsPage,
  InsightsPage,
  KnowledgePage,
  OverviewPage,
  PromptsPage,
  SettingsPage
} from "@/components/AnalyticsViews";
import { AppShell } from "@/components/Layout";
import { navItems, type NavId } from "@/lib/mock-data";

type RouteState = {
  title: string;
  description: string;
  currentPath: string;
};

export function DashboardApp() {
  const [activePage, setActivePage] = useState<NavId>("overview");
  const [toast, setToast] = useState("");

  const routeState = useMemo<RouteState>(() => {
    const item = navItems.find((navItem) => navItem.id === activePage);

    return {
      title: item?.label ?? "概览分析",
      description: item?.description ?? "AI 可见性核心概览",
      currentPath: item?.href ?? "/?view=overview"
    };
  }, [activePage]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  const page = {
    overview: <OverviewPage navigate={setActivePage} notify={notify} />,
    prompts: <PromptsPage notify={notify} />,
    chats: <ChatsPage />,
    citations: <CitationsPage notify={notify} />,
    knowledge: <KnowledgePage notify={notify} />,
    insights: <InsightsPage notify={notify} />,
    settings: <SettingsPage notify={notify} />
  }[activePage];

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
        {page}
      </AppShell>
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
