import React from 'react';
import styles from './UUEScoresWidget.module.css';
import type { UUEScores } from '../../types/stats.types';

interface UUEScoresWidgetProps {
  scores: UUEScores | undefined; // Allow undefined if data might not be available
}

const UUEScoresWidget: React.FC<UUEScoresWidgetProps> = ({ scores }) => {
  if (!scores) {
    return <p>UUE scores are not available.</p>;
  }

  return (
    <div className={styles.widgetContainer}>
      <h4 className={styles.widgetTitle}>UUE Scores</h4>
      <ul className={styles.scoresList}>
        <li className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Understand:</span>
          <span className={styles.scoreValue}>{scores.understandScore.toFixed(2)}</span>
        </li>
        <li className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Use:</span>
          <span className={styles.scoreValue}>{scores.useScore.toFixed(2)}</span>
        </li>
        <li className={styles.scoreItem}>
          <span className={styles.scoreLabel}>Explore:</span>
          <span className={styles.scoreValue}>{scores.exploreScore.toFixed(2)}</span>
        </li>
      </ul>
      {/* TODO: Consider enhancing display with progress bars or small gauges if desired */}
    </div>
  );
};

export default UUEScoresWidget;
