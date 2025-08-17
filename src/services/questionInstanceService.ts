import { apiClient } from './apiClient';
import type {
  QuestionInstance,
  CreateQuestionData,
  UpdateQuestionData,
  QuestionFilter,
  QuestionStats,
  QuestionBank,
  QuestionSet
} from '../types/questionInstance';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock data for development
const mockQuestions: QuestionInstance[] = [
  {
    id: 'question-1',
    question: 'What is the primary purpose of the blueprint system?',
    answer: 'To organize learning content in a structured, mastery-based approach',
    questionType: 'short_answer',
    difficulty: 'easy',
    status: 'active',
    masteryCriterionId: 'criterion-1',
    blueprintSectionId: 'section-1',
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [],
    correctAnswer: 'To organize learning content in a structured, mastery-based approach',
    explanation: 'The blueprint system provides a framework for organizing learning content into logical sections with clear mastery criteria.',
    hints: ['Think about organization', 'Consider the learning approach'],
    tags: ['blueprint', 'organization', 'learning'],
    userQuestionAttempts: [],
    masteryCriterion: {} as any, // Mock relation
    successRate: 0.8,
    averageTimeSpent: 45,
    isActive: true
  },
  {
    id: 'question-2',
    question: 'Which of the following best describes a mastery criterion?',
    answer: 'A measurable learning objective with specific requirements',
    questionType: 'multiple_choice',
    difficulty: 'medium',
    status: 'active',
    masteryCriterionId: 'criterion-1',
    blueprintSectionId: 'section-1',
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: [
      { id: 'opt-1', text: 'A random question', isCorrect: false, explanation: 'This is not accurate', questionInstanceId: 'question-2' },
      { id: 'opt-2', text: 'A measurable learning objective with specific requirements', isCorrect: true, explanation: 'Correct! Mastery criteria define specific learning objectives.', questionInstanceId: 'question-2' },
      { id: 'opt-3', text: 'A general topic area', isCorrect: false, explanation: 'This is too vague', questionInstanceId: 'question-2' }
    ],
    correctAnswer: 'A measurable learning objective with specific requirements',
    explanation: 'Mastery criteria are specific, measurable learning objectives that students must achieve to demonstrate understanding.',
    hints: ['Look for specificity', 'Consider measurability'],
    tags: ['mastery', 'criteria', 'learning-objectives'],
    userQuestionAttempts: [],
    masteryCriterion: {} as any, // Mock relation
    successRate: 0.6,
    averageTimeSpent: 60,
    isActive: true
  }
];

export class QuestionInstanceService {
  async createQuestion(data: CreateQuestionData): Promise<QuestionInstance> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newQuestion: QuestionInstance = {
        id: `question-${Date.now()}`,
        question: data.question,
        answer: data.answer,
        questionType: data.questionType,
        difficulty: data.difficulty,
        status: 'draft',
        masteryCriterionId: data.masteryCriterionId,
        blueprintSectionId: data.blueprintSectionId,
        userId: 1, // Mock user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        hints: data.hints,
        tags: data.tags,
        userQuestionAttempts: [],
        masteryCriterion: {} as any, // Mock relation
        successRate: 0,
        averageTimeSpent: 0,
        isActive: true
      };
      
