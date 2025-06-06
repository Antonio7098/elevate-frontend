import React from 'react';
import type { DueTodaySet } from '../../types/dashboard.types';
import styles from './TodaysTasksWidget.module.css';

interface TodaysTasksWidgetProps {
  dueToday: DueTodaySet[];
}

const TodaysTasksWidget: React.FC<TodaysTasksWidgetProps> = ({ dueToday }) => {
  if (!dueToday || dueToday.length === 0) {
    return (
      <div className={styles.widgetBox}>
        <h3 className={styles.title}>Today's Tasks</h3>
        <p className={styles.empty}>No tasks due today! 🎉</p>
      </div>
    );
  }

  return (
    <div className={styles.widgetBox}>
      <h3 className={styles.title}>Today's Tasks</h3>
      <div className={styles.cardsContainer}>
        {dueToday.map((set) => {
          const isCritical = set.isCritical || false; // You can refine this logic
          return (
            <div
              key={set.id}
              className={isCritical ? styles.cardCritical : styles.cardStandard}
              tabIndex={0}
              role="button"
              title={`Review ${set.name}`}
              onClick={() => window.location.href = `/review/${set.id}`}
            >
              <div className={styles.setName}>{set.name}</div>
              <div className={styles.dueInfo}>{set.dueLabel || 'Due now'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysTasksWidget;
