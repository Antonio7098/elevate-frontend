import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { 
  FiFolder, 
  FiAlertCircle, 
  FiLoader
} from 'react-icons/fi';
import { generateAiPoweredSet } from '../services/aiService';
import { getFolders } from '../services/folderService';
import type { Folder } from '../types/folder';
import AddQuestionModal from './AddQuestionModal';
import { createQuestionSet } from '../services/questionSetService';
import { createQuestion } from '../services/questionService';
import { createPortal } from 'react-dom';

const FOCUS_OPTIONS = [
  { value: 'understand', label: 'Understand (Foundational Concepts)' },
  { value: 'use', label: 'Use (Application & Context)' },
  { value: 'explore', label: 'Explore (Analysis & Deeper Inquiry)' }
];

interface QuestionSet {
  set: {
    id: string;
    name: string;
  };
  questions: ModalQuestion[];
}

interface CreateQuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QuestionSet) => void;
  folders?: Folder[];
  preselectedFolderId?: string;
}

// Define a type for a question (AI or manual)
type ModalQuestion = {
  text: string;
  answer: string;
  type?: string;
  marks?: string | number;
  markingScheme?: string;
  focus?: string;
};

const CreateQuestionSetModal: React.FC<CreateQuestionSetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folders: foldersProp,
  preselectedFolderId,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [focus, setFocus] = useState<'understand' | 'use' | 'explore'>('understand');
  const [folderId, setFolderId] = useState(preselectedFolderId || '');
  const [folders, setFolders] = useState<Folder[]>(foldersProp || []);
  const [isFetchingFolders, setIsFetchingFolders] = useState(!foldersProp);
  const [questions, setQuestions] = useState<ModalQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load folders if not provided
  useEffect(() => {
    if (foldersProp) return;
    const loadFolders = async () => {
      try {
        setIsFetchingFolders(true);
        const data = await getFolders();
        setFolders(data);
        if (!preselectedFolderId && data.length > 0 && !folderId) {
          setFolderId(data[0].id);
        }
      } catch {
        setError('Failed to load folders. Please try again.');
      } finally {
        setIsFetchingFolders(false);
      }
    };
    loadFolders();
    // eslint-disable-next-line
  }, []);

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

  // Add a manually created question
  const handleAddQuestion = (question: ModalQuestion) => {
    setQuestions((prev) => [...prev, question]);
    setIsAddQuestionOpen(false);
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Create the question set
      const set = await createQuestionSet(folderId, { name });
      // Create each question
      for (const q of questions) {
        await createQuestion(folderId, set.id, {
          text: q.text,
          answer: q.answer || '',
          questionSetId: set.id
        });
      }
      onSave({ set, questions });
    } catch {
      setError('Failed to save question set and questions.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Accessibility: focus trap and aria-modal
  const modalContent = (
    <div className="elevateModalBackdrop" role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="elevateModal" tabIndex={0}>
        <h2 id="modal-title">Create New Question Set</h2>
        {error && (
          <div className="error" role="alert" style={{ marginBottom: 12 }}>
            <FiAlertCircle style={{ height: 20, width: 20, marginRight: 12, marginTop: 2, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleGenerate}>
          {/* Folder Selection */}
          <div>
            <label htmlFor="folder-select">
              Select Folder <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              {isFetchingFolders ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <label htmlFor="question-set-name">
              Question Set Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="text"
              id="question-set-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chapter 5 Quiz"
              required
            />
          </div>

          {/* Source Material */}
          <div>
            <label htmlFor="source-material">
              Paste Your Source Material Here <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <textarea
              id="source-material"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
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
            <label htmlFor="question-count">
              Number of Questions (Approx.)
            </label>
            <input
              type="number"
              id="question-count"
              min={3}
              max={20}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            />
            <p style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
              Between 3 and 20 questions recommended
            </p>
          </div>

          {/* Learning Focus */}
          <div>
            <label htmlFor="learning-focus">
              Learning Focus
            </label>
            <select
              id="learning-focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value as 'understand' | 'use' | 'explore')}
            >
              {FOCUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || isFetchingFolders}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" style={{ marginRight: 8, height: 20, width: 20, verticalAlign: 'middle' }} />
                  Generating Questions...
                </>
              ) : (
                'Generate Questions with Elevate AI'
              )}
            </button>
          </div>
        </form>

        {/* Generated Questions List */}
        {questions.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3>Questions</h3>
            <ul>
              {questions.map((q, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{q.text || JSON.stringify(q)}</span>
                  <button type="button" onClick={() => handleDeleteQuestion(idx)} style={{ marginLeft: 8 }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" onClick={() => setIsAddQuestionOpen(true)} style={{ marginTop: 16 }}>
          Add Question
        </button>
        <AddQuestionModal isOpen={isAddQuestionOpen} onClose={() => setIsAddQuestionOpen(false)} onAdd={handleAddQuestion} />
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose}>Cancel</button>
          <button type="button" onClick={handleSave} disabled={isSaving || questions.length === 0}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CreateQuestionSetModal; 