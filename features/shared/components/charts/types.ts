import type { EChartsOption } from "echarts";

/** BaseEChart 通用属性 */
export type BaseEChartProps = {
  option: EChartsOption;
  className?: string;
  /** 图表高度，默认 168px（与原手写图表保持一致） */
  height?: number | string;
};

/** 折线图数据点 */
export type TrendPoint = {
  date: string;
  value: number;
};

/** 多系列折线图数据点 */
export type MultiTrendPoint = {
  date: string;
  /** 各系列的值，key 对应 series 的 key */
  [key: string]: string | number;
};

/** 折线图系列定义 */
export type TrendSeries = {
  /** 系列标识，对应 MultiTrendPoint 中的 key */
  key: string;
  /** 系列名称（图例 / tooltip 展示） */
  label: string;
  /** 线条颜色 */
  color: string;
  /** 是否显示渐变面积，默认 true */
  area?: boolean;
};

/** LineTrendChart 属性（单系列） */
export type LineTrendChartProps = {
  data: TrendPoint[];
  /** Y 轴最大值 */
  max: number;
  /** Y 轴最小值 */
  min: number;
  /** Y 轴单位，默认 "%" */
  unit?: string;
  /** 是否反转 Y 轴（排名场景数值越小越好） */
  invert?: boolean;
  /** 图表高度 */
  height?: number | string;
};

/** MultiLineTrendChart 属性（多系列） */
export type MultiLineTrendChartProps = {
  data: MultiTrendPoint[];
  series: TrendSeries[];
  /** Y 轴最大值 */
  max: number;
  /** Y 轴最小值 */
  min: number;
  /** Y 轴单位，默认 "%" */
  unit?: string;
  /** 图表高度 */
  height?: number | string;
};

/** DonutChart 数据项 */
export type DonutItem = {
  name: string;
  value: number;
  color: string;
};

/** DonutChart 属性 */
export type DonutChartProps = {
  data: DonutItem[];
  /** 中心展示的文本 */
  centerLabel?: string;
  /** 图表高度 */
  height?: number | string;
};

/** HorizontalBarChart 数据项 */
export type BarItem = {
  label: string;
  value: number;
  color: string;
};

/** HorizontalBarChart 属性 */
export type HorizontalBarChartProps = {
  data: BarItem[];
  /** 数值后缀，默认 "%" */
  unit?: string;
  /** 图表高度 */
  height?: number | string;
};

/** VerticalBarChart 属性（竖向柱状图） */
export type VerticalBarChartProps = {
  data: BarItem[];
  /** 数值后缀，默认 "" */
  unit?: string;
  /** 图表高度 */
  height?: number | string;
};
