// Types for the Stats Page API responses and widgets

export interface MasteryHistoryPoint {
  timestamp: string; // ISO date string
  useScore: number;
  exploreScore: number;
  understandScore: number;
  totalMasteryScore: number;
}

export interface UUEScores {
  understandScore: number;
  useScore: number;
  exploreScore: number;
}

export interface SRStatus {
  lastReviewedAt: string; // ISO date string
  nextReviewAt: string; // ISO date string
  currentIntervalDays: number;
  currentForgottenPercentage: number;
}

export interface QuestionSetSummary {
  id: string;
  name: string;
  mastery: number;
  lastReviewedAt: string;
}

export interface FolderStats {
  id: string;
  name: string;
  masteryHistory: MasteryHistoryPoint[];
  questionSetSummaries: QuestionSetSummary[];
}

export interface SetStats {
  id: string;
  name: string;
  masteryHistory: MasteryHistoryPoint[];
  uueScores: UUEScores;
  srStatus: SRStatus;
}
