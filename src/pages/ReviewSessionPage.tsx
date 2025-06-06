import { useState, useEffect, useRef } from 'react';
import styles from './ReviewSessionPage.module.css';
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
  marksAvailable?: number; // Marks available for the question
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
      <div className={styles.container} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh'}}>
        <span className={styles.loader}><FiLoader size={24} /></span>
        <span>Loading questions...</span>
      </div>
    );
  }

  if (sessionComplete) {
    const summaryData = sessionOutcomes.map(outcome => {
      const question = questions.find(q => String(q.id) === outcome.questionId);
      return {
        questionText: question ? question.text : 'Question text not found.',
        scoreAchieved: outcome.scoreAchieved,
        marksAvailable: question?.marksAvailable || 1, // Correctly get marksAvailable for *this* question
        questionId: outcome.questionId, // For React key
      };
    });

    const totalScoreAchieved = summaryData.reduce((acc, item) => acc + item.scoreAchieved, 0);
    const totalMarksAvailable = summaryData.reduce((acc, item) => acc + item.marksAvailable, 0);
    
    const averageScorePercentage = totalMarksAvailable > 0 ? (totalScoreAchieved / totalMarksAvailable) * 100 : 0;

    return (
      <div className={styles.container}>
        <h2 className={styles.title} style={{color: '#22c55e', textAlign: 'center', marginBottom: '1.5rem'}}>🎉 Session Complete! 🎉</h2>
        <p className={styles.subtitle} style={{textAlign: 'center', marginBottom: '2rem', color: '#64748b'}}>Well done! Your review session has been successfully submitted. Here's your performance summary:</p>

        <div className={styles.questionCard} style={{background: '#fff', boxShadow: '0 2px 24px 0 rgba(20,20,40,0.12)', marginBottom: '2rem'}}>
          <h3 className={styles.title} style={{color: '#334155', textAlign: 'center', fontSize: '1.5rem'}}>Session Summary</h3>
          <div style={{marginBottom: '1.5rem'}}>
            {summaryData.map((item, index) => (
              <div key={item.questionId || index} style={{padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.7rem', background: '#f8fafc', marginBottom: '1rem'}}>
                <p style={{fontSize: '0.95rem', color: '#64748b', marginBottom: '0.25rem'}}>Question {index + 1}</p>
                <p style={{color: '#334155', marginBottom: '0.5rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={item.questionText}>
                  {item.questionText}
                </p>
                <p style={{color: '#6366f1', fontWeight: 600, fontSize: '1.1rem'}}>
                  Score: {item.scoreAchieved} / {item.marksAvailable}
                </p>
              </div>
            ))}
          </div>
          <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', textAlign: 'center'}}>
            <p style={{fontSize: '1.15rem', fontWeight: 700, color: '#334155'}}>Overall Average Score: <span style={{color: '#22c55e'}}>{Math.round(averageScorePercentage)}%</span></p>
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <button
            onClick={() => navigate('/dashboard')}
            className={styles.markBtn}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className={styles.container} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh', textAlign: 'center'}}>
        <span className={styles.error}><FiAlertCircle size={32} /> Error</span>
        <h2 className={styles.title} style={{color: '#fff', marginBottom: '0.5rem'}}>Error</h2>
        <p className={styles.subtitle} style={{color: '#94a3b8', marginBottom: '1.5rem'}}>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className={styles.markBtn}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => navigate(-1)}
          className={styles.backBtn}
        >
          <span style={{marginRight: '0.5rem'}}><FiArrowLeft size={16} /></span>
          Back
        </button>
        <h1 className={styles.title}>{sessionTitle}</h1>
      </div>

      {/* Session content */}
      <div className={styles.questionCard}>
        {/* Progress indicator */}
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: '#94a3b8', fontSize: '0.95rem'}}>
          <div>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Question display */}
        <div className="mb-6">
          <h2 className={styles.questionText}>{currentQuestion?.text}</h2>
          {/* Display concept tags if available */}
          {currentQuestion?.conceptTags && currentQuestion.conceptTags.length > 0 && (
            <div style={{marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
              {currentQuestion.conceptTags.map((tag, index) => (
                <span key={index} style={{padding: '0.25rem 0.5rem', fontSize: '0.82rem', background: 'rgba(99,102,241,0.20)', color: '#a5b4fc', borderRadius: '999px'}}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
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
            <div className={styles.optionsGroup}>
              <div className={styles.optionRow}>
                <input
                  type="radio"
                  id="true-option"
                  name="true-false"
                  value="True"
                  checked={userAnswer === 'True'}
                  onChange={() => setUserAnswer('True')}
                  className={styles.radio}
                />
                <label htmlFor="true-option" className={styles.radioLabel}>True</label>
              </div>
              <div className={styles.optionRow}>
                <input
                  type="radio"
                  id="false-option"
                  name="true-false"
                  value="False"
                  checked={userAnswer === 'False'}
                  onChange={() => setUserAnswer('False')}
                  className={styles.radio}
                />
                <label htmlFor="false-option" className={styles.radioLabel}>False</label>
              </div>
            </div>
          ) : currentQuestion?.questionType === 'MULTIPLE_CHOICE' && currentQuestion.options ? (
            <div className={styles.optionsGroup}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className={styles.optionRow}>
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="multiple-choice"
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => setUserAnswer(option)}
                    className={styles.radio}
                  />
                  <label htmlFor={`option-${index}`} className={styles.radioLabel}>{option}</label>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
          )}
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          {!isMarked ? (
            <button
              onClick={handleMarkAnswer}
              disabled={!userAnswer.trim()}
              className={styles.markBtn}
            >
              Mark Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className={styles.nextBtn}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <span style={{marginLeft: '0.5rem'}}><FiArrowRight size={16} /></span>
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
