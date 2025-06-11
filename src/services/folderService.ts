import { apiClient } from './apiClient';
import type { Folder, CreateFolderData, UpdateFolderData } from '../types/folder';

export const getFolders = async (): Promise<Folder[]> => {
  try {
    console.log('📡 [folderService] Fetching folders...');
    const response = await apiClient.get<Folder[]>('/folders');
    console.log('📦 [folderService] Raw API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ [folderService] Failed to fetch folders:', error);
    throw error;
  }
};

export const getFolder = async (folderId: string): Promise<Folder> => {
  try {
    console.log('📡 [folderService] Fetching folder:', folderId);
    const response = await apiClient.get<Folder>(`/folders/${folderId}`);
    console.log('📦 [folderService] Raw API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ [folderService] Failed to fetch folder:', error);
    throw error;
  }
};

export const createFolder = async (folderData: CreateFolderData): Promise<Folder> => {
  try {
    console.log('📡 [folderService] Creating folder:', folderData);
    const response = await apiClient.post<Folder>('/folders', folderData);
    console.log('📦 [folderService] Raw API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ [folderService] Failed to create folder:', error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  try {
    console.log('📡 [folderService] Deleting folder:', folderId);
    await apiClient.delete(`/folders/${folderId}`);
    console.log('✅ [folderService] Folder deleted successfully');
  } catch (error) {
    console.error('❌ [folderService] Failed to delete folder:', error);
    throw error;
  }
};

export const updateFolder = async (folderId: string, folderData: UpdateFolderData): Promise<Folder> => {
  try {
    console.log('📡 [folderService] Updating folder:', { folderId, folderData });
    const response = await apiClient.put<Folder>(`/folders/${folderId}`, folderData);
    console.log('📦 [folderService] Raw API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ [folderService] Failed to update folder:', error);
    throw error;
  }
};
