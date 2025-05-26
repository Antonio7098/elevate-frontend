import { apiClient } from './apiClient';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ChatContext {
  folderId?: string;
  questionSetId?: string;
}

export interface AIChatResponse {
  response: string;
  context?: {
    folderId?: string;
    questionSetId?: string;
  };
}

export const sendMessageToAI = async (
  message: string, 
  context?: ChatContext
): Promise<AIChatResponse> => {
  try {
    const response = await apiClient.post<AIChatResponse>('/ai/chat', {
      message,
      context: context || {}
    });
    
    return response.data || { 
      response: 'I apologize, but I encountered an error processing your request.' 
    };
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    const response = await apiClient.get<ChatMessage[]>('/ai/chat/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw new Error('Failed to load chat history');
  }
};
