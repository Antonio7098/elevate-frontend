import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import type { Question } from '../types/question';
import type { QuestionSet } from '../types/questionSet';
import styles from './QuestionSelectionPage.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';

const QuestionSelectionPage: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch question set details
        const questionSetRes = await apiClient.get<QuestionSet>(`/questionsets/${setId}`);
        setQuestionSet(questionSetRes.data);
        
        // Fetch all questions in the set
        const questionsRes = await apiClient.get<Question[]>(`/questionsets/${setId}/questions`);
        setQuestions(questionsRes.data);
        
        // Select all questions by default
        setSelectedQuestions(new Set(questionsRes.data.map(q => q.id)));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching question set data:', err);
        setError('Failed to load question set data.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [setId]);

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedQuestions(new Set(questions.map(q => q.id)));
  };

  const handleSelectNone = () => {
    setSelectedQuestions(new Set());
  };

  const handleStartReview = () => {
    if (selectedQuestions.size === 0) {
      alert('Please select at least one question to start the review session.');
      return;
    }

    const selectedQuestionsList = questions.filter(q => selectedQuestions.has(q.id));
    
    navigate('/review/set', {
      state: {
        questions: selectedQuestionsList,
        sessionTitle: `Review: ${questionSet?.name || 'Question Set'}`,
        questionSetId: setId
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!questionSet || questions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>No Questions Found</h2>
          <p>This question set doesn't contain any questions.</p>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs />
      
      <div className={styles.header}>
        <h1 className={styles.title}>Select Questions for Review</h1>
        <p className={styles.subtitle}>
          Choose which questions from "{questionSet.name}" you want to include in your review session.
        </p>
      </div>

      <div className={styles.selectionControls}>
        <div className={styles.selectionInfo}>
          <span className={styles.selectionCount}>
            {selectedQuestions.size} of {questions.length} questions selected
          </span>
        </div>
        <div className={styles.selectionButtons}>
          <button 
            onClick={handleSelectAll}
            className={styles.selectButton}
            disabled={selectedQuestions.size === questions.length}
          >
            Select All
          </button>
          <button 
            onClick={handleSelectNone}
            className={styles.selectButton}
            disabled={selectedQuestions.size === 0}
          >
            Select None
          </button>
        </div>
      </div>

      <div className={styles.questionsList}>
        {questions.map((question, index) => (
          <div 
            key={question.id} 
            className={`card ${selectedQuestions.has(question.id) ? styles.selected : ''}`}
            onClick={() => handleQuestionToggle(question.id)}
          >
            <div className={styles.questionCheckbox}>
              <input
                type="checkbox"
                checked={selectedQuestions.has(question.id)}
                onChange={() => handleQuestionToggle(question.id)}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.questionContent}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>Question {index + 1}</span>
                {question.uueFocus && (
                  <span className={styles.uueTag}>{question.uueFocus}</span>
                )}
                {question.totalMarksAvailable && (
                  <span className={styles.marksTag}>{question.totalMarksAvailable} marks</span>
                )}
              </div>
              <p className={styles.questionText}>{question.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button 
          onClick={handleStartReview}
          className={styles.startButton}
          disabled={selectedQuestions.size === 0}
        >
          Start Review Session ({selectedQuestions.size} questions)
        </button>
      </div>
    </div>
  );
};

export default QuestionSelectionPage; 