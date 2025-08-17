import type { BlueprintSection, KnowledgePrimitive } from '../types/blueprintSection';

// Mock data for MasteryPage that respects database structure
export const mockBlueprintSections: BlueprintSection[] = [
  {
    id: 'section-001',
    title: 'Introduction to Machine Learning',
    description: 'Fundamental concepts and principles of machine learning',
    blueprintId: 'blueprint-ml-001',
    parentSectionId: undefined,
    depth: 0,
    orderIndex: 0,
    difficulty: 'beginner',
    estimatedTimeMinutes: 45,
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-14T15:30:00Z',
    children: [],
    notes: [],
    knowledgePrimitives: [],
    masteryCriteria: [],
    masteryProgress: {
      sectionId: 'section-001',
      totalCriteria: 5,
      masteredCriteria: 3,
      inProgressCriteria: 1,
      notStartedCriteria: 1,
      overallProgress: 60,
      lastUpdated: '2024-08-14T15:30:00Z'
    },
    contentCount: 8,
    isExpanded: false
  },
  {
    id: 'section-002',
    title: 'Supervised Learning',
    description: 'Learning from labeled training data',
    blueprintId: 'blueprint-ml-001',
    parentSectionId: 'section-001',
    depth: 1,
    orderIndex: 0,
    difficulty: 'intermediate',
    estimatedTimeMinutes: 60,
    userId: 1,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-08-14T16:00:00Z',
    children: [],
    notes: [],
    knowledgePrimitives: [],
    masteryCriteria: [],
    masteryProgress: {
      sectionId: 'section-002',
      totalCriteria: 4,
      masteredCriteria: 2,
      inProgressCriteria: 1,
      notStartedCriteria: 1,
      overallProgress: 50,
      lastUpdated: '2024-08-14T16:00:00Z'
    },
    contentCount: 6,
    isExpanded: false
  },
  {
    id: 'section-003',
    title: 'Unsupervised Learning',
    description: 'Finding patterns in unlabeled data',
    blueprintId: 'blueprint-ml-001',
    parentSectionId: 'section-001',
    depth: 1,
    orderIndex: 1,
    difficulty: 'intermediate',
    estimatedTimeMinutes: 55,
    userId: 1,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-08-14T14:45:00Z',
    children: [],
    notes: [],
    knowledgePrimitives: [],
    masteryCriteria: [],
    masteryProgress: {
      sectionId: 'section-003',
      totalCriteria: 3,
      masteredCriteria: 1,
      inProgressCriteria: 1,
      notStartedCriteria: 1,
      overallProgress: 33,
      lastUpdated: '2024-08-14T14:45:00Z'
    },
    contentCount: 5,
    isExpanded: false
  },
  {
    id: 'section-004',
    title: 'Neural Networks',
    description: 'Deep learning with artificial neural networks',
    blueprintId: 'blueprint-ml-001',
    parentSectionId: 'section-002',
    depth: 2,
    orderIndex: 0,
    difficulty: 'advanced',
    estimatedTimeMinutes: 90,
    userId: 1,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-14T17:15:00Z',
    children: [],
    notes: [],
    knowledgePrimitives: [],
    masteryCriteria: [],
    masteryProgress: {
      sectionId: 'section-004',
      totalCriteria: 6,
      masteredCriteria: 2,
      inProgressCriteria: 2,
      notStartedCriteria: 2,
      overallProgress: 33,
      lastUpdated: '2024-08-14T17:15:00Z'
    },
    contentCount: 10,
    isExpanded: false
  },
  {
    id: 'section-005',
    title: 'Data Preprocessing',
    description: 'Cleaning and preparing data for machine learning',
    blueprintId: 'blueprint-ml-001',
    parentSectionId: 'section-001',
    depth: 1,
    orderIndex: 2,
    difficulty: 'beginner',
    estimatedTimeMinutes: 40,
    userId: 1,
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-08-14T13:20:00Z',
    children: [],
    notes: [],
    knowledgePrimitives: [],
    masteryCriteria: [],
    masteryProgress: {
      sectionId: 'section-005',
      totalCriteria: 4,
      masteredCriteria: 3,
      inProgressCriteria: 1,
      notStartedCriteria: 0,
      overallProgress: 75,
      lastUpdated: '2024-08-14T13:20:00Z'
    },
    contentCount: 7,
    isExpanded: false
  }
];

