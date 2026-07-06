"use client";

import { BrandsPage } from "@/features/brands/components";
import { useDashboard } from "@/features/shared/providers/DashboardProvider";

export default function BrandsRoute() {
  const { notify } = useDashboard();

  return <BrandsPage notify={notify} />;
}
