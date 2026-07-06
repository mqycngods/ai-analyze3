"use client";

import { KnowledgePage } from "@/features/knowledge/components";
import { useDashboard } from "@/features/shared/providers/DashboardProvider";

export default function KnowledgeRoute() {
  const { notify } = useDashboard();

  return <KnowledgePage notify={notify} />;
}
