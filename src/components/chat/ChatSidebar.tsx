
import { useState, useRef, useEffect } from 'react';
import { getChatHistory } from '../../services/chatService';
import styles from './ChatSidebar.module.css';
import { sendMessageToAI, type ChatMessage as ChatMessageType } from '../../services/chatService';
import EnhancedChatInput from './EnhancedChatInput';
import ChatMessageBubble from './ChatMessageBubble';
import ChatLoadingBubble from './ChatLoadingBubble';
import TextWaveEffect from '../TextWaveEffect';

interface ChatSidebarProps {
  noteId: string;
}

export const ChatSidebar = ({ noteId }: ChatSidebarProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory(noteId);
        setMessages(history);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        setMessages([{ sender: 'ai', text: 'Could not load chat history.', timestamp: new Date() }]);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [noteId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (message: string, mode?: string, attachments?: File[]) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(userMessage.text, { noteId });
      const aiMessage: ChatMessageType = {
        sender: 'ai',
        text: aiResponse.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Note-Specific Chat</h2>
      </div>
      <div className={styles.messagesContainer}>
        {isHistoryLoading ? (
          <div className={styles.emptyState}>
            <div className={styles.spinner}></div>
            <p>Loading history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Ask questions about this note...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessageBubble
              key={index}
              sender={msg.sender}
              text={msg.sender === 'ai' ? '' : msg.text}
              timestamp={msg.timestamp}
            >
            </ChatMessageBubble>
          ))
        )}
        {/* Render AI messages with wave effect text overlay */}
        {!isHistoryLoading &&
          messages.map((msg, index) => (
            msg.sender === 'ai' ? (
              <div key={`ai-${index}`} className={`${styles.messageWrapper} ${styles.ai}`}>
                <div className={`${styles.message} ${styles.ai}`}>
                  <TextWaveEffect text={msg.text} color="#374151" effect="clip" />
                </div>
                <div className={styles.timestamp}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ) : null
          ))}
        {isLoading && <ChatLoadingBubble />}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatInputArea}>
        <EnhancedChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Ask about this note..."
          fullWidth
        />
      </div>
    </div>
  );
}; 