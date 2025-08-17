import React from 'react';
import { mockQuestions } from '../../data/mockData';
import styles from './QuestionsPage.module.css';

const QuestionsPage: React.FC = () => {
  // Filter questions by type for better stats
  const multipleChoiceQuestions = mockQuestions.filter(q => q.questionType === 'multiple_choice');
  const shortAnswerQuestions = mockQuestions.filter(q => q.questionType === 'short_answer');
  const otherQuestions = mockQuestions.filter(q => !['multiple_choice', 'short_answer'].includes(q.questionType));

  return (
    <div className={styles.questionsPage}>
      <div className={styles.header}>
        <h1>Question Bank</h1>
        <p>Browse and manage learning questions</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Questions</h3>
          <p className={styles.statNumber}>{mockQuestions.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Multiple Choice</h3>
          <p className={styles.statNumber}>{multipleChoiceQuestions.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Short Answer</h3>
          <p className={styles.statNumber}>{shortAnswerQuestions.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Other Types</h3>
          <p className={styles.statNumber}>{otherQuestions.length}</p>
        </div>
      </div>

      <div className={styles.questionsList}>
        <h2>All Questions</h2>
        <div className={styles.questionsGrid}>
          {mockQuestions.map((question) => (
            <div key={question.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <h3>{question.question}</h3>
                <span className={`${styles.type} ${styles[question.questionType]}`}>
                  {question.questionType.replace('_', ' ')}
                </span>
              </div>
              <p className={styles.questionText}>{question.question}</p>
              <div className={styles.questionMeta}>
                <span>Blueprint Section: {question.blueprintSectionId}</span>
                <span>Criterion: {question.masteryCriterionId}</span>
                <span>Difficulty: {question.difficulty}</span>
                <span>Status: {question.status}</span>
              </div>
              {question.questionType === 'multiple_choice' && question.options && question.options.length > 0 && (
                <div className={styles.options}>
                  <h4>Options:</h4>
                  <ul>
                    {question.options.map((option, index) => (
                      <li key={option.id || index} className={styles.option}>
                        {option.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {question.tags && question.tags.length > 0 && (
                <div className={styles.questionTags}>
                  {question.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {question.explanation && (
                <div className={styles.explanation}>
                  <h4>Explanation:</h4>
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;

