// Core-API-shaped mock data for Learning Pathways
// Mirrors elevate-core-api/src/types/learningPathways.types.ts

export type CorePathwayDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CoreMasteryLevel = 'understand' | 'use' | 'explore';
export type CorePathwayStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

export interface CoreQuestionInstance {
  id: string;
  questionFamilyId: string;
  variationId: string;
  difficulty: string;
  estimatedTimeMinutes: number;
  learningObjectives: string[];
  hints: string[];
  explanation: string;
}

export interface CoreNoteSection {
  id: string;
  title: string;
  content: string;
  format: 'bullet' | 'paragraph' | 'mindmap';
  estimatedTimeMinutes: number;
  learningObjectives: string[];
  relatedPrimitives: string[];
}

export interface CorePathwayStep {
  id: string;
  primitiveId: string;
  order: number;
  masteryLevel: CoreMasteryLevel;
  estimatedTimeMinutes: number;
  questions: CoreQuestionInstance[];
  notes: CoreNoteSection[];
  prerequisites: string[];
  learningObjectives: string[];
  completionCriteria: {
    questionsAnswered: number;
    notesReviewed: number;
    timeSpent: number;
  };
}

export interface CoreLearningPathway {
  id: string;
  name: string;
  description: string;
  startPrimitiveId: string;
  endPrimitiveId: string;
  steps: CorePathwayStep[];
  difficulty: CorePathwayDifficulty;
  estimatedTimeMinutes: number;
  prerequisites: string[];
  tags: string[];
  status: CorePathwayStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  progress: {
    completedSteps: number;
    totalSteps: number;
    currentStepIndex: number;
    estimatedCompletionDate?: string;
  };
}

export const mockCoreLearningPathways: CoreLearningPathway[] = [
  {
    id: 'core-path-001',
    name: 'JavaScript Fundamentals (Core Style)',
    description: 'From atomic JS concepts to composing complex programs.',
    startPrimitiveId: 'prim-vars',
    endPrimitiveId: 'prim-async',
    difficulty: 'beginner',
    estimatedTimeMinutes: 720, // 12 hours
    prerequisites: [],
    tags: ['javascript', 'fundamentals', 'programming'],
    status: 'in_progress',
    userId: 'user-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: {
      completedSteps: 1,
      totalSteps: 4,
      currentStepIndex: 1,
      estimatedCompletionDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    steps: [
      {
        id: 'step-1',
        primitiveId: 'prim-vars',
        order: 0,
        masteryLevel: 'understand',
        estimatedTimeMinutes: 90,
        prerequisites: [],
        learningObjectives: ['Declare variables', 'Understand data types'],
        completionCriteria: { questionsAnswered: 5, notesReviewed: 2, timeSpent: 60 },
        notes: [
          {
            id: 'n1',
            title: 'Variables and Types',
            content: 'var/let/const, primitives vs objects',
            format: 'bullet',
            estimatedTimeMinutes: 20,
            learningObjectives: ['Recall variable kinds', 'Identify types'],
            relatedPrimitives: ['prim-vars', 'prim-types'],
          },
        ],
        questions: [
          {
            id: 'q1',
            questionFamilyId: 'fam-vars',
            variationId: 'v1',
            difficulty: 'easy',
            estimatedTimeMinutes: 5,
            learningObjectives: ['Choose correct declaration'],
            hints: ['Block scope for let/const'],
            explanation: 'Use let/const for modern JS.',
          },
        ],
      },
      {
        id: 'step-2',
        primitiveId: 'prim-func',
        order: 1,
        masteryLevel: 'use',
        estimatedTimeMinutes: 120,
        prerequisites: ['step-1'],
        learningObjectives: ['Define functions', 'Understand scope & closures'],
        completionCriteria: { questionsAnswered: 6, notesReviewed: 2, timeSpent: 80 },
        notes: [],
        questions: [],
      },
      {
        id: 'step-3',
        primitiveId: 'prim-arr-obj',
        order: 2,
        masteryLevel: 'use',
        estimatedTimeMinutes: 150,
        prerequisites: ['step-1'],
        learningObjectives: ['Manipulate arrays', 'Work with objects'],
        completionCriteria: { questionsAnswered: 8, notesReviewed: 2, timeSpent: 100 },
        notes: [],
        questions: [],
      },
      {
        id: 'step-4',
        primitiveId: 'prim-async',
        order: 3,
        masteryLevel: 'explore',
        estimatedTimeMinutes: 180,
        prerequisites: ['step-2', 'step-3'],
        learningObjectives: ['Use promises', 'Async/await patterns'],
        completionCriteria: { questionsAnswered: 10, notesReviewed: 2, timeSpent: 120 },
        notes: [],
        questions: [],
      },
    ],
  },
];



