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
