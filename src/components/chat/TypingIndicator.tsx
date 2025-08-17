import React from 'react';
import styles from './TypingIndicator.module.css';
import TextWaveEffect from '../TextWaveEffect';

const TypingIndicator: React.FC = () => {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
      
      {/* Minimal TextWaveEffect test */}
      <TextWaveEffect 
        text="AI is thinking..." 
        color="#ff0000" 
        effect="clip" 
        speed={2000}
      />
      
      {/* Plain text for comparison */}
      <span style={{ color: 'blue', fontSize: '16px' }}>
        Plain: AI is thinking...
      </span>
    </div>
  );
};

export default TypingIndicator;
