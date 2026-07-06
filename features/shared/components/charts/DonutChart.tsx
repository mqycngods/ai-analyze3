"use client";

import { useMemo } from "react";
import { BaseEChart } from "./BaseEChart";
import { chartTheme, tooltipStyle } from "./chart-theme";
import type { DonutChartProps } from "./types";

/**
 * DonutChart —— 环形饼图
 * 带连续分段、hover 高亮与中心文本。
 * 用于声量份额等占比场景。
 */
export function DonutChart({ data, centerLabel, height = 168 }: DonutChartProps) {
  const option = useMemo(() => {
    const t = chartTheme();

    return {
      tooltip: {
        trigger: "item" as const,
        ...tooltipStyle(),
        formatter: (params: any) =>
          `${params.name}<br/>${params.value} (${params.percent}%)`,
      },
      legend: { show: false },
      series: [
        {
          type: "pie" as const,
          radius: ["58%", "78%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderWidth: 0,
          },
          label: {
            show: !!centerLabel,
            position: "center" as const,
            formatter: () => centerLabel ?? "",
            fontSize: 13,
            fontWeight: "bold" as const,
            color: t.foreground,
          },
          emphasis: {
            scale: true,
            scaleSize: 6,
            label: {
              show: !!centerLabel,
              fontSize: 15,
            },
          },
          data: data.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: item.color },
          })),
        },
      ],
    };
  }, [data, centerLabel]);

  return <BaseEChart option={option} height={height} />;
}

export default DonutChart;
