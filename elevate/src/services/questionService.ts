import { apiClient } from './apiClient';
import type { Question, CreateQuestionData, UpdateQuestionData } from '../types/question';

// Get all questions for a question set
export const getQuestions = async (questionSetId: string): Promise<Question[]> => {
  try {
    // Try the nested route approach
    try {
      const response = await apiClient.get<Question[]>(`/questionsets/${questionSetId}/questions`);
      return response.data;
    } catch (nestedError) {
      // If that fails, try the direct approach with a filter
      console.log(`Trying alternative endpoint for questions in set ${questionSetId}`);
      const response = await apiClient.get<Question[]>(`/questions?questionSetId=${questionSetId}`);
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to fetch questions for question set ${questionSetId}:`, error);
    // Return empty array instead of throwing to prevent UI disruption
    return [];
  }
};

// Get a specific question
export const getQuestion = async (questionSetId: string, questionId: string): Promise<Question> => {
  try {
    // Try the nested route approach
    try {
      const response = await apiClient.get<Question>(`/questionsets/${questionSetId}/questions/${questionId}`);
      return response.data;
    } catch (nestedError) {
      // If that fails, try the direct approach
      console.log(`Trying alternative endpoint for question ${questionId}`);
      const response = await apiClient.get<Question>(`/questions/${questionId}`);
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to fetch question ${questionId} in question set ${questionSetId}:`, error);
    throw error;
  }
};

// Create a new question
export const createQuestion = async (questionSetId: string, data: CreateQuestionData): Promise<Question> => {
  try {
    // Try the nested route approach
    try {
      const response = await apiClient.post<Question>(`/questionsets/${questionSetId}/questions`, {
        ...data,
        // No need to include questionSetId in the body since it's in the URL
      });
      return response.data;
    } catch (nestedError) {
      // If that fails, try the direct approach with questionSetId in the body
      console.log(`Trying alternative endpoint for creating question in set ${questionSetId}`);
      const response = await apiClient.post<Question>(`/questions`, {
        ...data,
        questionSetId
      });
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to create question in question set ${questionSetId}:`, error);
    throw error;
  }
};

// Update a question
export const updateQuestion = async (questionSetId: string, questionId: string, data: UpdateQuestionData): Promise<Question> => {
  try {
    // Try the nested route approach
    try {
      const response = await apiClient.put<Question>(`/questionsets/${questionSetId}/questions/${questionId}`, data);
      return response.data;
    } catch (nestedError) {
      // If that fails, try the direct approach
      console.log(`Trying alternative endpoint for updating question ${questionId}`);
      const response = await apiClient.put<Question>(`/questions/${questionId}`, data);
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to update question ${questionId} in question set ${questionSetId}:`, error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (questionSetId: string, questionId: string): Promise<void> => {
  try {
    // Try the nested route approach
    try {
      await apiClient.delete(`/questionsets/${questionSetId}/questions/${questionId}`);
    } catch (nestedError) {
      // If that fails, try the direct approach
      console.log(`Trying alternative endpoint for deleting question ${questionId}`);
      await apiClient.delete(`/questions/${questionId}`);
    }
  } catch (error) {
    console.error(`Failed to delete question ${questionId} in question set ${questionSetId}:`, error);
    throw error;
  }
};
