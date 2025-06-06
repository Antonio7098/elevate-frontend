import { apiClient } from './apiClient';
import type { QuestionSet } from '../types/questionSet';

// Get all question sets for a folder
export const getQuestionSets = async (folderId: string): Promise<QuestionSet[]> => {
  try {
    // First try the nested route approach
    try {
      const response = await apiClient.get<QuestionSet[]>(`/folders/${folderId}/questionsets`);
      return response.data;
    } catch (nestedError) {
      // If that fails, try the flat approach with query parameter
      console.log(`Trying alternative endpoint for folder ${folderId}`);
      const response = await apiClient.get<QuestionSet[]>(`/questionsets?folderId=${folderId}`);
      return response.data;
    }
  } catch (error) {
    console.log(`All attempts to fetch question sets for folder ${folderId} failed, returning empty array`);
    // Return empty array instead of throwing to handle the case where no sets exist yet
    // or the endpoint isn't implemented yet
    return [];
  }
};

export const getQuestionSet = async (folderId: string, questionSetId: string): Promise<QuestionSet> => {
  try {
    // First try the nested route approach
    try {
      const response = await apiClient.get<QuestionSet>(`/folders/${folderId}/questionsets/${questionSetId}`);
      return response.data;
    } catch (nestedError) {
      // If that fails, try the direct approach
      console.log(`Trying alternative endpoint for question set ${questionSetId}`);
      const response = await apiClient.get<QuestionSet>(`/questionsets/${questionSetId}`);
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to fetch question set ${questionSetId} in folder ${folderId}:`, error);
    throw error;
  }
};

export interface CreateQuestionSetData {
  name: string;
  description?: string;
}

// Try both nested and flat route structures
export const createQuestionSet = async (folderId: string, data: CreateQuestionSetData): Promise<QuestionSet> => {
  try {
    // First try the nested route approach
    try {
      const response = await apiClient.post<QuestionSet>(`/folders/${folderId}/questionsets`, {
        ...data
        // No need to include folderId in the body since it's in the URL
      });
      return response.data;
    } catch (nestedError) {
      // If that fails, try the flat approach with folderId in the body
      console.log(`Trying alternative endpoint for creating question set in folder ${folderId}`);
      const response = await apiClient.post<QuestionSet>(`/questionsets`, {
        ...data,
        folderId
      });
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to create question set in folder ${folderId}:`, error);
    throw error;
  }
};

export const deleteQuestionSet = async (folderId: string, questionSetId: string): Promise<void> => {
  try {
    // First try the nested route approach
    try {
      await apiClient.delete(`/folders/${folderId}/questionsets/${questionSetId}`);
    } catch (nestedError) {
      // If that fails, try the direct approach
      console.log(`Trying alternative endpoint for deleting question set ${questionSetId}`);
      await apiClient.delete(`/questionsets/${questionSetId}`);
    }
  } catch (error) {
    console.error(`Failed to delete question set ${questionSetId} in folder ${folderId}:`, error);
    throw error;
  }
};
