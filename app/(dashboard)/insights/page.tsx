"use client";

import { InsightsPage } from "@/features/insights/components";
import { GlobalFilters } from "@/features/shared/components";
import { useDashboard } from "@/features/shared/providers/DashboardProvider";

export default function InsightsRoute() {
  const { globalFilters, setGlobalFilters, notify } = useDashboard();

  return (
    <>
      <GlobalFilters
        className="mb-6"
        onChange={setGlobalFilters}
        onExport={() => notify("已为当前筛选视图创建导出任务。")}
        value={globalFilters}
      />
      <InsightsPage filters={globalFilters} notify={notify} />
    </>
  );
}
