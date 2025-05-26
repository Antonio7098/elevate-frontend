import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiFolder, FiBook } from 'react-icons/fi';
import type { ChatMessage as ChatMessageType, ChatContext } from '../services/chatService';
import { sendMessageToAI } from '../services/chatService';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        text: aiResponse,
        timestamp: new Date(),
      };
      
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
              <FiFolder size={18} />
            </span>
            <select 
              className="bg-slate-800 text-sm rounded px-3 py-1 text-slate-200"
              value={context.folderId || ''}
              onChange={(e) => setContext(prev => ({ 
                ...prev, 
                folderId: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
            >
              <option value="">All Folders</option>
              {/* Add dynamic folder options here */}
            </select>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="flex-shrink-0 text-slate-400">
              <FiBook size={18} />
            </span>
            <select 
              className="bg-slate-800 text-sm rounded px-3 py-1 text-slate-200"
              value={context.questionSetId || ''}
              onChange={(e) => setContext(prev => ({ 
                ...prev, 
                questionSetId: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
            >
              <option value="">All Question Sets</option>
              {/* Add dynamic question set options here */}
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
