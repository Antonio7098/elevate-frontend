// Types for Dashboard API

export interface DueTodaySet {
  id: string;
  name: string;
  nextReviewAt: string; // ISO date string
  isCritical: boolean; // Derived from logic, e.g., overdue
  currentTotalMasteryScore?: number; // Mastery score from 0-1
}

export interface RecentProgressSet {
  id: string;
  name: string;
  lastReviewedAt: string; // ISO date string
  masteryScore?: number; // legacy or fallback
  currentTotalMasteryScore?: number; // new backend field
}

export interface OverallStats {
  totalSetsMastered: number;
  averageMastery: number;
  studyStreak: number;
}

export interface DashboardData {
  dueToday: DueTodaySet[];
  recentProgress: RecentProgressSet[];
  overallStats: OverallStats;
}
