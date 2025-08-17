export interface MasteryTracking {
  id: string;
  userId: number;
  blueprintSectionId: string;
  masteryCriterionId: string;
  currentLevel: number; // 0-5 scale
  targetLevel: number;
  totalAttempts: number;
  successfulAttempts: number;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  lastAttemptAt: string;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields
  successRate: number;
  progressPercentage: number;
  isMastered: boolean;
  isDue: boolean;
  daysUntilNextReview: number;
}

export interface MasteryProgress {
  sectionId: string;
  totalCriteria: number;
  masteredCriteria: number;
  inProgressCriteria: number;
  notStartedCriteria: number;
  overallProgress: number; // 0-100 percentage
  lastUpdated: string;
  
  // Detailed breakdown
  criteriaProgress: CriterionProgress[];
  uueStageProgress: UueStageProgress[];
}

export interface CriterionProgress {
  criterionId: string;
  title: string;
  currentLevel: number;
  targetLevel: number;
  progressPercentage: number;
  isMastered: boolean;
  isDue: boolean;
  nextReviewAt: string;
  lastAttemptAt?: string;
}

export interface UueStageProgress {
  stage: 'UNDERSTAND' | 'USE' | 'EXPLORE';
  totalCriteria: number;
  masteredCriteria: number;
  inProgressCriteria: number;
  notStartedCriteria: number;
  progressPercentage: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface MasteryThreshold {
  id: string;
  userId: number;
  blueprintSectionId: string;
  criterionId: string;
  thresholdLevel: number; // Level required to consider "mastered"
  reviewIntervalDays: number; // Days between reviews
  minimumAttempts: number; // Minimum attempts before mastery
  successRateThreshold: number; // Minimum success rate (0-100)
  createdAt: string;
  updatedAt: string;
}

export interface MasteryReview {
  id: string;
  userId: number;
  criterionId: string;
  questionInstanceId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  confidenceLevel: number; // 1-5 scale
  feedback?: string;
  score?: number;
  attemptedAt: string;
  
  // Mastery calculation
  previousLevel: number;
  newLevel: number;
  levelChange: number;
  masteryUpdate: MasteryUpdate;
}

export interface MasteryUpdate {
  criterionId: string;
  userId: number;
  previousLevel: number;
  newLevel: number;
  levelChange: number;
  reason: 'correct_answer' | 'incorrect_answer' | 'time_bonus' | 'confidence_bonus' | 'streak_bonus';
  bonusPoints?: number;
  nextReviewAt: string;
  isMastered: boolean;
  message: string;
}

export interface MasteryStats {
  userId: number;
  blueprintSectionId?: string;
  totalCriteria: number;
  masteredCriteria: number;
  inProgressCriteria: number;
  notStartedCriteria: number;
  overallProgress: number;
  averageLevel: number;
  totalAttempts: number;
  totalTimeSpent: number;
  lastActivity: string;
  
  // Time-based stats
  dailyProgress: DailyProgress[];
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
}

export interface DailyProgress {
  date: string;
  criteriaAttempted: number;
  criteriaMastered: number;
  timeSpent: number;
  progressGained: number;
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  totalCriteriaAttempted: number;
  totalCriteriaMastered: number;
  totalTimeSpent: number;
  averageDailyProgress: number;
  streakDays: number;
}

export interface MonthlyProgress {
  month: string;
  year: number;
  totalCriteriaAttempted: number;
  totalCriteriaMastered: number;
  totalTimeSpent: number;
  averageWeeklyProgress: number;
  monthlyGoalAchieved: boolean;
}

export interface MasteryGoal {
  id: string;
  userId: number;
  blueprintSectionId: string;
  targetDate: string;
  targetProgress: number; // 0-100 percentage
  currentProgress: number;
  isAchieved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MasteryReminder {
  id: string;
  userId: number;
  criterionId: string;
  reminderType: 'daily' | 'weekly' | 'due_date';
  message: string;
  isActive: boolean;
  nextReminderAt: string;
  createdAt: string;
  updatedAt: string;
}





