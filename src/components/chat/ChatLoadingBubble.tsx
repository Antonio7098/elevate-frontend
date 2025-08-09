import React from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import styles from './ChatSidebar.module.css';
import TextWaveEffect from '../TextWaveEffect';

interface ChatLoadingBubbleProps {
  message?: string;
  useWave?: boolean;
}

const ChatLoadingBubble: React.FC<ChatLoadingBubbleProps> = ({ message = 'Thinking about your question…', useWave = true }) => {
  return (
    <div className={`${styles.messageWrapper} ${styles.ai}`}>
      <div className={`${styles.message} ${styles.ai}`}>
        <div className={styles.thinkingRow}>
          <RiRobot2Line size={18} className={styles.thinkingIcon} />
          {useWave ? (
            <TextWaveEffect text={message} color="#6b7280" effect="clip" />
          ) : (
            <span>{message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLoadingBubble;
