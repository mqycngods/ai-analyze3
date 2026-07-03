"use client";

import {
  BookOpen,
  Brain,
  ChartColumn,
  ClipboardCheck,
  Tags,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NavId } from "@/types";
import { navItems } from "@/features/shared/data/nav.data";
import { cn } from "@/lib/utils";

type AppShellProps = {
  activePage: NavId;
  title: string;
  description: string;
  currentPath: string;
  children: React.ReactNode;
  onNavigate: (page: NavId) => void;
  onExport: () => void;
};

const navIcons: Record<NavId, LucideIcon> = {
  overview: ChartColumn,
  brands: Tags,
  prompts: Brain,
  knowledge: BookOpen,
  insights: ClipboardCheck,
  settings: Settings,
};

export function AppShell({ activePage, children, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_minmax(0,1fr)] bg-background text-foreground">
      <aside
        className="sticky top-0 h-screen flex flex-col gap-6 p-6 bg-background border-r border-border/50"
        aria-label="主导航"
      >
        <div className="flex items-center gap-3 min-h-[48px]">
          <div
            className="w-8 h-8 grid place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold"
            aria-hidden="true"
          >
            CH
          </div>
          <div>
            <strong className="block text-sm font-semibold tracking-tight">CreativeHit</strong>
            <span className="block text-xs text-muted-foreground mt-0.5">AI 可见性分析平台</span>
          </div>
        </div>

        <div className="grid gap-4">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const Icon = navIcons[item.id];
              const isActive = item.id === activePage;

              return (
                <button
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                    isActive
                      ? "bg-muted text-foreground font-medium"
                      : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  <span
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 bg-secondary/30">
        <section className="p-8 mx-auto" tabIndex={-1}>
          {children}
        </section>
      </main>
    </div>
  );
}
