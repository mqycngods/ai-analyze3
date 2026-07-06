"use client";

import { useMemo } from "react";
import { BaseEChart } from "./BaseEChart";
import { chartTheme, tooltipStyle } from "./chart-theme";
import type { MultiLineTrendChartProps } from "./types";

/**
 * MultiLineTrendChart —— 多系列趋势折线图
 * 支持同时显示多条折线，每条可配置颜色与渐变面积。
 * 用于洞察页的"可见性 + 域名覆盖"等双系列场景。
 */
export function MultiLineTrendChart({
  data,
  series,
  max,
  min,
  unit = "%",
  height = 260,
}: MultiLineTrendChartProps) {
  const option = useMemo(() => {
    const t = chartTheme();
    const range = max - min || 1;

    return {
      grid: {
        left: 42,
        right: 20,
        top: 36,
        bottom: 48,
        containLabel: false,
      },
      tooltip: {
        trigger: "axis" as const,
        ...tooltipStyle(),
        formatter: (params: any) => {
          const items = params as Array<{ seriesName: string; value: number; color: string; axisValue?: string }>;
          const date = items[0]?.axisValue ?? "";
          const lines = items.map(
            (item) =>
              `<span style="display:inline-block;margin-right:5px;border-radius:50%%;width:8px;height:8px;background:${item.color};"></span>${item.seriesName}: ${formatValue(item.value, unit)}`
          );
          return `${date}<br/>${lines.join("<br/>")}`;
        },
      },
      legend: {
        show: true,
        bottom: 0,
        icon: "roundRect" as const,
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: t.mutedForeground,
          fontSize: 11,
        },
        data: series.map((s) => s.label),
      },
      xAxis: {
        type: "category" as const,
        data: data.map((d) => String(d.date)),
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
        min,
        max,
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
      series: series.map((s) => {
        const seriesColor = s.color;
        const rgb = seriesColor.startsWith("#")
          ? hexToRgba(seriesColor, 0.14)
          : "rgba(51,102,255,0.14)";
        const rgbFade = seriesColor.startsWith("#")
          ? hexToRgba(seriesColor, 0.02)
          : "rgba(51,102,255,0.02)";
        const showArea = s.area !== false;

        return {
          type: "line" as const,
          name: s.label,
          data: data.map((d) => d[s.key] as number),
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            color: seriesColor,
            width: 2.3,
          },
          itemStyle: {
            color: seriesColor,
            borderColor: t.card,
            borderWidth: 2,
          },
          emphasis: {
            focus: "series" as const,
          },
          areaStyle: showArea
            ? {
                color: {
                  type: "linear" as const,
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: rgb },
                    { offset: 1, color: rgbFade },
                  ],
                },
              }
            : undefined,
        };
      }),
    };
  }, [data, series, max, min, unit]);

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

export default MultiLineTrendChart;
