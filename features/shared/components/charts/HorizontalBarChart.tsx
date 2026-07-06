"use client";

import { useMemo } from "react";
import { BaseEChart } from "./BaseEChart";
import { chartTheme, tooltipStyle } from "./chart-theme";
import type { HorizontalBarChartProps } from "./types";

/**
 * HorizontalBarChart —— 横向柱状图
 * 带圆角柱体、数值标签与 hover tooltip。
 * 用于引用分类、来源覆盖等排名场景。
 */
export function HorizontalBarChart({ data, unit = "%", height = 168 }: HorizontalBarChartProps) {
  const option = useMemo(() => {
    const t = chartTheme();
    // 反转使第一项显示在顶部
    const reversed = [...data].reverse();

    return {
      grid: {
        left: 8,
        right: 48,
        top: 8,
        bottom: 8,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "shadow" as const },
        ...tooltipStyle(),
        formatter: (params: any) => {
          const p = (params as Array<{ name: string; value: number }>)[0];
          return `${p.name}<br/>${p.value}${unit}`;
        },
      },
      xAxis: {
        type: "value" as const,
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category" as const,
        data: reversed.map((d) => d.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: t.foreground,
          fontSize: 12,
          fontWeight: 500,
        },
      },
      series: [
        {
          type: "bar" as const,
          data: reversed.map((d) => ({
            value: d.value,
            itemStyle: {
              color: d.color,
              borderRadius: [0, 6, 6, 0],
            },
          })),
          barWidth: "60%",
          label: {
            show: true,
            position: "right" as const,
            formatter: (params: any) => `${params.value}${unit}`,
            color: t.mutedForeground,
            fontSize: 11,
            fontWeight: 600,
          },
        },
      ],
    };
  }, [data, unit]);

  return <BaseEChart option={option} height={height} />;
}

export default HorizontalBarChart;