export const mockKnowledgePrimitives: KnowledgePrimitive[] = [
  {
    id: 'primitive-001',
    title: 'What is Machine Learning?',
    description: 'Understanding the basic definition and purpose of machine learning',
    primitiveType: 'concept',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 15,
    trackingIntensity: 'NORMAL',
    sectionId: 'section-001',
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-14T15:30:00Z'
  },
  {
    id: 'primitive-002',
    title: 'Training vs Testing Data',
    description: 'The difference between training and testing datasets',
    primitiveType: 'concept',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 20,
    trackingIntensity: 'NORMAL',
    sectionId: 'section-001',
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-14T15:30:00Z'
  },
  {
    id: 'primitive-003',
    title: 'Overfitting and Underfitting',
    description: 'Common problems in machine learning model training',
    primitiveType: 'concept',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 25,
    trackingIntensity: 'DENSE',
    sectionId: 'section-001',
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-14T15:30:00Z'
  },
  {
    id: 'primitive-004',
    title: 'Linear Regression',
    description: 'Simple linear regression for predicting continuous values',
    primitiveType: 'process',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 30,
    trackingIntensity: 'NORMAL',
    sectionId: 'section-002',
    userId: 1,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-08-14T16:00:00Z'
  },
  {
    id: 'primitive-005',
    title: 'Classification Algorithms',
    description: 'Various algorithms for classification tasks',
    primitiveType: 'concept',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 35,
    trackingIntensity: 'NORMAL',
    sectionId: 'section-002',
    userId: 1,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-08-14T16:00:00Z'
  },
  {
    id: 'primitive-006',
    title: 'Clustering Techniques',
    description: 'K-means, hierarchical clustering, and other methods',
    primitiveType: 'process',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 40,
    trackingIntensity: 'NORMAL',
    sectionId: 'section-003',
    userId: 1,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-08-14T14:45:00Z'
  },
  {
    id: 'primitive-007',
    title: 'Neural Network Architecture',
    description: 'Understanding layers, neurons, and connections',
    primitiveType: 'concept',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 45,
    trackingIntensity: 'DENSE',
    sectionId: 'section-004',
    userId: 1,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-14T17:15:00Z'
  },
  {
    id: 'primitive-008',
    title: 'Backpropagation',
    description: 'The algorithm for training neural networks',
    primitiveType: 'process',
    difficultyLevel: 'advanced',
    estimatedTimeMinutes: 60,
    trackingIntensity: 'DENSE',
    sectionId: 'section-004',
    userId: 1,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-14T17:15:00Z'
  },
  {
    id: 'primitive-009',
    title: 'Data Cleaning',
    description: 'Removing missing values and outliers',
    primitiveType: 'process',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 20,
    trackingIntensity: 'NORMAL',
    sectionId: 'section-005',
    userId: 1,
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-08-14T13:20:00Z'
  },
  {
    id: 'primitive-010',
    title: 'Feature Scaling',
    description: 'Normalizing and standardizing features',
    primitiveType: 'process',
    difficultyLevel: 'beginner',
    estimatedTimeMinutes: 25,
    trackingIntensity: 'NORMAL',
    sectionId: 'section-005',
    userId: 1,
    createdAt: '2024-01-30T10:00:00Z',
    updatedAt: '2024-08-14T13:20:00Z'
  }
];

// Mock mastery history data for charts - respecting database structure
export const mockMasteryHistory = [
  { timestamp: '2024-08-08T10:00:00Z', score: 25, aggregatedScore: 25 },
  { timestamp: '2024-08-09T10:00:00Z', score: 30, aggregatedScore: 30 },
  { timestamp: '2024-08-10T10:00:00Z', score: 35, aggregatedScore: 35 },
  { timestamp: '2024-08-11T10:00:00Z', score: 40, aggregatedScore: 40 },
  { timestamp: '2024-08-12T10:00:00Z', score: 45, aggregatedScore: 45 },
  { timestamp: '2024-08-13T10:00:00Z', score: 50, aggregatedScore: 50 },
  { timestamp: '2024-08-14T10:00:00Z', score: 55, aggregatedScore: 55 }
];

