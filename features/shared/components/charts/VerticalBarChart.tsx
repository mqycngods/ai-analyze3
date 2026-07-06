"use client";

import { useMemo } from "react";
import { BaseEChart } from "./BaseEChart";
import { chartTheme, tooltipStyle } from "./chart-theme";
import type { VerticalBarChartProps } from "./types";

/**
 * VerticalBarChart —— 竖向柱状图
 * 带圆角顶部、数值标签与 hover tooltip。
 * 用于绩效评估矩阵等按区间分布的场景。
 */
export function VerticalBarChart({ data, unit = "", height = 220 }: VerticalBarChartProps) {
  const option = useMemo(() => {
    const t = chartTheme();

    return {
      grid: {
        left: 16,
        right: 16,
        top: 24,
        bottom: 32,
        containLabel: false,
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
        type: "category" as const,
        data: data.map((d) => d.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: t.mutedForeground,
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value" as const,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: {
          lineStyle: {
            color: t.border,
            type: "dashed" as const,
            opacity: 0.6,
          },
        },
      },
      series: [
        {
          type: "bar" as const,
          data: data.map((d) => ({
            value: d.value,
            itemStyle: {
              color: d.color,
              borderRadius: [6, 6, 0, 0],
            },
          })),
          barWidth: "52%",
          label: {
            show: true,
            position: "top" as const,
            formatter: (params: any) => `${params.value}${unit}`,
            color: t.foreground,
            fontSize: 11,
            fontWeight: 600,
          },
        },
      ],
    };
  }, [data, unit]);

  return <BaseEChart option={option} height={height} />;
}

export default VerticalBarChart;
