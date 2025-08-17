import { apiClient } from './apiClient';
import type {
  MasteryCriterion,
  CreateCriterionData,
  UpdateCriterionData,
  PerformanceData,
  MasteryUpdateResult,
  CriterionMasteryResult
} from '../types/masteryCriterion';
import type { UueStage } from '../types/uueStage';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock data for development
const mockCriteria: MasteryCriterion[] = [
  {
    id: 'criterion-1',
    title: 'Understand Basic Concepts',
    description: 'Demonstrate understanding of fundamental concepts',
    weight: 1.0,
    uueStage: 'UNDERSTAND',
    complexityScore: 2,
    knowledgePrimitiveId: 'primitive-1',
    blueprintSectionId: 'section-1',
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    questionInstances: [],
    userCriterionMasteries: [],
    masteryProgress: {
      criterionId: 'criterion-1',
      userId: 1,
      currentLevel: 2,
      targetLevel: 4,
      progressPercentage: 50,
      totalAttempts: 5,
      successfulAttempts: 3,
      lastAttemptAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isDue: false,
      isMastered: false
    },
    nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isDue: false
  },
  {
    id: 'criterion-2',
    title: 'Apply Concepts in Practice',
    description: 'Use concepts to solve practical problems',
    weight: 1.5,
    uueStage: 'USE',
    complexityScore: 3,
    knowledgePrimitiveId: 'primitive-2',
    blueprintSectionId: 'section-1',
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    questionInstances: [],
    userCriterionMasteries: [],
    masteryProgress: {
      criterionId: 'criterion-2',
      userId: 1,
      currentLevel: 1,
      targetLevel: 4,
      progressPercentage: 25,
      totalAttempts: 3,
      successfulAttempts: 1,
      lastAttemptAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      isDue: true,
      isMastered: false
    },
    nextReviewAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    isDue: true
  }
];

export class MasteryCriterionService {
  async createCriterion(data: CreateCriterionData): Promise<MasteryCriterion> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newCriterion: MasteryCriterion = {
        id: `criterion-${Date.now()}`,
        title: data.title,
        description: data.description,
        weight: data.weight,
        uueStage: data.uueStage,
        complexityScore: data.complexityScore,
        knowledgePrimitiveId: data.knowledgePrimitiveId,
        blueprintSectionId: data.blueprintSectionId,
        userId: 1, // Mock user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionInstances: [],
        userCriterionMasteries: [],
        masteryProgress: {
          criterionId: `criterion-${Date.now()}`,
          userId: 1,
          currentLevel: 0,
          targetLevel: 4,
          progressPercentage: 0,
          totalAttempts: 0,
          successfulAttempts: 0,
          lastAttemptAt: new Date().toISOString(),
          nextReviewAt: new Date().toISOString(),
          isDue: false,
          isMastered: false
        },
        nextReviewAt: new Date().toISOString(),
        isDue: false
      };
      
