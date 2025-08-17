export interface ChatStatusUpdate {
  type: 'status';
  stage: string;
  status: 'started' | 'in_progress' | 'completed' | 'error';
  timestamp: number;
  details?: Record<string, any>;
  progress?: number;
}

export interface ChatResponse {
  type: 'response';
  role: 'assistant';
  content: string;
  retrieved_context: Array<{
    source_id: string;
    content: string;
    locus_type: string;
    relevance_score: number;
    metadata: Record<string, any>;
  }>;
  metadata: {
    response_type: string;
    tone_style: string;
    confidence_score: number;
    factual_accuracy_score: number;
    context_quality_score: number;
    assembly_time_ms: number;
    generation_time_ms: number;
    total_context_tokens: number;
    response_tokens: number;
    sources_count: number;
    query_intent: string;
    query_expanded: string;
  };
}

export interface ChatError {
  type: 'error';
  error: string;
  timestamp: number;
}

export interface ChatComplete {
  type: 'complete';
  timestamp: number;
}

export type ChatEvent = ChatStatusUpdate | ChatResponse | ChatError | ChatComplete;

export interface StreamingChatOptions {
  noteId?: string;
  context?: Record<string, any>;
  onStatusUpdate?: (update: ChatStatusUpdate) => void;
  onResponse?: (response: ChatResponse) => void;
  onError?: (error: ChatError) => void;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

export class StreamingChatService {
  private eventSource: EventSource | null = null;
  private isConnected = false;

  async sendMessageStream(
    message: string,
    options: StreamingChatOptions = {}
  ): Promise<void> {
    try {
      // Close any existing connection
      this.closeConnection();

      // Prepare request payload
      const payload = {
        message_content: message,
        user_id: "1", // TODO: Get from auth context
        session_id: `session_${Date.now()}`,
        context: options.context || {},
        metadata: {},
        max_tokens: 1000,
        temperature: 0.7
      };

      // Create EventSource for Server-Sent Events
      const queryParams = new URLSearchParams({
        message_content: message,
        user_id: payload.user_id,
        session_id: payload.session_id,
        context: JSON.stringify(payload.context),
        metadata: JSON.stringify(payload.metadata),
        max_tokens: payload.max_tokens.toString(),
        temperature: payload.temperature.toString()
      });

      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/chat/message/stream?${queryParams}`;
      
      this.eventSource = new EventSource(url);
      this.isConnected = true;

      // Handle connection open
      this.eventSource.onopen = () => {
        console.log('Streaming chat connection opened');
      };

      // Handle incoming messages
      this.eventSource.onmessage = (event) => {
        try {
          const data: ChatEvent = JSON.parse(event.data);
          
          switch (data.type) {
            case 'status':
              this.handleStatusUpdate(data as ChatStatusUpdate, options);
              break;
            case 'response':
              this.handleResponse(data as ChatResponse, options);
              break;
            case 'error':
              this.handleError(data as ChatError, options);
              break;
            case 'complete':
              this.handleComplete(options);
              break;
            default:
              console.warn('Unknown chat event type:', data);
          }
        } catch (error) {
          console.error('Error parsing chat event:', error);
          options.onError?.({
            type: 'error',
            error: 'Failed to parse server response',
            timestamp: Date.now()
          });
        }
      };

      // Handle connection errors
      this.eventSource.onerror = (error) => {
        console.error('Streaming chat connection error:', error);
        this.isConnected = false;
        
        options.onError?.({
          type: 'error',
          error: 'Connection failed',
          timestamp: Date.now()
        });
      };

    } catch (error) {
      console.error('Failed to start streaming chat:', error);
      options.onError?.({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });
    }
  }

  private handleStatusUpdate(update: ChatStatusUpdate, options: StreamingChatOptions) {
    console.log(`Chat status: ${update.stage} - ${update.status}`, update.details);
    
    // Call the status update callback
    options.onStatusUpdate?.(update);
    
    // Call the progress callback if progress is available
    if (update.progress !== undefined) {
      options.onProgress?.(update.progress);
    }
  }

  private handleResponse(response: ChatResponse, options: StreamingChatOptions) {
    console.log('Chat response received:', response.content.substring(0, 100) + '...');
    options.onResponse?.(response);
  }

  private handleError(error: ChatError, options: StreamingChatOptions) {
    console.error('Chat error:', error.error);
    options.onError?.(error);
  }

  private handleComplete(options: StreamingChatOptions) {
    console.log('Chat stream completed');
    options.onComplete?.();
    this.closeConnection();
  }

  closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  isStreaming(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const streamingChatService = new StreamingChatService();
