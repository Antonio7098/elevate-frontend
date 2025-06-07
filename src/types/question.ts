export interface UserAnswer {
  id: string;
  questionId: string;
  userAnswer: string;
  correct: boolean;
  evaluationScore?: number;
  timestamp: string;
}

export interface Question {
  id: string;
  questionSetId: string;
  questionSetName?: string; // Name of the question set, added for context
  text: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  questionType?: string; // Type of question (multiple-choice, true-false, short-answer, etc.)
  options?: string[]; // Options for multiple choice questions
  learningStage?: number; // 0-5 representing spaced repetition stage
  marksAvailable?: number; // Total marks this question is out of (e.g., 1-5)
  conceptTags?: string[]; // Array of concept tags associated with this question
  userAnswers?: UserAnswer[]; // History of user answers to this question
  uueFocus?: string; // Understand, Use, or Explore
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
