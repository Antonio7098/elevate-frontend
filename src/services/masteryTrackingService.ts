import { apiClient } from './apiClient';
import type {
  MasteryTracking,
  MasteryProgress,
  MasteryThreshold,
  MasteryReview,
  MasteryUpdate,
  MasteryStats,
  MasteryGoal,
  MasteryReminder
} from '../types/masteryTracking';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock data for development
const mockMasteryTracking: MasteryTracking[] = [
  {
    id: 'tracking-1',
    userId: 1,
    blueprintSectionId: 'section-1',
    masteryCriterionId: 'criterion-1',
    currentLevel: 2,
    targetLevel: 4,
    totalAttempts: 5,
    successfulAttempts: 3,
    consecutiveSuccesses: 2,
    consecutiveFailures: 0,
    lastAttemptAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    successRate: 0.6,
    progressPercentage: 50,
    isMastered: false,
    isDue: false,
    daysUntilNextReview: 1
  },
  {
    id: 'tracking-2',
    userId: 1,
    blueprintSectionId: 'section-1',
    masteryCriterionId: 'criterion-2',
    currentLevel: 1,
    targetLevel: 4,
    totalAttempts: 3,
    successfulAttempts: 1,
    consecutiveSuccesses: 0,
    consecutiveFailures: 1,
    lastAttemptAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    successRate: 0.33,
    progressPercentage: 25,
    isMastered: false,
    isDue: true,
    daysUntilNextReview: 0
  }
];

const mockMasteryProgress: MasteryProgress[] = [
  {
    sectionId: 'section-1',
    totalCriteria: 3,
    masteredCriteria: 1,
    inProgressCriteria: 1,
    notStartedCriteria: 1,
    overallProgress: 33,
    lastUpdated: new Date().toISOString(),
    criteriaProgress: [
      {
        criterionId: 'criterion-1',
        title: 'Understand Basic Concepts',
        currentLevel: 2,
        targetLevel: 4,
        progressPercentage: 50,
        isMastered: false,
        isDue: false,
        nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        lastAttemptAt: new Date().toISOString()
      }
    ],
    uueStageProgress: [
      {
        stage: 'UNDERSTAND',
        totalCriteria: 2,
        masteredCriteria: 1,
        inProgressCriteria: 1,
        notStartedCriteria: 0,
        progressPercentage: 50,
        isUnlocked: true,
        isCompleted: false
      }
    ]
  }
];

export class MasteryTrackingService {
  async getMasteryTracking(userId: number, criterionId: string): Promise<MasteryTracking> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tracking = mockMasteryTracking.find(t => 
        t.userId === userId && t.masteryCriterionId === criterionId
      );
      
      if (!tracking) {
        throw new Error('Mastery tracking not found');
      }
      
