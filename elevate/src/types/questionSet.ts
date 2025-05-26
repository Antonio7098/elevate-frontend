export interface QuestionSet {
  id: string;
  title: string;
  description?: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  questionCount?: number;
}

export interface CreateQuestionSetData {
  title: string;
  description?: string;
  folderId: string;
}

export interface UpdateQuestionSetData {
  title?: string;
  description?: string;
}
