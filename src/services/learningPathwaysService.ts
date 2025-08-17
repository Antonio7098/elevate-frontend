import { apiClient } from './apiClient';
import { mockCoreLearningPathways } from '../data/mockCoreLearningPathways';
import type {
  LearningPathway,
  PathwaySection,
  PathwayContentItem,
  PathwayMilestone,
  PathwayAssessment,
  UserPathwayProgress,
  PathwayRecommendation,
  PathwaySearch,
  PathwayAnalytics
} from '../types/learningPathways';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock data for development
const mockPathways: LearningPathway[] = [
  {
    id: 'pathway-1',
    title: 'Complete Blueprint Mastery',
    description: 'A comprehensive pathway to master all aspects of the blueprint system',
    blueprintId: 'blueprint-1',
    difficulty: 'intermediate',
    estimatedDuration: 30,
    prerequisites: [],
    learningObjectives: [
      'Understand blueprint structure and organization',
      'Master section management and hierarchy',
      'Achieve proficiency in mastery tracking',
      'Complete UUE stage progression'
    ],
    targetAudience: ['Students', 'Educators', 'Learning designers'],
    tags: ['blueprint', 'mastery', 'learning', 'comprehensive'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'pathway-section-1',
        pathwayId: 'pathway-1',
        title: 'Foundation Concepts',
        description: 'Learn the fundamental principles of blueprint-based learning',
        orderIndex: 0,
        estimatedTimeMinutes: 45,
        difficulty: 'beginner',
        contentItems: [
          {
            id: 'content-1',
            sectionId: 'pathway-section-1',
            title: 'Introduction to Blueprints',
            contentType: 'reading',
            contentUrl: '/content/intro-blueprints',
            estimatedTimeMinutes: 15,
            orderIndex: 0,
            isRequired: true,
            isCompleted: false
          },
          {
            id: 'content-2',
            sectionId: 'pathway-section-1',
            title: 'Blueprint Structure Overview',
            contentType: 'video',
            contentUrl: '/content/structure-overview',
            estimatedTimeMinutes: 20,
            orderIndex: 1,
            isRequired: true,
            isCompleted: false
          }
        ],
        masteryCriteria: ['criterion-1', 'criterion-2'],
        isUnlocked: true
      }
    ],
    milestones: [
      {
        id: 'milestone-1',
        pathwayId: 'pathway-1',
        title: 'Foundation Complete',
        description: 'Successfully complete all foundation concepts',
        orderIndex: 0,
        requirements: [
          {
            id: 'req-1',
            milestoneId: 'milestone-1',
            requirementType: 'section_completion',
            requirementValue: 1,
            currentValue: 0,
            isMet: false,
            description: 'Complete Foundation Concepts section'
          }
        ],
        rewards: [
          {
            id: 'reward-1',
            milestoneId: 'milestone-1',
            rewardType: 'badge',
            rewardValue: 'Foundation Master',
            description: 'Earn the Foundation Master badge'
          }
        ],
        isAchieved: false
      }
    ],
    assessments: [
      {
        id: 'assessment-1',
        pathwayId: 'pathway-1',
        title: 'Foundation Knowledge Check',
        description: 'Test your understanding of foundation concepts',
        assessmentType: 'quiz',
        passingScore: 80,
        maxAttempts: 3,
        timeLimit: 30,
        questions: [
          {
            id: 'q1',
            assessmentId: 'assessment-1',
            question: 'What is the primary purpose of a blueprint?',
            questionType: 'multiple_choice',
            options: ['To organize content', 'To track progress', 'To measure mastery', 'All of the above'],
            correctAnswer: 'All of the above',
            points: 10,
            orderIndex: 0
          }
        ],
        userResults: []
      }
    ],
    userProgress: {
      id: 'progress-1',
      userId: 1,
      pathwayId: 'pathway-1',
      currentSectionId: 'pathway-section-1',
      progressPercentage: 25,
      sectionsCompleted: 0,
      totalSections: 4,
      milestonesAchieved: 0,
      totalMilestones: 3,
      assessmentsPassed: 0,
      totalAssessments: 2,
      timeSpent: 30,
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      sectionProgress: [],
      milestoneProgress: [],
      assessmentProgress: []
    }
  }
];

