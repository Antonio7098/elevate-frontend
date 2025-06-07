import React from 'react';
import styles from './MasteryOverTimeChart.module.css';
import type { MasteryHistoryPoint } from '../../types/stats.types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MasteryOverTimeChartProps {
  data: MasteryHistoryPoint[];
  title?: string;
}

const MasteryOverTimeChart: React.FC<MasteryOverTimeChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <p>No mastery history data available to display chart.</p>;
  }

  // Format data for the chart, especially the timestamp for the XAxis
  const chartData = data.map(point => ({
    ...point,
    // Format timestamp for display on X-axis, e.g., 'MM/DD'
    // Recharts can also handle Date objects directly if preferred
    formattedTimestamp: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    // Ensure score is a number
    score: Number(point.score),
  }));

  return (
    <div className={styles.chartContainer}>
      {title && <h4 className={styles.chartTitle}>{title}</h4>}
      {!title && <h4 className={styles.chartTitle}>Mastery Over Time</h4>} {/* Default title if not provided */}
      {/* Adjusted height as padding is now in chartContainer */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedTimestamp" />
          <YAxis domain={[0, 100]} label={{ value: 'Mastery Score (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Mastery']}
            labelFormatter={(label: string) => `Date: ${label}`}
          />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} name="Mastery" unit="%" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

};

export default MasteryOverTimeChart;
