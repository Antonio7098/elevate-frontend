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
        name: string;
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

// Mock AI responses for different types of messages
const mockResponses = [
  "I can help you with that! Based on your learning context, here are some suggestions...",
  "That's a great question! Let me analyze the content and provide you with some insights...",
  "I understand what you're looking for. Here's what I found in your learning materials...",
  "Based on your current progress, I recommend focusing on these areas...",
  "I can see you're working on this topic. Here are some resources that might help...",
  "That's an interesting approach! Let me help you explore this concept further...",
  "I've analyzed your learning materials and found some relevant information...",
  "Great question! This relates to several concepts in your current learning path...",
  "I can help you understand this better. Let me break it down for you...",
  "Based on your mastery level, here are some advanced concepts to explore..."
];

export const sendMessageToAI = async (
  message: string, 
  context?: ChatContext,
  signal?: AbortSignal
): Promise<AIChatResponse> => {
  // Simulate network delay with cancellation support
  const delay = 1000 + Math.random() * 2000;
  
  // Check for cancellation every 100ms during the delay
  const checkInterval = 100;
  const totalChecks = Math.ceil(delay / checkInterval);
  
  for (let i = 0; i < totalChecks; i++) {
    if (signal?.aborted) {
      const abortError = new Error('Request was cancelled');
      abortError.name = 'AbortError';
      throw abortError;
    }
    await new Promise(resolve => setTimeout(resolve, Math.min(checkInterval, delay - i * checkInterval)));
  }
  
  // Final cancellation check
  if (signal?.aborted) {
    const abortError = new Error('Request was cancelled');
    abortError.name = 'AbortError';
    throw abortError;
  }
  
  // Generate a contextual response based on the message and context
  let response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  // Add context-specific information if available
  if (context?.folderId) {
    response += ` I can see you're working in a specific folder. `;
  }
  
  if (context?.questionSetId) {
    response += ` I notice you're focusing on a particular question set. `;
  }
  
  if (message.toLowerCase().includes('help') || message.toLowerCase().includes('assist')) {
    response = "I'm here to help! I can assist you with understanding concepts, analyzing your learning materials, and providing personalized guidance based on your progress.";
  }
  
  if (message.toLowerCase().includes('explain') || message.toLowerCase().includes('what is')) {
    response = "Let me explain that concept for you. I'll break it down into digestible parts and provide examples to help you understand better.";
  }
  
  if (message.toLowerCase().includes('practice') || message.toLowerCase().includes('exercise')) {
    response = "Great idea! Practice is essential for mastery. I can help you find relevant exercises and track your progress as you work through them.";
  }
  
  return {
    response,
    context: context ? {
      folderId: context.folderId,
      questionSetId: context.questionSetId
    } : undefined
  };
};

export const getChatHistory = async (noteId?: string): Promise<ChatMessage[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return empty history for now
  return [];
};



