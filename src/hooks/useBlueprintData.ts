import { useEffect, useCallback, useMemo } from 'react';
import { useBlueprintStore, useBlueprintSelectors, useBlueprintActions } from '../store/blueprintStore';
import { learningPathwaysService } from '../services/learningPathwaysService';
import type { LearningBlueprint } from '../types/blueprint.types';
import type { BlueprintSection } from '../types/blueprintSection';
import type { MasteryCriterion } from '../types/masteryCriterion';
import type { QuestionInstance } from '../types/questionInstance';
import type { MasteryTracking } from '../types/masteryTracking';
import type { UueStageProgression } from '../types/uueStage';
import type { LearningPathway } from '../types/learningPathways';

// Hook for managing blueprint data flow
export const useBlueprintData = (blueprintId?: string) => {
  const store = useBlueprintStore();
  const selectors = useBlueprintSelectors();
  const actions = useBlueprintActions();

  // Load blueprint data when blueprintId changes
  useEffect(() => {
    if (!blueprintId) {
      actions.resetCurrentContext();
      return;
    }

    // For now, just reset context without complex data loading
    // This prevents the infinite loop while keeping basic functionality
    actions.resetCurrentContext();
  }, [blueprintId]); // Removed 'actions' from dependencies

  // Memoized data selectors
  const blueprintSections = useMemo(() => {
    if (!blueprintId) return [];
    return selectors.sections.filter(section => section.blueprintId === blueprintId);
  }, [blueprintId, selectors.sections]);

  const sectionHierarchy = useMemo(() => {
    const buildHierarchy = (parentId: string | null): BlueprintSection[] => {
      return blueprintSections
        .filter(section => section.parentSectionId === parentId)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(section => ({
          ...section,
          children: buildHierarchy(section.id)
        }));
    };
    
    return buildHierarchy(null);
  }, [blueprintSections]);

  const criteriaBySection = useMemo(() => {
    const grouped: Record<string, MasteryCriterion[]> = {};
    blueprintSections.forEach(section => {
      grouped[section.id] = selectors.criteria.filter(criterion => 
        criterion.blueprintSectionId === section.id
      );
    });
    return grouped;
  }, [blueprintSections, selectors.criteria]);

  const questionsByCriterion = useMemo(() => {
    const grouped: Record<string, QuestionInstance[]> = {};
    selectors.criteria.forEach(criterion => {
      grouped[criterion.id] = selectors.questions.filter(question => 
        question.masteryCriterionId === criterion.id
      );
    });
    return grouped;
  }, [selectors.criteria, selectors.questions]);

  const masteryTrackingByCriterion = useMemo(() => {
    const grouped: Record<string, MasteryTracking[]> = {};
    selectors.criteria.forEach(criterion => {
      grouped[criterion.id] = selectors.masteryTracking.filter(tracking => 
        tracking.criterionId === criterion.id
      );
    });
    return grouped;
  }, [selectors.criteria, selectors.masteryTracking]);

  // Data mutation functions
  const createSection = useCallback(async (data: any) => {
    try {
      actions.setLoading('sections', true);
      // Mock implementation - just update local state
      const newSection: BlueprintSection = {
        id: `section-${Date.now()}`,
        title: data.title,
        description: data.description,
        blueprintId: data.blueprintId,
        parentSectionId: data.parentSectionId,
        depth: data.parentSectionId ? 1 : 0,
        orderIndex: data.orderIndex,
        difficulty: data.difficulty,
        estimatedTimeMinutes: data.estimatedTimeMinutes,
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [],
        notes: [],
        knowledgePrimitives: [],
        masteryCriteria: [],
        masteryProgress: {
          sectionId: `section-${Date.now()}`,
          totalCriteria: 0,
          masteredCriteria: 0,
          inProgressCriteria: 0,
          notStartedCriteria: 0,
          overallProgress: 0,
          lastUpdated: new Date().toISOString()
        },
        contentCount: 0,
        isExpanded: false
      };
      
      actions.addSection(newSection);
      actions.setLoading('sections', false);
      return newSection;
    } catch (error) {
      actions.setError('sections', 'Failed to create section');
      actions.setLoading('sections', false);
      throw error;
    }
  }, []);

  const updateSection = useCallback(async (sectionId: string, data: any) => {
    try {
      actions.setLoading('sections', true);
      // Mock implementation - just update local state
      const updatedSection = { ...data, id: sectionId, updatedAt: new Date().toISOString() };
      actions.updateSection(sectionId, updatedSection);
      actions.setLoading('sections', false);
      return updatedSection;
    } catch (error) {
      actions.setError('sections', 'Failed to update section');
      actions.setLoading('sections', false);
      throw error;
    }
  }, []);

  const deleteSection = useCallback(async (sectionId: string) => {
    try {
      actions.setLoading('sections', true);
      actions.removeSection(sectionId);
      actions.setLoading('sections', false);
    } catch (error) {
      actions.setError('sections', 'Failed to delete section');
      actions.setLoading('sections', false);
      throw error;
    }
  }, []);

  const createCriterion = useCallback(async (data: any) => {
    try {
      actions.setLoading('criteria', true);
      // Mock implementation - just update local state
      const newCriterion: MasteryCriterion = {
        id: `criterion-${Date.now()}`,
        title: data.title,
        description: data.description,
        weight: data.weight,
        uueStage: data.uueStage,
        complexityScore: data.complexityScore,
        knowledgePrimitiveId: data.knowledgePrimitiveId,
        blueprintSectionId: data.blueprintSectionId,
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionInstances: [],
        userCriterionMasteries: []
      };
      
      actions.addCriterion(newCriterion);
      actions.setLoading('criteria', false);
      return newCriterion;
    } catch (error) {
      actions.setError('criteria', 'Failed to create criterion');
      actions.setLoading('criteria', false);
      throw error;
    }
  }, []);

  const updateCriterion = useCallback(async (criterionId: string, data: any) => {
    try {
      actions.setLoading('criteria', true);
      // Mock implementation - just update local state
      const updatedCriterion = { ...data, id: criterionId, updatedAt: new Date().toISOString() };
      actions.updateCriterion(criterionId, updatedCriterion);
      actions.setLoading('criteria', false);
      return updatedCriterion;
    } catch (error) {
      actions.setError('criteria', 'Failed to update criterion');
      actions.setLoading('criteria', false);
      throw error;
    }
  }, []);

  const deleteCriterion = useCallback(async (criterionId: string) => {
    try {
      actions.setLoading('criteria', true);
      actions.removeCriterion(criterionId);
      actions.setLoading('criteria', false);
    } catch (error) {
      actions.setError('criteria', 'Failed to delete criterion');
      actions.setLoading('criteria', false);
      throw error;
    }
  }, []);

  return {
    // State
    blueprintSections,
    sectionHierarchy,
    criteriaBySection,
    questionsByCriterion,
    masteryTrackingByCriterion,
    
    // Actions
    createSection,
    updateSection,
    deleteSection,
    createCriterion,
    updateCriterion,
    deleteCriterion,
  };
};

