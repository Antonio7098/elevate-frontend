import { apiClient } from './apiClient';
import type { DashboardData } from '../types/dashboard.types';

export async function getDashboardData(): Promise<DashboardData> {
  const response = await apiClient.get<DashboardData>('/dashboard');
  return response.data;
}
