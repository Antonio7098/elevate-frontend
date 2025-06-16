import { apiClient } from './apiClient';

export interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}

export interface ChatContext {
  folderId?: string;
  questionSetId?: string;
  noteId?: string;
  includeUserInfo?: boolean;
  includeContentAnalysis?: boolean;
}

export interface AIChatResponse {
  response: string;
  context?: {
    folderId?: string;
    questionSetId?: string;
    folder?: {
      name: string;
      description?: string;
      createdAt: string;
      questionSets?: Array<{
        id: string;
        name: string;
        questionCount: number;
      }>;
    };
    questionSet?: {
      id: string;
      name: string;
      description?: string;
      createdAt: string;
      totalQuestions: number;
      questions?: Array<{
        id: string;
        text: string;
        answer: string;
        type?: string;
        masteryScore?: number;
      }>;
    };
    contentAnalysis?: {
      topics: string[];
      questionTypes: string[];
      difficultyLevel?: string;
    };
    userInfo?: {
      name: string;
      learningPreferences?: string[];
      masteryLevel?: string;
    };
  };
}

export const sendMessageToAI = async (
  message: string, 
  context?: ChatContext
): Promise<AIChatResponse> => {
  try {
    // Structure the request payload according to what the backend expects
    const payload = {
      message,
      // Include folder ID directly in the request payload, not nested in context
      ...(context?.folderId && { folderId: context.folderId }),
      // Include question set ID directly in the request payload, not nested in context
      ...(context?.questionSetId && { questionSetId: context.questionSetId }),
      // Include note ID if provided
      ...(context?.noteId && { noteId: context.noteId }),
      // Include other context properties
      includeUserInfo: context?.includeUserInfo ?? true,
      includeContentAnalysis: context?.includeContentAnalysis ?? true
    };
    
    // Log the payload being sent to help with debugging
    console.log('Sending chat request with payload:', JSON.stringify(payload, null, 2));
    
    const response = await apiClient.post<AIChatResponse>('/ai/chat', payload);
    
    return response.data || { 
      response: 'I apologize, but I encountered an error processing your request.' 
    };
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
};

export const getChatHistory = async (noteId?: string): Promise<ChatMessage[]> => {
  try {
    const response = await apiClient.get<ChatMessage[]>('/ai/chat/history', {
      params: noteId ? { noteId } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw new Error('Failed to load chat history');
  }
};
