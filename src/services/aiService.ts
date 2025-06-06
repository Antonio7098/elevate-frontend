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
 * Enhanced implementation to identify key concepts and terms
 */
function extractTopics(sourceText: string): string[] {
  // Normalize the text for processing
  const normalizedText = sourceText.toLowerCase();
  
  // Step 1: Extract potential key phrases (2-3 word combinations that appear multiple times)
  const sentences = normalizedText.split(/[.!?]\s+/);
  const phrases: Record<string, number> = {};
  
  // Process each sentence to find phrases
  sentences.forEach(sentence => {
    const words = sentence.trim().split(/\s+/).filter(word => word.length > 3);
    
    // Extract 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
    
    // Extract 3-word phrases
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
  });
  
  // Step 2: Extract capitalized terms (likely proper nouns or important concepts)
  const capitalizedTerms = new Set<string>();
  const regex = /\b[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})*\b/g;
  const matches = sourceText.match(regex) || [];
  
  matches.forEach(match => {
    capitalizedTerms.add(match.toLowerCase());
  });
  
  // Step 3: Find frequent words (excluding common stop words)
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'because', 'as', 'what', 'when',
    'where', 'how', 'that', 'this', 'these', 'those', 'then',
    'just', 'more', 'also', 'however', 'therefore', 'hence', 'thus',
    'while', 'each', 'every', 'all', 'both', 'either', 'neither',
    'few', 'many', 'some', 'any', 'not', 'nor', 'about', 'above',
    'with', 'without', 'within', 'between', 'among', 'through', 'during',
    'before', 'after', 'since', 'until', 'from', 'for', 'of', 'to', 'in', 'on', 'at'
  ]);
  
  const wordFrequency: Record<string, number> = {};
  const allWords = normalizedText.split(/\s+/);
  
  allWords.forEach(word => {
    const cleaned = word.replace(/[^a-z]/g, '');
    if (cleaned.length > 4 && !stopWords.has(cleaned)) {
      wordFrequency[cleaned] = (wordFrequency[cleaned] || 0) + 1;
    }
  });
  
  // Step 4: Combine and rank all potential topics
  const allTopics: Array<{term: string, score: number}> = [];
  
  // Add phrases that appear more than once
  Object.entries(phrases)
    .filter(([_, count]) => count > 1)
    .forEach(([phrase, count]) => {
      allTopics.push({ term: phrase, score: count * 2 }); // Weight phrases higher
    });
  
  // Add capitalized terms
  Array.from(capitalizedTerms).forEach(term => {
    allTopics.push({ term, score: 3 }); // Weight capitalized terms high
  });
  
  // Add frequent words
  Object.entries(wordFrequency)
    .filter(([_, count]) => count > 2) // Only words that appear more than twice
    .forEach(([word, count]) => {
      allTopics.push({ term: word, score: count });
    });
  
  // Sort by score and take top unique topics
  const sortedTopics = allTopics
    .sort((a, b) => b.score - a.score)
    .map(item => item.term);
  
  // Remove duplicates and limit to 5 topics
  const uniqueTopics = Array.from(new Set(sortedTopics));
  return uniqueTopics.slice(0, 5);
}
