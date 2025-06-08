import React from 'react';
import styles from './CircularProgress.module.css';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  textColor?: string;
  showPercentage?: boolean;
  label?: string;
  onClick?: () => void;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 80,
  strokeWidth = 6,
  circleColor = '#4f46e5',
  textColor = '#111827',
  showPercentage = true,
  label,
  onClick,
}) => {
  // Ensure percentage is between 0 and 100
  const progress = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const viewBox = `0 0 ${size} ${size}`;
  const center = size / 2;

  return (
    <div 
      className={`${styles.circularProgress} ${onClick ? styles.clickable : ''}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <svg className={styles.circularChart} viewBox={viewBox}>
        <circle
          className={styles.circleBg}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={styles.circle}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            stroke: circleColor,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.6s ease 0s',
          }}
        />
        {showPercentage && (
          <text
            x={center}
            y={center}
            className={styles.percentage}
            style={{ fill: textColor }}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {Math.round(progress)}%
          </text>
        )}
      </svg>
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
};

export default CircularProgress;
