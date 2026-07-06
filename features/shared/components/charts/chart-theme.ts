// ECharts 图表主题工具：从 CSS 变量读取颜色，保证与设计系统一致

/** 读取 CSS 变量的实际颜色值（如 hsl(var(--primary))） */
export function cssVar(name: string): string {
  if (typeof window === "undefined") return "";
  const style = getComputedStyle(document.documentElement);
  const raw = style.getPropertyValue(name).trim();
  if (!raw) return "";
  // CSS 变量存储为 "225 100% 60%" 形式，需拼接为 hsl()
  if (raw.includes("%")) {
    return `hsl(${raw})`;
  }
  return raw;
}

/** 主题色集合，供各图表组件使用 */
export function chartTheme() {
  return {
    primary: cssVar("--primary") || "#3366FF",
    foreground: cssVar("--foreground") || "#111827",
    muted: cssVar("--muted") || "#F3F4F6",
    mutedForeground: cssVar("--muted-foreground") || "#6B7280",
    border: cssVar("--border") || "#E5E7EB",
    card: cssVar("--card") || "#FFFFFF",
    success: cssVar("--success") || "#22C55E",
    warning: cssVar("--warning") || "#F59E0B",
    destructive: cssVar("--destructive") || "#EF4444",
  };
}

/** 通用 tooltip 样式 */
export function tooltipStyle() {
  const t = chartTheme();
  return {
    backgroundColor: t.card,
    borderColor: t.border,
    borderWidth: 1,
    textStyle: {
      color: t.foreground,
      fontSize: 12,
    },
    padding: [8, 12],
    extraCssText: "box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-radius: 8px;",
  };
}
