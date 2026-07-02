"use client";

import {
  BookOpen,
  Brain,
  ChartColumn,
  ClipboardCheck,
  MessageSquareText,
  Settings,
  Waypoints
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NavId } from "@/lib/mock-data";
import { filterChips, navItems } from "@/lib/mock-data";

type LayoutProps = {
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
  prompts: Brain,
  chats: MessageSquareText,
  citations: Waypoints,
  knowledge: BookOpen,
  insights: ClipboardCheck,
  settings: Settings
};

export function AppShell({
  activePage,
  title,
  description,
  currentPath,
  children,
  onNavigate,
  onExport
}: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="主导航">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            CH
          </div>
          <div>
            <strong>CreativeHit</strong>
            <span>AI 可见性分析平台</span>
          </div>
        </div>

        <div className="sidebar-group">
          <nav className="nav-list">
            {navItems.map((item) => {
              const Icon = navIcons[item.id];

              return (
                <button
                  aria-current={item.id === activePage ? "page" : undefined}
                  className={`nav-item ${item.id === activePage ? "active" : ""}`}
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  <span className="nav-icon">
                    <Icon size={14} strokeWidth={2.2} />
                  </span>
                  <span className="nav-copy">
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* <div className="sidebar-footer">
          <span className="status-dot" />
          <div>
            <strong>已开启定时巡检</strong>
            <span>默认中文项目视图，支持后续结构化扩展</span>
          </div>
        </div> */}
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p className="topbar-description">{description}</p>
          </div>
        </header>

        <section className="content" tabIndex={-1}>
          {children}
        </section>
      </main>
    </div>
  );
}
