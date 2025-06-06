import React from 'react';
import type { RecentProgressSet } from '../../types/dashboard.types';
import styles from './RecentProgressWidget.module.css';

interface RecentProgressWidgetProps {
  recentProgress: RecentProgressSet[];
}

const RecentProgressWidget: React.FC<RecentProgressWidgetProps> = ({ recentProgress }) => {
  if (!recentProgress || recentProgress.length === 0) {
    return (
      <div className={styles.widgetBox}>
        <h3 className={styles.title}>Recent Progress</h3>
        <p className={styles.empty}>No recent progress yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.widgetBox}>
      <h3 className={styles.title}>Recent Progress</h3>
      <ul className={styles.list}>
        {recentProgress.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <div className={styles.setName}>{item.name}</div>
            <div className={styles.mastery}>
  Mastery: <span className={styles.masteryScore}>
    {typeof item.currentTotalMasteryScore === 'number' && !isNaN(item.currentTotalMasteryScore)
      ? `${Math.round(item.currentTotalMasteryScore)}%`
      : (typeof item.masteryScore === 'number' && !isNaN(item.masteryScore)
        ? `${Math.round(item.masteryScore)}%`
        : 'N/A')}
  </span>
</div>
            <div className={styles.reviewedAt}>{item.reviewedAtLabel || item.reviewedAt}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentProgressWidget;
