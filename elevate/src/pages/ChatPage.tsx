import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiFolder, FiBook, FiLoader } from 'react-icons/fi';
import { sendMessageToAI, type ChatMessage as ChatMessageType, type ChatContext } from '../services/chatService';
import { getFolders } from '../services/folderService';
import { getQuestionSetsByFolder } from '../services/questionSetService';
import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div 
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.sender === 'user' 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-slate-700 text-white rounded-bl-none'
      }`}
    >
      <p className="whitespace-pre-wrap">{message.text}</p>
      <p className="text-xs opacity-70 mt-1">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({});
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
      const fetchedQuestionSets = await getQuestionSetsByFolder(folderId);
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
    setContext(prev => ({
      ...prev,
      folderId: folderId || undefined,
      questionSetId: undefined // Reset question set when folder changes
    }));
    
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
      // Get AI response
      const aiResponse = await sendMessageToAI(input, context);
    
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
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">AI Chat</h1>
        
        {/* Context Selector */}
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="flex-shrink-0 text-slate-400">
              {isLoadingFolders ? (
                <span className="animate-spin">
                  <FiLoader size={18} />
                </span>
              ) : (
                <FiFolder size={18} />
              )}
            </span>
            <select 
              className="bg-slate-800 text-sm rounded px-3 py-1 text-slate-200 min-w-[150px]"
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
          
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="flex-shrink-0 text-slate-400">
              {isLoadingQuestionSets ? (
                <span className="animate-spin">
                  <FiLoader size={18} />
                </span>
              ) : (
                <FiBook size={18} />
              )}
            </span>
            <select 
              className="bg-slate-800 text-sm rounded px-3 py-1 text-slate-200 min-w-[150px]"
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
                    {qs.title}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-800 rounded-lg">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
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
      <form onSubmit={handleSendMessage} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="mr-2">Send</span>
                <FiSend size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