// Individual mastery history for each section with realistic progression
export const mockSectionMasteryHistory = {
  'section-001': [
    { timestamp: '2024-01-15T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-01-20T10:00:00Z', score: 15, aggregatedScore: 15 },
    { timestamp: '2024-01-25T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-02-01T10:00:00Z', score: 35, aggregatedScore: 35 },
    { timestamp: '2024-02-15T10:00:00Z', score: 45, aggregatedScore: 45 },
    { timestamp: '2024-03-01T10:00:00Z', score: 55, aggregatedScore: 55 },
    { timestamp: '2024-03-15T10:00:00Z', score: 60, aggregatedScore: 60 },
    { timestamp: '2024-04-01T10:00:00Z', score: 65, aggregatedScore: 65 },
    { timestamp: '2024-05-01T10:00:00Z', score: 70, aggregatedScore: 70 },
    { timestamp: '2024-06-01T10:00:00Z', score: 75, aggregatedScore: 75 },
    { timestamp: '2024-07-01T10:00:00Z', score: 78, aggregatedScore: 78 },
    { timestamp: '2024-08-01T10:00:00Z', score: 80, aggregatedScore: 80 },
    { timestamp: '2024-08-14T15:30:00Z', score: 60, aggregatedScore: 60 } // Current score
  ],
  'section-002': [
    { timestamp: '2024-01-20T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 10, aggregatedScore: 10 },
    { timestamp: '2024-02-15T10:00:00Z', score: 20, aggregatedScore: 20 },
    { timestamp: '2024-03-01T10:00:00Z', score: 30, aggregatedScore: 30 },
    { timestamp: '2024-03-15T10:00:00Z', score: 40, aggregatedScore: 40 },
    { timestamp: '2024-04-01T10:00:00Z', score: 45, aggregatedScore: 45 },
    { timestamp: '2024-05-01T10:00:00Z', score: 50, aggregatedScore: 50 },
    { timestamp: '2024-06-01T10:00:00Z', score: 52, aggregatedScore: 52 },
    { timestamp: '2024-07-01T10:00:00Z', score: 55, aggregatedScore: 55 },
    { timestamp: '2024-08-01T10:00:00Z', score: 58, aggregatedScore: 58 },
    { timestamp: '2024-08-14T16:00:00Z', score: 50, aggregatedScore: 50 } // Current score
  ],
  'section-003': [
    { timestamp: '2024-01-25T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 5, aggregatedScore: 5 },
    { timestamp: '2024-02-15T10:00:00Z', score: 15, aggregatedScore: 15 },
    { timestamp: '2024-03-01T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-03-15T10:00:00Z', score: 30, aggregatedScore: 30 },
    { timestamp: '2024-04-01T10:00:00Z', score: 35, aggregatedScore: 35 },
    { timestamp: '2024-05-01T10:00:00Z', score: 38, aggregatedScore: 38 },
    { timestamp: '2024-06-01T10:00:00Z', score: 40, aggregatedScore: 40 },
    { timestamp: '2024-07-01T10:00:00Z', score: 42, aggregatedScore: 42 },
    { timestamp: '2024-08-01T10:00:00Z', score: 45, aggregatedScore: 45 },
    { timestamp: '2024-08-14T14:45:00Z', score: 33, aggregatedScore: 33 } // Current score
  ],
  'section-004': [
    { timestamp: '2024-02-01T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-15T10:00:00Z', score: 5, aggregatedScore: 5 },
    { timestamp: '2024-03-01T10:00:00Z', score: 10, aggregatedScore: 10 },
    { timestamp: '2024-03-15T10:00:00Z', score: 15, aggregatedScore: 15 },
    { timestamp: '2024-04-01T10:00:00Z', score: 20, aggregatedScore: 20 },
    { timestamp: '2024-05-01T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-06-01T10:00:00Z', score: 28, aggregatedScore: 28 },
    { timestamp: '2024-07-01T10:00:00Z', score: 30, aggregatedScore: 30 },
    { timestamp: '2024-08-01T10:00:00Z', score: 32, aggregatedScore: 32 },
    { timestamp: '2024-08-14T17:15:00Z', score: 33, aggregatedScore: 33 } // Current score
  ],
  'section-005': [
    { timestamp: '2024-01-30T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 20, aggregatedScore: 20 },
    { timestamp: '2024-02-15T10:00:00Z', score: 35, aggregatedScore: 35 },
    { timestamp: '2024-03-01T10:00:00Z', score: 50, aggregatedScore: 50 },
    { timestamp: '2024-03-15T10:00:00Z', score: 60, aggregatedScore: 60 },
    { timestamp: '2024-04-01T10:00:00Z', score: 70, aggregatedScore: 70 },
    { timestamp: '2024-05-01T10:00:00Z', score: 75, aggregatedScore: 75 },
    { timestamp: '2024-06-01T10:00:00Z', score: 78, aggregatedScore: 78 },
    { timestamp: '2024-07-01T10:00:00Z', score: 80, aggregatedScore: 80 },
    { timestamp: '2024-08-01T10:00:00Z', score: 82, aggregatedScore: 82 },
    { timestamp: '2024-08-14T13:20:00Z', score: 75, aggregatedScore: 75 } // Current score
  ]
};

// Individual mastery history for each primitive with realistic progression
export const mockPrimitiveMasteryHistory = {
  'primitive-001': [
    { timestamp: '2024-01-15T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-01-20T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-01-25T10:00:00Z', score: 50, aggregatedScore: 50 },
    { timestamp: '2024-02-01T10:00:00Z', score: 75, aggregatedScore: 75 },
    { timestamp: '2024-02-15T10:00:00Z', score: 85, aggregatedScore: 85 },
    { timestamp: '2024-03-01T10:00:00Z', score: 90, aggregatedScore: 90 },
    { timestamp: '2024-08-14T15:30:00Z', score: 95, aggregatedScore: 95 }
  ],
  'primitive-002': [
    { timestamp: '2024-01-15T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-01-20T10:00:00Z', score: 20, aggregatedScore: 20 },
    { timestamp: '2024-01-25T10:00:00Z', score: 40, aggregatedScore: 40 },
    { timestamp: '2024-02-01T10:00:00Z', score: 60, aggregatedScore: 60 },
    { timestamp: '2024-02-15T10:00:00Z', score: 75, aggregatedScore: 75 },
    { timestamp: '2024-03-01T10:00:00Z', score: 85, aggregatedScore: 85 },
    { timestamp: '2024-08-14T15:30:00Z', score: 90, aggregatedScore: 90 }
  ],
  'primitive-003': [
    { timestamp: '2024-01-15T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-01-20T10:00:00Z', score: 15, aggregatedScore: 15 },
    { timestamp: '2024-01-25T10:00:00Z', score: 30, aggregatedScore: 30 },
    { timestamp: '2024-02-01T10:00:00Z', score: 45, aggregatedScore: 45 },
    { timestamp: '2024-02-15T10:00:00Z', score: 55, aggregatedScore: 55 },
    { timestamp: '2024-03-01T10:00:00Z', score: 65, aggregatedScore: 65 },
    { timestamp: '2024-08-14T15:30:00Z', score: 70, aggregatedScore: 70 }
  ],
  'primitive-004': [
    { timestamp: '2024-01-20T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 20, aggregatedScore: 20 },
    { timestamp: '2024-02-15T10:00:00Z', score: 35, aggregatedScore: 35 },
    { timestamp: '2024-03-01T10:00:00Z', score: 50, aggregatedScore: 50 },
    { timestamp: '2024-03-15T10:00:00Z', score: 60, aggregatedScore: 60 },
    { timestamp: '2024-04-01T10:00:00Z', score: 70, aggregatedScore: 70 },
    { timestamp: '2024-08-14T16:00:00Z', score: 75, aggregatedScore: 75 }
  ],
  'primitive-005': [
    { timestamp: '2024-01-20T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 15, aggregatedScore: 15 },
    { timestamp: '2024-02-15T10:00:00Z', score: 30, aggregatedScore: 30 },
    { timestamp: '2024-03-01T10:00:00Z', score: 45, aggregatedScore: 45 },
    { timestamp: '2024-03-15T10:00:00Z', score: 55, aggregatedScore: 55 },
    { timestamp: '2024-04-01T10:00:00Z', score: 65, aggregatedScore: 65 },
    { timestamp: '2024-08-14T16:00:00Z', score: 70, aggregatedScore: 70 }
  ],
  'primitive-006': [
    { timestamp: '2024-01-25T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 10, aggregatedScore: 10 },
    { timestamp: '2024-02-15T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-03-01T10:00:00Z', score: 35, aggregatedScore: 35 },
    { timestamp: '2024-03-15T10:00:00Z', score: 45, aggregatedScore: 45 },
    { timestamp: '2024-04-01T10:00:00Z', score: 55, aggregatedScore: 55 },
    { timestamp: '2024-08-14T14:45:00Z', score: 60, aggregatedScore: 60 }
  ],
  'primitive-007': [
    { timestamp: '2024-02-01T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-15T10:00:00Z', score: 5, aggregatedScore: 5 },
    { timestamp: '2024-03-01T10:00:00Z', score: 15, aggregatedScore: 15 },
    { timestamp: '2024-03-15T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-04-01T10:00:00Z', score: 30, aggregatedScore: 30 },
    { timestamp: '2024-05-01T10:00:00Z', score: 35, aggregatedScore: 35 },
    { timestamp: '2024-08-14T17:15:00Z', score: 40, aggregatedScore: 40 }
  ],
  'primitive-008': [
    { timestamp: '2024-02-01T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-15T10:00:00Z', score: 5, aggregatedScore: 5 },
    { timestamp: '2024-03-01T10:00:00Z', score: 10, aggregatedScore: 10 },
    { timestamp: '2024-03-15T10:00:00Z', score: 15, aggregatedScore: 15 },
    { timestamp: '2024-04-01T10:00:00Z', score: 20, aggregatedScore: 20 },
    { timestamp: '2024-05-01T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-08-14T17:15:00Z', score: 30, aggregatedScore: 30 }
  ],
  'primitive-009': [
    { timestamp: '2024-01-30T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 25, aggregatedScore: 25 },
    { timestamp: '2024-02-15T10:00:00Z', score: 45, aggregatedScore: 45 },
    { timestamp: '2024-03-01T10:00:00Z', score: 65, aggregatedScore: 65 },
    { timestamp: '2024-03-15T10:00:00Z', score: 75, aggregatedScore: 75 },
    { timestamp: '2024-04-01T10:00:00Z', score: 80, aggregatedScore: 80 },
    { timestamp: '2024-08-14T13:20:00Z', score: 85, aggregatedScore: 85 }
  ],
  'primitive-010': [
    { timestamp: '2024-01-30T10:00:00Z', score: 0, aggregatedScore: 0 },
    { timestamp: '2024-02-01T10:00:00Z', score: 20, aggregatedScore: 20 },
    { timestamp: '2024-02-15T10:00:00Z', score: 40, aggregatedScore: 40 },
    { timestamp: '2024-03-01T10:00:00Z', score: 55, aggregatedScore: 55 },
    { timestamp: '2024-03-15T10:00:00Z', score: 65, aggregatedScore: 65 },
    { timestamp: '2024-04-01T10:00:00Z', score: 70, aggregatedScore: 70 },
    { timestamp: '2024-08-14T13:20:00Z', score: 75, aggregatedScore: 75 }
  ]
};

// Mock weekly progress data
export const mockWeeklyProgress = {
  itemsReviewed: 12,
  masteryGained: 15,
  streakDays: 7
};

// Mock UUE scores for different sections
export const mockUueScores = {
  'section-001': { understandScore: 75, useScore: 60, exploreScore: 45 },
  'section-002': { understandScore: 65, useScore: 55, exploreScore: 40 },
  'section-003': { understandScore: 55, useScore: 45, exploreScore: 30 },
  'section-004': { understandScore: 40, useScore: 35, exploreScore: 25 },
  'section-005': { understandScore: 80, useScore: 70, exploreScore: 60 }
};

// Helper function to get UUE scores for a section
export const getUueScores = (sectionId: string) => {
  return mockUueScores[sectionId as keyof typeof mockUueScores] || { understandScore: 0, useScore: 0, exploreScore: 0 };
};

// Helper function to get mastery history for a section
export const getMasteryHistory = (sectionId: string) => {
  // Return the detailed mastery history for the specific section
  return mockSectionMasteryHistory[sectionId as keyof typeof mockSectionMasteryHistory] || mockMasteryHistory;
};

// Helper function to get mastery history for a primitive
export const getPrimitiveMasteryHistory = (primitiveId: string) => {
  // Return the detailed mastery history for the specific primitive
  return mockPrimitiveMasteryHistory[primitiveId as keyof typeof mockPrimitiveMasteryHistory] || mockMasteryHistory;
};

