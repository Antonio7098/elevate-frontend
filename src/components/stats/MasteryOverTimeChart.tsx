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
  console.log('[MasteryOverTimeChart] Incoming data:', data);
  console.log('[MasteryOverTimeChart] Data type:', typeof data);
  console.log('[MasteryOverTimeChart] Data length:', data?.length);
  console.log('[MasteryOverTimeChart] First data point:', data?.[0]);
  
  if (!data || data.length === 0) {
    return <p>No mastery history data available to display chart.</p>;
  }

  // Check if any data point is missing aggregatedScore
  const missingAggregatedScore = data.some(point => typeof point.aggregatedScore !== 'number');

  // Format data for the chart, especially the timestamp for the XAxis
  const chartData = data.map(point => {
    return {
      ...point,
      formattedTimestamp: new Date(point.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: typeof point.aggregatedScore === 'number' ? point.aggregatedScore : null,
    };
  });
  console.log('[MasteryOverTimeChart] Formatted chartData:', chartData);

  if (missingAggregatedScore) {
    return <p style={{ color: 'red' }}>Some mastery history points are missing <b>aggregatedScore</b>. Please check your backend/data seed.</p>;
  }

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
          <XAxis dataKey="formattedTimestamp" padding={{ left: 20, right: 20 }} />
          <YAxis domain={[0, 100]} label={{ value: 'Mastery Score (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value: any) => { // Use 'any' here to bypass overly strict Recharts ValueType, or be more specific if needed
            if (typeof value === 'number') {
              return [`${value.toFixed(2)}%`, 'Mastery'];
            }
            // Handle cases where 'value' might be null (our specific case for invalid scores)
            // or other types that Recharts might pass if the dataKey was different.
            // For 'score', we've mapped invalid to null, so checking for null is also useful.
            if (value === null || value === undefined) {
                return ['N/A', 'Mastery'];
            }
            // Fallback for other unexpected types, though for 'score' it should be number or null.
            return [`${String(value)}`, 'Mastery']; 
          }}
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
