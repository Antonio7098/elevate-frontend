import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import styles from './CreateAiQuestionSetPage.module.css';
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
import type { Folder } from '../types/folder';

// Focus options for AI question generation
const FOCUS_OPTIONS = [
  { value: 'understand', label: 'Understand (Foundational Concepts)' },
  { value: 'use', label: 'Use (Application & Context)' },
  { value: 'explore', label: 'Explore (Analysis & Deeper Inquiry)' }
];

const CreateAiQuestionSetPage = () => {
  const navigate = useNavigate();
  const { folderId: preselectedFolderId } = useParams<{ folderId?: string }>();
  
  // Form state
  const [name, setName] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [focus, setFocus] = useState<'understand' | 'use' | 'explore'>('understand');
  const [folderId, setFolderId] = useState(preselectedFolderId || '');
  
  // UI state
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingFolders, setIsFetchingFolders] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
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

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Validate form
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
      
      // Navigate to the newly created question set
      navigate(`/question-sets/${result.id}`);
    } catch (err: unknown) {
      console.error('Error generating questions:', err);
      setError(
        err.response?.data?.message || 
        'Failed to generate questions. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          className={styles.cancelBtn}
        >
          <FiArrowLeft style={{ marginRight: 6, height: 16, width: 16 }} />
          Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ padding: '0.5rem', background: 'var(--color-primary)', borderRadius: '0.7rem', color: 'var(--color-primary)', marginRight: '1rem' }}>
            <FiCpu style={{ height: 24, width: 24 }} />
          </div>
          <div>
            <h1 className={styles.title}>
              Create AI-Powered Question Set
            </h1>
            <p className={styles.subtitle}>
              Provide source material and Elevate AI will generate questions for you
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <FiAlertCircle style={{ height: 20, width: 20, marginRight: 12, marginTop: 2, flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Folder Selection */}
        <div>
          <label htmlFor="folder-select" className={styles.formLabel}>
            Select Folder <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            {isFetchingFolders ? (
              <div className={styles.input} style={{ display: 'flex', alignItems: 'center' }}>
                <FiLoader className="animate-spin" style={{ height: 20, width: 20, marginRight: 8 }} />
                Loading folders...
              </div>
            ) : (
              <>
                <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-border)' }}>
                  <FiFolder style={{ height: 20, width: 20 }} />
                </span>
                <select
                  id="folder-select"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className={styles.input}
                  style={{ paddingLeft: 40 }}
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
        <div>
          <label htmlFor="question-set-name" className={styles.formLabel}>
            Question Set Name <span style={{ color: 'var(--color-danger)' }}>*</span>
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
        <div>
          <label htmlFor="source-material" className={styles.formLabel}>
            Paste Your Source Material Here <span style={{ color: 'var(--color-danger)' }}>*</span>
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
          <p style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
            Minimum 100 characters required for meaningful question generation
          </p>
        </div>

        {/* Number of Questions */}
        <div>
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
          <p style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
            Between 3 and 20 questions recommended
          </p>
        </div>

        {/* Learning Focus */}
        <div>
          <label htmlFor="learning-focus" className={styles.formLabel}>
            Learning Focus
          </label>
          <select
            id="learning-focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value as 'understand' | 'use' | 'explore')}
            className={styles.input}
          >
            {FOCUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className={styles.actions}>
          <button
            type="submit"
            disabled={isLoading || isFetchingFolders}
            className={styles.submitBtn}
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" style={{ marginRight: 8, height: 20, width: 20, verticalAlign: 'middle' }} />
                Generating Questions...
              </>
            ) : (
              'Generate Quiz with Elevate AI'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAiQuestionSetPage;