      return tracking;
    }

    try {
      const response = await apiClient.get<MasteryTracking>(`/api/mastery-tracking/${criterionId}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mastery tracking:', error);
      throw new Error('Failed to fetch mastery tracking');
    }
  }

  async updateMasteryTracking(trackingId: string, data: Partial<MasteryTracking>): Promise<MasteryTracking> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const tracking = mockMasteryTracking.find(t => t.id === trackingId);
      if (!tracking) {
        throw new Error('Mastery tracking not found');
      }
      
      Object.assign(tracking, data);
      tracking.updatedAt = new Date().toISOString();
      
      // Recalculate computed fields
      if (data.totalAttempts !== undefined || data.successfulAttempts !== undefined) {
        tracking.successRate = tracking.totalAttempts > 0 ? tracking.successfulAttempts / tracking.totalAttempts : 0;
      }
      
      if (data.currentLevel !== undefined) {
        tracking.progressPercentage = (tracking.currentLevel / tracking.targetLevel) * 100;
        tracking.isMastered = tracking.currentLevel >= tracking.targetLevel;
      }
      
      return tracking;
    }

    try {
      const response = await apiClient.patch<MasteryTracking>(`/api/mastery-tracking/${trackingId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update mastery tracking:', error);
      throw new Error('Failed to update mastery tracking');
    }
  }

  async getMasteryProgress(sectionId: string, userId: number): Promise<MasteryProgress> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const progress = mockMasteryProgress.find(p => p.sectionId === sectionId);
      if (!progress) {
        throw new Error('Mastery progress not found');
      }
      
      return progress;
    }

    try {
      const response = await apiClient.get<MasteryProgress>(`/api/blueprint-sections/${sectionId}/mastery-progress?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mastery progress:', error);
      throw new Error('Failed to fetch mastery progress');
    }
  }

  async getMasteryStats(userId: number, sectionId?: string): Promise<MasteryStats> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const tracking = sectionId 
        ? mockMasteryTracking.filter(t => t.userId === userId && t.blueprintSectionId === sectionId)
        : mockMasteryTracking.filter(t => t.userId === userId);
      
      const totalCriteria = tracking.length;
      const masteredCriteria = tracking.filter(t => t.isMastered).length;
      const inProgressCriteria = tracking.filter(t => !t.isMastered && t.totalAttempts > 0).length;
      const notStartedCriteria = totalCriteria - masteredCriteria - inProgressCriteria;
      const overallProgress = totalCriteria > 0 ? (masteredCriteria / totalCriteria) * 100 : 0;
      
      const totalAttempts = tracking.reduce((sum, t) => sum + t.totalAttempts, 0);
      const totalTimeSpent = tracking.reduce((sum, t) => sum + (t.totalAttempts * 2), 0); // Mock 2 minutes per attempt
      const averageLevel = totalCriteria > 0 ? tracking.reduce((sum, t) => sum + t.currentLevel, 0) / totalCriteria : 0;
      
      return {
        userId,
        blueprintSectionId: sectionId,
        totalCriteria,
        masteredCriteria,
        inProgressCriteria,
        notStartedCriteria,
        overallProgress,
        averageLevel,
        totalAttempts,
        totalTimeSpent,
        lastActivity: new Date().toISOString(),
        dailyProgress: [],
        weeklyProgress: [],
        monthlyProgress: []
      };
    }

    try {
      const url = sectionId 
        ? `/api/mastery-stats?userId=${userId}&sectionId=${sectionId}`
        : `/api/mastery-stats?userId=${userId}`;
      
      const response = await apiClient.get<MasteryStats>(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mastery stats:', error);
      throw new Error('Failed to fetch mastery stats');
    }
  }

  async createMasteryGoal(data: Omit<MasteryGoal, 'id' | 'currentProgress' | 'isAchieved' | 'createdAt' | 'updatedAt'>): Promise<MasteryGoal> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newGoal: MasteryGoal = {
        id: `goal-${Date.now()}`,
        userId: data.userId,
        blueprintSectionId: data.blueprintSectionId,
        targetDate: data.targetDate,
        targetProgress: data.targetProgress,
        currentProgress: 0,
        isAchieved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newGoal;
    }

    try {
      const response = await apiClient.post<MasteryGoal>('/api/mastery-goals', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create mastery goal:', error);
      throw new Error('Failed to create mastery goal');
    }
  }

  async updateMasteryGoal(goalId: string, data: Partial<MasteryGoal>): Promise<MasteryGoal> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock goal update - in real implementation, this would update a mock goals array
      const updatedGoal: MasteryGoal = {
        id: goalId,
        userId: 1,
        blueprintSectionId: 'section-1',
        targetDate: new Date().toISOString(),
        targetProgress: 80,
        currentProgress: 60,
        isAchieved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return updatedGoal;
    }

    try {
      const response = await apiClient.patch<MasteryGoal>(`/api/mastery-goals/${goalId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update mastery goal:', error);
      throw new Error('Failed to update mastery goal');
    }
  }

  async getDueReviews(userId: number, sectionId?: string): Promise<MasteryTracking[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let tracking = mockMasteryTracking.filter(t => t.userId === userId && t.isDue);
      
      if (sectionId) {
        tracking = tracking.filter(t => t.blueprintSectionId === sectionId);
      }
      
      return tracking;
    }

    try {
      const url = sectionId 
        ? `/api/mastery-tracking/due-reviews?userId=${userId}&sectionId=${sectionId}`
        : `/api/mastery-tracking/due-reviews?userId=${userId}`;
      
      const response = await apiClient.get<MasteryTracking[]>(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch due reviews:', error);
      throw new Error('Failed to fetch due reviews');
    }
  }

  async getMasteryThresholds(userId: number, sectionId: string): Promise<MasteryThreshold[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock thresholds
      return [
        {
          id: 'threshold-1',
          userId,
          blueprintSectionId: sectionId,
          criterionId: 'criterion-1',
          thresholdLevel: 4,
          reviewIntervalDays: 7,
          minimumAttempts: 3,
          successRateThreshold: 80,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    try {
      const response = await apiClient.get<MasteryThreshold[]>(`/api/blueprint-sections/${sectionId}/mastery-thresholds?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mastery thresholds:', error);
      throw new Error('Failed to fetch mastery thresholds');
    }
  }

  async updateMasteryThreshold(thresholdId: string, data: Partial<MasteryThreshold>): Promise<MasteryThreshold> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock threshold update
      const updatedThreshold: MasteryThreshold = {
        id: thresholdId,
        userId: 1,
        blueprintSectionId: 'section-1',
        criterionId: 'criterion-1',
        thresholdLevel: 4,
        reviewIntervalDays: 7,
        minimumAttempts: 3,
        successRateThreshold: 80,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return updatedThreshold;
    }

    try {
      const response = await apiClient.patch<MasteryThreshold>(`/api/mastery-thresholds/${thresholdId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update mastery threshold:', error);
      throw new Error('Failed to update mastery threshold');
    }
  }

  async getMasteryReminders(userId: number): Promise<MasteryReminder[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock reminders
      return [
        {
          id: 'reminder-1',
          userId,
          criterionId: 'criterion-2',
          reminderType: 'daily',
          message: 'Time to review your mastery criteria!',
          isActive: true,
          nextReminderAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    try {
      const response = await apiClient.get<MasteryReminder[]>(`/api/mastery-reminders?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch mastery reminders:', error);
      throw new Error('Failed to fetch mastery reminders');
    }
  }
}

export const masteryTrackingService = new MasteryTrackingService();
export default masteryTrackingService;





