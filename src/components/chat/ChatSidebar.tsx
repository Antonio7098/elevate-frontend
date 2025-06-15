import React from 'react';
import styles from './ChatSidebar.module.css';

interface ChatSidebarProps {
  noteId: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ noteId }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Chat</h2>
      </div>
      <div className={styles.content}>
        {/* Chat implementation will be added in a future sprint */}
        <p>Chat functionality coming soon...</p>
      </div>
    </div>
  );
}; 