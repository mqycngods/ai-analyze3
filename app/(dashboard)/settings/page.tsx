"use client";

import { SettingsPage } from "@/features/settings/components";
import { useDashboard } from "@/features/shared/providers/DashboardProvider";

export default function SettingsRoute() {
  const { notify } = useDashboard();

  return <SettingsPage notify={notify} />;
}