export class LearningPathwaysService {
  async getPathways(blueprintId?: string): Promise<LearningPathway[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (blueprintId) {
        return mockPathways.filter(p => p.blueprintId === blueprintId);
      }
      
      return mockPathways;
    }

    try {
      const url = blueprintId ? `/api/learning-pathways?blueprintId=${blueprintId}` : '/api/learning-pathways';
      const response = await apiClient.get<LearningPathway[]>(url);
      return response.data;
    } catch (error) {
      console.warn('[learningPathwaysService] API failed, falling back to mock pathways:', error);
      // Fallback to mock data when API is unavailable or unauthenticated
      // Map core-style pathways to frontend LearningPathway shape
      const mapped = mockCoreLearningPathways.map((core) => ({
        id: core.id,
        title: core.name,
        description: core.description,
        blueprintId: 'bp-001',
        difficulty: core.difficulty,
        estimatedDuration: Math.ceil(core.estimatedTimeMinutes / 60 / 2),
        prerequisites: core.prerequisites,
        learningObjectives: core.steps.flatMap(s => s.learningObjectives).slice(0, 6),
        targetAudience: ['Students', 'Self-learners'],
        tags: core.tags,
        isActive: core.status !== 'paused',
        createdAt: core.createdAt,
        updatedAt: core.updatedAt,
        sections: core.steps.map((s, idx) => ({
          id: `path-sec-${s.id}`,
          pathwayId: core.id,
          title: `Step ${idx + 1}: ${s.learningObjectives[0] || s.primitiveId}`,
          description: s.learningObjectives.join(', '),
          orderIndex: s.order,
          estimatedTimeMinutes: s.estimatedTimeMinutes,
          difficulty: core.difficulty,
          contentItems: [
            ...s.notes.map((n, i) => ({
              id: `${s.id}-note-${i}`,
              sectionId: `path-sec-${s.id}`,
              title: n.title,
              contentType: 'reading' as const,
              estimatedTimeMinutes: n.estimatedTimeMinutes,
              orderIndex: i,
              isRequired: true,
            })),
            ...s.questions.map((q, i) => ({
              id: `${s.id}-q-${i}`,
              sectionId: `path-sec-${s.id}`,
              title: `Question: ${q.learningObjectives[0] || q.id}`,
              contentType: 'interactive' as const,
              estimatedTimeMinutes: q.estimatedTimeMinutes,
              orderIndex: s.notes.length + i,
              isRequired: true,
            })),
          ],
          masteryCriteria: [],
          prerequisites: s.prerequisites.map(pid => `path-sec-${pid.replace('step-', '')}`),
          isUnlocked: core.progress.currentStepIndex >= s.order,
        })),
        milestones: [],
        assessments: [],
        userProgress: {
          id: `progress-${core.id}`,
          userId: Number(core.userId.replace('user-', '') || 1),
          pathwayId: core.id,
          currentSectionId: core.steps[core.progress.currentStepIndex]?.id ? `path-sec-${core.steps[core.progress.currentStepIndex].id}` : '',
          progressPercentage: Math.round((core.progress.completedSteps / core.progress.totalSteps) * 100),
          sectionsCompleted: core.progress.completedSteps,
          totalSections: core.progress.totalSteps,
          milestonesAchieved: 0,
          totalMilestones: 0,
          assessmentsPassed: 0,
          totalAssessments: 0,
          timeSpent: Math.round(core.estimatedTimeMinutes * (core.progress.completedSteps / Math.max(core.progress.totalSteps, 1))),
          startedAt: core.createdAt,
          lastActivityAt: core.updatedAt,
          sectionProgress: core.steps.map((s) => ({
            sectionId: `path-sec-${s.id}`,
            isCompleted: s.order < core.progress.currentStepIndex,
            progressPercentage: s.order < core.progress.currentStepIndex ? 100 : s.order === core.progress.currentStepIndex ? 50 : 0,
            timeSpent: Math.round(s.estimatedTimeMinutes * (s.order < core.progress.currentStepIndex ? 1 : s.order === core.progress.currentStepIndex ? 0.5 : 0)),
            contentItemsCompleted: 0,
            totalContentItems: s.questions.length + s.notes.length,
          })),
          milestoneProgress: [],
          assessmentProgress: [],
        },
      }));

      if (blueprintId) {
        return mapped.filter(p => p.blueprintId === blueprintId);
      }
      return mapped;
    }
  }

  async getPathway(id: string): Promise<LearningPathway> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const pathway = mockPathways.find(p => p.id === id);
      if (!pathway) {
        throw new Error('Learning pathway not found');
      }
      
      return pathway;
    }

    try {
      const response = await apiClient.get<LearningPathway>(`/api/learning-pathways/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch learning pathway:', error);
      throw new Error('Failed to fetch learning pathway');
    }
  }

  async searchPathways(searchParams: PathwaySearch): Promise<LearningPathway[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let filteredPathways = [...mockPathways];
      
      if (searchParams.query) {
        const queryLower = searchParams.query.toLowerCase();
        filteredPathways = filteredPathways.filter(p => 
          p.title.toLowerCase().includes(queryLower) ||
          p.description.toLowerCase().includes(queryLower) ||
          p.tags.some(tag => tag.toLowerCase().includes(queryLower))
        );
      }
      
      if (searchParams.difficulty) {
        filteredPathways = filteredPathways.filter(p => p.difficulty === searchParams.difficulty);
      }
      
      if (searchParams.tags && searchParams.tags.length > 0) {
        filteredPathways = filteredPathways.filter(p => 
          searchParams.tags!.some(tag => p.tags.includes(tag))
        );
      }
      
      if (searchParams.estimatedDuration) {
        filteredPathways = filteredPathways.filter(p => 
          p.estimatedDuration >= searchParams.estimatedDuration!.min &&
          p.estimatedDuration <= searchParams.estimatedDuration!.max
        );
      }
      
      // Mock sorting
      if (searchParams.sortBy === 'relevance') {
        // Sort by match score (mock implementation)
        filteredPathways.sort((a, b) => b.title.length - a.title.length);
      } else if (searchParams.sortBy === 'difficulty') {
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        filteredPathways.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      }
      
      if (searchParams.sortOrder === 'desc') {
        filteredPathways.reverse();
      }
      
      // Apply limit and offset
      const start = searchParams.offset || 0;
      const end = start + (searchParams.limit || filteredPathways.length);
      return filteredPathways.slice(start, end);
    }

    try {
      const response = await apiClient.get<LearningPathway[]>('/api/learning-pathways/search', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Failed to search learning pathways:', error);
      throw new Error('Failed to search learning pathways');
    }
  }

  async getPathwayRecommendations(userId: number, blueprintId?: string): Promise<PathwayRecommendation[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock recommendations based on user progress and preferences
      const recommendations: PathwayRecommendation[] = [
        {
          pathwayId: 'pathway-1',
          title: 'Complete Blueprint Mastery',
          description: 'A comprehensive pathway to master all aspects of the blueprint system',
          matchScore: 85,
          reason: 'Based on your current progress and learning goals',
          estimatedBenefit: 90,
          prerequisitesMet: 2,
          totalPrerequisites: 2,
          estimatedTimeToStart: 0,
          tags: ['blueprint', 'mastery', 'learning', 'comprehensive']
        }
      ];
      
      return recommendations;
    }

    try {
      const url = blueprintId 
        ? `/api/learning-pathways/recommendations?userId=${userId}&blueprintId=${blueprintId}`
        : `/api/learning-pathways/recommendations?userId=${userId}`;
      
      const response = await apiClient.get<PathwayRecommendation[]>(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pathway recommendations:', error);
      throw new Error('Failed to fetch pathway recommendations');
    }
  }

  async getUserPathwayProgress(userId: number, pathwayId: string): Promise<UserPathwayProgress> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const pathway = mockPathways.find(p => p.id === pathwayId);
      if (!pathway || !pathway.userProgress) {
        throw new Error('Pathway progress not found');
      }
      
      return pathway.userProgress;
    }

    try {
      const response = await apiClient.get<UserPathwayProgress>(`/api/learning-pathways/${pathwayId}/progress?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pathway progress:', error);
      throw new Error('Failed to fetch pathway progress');
    }
  }

  async updatePathwayProgress(
    userId: number,
    pathwayId: string,
    sectionId: string,
    progress: Partial<UserPathwayProgress>
  ): Promise<UserPathwayProgress> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const pathway = mockPathways.find(p => p.id === pathwayId);
      if (!pathway || !pathway.userProgress) {
        throw new Error('Pathway progress not found');
      }
      
      Object.assign(pathway.userProgress, progress);
      pathway.userProgress.updatedAt = new Date().toISOString();
      
      return pathway.userProgress;
    }

    try {
      const response = await apiClient.patch<UserPathwayProgress>(`/api/learning-pathways/${pathwayId}/progress`, {
        userId,
        sectionId,
        ...progress
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update pathway progress:', error);
      throw new Error('Failed to update pathway progress');
    }
  }

  async getPathwayAnalytics(pathwayId: string): Promise<PathwayAnalytics> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock analytics
      return {
        pathwayId,
        totalEnrollments: 150,
        activeEnrollments: 89,
        completedEnrollments: 45,
        averageCompletionTime: 28,
        averageProgress: 67,
        completionRate: 30,
        userSatisfaction: 4.2,
        commonStruggles: [
          'Understanding UUE stage progression',
          'Setting appropriate mastery thresholds',
          'Managing section hierarchy'
        ],
        recommendations: [
          'Provide more examples of mastery criteria',
          'Add interactive tutorials for complex concepts',
          'Implement progress tracking reminders'
        ]
      };
    }

    try {
      const response = await apiClient.get<PathwayAnalytics>(`/api/learning-pathways/${pathwayId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pathway analytics:', error);
      throw new Error('Failed to fetch pathway analytics');
    }
  }

  async enrollInPathway(userId: number, pathwayId: string): Promise<UserPathwayProgress> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const pathway = mockPathways.find(p => p.id === pathwayId);
      if (!pathway) {
        throw new Error('Learning pathway not found');
      }
      
      // Create new progress entry
      const newProgress: UserPathwayProgress = {
        id: `progress-${Date.now()}`,
        userId,
        pathwayId,
        currentSectionId: pathway.sections[0]?.id || '',
        progressPercentage: 0,
        sectionsCompleted: 0,
        totalSections: pathway.sections.length,
        milestonesAchieved: 0,
        totalMilestones: pathway.milestones.length,
        assessmentsPassed: 0,
        totalAssessments: pathway.assessments.length,
        timeSpent: 0,
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        sectionProgress: [],
        milestoneProgress: [],
        assessmentProgress: []
      };
      
      // Add to pathway
      pathway.userProgress = newProgress;
      
      return newProgress;
    }

    try {
      const response = await apiClient.post<UserPathwayProgress>(`/api/learning-pathways/${pathwayId}/enroll`, { userId });
      return response.data;
    } catch (error) {
      console.error('Failed to enroll in pathway:', error);
      throw new Error('Failed to enroll in pathway');
    }
  }

  async completePathwaySection(
    userId: number,
    pathwayId: string,
    sectionId: string
  ): Promise<UserPathwayProgress> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const pathway = mockPathways.find(p => p.id === pathwayId);
      if (!pathway || !pathway.userProgress) {
        throw new Error('Pathway progress not found');
      }
      
      // Update section progress
      const sectionProgress = pathway.userProgress.sectionProgress.find(sp => sp.sectionId === sectionId);
      if (sectionProgress) {
        sectionProgress.isCompleted = true;
        sectionProgress.completedAt = new Date().toISOString();
      }
      
      // Update overall progress
      pathway.userProgress.sectionsCompleted += 1;
      pathway.userProgress.progressPercentage = (pathway.userProgress.sectionsCompleted / pathway.userProgress.totalSections) * 100;
      pathway.userProgress.lastActivityAt = new Date().toISOString();
      
      return pathway.userProgress;
    }

    try {
      const response = await apiClient.post<UserPathwayProgress>(`/api/learning-pathways/${pathwayId}/sections/${sectionId}/complete`, { userId });
      return response.data;
    } catch (error) {
      console.error('Failed to complete pathway section:', error);
      throw new Error('Failed to complete pathway section');
    }
  }
}

export const learningPathwaysService = new LearningPathwaysService();
export default learningPathwaysService;




