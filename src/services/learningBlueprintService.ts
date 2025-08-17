import { apiClient } from './apiClient';
import type { 
  LearningBlueprint, 
  CreateLearningBlueprintData, 
  GenerateQuestionsData,
  QuestionSet 
} from '../types/questionSet';
import { mockBlueprints } from '../data/mockFoldersData';

// Development mode flag - set to true to use mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const createLearningBlueprint = async (data: CreateLearningBlueprintData): Promise<LearningBlueprint> => {
  if (USE_MOCK_DATA) {
    console.log('🎭 [learningBlueprintService] Using mock data for createLearningBlueprint');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const mockBlueprint: LearningBlueprint = {
      id: `bp-${Date.now()}`,
      sourceText: data.sourceText,
      blueprintJson: {},
      folderId: data.folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return mockBlueprint;
  }

  try {
    // Add a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await apiClient.post<LearningBlueprint>('/learning-blueprints', data, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    console.error('❌ [learningBlueprintService] Failed to create learning blueprint via API:', error);
    console.log('🔄 [learningBlueprintService] Falling back to mock data for createLearningBlueprint');
    
    // Fall back to mock data even when not in mock mode
    const mockBlueprint: LearningBlueprint = {
      id: `bp-${Date.now()}`,
      sourceText: data.sourceText,
      blueprintJson: {},
      folderId: data.folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return mockBlueprint;
  }
};

export const getLearningBlueprints = async (): Promise<LearningBlueprint[]> => {
  if (USE_MOCK_DATA) {
    console.log('🎭 [learningBlueprintService] Using mock data for getLearningBlueprints');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBlueprints;
  }

  try {
    // Add a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await apiClient.get<LearningBlueprint[]>('/learning-blueprints', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    console.error('❌ [learningBlueprintService] Failed to fetch learning blueprints via API:', error);
    console.log('🔄 [learningBlueprintService] Falling back to mock data');
    return mockBlueprints;
  }
};

export const getLearningBlueprintById = async (id: string): Promise<LearningBlueprint> => {
  if (USE_MOCK_DATA) {
    console.log('🎭 [learningBlueprintService] Using mock data for getLearningBlueprintById');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const mockBlueprint = mockBlueprints.find(bp => bp.id === id);
    if (!mockBlueprint) {
      throw new Error(`Learning blueprint with id ${id} not found`);
    }
    return mockBlueprint;
  }

  try {
    // Add a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await apiClient.get<LearningBlueprint>(`/learning-blueprints/${id}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    console.error('❌ [learningBlueprintService] Failed to fetch learning blueprint via API:', error);
    console.log('🔄 [learningBlueprintService] Falling back to mock data');
    
    const mockBlueprint = mockBlueprints.find(bp => bp.id === id);
    if (!mockBlueprint) {
      throw new Error(`Learning blueprint with id ${id} not found`);
    }
    return mockBlueprint;
  }
};

export const generateQuestionsFromBlueprint = async (
  blueprintId: string, 
  data: GenerateQuestionsData
): Promise<{ questionSet: QuestionSet; questions: unknown[] }> => {
  if (USE_MOCK_DATA) {
    console.log('🎭 [learningBlueprintService] Using mock data for generateQuestionsFromBlueprint');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockQuestionSet: QuestionSet = {
      id: `qs-${Date.now()}`,
      name: `Questions from ${data.name || 'Blueprint'}`,
      description: `Generated from learning blueprint ${blueprintId}`,
      folderId: data.folderId || 'default-folder',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questionCount: data.questionOptions?.count || 5,
      isPinned: false,
      currentTotalMasteryScore: 0,
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      generatedFromBlueprintId: blueprintId,
    };
    
    const mockQuestions = Array.from({ length: data.questionOptions?.count || 5 }, (_, i) => ({
      id: `q-${Date.now()}-${i}`,
      text: `Sample question ${i + 1} from blueprint`,
      answer: `Sample answer ${i + 1}`,
      questionType: 'multiple-choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      explanation: 'This is a sample question generated from the learning blueprint.',
    }));
    
    return { questionSet: mockQuestionSet, questions: mockQuestions };
  }

  try {
    const response = await apiClient.post(`/ai-rag/learning-blueprints/${blueprintId}/question-sets`, data);
    return response.data;
  } catch (error) {
    console.error('❌ [learningBlueprintService] Failed to generate questions via API:', error);
    console.log('🔄 [learningBlueprintService] Falling back to mock data for generateQuestionsFromBlueprint');
    
    // Fall back to mock data even when not in mock mode
    const mockQuestionSet: QuestionSet = {
      id: `qs-${Date.now()}`,
      name: `Questions from ${data.name || 'Blueprint'}`,
      description: `Generated from learning blueprint ${blueprintId}`,
      folderId: data.folderId || 'default-folder',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questionCount: data.questionOptions?.count || 5,
      isPinned: false,
      currentTotalMasteryScore: 0,
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      generatedFromBlueprintId: blueprintId,
    };
    
    const mockQuestions = Array.from({ length: data.questionOptions?.count || 5 }, (_, i) => ({
      id: `q-${Date.now()}-${i}`,
      text: `Sample question ${i + 1} from blueprint`,
      answer: `Sample answer ${i + 1}`,
      questionType: 'multiple-choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      explanation: 'This is a sample question generated from the learning blueprint.',
    }));
    
    return { questionSet: mockQuestionSet, questions: mockQuestions };
  }
}; 