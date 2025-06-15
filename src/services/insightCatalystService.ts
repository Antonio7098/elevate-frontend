import apiClient from './apiClient';
import type { InsightCatalyst } from '../types/insightCatalyst.types';

export const getCatalystsForNote = async (noteId: string): Promise<InsightCatalyst[]> => {
  try {
    const response = await apiClient.get(`/insight-catalysts?noteId=${noteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching catalysts for note:', error);
    throw error;
  }
};

export const createCatalyst = async (noteId: string, catalyst: Partial<InsightCatalyst>): Promise<InsightCatalyst> => {
  try {
    const response = await apiClient.post('/insight-catalysts', {
      ...catalyst,
      noteId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating catalyst:', error);
    throw error;
  }
};

export const updateCatalyst = async (noteId: string, catalystId: string, updates: Partial<InsightCatalyst>): Promise<InsightCatalyst> => {
  try {
    const response = await apiClient.put(`/insight-catalysts/${catalystId}`, {
      ...updates,
      noteId
    });
    return response.data;
  } catch (error) {
    console.error('Error updating catalyst:', error);
    throw error;
  }
};

export const deleteCatalyst = async (noteId: string, catalystId: string): Promise<void> => {
  try {
    await apiClient.delete(`/insight-catalysts/${catalystId}`);
  } catch (error) {
    console.error('Error deleting catalyst:', error);
    throw error;
  }
}; 