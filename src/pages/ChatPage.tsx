

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ChatPage.module.css';
import { FiFolder, FiBook, FiSettings } from 'react-icons/fi';
import { sendMessageToAI, type ChatContext } from '../services/chatService';
import { getFolders } from '../services/folderService';
import { getQuestionSets } from '../services/questionSetService';
import { getNotesForFolder } from '../services/noteService';
import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';
import type { Note } from '../types/note.types';
import type { ChatMessage as ChatMessageType } from '../services/chatService';
import TemporaryInput from '../components/chat/TemporaryInput';
import ModeSelector from '../components/chat/ModeSelector/ModeSelector';
import AdvancedSettings from '../components/chat/AdvancedSettings';
import TypingIndicator from '../components/chat/TypingIndicator';
import MessageWithActions from '../components/chat/MessageWithActions';
import EnhancedChatInput from '../components/chat/EnhancedChatInput';

interface ContextItem {
  id: string;
  type: 'folder' | 'questionSet';
  name: string;
}

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const handleActionAccept = (actionId: string) => {
    console.log(`Accepted action: ${actionId}`);
    // Here you would implement the actual action execution
  };

  const handleActionReject = (actionId: string) => {
    console.log(`Rejected action: ${actionId}`);
    // Here you would implement action rejection handling
  };

  return (
    <div className={`${styles.messageWrapper} ${styles[message.sender]}`}>
      <div className={`${styles.message} ${styles[message.sender]}`}>
        {message.sender === 'ai' ? (
          <MessageWithActions
            message={message.text}
            onActionAccept={handleActionAccept}
            onActionReject={handleActionReject}
          />
        ) : (
          message.text
        )}
      </div>
      <div className={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      sender: 'ai',
      text: 'I\'ll help you create a new component for your project. I\'ve created the file `UserProfile.tsx` with the basic structure you requested. I\'ve also updated the existing `App.tsx` file to include the new component and modified `styles.css` to add the necessary styling.',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({
    includeUserInfo: true,
    includeContentAnalysis: true
  });
  const [folders, setFolders] = useState<Folder[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedContextItems, setSelectedContextItems] = useState<ContextItem[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchNotes = useCallback(async (folderId: string) => {
    if (!folderId) {
      setNotes([]);
      return;
    }

    try {
      const fetchedNotes = await getNotesForFolder(folderId);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, []);

  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        const fetchedFolders = await getFolders();
        
        // For each folder, fetch its subfolders
        const foldersWithSubfolders = await Promise.all(
          fetchedFolders.map(async (folder) => {
            try {
              const subfolders = await getFolders(folder.id);
              return [folder, ...subfolders];
            } catch (error) {
              console.error(`Failed to fetch subfolders for folder ${folder.id}:`, error);
              return [folder];
            }
          })
        );
        
        // Flatten the array of arrays into a single array of folders
        const allFolders = foldersWithSubfolders.flat();
        setFolders(allFolders);
      } catch (error) {
        console.error('Failed to fetch folders:', error);
      }
    };

    fetchAllFolders();
  }, []);

  const fetchQuestionSets = useCallback(async (folderId: string) => {
    if (!folderId) {
      setQuestionSets([]);
      setContext(prev => ({ ...prev, questionSetId: undefined }));
      return;
    }

    try {
      const fetchedQuestionSets = await getQuestionSets(folderId);
      setQuestionSets(fetchedQuestionSets);
    } catch (error) {
      console.error('Failed to fetch question sets:', error);
    }
  }, []);

  useEffect(() => {
    if (context.folderId) {
      fetchQuestionSets(context.folderId);
      fetchNotes(context.folderId);
    } else {
      setQuestionSets([]);
      setNotes([]);
    }
  }, [context.folderId, fetchQuestionSets, fetchNotes]);

  // Auto-scroll when messages change or when loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;
  
    setIsLoading(true);
  
    const userMessage: ChatMessageType = {
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      if (message.trim()) {
        const aiResponse = await sendMessageToAI(message, context);
        const aiMessage: ChatMessageType = {
          sender: 'ai',
          text: aiResponse.response, // Fixed: Using 'response' instead of 'text'
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (_error) {
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

  // Export the component as default to fix the unused warning
  return (
    <div className={styles.chatPage} data-testid="chat-page">
      <div className={styles.chatContainer}>
        <div className={styles.contextHeader}>
          <div className={styles.contextSummary}>
            {/* Context summary will be shown here */}
            {context.folderId && (
              <span className={styles.contextItem}>
                <FiFolder size={14} /> {folders.find(f => f.id === context.folderId)?.name || 'Folder'}
              </span>
            )}
            {context.questionSetId && (
              <span className={styles.contextItem}>
                <FiBook size={14} /> {questionSets.find(qs => qs.id === context.questionSetId)?.name || 'Question Set'}
              </span>
            )}
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className={styles.settingsButton}>
            <FiSettings />
          </button>
        </div>

        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <h1>AI Assistant</h1>
              <p>Start a conversation by typing your message below.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))
          )}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <EnhancedChatInput 
          onSendMessage={(message, mode, attachments) => {
            console.log('Mode:', mode, 'Attachments:', attachments);
            handleSendMessage(message);
          }}
          isLoading={isLoading}
          placeholder="Type message here"
        />
      </div>
      <AdvancedSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        folders={folders}
        questionSets={questionSets}
        selectedContextItems={selectedContextItems}
        onContextItemsChange={setSelectedContextItems}
      />
    </div>
  );
};

export default ChatPage;
