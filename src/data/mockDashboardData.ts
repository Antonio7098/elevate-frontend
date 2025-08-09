import type { DashboardData } from '../types/dashboard.types';

export const mockDashboardData: DashboardData = {
  dueToday: [
    { id: '1', name: 'Algebra Basics', nextReviewAt: '2025-08-03', currentTotalMasteryScore: 0.85, isCritical: true, isCore: false, folderId: '1' },
    { id: '2', name: 'European History', nextReviewAt: '2025-08-03', currentTotalMasteryScore: 0.65, isCritical: false, isCore: true, folderId: '2' },
    { id: '3', name: 'React Fundamentals', nextReviewAt: '2025-08-03', currentTotalMasteryScore: 0.95, isCritical: false, isCore: false, folderId: '3' },
  ],
  recentProgress: [
    { id: '4', name: 'Advanced Calculus', lastReviewedAt: '2025-08-02', currentTotalMasteryScore: 0.85 },
    { id: '5', name: 'World War II', lastReviewedAt: '2025-08-01', currentTotalMasteryScore: 0.7 },
    { id: '6', name: 'Data Structures', lastReviewedAt: '2025-07-31', currentTotalMasteryScore: 0.95 },
  ],
  overallStats: {
    totalSetsMastered: 10,
    averageMastery: 0.8,
    studyStreak: 5,
  },
};