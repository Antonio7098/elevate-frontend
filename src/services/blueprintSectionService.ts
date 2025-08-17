import { apiClient } from './apiClient';
import type {
  BlueprintSection,
  SectionHierarchy,
  CreateSectionData,
  UpdateSectionData,
  SectionOrderData,
  SectionContent,
  SectionStats
} from '../types/blueprintSection';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock data for development
const mockSections: BlueprintSection[] = [
  {
    id: '1',
    title: 'Introduction to Blueprint System',
    description: 'Learn the fundamentals of the blueprint-centric learning approach',
    blueprintId: 'blueprint-1',
    parentSectionId: undefined,
    depth: 0,
    orderIndex: 0,
    difficulty: 'beginner',
    estimatedTimeMinutes: 30,
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
    notes: [],
    knowledgePrimitives: [],
    masteryCriteria: [],
    masteryProgress: {
      sectionId: '1',
      totalCriteria: 3,
      masteredCriteria: 1,
      inProgressCriteria: 1,
      notStartedCriteria: 1,
      overallProgress: 33,
      lastUpdated: new Date().toISOString()
    },
    contentCount: 5,
    isExpanded: false
  },
  {
    id: '2',
    title: 'Core Concepts',
    description: 'Master the essential concepts and principles',
    blueprintId: 'blueprint-1',
    parentSectionId: '1',
    depth: 1,
    orderIndex: 0,
    difficulty: 'intermediate',
    estimatedTimeMinutes: 45,
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
    notes: [],
    knowledgePrimitives: [],
    masteryCriteria: [],
    masteryProgress: {
      sectionId: '2',
      totalCriteria: 2,
      masteredCriteria: 0,
      inProgressCriteria: 1,
      notStartedCriteria: 1,
      overallProgress: 0,
      lastUpdated: new Date().toISOString()
    },
    contentCount: 3,
    isExpanded: false
  }
];

export class BlueprintSectionService {
  async createSection(data: CreateSectionData): Promise<BlueprintSection> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newSection: BlueprintSection = {
        id: `section-${Date.now()}`,
        title: data.title,
        description: data.description,
        blueprintId: data.blueprintId,
        parentSectionId: data.parentSectionId,
        depth: data.parentSectionId ? 1 : 0,
        orderIndex: data.orderIndex,
        difficulty: data.difficulty,
        estimatedTimeMinutes: data.estimatedTimeMinutes,
        userId: 1, // Mock user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [],
        notes: [],
        knowledgePrimitives: [],
        masteryCriteria: [],
        masteryProgress: {
          sectionId: `section-${Date.now()}`,
          totalCriteria: 0,
          masteredCriteria: 0,
          inProgressCriteria: 0,
          notStartedCriteria: 0,
          overallProgress: 0,
          lastUpdated: new Date().toISOString()
        },
        contentCount: 0,
        isExpanded: false
      };
      
      mockSections.push(newSection);
      return newSection;
    }

    try {
      const response = await apiClient.post<BlueprintSection>('/api/blueprint-sections', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create blueprint section:', error);
      throw new Error('Failed to create blueprint section');
    }
  }

  async getSection(id: string): Promise<BlueprintSection> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const section = mockSections.find(s => s.id === id);
      if (!section) {
        throw new Error('Section not found');
      }
      return section;
    }

    try {
      const response = await apiClient.get<BlueprintSection>(`/api/blueprint-sections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch blueprint section:', error);
      throw new Error('Failed to fetch blueprint section');
    }
  }

  async getSectionTree(blueprintId: string): Promise<SectionHierarchy> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const sections = mockSections.filter(s => s.blueprintId === blueprintId);
      const expandedSections = new Set<string>(['1']); // Mock expanded state
      
      return {
        sections,
        expandedSections,
        selectedSectionId: '1'
      };
    }

    try {
      const response = await apiClient.get<SectionHierarchy>(`/api/blueprints/${blueprintId}/sections/tree`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch section tree:', error);
      throw new Error('Failed to fetch section tree');
    }
  }

  async moveSection(sectionId: string, newParentId: string | null): Promise<BlueprintSection> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const section = mockSections.find(s => s.id === sectionId);
      if (!section) {
        throw new Error('Section not found');
      }
      
      section.parentSectionId = newParentId || undefined;
      section.depth = newParentId ? 1 : 0;
      section.updatedAt = new Date().toISOString();
      
      return section;
    }

    try {
      const response = await apiClient.patch<BlueprintSection>(`/api/blueprint-sections/${sectionId}/move`, {
        newParentId
      });
      return response.data;
    } catch (error) {
      console.error('Failed to move section:', error);
      throw new Error('Failed to move section');
    }
  }

  async reorderSections(blueprintId: string, orderData: SectionOrderData[]): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      orderData.forEach(order => {
        const section = mockSections.find(s => s.id === order.sectionId);
        if (section) {
          section.orderIndex = order.newOrderIndex;
          if (order.newParentId !== undefined) {
            section.parentSectionId = order.newParentId || undefined;
            section.depth = order.newParentId ? 1 : 0;
          }
          section.updatedAt = new Date().toISOString();
        }
      });
      
      return;
    }

    try {
      await apiClient.put(`/api/blueprints/${blueprintId}/sections/reorder`, { orderData });
    } catch (error) {
      console.error('Failed to reorder sections:', error);
      throw new Error('Failed to reorder sections');
    }
  }

  async getSectionContent(sectionId: string): Promise<SectionContent> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const section = mockSections.find(s => s.id === sectionId);
      if (!section) {
        throw new Error('Section not found');
      }
      
      return {
        section,
        notes: [],
        knowledgePrimitives: [],
        masteryCriteria: []
      };
    }

    try {
      const response = await apiClient.get<SectionContent>(`/api/blueprint-sections/${sectionId}/content`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch section content:', error);
      throw new Error('Failed to fetch section content');
    }
  }

  async getSectionStats(sectionId: string): Promise<SectionStats> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const section = mockSections.find(s => s.id === sectionId);
      if (!section) {
        throw new Error('Section not found');
      }
      
      return {
        sectionId,
        totalNotes: 0,
        totalKnowledgePrimitives: 0,
        totalMasteryCriteria: 0,
        masteryProgress: section.masteryProgress!,
        estimatedTimeMinutes: section.estimatedTimeMinutes || 0,
        lastActivity: new Date().toISOString()
      };
    }

    try {
      const response = await apiClient.get<SectionStats>(`/api/blueprint-sections/${sectionId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch section stats:', error);
      throw new Error('Failed to fetch section stats');
    }
  }

  async updateSection(sectionId: string, data: UpdateSectionData): Promise<BlueprintSection> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const section = mockSections.find(s => s.id === sectionId);
      if (!section) {
        throw new Error('Section not found');
      }
      
      Object.assign(section, data);
      section.updatedAt = new Date().toISOString();
      
      return section;
    }

    try {
      const response = await apiClient.patch<BlueprintSection>(`/api/blueprint-sections/${sectionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update section:', error);
      throw new Error('Failed to update section');
    }
  }

  async deleteSection(sectionId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockSections.findIndex(s => s.id === sectionId);
      if (index === -1) {
        throw new Error('Section not found');
      }
      
      mockSections.splice(index, 1);
      return;
    }

    try {
      await apiClient.delete(`/api/blueprint-sections/${sectionId}`);
    } catch (error) {
      console.error('Failed to delete section:', error);
      throw new Error('Failed to delete section');
    }
  }
}

export const blueprintSectionService = new BlueprintSectionService();
export default blueprintSectionService;
