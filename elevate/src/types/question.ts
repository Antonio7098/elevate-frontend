export interface Question {
  id: string;
  questionSetId: string;
  text: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionData {
  text: string;
  answer: string;
  questionSetId: string;
}

export interface UpdateQuestionData {
  text?: string;
  answer?: string;
}
