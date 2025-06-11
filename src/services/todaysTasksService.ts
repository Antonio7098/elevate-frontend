import { apiClient } from './apiClient';

export interface QuestionWithContext {
  id: number;
  text: string;
  options?: string[];
  questionType: string;
  uueFocus?: string;
  conceptTags?: string[];
  totalMarksAvailable?: number;
  questionSetId: number;
  questionSetName: string;
  selectedForUUEFocus?: string;
  selfMark: number | null;
  autoMark: number | null;
  aiGenerated: boolean;
  inCat: boolean;
}

export interface TodaysTasksResponse {
  criticalQuestions: QuestionWithContext[];
  coreQuestions: QuestionWithContext[];
  plusQuestions: QuestionWithContext[];
  targetQuestionCount: number;
  selectedCoreAndCriticalCount: number;
}

export async function getTodaysTasks(mockToday?: string): Promise<TodaysTasksResponse> {
  const params = mockToday ? { mockToday } : undefined;
  const res = await apiClient.get<TodaysTasksResponse>('/todays-tasks', { params });
  return res.data;
}
