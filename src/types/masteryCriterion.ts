export type UueStage = 'UNDERSTAND' | 'USE' | 'EXPLORE';

export interface MasteryCriterion {
  id: string;
  title: string;
  description?: string;
  weight: number;
  uueStage: UueStage;
  complexityScore?: number;
  knowledgePrimitiveId: string;
  blueprintSectionId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  questionInstances: QuestionInstance[];
  userCriterionMasteries: UserCriterionMastery[];
  
  // Computed fields
  masteryProgress?: CriterionMasteryProgress;
  nextReviewAt?: string;
  isDue?: boolean;
}

export interface QuestionInstance {
  id: string;
  question: string;
  answer?: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  masteryCriterionId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  userQuestionAttempts: UserQuestionAttempt[];
}

export interface UserCriterionMastery {
  id: string;
  userId: number;
  criterionId: string;
  currentLevel: number; // 0-5 scale
  totalAttempts: number;
  successfulAttempts: number;
  lastAttemptAt: string;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  successRate: number;
  isMastered: boolean;
  daysUntilNextReview: number;
}

export interface CriterionMasteryProgress {
  criterionId: string;
  userId: number;
  currentLevel: number;
  targetLevel: number;
  progressPercentage: number;
  totalAttempts: number;
  successfulAttempts: number;
  lastAttemptAt: string;
  nextReviewAt: string;
  isDue: boolean;
  isMastered: boolean;
}

export interface UserQuestionAttempt {
  id: string;
  userId: number;
  questionInstanceId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  confidenceLevel: number; // 1-5 scale
  feedback?: string;
  attemptedAt: string;
}

export interface CreateCriterionData {
  title: string;
  description?: string;
  weight: number;
  uueStage: UueStage;
  complexityScore?: number;
  knowledgePrimitiveId: string;
  blueprintSectionId: string;
}

export interface UpdateCriterionData {
  title?: string;
  description?: string;
  weight?: number;
  uueStage?: UueStage;
  complexityScore?: number;
}

export interface PerformanceData {
  timeSpentSeconds: number;
  confidenceLevel: number;
  userAnswer: string;
  feedback?: string;
}

export interface MasteryUpdateResult {
  criterionId: string;
  userId: number;
  newLevel: number;
  progressPercentage: number;
  nextReviewAt: string;
  isMastered: boolean;
  message: string;
}

export interface CriterionMasteryResult {
  criterionId: string;
  userId: number;
  currentLevel: number;
  targetLevel: number;
  progressPercentage: number;
  totalAttempts: number;
  successfulAttempts: number;
  successRate: number;
  lastAttemptAt: string;
  nextReviewAt: string;
  isDue: boolean;
  isMastered: boolean;
  canProgressToNextStage: boolean;
}





