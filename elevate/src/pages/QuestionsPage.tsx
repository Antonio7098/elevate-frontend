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
  FiCheck
} from 'react-icons/fi';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../services/questionService';
import { getQuestionSet } from '../services/questionSetService';
import type { Question } from '../types/question';
import type { QuestionSet } from '../types/questionSet';

// Skeleton loader for questions
const QuestionSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 animate-pulse">
    <div className="flex items-start space-x-3">
      <div className="p-2.5 bg-slate-700 rounded-lg h-10 w-10"></div>
      <div className="flex-1">
        <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-700/70 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-slate-700/70 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const QuestionsPage = () => {
  const { questionSetId } = useParams<{ questionSetId: string }>();
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

  // Load question set details
  const loadQuestionSet = useCallback(async () => {
    if (!questionSetId) {
      navigate('/folders');
      return;
    }
    
    try {
      const data = await getQuestionSet(questionSetId, questionSetId);
      setQuestionSet(data);
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

    try {
      setIsSubmitting(true);
      const createdQuestion = await createQuestion(questionSetId, {
        text: newQuestion.text.trim(),
        answer: newQuestion.answer.trim(),
        questionSetId
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <span className="mr-1.5"><FiArrowLeft size={16} /></span>
            Back to Question Sets
          </button>
          <h1 className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : questionSet?.name || 'Questions'}
          </h1>
          {questionSet && (
            <p className="mt-1 text-slate-400">
              {questionSet.description}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <FiPlus size={16} className="-ml-1 mr-2" />
          Add Question
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-300 flex items-start">
          <span className="mr-3 mt-0.5 flex-shrink-0"><FiAlertCircle size={20} /></span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, index) => (
            <QuestionSkeleton key={index} />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full mb-4 text-indigo-400">
            <FiHelpCircle className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No questions yet</h3>
          <p className="mt-1 text-slate-400 max-w-md mx-auto">
            Create your first question to start studying
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-6 inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FiPlus size={16} className="-ml-1 mr-2" />
            Create Question
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="group relative bg-slate-800/50 hover:bg-slate-800/80 rounded-xl p-5 transition-all border border-slate-700/50 hover:border-slate-600/70 overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <span className="text-indigo-400"><FiHelpCircle size={16} /></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-300 group-hover:text-indigo-400 transition-colors">
                      {question.text}
                    </h3>
                    <div className="mt-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <div className="flex items-center mb-1">
                        <span className="text-green-500 mr-2"><FiCheck size={16} /></span>
                        <span className="text-sm font-medium text-slate-300">Answer:</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {question.answer}
                      </p>
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      Created {formatDate(question.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentQuestion(question);
                      setIsEditModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Edit question"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(question.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl transform transition-all duration-200 scale-95 group-hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Create New Question</h2>
                <p className="text-sm text-slate-400 mt-1">Add a question to study</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 -m-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                aria-label="Close"
              >
                <FiX size={20} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateQuestion} className="space-y-5">
              <div>
                <label htmlFor="question-text" className="block text-sm font-medium text-slate-300 mb-2">
                  Question <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="question-text"
                  required
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g., What is the capital of France?"
                  rows={3}
                  autoFocus
                ></textarea>
              </div>
              <div>
                <label htmlFor="question-answer" className="block text-sm font-medium text-slate-300 mb-2">
                  Answer <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="question-answer"
                  required
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g., Paris"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestion.text.trim() || !newQuestion.answer.trim()}
                  className={`px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isSubmitting || !newQuestion.text.trim() || !newQuestion.answer.trim() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader size={20} className="animate-spin mr-2 text-white" />
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
      {isEditModalOpen && currentQuestion && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl transform transition-all duration-200 scale-95 group-hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Question</h2>
                <p className="text-sm text-slate-400 mt-1">Update question details</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 -m-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                aria-label="Close"
              >
                <FiX size={20} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleUpdateQuestion} className="space-y-5">
              <div>
                <label htmlFor="edit-question-text" className="block text-sm font-medium text-slate-300 mb-2">
                  Question <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="edit-question-text"
                  required
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows={3}
                  autoFocus
                ></textarea>
              </div>
              <div>
                <label htmlFor="edit-question-answer" className="block text-sm font-medium text-slate-300 mb-2">
                  Answer <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="edit-question-answer"
                  required
                  value={currentQuestion.answer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !currentQuestion.text.trim() || !currentQuestion.answer.trim()}
                  className={`px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isSubmitting || !currentQuestion.text.trim() || !currentQuestion.answer.trim() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader size={20} className="animate-spin mr-2 text-white" />
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
      )}
    </div>
  );
};

export default QuestionsPage;
