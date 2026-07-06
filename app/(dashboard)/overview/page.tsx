"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewPage, type OverviewTab } from "@/features/overview/components";
import { GlobalFilters } from "@/features/shared/components";
import { useDashboard } from "@/features/shared/providers/DashboardProvider";
import { navItems } from "@/features/shared/data/nav.data";
import type { NavId } from "@/types";

export default function OverviewRoute() {
  const { globalFilters, setGlobalFilters, notify } = useDashboard();
  const [activeTab, setActiveTab] = useState<OverviewTab>("visibility");
  const router = useRouter();

  function navigate(page: NavId) {
    const item = navItems.find((n) => n.id === page);
    router.push(item?.href ?? "/overview");
  }

  return (
    <>
      <GlobalFilters
        className="mb-6"
        onChange={setGlobalFilters}
        onExport={activeTab === "insights" ? () => notify("已为当前洞察视图创建导出任务。") : undefined}
        value={globalFilters}
      />
      <OverviewPage
        activeTab={activeTab}
        filters={globalFilters}
        navigate={navigate}
        notify={notify}
        onTabChange={setActiveTab}
      />
    </>
  );
}
