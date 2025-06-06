export interface QuestionSet {
  id: string;
  name: string;
  description?: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  questionCount?: number;
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
