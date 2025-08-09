import apiClient from './apiClient';
import type { InsightCatalyst } from '../types/insightCatalyst.types';

// Mock data for development
const mockCatalysts: InsightCatalyst[] = [
  {
    id: '1',
    noteId: '302',
    type: 'question',
    text: 'What are the key principles of Newtonian physics?',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      importance: 0.8,
      status: 'active'
    }
  },
  {
    id: '2',
    noteId: '302',
    type: 'reflection',
    text: 'How do these laws apply to everyday motion?',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      importance: 0.6,
      status: 'active'
    }
  },
  {
    id: '3',
    noteId: '302',
    type: 'connection',
    text: 'This connects to the concept of momentum and energy conservation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      importance: 0.7,
      status: 'active'
    }
  }
];

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const getCatalystsForNote = async (noteId: string): Promise<InsightCatalyst[]> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCatalysts.filter(catalyst => catalyst.noteId === noteId);
  }

  try {
    const response = await apiClient.get(`/insight-catalysts?noteId=${noteId}`);
    
    // Ensure all catalysts have required fields
    const catalysts = response.data.map((catalyst: any) => ({
      id: catalyst.id || `catalyst-${Date.now()}`,
      noteId: catalyst.noteId || noteId,
      type: catalyst.type || 'insight',
      text: catalyst.text || 'No content available',
      createdAt: catalyst.createdAt || new Date().toISOString(),
      updatedAt: catalyst.updatedAt || new Date().toISOString(),
      metadata: catalyst.metadata || {}
    }));
    
    return catalysts;
  } catch (error) {
    console.warn('Failed to fetch catalysts from backend, using mock data:', error);
    return mockCatalysts.filter(catalyst => catalyst.noteId === noteId);
  }
};

export const createCatalyst = async (noteId: string, catalyst: Partial<InsightCatalyst>): Promise<InsightCatalyst> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const newCatalyst: InsightCatalyst = {
      id: `catalyst-${Date.now()}`,
      noteId,
      type: catalyst.type || 'insight',
      text: catalyst.text || 'New catalyst...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: catalyst.metadata || {}
    };
    return newCatalyst;
  }

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
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const updatedCatalyst: InsightCatalyst = {
      id: catalystId,
      noteId,
      type: updates.type || 'insight',
      text: updates.text || 'Updated catalyst...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: updates.metadata || {}
    };
    return updatedCatalyst;
  }

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
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return;
  }

  try {
    await apiClient.delete(`/insight-catalysts/${catalystId}`);
  } catch (error) {
    console.error('Error deleting catalyst:', error);
    throw error;
  }
}; 