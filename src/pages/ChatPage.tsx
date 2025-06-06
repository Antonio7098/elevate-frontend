import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ChatPage.module.css';
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
    <div className={styles.message}
    >
      <p className={styles.message}>{message.text}</p>
      <p className={styles.messageTimestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for context selection
  const [context, setContext] = useState<ChatContext>({
    includeUserInfo: true,
    includeContentAnalysis: true
  });
  const [folders, setFolders] = useState<Folder[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isLoadingQuestionSets, setIsLoadingQuestionSets] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch folders on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const fetchedFolders = await getFolders();
        setFolders(fetchedFolders);
      } catch (error) {
        console.error('Failed to fetch folders:', error);
        // Optionally show error to user
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  }, []);

  // Fetch question sets when folder is selected
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
    } catch (error) {
      console.error('Failed to fetch question sets:', error);
      // Optionally show error to user
    } finally {
      setIsLoadingQuestionSets(false);
    }
  }, []);

  // Handle folder selection change
  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const folderId = e.target.value || '';
    const newContext = {
      ...context,
      folderId: folderId || undefined,
      questionSetId: undefined // Reset question set when folder changes
    };
    
    // Update context state
    setContext(newContext);
    console.log('Updated context with folder selection:', newContext);
    
    if (folderId) {
      fetchQuestionSets(folderId);
    } else {
      setQuestionSets([]);
    }
  };

  // Auto-scroll to bottom when messages change
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

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Ensure we have the latest context with folder and question set IDs
      const currentContext = {
        ...context,
        // Explicitly include these to ensure they're not undefined
        folderId: context.folderId || undefined,
        questionSetId: context.questionSetId || undefined,
        includeUserInfo: true,
        includeContentAnalysis: true
      };
      
      console.log('Sending message with context:', currentContext);
      
      // Get AI response with enhanced context
      const aiResponse = await sendMessageToAI(input, currentContext);
      
      // Store any updated context from the response
      if (aiResponse.context) {
        const updatedContext = {
          ...context,
          ...aiResponse.context
        };
        setContext(updatedContext);
        console.log('Updated context from AI response:', updatedContext);
      }
    
    const aiMessage: ChatMessageType = {
      sender: 'ai',
      text: aiResponse.response,
      timestamp: new Date(),
    };
    
    // Update context if server returned a new one
    if (aiResponse.context) {
      setContext(prev => ({
        ...prev,
        ...aiResponse.context
      }));
    }
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Chat</h1>
        {/* Context Selector */}
        <div className={styles.contextSelector}>
          <div className={styles.contextSelector}>
            <span>
              {isLoadingFolders ? (
                <span className="animate-spin">
                  <FiLoader size={18} />
                </span>
              ) : (
                <FiFolder size={18} />
              )}
            </span>
            <select
              className={styles.input}
              value={context.folderId || ''}
              onChange={handleFolderChange}
              disabled={isLoadingFolders}
            >
              <option value="">All Folders</option>
              {isLoadingFolders ? (
                <option disabled>Loading folders...</option>
              ) : (
                folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className={styles.contextSelector}>
            <span>
              {isLoadingQuestionSets ? (
                <span className="animate-spin">
                  <FiLoader size={18} />
                </span>
              ) : (
                <FiBook size={18} />
              )}
            </span>
            <select
              className={styles.input}
              value={context.questionSetId || ''}
              onChange={(e) => setContext(prev => ({
                ...prev,
                questionSetId: e.target.value || undefined
              }))}
              disabled={isLoadingQuestionSets || !context.folderId}
            >
              <option value="">All Question Sets</option>
              {isLoadingQuestionSets ? (
                <option disabled>Loading question sets...</option>
              ) : (
                questionSets.map(qs => (
                  <option key={qs.id} value={qs.id}>
                    {qs.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Context Indicator */}
      {(context.folderId || context.questionSetId) && (
        <div className="mb-4 px-4 py-2 bg-indigo-900/30 border border-indigo-500/20 rounded-lg text-sm">
          <div className="flex items-center text-indigo-300">
            <span className="font-medium">AI Context:</span>
            <div className="ml-2 flex items-center space-x-2">
              {context.folderId && (
                <span className="bg-indigo-500/20 px-2 py-0.5 rounded text-xs flex items-center">
                  <span className="mr-1"><FiFolder size={12} /></span>
                  {folders.find(f => f.id === context.folderId)?.name || 'Selected Folder'}
                </span>
              )}
              {context.questionSetId && (
                <span className="bg-indigo-500/20 px-2 py-0.5 rounded text-xs flex items-center">
                  <span className="mr-1"><FiBook size={12} /></span>
                  {questionSets.find(qs => qs.id === context.questionSetId)?.name || 'Selected Question Set'}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-indigo-200/70 mt-1">
            The AI will provide responses tailored to your selected learning materials.
          </p>
        </div>
      )}
      
      {/* Messages Container */}
      <div className={styles.messages}>
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

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={styles.sendBtn}
        >
          {isLoading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <span style={{ marginRight: 8 }}>Send</span>
              <FiSend size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
