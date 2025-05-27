import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { apiClient } from '../services/apiClient';
import { evaluateUserAnswer } from '../services/evaluationService';
import AnswerEvaluation from '../components/evaluation/AnswerEvaluation';
import type { Question } from '../types/question';
import type { QuestionSet } from '../types/questionSet';
import type { EvaluationResult } from '../services/evaluationService';

// Define question types for the review session
interface ReviewQuestion extends Question {
  questionType?: 'SHORT_ANSWER' | 'TRUE_FALSE' | 'MULTIPLE_CHOICE';
  options?: string[]; // For multiple choice questions
}

// Helper function to map numeric learning stage to UUE focus string
const mapNumericStageToUueFocus = (stage: number | undefined): 'Understand' | 'Use' | 'Explore' => {
  if (stage === undefined) return 'Understand'; // Default if stage is not provided
  // Assuming stages 0-1 map to Understand, 2-3 to Use, 4+ to Explore
  // This mapping might need adjustment based on actual stage definitions
  if (stage <= 1) return 'Understand';
  if (stage <= 3) return 'Use';
  return 'Explore';
};

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
  const startTimeRef = useRef<number | null>(null);
  
  // State for the review session
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState('Review Session');
  
  // State for answer evaluation
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evaluationStatus, setEvaluationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isMarked, setIsMarked] = useState<boolean>(false); // Track if current question is marked
  
  // State for storing outcomes of each question in the session
  const [sessionOutcomes, setSessionOutcomes] = useState<QuestionOutcome[]>([]);
  
  // Define types for component props and state
  interface QuestionOutcome {
    questionId: string;
    userAnswer: string;
    scoreAchieved: number;
    uueFocus: string; // Understand, Use, Extend
    evaluationFeedback?: string; // Optional: if you want to store feedback per question
  }

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
        // Removed sessionStats initialization
        
        startTimeRef.current = Date.now(); // Start timer when questions are loaded
        
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

  // Handle marking an answer
  const handleMarkAnswer = async () => {
    if (!userAnswer.trim()) {
      // Don't submit empty answers
      return;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    console.log('🚀 [ReviewSession] Starting answer evaluation process');
    console.log('📋 [ReviewSession] Current question:', currentQuestion);
    console.log('✏️ [ReviewSession] User answer:', userAnswer);
    
    // Reset previous evaluation
    setEvaluation(null);
    setEvaluationStatus('loading');
    console.log('⏳ [ReviewSession] Evaluation status set to loading')
    
    try {
      // Add question set name to the question object if available
      const enhancedQuestion = {
        ...currentQuestion,
        questionSetName: sessionTitle.replace('Quiz: ', '')
      };
      
      console.log('🔄 [ReviewSession] Calling evaluateUserAnswer function');
      console.log('📝 [ReviewSession] Enhanced question with set name:', enhancedQuestion.questionSetName);
      
      // Evaluate the answer using AI
      const result = await evaluateUserAnswer(enhancedQuestion, userAnswer);
      
      console.log('✅ [ReviewSession] Evaluation completed successfully');
      console.log('📊 [ReviewSession] Evaluation result:', result);
      
      // Store the evaluation result
      setEvaluation(result);
      setEvaluationStatus('success');
      setIsMarked(true); // Mark the question as evaluated
      console.log('🎯 [ReviewSession] Evaluation status set to success');

      // Log the raw evaluation result
      console.log('💡 [ReviewSession] Raw evaluation result:', JSON.parse(JSON.stringify(result)));

      const newOutcome: QuestionOutcome = {
        questionId: String(currentQuestion.id), // Ensure questionId is a string
        userAnswer: userAnswer,
        // Use scoreAchieved directly, defaulting to 0 if null. Max score from service is 100.
        scoreAchieved: result.scoreAchieved === null ? 0 : Math.round(result.scoreAchieved),
        uueFocus: mapNumericStageToUueFocus(result.newLearningStage),
        //evaluationFeedback: result.feedback,
      };
      setSessionOutcomes(prevOutcomes => [...prevOutcomes, newOutcome]);
      
      // Log detailed evaluation for debugging
      console.log('📝 [ReviewSession] Detailed evaluation info:');
      console.log('  Question:', currentQuestion.text);
      console.log('  Correct Answer:', currentQuestion.answer);
      console.log('  User Answer:', userAnswer);
      console.log('  Evaluation Result:', JSON.stringify(result, null, 2));
      console.log('  Question Learning Stage:', currentQuestion.learningStage);
      console.log('  Question Difficulty:', currentQuestion.difficultyScore);
      console.log('  Question Concept Tags:', currentQuestion.conceptTags);
      console.log('  Previous User Answers:', currentQuestion.userAnswers);
      
      // Update session stats
      // Removed sessionStats update
    } catch (error: any) {
      console.error('❌ [ReviewSession] Error evaluating answer:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error(`❌ [ReviewSession] Server responded with status: ${error.response.status}`);
        console.error('❌ [ReviewSession] Response data:', error.response.data);
      } else if (error.request) {
        console.error('❌ [ReviewSession] No response received from server');
      } else {
        console.error('❌ [ReviewSession] Error details:', error.message || 'Unknown error');
      }
      
      setEvaluationStatus('error');
      setEvaluation({
        isCorrect: false,
        scoreAchieved: 0,
        feedback: 'Error evaluating answer. Please try again.'
      });
    }
  };
  
  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setUserAnswer(''); // Clear the answer field for the next question
      setEvaluation(null); // Clear the evaluation
      setEvaluationStatus('idle'); // Reset evaluation status
      setIsMarked(false); // Reset marked status
    } else {
      // End of session - submit outcomes
      handleCompleteSession();
    }
  };

  // Handle submitting all session outcomes to the backend
  const handleCompleteSession = async () => {
    if (!setId) {
      console.error("❌ [ReviewSession] Set ID is missing, cannot complete session.");
      setError("Session ID is missing. Cannot save results.");
      return;
    }

    // If there are no outcomes to submit (e.g., user went through questions without marking any, or no questions loaded)
    // but the session is being 'completed', we can just mark it as complete in the UI.
    if (sessionOutcomes.length === 0) {
      console.log("🏁 [ReviewSession] No outcomes to submit. Completing session visually.");
      setSessionComplete(true);
      return;
    }

    console.log('🚀 [ReviewSession] Completing session and submitting outcomes...');
    console.log('📊 [ReviewSession] Final session outcomes:', sessionOutcomes);
    // TODO: Consider adding a visual loading state for submission (e.g., a new state variable `isSubmitting`) 

    const timeSpentInSeconds = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;

    try {
      const payload = { 
        questionSetId: setId,
        outcomes: sessionOutcomes,
        timeSpent: timeSpentInSeconds, 
      };
      console.log('🔍 [ReviewSession] Submitting payload:', JSON.stringify(payload, null, 2)); // Log the entire payload
      await apiClient.post(`/reviews`, payload);
      console.log('✅ [ReviewSession] Session outcomes submitted successfully.');
      setSessionComplete(true); // Mark session as complete in UI after successful submission
    } catch (err: any) {
      console.error('❌ [ReviewSession] Error submitting session outcomes:', err);
      let errorMessage = 'Failed to save session results. Please try again.';
      if (err.response && err.response.data) {
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          // Handle express-validator style errors
          errorMessage = err.response.data.errors.map((e: { msg: string }) => e.msg).join(', ');
        } else if (err.response.data.message) {
          // Handle custom message format
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage); // Display error to the user
      // Still mark as complete visually, but with an error message shown.
      // Alternatively, don't setSessionComplete(true) to allow a retry if that UX is preferred.
      setSessionComplete(true); 
    } finally {
      // TODO: Set `isSubmitting` to false if it was used
    }
  };

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="mr-2 inline-block animate-spin"><FiLoader size={24} /></span>
        <span>Loading questions...</span>
      </div>
    );
  }

  if (sessionComplete) {
    const summaryData = sessionOutcomes.map(outcome => {
      const question = questions.find(q => String(q.id) === outcome.questionId); // Ensure ID comparison is robust
      return {
        questionText: question ? question.text : 'Question text not found.',
        scoreAchieved: outcome.scoreAchieved,
        questionId: outcome.questionId, // For React key
      };
    });

    const totalScore = summaryData.reduce((acc, item) => acc + item.scoreAchieved, 0);
    const averageScore = summaryData.length > 0 ? totalScore / summaryData.length : 0;

    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">🎉 Session Complete! 🎉</h2>
        <p className="mb-8 text-center text-lg text-gray-700">Well done! Your review session has been successfully submitted. Here's your performance summary:</p>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Session Summary</h3>
          <div className="space-y-4 mb-6">
            {summaryData.map((item, index) => (
              <div key={item.questionId || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-500 mb-1">Question {index + 1}</p>
                <p className="text-gray-800 mb-2 font-medium truncate" title={item.questionText}>
                  {item.questionText}
                </p>
                <p className="text-indigo-600 font-semibold text-lg">
                  Score: {item.scoreAchieved} / 100
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-xl font-bold text-gray-800">Overall Average Score: <span className="text-green-600">{Math.round(averageScore)}%</span></p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
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
    );
  }

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
          
          {/* Difficulty indicator */}
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600 mr-2">Difficulty:</span>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getDifficultyColor(currentQuestion.difficultyScore || 0)}`}
                style={{ width: `${(currentQuestion.difficultyScore || 0) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Evaluation results */}
          {evaluationStatus !== 'idle' && (
            <div className="mt-4">
              <AnswerEvaluation 
                evaluation={evaluation} 
                status={evaluationStatus} 
              />
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
        <div className="flex justify-end space-x-4">
          {!isMarked ? (
            <button
              onClick={handleMarkAnswer}
              disabled={!userAnswer.trim()}
              className={`inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg ${
                userAnswer.trim() 
                  ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                  : 'text-slate-400 bg-slate-700 cursor-not-allowed'
              } focus:outline-none transition-colors`}
            >
              Mark Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSessionPage;
