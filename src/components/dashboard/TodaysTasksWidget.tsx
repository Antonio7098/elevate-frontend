import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DueTodaySet } from '../../types/dashboard.types';
import styles from './TodaysTasksWidget.module.css';

interface TodaysTasksWidgetProps {
  dueToday: DueTodaySet[];
}

const TodaysTasksWidget: React.FC<TodaysTasksWidgetProps> = ({ dueToday }) => {
  const navigate = useNavigate();

  if (!dueToday || dueToday.length === 0) {
    return (
      <div className={styles.widgetBox}>
        <h3 className={styles.title}>Today's Tasks</h3>
        <p className={styles.empty}>No tasks due today! 🎉</p>
      </div>
    );
  }

  const handleCardClick = (folderId: string | number, setId: string | number) => {
    navigate(`/review/${folderId}/${setId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, folderId: string | number, setId: string | number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(folderId, setId);
    }
  };

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
              aria-label={`Review ${set.name}`}
              title={`Review ${set.name}`}
              onClick={() => handleCardClick(set.folderId, set.id)}
              onKeyDown={(e) => handleKeyDown(e, set.folderId, set.id)}
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
