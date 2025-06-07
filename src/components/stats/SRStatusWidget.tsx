import React from 'react';
import styles from './SRStatusWidget.module.css';
import type { SRStatus } from '../../types/stats.types';

interface SRStatusWidgetProps {
  status: SRStatus | undefined; // Allow undefined if data might not be available
}

const SRStatusWidget: React.FC<SRStatusWidgetProps> = ({ status }) => {
  if (!status) {
    return <p>Spaced Repetition status is not available.</p>;
  }

  return (
    <div className={styles.widgetContainer}>
      <h4 className={styles.widgetTitle}>Spaced Repetition Status</h4>
      <ul className={styles.statusList}>
        <li className={styles.statusItem}>
          <span className={styles.statusLabel}>Last Reviewed:</span>
          <span className={styles.statusValue}>{status.lastReviewedAt ? new Date(status.lastReviewedAt).toLocaleDateString() : 'N/A'}</span>
        </li>
        <li className={styles.statusItem}>
          <span className={styles.statusLabel}>Next Review:</span>
          <span className={styles.statusValue}>{status.nextReviewAt ? new Date(status.nextReviewAt).toLocaleDateString() : 'N/A'}</span>
        </li>
        <li className={styles.statusItem}>
          <span className={styles.statusLabel}>Current Interval:</span>
          <span className={styles.statusValue}>{status.currentIntervalDays} days</span>
        </li>
        <li className={styles.statusItem}>
          <span className={styles.statusLabel}>Forgotten %:</span>
          <span className={styles.statusValue}>{status.currentForgottenPercentage.toFixed(2)}%</span>
        </li>
      </ul>
    </div>
  );
};

export default SRStatusWidget;
