import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from '../pages/ChatPage.module.css';
import { FiSend, FiFolder, FiBook, FiLoader } from 'react-icons/fi';
import { sendMessageToAI, type ChatMessage as ChatMessageType, type ChatContext } from '../services/chatService';
import { getFolders } from '../services/folderService';
import { getQuestionSets } from '../services/questionSetService';
import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => (
  <div className={message.sender === 'user' ? styles.messageUser : styles.messageAi}>
    <div className={styles.message}>
      <p className={styles.message}>{message.text}</p>
      <p className={styles.messageTimestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({
    includeUserInfo: true,
    includeContentAnalysis: true
  });
  const [folders, setFolders] = useState<Folder[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isLoadingQuestionSets, setIsLoadingQuestionSets] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const fetchedFolders = await getFolders();
        setFolders(fetchedFolders);
      } catch {
        console.error('Failed to fetch folders:', error);
      } finally {
        setIsLoadingFolders(false);
      }
    };
    fetchFolders();
  }, []);

  const fetchQuestionSets = useCallback(async (folderId: string) => {
    if (!folderId) {
      setQuestionSets([]);
      setContext(prev => ({ ...prev, questionSetId: undefined }));
      return;
    }
    setIsLoadingQuestionSets(true);
    try {
      const fetchedQuestionSets = await getQuestionSets(folderId);
      setQuestionSets(fetchedQuestionSets);
    } catch {
      console.error('Failed to fetch question sets:', error);
    } finally {
      setIsLoadingQuestionSets(false);
    }
  }, []);

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const folderId = e.target.value || '';
    const newContext = {
      ...context,
      folderId: folderId || undefined,
      questionSetId: undefined
    };
    setContext(newContext);
    if (folderId) {
      fetchQuestionSets(folderId);
    } else {
      setQuestionSets([]);
    }
  };

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
      const currentContext = {
        ...context,
        folderId: context.folderId || undefined,
        questionSetId: context.questionSetId || undefined,
        includeUserInfo: true,
        includeContentAnalysis: true
      };
      const aiResponse = await sendMessageToAI(input, currentContext);
      if (aiResponse.context) {
        const updatedContext = {
          ...context,
          ...aiResponse.context
        };
        setContext(updatedContext);
      }
      const aiMessage: ChatMessageType = {
        sender: 'ai',
        text: aiResponse.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
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
    <div className={styles.panelContainer}>
      <div className={styles.headerSmall}>AI Chat</div>
      <div className={styles.contextSelector}>
        <span>{isLoadingFolders ? <FiLoader size={16} /> : <FiFolder size={16} />}</span>
        <select
          className={styles.input}
          value={context.folderId || ''}
          onChange={handleFolderChange}
          disabled={isLoadingFolders}
        >
          <option value="">All Folders</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
        <span>{isLoadingQuestionSets ? <FiLoader size={16} /> : <FiBook size={16} />}</span>
        <select
          className={styles.input}
          value={context.questionSetId || ''}
          onChange={e => setContext(prev => ({ ...prev, questionSetId: e.target.value || undefined }))}
          disabled={isLoadingQuestionSets || !context.folderId}
        >
          <option value="">All Question Sets</option>
          {questionSets.map(qs => (
            <option key={qs.id} value={qs.id}>{qs.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.messagesPanel}>
        {messages.length === 0 ? (
          <div className={styles.messageAi}>
            <p>Start a conversation with the AI assistant</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className={styles.inputRowPanel}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={styles.sendBtn}
        >
          {isLoading ? <FiLoader size={16} /> : <FiSend size={16} />}
        </button>
      </form>
    </div>
  );
};

export default ChatPanel; 