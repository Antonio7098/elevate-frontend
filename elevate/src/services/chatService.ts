import { apiClient } from './apiClient';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ChatContext {
  folderId?: number;
  questionSetId?: number;
}

export const sendMessageToAI = async (
  message: string, 
  context?: ChatContext
): Promise<string> => {
  try {
    const response = await apiClient.post('/ai/chat', {
      message,
      ...context
    });
    
    return response.data.response || 'I apologize, but I encountered an error processing your request.';
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
};
