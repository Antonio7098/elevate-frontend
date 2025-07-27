import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiFolder, 
  FiAlertCircle, 
  FiLoader,
  FiArrowLeft,
  FiCpu
} from 'react-icons/fi';
import { generateAiPoweredSet } from '../services/aiService';
import { getFolders } from '../services/folderService';
import { createQuestionSet } from '../services/questionSetService';
import { createQuestion } from '../services/questionService';
import type { Folder } from '../types/folder';
import styles from './CreateQuestionSetPage.module.css';

// Focus options for AI question generation
const FOCUS_OPTIONS = [
  { value: 'understand', label: 'Understand (Foundational Concepts)' },
  { value: 'use', label: 'Use (Application & Context)' },
  { value: 'explore', label: 'Explore (Analysis & Deeper Inquiry)' }
];

type ModalQuestion = {
  text: string;
  answer: string;
  type?: string;
  marks?: string | number;
  markingScheme?: string;
  focus?: string;
};

const CreateQuestionSetPage = () => {
  const navigate = useNavigate();
  const { folderId: preselectedFolderId } = useParams<{ folderId?: string }>();
  
  // Form state
  const [name, setName] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [focus, setFocus] = useState<'understand' | 'use' | 'explore'>('understand');
  const [folderId, setFolderId] = useState(preselectedFolderId || '');
  const [questions, setQuestions] = useState<ModalQuestion[]>([]);
  
  // UI state
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingFolders, setIsFetchingFolders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load folders for the dropdown
  useEffect(() => {
    const loadFolders = async () => {
      try {
        setIsFetchingFolders(true);
        const data = await getFolders();
        setFolders(data);
        
        // If no folder is preselected and we have folders, select the first one
        if (!preselectedFolderId && data.length > 0 && !folderId) {
          setFolderId(data[0].id);
        }
      } catch {
        console.error('Failed to load folders:', err);
        setError('Failed to load folders. Please try again.');
      } finally {
        setIsFetchingFolders(false);
      }
    };
    
    loadFolders();
  }, [preselectedFolderId, folderId]);

  // Form validation
  const validateForm = (): boolean => {
    if (!folderId) {
      setError('Please select a folder');
      return false;
    }
    
    if (!name.trim()) {
      setError('Please enter a name for your question set');
      return false;
    }
    
    if (sourceText.trim().length < 100) {
      setError('Please provide more source material (at least 100 characters)');
      return false;
    }
    
    if (questionCount < 3 || questionCount > 20) {
      setError('Number of questions must be between 3 and 20');
      return false;
    }
    
    return true;
  };

  // Handle AI generation
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      const result = await generateAiPoweredSet({
        folderId,
        name: name.trim(),
        sourceText: sourceText.trim(),
        questionCount,
        focus
      });
      
      // Support both result as array or result.questions as array
      if (Array.isArray(result)) {
        setQuestions(result);
      } else if (result && typeof result === 'object' && Array.isArray((result as { questions: ModalQuestion[] }).questions)) {
        setQuestions((result as { questions: ModalQuestion[] }).questions);
      } else {
        setQuestions([]);
      }
    } catch (err: unknown) {
      setError(
        ((err as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        'Failed to generate questions. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a question from the list
  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (!folderId) throw new Error('No folder selected');
      const set = await createQuestionSet(folderId, { name });
      for (const q of questions) {
        await createQuestion(folderId, set.id, {
          text: q.text,
          answer: q.answer || '',
          questionSetId: set.id
        });
      }
      navigate(`/folders/${folderId}`);
    } catch {
      setError('Failed to save question set and questions.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          <FiArrowLeft />
          Back
        </button>
        <h1 className={styles.title}>Create New Question Set</h1>
      </div>

      {error && (
        <div className={styles.error}>
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate} className={styles.form}>
        {/* Folder Selection */}
        <div className={styles.formGroup}>
          <label htmlFor="folder-select" className={styles.formLabel}>
            Select Folder <span className={styles.required}>*</span>
          </label>
          <div className={styles.selectWrapper}>
            {isFetchingFolders ? (
              <div className={styles.loading}>
                <FiLoader className={styles.spinner} />
                Loading folders...
              </div>
            ) : (
              <>
                <FiFolder className={styles.selectIcon} />
                <select
                  id="folder-select"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="" disabled>Select a folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Question Set Name */}
        <div className={styles.formGroup}>
          <label htmlFor="question-set-name" className={styles.formLabel}>
            Question Set Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="question-set-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="e.g., Chapter 5 Quiz"
            required
          />
        </div>

        {/* Source Material */}
        <div className={styles.formGroup}>
          <label htmlFor="source-material" className={styles.formLabel}>
            Paste Your Source Material Here <span className={styles.required}>*</span>
          </label>
          <textarea
            id="source-material"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className={styles.textarea}
            placeholder="Paste your study notes, textbook excerpts, or other learning material here..."
            rows={10}
            required
          />
          <p className={styles.helpText}>
            Minimum 100 characters required for meaningful question generation
          </p>
        </div>

        {/* Number of Questions */}
        <div className={styles.formGroup}>
          <label htmlFor="question-count" className={styles.formLabel}>
            Number of Questions (Approx.)
          </label>
          <input
            type="number"
            id="question-count"
            min={3}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className={styles.input}
          />
          <p className={styles.helpText}>
            Between 3 and 20 questions recommended
          </p>
        </div>

        {/* Learning Focus */}
        <div className={styles.formGroup}>
          <label htmlFor="learning-focus" className={styles.formLabel}>
            Learning Focus
          </label>
          <select
            id="learning-focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value as 'understand' | 'use' | 'explore')}
            className={styles.select}
          >
            {FOCUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <div className={styles.formGroup}>
          <button
            type="submit"
            className={styles.generateButton}
            disabled={isLoading || isFetchingFolders}
          >
            {isLoading ? (
              <>
                <FiLoader className={styles.spinner} />
                Generating Questions...
              </>
            ) : (
              <>
                <FiCpu />
                Generate Questions with Elevate AI
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Questions List */}
      {questions.length > 0 && (
        <div className={styles.questionsSection}>
          <h2 className={styles.sectionTitle}>Generated Questions</h2>
          <ul className={styles.questionsList}>
            {questions.map((q, idx) => (
              <li key={idx} className={styles.questionItem}>
                <div className={styles.questionContent}>
                  <span className={styles.questionText}>{q.text}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(idx)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          onClick={() => navigate(-1)}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !name || questions.length === 0}
          className={styles.saveButton}
        >
          {isSaving ? (
            <>
              <FiLoader className={styles.spinner} />
              Saving...
            </>
          ) : (
            'Save Question Set'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateQuestionSetPage; 