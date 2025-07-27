import React from 'react';
import type { OverallStats } from '../../types/dashboard.types';
import styles from './StatsSummaryWidget.module.css';

interface StatsSummaryWidgetProps {
  overallStats: OverallStats | null;
}

const StatsSummaryWidget: React.FC<StatsSummaryWidgetProps> = ({ overallStats }) => {
  if (!overallStats) {
    return (
      <div className="card">
        <h3 className={styles.title}>Stats Summary</h3>
        <p className={styles.empty}>No stats available yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className={styles.title}>Stats Summary</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Sets Mastered</div>
          <div className={styles.statValue}>{overallStats.setsMastered}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Avg. Mastery</div>
          <div className={styles.statValue}>{overallStats.averageMastery}%</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Study Streak</div>
          <div className={styles.statValue}>{overallStats.studyStreak} days</div>
        </div>
      </div>
      <div className={styles.statsFooter}>
        <a href="/stats" className={styles.statsLink}>
          View Full Statistics
        </a>
      </div>
    </div>
  );
};

export default StatsSummaryWidget;
