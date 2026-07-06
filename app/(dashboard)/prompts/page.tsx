"use client";

import { PromptsPage } from "@/features/prompts/components";
import { useDashboard } from "@/features/shared/providers/DashboardProvider";

export default function PromptsRoute() {
  const { notify } = useDashboard();

  return <PromptsPage notify={notify} />;
}
