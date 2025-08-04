import React from 'react';
import styles from './TypingIndicator.module.css';

const TypingIndicator: React.FC = () => {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingDots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <span className={styles.typingText}>AI is thinking...</span>
    </div>
  );
};

export default TypingIndicator;
