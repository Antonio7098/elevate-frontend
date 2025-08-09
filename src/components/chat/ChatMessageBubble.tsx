import React from 'react';
import styles from './ChatSidebar.module.css';

export type ChatSender = 'user' | 'ai' | 'system';

interface ChatMessageBubbleProps {
  sender: ChatSender;
  text: string;
  timestamp?: Date | string;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ sender, text, timestamp }) => {
  const timeText = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;

  return (
    <div className={`${styles.messageWrapper} ${styles[sender]}`}>
      <div className={`${styles.message} ${styles[sender]}`}>{text}</div>
      {timeText && <div className={styles.timestamp}>{timeText}</div>}
    </div>
  );
};

export default ChatMessageBubble;
