import type { DashboardData } from '../types/dashboard.types';

export const mockDashboardData: DashboardData = {
  dueToday: [
    { id: '1', name: 'Algebra Basics', type: 'questionSet', dueDate: '2025-08-03', itemCount: 15, progress: 0.8, lastReviewed: '2025-07-28', currentTotalMasteryScore: 0.85, isCritical: true },
    { id: '2', name: 'European History', type: 'folder', dueDate: '2025-08-03', itemCount: 5, progress: 0.6, lastReviewed: '2025-07-30', currentTotalMasteryScore: 0.65, isCritical: false },
    { id: '3', name: 'React Fundamentals', type: 'questionSet', dueDate: '2025-08-03', itemCount: 25, progress: 0.9, lastReviewed: '2025-08-01', currentTotalMasteryScore: 0.95, isCritical: false },
  ],
  recentProgress: [
    { id: '4', name: 'Advanced Calculus', type: 'questionSet', progress: 0.85, lastReviewed: '2025-08-02' },
    { id: '5', name: 'World War II', type: 'folder', progress: 0.7, lastReviewed: '2025-08-01' },
    { id: '6', name: 'Data Structures', type: 'questionSet', progress: 0.95, lastReviewed: '2025-07-31' },
  ],
};