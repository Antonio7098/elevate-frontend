import type { BlueprintSection } from '../types/blueprintSection';
import type { MasteryCriterion } from '../types/masteryCriterion';
import type { QuestionInstance } from '../types/questionInstance';
import type { MasteryTracking } from '../types/masteryTracking';
import type { UueStageProgression } from '../types/uueStage';
import type { LearningPathway } from '../types/learningPathways';

// Section hierarchy utilities
export const buildSectionHierarchy = (
  sections: BlueprintSection[],
  parentId: string | null = null
): BlueprintSection[] => {
  return sections
    .filter(section => section.parentSectionId === parentId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(section => ({
      ...section,
      children: buildSectionHierarchy(sections, section.id)
    }));
};

export const flattenSectionHierarchy = (
  sections: BlueprintSection[],
  result: BlueprintSection[] = []
): BlueprintSection[] => {
  sections.forEach(section => {
    result.push(section);
    if (section.children && section.children.length > 0) {
      flattenSectionHierarchy(section.children, result);
    }
  });
  return result;
};

export const getSectionPath = (
  sections: BlueprintSection[],
  targetId: string,
  currentPath: BlueprintSection[] = []
): BlueprintSection[] | null => {
  for (const section of sections) {
    const newPath = [...currentPath, section];
    
    if (section.id === targetId) {
      return newPath;
    }
    
    if (section.children && section.children.length > 0) {
      const result = getSectionPath(section.children, targetId, newPath);
      if (result) return result;
    }
  }
  
  return null;
};

export const getSectionDepth = (
  sections: BlueprintSection[],
  targetId: string,
  currentDepth: number = 0
): number => {
  for (const section of sections) {
    if (section.id === targetId) {
      return currentDepth;
    }
    
    if (section.children && section.children.length > 0) {
      const result = getSectionDepth(section.children, targetId, currentDepth + 1);
      if (result !== -1) return result;
    }
  }
  
  return -1;
};

// Data aggregation utilities
export const aggregateSectionStats = (
  sections: BlueprintSection[],
  criteria: MasteryCriterion[],
  questions: QuestionInstance[],
  masteryTracking: MasteryTracking[]
) => {
  const stats = {
    totalSections: sections.length,
    totalCriteria: criteria.length,
    totalQuestions: questions.length,
    totalMasteryTracking: masteryTracking.length,
    sectionsByLevel: {} as Record<string, number>,
    criteriaByUueStage: {} as Record<string, number>,
    questionsByType: {} as Record<string, number>,
    masteryProgress: {
      notStarted: 0,
      inProgress: 0,
      mastered: 0,
      total: masteryTracking.length
    }
  };

  // Count sections by difficulty level
  sections.forEach(section => {
    const level = section.difficulty || 'unknown';
    stats.sectionsByLevel[level] = (stats.sectionsByLevel[level] || 0) + 1;
  });

  // Count criteria by UUE stage
  criteria.forEach(criterion => {
    const stage = criterion.uueStage || 'unknown';
    stats.criteriaByUueStage[stage] = (stats.criteriaByUueStage[stage] || 0) + 1;
  });

  // Count questions by type
  questions.forEach(question => {
    const type = question.questionType || 'unknown';
    stats.questionsByType[type] = (stats.questionsByType[type] || 0) + 1;
  });

  // Calculate mastery progress
  masteryTracking.forEach(tracking => {
    if (tracking.currentLevel === 0) {
      stats.masteryProgress.notStarted++;
    } else if (tracking.currentLevel >= tracking.targetLevel) {
      stats.masteryProgress.mastered++;
    } else {
      stats.masteryProgress.inProgress++;
    }
  });

  return stats;
};

export const calculateBlueprintProgress = (
  sections: BlueprintSection[],
  criteria: MasteryCriterion[],
  masteryTracking: MasteryTracking[]
) => {
  if (criteria.length === 0) return 0;

  const totalWeight = criteria.reduce((sum, criterion) => sum + (criterion.weight || 1), 0);
  const weightedProgress = criteria.reduce((sum, criterion) => {
    const tracking = masteryTracking.find(mt => mt.criterionId === criterion.id);
    const progress = tracking ? Math.min(tracking.currentLevel / (tracking.targetLevel || 1), 1) : 0;
    return sum + (progress * (criterion.weight || 1));
  }, 0);

  return Math.round((weightedProgress / totalWeight) * 100);
};

export const calculateSectionProgress = (
  sectionId: string,
  criteria: MasteryCriterion[],
  masteryTracking: MasteryTracking[]
) => {
  const sectionCriteria = criteria.filter(c => c.sectionId === sectionId);
  if (sectionCriteria.length === 0) return 0;

  const totalWeight = sectionCriteria.reduce((sum, criterion) => sum + (criterion.weight || 1), 0);
  const weightedProgress = sectionCriteria.reduce((sum, criterion) => {
    const tracking = masteryTracking.find(mt => mt.criterionId === criterion.id);
    const progress = tracking ? Math.min(tracking.currentLevel / (tracking.targetLevel || 1), 1) : 0;
    return sum + (progress * (criterion.weight || 1));
  }, 0);

  return Math.round((weightedProgress / totalWeight) * 100);
};

// Data filtering utilities
export const filterSectionsByDifficulty = (
  sections: BlueprintSection[],
  difficulty: string
): BlueprintSection[] => {
  return sections.filter(section => section.difficulty === difficulty);
};

export const filterCriteriaByUueStage = (
  criteria: MasteryCriterion[],
  uueStage: string
): MasteryCriterion[] => {
  return criteria.filter(criterion => criterion.uueStage === uueStage);
};

export const filterQuestionsByType = (
  questions: QuestionInstance[],
  questionType: string
): QuestionInstance[] => {
  return questions.filter(question => question.questionType === questionType);
};

export const filterMasteryTrackingByLevel = (
  masteryTracking: MasteryTracking[],
  minLevel: number,
  maxLevel?: number
): MasteryTracking[] => {
  return masteryTracking.filter(tracking => {
    if (maxLevel !== undefined) {
      return tracking.currentLevel >= minLevel && tracking.currentLevel <= maxLevel;
    }
    return tracking.currentLevel >= minLevel;
  });
};

// Search utilities
export const searchSections = (
  sections: BlueprintSection[],
  query: string
): BlueprintSection[] => {
  const lowerQuery = query.toLowerCase();
  return sections.filter(section => 
    section.title.toLowerCase().includes(lowerQuery) ||
    (section.description && section.description.toLowerCase().includes(lowerQuery))
  );
};

export const searchCriteria = (
  criteria: MasteryCriterion[],
  query: string
): MasteryCriterion[] => {
  const lowerQuery = query.toLowerCase();
  return criteria.filter(criterion => 
    criterion.title.toLowerCase().includes(lowerQuery) ||
    (criterion.description && criterion.description.toLowerCase().includes(lowerQuery))
  );
};

export const searchQuestions = (
  questions: QuestionInstance[],
  query: string
): QuestionInstance[] => {
  const lowerQuery = query.toLowerCase();
  return questions.filter(question => 
    question.questionText.toLowerCase().includes(lowerQuery) ||
    (question.explanation && question.explanation.toLowerCase().includes(lowerQuery))
  );
};

// Data validation utilities
export const validateSectionData = (section: Partial<BlueprintSection>): string[] => {
  const errors: string[] = [];
  
  if (!section.title || section.title.trim().length === 0) {
    errors.push('Section title is required');
  }
  
  if (section.title && section.title.length > 200) {
    errors.push('Section title must be less than 200 characters');
  }
  
  if (section.description && section.description.length > 1000) {
    errors.push('Section description must be less than 1000 characters');
  }
  
  if (section.estimatedTime && section.estimatedTime < 0) {
    errors.push('Estimated time must be positive');
  }
  
  if (section.orderIndex && section.orderIndex < 0) {
    errors.push('Order index must be positive');
  }
  
  return errors;
};

export const validateCriterionData = (criterion: Partial<MasteryCriterion>): string[] => {
  const errors: string[] = [];
  
  if (!criterion.title || criterion.title.trim().length === 0) {
    errors.push('Criterion title is required');
  }
  
  if (criterion.title && criterion.title.length > 200) {
    errors.push('Criterion title must be less than 200 characters');
  }
  
  if (criterion.description && criterion.description.length > 1000) {
    errors.push('Criterion description must be less than 1000 characters');
  }
  
  if (criterion.weight && (criterion.weight < 0 || criterion.weight > 10)) {
    errors.push('Criterion weight must be between 0 and 10');
  }
  
  if (criterion.complexityScore && (criterion.complexityScore < 0 || criterion.complexityScore > 100)) {
    errors.push('Criterion complexity score must be between 0 and 100');
  }
  
  return errors;
};

export const validateQuestionData = (question: Partial<QuestionInstance>): string[] => {
  const errors: string[] = [];
  
  if (!question.questionText || question.questionText.trim().length === 0) {
    errors.push('Question text is required');
  }
  
  if (question.questionText && question.questionText.length > 2000) {
    errors.push('Question text must be less than 2000 characters');
  }
  
  if (question.explanation && question.explanation.length > 1000) {
    errors.push('Question explanation must be less than 1000 characters');
  }
  
  if (question.points && question.points < 0) {
    errors.push('Question points must be positive');
  }
  
  if (question.timeLimit && question.timeLimit < 0) {
    errors.push('Question time limit must be positive');
  }
  
  return errors;
};

// Data transformation utilities
export const transformSectionsForExport = (sections: BlueprintSection[]) => {
  return sections.map(section => ({
    id: section.id,
    title: section.title,
    description: section.description,
    difficulty: section.difficulty,
    estimatedTime: section.estimatedTime,
    orderIndex: section.orderIndex,
    parentSectionId: section.parentSectionId,
    blueprintId: section.blueprintId,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  }));
};

export const transformCriteriaForExport = (criteria: MasteryCriterion[]) => {
  return criteria.map(criterion => ({
    id: criterion.id,
    title: criterion.title,
    description: criterion.description,
    uueStage: criterion.uueStage,
    weight: criterion.weight,
    complexityScore: criterion.complexityScore,
    sectionId: criterion.sectionId,
    blueprintId: criterion.blueprintId,
    createdAt: criterion.createdAt,
    updatedAt: criterion.updatedAt,
  }));
};

export const transformQuestionsForExport = (questions: QuestionInstance[]) => {
  return questions.map(question => ({
    id: question.id,
    questionText: question.questionText,
    questionType: question.questionType,
    explanation: question.explanation,
    points: question.points,
    timeLimit: question.timeLimit,
    criterionId: question.criterionId,
    blueprintId: question.blueprintId,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  }));
};

// Performance utilities
export const memoizeDataOperation = <T, R>(
  operation: (data: T) => R,
  getKey: (data: T) => string
) => {
  const cache = new Map<string, R>();
  
  return (data: T): R => {
    const key = getKey(data);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = operation(data);
    cache.set(key, result);
    return result;
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};





