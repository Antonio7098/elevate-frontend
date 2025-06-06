import React from 'react';
import styles from './StatsPage.module.css';

const StatsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Statistics</h1>
      <div className={styles.card}>
        <p className={styles.text}>Your statistics and analytics will be displayed here.</p>
      </div>
    </div>
  );
};

export default StatsPage;
