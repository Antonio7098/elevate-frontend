import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { apiClient } from '../services/apiClient';
import type { Question } from '../types/question';
import type { QuestionSet } from '../types/questionSet';

// Define question types for the review session
interface ReviewQuestion extends Question {
  questionType?: 'SHORT_ANSWER' | 'TRUE_FALSE' | 'MULTIPLE_CHOICE';
  options?: string[]; // For multiple choice questions
}

// Interface for tracking session progress and analytics
interface SessionStats {
  totalQuestions: number;
  questionsAnswered: number;
  correctAnswers: number;
  averageDifficulty: number;
}

// Helper function to determine question type based on content
const determineQuestionType = (question: Question): ReviewQuestion => {
  const text = question.text.toLowerCase();
  const answer = question.answer.toLowerCase();
  
  // Check if it's a true/false question
  if (
    (text.includes('true or false') || text.includes('true/false')) &&
    (answer === 'true' || answer === 'false')
  ) {
    return { ...question, questionType: 'TRUE_FALSE' };
  }
  
  // Check if it's likely a multiple choice question
  // Look for patterns like "a) option" or "1. option" in the question text
  const mcqPatterns = [
    /[a-d]\)\s.+/gm,  // a) option
    /[a-d]\.\s.+/gm,  // a. option
    /\([a-d]\)\s.+/gm, // (a) option
    /[1-4]\)\s.+/gm,  // 1) option
    /[1-4]\.\s.+/gm   // 1. option
  ];
  
  let isMultipleChoice = false;
  let options: string[] = [];
  
  for (const pattern of mcqPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length >= 2) {
      isMultipleChoice = true;
      // Extract options from the matches
      options = matches.map(match => {
        // Remove the prefix (a), a., etc.) and trim
        return match.replace(/^[a-d1-4]\)|^[a-d1-4]\.\s|^\([a-d]\)\s/i, '').trim();
      });
      break;
    }
  }
  
  if (isMultipleChoice) {
    return { ...question, questionType: 'MULTIPLE_CHOICE', options };
  }
  
  // Default to short answer
  return { ...question, questionType: 'SHORT_ANSWER' };
};

// Helper function to get color based on difficulty
const getDifficultyColor = (difficulty: number): string => {
  if (difficulty < 0.3) return 'bg-green-500';
  if (difficulty < 0.7) return 'bg-yellow-500';
  return 'bg-red-500';
};

const ReviewSessionPage = () => {
  const navigate = useNavigate();
  const { setId } = useParams<{ setId?: string }>();
  
  // State for the review session
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState('Review Session');
  
  // Session statistics
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    averageDifficulty: 0
  });

  // Load questions when component mounts
  useEffect(() => {
    const fetchQuestionSet = async () => {
      if (!setId) {
        setError('No question set ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch question set directly using the standalone endpoint
        console.log(`Fetching question set with ID: ${setId}`);
        const questionSet = await apiClient.get<QuestionSet>(`/questionsets/${setId}`).then(res => res.data);
        setSessionTitle(`Quiz: ${questionSet.name}`);
        
        // Fetch questions directly using the standalone endpoint
        console.log(`Fetching questions for question set with ID: ${setId}`);
        const fetchedQuestions = await apiClient.get<Question[]>(`/questionsets/${setId}/questions`).then(res => res.data);
        
        if (fetchedQuestions.length === 0) {
          setError('No questions found for this question set');
          setIsLoading(false);
          return;
        }
        
        // Process questions to determine their type
        const processedQuestions = fetchedQuestions.map(determineQuestionType);
        setQuestions(processedQuestions);
        
        // Initialize session stats
        setSessionStats({
          totalQuestions: processedQuestions.length,
          questionsAnswered: 0,
          correctAnswers: 0,
          averageDifficulty: processedQuestions.reduce((sum, q) => sum + (q.difficultyScore || 0.5), 0) / processedQuestions.length
        });
        
        setIsLoading(false);
        
        console.log('Fetched questions with learning data:', processedQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchQuestionSet();
  }, [setId]);

  // Handle submitting an answer
  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Log the current question and user answer for now
    console.log('Question:', currentQuestion);
    console.log('User Answer:', userAnswer);
    console.log('Question Learning Stage:', currentQuestion.learningStage);
    console.log('Question Difficulty:', currentQuestion.difficultyScore);
    console.log('Question Concept Tags:', currentQuestion.conceptTags);
    console.log('Previous User Answers:', currentQuestion.userAnswers);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1
    }));
    
    // Clear the user answer
    setUserAnswer('');
    
    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // End of session
      setSessionComplete(true);
    }
  };

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <span className="mr-1.5"><FiArrowLeft size={16} /></span>
          Back
        </button>
        <h1 className="text-3xl font-bold text-white">{sessionTitle}</h1>
      </div>

      {/* Session content */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <span className="mr-2 inline-block animate-spin"><FiLoader size={24} /></span>
            <span>Loading questions...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-red-500 mb-4"><FiAlertCircle size={32} /></span>
            <h2 className="text-xl font-bold text-white mb-2">Error</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : sessionComplete ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-green-500"><FiCheck size={32} /></span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Review Session Complete!</h2>
            <p className="text-slate-400 mb-6">You've answered all the questions in this session.</p>
            
            {/* Session statistics */}
            <div className="mb-8 max-w-md mx-auto">
              <div className="bg-slate-800 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-white mb-3">Session Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Questions Answered:</span>
                    <span className="text-white font-medium">{sessionStats.questionsAnswered} of {sessionStats.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Difficulty:</span>
                    <span className="text-white font-medium">{(sessionStats.averageDifficulty * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div>
            {/* Progress indicator */}
            <div className="flex justify-between mb-6 text-sm text-slate-400">
              <div>
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              {currentQuestion?.difficultyScore !== undefined && (
                <div className="flex items-center">
                  <span className="mr-2">Difficulty:</span>
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getDifficultyColor(currentQuestion.difficultyScore)}`}
                      style={{ width: `${currentQuestion.difficultyScore * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Question display */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-white mb-2">{currentQuestion?.text}</h2>
            
            {/* Display concept tags if available */}
            {currentQuestion?.conceptTags && currentQuestion.conceptTags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {currentQuestion.conceptTags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
              
              {/* Different input types based on question type */}
              {currentQuestion?.questionType === 'TRUE_FALSE' ? (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="true-option"
                      name="true-false"
                      value="True"
                      checked={userAnswer === 'True'}
                      onChange={() => setUserAnswer('True')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-800"
                    />
                    <label htmlFor="true-option" className="ml-2 block text-white">True</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="false-option"
                      name="true-false"
                      value="False"
                      checked={userAnswer === 'False'}
                      onChange={() => setUserAnswer('False')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-800"
                    />
                    <label htmlFor="false-option" className="ml-2 block text-white">False</label>
                  </div>
                </div>
              ) : currentQuestion?.questionType === 'MULTIPLE_CHOICE' && currentQuestion.options ? (
                <div className="mt-4 space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="multiple-choice"
                        value={option}
                        checked={userAnswer === option}
                        onChange={() => setUserAnswer(option)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-800"
                      />
                      <label htmlFor={`option-${index}`} className="ml-2 block text-white">{option}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full p-3 mt-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
                  rows={4}
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                className={`inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg ${
                  userAnswer.trim() 
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                    : 'text-slate-400 bg-slate-700 cursor-not-allowed'
                } focus:outline-none transition-colors`}
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <span className="ml-1.5"><FiArrowRight size={16} /></span>
                  </>
                ) : (
                  'Complete Session'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSessionPage;
