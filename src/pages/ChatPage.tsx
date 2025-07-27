import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ChatPage.module.css';
import { FiSend, FiFolder, FiBook, FiLoader } from 'react-icons/fi';
import { sendMessageToAI, type ChatContext } from '../services/chatService';
import { getFolders } from '../services/folderService';
import { getQuestionSets } from '../services/questionSetService';
import { getNotesForFolder } from '../services/noteService';
import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';
import type { Note } from '../types/note.types';
import type { ChatMessage as ChatMessageType } from '../services/chatService';
import type { SuggestionDataItem } from 'react-mentions';
import { MentionsInput, Mention } from 'react-mentions';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => (
  <div className={`${styles.messageWrapper} ${styles[message.sender]}`}>
    <div className={`${styles.message} ${styles[message.sender]}`}>
      <p>{message.text}</p>
    </div>
    {message.sender !== 'system' && (
      <p className={styles.messageTimestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    )}
  </div>
);

const ChatPage: React.FC = () => {
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
  const [notes, setNotes] = useState<Note[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This is the correct way to style the react-mentions input
  const mentionsInputStyle = {
    control: {
      backgroundColor: 'var(--color-surface)',
      fontSize: '1rem',
      fontWeight: '400',
      borderRadius: '1.25rem', // Soft, rounded corners
      border: '1px solid var(--color-border)', // Re-add a subtle border
      boxShadow: 'var(--shadow-sm)', // Keep a subtle shadow
    },
    '&multiLine': {
      control: {
        fontFamily: 'inherit',
        minHeight: '70px', // Increase the height
      },
      highlighter: {
        padding: '1.2rem 1.5rem',
        border: 'none',
      },
      input: {
        padding: '1.2rem 1.5rem',
        color: 'var(--color-text-base)',
        outline: 'none',
      },
    },
    suggestions: {
      list: {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
      },
      item: {
        padding: '10px 15px',
        '&focused': {
          backgroundColor: 'var(--color-surface-hover)',
        },
      },
    },
  };

  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        // First fetch all folders
        const fetchedFolders = await getFolders();
        
        // Then fetch all subfolders for each folder
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
      } finally {
        setIsLoadingFolders(false);
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

    setIsLoadingQuestionSets(true);
    try {
      const fetchedQuestionSets = await getQuestionSets(folderId);
      setQuestionSets(fetchedQuestionSets);
    } catch (error) {
      console.error('Failed to fetch question sets:', error);
    } finally {
      setIsLoadingQuestionSets(false);
    }
  }, []);

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
    if (context.folderId) {
      fetchQuestionSets(context.folderId);
      fetchNotes(context.folderId);
    } else {
      setQuestionSets([]);
      setNotes([]);
    }
  }, [context.folderId, fetchQuestionSets, fetchNotes]);

  useEffect(() => {
    // This effect is kept for potential future use
  }, [folders, questionSets, notes]);

  const searchSuggestions = useCallback((query: string, callback: (suggestions: Array<{ id: string; display: string; type: string }>) => void) => {
    if (!query || query.trim() === '') {
      callback([]);
      return;
    }

    const queryLower = query.toLowerCase();
    
    const allSuggestions = [
      ...folders.map(f => ({
        id: `folder:${f.id}`,
        display: f.parentId ? `${folders.find(pf => pf.id === f.parentId)?.name} > ${f.name}` : f.name,
        type: 'folder'
      })),
      ...questionSets.map(qs => ({
        id: `questionset:${qs.id}`,
        display: qs.name,
        type: 'questionSet'
      })),
      ...notes.map(n => ({
        id: `note:${n.id}`,
        display: n.title,
        type: 'note'
      }))
    ];

    const filtered = allSuggestions
      .filter(item => item.display.toLowerCase().includes(queryLower))
      .map(item => ({
        ...item,
        relevance: item.display.toLowerCase().indexOf(queryLower)
      }))
      .filter(item => item.relevance !== -1)
      .sort((a, b) => a.relevance - b.relevance || a.display.localeCompare(b.display))
      .slice(0, 5)
      .map(({ id, display, type }) => ({ id, display, type }));

    callback(filtered);
  }, [folders, questionSets, notes]);

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const folderId = e.target.value;
    setContext({
      ...context,
      folderId: folderId || undefined,
      questionSetId: undefined,
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    setIsLoading(true);
  
    const mentionRegex = /@\[(.+?)\]\((.+?)\)/g;
    let plainText = input;
    let match;
    const newMessages: ChatMessageType[] = [];
    const newContext = { ...context };
  
    const allSuggestions: Array<{id: string; display: string; type: string}> = [
      ...folders.map(f => ({
        id: `folder:${f.id}`,
        display: f.parentId 
          ? `${folders.find(pf => pf.id === f.parentId)?.name} > ${f.name}`
          : f.name,
        type: 'folder'
      })),
      ...questionSets.map(qs => ({
        id: `questionset:${qs.id}`,
        display: qs.name,
        type: 'questionSet'
      })),
      ...notes.map(n => ({
        id: `note:${n.id}`,
        display: n.title,
        type: 'note'
      }))
    ];
    
    // Ensure all suggestions have a type
    const typedSuggestions = allSuggestions.map(suggestion => ({
      id: suggestion.id,
      display: suggestion.display,
      type: suggestion.type
    }));
    
    const suggestionMap = new Map<string, { id: string; display: string; type: string }>(typedSuggestions.map(s => [s.id, s]));
  
    // First pass: find context-setting mentions (folders, question sets, notes)
    while ((match = mentionRegex.exec(input)) !== null) {
      const [, , id] = match;
      const suggestion = suggestionMap.get(id);
  
      if (suggestion) {
        let systemMessageText = '';
        if (suggestion.type === 'folder') {
          newContext.folderId = suggestion.id;
          newContext.questionSetId = undefined; // Reset question set when folder changes
          systemMessageText = `Context set to folder: "${suggestion.display}"`;
        } else if (suggestion.type === 'questionSet') {
          // Ensure folder context is already set for the question set
          const parentFolder = folders.find(f => questionSets.some(qs => qs.id === suggestion.id && qs.folderId === f.id));
          if (parentFolder) {
            newContext.folderId = parentFolder.id;
            newContext.questionSetId = suggestion.id;
            systemMessageText = `Context set to question set: "${suggestion.display}"`;
          }
        } else if (suggestion.type === 'note') {
          newContext.noteId = suggestion.id;
          systemMessageText = `Referenced note: "${suggestion.display}"`;
        }

        if (systemMessageText) {
          newMessages.push({
            sender: 'system',
            text: systemMessageText,
            timestamp: new Date(),
          });
        }
      }
    }
    
    // Update context state if it has changed
    if (JSON.stringify(newContext) !== JSON.stringify(context)) {
      setContext(newContext);
    }

    // Clean the input for display and for the AI
    plainText = input.replace(mentionRegex, '$1');

    const userMessage: ChatMessageType = {
      sender: 'user',
      text: plainText,
      timestamp: new Date(),
    };
    newMessages.push(userMessage);

    setMessages(prev => [...prev, ...newMessages]);
    setInput('');

    try {
      if (plainText.trim()) {
        const aiResponse = await sendMessageToAI(plainText, newContext);
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
          <div className={styles.contextSelectors}>
            <div className={styles.contextSelector}>
              <FiFolder size={16} className={styles.contextIcon} />
              <select
                value={context.folderId || ''}
                onChange={handleFolderChange}
                disabled={isLoadingFolders}
              >
                <option value="">Select a Folder</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              {isLoadingFolders && <FiLoader size={16} className={`${styles.contextIcon} ${styles.loadingIcon}`} />}
            </div>
            <div className={styles.contextSelector}>
              <FiBook size={16} className={styles.contextIcon} />
              <select
                value={context.questionSetId || ''}
                onChange={(e) => setContext(prev => ({
                  ...prev,
                  questionSetId: e.target.value || undefined
                }))}
                disabled={isLoadingQuestionSets || !context.folderId}
              >
                <option value="">Select a Question Set</option>
                {questionSets.map(qs => (
                  <option key={qs.id} value={qs.id}>
                    {qs.name}
                  </option>
                ))}
              </select>
              {isLoadingQuestionSets && <FiLoader size={16} className={`${styles.contextIcon} ${styles.loadingIcon}`} />}
            </div>
          </div>
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
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <MentionsInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message, or use '@' to reference..."
            style={mentionsInputStyle}
          >
            <Mention
              trigger="@"
              data={searchSuggestions}
              markup="@[__display__](__id__)"
              displayTransform={(id, display) => `@${display}`}
              renderSuggestion={(suggestion: SuggestionDataItem, search: string, highlightedSearchTerm: string, index: number, focused: boolean) => {
                const displayText = String(suggestion.display || '');
                const searchText = String(search || '');
                const suggestionType = (suggestion as { type?: string }).type || 'unknown';
                const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const searchRegex = new RegExp(`(${escapedSearch})`, 'gi');
                const parts = displayText.split(searchRegex);
                return (
                  <div className={`${styles.suggestion} ${focused ? styles.focused : ''}`} key={suggestion.id}>
                    <span className={styles.suggestionType} data-type={suggestionType}>
                      {suggestionType === 'folder' ? '📁' : suggestionType === 'questionSet' ? '📚' : '📝'}
                    </span>
                    <span>
                      {parts.map((part, i) => 
                        part.toLowerCase() === searchText.toLowerCase() ? (
                          <span key={i} style={{ fontWeight: 'bold' }}>{part}</span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </span>
                  </div>
                );
              }}
              className={styles.mention}
              appendSpaceOnAdd={true}
            />
          </MentionsInput>
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <FiLoader className={styles.loadingSpinner} /> : <FiSend />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
