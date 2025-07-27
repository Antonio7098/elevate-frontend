import type { AxiosError, AxiosResponse } from 'axios';
import api from './api';

// Helper function to handle API responses
const handleResponse = async (response: AxiosResponse) => {
  if (!response.data) {
    throw new Error('No data received from server');
  }
  return response.data;
};

// Helper function to handle API errors
const handleError = (error: AxiosError, defaultMessage: string) => {
  console.error('API Error:', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    url: error.config?.url,
  });
  throw new Error((error.response?.data as { message: string })?.message || defaultMessage);
};

export interface MasteryHistoryPoint {
  timestamp: string;
  score: number;
}

export interface OverallStats {
  masteryScore: number;
  understandScore: number;
  useScore: number;
  exploreScore: number;
  totalSets: number;
  masteredSets: number;
  inProgressSets: number;
  notStartedSets: number;
  dueSets: number;
  masteryHistory: MasteryHistoryPoint[];
}

export interface FolderSummary {
  id: string;
  name: string;
  masteryScore: number;
  currentMasteryScore: number; // Current mastery score (0-100)
  questionSetCount: number;
  lastStudied?: string;
}

export async function fetchOverallStats(): Promise<OverallStats> {
  try {
    const response = await api.get('/api/reviews/stats');
    return handleResponse(response);
  } catch (error: unknown) {
    return handleError(error as AxiosError, 'Failed to fetch overall stats');
  }
}

export async function fetchFolders(): Promise<FolderSummary[]> {
  try {
    const response = await api.get('/api/folders');
    return handleResponse(response) || [];
  } catch (error: unknown) {
    return handleError(error as AxiosError, 'Failed to fetch folders');
  }
}

export interface FolderStatsDetails {
  id: string;
  name?: string; // Optional as it might not be in the API response
  masteryHistory: { timestamp: string; score: number }[];
  understandScore?: number; // Optional as it might not be in the API response
  useScore?: number; // Optional as it might not be in the API response
  exploreScore?: number; // Optional as it might not be in the API response
  questionSetSummaries?: QuestionSetSummary[]; // Optional for backward compatibility
  questionSets?: unknown[]; // Actual API response field
  subfolders?: unknown[]; // Actual API response field
  totalReviewSessionsInFolder?: number; // Actual API response field
}

export interface QuestionSetSummary {
  id: string;
  name: string;
  masteryScore: number;
  currentMasteryScore: number; // Current mastery score (0-100)
  questionCount: number;
}

export async function fetchFolderStats(folderId: string): Promise<FolderStatsDetails> {
  const res = await api.get(`/api/stats/folders/${folderId}/details`);
  return res.data;
}

export interface QuestionSetStatsDetails {
  id: string;
  name: string;
  masteryHistory: { timestamp: string; score: number }[];
  understandScore: number;
  useScore: number;
  exploreScore: number;
}

export interface QuestionStat {
  id: string;
  text: string;
  score: number;
  total: number;
}

export async function fetchQuestionSetStats(setId: string): Promise<QuestionSetStatsDetails> {
  const res = await api.get(`/api/stats/questionsets/${setId}/details`);
  return res.data;
}

export async function fetchQuestionSetQuestions(setId: string): Promise<QuestionStat[]> {
  const res = await api.get(`/api/questionsets/${setId}/questions`);
  return res.data;
}
