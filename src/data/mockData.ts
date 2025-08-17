import type { LearningBlueprint } from '../types/blueprint.types';
import type { BlueprintSection } from '../types/blueprintSection';
import type { MasteryCriterion } from '../types/masteryCriterion';
import type { QuestionInstance } from '../types/questionInstance';
import type { MasteryTracking } from '../types/masteryTracking';
import type { UueStageProgression } from '../types/uueStage';
import type { LearningPathway } from '../types/learningPathways';

// Mock Users
export const mockUsers = [
  {
    id: 'user-001',
    name: 'John Student',
    email: 'john.student@example.com',
    role: 'student' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'user-002',
    name: 'Sarah Instructor',
    email: 'sarah.instructor@example.com',
    role: 'instructor' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'user-003',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  }
];

// Mock Learning Blueprints
export const mockBlueprints: LearningBlueprint[] = [
  {
    id: 'bp-001',
    title: 'JavaScript Fundamentals',
    sourceType: 'CUSTOM',
    summary: 'Complete JavaScript fundamentals from basics to advanced concepts',
    description: 'A comprehensive learning path covering JavaScript fundamentals including variables, functions, objects, arrays, and modern ES6+ features.',
    difficulty: 'BEGINNER',
    estimatedCompletionTime: 120,
    tags: ['javascript', 'programming', 'web-development'],
    knowledgePrimitives: {
      sections: 8,
      knowledgePrimitives: 24,
      masteryCriteria: 32,
      openQuestions: 16
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    isPublished: true,
    isArchived: false,
    version: '1.0.0'
  },
  {
    id: 'bp-002',
    title: 'React Development',
    sourceType: 'CUSTOM',
    summary: 'Learn React from ground up with modern patterns and best practices',
    description: 'Master React development including hooks, context, state management, and advanced patterns for building scalable applications.',
    difficulty: 'INTERMEDIATE',
    estimatedCompletionTime: 180,
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    knowledgePrimitives: {
      sections: 12,
      knowledgePrimitives: 36,
      masteryCriteria: 48,
      openQuestions: 24
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    isPublished: true,
    isArchived: false,
    version: '1.2.0'
  },
  {
    id: 'bp-003',
    title: 'Data Structures & Algorithms',
    sourceType: 'CUSTOM',
    summary: 'Master fundamental data structures and algorithmic thinking',
    description: 'Comprehensive coverage of data structures, algorithms, and problem-solving techniques essential for technical interviews and software development.',
    difficulty: 'ADVANCED',
    estimatedCompletionTime: 240,
    tags: ['algorithms', 'data-structures', 'computer-science', 'problem-solving'],
    knowledgePrimitives: {
      sections: 15,
      knowledgePrimitives: 45,
      masteryCriteria: 60,
      openQuestions: 30
    },
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-28T11:20:00Z',
    isPublished: true,
    isArchived: false,
    version: '1.1.0'
  }
];

// Mock Blueprint Sections
export const mockSections: BlueprintSection[] = [
  // JavaScript Fundamentals sections
  {
    id: 'sec-001',
    title: 'Variables and Data Types',
    description: 'Understanding JavaScript variables, primitive types, and type coercion',
    parentSectionId: null,
    blueprintId: 'bp-001',
    difficulty: 'BEGINNER',
    estimatedTime: 15,
    orderIndex: 0,
    tags: ['variables', 'data-types', 'basics'],
    notes: 'Foundation concepts for all JavaScript development',
    knowledgePrimitives: ['var-declaration', 'let-const', 'primitive-types'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'sec-002',
    title: 'Functions and Scope',
    description: 'Function declarations, expressions, and scope management',
    parentSectionId: null,
    blueprintId: 'bp-001',
    difficulty: 'BEGINNER',
    estimatedTime: 20,
    orderIndex: 1,
    tags: ['functions', 'scope', 'closures'],
    notes: 'Core concept for understanding JavaScript execution',
    knowledgePrimitives: ['function-declaration', 'function-expression', 'scope-chain'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'sec-003',
    title: 'Objects and Arrays',
    description: 'Working with objects, arrays, and common methods',
    parentSectionId: null,
    blueprintId: 'bp-001',
    difficulty: 'BEGINNER',
    estimatedTime: 25,
    orderIndex: 2,
    tags: ['objects', 'arrays', 'methods'],
    notes: 'Essential for data manipulation',
    knowledgePrimitives: ['object-literals', 'array-methods', 'destructuring'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  // React Development sections
  {
    id: 'sec-004',
    title: 'React Components',
    description: 'Understanding React components, props, and JSX',
    parentSectionId: null,
    blueprintId: 'bp-002',
    difficulty: 'INTERMEDIATE',
    estimatedTime: 30,
    orderIndex: 0,
    tags: ['react', 'components', 'jsx'],
    notes: 'Building block of React applications',
    knowledgePrimitives: ['functional-components', 'props', 'jsx-syntax'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'sec-005',
    title: 'React Hooks',
    description: 'Using React hooks for state and side effects',
    parentSectionId: null,
    blueprintId: 'bp-002',
    difficulty: 'INTERMEDIATE',
    estimatedTime: 35,
    orderIndex: 1,
    tags: ['react', 'hooks', 'state'],
    notes: 'Modern React state management',
    knowledgePrimitives: ['useState', 'useEffect', 'useContext'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  }
];

// Mock Mastery Criteria
export const mockCriteria: MasteryCriterion[] = [
  {
    id: 'crit-001',
    title: 'Variable Declaration',
    description: 'Understand var, let, and const declarations and their differences',
    sectionId: 'sec-001',
    blueprintId: 'bp-001',
    uueStage: 'UNDERSTAND',
    weight: 3,
    complexityScore: 25,
    tags: ['variables', 'declaration'],
    prerequisites: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'crit-002',
    title: 'Data Type Identification',
    description: 'Identify and work with JavaScript primitive types',
    sectionId: 'sec-001',
    blueprintId: 'bp-001',
    uueStage: 'UNDERSTAND',
    weight: 2,
    complexityScore: 20,
    tags: ['data-types', 'primitives'],
    prerequisites: ['crit-001'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'crit-003',
    title: 'Function Creation',
    description: 'Create functions using different declaration methods',
    sectionId: 'sec-002',
    blueprintId: 'bp-001',
    uueStage: 'USE',
    weight: 4,
    complexityScore: 35,
    tags: ['functions', 'declaration'],
    prerequisites: ['crit-001', 'crit-002'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'crit-004',
    title: 'Component Props',
    description: 'Pass and receive props in React components',
    sectionId: 'sec-004',
    blueprintId: 'bp-002',
    uueStage: 'UNDERSTAND',
    weight: 3,
    complexityScore: 30,
    tags: ['react', 'props', 'components'],
    prerequisites: [],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  }
];

// Mock Questions
export const mockQuestions: QuestionInstance[] = [
  {
    id: 'q-001',
    question: 'What is the difference between var, let, and const in JavaScript?',
    answer: 'var has function scope and can be redeclared, let has block scope and cannot be redeclared, const has block scope and cannot be reassigned.',
    questionType: 'multiple_choice',
    difficulty: 'easy',
    status: 'active',
    masteryCriterionId: 'crit-001',
    blueprintSectionId: 'bp-001',
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    options: [
      { id: 'opt-1', text: 'var has block scope, let has function scope, const has global scope', isCorrect: false, explanation: 'This is not accurate', questionInstanceId: 'q-001' },
      { id: 'opt-2', text: 'var has function scope and can be redeclared, let has block scope and cannot be redeclared, const cannot be reassigned', isCorrect: true, explanation: 'Correct! This explains the key differences.', questionInstanceId: 'q-001' },
      { id: 'opt-3', text: 'They are all the same with different syntax', isCorrect: false, explanation: 'This is not accurate', questionInstanceId: 'q-001' },
      { id: 'opt-4', text: 'var is deprecated, let and const are the same', isCorrect: false, explanation: 'This is not accurate', questionInstanceId: 'q-001' }
    ],
    correctAnswer: 'var has function scope and can be redeclared, let has block scope and cannot be redeclared, const has block scope and cannot be reassigned.',
    explanation: 'var has function scope and can be redeclared, let has block scope and cannot be redeclared, const has block scope and cannot be reassigned.',
    hints: ['Think about scope', 'Consider reassignment rules'],
    tags: ['scope', 'declaration', 'variables'],
    userQuestionAttempts: [],
    masteryCriterion: {} as any, // Mock relation
    successRate: 0.7,
    averageTimeSpent: 45,
    isActive: true
  },
  {
    id: 'q-002',
    question: 'Which of the following is a primitive data type in JavaScript?',
    answer: 'String is a primitive data type in JavaScript, along with Number, Boolean, Undefined, Null, and Symbol.',
    questionType: 'multiple_choice',
    difficulty: 'easy',
    status: 'active',
    masteryCriterionId: 'crit-002',
    blueprintSectionId: 'bp-001',
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    options: [
      { id: 'opt-1', text: 'Array', isCorrect: false, explanation: 'This is not accurate', questionInstanceId: 'q-002' },
      { id: 'opt-2', text: 'Object', isCorrect: false, explanation: 'This is not accurate', questionInstanceId: 'q-002' },
      { id: 'opt-3', text: 'String', isCorrect: true, explanation: 'Correct! String is a primitive data type.', questionInstanceId: 'q-002' },
      { id: 'opt-4', text: 'Function', isCorrect: false, explanation: 'This is not accurate', questionInstanceId: 'q-002' }
    ],
    correctAnswer: 'String',
    explanation: 'String is a primitive data type in JavaScript, along with Number, Boolean, Undefined, Null, and Symbol.',
    hints: ['Think about basic types', 'Consider what cannot be broken down further'],
    tags: ['primitives', 'strings', 'data-types'],
    userQuestionAttempts: [],
    masteryCriterion: {} as any, // Mock relation
    successRate: 0.8,
    averageTimeSpent: 30,
    isActive: true
  },
  {
    id: 'q-003',
    question: 'What is the purpose of the useEffect hook in React?',
    answer: 'useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.',
    questionType: 'short_answer',
    difficulty: 'medium',
    status: 'active',
    masteryCriterionId: 'crit-003',
    blueprintSectionId: 'bp-002',
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    options: [],
    correctAnswer: 'useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.',
    explanation: 'The useEffect hook allows you to perform side effects in functional components, replacing componentDidMount, componentDidUpdate, and componentWillUnmount from class components.',
    hints: ['Think about side effects', 'Consider lifecycle methods'],
    tags: ['react', 'hooks', 'side-effects'],
    userQuestionAttempts: [],
    masteryCriterion: {} as any, // Mock relation
    successRate: 0.6,
    averageTimeSpent: 75,
    isActive: true
  },
  {
    id: 'q-004',
    question: 'What is the time complexity of binary search?',
    answer: 'O(log n)',
    questionType: 'short_answer',
    difficulty: 'hard',
    status: 'active',
    masteryCriterionId: 'crit-004',
    blueprintSectionId: 'bp-003',
    userId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    options: [],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search has a time complexity of O(log n) because it divides the search space in half with each iteration.',
    hints: ['Think about how the search space changes', 'Consider logarithmic growth'],
    tags: ['algorithms', 'binary-search', 'time-complexity'],
    userQuestionAttempts: [],
    masteryCriterion: {} as any, // Mock relation
    successRate: 0.4,
    averageTimeSpent: 120,
    isActive: true
  }
];

// Mock Mastery Tracking
export const mockMasteryTracking: MasteryTracking[] = [
  {
    id: 'mt-001',
    userId: 'user-001',
    criterionId: 'crit-001',
    blueprintId: 'bp-001',
    currentLevel: 2,
    targetLevel: 3,
    progress: 67,
    reviewCount: 5,
    reviewSessionCount: 3,
    lastReviewed: '2024-01-25T10:00:00Z',
    nextReviewDate: '2024-01-28T10:00:00Z',
    streakCount: 3,
    totalStudyTime: 45,
    masteryScore: 75,
    isMastered: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'mt-002',
    userId: 'user-001',
    criterionId: 'crit-002',
    blueprintId: 'bp-001',
    currentLevel: 3,
    targetLevel: 3,
    progress: 100,
    reviewCount: 8,
    reviewSessionCount: 4,
    lastReviewed: '2024-01-26T14:00:00Z',
    nextReviewDate: '2024-02-02T14:00:00Z',
    streakCount: 5,
    totalStudyTime: 60,
    masteryScore: 90,
    isMastered: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-26T14:00:00Z'
  }
];

// Mock UUE Stage Progressions
export const mockUueProgressions: UueStageProgression[] = [
  {
    id: 'uue-001',
    userId: 1,
    blueprintSectionId: 'bp-001',
    currentStage: 'USE',
    stageProgress: 65,
    isUnlocked: true,
    isCompleted: false,
    startedAt: '2024-01-15T10:00:00Z',
    lastActivityAt: '2024-01-25T10:00:00Z',
    stageData: {
      stage: 'USE',
      title: 'JavaScript Usage Stage',
      description: 'Practice using JavaScript concepts in real scenarios',
      requirements: [
        'Complete all UNDERSTAND criteria',
        'Successfully complete 5 practice exercises',
        'Achieve 80% mastery score'
      ],
      estimatedTimeMinutes: 120,
      difficulty: 'intermediate',
      prerequisites: ['UNDERSTAND'],
      unlocks: ['EXPLORE'],
      masteryThreshold: 80,
      reviewIntervalDays: 7,
      minimumAttempts: 3
    },
    stageRequirements: [
      {
        id: 'req-001',
        stageId: 'uue-001',
        requirementType: 'mastery_criterion',
        requirementValue: 80,
        currentValue: 85,
        isMet: true,
        description: 'Complete all UNDERSTAND criteria'
      },
      {
        id: 'req-002',
        stageId: 'uue-001',
        requirementType: 'questions_answered',
        requirementValue: 5,
        currentValue: 5,
        isMet: true,
        description: 'Successfully complete 5 practice exercises'
      }
    ],
    masteryCriteria: mockCriteria.filter(c => c.blueprintId === 'bp-001')
  },
  {
    id: 'uue-002',
    userId: 1,
    blueprintSectionId: 'bp-002',
    currentStage: 'UNDERSTAND',
    stageProgress: 30,
    isUnlocked: true,
    isCompleted: false,
    startedAt: '2024-01-20T10:00:00Z',
    lastActivityAt: '2024-01-26T10:00:00Z',
    stageData: {
      stage: 'UNDERSTAND',
      title: 'React Fundamentals Understanding',
      description: 'Learn the core concepts of React and component-based architecture',
      requirements: [
        'Read React documentation',
        'Complete basic tutorials',
        'Understand JSX syntax'
      ],
      estimatedTimeMinutes: 180,
      difficulty: 'beginner',
      prerequisites: [],
      unlocks: ['USE'],
      masteryThreshold: 70,
      reviewIntervalDays: 5,
      minimumAttempts: 2
    },
    stageRequirements: [
      {
        id: 'req-003',
        stageId: 'uue-002',
        requirementType: 'time_spent',
        requirementValue: 120,
        currentValue: 60,
        isMet: false,
        description: 'Read React documentation'
      },
      {
        id: 'req-004',
        stageId: 'uue-002',
        requirementType: 'questions_answered',
        requirementValue: 3,
        currentValue: 1,
        isMet: false,
        description: 'Complete basic tutorials'
      }
    ],
    masteryCriteria: mockCriteria.filter(c => c.blueprintId === 'bp-002')
  }
];

// Mock Learning Pathways - Dynamically generated based on user progress and prerequisites
export const mockLearningPathways: LearningPathway[] = [
  {
    id: 'path-001',
    title: 'JavaScript Fundamentals Pathway',
    description: 'Dynamic pathway generated based on your current mastery and prerequisites',
    blueprintId: 'bp-001',
    difficulty: 'beginner',
    estimatedDuration: 14, // in days
    prerequisites: [],
    learningObjectives: ['Master variable declaration', 'Understand data types', 'Create basic functions'],
    targetAudience: ['Beginner developers', 'Students learning JavaScript'],
    tags: ['javascript', 'fundamentals', 'beginner'],
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    sections: [
      {
        id: 'path-sec-001',
        pathwayId: 'path-001',
        title: 'Variables & Data Types',
        description: 'Learn about variable declaration and JavaScript primitive types',
        orderIndex: 0,
        estimatedTimeMinutes: 120,
        difficulty: 'beginner',
        contentItems: [
          {
            id: 'content-001',
            sectionId: 'path-sec-001',
            title: 'Variable Declaration',
            contentType: 'reading',
            estimatedTimeMinutes: 30,
            orderIndex: 0,
            isRequired: true
          },
          {
            id: 'content-002',
            sectionId: 'path-sec-001',
            title: 'Data Type Identification',
            contentType: 'interactive',
            estimatedTimeMinutes: 45,
            orderIndex: 1,
            isRequired: true
          }
        ],
        masteryCriteria: ['crit-001', 'crit-002'],
        prerequisites: [],
        isUnlocked: true
      },
      {
        id: 'path-sec-002',
        pathwayId: 'path-001',
        title: 'Functions & Control Flow',
        description: 'Create functions and understand basic control structures',
        orderIndex: 1,
        estimatedTimeMinutes: 180,
        difficulty: 'beginner',
        contentItems: [
          {
            id: 'content-003',
            sectionId: 'path-sec-002',
            title: 'Function Creation',
            contentType: 'practice',
            estimatedTimeMinutes: 60,
            orderIndex: 0,
            isRequired: true
          }
        ],
        masteryCriteria: ['crit-003'],
        prerequisites: ['path-sec-001'], // Requires completion of first section
        isUnlocked: false // Will be unlocked when prerequisites are met
      }
    ],
    milestones: [
      {
        id: 'milestone-001',
        pathwayId: 'path-001',
        title: 'JavaScript Basics Mastery',
        description: 'Complete all fundamental JavaScript concepts',
        orderIndex: 0,
        requirements: [
          {
            id: 'req-001',
            milestoneId: 'milestone-001',
            requirementType: 'section_completion',
            requirementValue: 2,
            currentValue: 0,
            isMet: false,
            description: 'Complete both pathway sections'
          }
        ]
      }
    ],
    assessments: []
  }
];

// Mock user progress data
export const mockUserProgress = {
  userId: 'user-001',
  overallProgress: 45,
  blueprintsEnrolled: 2,
  totalStudyTime: 180,
  masteryLevel: 'INTERMEDIATE',
  currentStreak: 7,
  longestStreak: 15,
  achievements: [
    { id: 'ach-001', title: 'First Steps', description: 'Complete your first criterion', earnedAt: '2024-01-16T10:00:00Z' },
    { id: 'ach-002', title: 'Consistent Learner', description: 'Maintain a 5-day study streak', earnedAt: '2024-01-20T10:00:00Z' }
  ]
};

// Mock analytics data
export const mockAnalytics = {
  userId: 'user-001',
  studySessions: [
    { date: '2024-01-25', duration: 45, criteriaCovered: 3, accuracy: 85 },
    { date: '2024-01-24', duration: 30, criteriaCovered: 2, accuracy: 90 },
    { date: '2024-01-23', duration: 60, criteriaCovered: 4, accuracy: 75 }
  ],
  weeklyProgress: [
    { week: '2024-01-15', progress: 20, studyTime: 120 },
    { week: '2024-01-22', progress: 45, studyTime: 180 }
  ],
  strengthAreas: ['variables', 'functions', 'basic-syntax'],
  improvementAreas: ['advanced-concepts', 'problem-solving', 'algorithms']
};

// Helper functions for mock data
export const getMockDataByBlueprint = (blueprintId: string) => {
  return {
    blueprint: mockBlueprints.find(bp => bp.id === blueprintId),
    sections: mockSections.filter(sec => sec.blueprintId === blueprintId),
    criteria: mockCriteria.filter(crit => crit.blueprintId === blueprintId),
    questions: mockQuestions.filter(q => q.blueprintId === blueprintId),
    masteryTracking: mockMasteryTracking.filter(mt => mt.blueprintId === blueprintId),
    uueProgression: mockUueProgressions.find(uue => uue.blueprintId === blueprintId)
  };
};

export const getMockUserData = (userId: string) => {
  return {
    progress: mockUserProgress,
    analytics: mockAnalytics,
    masteryTracking: mockMasteryTracking.filter(mt => mt.userId === userId),
    uueProgressions: mockUueProgressions.filter(uue => uue.userId === userId)
  };
};

// Function to demonstrate dynamic learning pathway generation
export const generateDynamicLearningPathways = (userId: string, blueprintId?: string) => {
  // In a real implementation, this would:
  // 1. Analyze user's current mastery level
  // 2. Check completed criteria vs prerequisites
  // 3. Generate pathways based on what's unlocked
  // 4. Adapt difficulty based on user performance
  
  const userMastery = mockMasteryTracking.filter(mt => mt.userId === userId);
  const completedCriteria = userMastery.filter(mt => mt.masteryLevel >= 0.8).map(mt => mt.criterionId);
  
  // Generate pathways based on what the user can access
  const availablePathways = mockLearningPathways.map(pathway => {
    const unlockedSections = pathway.sections.map(section => {
      const prerequisitesMet = section.prerequisites.every(prereq => 
        completedCriteria.includes(prereq) || prereq === 'path-sec-001' // First section always unlocked
      );
      
      return {
        ...section,
        isUnlocked: prerequisitesMet
      };
    });
    
    return {
      ...pathway,
      sections: unlockedSections
    };
  });
  
  return availablePathways;
};
