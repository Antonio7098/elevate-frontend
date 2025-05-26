import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiFileText, 
  FiTrash2, 
  FiEdit2, 
  FiChevronRight,
  FiLoader,
  FiX,
  FiAlertCircle,
  FiArrowLeft,
  FiCpu
} from 'react-icons/fi';
// Auth context not needed for this component
import { getQuestionSets, createQuestionSet, deleteQuestionSet } from '../services/questionSetService';
import { getFolder } from '../services/folderService';
import type { QuestionSet, CreateQuestionSetData } from '../types/questionSet';
import type { Folder } from '../types/folder';

// Skeleton loader for question sets
const QuestionSetSkeleton = () => (
  <div className="p-4 bg-slate-800 rounded-lg animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
  </div>
);

const QuestionSetsPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newQuestionSet, setNewQuestionSet] = useState({ 
    name: '', 
    description: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Load folder details
  const loadFolder = useCallback(async () => {
    if (!folderId) return;
    
    try {
      const folderData = await getFolder(folderId);
      setFolder(folderData);
    } catch (err) {
      console.error('Failed to load folder details:', err);
      setError('Failed to load folder details. Please try again later.');
    }
  }, [folderId]);

  // Load question sets
  const loadQuestionSets = useCallback(async () => {
    if (!folderId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await getQuestionSets(folderId);
      setQuestionSets(data);
    } catch (err) {
      console.error('Failed to load question sets:', err);
      setError('Failed to load question sets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [folderId]);

  // Initial load
  useEffect(() => {
    loadFolder();
    loadQuestionSets();
  }, [loadFolder, loadQuestionSets]);

  // Handle question set creation
  const handleCreateQuestionSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderId || !newQuestionSet.name.trim()) return;

    try {
      setIsSubmitting(true);
      const questionSetData: CreateQuestionSetData = {
        name: newQuestionSet.name.trim(),
        description: newQuestionSet.description?.trim() || undefined,
        folderId
      };
      
      const createdQuestionSet = await createQuestionSet(folderId, questionSetData);
      
      setQuestionSets(prev => [createdQuestionSet, ...prev]);
      setNewQuestionSet({ name: '', description: '' });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create question set:', err);
      setError('Failed to create question set. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle question set deletion
  const handleDeleteQuestionSet = async (questionSetId: string) => {
    if (!folderId || !window.confirm('Are you sure you want to delete this question set? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(questionSetId);
      await deleteQuestionSet(folderId, questionSetId);
      await loadQuestionSets();
    } catch (err) {
      console.error('Failed to delete question set:', err);
      setError('Failed to delete question set. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/3 mb-2"></div>
          <div className="h-5 bg-slate-800 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <QuestionSetSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button 
        onClick={() => navigate('/folders')}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to Folders
      </button>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{folder?.name || 'Question Sets'}</h1>
          <p className="text-slate-400 mt-1">
            {questionSets.length} {questionSets.length === 1 ? 'question set' : 'question sets'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(`/folders/${folderId}/create-set`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg flex items-center transition-colors w-full sm:w-auto justify-center"
          >
            <FiCpu className="w-4 h-4 mr-2" />
            AI-Powered Set
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center transition-colors w-full sm:w-auto justify-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            New Question Set
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
          <FiAlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {questionSets.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-2xl">
          <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FiFileText className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No question sets yet</h3>
          <p className="mt-1 text-slate-400 max-w-md mx-auto">
            Create your first question set to start studying
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-6 inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FiPlus className="-ml-1 mr-2 h-4 w-4" />
            Create Question Set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionSets.map((questionSet) => (
            <div
              key={questionSet.id}
              className="group relative bg-slate-800/50 hover:bg-slate-800/80 rounded-xl p-5 transition-all border border-slate-700/50 hover:border-slate-600/70 overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-300 group-hover:text-indigo-400 transition-colors">
                      {questionSet.name}
                    </h3>
                    {questionSet.description && (
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                        {questionSet.description}
                      </p>
                    )}
                    <div className="mt-3 text-xs text-slate-500">
                      Created {formatDate(questionSet.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    title="Edit question set"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestionSet(questionSet.id);
                    }}
                    disabled={isDeleting === questionSet.id}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete question set"
                  >
                    {isDeleting === questionSet.id ? (
                      <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiTrash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate(`/question-sets/${questionSet.id}`)}
                className="mt-4 w-full flex items-center justify-between text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View questions
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Question Set Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl transform transition-all duration-200 scale-95 group-hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Create New Question Set</h2>
                <p className="text-sm text-slate-400 mt-1">Add questions to study</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 -m-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateQuestionSet} className="space-y-5">
              <div>
                <label htmlFor="question-set-name" className="block text-sm font-medium text-slate-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="question-set-name"
                  required
                  value={newQuestionSet.name}
                  onChange={(e) => setNewQuestionSet({ ...newQuestionSet, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g., Chapter 5 Questions"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="question-set-description" className="block text-sm font-medium text-slate-300 mb-2">
                  Description <span className="text-slate-500">(Optional)</span>
                </label>
                <textarea
                  id="question-set-description"
                  rows={3}
                  value={newQuestionSet.description}
                  onChange={(e) => setNewQuestionSet({ ...newQuestionSet, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Add a brief description..."
                />
              </div>
              <div className="pt-4 border-t border-slate-700/50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestionSet.name.trim()}
                  className={`px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isSubmitting || !newQuestionSet.name.trim() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Creating...
                    </span>
                  ) : (
                    'Create Question Set'
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

export default QuestionSetsPage;
