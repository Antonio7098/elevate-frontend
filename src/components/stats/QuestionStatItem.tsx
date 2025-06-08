import React from 'react';
import type { QuestionStat } from '../../api/stats';
import styles from './QuestionStatItem.module.css';

interface Props {
  question: QuestionStat;
}

const QuestionStatItem: React.FC<Props> = ({ question }) => {
  return (
    <div className={styles.item}>
      <div className={styles.text}>{question.text}</div>
      <div className={styles.score}>{question.score} / {question.total}</div>
    </div>
  );
};

export default QuestionStatItem;
