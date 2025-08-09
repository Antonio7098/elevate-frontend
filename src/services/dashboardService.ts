import { apiClient } from './apiClient';
import type { DashboardData } from '../types/dashboard.types';

// Development mode flag - set to true to use mock data
const USE_MOCK_DATA = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

console.log('🔧 [dashboardService] Environment check:', {
  DEV: import.meta.env.DEV,
  VITE_USE_MOCK_AUTH: import.meta.env.VITE_USE_MOCK_AUTH,
  USE_MOCK_DATA: USE_MOCK_DATA
});

// Mock dashboard data
const mockDashboardData: DashboardData = {
  dueToday: [
    {
      id: '1',
      name: 'Algebra Basics',
      nextReviewAt: '2025-01-16T10:00:00Z',
      isCritical: true,
      isCore: true,
      currentTotalMasteryScore: 0.85,
      folderId: '3',
      dueLabel: 'Due today'
    },
    {
      id: '2',
      name: 'Calculus I',
      nextReviewAt: '2025-01-17T14:30:00Z',
      isCritical: false,
      isCore: true,
      currentTotalMasteryScore: 0.65,
      folderId: '1',
      dueLabel: 'Due tomorrow'
    }
  ],
  recentProgress: [
    {
      id: '1',
      name: 'Algebra Basics',
      lastReviewedAt: '2025-01-15T10:00:00Z',
      currentTotalMasteryScore: 0.85
    },
    {
      id: '2',
      name: 'Key Formulas',
      lastReviewedAt: '2025-01-14T15:30:00Z',
      currentTotalMasteryScore: 0.6
    }
  ],
  overallStats: {
    totalSetsMastered: 5,
    averageMastery: 0.72,
    studyStreak: 7
  }
};

export async function getDashboardData(): Promise<DashboardData> {
  if (USE_MOCK_DATA) {
    console.log('🎭 [dashboardService] Using mock dashboard data');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDashboardData;
  }

  try {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
  } catch (error) {
    console.error('❌ [dashboardService] Failed to fetch dashboard data:', error);
    // Fallback to mock data if real API fails
    console.log('🎭 [dashboardService] Falling back to mock dashboard data');
    return mockDashboardData;
  }
}
