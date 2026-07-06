"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  ChartColumn,
  ClipboardCheck,
  Settings,
  Tags,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NavGroupId, NavId, NavItem } from "@/types";
import { navItems } from "@/features/shared/data/nav.data";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

const navIcons: Record<NavId, LucideIcon> = {
  overview: ChartColumn,
  prompts: Brain,
  knowledge: BookOpen,
  insights: ClipboardCheck,
  brands: Tags,
  settings: Settings,
};

const navGroupLabels: Record<NavGroupId, string> = {
  general: "主菜单",
  setting: "系统设置",
};

function NavigationSection({
  currentPath,
  items,
  label,
}: {
  currentPath: string;
  items: NavItem[];
  label: string;
}) {
  return (
    <div className="grid gap-2">
      <p className="px-3 text-xs font-medium text-muted-foreground/80">{label}</p>
      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = navIcons[item.id];
          const isActive = item.href === currentPath;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              href={item.href}
              key={item.id}
            >
              <span
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const groupedItems = {
    general: navItems.filter((item) => item.group === "general"),
    setting: navItems.filter((item) => item.group === "setting"),
  };

  return (
    <div className="grid min-h-screen grid-cols-[240px_minmax(0,1fr)] bg-background text-foreground">
      <aside
        className="sticky top-0 flex h-screen flex-col gap-6 border-r border-border/50 bg-background p-6"
        aria-label="主导航"
      >
        <div className="flex min-h-[48px] items-center gap-3">
          <div
            className="grid h-8 w-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground"
            aria-hidden="true"
          >
            CH
          </div>
          <div>
            <strong className="block text-sm font-semibold tracking-tight">CreativeHit</strong>
            <span className="mt-0.5 block text-xs text-muted-foreground">AI 可见性分析平台</span>
          </div>
        </div>

        <div className="grid gap-6">
          <NavigationSection
            currentPath={pathname}
            items={groupedItems.general}
            label={navGroupLabels.general}
          />
          <div className="mx-3 h-px bg-border/60" />
          <NavigationSection
            currentPath={pathname}
            items={groupedItems.setting}
            label={navGroupLabels.setting}
          />
        </div>
      </aside>

      <main className="min-w-0 bg-secondary/30">
        <section className="mx-auto px-8 pb-6 pt-6" tabIndex={-1}>
          {children}
        </section>
      </main>
    </div>
  );
}