// Hook for managing learning pathways data
export const useLearningPathwaysData = () => {
  const store = useBlueprintStore();
  const selectors = useBlueprintSelectors();
  const actions = useBlueprintActions();

  // Load learning pathways data
  useEffect(() => {
    const loadPathwaysData = async () => {
      try {
        actions.setLoading('pathways', true);
        actions.setError('pathways', null);
        
        const pathways = await learningPathwaysService.getPathways();
        actions.setLearningPathways(pathways);
        
        actions.setLoading('pathways', false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load learning pathways';
        actions.setError('pathways', errorMessage);
        actions.setLoading('pathways', false);
      }
    };

    loadPathwaysData();
  }, []); // Removed 'actions' from dependencies

  // Enroll in a learning pathway
  const enrollInPathway = useCallback(async (pathwayId: string) => {
    try {
      actions.setLoading('pathways', true);
      actions.setError('pathways', null);
      
      const enrollment = await learningPathwaysService.enrollInPathway(pathwayId);
      
      // Update the pathway with enrollment data
      const updatedPathway = selectors.learningPathways.find(p => p.id === pathwayId);
      if (updatedPathway) {
        actions.updateLearningPathway(pathwayId, { ...updatedPathway, enrollment });
      }
      
      actions.setLoading('pathways', false);
      return enrollment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll in pathway';
      actions.setError('pathways', errorMessage);
      actions.setLoading('pathways', false);
      throw error;
    }
  }, [selectors.learningPathways]); // Removed 'actions' from dependencies

  // Update pathway progress
  const updatePathwayProgress = useCallback(async (pathwayId: string, progress: any) => {
    try {
      actions.setLoading('pathways', true);
      actions.setError('pathways', null);
      
      const updatedProgress = await learningPathwaysService.updatePathwayProgress(pathwayId, progress);
      
      // Update the pathway with new progress
      const updatedPathway = selectors.learningPathways.find(p => p.id === pathwayId);
      if (updatedPathway) {
        actions.updateLearningPathway(pathwayId, { ...updatedPathway, progress: updatedProgress });
      }
      
      actions.setLoading('pathways', false);
      return updatedProgress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pathway progress';
      actions.setError('pathways', errorMessage);
      actions.setLoading('pathways', false);
      throw error;
    }
  }, [selectors.learningPathways]); // Removed 'actions' from dependencies

  return {
    // State
    learningPathways: selectors.learningPathways,
    currentPathway: selectors.currentPathway,
    isLoadingPathways: selectors.isLoading.pathways,
    pathwayError: selectors.errors.pathways,
    
    // Actions
    setCurrentPathway: actions.setCurrentPathway,
    enrollInPathway,
    updatePathwayProgress,
  };
};

// Hook for managing mastery review sessions
export const useMasteryReview = (criterionId?: string) => {
  const store = useBlueprintStore();
  const selectors = useBlueprintSelectors();
  const actions = useBlueprintActions();

  const criterion = useMemo(() => {
    if (!criterionId) return null;
    return selectors.criteria.find(c => c.id === criterionId);
  }, [criterionId, selectors.criteria]);

  const questions = useMemo(() => {
    if (!criterionId) return [];
    return selectors.questions.filter(q => q.masteryCriterionId === criterionId);
  }, [criterionId, selectors.questions]);

  const masteryTracking = useMemo(() => {
    if (!criterionId) return null;
    return selectors.masteryTracking.find(mt => mt.criterionId === criterionId);
  }, [criterionId, selectors.masteryTracking]);

  const startReview = useCallback(async () => {
    if (!criterionId) return;
    
    try {
      actions.setLoading('mastery', true);
      // Mock implementation - just update local state
      actions.setLoading('mastery', false);
    } catch (error) {
      actions.setError('mastery', 'Failed to start review');
      actions.setLoading('mastery', false);
      throw error;
    }
  }, [criterionId]);

  const submitAnswer = useCallback(async (questionId: string, answer: string) => {
    if (!criterionId) return;
    
    try {
      actions.setLoading('mastery', true);
      // Mock implementation - just update local state
      actions.setLoading('mastery', false);
      return { isCorrect: Math.random() > 0.5, feedback: 'Mock feedback' };
    } catch (error) {
      actions.setError('mastery', 'Failed to submit answer');
      actions.setLoading('mastery', false);
      throw error;
    }
  }, [criterionId]);

  const completeReview = useCallback(async () => {
    if (!criterionId) return;
    
    try {
      actions.setLoading('mastery', true);
      // Mock implementation - just update local state
      actions.setLoading('mastery', false);
    } catch (error) {
      actions.setError('mastery', 'Failed to complete review');
      actions.setLoading('mastery', false);
      throw error;
    }
  }, [criterionId]);

  return {
    // State
    criterion,
    questions,
    masteryTracking,
    
    // Actions
    startReview,
    submitAnswer,
    completeReview,
  };
};




