import { apiClient } from './apiClient';
import type { FolderStats, SetStats } from '../types/stats.types';

// Fetch statistics for a specific folder
export async function getFolderStats(folderId: string): Promise<FolderStats> {
  const response = await apiClient.get<FolderStats>(`/stats/folders/${folderId}/details`);
  return response.data;
}

// Fetch statistics for a specific question set
export async function getSetStats(setId: string): Promise<SetStats> {
  const response = await apiClient.get<SetStats>(`/stats/questionsets/${setId}/details`);
  return response.data;
}
