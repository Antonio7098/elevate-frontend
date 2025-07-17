import { apiClient } from './apiClient';
import type { FolderStats, SetStats } from '../types/stats.types';

// Fetch statistics for a specific folder
export async function getFolderStats(folderId: string): Promise<FolderStats> {
  console.log(`📊 [statsService] Fetching folder stats for folderId: ${folderId}`);
  const response = await apiClient.get<FolderStats>(`/stats/folders/${folderId}/details`);
  console.log(`📊 [statsService] Folder stats response:`, response.data);
  console.log(`📊 [statsService] Mastery history length:`, response.data.masteryHistory?.length || 0);
  console.log(`📊 [statsService] Mastery history data:`, response.data.masteryHistory);
  return response.data;
}

// Fetch statistics for a specific question set
export async function getSetStats(setId: string): Promise<SetStats> {
  console.log(`📊 [statsService] Fetching set stats for setId: ${setId}`);
  const response = await apiClient.get<SetStats>(`/stats/questionsets/${setId}/details`);
  console.log(`📊 [statsService] Set stats response:`, response.data);
  console.log(`📊 [statsService] Mastery history length:`, response.data.masteryHistory?.length || 0);
  console.log(`📊 [statsService] Mastery history data:`, response.data.masteryHistory);
  return response.data;
}
