
import { useState, useRef, useEffect } from 'react';
import { getChatHistory } from '../../services/chatService';
import styles from './ChatSidebar.module.css';
import { FiSend } from 'react-icons/fi';
import { sendMessageToAI, type ChatMessage as ChatMessageType } from '../../services/chatService';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => (
  <div className={`${styles.messageWrapper} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}>
    <div className={styles.messageContent}>
      <p>{message.text}</p>
      <span className={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  </div>
);

interface ChatSidebarProps {
  noteId: string;
}

export const ChatSidebar = ({ noteId }: ChatSidebarProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
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
        // Optionally, show an error message in the chat
        const errorMessage: ChatMessageType = {
          sender: 'ai',
          text: 'Could not load chat history.',
          timestamp: new Date(),
        };
        setMessages([errorMessage]);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [noteId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
      const errorMessage: ChatMessageType = {
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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
          messages.map((msg, index) => <ChatMessage key={index} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          disabled={isLoading}
        />
        <button type="submit" disabled={!input.trim() || isLoading} className={styles.sendButton}>
          {isLoading ? (
            <div className={styles.spinner}></div>
          ) : (
            <FiSend />
          )}
        </button>
      </form>
    </div>
  );
}; 