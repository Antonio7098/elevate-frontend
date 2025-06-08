import { apiClient } from './apiClient';
import type { Folder, CreateFolderData, UpdateFolderData } from '../types/folder';

export const getFolders = async (): Promise<Folder[]> => {
  try {
    const response = await apiClient.get<Folder[]>('/folders');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch folders:', error);
    throw error;
  }
};

export const getFolder = async (folderId: string): Promise<Folder> => {
  try {
    const response = await apiClient.get<Folder>(`/folders/${folderId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch folder with ID ${folderId}:`, error);
    throw error;
  }
};

export const createFolder = async (folderData: CreateFolderData): Promise<Folder> => {
  try {
    const response = await apiClient.post<Folder>('/folders', folderData);
    return response.data;
  } catch (error) {
    console.error('Failed to create folder:', error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/folders/${folderId}`);
  } catch (error) {
    console.error('Failed to delete folder:', error);
    throw error;
  }
};

export const updateFolder = async (folderId: string, folderData: UpdateFolderData): Promise<Folder> => {
  try {
    const response = await apiClient.put<Folder>(`/api/folders/${folderId}`, folderData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update folder with ID ${folderId}:`, error);
    throw error;
  }
};
