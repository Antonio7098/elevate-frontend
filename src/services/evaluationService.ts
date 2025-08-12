import type { Question } from '../types/question';
import { apiClient } from './apiClient';

const AI_EVALUATION_ENDPOINT = '/api/ai/evaluate-answer';

export interface EvaluationResult {
  isCorrect: boolean | null;
  scoreAchieved: number | null;
  feedback: string;
  explanation?: string;
  conceptsIdentified?: string[];
  pendingEvaluation?: boolean;
  newLearningStage?: number;
  action?: string; // To track actions like 'self_mark'
  error?: string | null; // To store any error messages during evaluation
}

// Interface for the AI service response format
interface AIServiceResponse {
  correctedAnswer?: string;
  marksAvailable: number;
  marksAchieved: number;
  feedback?: string;
}

// Evaluate an answer using AI
export const evaluateAnswerWithAI = async (
  question: Question, 
  userAnswer: string
): Promise<EvaluationResult> => {
  try {
    console.log('🔍 [AI Evaluation] Starting AI evaluation for question:', question.id);
    console.log('📝 [AI Evaluation] Question text:', question.text);
    console.log('🧠 [AI Evaluation] Question type:', question.questionType || determineQuestionType(question));
    console.log('📊 [AI Evaluation] Learning stage:', question.learningStage || 0);
    
    console.log('✅ [AI Evaluation] Proceeding with evaluation via core API');
    
    console.time('⏱️ [AI Evaluation] Response time'); // Start timer
    
    // Structure the payload to match the core API expectations
    const payload = {
      questionId: question.id,
      userAnswer: userAnswer
    };
    
    console.log('📤 [AI Evaluation] Sending payload to core API:', JSON.stringify(payload, null, 2));
    console.log('🔗 [AI Evaluation] API endpoint:', AI_EVALUATION_ENDPOINT); // Use constant here
    
    // Use the main API client to call the core API endpoint
    const response = await apiClient.post<AIServiceResponse>(AI_EVALUATION_ENDPOINT, payload);
    console.timeEnd('⏱️ [AI Evaluation] Response time'); // End timer, responseTime will be logged by timeEnd
    
    console.log('✅ [AI Evaluation] AI evaluation successful!');
    console.log('📥 [AI Evaluation] Response data:', JSON.stringify(response.data, null, 2));

    // Handle the new AI service response format
    const aiEvalData = response.data;
    console.log('📥 [AI Evaluation] Extracted AI eval data:', JSON.stringify(aiEvalData, null, 2));
    
    // Check if we have the expected fields in the new format
    if (aiEvalData && typeof aiEvalData.marksAchieved === 'number' && typeof aiEvalData.marksAvailable === 'number') {
      const currentMarksAvailable = aiEvalData.marksAvailable;
      const marksAchieved = aiEvalData.marksAchieved;
      const isCorrect = marksAchieved > 0; // Consider correct if any marks achieved
      
      // Construct the final EvaluationResult based on AI response
      const result: EvaluationResult = {
        isCorrect: isCorrect,
        scoreAchieved: marksAchieved,
        feedback: aiEvalData.feedback || `You achieved ${marksAchieved} out of ${currentMarksAvailable} marks.`,
        explanation: aiEvalData.correctedAnswer || 'No detailed explanation provided.',
        newLearningStage: calculateNewLearningStage(
          question.learningStage || 0,
          marksAchieved,
          currentMarksAvailable
        ),
        conceptsIdentified: [], // Not provided in new format
        pendingEvaluation: false // AI evaluation is complete
      };
      console.log('✅ [AI Evaluation] Constructed result from AI data:', JSON.stringify(result, null, 2));
      return result;
    } else {
      // Fallback for unexpected response format
      console.warn('⚠️ [AI Evaluation] AI service returned unexpected format:', response.data);
      return {
        isCorrect: null,
        scoreAchieved: null,
        feedback: 'AI evaluation returned an unexpected format.',
        explanation: aiEvalData?.correctedAnswer || 'No explanation available.',
        conceptsIdentified: [],
        pendingEvaluation: true,
        newLearningStage: question.learningStage || 0,
      };
    }
  } catch (error: unknown) {
    console.error('❌ [AI Evaluation] Error evaluating answer with AI:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error(`⚠️ [AI Evaluation] Server responded with status: ${error.response.status}`);
      console.error('⚠️ [AI Evaluation] Response data:', error.response.data);
      console.error('⚠️ [AI Evaluation] Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('⚠️ [AI Evaluation] No response received from server');
      console.error('⚠️ [AI Evaluation] Request details:', error.request);
    } else {
      console.error('⚠️ [AI Evaluation] Error details:', error.message || 'Unknown error');
    }
    
    console.log('⚠️ [AI Evaluation] Falling back to local evaluation');
    return fallbackEvaluation(question, userAnswer);
  }
};

// Determine the type of question based on its properties
export const determineQuestionType = (question: Question): string => {
  console.log('🔎 [QuestionType] Analyzing question type for:', question.id);
  console.log('📝 [QuestionType] Question text:', question.text);
  console.log('✅ [QuestionType] Answer:', question.answer);
  
  // If the question already has a type, use it
  if (question.questionType) {
    console.log('💼 [QuestionType] Using explicit question type:', question.questionType);
    return question.questionType;
  }
  
  // Check if it's a multiple choice question
  if (question.options && question.options.length > 0) {
    console.log('🗸 [QuestionType] Detected multiple-choice question (has options)');
    return 'multiple-choice';
  }
  
  // Check if it's a true/false question
  if (question.answer === 'true' || question.answer === 'false') {
    console.log('⭕ [QuestionType] Detected true-false question');
    return 'true-false';
  }
  
  // Check if it's a multiple choice question by looking at the answer format (A, B, C, D)
  if (question.answer && /^[A-D]$/.test(question.answer)) {
    console.log('🗸 [QuestionType] Detected multiple-choice question (answer is A-D)');
    return 'multiple-choice';
  }
  
  // Check answer length to determine if it's short or long answer
  if (typeof question.answer === 'string') {
    const isLongAnswer = question.answer.length > 100;
    console.log(`📝 [QuestionType] Detected ${isLongAnswer ? 'long' : 'short'}-answer question (answer length: ${question.answer.length})`);
    return isLongAnswer ? 'long-answer' : 'short-answer';
  }
  
  // Default to short answer
  console.log('📝 [QuestionType] Defaulting to short-answer question');
  return 'short-answer';
};

// Determine which marking method to use
export const determineMarkingMethod = (question: Question): 'exact-match' | 'ai-evaluation' => {
  console.log('🔍 [MarkingMethod] Determining marking method for question:', question.id);
  
  // Get the question type (either from the question or determine it)
  const questionType = question.questionType || determineQuestionType(question);
  console.log('📃 [MarkingMethod] Question type for marking decision:', questionType);
  
  // For multiple choice and true/false questions, use exact match
  if (
    questionType === 'multiple-choice' || 
    questionType === 'true-false' ||
    questionType === 'MULTIPLE_CHOICE' ||
    questionType === 'TRUE_FALSE'
  ) {
    console.log('🎯 [MarkingMethod] Using exact-match for multiple choice or true/false');
    return 'exact-match';
  }
  
  // For short answers (less than 10 words), use exact match
  if (question.answer && question.answer.split(/\s+/).length < 10) {
    console.log('🎯 [MarkingMethod] Using exact-match for short answer (less than 10 words)');
    return 'exact-match';
  }
  
  // For mid-to-long open-ended questions, use AI evaluation
  console.log('🤖 [MarkingMethod] Using ai-evaluation for mid-to-long open-ended question');
  return 'ai-evaluation';
};

// Evaluate an answer locally without AI
export const evaluateExactMatch = (question: Question, userAnswer: string): EvaluationResult => {
  const isCorrect = !!question.answer && userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
  const currentMarksAvailable = question.totalMarksAvailable || 1; // Default to 1 if not specified
  
  return {
    isCorrect,
    scoreAchieved: isCorrect ? currentMarksAvailable : 0, // Score is full marks available (usually 1) or 0
    feedback: isCorrect 
      ? 'Correct!' 
      : `Incorrect. The correct answer is: ${question.answer}`,
    newLearningStage: calculateNewLearningStage(question.learningStage || 0, isCorrect ? currentMarksAvailable : 0, currentMarksAvailable)
  };
};

// Calculate the new learning stage based on current stage, score achieved, and marks available
export const calculateNewLearningStage = (currentStage: number, scoreAchieved: number, marksAvailable: number): number => {
  const normalizedScore = marksAvailable > 0 ? scoreAchieved / marksAvailable : 0;

  // If the answer is mostly correct (normalized score > 0.7), move up one stage (max 5)
  if (normalizedScore > 0.7) {
    return Math.min(currentStage + 1, 5);
  }
  
  // If the answer is somewhat correct (normalized score > 0.3), stay at the same stage
  if (normalizedScore > 0.3) {
    return currentStage;
  }
  
  // If the answer is mostly incorrect, move back to stage 0 or 1
  return currentStage > 2 ? 1 : 0;
};

// Fallback evaluation when AI is unavailable
export const fallbackEvaluation = (question: Question, userAnswer: string): EvaluationResult => {
  // For multiple choice and true/false, we can still evaluate
  if (
    question.questionType === 'multiple-choice' || 
    question.questionType === 'true-false' ||
    question.questionType === 'SHORT_ANSWER' // Assuming short answer can also be exact matched if AI fails
  ) {
    return evaluateExactMatch(question, userAnswer);
  }
  
  // For open-ended questions, we can't provide accurate evaluation without AI
  return {
    isCorrect: null,
    scoreAchieved: null,
    feedback: 'Your answer has been recorded but could not be evaluated automatically.',
    pendingEvaluation: true,
    newLearningStage: question.learningStage // Keep the same learning stage
  };
};

// Evaluation cache to avoid repeated API calls for the same answer
const evaluationCache = new Map<string, EvaluationResult>();

export const getCachedEvaluation = (questionId: string, userAnswer: string): EvaluationResult | undefined => {
  const key = `${questionId}:${userAnswer}`;
  return evaluationCache.get(key);
};

export const cacheEvaluation = (questionId: string, userAnswer: string, evaluation: EvaluationResult): void => {
  const key = `${questionId}:${userAnswer}`;
  evaluationCache.set(key, evaluation);
};

// Flag to force AI evaluation for testing
// This is controlled via environment variables
// Using Vite's import.meta.env instead of process.env
const FORCE_AI_EVALUATION = import.meta.env.VITE_FORCE_AI_EVALUATION === 'true';

// Main evaluation function that decides between AI and exact match
export const evaluateUserAnswer = async (question: Question, userAnswer: string): Promise<EvaluationResult> => {
  console.log('💬 [Evaluation] Starting evaluation for question:', question.id, 'Marks Available:', question.totalMarksAvailable);
  
  // If forcing AI evaluation, skip cache lookup
  if (FORCE_AI_EVALUATION) {
    console.log('🚨 [Evaluation] FORCING AI EVALUATION for testing - skipping cache lookup');
  } else {
    // Check cache first if not forcing AI evaluation
    const cached = getCachedEvaluation(question.id, userAnswer);
    if (cached) {
      console.log('💾 [Evaluation] Using cached evaluation result');
      return cached;
    }
  }
  
  // Log question type information
  const questionType = question.questionType || determineQuestionType(question);
  console.log('📁 [Evaluation] Question type:', questionType);
  
  // Determine evaluation method
  let method = determineMarkingMethod(question);
  
  // Force AI evaluation if the flag is set (this ensures 'method' is set correctly if cache was skipped)
  if (FORCE_AI_EVALUATION) {
    // The console log might be redundant if already logged above when skipping cache,
    // but ensures the method is explicitly set.
    // console.log('🚨 [Evaluation] FORCING AI EVALUATION for testing'); 
    method = 'ai-evaluation';
  }
  
  console.log('🔧 [Evaluation] Selected evaluation method:', method);
  
  let evaluation: EvaluationResult;
  const currentMarksAvailable = question.totalMarksAvailable || 1; // Get marks available for the question
  
  if (method === 'exact-match') {
    console.log('🔍 [Evaluation] Using exact match evaluation');
    evaluation = evaluateExactMatch(question, userAnswer);
  } else {
    console.log('🤖 [Evaluation] Using AI-powered evaluation');
    evaluation = await evaluateAnswerWithAI(question, userAnswer);
  }

  // Ensure newLearningStage is calculated if not already by specific paths
  // This is a bit redundant if all paths (exactMatch, AI) already call calculateNewLearningStage
  // but acts as a safeguard or if a path doesn't set it.
  if (evaluation.newLearningStage === undefined && evaluation.scoreAchieved !== null) {
    evaluation.newLearningStage = calculateNewLearningStage(
      question.learningStage || 0, 
      evaluation.scoreAchieved, 
      currentMarksAvailable
    );
  }
  
  // Cache the result
  cacheEvaluation(question.id, userAnswer, evaluation);
  console.log('💾 [Evaluation] Cached evaluation result');
  
  console.log(`📬 [Evaluation] Final result for ReviewSessionPage for QID ${question.id}:`, JSON.parse(JSON.stringify(evaluation)));
  return evaluation;
};
