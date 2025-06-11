import { apiClient } from './apiClient';
import type { Folder, CreateFolderData, UpdateFolderData } from '../types/folder';

// Helper function to safely stringify objects
const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error stringifying object:', error);
    return '{}';
  }
};

export const getFolders = async (parentId?: string | null): Promise<Folder[]> => {
  console.log('🔍 [folderService] getFolders called with parentId:', parentId);
  try {
    const response = await apiClient.get('/folders', {
      params: { parentId }
    });
    
    console.log('📦 [folderService] Raw response:', safeStringify(response.data));
    
    // Transform the response to avoid circular references
    const folders = response.data.map((folder: any) => {
      console.log('📁 [folderService] Processing folder:', safeStringify(folder));
      return {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        parentId: folder.parentId,
        children: [], // Initialize empty children array
        questionSetCount: folder.questionSetCount,
        masteryScore: folder.masteryScore,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        userId: folder.userId
      };
    });
    
    console.log('✅ [folderService] getFolders response:', safeStringify(folders));
    return folders;
  } catch (error) {
    console.error('❌ [folderService] getFolders error:', error);
    throw error;
  }
};

export const getFolder = async (folderId: string): Promise<Folder> => {
  try {
    console.log('📡 [folderService] Fetching folder:', folderId);
    const response = await apiClient.get<Folder>(`/folders/${folderId}`);
    
    console.log('📦 [folderService] Raw response:', safeStringify(response.data));
    
    // Transform the response to avoid circular references
    const folder = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
      parentId: response.data.parentId,
      children: [], // Initialize empty children array
      questionSetCount: response.data.questionSetCount,
      masteryScore: response.data.masteryScore,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
      userId: response.data.userId
    };
    
    console.log('✅ [folderService] getFolder response:', safeStringify(folder));
    return folder;
  } catch (error) {
    console.error('❌ [folderService] Failed to fetch folder:', error);
    throw error;
  }
};

export const createFolder = async (data: CreateFolderData): Promise<Folder> => {
  console.log('🔍 [folderService] createFolder called with data:', safeStringify(data));
  try {
    const response = await apiClient.post('/folders', data);
    console.log('✅ [folderService] createFolder response:', safeStringify(response.data));
    return response.data;
  } catch (error) {
    console.error('❌ [folderService] createFolder error:', error);
    throw error;
  }
};

export const deleteFolder = async (id: string): Promise<void> => {
  console.log('🔍 [folderService] deleteFolder called with id:', id);
  try {
    await apiClient.delete(`/folders/${id}`);
    console.log('✅ [folderService] deleteFolder successful');
  } catch (error) {
    console.error('❌ [folderService] deleteFolder error:', error);
    throw error;
  }
};

export const updateFolder = async (id: string, data: UpdateFolderData): Promise<Folder> => {
  console.log('🔍 [folderService] updateFolder called with id:', id, 'data:', safeStringify(data));
  try {
    const response = await apiClient.put(`/folders/${id}`, data);
    console.log('✅ [folderService] updateFolder response:', safeStringify(response.data));
    return response.data;
  } catch (error) {
    console.error('❌ [folderService] updateFolder error:', error);
    throw error;
  }
};
