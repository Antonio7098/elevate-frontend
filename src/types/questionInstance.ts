export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_in_blank' | 'matching';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'draft' | 'active' | 'archived' | 'review_required';

export interface QuestionInstance {
  id: string;
  question: string;
  answer?: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  masteryCriterionId: string;
  blueprintSectionId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  
  // Question-specific fields
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  hints?: string[];
  tags?: string[];
  
  // Relations
  userQuestionAttempts: UserQuestionAttempt[];
  masteryCriterion: MasteryCriterion;
  
  // Computed fields
  successRate?: number;
  averageTimeSpent?: number;
  isActive: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
  questionInstanceId: string;
}

export interface UserQuestionAttempt {
  id: string;
  userId: number;
  questionInstanceId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  confidenceLevel: number; // 1-5 scale
  feedback?: string;
  score?: number;
  attemptedAt: string;
  
  // Relations
  questionInstance: QuestionInstance;
}

export interface CreateQuestionData {
  question: string;
  answer?: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  masteryCriterionId: string;
  blueprintSectionId: string;
  options?: Omit<QuestionOption, 'id' | 'questionInstanceId'>[];
  correctAnswer?: string | string[];
  explanation?: string;
  hints?: string[];
  tags?: string[];
}

export interface UpdateQuestionData {
  question?: string;
  answer?: string;
  questionType?: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;
  options?: Omit<QuestionOption, 'id' | 'questionInstanceId'>[];
  correctAnswer?: string | string[];
  explanation?: string;
  hints?: string[];
  tags?: string[];
}

export interface QuestionFilter {
  blueprintSectionId?: string;
  masteryCriterionId?: string;
  questionType?: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;
  tags?: string[];
  searchTerm?: string;
}

export interface QuestionStats {
  questionId: string;
  totalAttempts: number;
  successfulAttempts: number;
  successRate: number;
  averageTimeSpent: number;
  averageConfidence: number;
  lastAttemptAt?: string;
  difficultyRating: number; // User-rated difficulty
}

export interface QuestionReview {
  questionId: string;
  reviewerId: number;
  rating: number; // 1-5 scale
  feedback?: string;
  isApproved: boolean;
  reviewedAt: string;
}

export interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  blueprintSectionId: string;
  userId: number;
  questions: QuestionInstance[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  description?: string;
  questions: QuestionInstance[];
  totalQuestions: number;
  estimatedTimeMinutes: number;
  difficulty: QuestionDifficulty;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Import types that are referenced
import type { MasteryCriterion } from './masteryCriterion';





