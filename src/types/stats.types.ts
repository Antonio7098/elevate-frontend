// Types for the Stats Page API responses and widgets

export interface MasteryHistoryPoint {
  timestamp: string; // ISO date string
  useScore?: number;
  exploreScore?: number;
  understandScore?: number;
  totalMasteryScore?: number; // Optional since it can be calculated from UUE scores
  aggregatedScore?: number; // The actual score field used in the data
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
