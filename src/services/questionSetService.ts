import { apiClient } from './apiClient';
import type { QuestionSet } from '../types/questionSet';
import type { EnhancedQuestionSet } from '../types/questionSet';

// Get all question sets for a folder
export const getQuestionSets = async (folderId: string): Promise<QuestionSet[]> => {
  try {
    // First try the nested route approach
    try {
      const response = await apiClient.get<QuestionSet[]>(`/folders/${folderId}/questionsets`);
      return response.data;
    } catch {
      // Try hyphenated nested route
      try {
        const response = await apiClient.get<QuestionSet[]>(`/folders/${folderId}/question-sets`);
        return response.data;
      } catch {
        // If that fails, try the flat approach with query parameter
        try {
          const response = await apiClient.get<QuestionSet[]>(`/questionsets?folderId=${folderId}`);
          return response.data;
        } catch {
          // Try hyphenated flat route
          const response = await apiClient.get<QuestionSet[]>(`/question-sets?folderId=${folderId}`);
          return response.data;
        }
      }
    }
  } catch {
    console.log(`All attempts to fetch question sets for folder ${folderId} failed, returning empty array`);
    return [];
  }
};

// Fetch all question sets (enhanced) across the workspace; tries multiple routes and falls back to []
export const getAllQuestionSets = async (): Promise<EnhancedQuestionSet[]> => {
  try {
    try {
      const res = await apiClient.get<EnhancedQuestionSet[]>(`/questionsets`, {
        headers: { 'X-Suppress-404-Log': 'true' }
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      try {
        const res = await apiClient.get<EnhancedQuestionSet[]>(`/question-sets`, {
          headers: { 'X-Suppress-404-Log': 'true' }
        });
        return Array.isArray(res.data) ? res.data : [];
      } catch {
        try {
          // Some APIs expose under /review/questionsets or similar aggregations
          const res = await apiClient.get<EnhancedQuestionSet[]>(`/review/questionsets`, {
            headers: { 'X-Suppress-404-Log': 'true' }
          });
          return Array.isArray(res.data) ? res.data : [];
        } catch {
          return [];
        }
      }
    }
  } catch {
    return [];
  }
};

export const getQuestionSet = async (folderId: string, questionSetId: string): Promise<QuestionSet> => {
  try {
    // First try the nested route approach
    try {
      const response = await apiClient.get<QuestionSet>(`/folders/${folderId}/questionsets/${questionSetId}`);
      return response.data;
    } catch {
      // Try hyphenated nested route
      try {
        const response = await apiClient.get<QuestionSet>(`/folders/${folderId}/question-sets/${questionSetId}`);
        return response.data;
      } catch {
        // If that fails, try the direct approach
        try {
          const response = await apiClient.get<QuestionSet>(`/questionsets/${questionSetId}`);
          return response.data;
        } catch {
          const response = await apiClient.get<QuestionSet>(`/question-sets/${questionSetId}`);
          return response.data;
        }
      }
    }
  } catch (error) {
    console.error(`Failed to fetch question set ${questionSetId} in folder ${folderId}:`, error);
    throw error;
  }
};

export const getQuestionSetByIdAny = async (questionSetId: string): Promise<any> => {
  // Try common endpoints without folder context
  try {
    const res = await apiClient.get(`/question-sets/${questionSetId}`);
    return res.data;
  } catch {
    try {
      const res = await apiClient.get(`/questionsets/${questionSetId}`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch question set by id ${questionSetId}:`, error);
      throw error;
    }
  }
};

export interface CreateQuestionSetData {
  name: string;
  description?: string;
}

export interface UpdateQuestionSetData {
  name?: string;
  description?: string;
  content?: unknown;
}

// Try both nested and flat route structures
export const createQuestionSet = async (folderId: string, data: CreateQuestionSetData): Promise<QuestionSet> => {
  try {
    // First try the nested route approach
    try {
      const response = await apiClient.post<QuestionSet>(`/folders/${folderId}/questionsets`, {
        ...data
      });
      return response.data;
    } catch {
      // Try hyphenated nested
      try {
        const response = await apiClient.post<QuestionSet>(`/folders/${folderId}/question-sets`, {
          ...data
        });
        return response.data;
      } catch {
        // If that fails, try the flat approach with folderId in the body
        try {
          const response = await apiClient.post<QuestionSet>(`/questionsets`, {
            ...data,
            folderId
          });
          return response.data;
        } catch {
          const response = await apiClient.post<QuestionSet>(`/question-sets`, {
            ...data,
            folderId
          });
          return response.data;
        }
      }
    }
  } catch (error) {
    console.error(`Failed to create question set in folder ${folderId}:`, error);
    throw error;
  }
};

export const deleteQuestionSet = async (folderId: string, questionSetId: string): Promise<void> => {
  try {
    // First try the nested route approach
    try {
      await apiClient.delete(`/folders/${folderId}/questionsets/${questionSetId}`);
    } catch {
      // Try hyphenated nested
      try {
        await apiClient.delete(`/folders/${folderId}/question-sets/${questionSetId}`);
      } catch {
        // If that fails, try the direct approach
        try {
          await apiClient.delete(`/questionsets/${questionSetId}`);
        } catch {
          await apiClient.delete(`/question-sets/${questionSetId}`);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to delete question set ${questionSetId} in folder ${folderId}:`, error);
    throw error;
  }
};

// Pin or unpin a question set
export const pinQuestionSet = async (folderId: string, setId: string, isPinned: boolean): Promise<QuestionSet> => {
  // Try both route styles
  try {
    const response = await apiClient.put(`/folders/${folderId}/questionsets/${setId}/pin`, { isPinned });
    return response.data;
  } catch {
    const response = await apiClient.put(`/folders/${folderId}/question-sets/${setId}/pin`, { isPinned });
    return response.data;
  }
};

// Update a question set
export const updateQuestionSet = async (questionSetId: string, data: UpdateQuestionSetData): Promise<QuestionSet> => {
  try {
    // Try direct first
    try {
      const response = await apiClient.put<QuestionSet>(`/questionsets/${questionSetId}`, data);
      return response.data;
    } catch {
      // Try alternative direct hyphenated
      try {
        const response = await apiClient.put<QuestionSet>(`/question-sets/${questionSetId}`, data);
        return response.data;
      } catch {
        // Try nested alt
        const response = await apiClient.put<QuestionSet>(`/folders/questionsets/${questionSetId}`, data);
        return response.data;
      }
    }
  } catch (error) {
    console.error(`Failed to update question set ${questionSetId}:`, error);
    throw error;
  }
};
