import { apiClient } from './apiClient';
import type { 
  LearningBlueprint, 
  CreateLearningBlueprintData, 
  GenerateQuestionsData,
  QuestionSet 
} from '../types/questionSet';

export const createLearningBlueprint = async (data: CreateLearningBlueprintData): Promise<LearningBlueprint> => {
  const response = await apiClient.post<LearningBlueprint>('/ai-rag/learning-blueprints', data);
  return response.data;
};

export const getLearningBlueprints = async (): Promise<LearningBlueprint[]> => {
  const response = await apiClient.get<LearningBlueprint[]>('/ai-rag/learning-blueprints');
  return response.data;
};

export const getLearningBlueprintById = async (id: string): Promise<LearningBlueprint> => {
  const response = await apiClient.get<LearningBlueprint>(`/ai-rag/learning-blueprints/${id}`);
  return response.data;
};

export const generateQuestionsFromBlueprint = async (
  blueprintId: string, 
  data: GenerateQuestionsData
): Promise<{ questionSet: QuestionSet; questions: unknown[] }> => {
  const response = await apiClient.post(`/ai-rag/learning-blueprints/${blueprintId}/question-sets`, data);
  return response.data;
}; 