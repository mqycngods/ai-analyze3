"use client";

import { useMemo } from "react";
import { BaseEChart } from "./BaseEChart";
import { chartTheme, tooltipStyle } from "./chart-theme";
import type { LineTrendChartProps } from "./types";

/**
 * LineTrendChart —— 趋势折线图
 * 带渐变面积、平滑曲线、虚线网格与 hover tooltip。
 * 用于可见性得分、平均排名、情绪得分等趋势场景。
 */
export function LineTrendChart({ data, max, min, unit = "%", invert = false, height = 168 }: LineTrendChartProps) {
  const option = useMemo(() => {
    const t = chartTheme();
    const range = max - min || 1;
    // 用于渐变填充的颜色（primary 的 rgba 形式）
    const primaryRgb = t.primary.startsWith("#")
      ? hexToRgba(t.primary, 0.18)
      : "rgba(51,102,255,0.18)";
    const primaryRgbFade = t.primary.startsWith("#")
      ? hexToRgba(t.primary, 0.02)
      : "rgba(51,102,255,0.02)";

    return {
      grid: {
        left: 36,
        right: 16,
        top: 16,
        bottom: 28,
        containLabel: false,
      },
      tooltip: {
        trigger: "axis" as const,
        ...tooltipStyle(),
        formatter: (params: any) => {
          const p = (params as Array<{ axisValue: string; value: number }>)[0];
          return `${p.axisValue}<br/>${formatValue(p.value, unit)}`;
        },
      },
      xAxis: {
        type: "category" as const,
        data: data.map((d) => d.date),
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: t.mutedForeground,
          fontSize: 10,
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value" as const,
        min: invert ? max : min,
        max: invert ? min : max,
        inverse: invert,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: t.mutedForeground,
          fontSize: 10,
          formatter: (val: number) => formatValue(val, unit),
        },
        splitLine: {
          lineStyle: {
            color: t.border,
            type: "dashed" as const,
            opacity: 0.8,
          },
        },
        interval: range / 2,
      },
      series: [
        {
          type: "line" as const,
          data: data.map((d) => d.value),
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            color: t.primary,
            width: 2.5,
          },
          itemStyle: {
            color: t.primary,
            borderColor: t.card,
            borderWidth: 2,
          },
          emphasis: {
            focus: "series" as const,
            scale: 1.4,
          },
          areaStyle: {
            color: {
              type: "linear" as const,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: primaryRgb },
                { offset: 1, color: primaryRgbFade },
              ],
            },
          },
        },
      ],
    };
  }, [data, max, min, unit, invert]);

  return <BaseEChart option={option} height={height} />;
}

function formatValue(val: number, unit: string) {
  const num = Number.isInteger(val) ? val : val.toFixed(1);
  return `${num}${unit}`;
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default LineTrendChart;
