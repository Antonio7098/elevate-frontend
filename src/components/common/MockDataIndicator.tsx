import React from 'react';
import styles from './MockDataIndicator.module.css';

interface MockDataIndicatorProps {
  className?: string;
}

const MockDataIndicator: React.FC<MockDataIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.mockDataIndicator} ${className}`}>
      <div className={styles.icon}>🧪</div>
      <span className={styles.text}>Mock Data</span>
    </div>
  );
};

export default MockDataIndicator;





