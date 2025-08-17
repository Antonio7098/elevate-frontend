export type UueStage = 'UNDERSTAND' | 'USE' | 'EXPLORE';

export interface UueStageProgression {
  id: string;
  userId: number;
  blueprintSectionId: string;
  currentStage: UueStage;
  stageProgress: number; // 0-100 percentage
  isUnlocked: boolean;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  lastActivityAt: string;
  
  // Stage-specific data
  stageData: UueStageData;
  
  // Relations
  masteryCriteria: MasteryCriterion[];
  stageRequirements: StageRequirement[];
}

export interface UueStageData {
  stage: UueStage;
  title: string;
  description: string;
  requirements: string[];
  estimatedTimeMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: UueStage[];
  unlocks: UueStage[];
  
  // Stage-specific settings
  masteryThreshold: number; // Level required to complete stage
  reviewIntervalDays: number;
  minimumAttempts: number;
}

export interface StageRequirement {
  id: string;
  stageId: string;
  requirementType: 'mastery_criterion' | 'time_spent' | 'questions_answered' | 'consecutive_successes';
  requirementValue: number;
  currentValue: number;
  isMet: boolean;
  description: string;
}

export interface StageTransition {
  id: string;
  userId: number;
  blueprintSectionId: string;
  fromStage: UueStage;
  toStage: UueStage;
  transitionReason: 'requirements_met' | 'manual_override' | 'admin_action';
  requirementsMet: StageRequirement[];
  transitionedAt: string;
  notes?: string;
}

export interface StageLock {
  id: string;
  userId: number;
  blueprintSectionId: string;
  stage: UueStage;
  lockReason: 'prerequisites_not_met' | 'admin_locked' | 'temporary_lock';
  lockMessage: string;
  lockedAt: string;
  unlockedAt?: string;
  adminNotes?: string;
}

export interface StageProgress {
  stage: UueStage;
  isUnlocked: boolean;
  isCompleted: boolean;
  progressPercentage: number;
  requirementsMet: number;
  totalRequirements: number;
  estimatedTimeRemaining: number;
  lastActivityAt: string;
  
  // Detailed breakdown
  masteryProgress: MasteryProgress;
  timeProgress: TimeProgress;
  questionProgress: QuestionProgress;
}

export interface MasteryProgress {
  totalCriteria: number;
  masteredCriteria: number;
  inProgressCriteria: number;
  notStartedCriteria: number;
  progressPercentage: number;
}

export interface TimeProgress {
  timeSpent: number; // in minutes
  estimatedTime: number;
  progressPercentage: number;
  averageTimePerDay: number;
}

export interface QuestionProgress {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  progressPercentage: number;
  successRate: number;
}

export interface StageAnalytics {
  stage: UueStage;
  totalUsers: number;
  usersInStage: number;
  usersCompleted: number;
  averageCompletionTime: number; // in days
  averageAttempts: number;
  successRate: number;
  commonStruggles: string[];
  recommendations: string[];
}

export interface StageRecommendation {
  stage: UueStage;
  recommendationType: 'prerequisite' | 'next_step' | 'review' | 'practice';
  priority: 'high' | 'medium' | 'low';
  reason: string;
  estimatedBenefit: number; // 0-100 score
  actionItems: string[];
}

export interface StageGoal {
  id: string;
  userId: number;
  blueprintSectionId: string;
  targetStage: UueStage;
  targetDate: string;
  currentStage: UueStage;
  progressPercentage: number;
  isAchieved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StageReminder {
  id: string;
  userId: number;
  blueprintSectionId: string;
  stage: UueStage;
  reminderType: 'daily' | 'weekly' | 'milestone' | 'due_date';
  message: string;
  isActive: boolean;
  nextReminderAt: string;
  createdAt: string;
  updatedAt: string;
}

// Import types that are referenced
import type { MasteryCriterion } from './masteryCriterion';
import type { MasteryProgress as MasteryProgressType } from './masteryTracking';





