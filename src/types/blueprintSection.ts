import type { DifficultyLevel } from './blueprint.types';

export interface BlueprintSection {
  id: string;
  title: string;
  description?: string;
  blueprintId: string;
  parentSectionId?: string;
  depth: number;
  orderIndex: number;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  children: BlueprintSection[];
  notes: NoteSection[];
  knowledgePrimitives: KnowledgePrimitive[];
  masteryCriteria: MasteryCriterion[];
  
  // Computed fields
  masteryProgress?: MasteryProgress;
  contentCount?: number;
  isExpanded?: boolean;
}

export interface NoteSection {
  id: string;
  title: string;
  content: string;
  sectionId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgePrimitive {
  id: string;
  title: string;
  description?: string;
  primitiveType: 'fact' | 'concept' | 'process';
  difficultyLevel: DifficultyLevel;
  estimatedTimeMinutes?: number;
  trackingIntensity: 'DENSE' | 'NORMAL' | 'SPARSE';
  sectionId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MasteryCriterion {
  id: string;
  title: string;
  description?: string;
  weight: number;
  uueStage: 'UNDERSTAND' | 'USE' | 'EXPLORE';
  complexityScore?: number;
  knowledgePrimitiveId: string;
  blueprintSectionId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MasteryProgress {
  sectionId: string;
  totalCriteria: number;
  masteredCriteria: number;
  inProgressCriteria: number;
  notStartedCriteria: number;
  overallProgress: number; // 0-100 percentage
  lastUpdated: string;
}

export interface SectionHierarchy {
  sections: BlueprintSection[];
  expandedSections: Set<string>;
  selectedSectionId?: string;
}

export interface CreateSectionData {
  title: string;
  description?: string;
  blueprintId: string;
  parentSectionId?: string;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes?: number;
  orderIndex: number;
}

export interface UpdateSectionData {
  title?: string;
  description?: string;
  difficulty?: DifficultyLevel;
  estimatedTimeMinutes?: number;
  orderIndex?: number;
}

export interface SectionOrderData {
  sectionId: string;
  newOrderIndex: number;
  newParentId?: string;
}

export interface SectionContent {
  section: BlueprintSection;
  notes: NoteSection[];
  knowledgePrimitives: KnowledgePrimitive[];
  masteryCriteria: MasteryCriterion[];
}

export interface SectionStats {
  sectionId: string;
  totalNotes: number;
  totalKnowledgePrimitives: number;
  totalMasteryCriteria: number;
  masteryProgress: MasteryProgress;
  estimatedTimeMinutes: number;
  lastActivity: string;
}





