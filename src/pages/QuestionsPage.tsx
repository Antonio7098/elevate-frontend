import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiLoader,
  FiX,
  FiAlertCircle,
  FiArrowLeft,
  FiHelpCircle,
  FiCheck,
  FiSave,
  FiEye
} from 'react-icons/fi';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../services/questionService';
import { getQuestionSet, updateQuestionSet } from '../services/questionSetService';
import { QuestionSetEditor } from '../components/questions/QuestionSetEditor';
import { InsightCatalystSidebar } from '../components/notes/InsightCatalystSidebar';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import type { Question } from '../types/question';
import type { QuestionSet } from '../types/questionSet';
import type { CustomBlock, FullCustomBlock } from '../lib/blocknote/schema';
import styles from './QuestionsPage.module.css';

// Skeleton loader for questions
const QuestionSkeleton = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonRow}>
      <div className={styles.skeletonIcon}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonBar}></div>
        <div className={styles.skeletonBarSmall}></div>
        <div className={styles.skeletonBarTiny}></div>
      </div>
    </div>
  </div>
);

const QuestionsPage = () => {
  const { questionSetId } = useParams<{ questionSetId: string }>();
// Helper to get folderId from loaded questionSet
type QuestionSetWithFolder = QuestionSet & { folderId: string };
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    answer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Question Set Editor state
  const [isEditMode, setIsEditMode] = useState(false);
  const [questionSetContent, setQuestionSetContent] = useState<FullCustomBlock[]>([]);
  const [questionSetName, setQuestionSetName] = useState('');
  const [isSavingQuestionSet, setIsSavingQuestionSet] = useState(false);
  
  // Sidebar visibility state
  const [isIncatsVisible, setIsIncatsVisible] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(true);

  // Load question set details
  const loadQuestionSet = useCallback(async () => {
    if (!questionSetId) {
      navigate('/folders');
      return;
    }
    
    try {
      const data = await getQuestionSet(questionSetId, questionSetId);
      setQuestionSet(data);
      setQuestionSetName(data.name);
      // Initialize content from question set if available
      if (data.content) {
        setQuestionSetContent(data.content as FullCustomBlock[]);
      }
    } catch (err) {
      console.error('Failed to load question set:', err);
      // Create a placeholder question set with the ID
      setQuestionSet({
        id: questionSetId,
        name: 'Question Set',
        folderId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      // Don't set an error here, just show a placeholder
    }
  }, [questionSetId, navigate]);

  // Load questions
  const loadQuestions = useCallback(async () => {
    if (!questionSetId) return;
    
    try {
      setLoading(true);
      const data = await getQuestions(questionSetId);
      setQuestions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [questionSetId]);

  // Initial data loading
  useEffect(() => {
    loadQuestionSet();
    loadQuestions();
  }, [loadQuestionSet, loadQuestions]);

  // Handle question creation
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionSetId || !newQuestion.text.trim() || !newQuestion.answer.trim()) return;

    // Get folderId from loaded questionSet
    const folderId = (questionSet as QuestionSetWithFolder)?.folderId;
    if (!folderId) {
      setError('Cannot create question: missing folder ID.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Only send text and answer, NOT questionSetId
      const createdQuestion = await createQuestion(folderId, questionSetId, {
        text: newQuestion.text.trim(),
        answer: newQuestion.answer.trim(),
        questionType: 'short-answer'
      });
      setQuestions(prev => [createdQuestion, ...prev]);
      setNewQuestion({ text: '', answer: '' });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create question:', err);
      setError('Failed to create question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle question update
  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionSetId || !currentQuestion) return;

    try {
      setIsSubmitting(true);
      const updatedQuestion = await updateQuestion(questionSetId, currentQuestion.id, {
        text: currentQuestion.text.trim(),
        answer: currentQuestion.answer.trim()
      });
      
      setQuestions(prev => 
        prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
      );
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update question:', err);
      setError('Failed to update question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle question deletion
  const handleDeleteQuestion = async (questionId: string) => {
    if (!questionSetId) return;
    
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await deleteQuestion(questionSetId, questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Failed to delete question:', err);
      setError('Failed to delete question. Please try again.');
    }
  };

  // Handle question set editing
  const handleSaveQuestionSet = async () => {
    if (!questionSetId || !questionSet) return;
    
    try {
      setIsSavingQuestionSet(true);
      await updateQuestionSet(questionSetId, {
        name: questionSetName,
        content: questionSetContent
      });
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to save question set:', err);
      setError('Failed to save question set. Please try again.');
    } finally {
      setIsSavingQuestionSet(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset to original values
    if (questionSet) {
      setQuestionSetName(questionSet.name);
      if (questionSet.content) {
        setQuestionSetContent(questionSet.content as FullCustomBlock[]);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border, #e5e7eb)',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsIncatsVisible(!isIncatsVisible)} 
            style={{
              padding: '8px 12px',
              border: '1px solid var(--color-border, #e5e7eb)',
              borderRadius: '6px',
              backgroundColor: 'var(--color-surface, #fff)',
              cursor: 'pointer'
            }}
          >
            {isIncatsVisible ? 'Hide InCat' : 'Show InCat'}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            className={styles.backBtn}
          >
            <span className="mr-1.5"><FiArrowLeft size={16} /></span>
            Back to Question Sets
          </button>
          {isEditMode ? (
            <>
              <button
                onClick={handleSaveQuestionSet}
                disabled={isSavingQuestionSet}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isSavingQuestionSet ? 'not-allowed' : 'pointer',
                  opacity: isSavingQuestionSet ? 0.7 : 1
                }}
              >
                <FiSave size={16} />
                {isSavingQuestionSet ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <FiEdit2 size={16} />
                Edit Question Set
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className={styles.addBtn}
              >
                <FiPlus size={16} className="-ml-1 mr-2" />
                Add Question
              </button>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsChatVisible(!isChatVisible)} 
            style={{
              padding: '8px 12px',
              border: '1px solid var(--color-border, #e5e7eb)',
              borderRadius: '6px',
              backgroundColor: 'var(--color-surface, #fff)',
              cursor: 'pointer'
            }}
          >
            {isChatVisible ? 'Hide Chat' : 'Show Chat'}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {loading ? 'Loading...' : questionSet?.name || 'Questions'}
          </h1>
          {questionSet && (
            <p className={styles.subtitle}>
              {questionSet.description}
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <span className="mr-3 mt-0.5 flex-shrink-0"><FiAlertCircle size={20} /></span>
          <span>{error}</span>
        </div>
      )}

      {/* Three-panel layout for edit mode */}
      {isEditMode ? (
        <div style={{ 
          display: 'flex', 
          height: 'calc(100vh - 200px)',
          gap: '16px'
        }}>
          {isIncatsVisible && (
            <div style={{ 
              width: '300px',
              border: '1px solid var(--color-border, #e5e7eb)',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface, #fff)',
              overflow: 'hidden'
            }}>
              <InsightCatalystSidebar noteId={questionSetId || 'new'} />
            </div>
          )}
          
          <div style={{ 
            flex: 1,
            border: '1px solid var(--color-border, #e5e7eb)',
            borderRadius: '8px',
            backgroundColor: 'var(--color-surface, #fff)',
            padding: '20px',
            overflow: 'auto'
          }}>
            <QuestionSetEditor
              initialContent={questionSetContent}
              onContentChange={setQuestionSetContent}
              editable={true}
              questionSetName={questionSetName}
              onNameChange={setQuestionSetName}
            />
          </div>
          
          {isChatVisible && (
            <div style={{ 
              width: '300px',
              border: '1px solid var(--color-border, #e5e7eb)',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface, #fff)',
              overflow: 'hidden'
            }}>
              <ChatSidebar noteId={questionSetId || 'new'} />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Loading state */}
          {loading ? (
        <div className={styles.grid}>
          {[...Array(3)].map((_, index) => (
            <QuestionSkeleton key={index} />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <FiHelpCircle className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className={styles.emptyTitle}>No questions yet</h3>
          <p className={styles.emptyDesc}>
            Create your first question to start studying
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.emptyBtn}
          >
            <FiPlus size={16} className="-ml-1 mr-2" />
            Create Question
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {questions.map((question) => (
            <div
              key={question.id}
              className="card"
            >
              <div className={styles.cardRow}>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardName}>
                    {question.text}
                  </h3>
                  {question.uueFocus && (
                    <span className={styles.cardUueFocus}>
                      {question.uueFocus}
                    </span>
                  )}
                  <div className={styles.cardAnswer}>
                    <div className={styles.cardAnswerLabel}>
                      <span className={styles.cardAnswerIcon}><FiCheck size={16} /></span>
                      <span className={styles.cardAnswerText}>Answer:</span>
                    </div>
                    <p className={styles.cardAnswerValue}>
                      {question.answer}
                    </p>
                  </div>
                  <div className={styles.cardDate}>
                    Created {formatDate(question.createdAt)}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentQuestion(question);
                      setIsEditModalOpen(true);
                    }}
                    className={styles.actionBtn}
                    title="Edit question"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(question.id);
                    }}
                    className={styles.actionBtn}
                    title="Delete question"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Question Modal */}
      {isCreateModalOpen && (
        <div className={styles.modalBackdrop}>
          <div 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Question</h2>
              <p className={styles.modalDesc}>Add a question to study</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className={styles.closeBtn}
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
            <form onSubmit={handleCreateQuestion} className={styles.form}>
              <div>
                <label htmlFor="question-text" className={styles.formLabel}>
                  Question <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="question-text"
                  required
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="e.g., What is the capital of France?"
                  rows={3}
                  autoFocus
                ></textarea>
              </div>
              <div>
                <label htmlFor="question-answer" className={styles.formLabel}>
                  Answer <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="question-answer"
                  required
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="e.g., Paris"
                  rows={3}
                ></textarea>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestion.text.trim() || !newQuestion.answer.trim()}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader size={20} className={styles.loaderIcon} />
                      Creating...
                    </>
                  ) : (
                    'Create Question'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {isEditModalOpen && currentQuestion ? (
        <div className={styles.modalBackdrop}>
          <div 
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Question</h2>
              <p className={styles.modalDesc}>Update question details</p>
            </div>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className={styles.closeBtn}
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
            <form onSubmit={handleUpdateQuestion} className={styles.form}>
              <div>
                <label htmlFor="edit-question-text" className={styles.formLabel}>
                  Question <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="edit-question-text"
                  required
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                  className={styles.formTextarea}
                  rows={3}
                  autoFocus
                ></textarea>
              </div>
              <div>
                <label htmlFor="edit-question-answer" className={styles.formLabel}>
                  Answer <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="edit-question-answer"
                  required
                  value={currentQuestion.answer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
                  className={styles.formTextarea}
                  rows={3}
                ></textarea>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !currentQuestion.text.trim() || !currentQuestion.answer.trim()}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader size={20} />
                      Updating...
                    </>
                  ) : (
                    'Update Question'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
        </>
      )}
    </div>
  );
};

export default QuestionsPage;
