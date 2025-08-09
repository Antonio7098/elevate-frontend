import { apiClient } from './apiClient';
import type { MindmapPayload, MindmapNode, MindmapEdge } from '../types/blueprint.types';

// Mock data for development
const mockMindmapData: MindmapPayload = {
  blueprintId: '208',
  version: 1,
  nodes: [
    {
      id: '1',
      type: 'default',
      position: { x: 250, y: 100 },
      data: { label: 'Main Topic' },
    },
    {
      id: '2',
      type: 'default',
      position: { x: 100, y: 200 },
      data: { label: 'Sub Topic 1' },
    },
    {
      id: '3',
      type: 'default',
      position: { x: 400, y: 200 },
      data: { label: 'Sub Topic 2' },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
  ],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const getBlueprintMindmap = async (blueprintId: string): Promise<MindmapPayload> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockMindmapData, blueprintId };
  }

  try {
    const response = await apiClient.get<MindmapPayload>(`/blueprints/${blueprintId}/mindmap`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch mindmap from backend, using mock data:', error);
    return { ...mockMindmapData, blueprintId };
  }
};

export const updateBlueprintMindmap = async (
  blueprintId: string,
  payload: Omit<MindmapPayload, 'blueprintId' | 'metadata'>
): Promise<MindmapPayload> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ...payload,
      blueprintId,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  try {
    const response = await apiClient.put<MindmapPayload>(`/blueprints/${blueprintId}/mindmap`, payload);
    return response.data;
  } catch (error) {
    console.warn('Failed to update mindmap on backend:', error);
    // Return the payload as if it was saved successfully
    return {
      ...payload,
      blueprintId,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
};

export default {
  getBlueprintMindmap,
  updateBlueprintMindmap,
};


