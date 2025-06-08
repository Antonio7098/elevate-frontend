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

  const getMasteryPercentage = (item: RecentProgressSet) => {
    if (typeof item.currentTotalMasteryScore === 'number' && !isNaN(item.currentTotalMasteryScore)) {
      return Math.round(item.currentTotalMasteryScore);
    }
    if (typeof item.masteryScore === 'number' && !isNaN(item.masteryScore)) {
      return Math.round(item.masteryScore);
    }
    return 0;
  };

  const getMasteryLevel = (percentage: number) => {
    if (percentage >= 80) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  return (
    <div className={styles.widgetBox}>
      <h3 className={styles.title}>Recent Progress</h3>
      <ul className={styles.list}>
        {recentProgress.map((item) => {
          const masteryPercentage = getMasteryPercentage(item);
          const masteryLevel = getMasteryLevel(masteryPercentage);
          
          return (
            <li key={item.id} className={styles.listItem}>
              <div className={styles.content}>
                <div className={styles.setName}>{item.name}</div>
                <div className={styles.meta}>
                  <div className={`${styles.mastery} ${styles[`mastery-${masteryLevel}`]}`}>
                    {masteryPercentage}%
                  </div>
                  <div className={styles.reviewedAt}>
                    {new Date(item.lastReviewedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentProgressWidget;
