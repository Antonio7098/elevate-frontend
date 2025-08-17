import { useState, useRef, useEffect } from 'react';
import { getChatHistory } from '../../services/chatService';
import { streamingChatService, type ChatStatusUpdate, type ChatResponse } from '../../services/streamingChatService';
import styles from './ChatSidebar.module.css';
import EnhancedChatInput from './EnhancedChatInput';
import ChatMessageBubble from './ChatMessageBubble';
import TextWaveEffect from '../TextWaveEffect';

interface StreamingChatSidebarProps {
  noteId: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface PipelineStage {
  name: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: Record<string, any>;
  progress?: number;
}

export const StreamingChatSidebar = ({ noteId }: StreamingChatSidebarProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([
    { name: 'Query Transformation', status: 'pending' },
    { name: 'Context Assembly', status: 'pending' },
    { name: 'Response Generation', status: 'pending' }
  ]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<string>('');
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
  }, [messages, isStreaming]);

  const handleSendMessage = async (message: string, mode?: string, attachments?: File[]) => {
    if (!message.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    
    // Reset pipeline stages
    setPipelineStages([
      { name: 'Query Transformation', status: 'pending' },
      { name: 'Context Assembly', status: 'pending' },
      { name: 'Response Generation', status: 'pending' }
    ]);
    setOverallProgress(0);
    setCurrentStage('');

    try {
      await streamingChatService.sendMessageStream(message, {
        noteId,
        onStatusUpdate: (update: ChatStatusUpdate) => {
          handleStatusUpdate(update);
        },
        onResponse: (response: ChatResponse) => {
          handleResponse(response);
        },
        onError: (error) => {
          handleError(error);
        },
        onComplete: () => {
          handleComplete();
        },
        onProgress: (progress: number) => {
          setOverallProgress(progress);
        }
      });
    } catch (error) {
      console.error('Failed to start streaming chat:', error);
      handleError({
        type: 'error',
        error: 'Failed to start streaming chat',
        timestamp: Date.now()
      });
    }
  };

  const handleStatusUpdate = (update: ChatStatusUpdate) => {
    setCurrentStage(update.stage);
    
    // Update pipeline stages based on the status update
    setPipelineStages(prev => prev.map(stage => {
      if (stage.name.toLowerCase().includes(update.stage.toLowerCase()) || 
          update.stage.toLowerCase().includes(stage.name.toLowerCase())) {
        return {
          ...stage,
          status: update.status === 'started' ? 'active' : 
                 update.status === 'completed' ? 'completed' : 
                 update.status === 'error' ? 'error' : 'active',
          details: update.details,
          progress: update.progress
        };
      }
      return stage;
    }));
  };

  const handleResponse = (response: ChatResponse) => {
    const aiMessage: ChatMessage = {
      sender: 'ai',
      text: response.content,
      timestamp: new Date(),
      metadata: response.metadata
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleError = (error: any) => {
    const errorMessage: ChatMessage = {
      sender: 'ai',
      text: `Error: ${error.error || 'An error occurred'}`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, errorMessage]);
    setIsStreaming(false);
  };

  const handleComplete = () => {
    setIsStreaming(false);
    setOverallProgress(1);
    setCurrentStage('');
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'active':
        return '🔄';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'active':
        return '#3b82f6';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Note-Specific Chat</h2>
      </div>
      
      {/* Pipeline Status Display */}
      {isStreaming && (
        <div className={styles.pipelineStatus}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${overallProgress * 100}%` }}
            />
          </div>
          <div className={styles.stagesContainer}>
            {pipelineStages.map((stage, index) => (
              <div key={index} className={styles.stageItem}>
                <span className={styles.stageIcon} style={{ color: getStageColor(stage.status) }}>
                  {getStageIcon(stage.status)}
                </span>
                <span className={styles.stageName}>{stage.name}</span>
                {stage.status === 'active' && stage.details && (
                  <div className={styles.stageDetails}>
                    {Object.entries(stage.details).map(([key, value]) => (
                      <span key={key} className={styles.detailItem}>
                        {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {currentStage && (
            <div className={styles.currentStage}>
              Currently: {currentStage}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.messagesContainer}>
        {isHistoryLoading ? (
          <div className={styles.emptyState}>
            <div className={styles.spinner}></div>
            <TextWaveEffect text="Loading history..." color="#007bff" effect="gradient" />
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
                {msg.metadata && (
                  <div className={styles.messageMetadata}>
                    <span className={styles.metadataItem}>
                      Confidence: {msg.metadata.confidence_score?.toFixed(2) || 'N/A'}
                    </span>
                    <span className={styles.metadataItem}>
                      Type: {msg.metadata.response_type || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            ) : null
          ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className={styles.chatInputArea}>
        <EnhancedChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isStreaming}
          placeholder="Ask about this note..."
          fullWidth
        />
      </div>
    </div>
  );
};
