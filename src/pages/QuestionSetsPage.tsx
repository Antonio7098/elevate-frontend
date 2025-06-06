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

import styles from './QuestionSetsPage.module.css';

// Skeleton loader for question sets
const QuestionSetSkeleton = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonBar}></div>
    <div className={styles.skeletonBarSmall}></div>
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
      <div className={styles.container}>
        <div style={{marginBottom: '2rem', animation: 'skeletonPulse 1.2s ease-in-out infinite alternate'}}>
          <div style={{height: '2rem', background: '#1e293b', borderRadius: '0.75rem', width: '33%', marginBottom: '0.5rem'}}></div>
          <div style={{height: '1.25rem', background: '#1e293b', borderRadius: '0.75rem', width: '25%'}}></div>
        </div>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <QuestionSetSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate('/folders')}
        className={styles.backBtn}
      >
        <FiArrowLeft style={{marginRight: 8}} />
        Back to Folders
      </button>
      
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{folder?.name || 'Question Sets'}</h1>
          <p className={styles.subtitle}>
            {questionSets.length} {questionSets.length === 1 ? 'question set' : 'question sets'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => navigate(`/folders/${folderId}/create-set`)}
            className={styles.aiBtn}
          >
            <FiCpu style={{marginRight: 8, width: 16, height: 16}} />
            AI-Powered Set
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.newSetBtn}
          >
            <FiPlus style={{marginRight: 8, width: 16, height: 16}} />
            New Question Set
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <FiAlertCircle style={{width: 20, height: 20}} />
          <span>{error}</span>
        </div>
      )}

      {questionSets.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <FiFileText style={{width: 32, height: 32, color: '#6366f1'}} />
          </div>
          <h3 className={styles.emptyTitle}>No question sets yet</h3>
          <p className={styles.emptyDesc}>
            Create your first question set to start studying
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.emptyBtn}
          >
            <FiPlus style={{marginRight: 8, width: 16, height: 16}} />
            Create Question Set
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {questionSets.map((questionSet) => (
            <div
              key={questionSet.id}
              className={styles.setCard}
              tabIndex={0}
            >
              <div className={styles.setRow}>
                <div style={{display: 'flex', alignItems: 'flex-start'}}>
                  <div className={styles.setIcon}>
                    <FiFileText style={{width: 20, height: 20}} />
                  </div>
                  <div className={styles.setInfo}>
                    <h3 className={styles.setName}>{questionSet.name}</h3>
                    {questionSet.description && (
                      <p className={styles.setDesc}>
                        {questionSet.description}
                      </p>
                    )}
                    <div className={styles.setDate}>
                      Created {formatDate(questionSet.createdAt)}
                    </div>
                    <div className={styles.setDate}>
                      {questionSet.nextReviewAt ? (
                        <>Next review: {formatDate(questionSet.nextReviewAt)}</>
                      ) : (
                        <span>No review scheduled</span>
                      )}
                    </div>
                    <div className={styles.setDate}>
                      Mastery: {typeof questionSet.currentTotalMasteryScore === 'number' ? `${Math.round(questionSet.currentTotalMasteryScore)}%` : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className={styles.setActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className={styles.actionBtn}
                    title="Edit question set"
                  >
                    <FiEdit2 style={{width: 16, height: 16}} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestionSet(questionSet.id);
                    }}
                    disabled={isDeleting === questionSet.id}
                    className={styles.actionBtn}
                    title="Delete question set"
                  >
                    {isDeleting === questionSet.id ? (
                      <FiLoader style={{width: 16, height: 16}} className="animate-spin" />
                    ) : (
                      <FiTrash2 style={{width: 16, height: 16}} />
                    )}
                  </button>
                </div>
              </div>
              <div className={styles.setFooter}>
                <button
                  onClick={() => navigate(`/question-sets/${questionSet.id}`)}
                  className={styles.viewBtn}
                >
                  View questions
                  <span><FiChevronRight size={16} /></span>
                </button>
                <button
                  onClick={() => navigate(`/quiz/set/${questionSet.id}`)}
                  className={styles.quizBtn}
                >
                  Start Quiz
                  <span><FiChevronRight size={16} /></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Question Set Modal */}
      {isCreateModalOpen && (
        <div className={styles.modalBackdrop}>
          <div 
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create New Question Set</h2>
                <p className={styles.modalDesc}>Add questions to study</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className={styles.closeBtn}
                aria-label="Close"
              >
                <FiX style={{width: 20, height: 20}} />
              </button>
            </div>
            <form onSubmit={handleCreateQuestionSet} className={styles.form}>
              <div>
                <label htmlFor="question-set-name" className={styles.formLabel}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="question-set-name"
                  required
                  value={newQuestionSet.name}
                  onChange={(e) => setNewQuestionSet({ ...newQuestionSet, name: e.target.value })}
                  className={styles.formInput}
                  placeholder="e.g., Chapter 5 Questions"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="question-set-description" className={styles.formLabel}>
                  Description <span className={styles.optional}>(Optional)</span>
                </label>
                <textarea
                  id="question-set-description"
                  rows={3}
                  value={newQuestionSet.description}
                  onChange={(e) => setNewQuestionSet({ ...newQuestionSet, description: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="Add a brief description..."
                />
              </div>
              <div className={styles.formFooter}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={styles.cancelBtn}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestionSet.name.trim()}
                  className={styles.submitBtn}
                  style={isSubmitting || !newQuestionSet.name.trim() ? {opacity: 0.7, cursor: 'not-allowed'} : {}}
                >
                  {isSubmitting ? (
                    <span style={{display: 'flex', alignItems: 'center'}}>
                      <FiLoader style={{marginLeft: -4, marginRight: 8, width: 16, height: 16}} className="animate-spin" />
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
