import { apiClient } from './apiClient';
import type { Folder, CreateFolderData, UpdateFolderData } from '../types/folder';

// Helper function to safely stringify objects
const safeStringify = (obj: unknown): string => {
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
          // If no parentId is specified, get all folders and build the tree
      if (parentId === undefined || parentId === null) {
                console.log('📡 [folderService] Making API call to /folders');
        // Try different approaches to get the tree structure
        let response;
        try {
          // First try the tree endpoint
          console.log('📡 [folderService] Trying /folders/tree endpoint');
          response = await apiClient.get('/folders/tree');
        } catch {
          console.log('📡 [folderService] Tree endpoint failed, trying with tree parameter');
          try {
            response = await apiClient.get('/folders', {
              params: { tree: true }
            });
          } catch {
            console.log('📡 [folderService] Tree parameter failed, trying includeChildren');
            try {
              response = await apiClient.get('/folders', {
                params: { includeChildren: true }
              });
            } catch {
              console.log('📡 [folderService] includeChildren failed, trying basic call');
              response = await apiClient.get('/folders');
            }
          }
        }
        console.log('📡 [folderService] API call completed');
        
        console.log('📦 [folderService] Raw response:', safeStringify(response.data));
        console.log('📦 [folderService] Response type:', typeof response.data);
        console.log('📦 [folderService] Response length:', Array.isArray(response.data) ? response.data.length : 'not an array');
        
        // Debug: Check if any folder has children
        if (Array.isArray(response.data)) {
          response.data.forEach((folder: Folder, index: number) => {
            console.log(`📁 [folderService] Folder ${index}:`, {
              id: folder.id,
              name: folder.name,
              parentId: folder.parentId,
              hasChildren: !!folder.children,
              childrenLength: folder.children?.length || 0,
              childrenType: typeof folder.children
            });
          });
        }
      
      // Transform the response and preserve the existing tree structure
      const allFolders = response.data.map((folder: Folder) => {
        console.log('📁 [folderService] Processing folder:', safeStringify(folder));
        return {
          id: folder.id,
          name: folder.name,
          description: folder.description,
          parentId: folder.parentId,
          children: folder.children || [], // Use children from API response
          questionSetCount: folder.questionSetCount,
          masteryScore: folder.masteryScore,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          userId: folder.userId,
          isPinned: folder.isPinned || false
        };
      });
      
      // If the API didn't return nested structure, build it ourselves
      if (allFolders.length > 0 && allFolders.every((folder: Folder) => !folder.children || folder.children.length === 0)) {
        console.log('🔧 [folderService] API returned flat structure, building tree manually');
        
        // Create a map for quick lookup
        const folderMap = new Map<string, Folder>();
        allFolders.forEach((folder: Folder) => {
          folderMap.set(folder.id, { ...folder, children: [] });
        });
        
        // Build the tree structure
        const topLevelFolders: Folder[] = [];
        allFolders.forEach((folder: Folder) => {
          if (folder.parentId) {
            const parent = folderMap.get(folder.parentId);
            if (parent) {
              parent.children.push(folderMap.get(folder.id)!);
            }
          } else {
            topLevelFolders.push(folderMap.get(folder.id)!);
          }
        });
        
        console.log('✅ [folderService] Built tree structure manually:', safeStringify(topLevelFolders));
        return topLevelFolders;
      }
      
      // Return only top-level folders (those without parents)
      const topLevelFolders = allFolders.filter((folder: Folder) => !folder.parentId);
      
      console.log('✅ [folderService] getFolders response (tree):', safeStringify(topLevelFolders));
      console.log('✅ [folderService] Returning topLevelFolders, count:', topLevelFolders.length);
      return topLevelFolders;
    } else {
      // If parentId is specified, get children of that specific folder
      const response = await apiClient.get('/folders', {
        params: { parentId }
      });
      
      console.log('📦 [folderService] Raw response for parentId:', parentId, safeStringify(response.data));
      
      const folders = response.data.map((folder: Folder) => {
        console.log('📁 [folderService] Processing folder:', safeStringify(folder));
        return {
          id: folder.id,
          name: folder.name,
          description: folder.description,
          parentId: folder.parentId,
          children: folder.children || [], // Use actual children from API response
          questionSetCount: folder.questionSetCount,
          masteryScore: folder.masteryScore,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          userId: folder.userId,
          isPinned: folder.isPinned || false
        };
      });
      
      console.log('✅ [folderService] getFolders response (children):', safeStringify(folders));
      return folders;
    }
  } catch (error: unknown) {
    console.error('❌ [folderService] getFolders error:', error);
    console.error('❌ [folderService] Error details:', {
      message: (error as Error).message,
      response: (error as { response?: { data?: unknown } }).response?.data,
      status: (error as { response?: { status?: number } }).response?.status,
      url: (error as { config?: { url?: string } }).config?.url
    });
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
      children: response.data.children || [], // Use actual children from API response
      questionSetCount: response.data.questionSetCount,
      masteryScore: response.data.masteryScore,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
      userId: response.data.userId,
      isPinned: response.data.isPinned || false
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

// Pin or unpin a folder
export const pinFolder = async (folderId: string, isPinned: boolean): Promise<Folder> => {
  const response = await apiClient.put(`/folders/${folderId}/pin`, { isPinned });
  return response.data;
};
