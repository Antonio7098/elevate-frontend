import React from 'react';
import styles from './SegmentedProgressBar.module.css';

interface Segment {
  value: number;
  color: string;
  label: string;
}

interface SegmentedProgressBarProps {
  segments: Segment[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  segments,
  height = 8,
  showLabels = true,
  showValues = true,
  className = '',
}) => {
  // Calculate total value for percentage calculations
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);
  
  // Don't render if no segments or total is zero
  if (segments.length === 0 || totalValue === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.progressBar} style={{ height }}>
          <div 
            className={styles.progressSegment} 
            style={{
              width: '100%',
              backgroundColor: '#e5e7eb',
            }}
          />
        </div>
        {showLabels && (
          <div className={styles.labels}>
            <span>No data available</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.progressBar} style={{ height }}>
        {segments.map((segment, index) => {
          const widthPercent = (segment.value / totalValue) * 100;
          return (
            <div
              key={index}
              className={styles.progressSegment}
              style={{
                width: `${widthPercent}%`,
                backgroundColor: segment.color,
                borderTopRightRadius: index === segments.length - 1 ? '4px' : '0',
                borderBottomRightRadius: index === segments.length - 1 ? '4px' : '0',
                borderTopLeftRadius: index === 0 ? '4px' : '0',
                borderBottomLeftRadius: index === 0 ? '4px' : '0',
              }}
              title={`${segment.label}: ${segment.value}%`}
            />
          );
        })}
      </div>
      
      {(showLabels || showValues) && (
        <div className={styles.labels}>
          {segments.map((segment, index) => (
            <div key={index} className={styles.labelItem}>
              {showLabels && (
                <div className={styles.labelWrapper}>
                  <span 
                    className={styles.colorDot} 
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className={styles.labelText}>
                    {segment.label}
                  </span>
                </div>
              )}
              {showValues && (
                <span className={styles.value}>
                  {segment.value}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper component specifically for UUE scores
export const UUESegmentedProgressBar: React.FC<{
  understandScore: number;
  useScore: number;
  exploreScore: number;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}> = ({ 
  understandScore, 
  useScore, 
  exploreScore, 
  height = 8,
  showLabels = true,
  showValues = true,
  className = '' 
}) => {
  const segments = [
    {
      value: understandScore,
      color: '#4f46e5', // Indigo
      label: 'Understand',
    },
    {
      value: useScore,
      color: '#06b6d4', // Cyan
      label: 'Use',
    },
    {
      value: exploreScore,
      color: '#8b5cf6', // Violet
      label: 'Explore',
    },
  ];

  return (
    <SegmentedProgressBar
      segments={segments}
      height={height}
      showLabels={showLabels}
      showValues={showValues}
      className={className}
    />
  );
};

export default SegmentedProgressBar;
