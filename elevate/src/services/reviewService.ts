import { apiClient } from './apiClient';
import type { ReviewItem } from '../types/review';

export const fetchTodaysReviews = async (): Promise<ReviewItem[]> => {
  try {
    const response = await apiClient.get<ReviewItem[]>('/reviews/today');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch today\'s reviews:', error);
    throw error;
  }
};

export type { ReviewItem };
