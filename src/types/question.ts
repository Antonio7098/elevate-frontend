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
  answer: string | null; // From Prisma model, answer can be null
  createdAt: string;
  updatedAt: string;
  questionType: string; // From Prisma model, not optional
  options: string[]; // From Prisma model, not optional (empty array if not applicable)
  learningStage?: number; // 0-5 representing spaced repetition stage - assuming this is frontend specific or maps to uueFocus/mastery
  totalMarksAvailable: number; // From Prisma: marksAvailable, aliased, default 1
  markingCriteria: any | null; // From Prisma model, JSON, can be null
  conceptTags: string[]; // From Prisma model, not optional
  userAnswers?: UserAnswer[]; // History of user answers to this question
  uueFocus: string; // From Prisma model, default "Understand"
  lastAnswerCorrect?: boolean | null;
  currentMasteryScore?: number | null;
  difficultyScore?: number | null;
  timesAnsweredCorrectly: number; // From Prisma model, default 0
  timesAnsweredIncorrectly: number; // From Prisma model, default 0
  selfMark: boolean; // From Prisma model, default false
  autoMark: boolean; // From Prisma model, default false
  aiGenerated: boolean; // From Prisma model, default false
  inCat?: string | null;
  imageUrls: string[]; // From Prisma model
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
