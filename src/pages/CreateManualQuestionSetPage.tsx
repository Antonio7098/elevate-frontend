import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave, FiLoader, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { getFolders } from '../services/folderService';
import { createQuestionSet } from '../services/questionSetService';
import { createQuestion } from '../services/questionService';
import type { Folder } from '../types/folder';
import styles from './CreateManualQuestionSetPage.module.css';

interface ManualQuestion {
  text: string;
  answer: string;
}

const CreateManualQuestionSetPage: React.FC = () => {
  const navigate = useNavigate();
  const { folderId: preselectedFolderId } = useParams<{ folderId?: string }>();

  // Form state
  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState(preselectedFolderId || '');
  const [questions, setQuestions] = useState<ManualQuestion[]>([]);
  
  // New question form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAnswer, setNewQuestionAnswer] = useState('');

  // UI state
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingFolders, setIsFetchingFolders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        setIsFetchingFolders(true);
        const data = await getFolders();
        setFolders(data);
        if (!preselectedFolderId && data.length > 0) {
          setFolderId(data[0].id);
        }
      } catch {
        setError('Failed to load folders.');
      } finally {
        setIsFetchingFolders(false);
      }
    };
    loadFolders();
  }, [preselectedFolderId]);

  const handleAddQuestion = () => {
    if (newQuestionText.trim() && newQuestionAnswer.trim()) {
      setQuestions([...questions, { text: newQuestionText, answer: newQuestionAnswer }]);
      setNewQuestionText('');
      setNewQuestionAnswer('');
      setError(null);
    } else {
      setError('Question and answer cannot be empty.');
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim() || !folderId) {
      setError('Please provide a name and select a folder.');
      return;
    }
    if (questions.length === 0) {
      setError('Please add at least one question.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const newSet = await createQuestionSet(folderId, { name });
      for (const q of questions) {
        await createQuestion(folderId, newSet.id, { ...q, questionSetId: newSet.id });
      }
      navigate(`/question-sets/${newSet.id}`);
    } catch {
      setError('Failed to save the question set. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <FiArrowLeft /> Back
        </button>
        <h1 className={styles.title}>Create Question Set from Scratch</h1>
      </div>

      {error && (
        <div className={styles.error}>
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.formGrid}>
        {/* Question Set Details */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Set Details</h2>
          <div className={styles.formGroup}>
            <label htmlFor="set-name">Question Set Name</label>
            <input
              id="set-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chapter 1 Review"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="folder-select">Folder</label>
            <select
              id="folder-select"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className={styles.select}
              disabled={isFetchingFolders}
            >
              <option value="">{isFetchingFolders ? 'Loading...' : 'Select a folder'}</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>

        {/* Add New Question */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Add a Question</h2>
          <div className={styles.formGroup}>
            <label htmlFor="new-question-text">Question</label>
            <textarea
              id="new-question-text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="What is the capital of France?"
              className={styles.textarea}
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="new-question-answer">Answer</label>
            <textarea
              id="new-question-answer"
              value={newQuestionAnswer}
              onChange={(e) => setNewQuestionAnswer(e.target.value)}
              placeholder="Paris"
              className={styles.textarea}
              rows={2}
            />
          </div>
          <button onClick={handleAddQuestion} className={styles.addButton}>
            <FiPlus /> Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className={styles.questionsListSection}>
        <h2 className={styles.sectionTitle}>Your Questions ({questions.length})</h2>
        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <ul className={styles.questionsList}>
            {questions.map((q, index) => (
              <li key={index} className={styles.questionItem}>
                <div className={styles.questionContent}>
                  <strong>Q:</strong> {q.text}
                  <br />
                  <strong>A:</strong> {q.answer}
                </div>
                <button onClick={() => handleDeleteQuestion(index)} className={styles.deleteButton}>
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save Action */}
      <div className={styles.saveAction}>
        <button onClick={handleSave} disabled={isSaving} className={styles.saveButton}>
          {isSaving ? <><FiLoader className={styles.spinner} /> Saving...</> : <><FiSave /> Save Question Set</>}
        </button>
      </div>
    </div>
  );
};

export default CreateManualQuestionSetPage;
