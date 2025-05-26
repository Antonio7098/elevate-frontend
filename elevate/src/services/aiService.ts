import { apiClient } from './apiClient';
import type { QuestionSet } from '../types/questionSet';

export interface GenerateAiQuestionSetData {
  folderId: string;
  name: string;
  sourceText: string;
  questionCount: number;
  focus: 'understand' | 'use' | 'explore';
  // Additional fields expected by the backend
  questionTypes?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
  language?: string;
}

/**
 * Generates a new question set using AI based on provided source material
 */
export const generateAiPoweredSet = async (data: GenerateAiQuestionSetData): Promise<QuestionSet> => {
  try {
    // Map focus to question types and difficulty
    const requestData = {
      ...data,
      // Set default question types based on focus
      questionTypes: data.questionTypes || mapFocusToQuestionTypes(data.focus),
      // Set default difficulty based on focus
      difficulty: data.difficulty || mapFocusToDifficulty(data.focus),
      // Set default language to English if not specified
      language: data.language || 'en',
      // Extract topics from source text if not provided
      topics: data.topics || extractTopics(data.sourceText)
    };
    
    console.log('Sending AI generation request:', requestData);
    
    // Try different possible endpoint paths
    try {
      // First try the AI-specific endpoint
      const response = await apiClient.post<QuestionSet>('/ai/generate-from-source', requestData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('AI endpoint not found, trying enhanced question set endpoint');
        // If AI endpoint doesn't exist, try the enhanced question set endpoint
        const response = await apiClient.post<QuestionSet>('/questionsets', {
          ...requestData,
          generateFromSource: true // Flag to indicate AI generation
        });
        return response.data;
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Failed to generate AI-powered question set:', error);
    
    // Provide more detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      
      // Enhance the error with more details
      const errorMessage = error.response.data?.message || 'Unknown server error';
      const enhancedError = new Error(`AI generation failed: ${errorMessage} (${error.response.status})`);
      throw enhancedError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection and try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

/**
 * Maps the learning focus to appropriate question types
 */
function mapFocusToQuestionTypes(focus: 'understand' | 'use' | 'explore'): string[] {
  switch (focus) {
    case 'understand':
      return ['multiple-choice', 'true-false'];
    case 'use':
      return ['multiple-choice', 'short-answer'];
    case 'explore':
      return ['short-answer', 'essay'];
    default:
      return ['multiple-choice', 'true-false'];
  }
}

/**
 * Maps the learning focus to appropriate difficulty level
 */
function mapFocusToDifficulty(focus: 'understand' | 'use' | 'explore'): 'easy' | 'medium' | 'hard' {
  switch (focus) {
    case 'understand':
      return 'easy';
    case 'use':
      return 'medium';
    case 'explore':
      return 'hard';
    default:
      return 'medium';
  }
}

/**
 * Extracts potential topics from the source text
 * This is a simple implementation - in a real app, this might use NLP
 */
function extractTopics(sourceText: string): string[] {
  // Simple implementation - extract common nouns and phrases
  // In a real app, this would use more sophisticated NLP
  const words = sourceText.split(' ');
  const potentialTopics = new Set<string>();
  
  // Extract words that start with capital letters (potential proper nouns)
  words.forEach(word => {
    const cleaned = word.replace(/[^a-zA-Z]/g, '');
    if (cleaned.length > 3 && cleaned[0] === cleaned[0].toUpperCase()) {
      potentialTopics.add(cleaned.toLowerCase());
    }
  });
  
  return Array.from(potentialTopics).slice(0, 5); // Limit to 5 topics
}
