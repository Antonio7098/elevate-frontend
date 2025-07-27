export interface QuestionSet {
  currentTotalMasteryScore?: number;
  nextReviewAt?: string;
  id: string;
  name: string;
  description?: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  questionCount?: number;
  isPinned?: boolean;
}

export interface CreateQuestionSetData {
  name: string;
  description?: string;
  folderId: string;
}

export interface UpdateQuestionSetData {
  name?: string;
  description?: string;
}

// Enhanced question set response from the new /api/questionsets endpoint
export interface EnhancedQuestionSet {
  id: string;
  name: string;
  description?: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  questionCount?: number;
  isPinned?: boolean;
  currentTotalMasteryScore?: number;
  nextReviewAt?: string;
  folder: {
    id: string;
    name: string;
    description?: string;
  };
  questions: Array<{
    id: string;
    text: string;
    questionType: string;
    currentMasteryScore?: number;
  }>;
  recentNote?: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  };
}

// Learning Blueprint types
export interface LearningBlueprint {
  id: string;
  sourceText: string;
  blueprintJson: unknown; // The parsed blueprint from AI
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLearningBlueprintData {
  sourceText: string;
  folderId?: string;
}

export interface QuestionGenerationOptions {
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
}

export interface GenerateQuestionsData {
  name: string;
  questionOptions?: QuestionGenerationOptions;
  folderId?: string;
}