      mockQuestions.push(newQuestion);
      return newQuestion;
    }

    try {
      const response = await apiClient.post<QuestionInstance>('/api/question-instances', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create question instance:', error);
      throw new Error('Failed to create question instance');
    }
  }

  async getQuestion(id: string): Promise<QuestionInstance> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const question = mockQuestions.find(q => q.id === id);
      if (!question) {
        throw new Error('Question instance not found');
      }
      return question;
    }

    try {
      const response = await apiClient.get<QuestionInstance>(`/api/question-instances/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch question instance:', error);
      throw new Error('Failed to fetch question instance');
    }
  }

  async updateQuestion(id: string, data: UpdateQuestionData): Promise<QuestionInstance> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const question = mockQuestions.find(q => q.id === id);
      if (!question) {
        throw new Error('Question instance not found');
      }
      
      Object.assign(question, data);
      question.updatedAt = new Date().toISOString();
      
      return question;
    }

    try {
      const response = await apiClient.patch<QuestionInstance>(`/api/question-instances/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update question instance:', error);
      throw new Error('Failed to update question instance');
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = mockQuestions.findIndex(q => q.id === id);
      if (index === -1) {
        throw new Error('Question instance not found');
      }
      
      mockQuestions.splice(index, 1);
      return;
    }

    try {
      await apiClient.delete(`/api/question-instances/${id}`);
    } catch (error) {
      console.error('Failed to delete question instance:', error);
      throw new Error('Failed to delete question instance');
    }
  }

  async getQuestionsByFilter(filter: QuestionFilter): Promise<QuestionInstance[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let filteredQuestions = [...mockQuestions];
      
      if (filter.blueprintSectionId) {
        filteredQuestions = filteredQuestions.filter(q => q.blueprintSectionId === filter.blueprintSectionId);
      }
      
      if (filter.masteryCriterionId) {
        filteredQuestions = filteredQuestions.filter(q => q.masteryCriterionId === filter.masteryCriterionId);
      }
      
      if (filter.questionType) {
        filteredQuestions = filteredQuestions.filter(q => q.questionType === filter.questionType);
      }
      
      if (filter.difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === filter.difficulty);
      }
      
      if (filter.status) {
        filteredQuestions = filteredQuestions.filter(q => q.status === filter.status);
      }
      
      if (filter.tags && filter.tags.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.tags && filter.tags!.some(tag => q.tags!.includes(tag))
        );
      }
      
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        filteredQuestions = filteredQuestions.filter(q => 
          q.question.toLowerCase().includes(searchLower) ||
          (q.answer && q.answer.toLowerCase().includes(searchLower)) ||
          (q.explanation && q.explanation.toLowerCase().includes(searchLower))
        );
      }
      
      return filteredQuestions;
    }

    try {
      const response = await apiClient.get<QuestionInstance[]>('/api/question-instances', { params: filter });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch questions by filter:', error);
      throw new Error('Failed to fetch questions by filter');
    }
  }

  async getQuestionStats(questionId: string): Promise<QuestionStats> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const question = mockQuestions.find(q => q.id === questionId);
      if (!question) {
        throw new Error('Question instance not found');
      }
      
      return {
        questionId,
        totalAttempts: 10,
        successfulAttempts: Math.floor(question.successRate! * 10),
        successRate: question.successRate!,
        averageTimeSpent: question.averageTimeSpent!,
        averageConfidence: 3.5,
        lastAttemptAt: new Date().toISOString(),
        difficultyRating: 3
      };
    }

    try {
      const response = await apiClient.get<QuestionStats>(`/api/question-instances/${questionId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch question stats:', error);
      throw new Error('Failed to fetch question stats');
    }
  }

  async createQuestionBank(data: Omit<QuestionBank, 'id' | 'questions' | 'createdAt' | 'updatedAt'>): Promise<QuestionBank> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newBank: QuestionBank = {
        id: `bank-${Date.now()}`,
        name: data.name,
        description: data.description,
        blueprintSectionId: data.blueprintSectionId,
        userId: data.userId,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newBank;
    }

    try {
      const response = await apiClient.post<QuestionBank>('/api/question-banks', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create question bank:', error);
      throw new Error('Failed to create question bank');
    }
  }

  async createQuestionSet(data: Omit<QuestionSet, 'id' | 'questions' | 'totalQuestions' | 'createdAt' | 'updatedAt'>): Promise<QuestionSet> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newSet: QuestionSet = {
        id: `set-${Date.now()}`,
        name: data.name,
        description: data.description,
        questions: [],
        totalQuestions: 0,
        estimatedTimeMinutes: data.estimatedTimeMinutes,
        difficulty: data.difficulty,
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newSet;
    }

    try {
      const response = await apiClient.post<QuestionSet>('/api/question-sets', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create question set:', error);
      throw new Error('Failed to create question set');
    }
  }

  async getQuestionsByMasteryCriterion(criterionId: string): Promise<QuestionInstance[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockQuestions.filter(q => q.masteryCriterionId === criterionId);
    }

    try {
      const response = await apiClient.get<QuestionInstance[]>(`/api/mastery-criteria/${criterionId}/questions`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch questions by mastery criterion:', error);
      throw new Error('Failed to fetch questions by mastery criterion');
    }
  }

  async getQuestionsBySection(sectionId: string): Promise<QuestionInstance[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockQuestions.filter(q => q.blueprintSectionId === sectionId);
    }

    try {
      const response = await apiClient.get<QuestionInstance[]>(`/api/blueprint-sections/${sectionId}/questions`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch questions by section:', error);
      throw new Error('Failed to fetch questions by section');
    }
  }
}

export const questionInstanceService = new QuestionInstanceService();
export default questionInstanceService;





