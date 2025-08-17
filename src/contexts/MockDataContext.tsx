import React, { createContext, useContext, ReactNode } from 'react';
import { mockBlueprints, mockSections, mockCriteria, mockQuestions, mockMasteryTracking, mockUueProgressions, mockLearningPathways, mockUserProgress, mockAnalytics } from '../data/mockData';

interface MockDataContextValue {
  // Mock data
  blueprints: typeof mockBlueprints;
  sections: typeof mockSections;
  criteria: typeof mockCriteria;
  questions: typeof mockQuestions;
  masteryTracking: typeof mockMasteryTracking;
  uueProgressions: typeof mockUueProgressions;
  learningPathways: typeof mockLearningPathways;
  userProgress: typeof mockUserProgress;
  analytics: typeof mockAnalytics;
  
  // Helper functions
  getBlueprintById: (id: string) => typeof mockBlueprints[0] | undefined;
  getSectionsByBlueprint: (blueprintId: string) => typeof mockSections;
  getCriteriaBySection: (sectionId: string) => typeof mockCriteria;
  getQuestionsByCriterion: (criterionId: string) => typeof mockQuestions;
  getMasteryTrackingByUser: (userId: string) => typeof mockMasteryTracking;
  getUueProgressionByBlueprint: (blueprintId: string) => typeof mockUueProgressions[0] | undefined;
  
  // Mock data generation
  generateMockUser: (userId: string) => any;
  generateMockProgress: (userId: string) => any;
}

const MockDataContext = createContext<MockDataContextValue | undefined>(undefined);

interface MockDataProviderProps {
  children: ReactNode;
}

export const MockDataProvider: React.FC<MockDataProviderProps> = ({ children }) => {
  const getBlueprintById = (id: string) => {
    return mockBlueprints.find(bp => bp.id === id);
  };

  const getSectionsByBlueprint = (blueprintId: string) => {
    return mockSections.filter(sec => sec.blueprintId === blueprintId);
  };

  const getCriteriaBySection = (sectionId: string) => {
    return mockCriteria.filter(crit => crit.sectionId === sectionId);
  };

  const getQuestionsByCriterion = (criterionId: string) => {
    return mockQuestions.filter(q => q.criterionId === criterionId);
  };

  const getMasteryTrackingByUser = (userId: string) => {
    return mockMasteryTracking.filter(mt => mt.userId === userId);
  };

  const getUueProgressionByBlueprint = (blueprintId: string) => {
    return mockUueProgressions.find(uue => uue.blueprintId === blueprintId);
  };

  const generateMockUser = (userId: string) => {
    return {
      id: userId,
      name: `Mock User ${userId}`,
      email: `mockuser${userId}@example.com`,
      role: 'student' as const,
      progress: mockUserProgress,
      analytics: mockAnalytics
    };
  };

  const generateMockProgress = (userId: string) => {
    return {
      ...mockUserProgress,
      userId,
      overallProgress: Math.floor(Math.random() * 100),
      currentStreak: Math.floor(Math.random() * 30),
      totalStudyTime: Math.floor(Math.random() * 500)
    };
  };

  const value: MockDataContextValue = {
    // Mock data
    blueprints: mockBlueprints,
    sections: mockSections,
    criteria: mockCriteria,
    questions: mockQuestions,
    masteryTracking: mockMasteryTracking,
    uueProgressions: mockUueProgressions,
    learningPathways: mockLearningPathways,
    userProgress: mockUserProgress,
    analytics: mockAnalytics,
    
    // Helper functions
    getBlueprintById,
    getSectionsByBlueprint,
    getCriteriaBySection,
    getQuestionsByCriterion,
    getMasteryTrackingByUser,
    getUueProgressionByBlueprint,
    
    // Mock data generation
    generateMockUser,
    generateMockProgress
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = (): MockDataContextValue => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};





