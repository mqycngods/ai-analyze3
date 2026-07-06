"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { defaultGlobalFilters } from "@/features/shared/data/filter-options";
import type { GlobalFilterState } from "@/types/analytics";

type DashboardContextValue = {
  /** 全局筛选状态 */
  globalFilters: GlobalFilterState;
  setGlobalFilters: (filters: GlobalFilterState) => void;
  /** Toast 通知 */
  toast: string;
  notify: (message: string) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>(defaultGlobalFilters);
  const [toast, setToast] = useState("");

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }, []);

  return (
    <DashboardContext.Provider
      value={{ globalFilters, setGlobalFilters, toast, notify }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }

  return context;
}
