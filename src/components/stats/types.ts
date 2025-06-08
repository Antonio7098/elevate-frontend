export interface DataPoint {
  timestamp: string;
  score: number;
}

export interface MasteryLineChartProps {
  data: DataPoint[];
  title: string;
  width?: number | string;
  height?: number;
  lineColor?: string;
  areaGradientStart?: string;
  areaGradientEnd?: string;
}
