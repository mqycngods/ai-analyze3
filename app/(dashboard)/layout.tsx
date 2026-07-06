"use client";

import { AppShell } from "@/components/layout/AppShell";
import { DashboardProvider, useDashboard } from "@/features/shared/providers/DashboardProvider";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { toast } = useDashboard();

  return (
    <>
      <AppShell>{children}</AppShell>
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardProvider>
  );
}