      mockCriteria.push(newCriterion);
      return newCriterion;
    }

    try {
      const response = await apiClient.post<MasteryCriterion>('/api/mastery-criteria', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create mastery criterion:', error);
      throw new Error('Failed to create mastery criterion');
    }
  }

  async getCriterion(id: string): Promise<MasteryCriterion> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const criterion = mockCriteria.find(c => c.id === id);
      if (!criterion) {
        throw new Error('Mastery criterion not found');
      }
      return criterion;
    }

    try {
      const response = await apiClient.get<MasteryCriterion>(`/api/mastery-criteria/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mastery criterion:', error);
      throw new Error('Failed to fetch mastery criterion');
    }
  }

  async processCriterionReview(
    userId: number,
    criterionId: string,
    isCorrect: boolean,
    performance: PerformanceData
  ): Promise<MasteryUpdateResult> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const criterion = mockCriteria.find(c => c.id === criterionId);
      if (!criterion) {
        throw new Error('Mastery criterion not found');
      }
      
      // Mock mastery calculation
      const currentLevel = criterion.masteryProgress?.currentLevel || 0;
      const newLevel = isCorrect ? Math.min(currentLevel + 1, 5) : Math.max(currentLevel - 1, 0);
      const progressPercentage = (newLevel / 5) * 100;
      const nextReviewAt = new Date(Date.now() + (isCorrect ? 2 : 1) * 24 * 60 * 60 * 1000).toISOString();
      const isMastered = newLevel >= 4;
      
      // Update mock data
      if (criterion.masteryProgress) {
        criterion.masteryProgress.currentLevel = newLevel;
        criterion.masteryProgress.progressPercentage = progressPercentage;
        criterion.masteryProgress.totalAttempts += 1;
        criterion.masteryProgress.successfulAttempts += isCorrect ? 1 : 0;
        criterion.masteryProgress.lastAttemptAt = new Date().toISOString();
        criterion.masteryProgress.nextReviewAt = nextReviewAt;
        criterion.masteryProgress.isMastered = isMastered;
      }
      
      criterion.nextReviewAt = nextReviewAt;
      criterion.isDue = false;
      criterion.updatedAt = new Date().toISOString();
      
      return {
        criterionId,
        userId,
        newLevel,
        progressPercentage,
        nextReviewAt,
        isMastered,
        message: isCorrect ? 'Great job! Level increased.' : 'Keep practicing. Level adjusted.'
      };
    }

    try {
      const response = await apiClient.post<MasteryUpdateResult>(`/api/mastery-criteria/${criterionId}/review`, {
        userId,
        isCorrect,
        performance
      });
      return response.data;
    } catch (error) {
      console.error('Failed to process criterion review:', error);
      throw new Error('Failed to process criterion review');
    }
  }

  async calculateCriterionMastery(criterionId: string, userId: number): Promise<CriterionMasteryResult> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const criterion = mockCriteria.find(c => c.id === criterionId);
      if (!criterion) {
        throw new Error('Mastery criterion not found');
      }
      
      const progress = criterion.masteryProgress;
      if (!progress) {
        throw new Error('Mastery progress not found');
      }
      
      return {
        criterionId,
        userId,
        currentLevel: progress.currentLevel,
        targetLevel: progress.targetLevel,
        progressPercentage: progress.progressPercentage,
        totalAttempts: progress.totalAttempts,
        successfulAttempts: progress.successfulAttempts,
        successRate: progress.totalAttempts > 0 ? (progress.successfulAttempts / progress.totalAttempts) * 100 : 0,
        lastAttemptAt: progress.lastAttemptAt,
        nextReviewAt: progress.nextReviewAt,
        isDue: progress.isDue,
        isMastered: progress.isMastered,
        canProgressToNextStage: progress.isMastered && criterion.uueStage !== 'EXPLORE'
      };
    }

    try {
      const response = await apiClient.get<CriterionMasteryResult>(`/api/mastery-criteria/${criterionId}/mastery?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to calculate criterion mastery:', error);
      throw new Error('Failed to calculate criterion mastery');
    }
  }

  async getCriteriaByUueStage(sectionId: string, uueStage: UueStage): Promise<MasteryCriterion[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockCriteria.filter(c => 
        c.blueprintSectionId === sectionId && c.uueStage === uueStage
      );
    }

    try {
      const response = await apiClient.get<MasteryCriterion[]>(`/api/blueprint-sections/${sectionId}/criteria?uueStage=${uueStage}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch criteria by UUE stage:', error);
      throw new Error('Failed to fetch criteria by UUE stage');
    }
  }

  async canProgressToNextUueStage(userId: number, criterionId: string): Promise<boolean> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const criterion = mockCriteria.find(c => c.id === criterionId);
      if (!criterion) {
        return false;
      }
      
      const progress = criterion.masteryProgress;
      return progress ? progress.isMastered && criterion.uueStage !== 'EXPLORE' : false;
    }

    try {
      const response = await apiClient.get<{ canProgress: boolean }>(`/api/mastery-criteria/${criterionId}/can-progress?userId=${userId}`);
      return response.data.canProgress;
    } catch (error) {
      console.error('Failed to check progression eligibility:', error);
      throw new Error('Failed to check progression eligibility');
    }
  }

  async updateCriterion(criterionId: string, data: UpdateCriterionData): Promise<MasteryCriterion> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const criterion = mockCriteria.find(c => c.id === criterionId);
      if (!criterion) {
        throw new Error('Mastery criterion not found');
      }
      
      Object.assign(criterion, data);
      criterion.updatedAt = new Date().toISOString();
      
      return criterion;
    }

    try {
      const response = await apiClient.patch<MasteryCriterion>(`/api/mastery-criteria/${criterionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update mastery criterion:', error);
      throw new Error('Failed to update mastery criterion');
    }
  }

  async deleteCriterion(criterionId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockCriteria.findIndex(c => c.id === criterionId);
      if (index === -1) {
        throw new Error('Mastery criterion not found');
      }
      
      mockCriteria.splice(index, 1);
      return;
    }

    try {
      await apiClient.delete(`/api/mastery-criteria/${criterionId}`);
    } catch (error) {
      console.error('Failed to delete mastery criterion:', error);
      throw new Error('Failed to delete mastery criterion');
    }
  }

  async getCriteriaBySection(sectionId: string): Promise<MasteryCriterion[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockCriteria.filter(c => c.blueprintSectionId === sectionId);
    }

    try {
      const response = await apiClient.get<MasteryCriterion[]>(`/api/blueprint-sections/${sectionId}/criteria`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch criteria by section:', error);
      throw new Error('Failed to fetch criteria by section');
    }
  }
}

export const masteryCriterionService = new MasteryCriterionService();
export default masteryCriterionService;





