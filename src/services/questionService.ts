import { apiClient } from './apiClient';
import type { Question, CreateQuestionData, UpdateQuestionData } from '../types/question';

// Get all questions for a question set
export const getQuestions = async (questionSetId: string, folderId?: string): Promise<Question[]> => {
  try {
    // If we have a folder ID, try the nested folder route first
    if (folderId) {
      try {
        console.log(`Trying to fetch questions using nested folder route: /folders/${folderId}/questionsets/${questionSetId}/questions`);
        const response = await apiClient.get<Question[]>(`/folders/${folderId}/questionsets/${questionSetId}/questions`);
        return response.data;
      } catch {
        console.log(`Folder-nested route failed, trying alternative endpoints`);
        // Continue to try other approaches if this fails
      }
    }
    
    // Try the direct question set route
    try {
      console.log(`Trying to fetch questions using direct route: /questionsets/${questionSetId}/questions`);
      const response = await apiClient.get<Question[]>(`/questionsets/${questionSetId}/questions`);
      return response.data;
    } catch {
      // If that fails, try the query parameter approach
      console.log(`Direct route failed, trying query parameter approach`);
      const response = await apiClient.get<Question[]>(`/questions?questionSetId=${questionSetId}`);
      return response.data;
    }
  } catch (error) {
    console.error(`All attempts to fetch questions for question set ${questionSetId} failed:`, error);
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
    } catch {
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
export const createQuestion = async (folderId: string, questionSetId: string, data: CreateQuestionData): Promise<Question> => {
  try {
    // Use only the backend's supported nested route
    const response = await apiClient.post<Question>(`/folders/${folderId}/questionsets/${questionSetId}/questions`, {
      ...data
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to create question in question set ${questionSetId} in folder ${folderId}:`, error);
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
    } catch {
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
      await apiClient.delete(`/api/questionsets/${questionSetId}/questions/${questionId}`);
    } catch {
      // If that fails, try the direct approach
      console.log(`Trying alternative endpoint for deleting question ${questionId}`);
      await apiClient.delete(`/api/questions/${questionId}`);
    }
  } catch (error) {
    console.error(`Failed to delete question ${questionId} in question set ${questionSetId}:`, error);
    throw error;
  }
};
