export interface DataPoint {
  timestamp: string;
  score?: number;
  aggregatedScore?: number; // The actual score field used in the data
  totalMasteryScore?: number; // Used by question sets
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
