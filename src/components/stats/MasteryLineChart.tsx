import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { MasteryLineChartProps } from './types.ts';
import styles from './MasteryLineChart.module.css';

const MasteryLineChart: React.FC<MasteryLineChartProps> = ({
  data,
  title,
  width = '100%',
  height = 300,
  lineColor = '#4f46e5',
  areaGradientStart = 'rgba(79, 70, 229, 0.1)',
  areaGradientEnd = 'rgba(79, 70, 229, 0.0)',
}) => {
  console.log('[MasteryLineChart] Received data:', data);
  console.log('[MasteryLineChart] Data length:', data?.length);
  console.log('[MasteryLineChart] Title:', title);
  console.log('[MasteryLineChart] First data point:', data?.[0]);
  
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.noData}>No data available</div>
      </div>
    );
  }

  // Convert scores to percentages (0-100)
  const percentData = data.map(point => {
    // Handle both aggregatedScore (folders) and totalMasteryScore (question sets)
    let score = 0;
    if (typeof point.aggregatedScore === 'number') {
      score = point.aggregatedScore;
    } else if (typeof point.totalMasteryScore === 'number') {
      score = point.totalMasteryScore;
    }
    
    return {
      ...point,
      score: Math.round(score)
    };
  });
  
  console.log('[MasteryLineChart] Processed percentData:', percentData);
  console.log('[MasteryLineChart] First processed point:', percentData[0]);

  // Format date for display
  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format tooltip date
  const formatTooltipDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipDate}>{formatTooltipDate(label)}</p>
          <p className={styles.tooltipScore}>
            Score: <strong>{payload[0].value}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={percentData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaGradientStart} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaGradientEnd} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MasteryLineChart;
