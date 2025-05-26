import { apiClient } from './apiClient';
import type { QuestionSet } from '../types/questionSet';

export const getQuestionSetsByFolder = async (folderId: string): Promise<QuestionSet[]> => {
  try {
    const response = await apiClient.get<QuestionSet[]>(`/folders/${folderId}/questionsets`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch question sets for folder ${folderId}:`, error);
    throw error;
  }
};

export interface CreateQuestionSetData {
  title: string;
  description?: string;
  folderId: string;
}

export const createQuestionSet = async (data: CreateQuestionSetData): Promise<QuestionSet> => {
  try {
    const response = await apiClient.post<QuestionSet>('/questionsets', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create question set:', error);
    throw error;
  }
};

export const deleteQuestionSet = async (questionSetId: string): Promise<void> => {
  try {
    await apiClient.delete(`/questionsets/${questionSetId}`);
  } catch (error) {
    console.error(`Failed to delete question set ${questionSetId}:`, error);
    throw error;
  }
};
