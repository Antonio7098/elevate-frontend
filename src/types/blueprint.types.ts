export type UEELevel = 'UNDERSTAND' | 'USE' | 'EXPLORE';
export type TrackingIntensity = 'DENSE' | 'NORMAL' | 'SPARSE';
export type PrimitiveType = 'fact' | 'concept' | 'process';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type EntityCategory = 'Person' | 'Organization' | 'Concept' | 'Place' | 'Object';

export interface MasteryCriterion {
  criterionId: string;
  title: string;
  description?: string | null;
  ueeLevel: UEELevel;
  weight: number;
  isRequired: boolean;
}

export interface KnowledgePrimitive {
  primitiveId: string;
  title: string;
  description?: string | null;
  primitiveType: PrimitiveType;
  difficultyLevel: DifficultyLevel;
  estimatedTimeMinutes?: number | null;
  trackingIntensity: TrackingIntensity;
  masteryCriteria: MasteryCriterion[];
}

export interface Section {
  section_id: string;
  section_name: string;
  description: string;
  parent_section_id?: string | null;
}

export interface Proposition {
  id: string;
  statement: string;
  supporting_evidence: string[];
  sections: string[];
  mastery_criteria: MasteryCriterion[];
}

export interface Entity {
  id: string;
  entity: string;
  definition: string;
  category: EntityCategory;
  sections: string[];
  mastery_criteria: MasteryCriterion[];
}

export interface Process {
  id: string;
  process_name: string;
  steps: string[];
  sections: string[];
  mastery_criteria: MasteryCriterion[];
}

export interface Relationship {
  id: string;
  relationship_type: string;
  source_primitive_id: string;
  target_primitive_id: string;
  description: string;
  sections: string[];
}

export interface Question {
  id: string;
  question: string;
  sections: string[];
}

export interface KnowledgePrimitives {
  key_propositions_and_facts: Proposition[];
  key_entities_and_definitions: Entity[];
  described_processes_and_steps: Process[];
  identified_relationships: Relationship[];
  implicit_and_open_questions: Question[];
}

export interface LearningBlueprint {
  source_id: string;
  source_title: string;
  source_type: string;
  source_summary: Record<string, any>;
  sections: Section[];
  knowledge_primitives: KnowledgePrimitives;
}

// Mindmap types used by React Flow and API contracts
export type NodeKind = 'section' | 'proposition' | 'entity' | 'process' | 'group';

export interface MindmapNode {
  id: string;
  type: NodeKind;
  data: {
    title: string;
    description?: string | null;
    primitiveType?: string | null;
  };
  position: { x: number; y: number };
  parentId?: string | null;
}

export type RelationKind = 'prereq' | 'part-of' | 'causes' | 'custom';

export interface MindmapEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'bezier' | 'smoothstep' | 'straight';
  data?: { relationType?: RelationKind };
}

export interface MindmapPayload {
  blueprintId: string;
  version: number;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  metadata?: { createdAt?: string; updatedAt?: string };
}
