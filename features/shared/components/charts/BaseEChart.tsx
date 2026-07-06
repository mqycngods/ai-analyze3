"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";
import type { BaseEChartProps } from "./types";

// 注册所需模块（按需引入，减小打包体积）
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
]);

/**
 * BaseEChart —— 通用 ECharts 容器组件
 * 负责实例生命周期、resize 监听与 option 更新。
 * 业务图表组件（LineTrendChart / DonutChart / HorizontalBarChart）应基于此封装。
 */
export function BaseEChart({ option, className, height = 168 }: BaseEChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [ready, setReady] = useState(false);

  // 初始化实例
  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;
    setReady(true);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  // option 变化时更新（notMerge=true 保证完全切换）
  useEffect(() => {
    if (!chartRef.current || !ready) return;
    chartRef.current.setOption(option as EChartsOption, true);
  }, [option, ready]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

export default BaseEChart;
