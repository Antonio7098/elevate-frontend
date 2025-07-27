import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestionSetStats, fetchQuestionSetQuestions } from '../api/stats';
import type { QuestionSetStatsDetails, QuestionStat } from '../api/stats';
import MasteryLineChart from '../components/stats/MasteryLineChart';
import { UUESegmentedProgressBar } from '../components/stats/SegmentedProgressBar';
import QuestionStatItem from '../components/stats/QuestionStatItem';
import styles from './QuestionSetProgressView.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';

const QuestionSetProgressView: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<QuestionSetStatsDetails | null>(null);
  const [questions, setQuestions] = useState<QuestionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchQuestionSetStats(setId),
      fetchQuestionSetQuestions(setId)
    ])
      .then(([statsRes, questionsRes]) => {
        setStats(statsRes);
        setQuestions(questionsRes);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load question set data.');
        setLoading(false);
      });
  }, [setId]);

  if (loading) {
    return <div className={styles.centered}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.centered}>{error}</div>;
  }
  if (!stats) {
    return null;
  }

  return (
    <div className={styles.setPage}>
      <Breadcrumbs />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          className={styles.reviewBtn}
          onClick={() => navigate(`/review/select/${setId}`)}
        >
          Begin Review
        </button>
      </div>
      <h1 className={styles.pageTitle}>{stats.name} - Set Progress</h1>
      <div className={styles.topSection}>
        <div className="card">
          <MasteryLineChart
            data={stats.masteryHistory}
            title={`${stats.name} Mastery Over Time`}
            height={220}
          />
        </div>
        <div className={styles.uuBarBox}>
          <UUESegmentedProgressBar
            understandScore={stats.understandScore}
            useScore={stats.useScore}
            exploreScore={stats.exploreScore}
            height={12}
            showLabels={true}
            showValues={true}
          />
        </div>
      </div>
      <h2 className={styles.sectionTitle}>Questions</h2>
      <div className={styles.questionsList}>
        {questions.map((q) => (
          <QuestionStatItem key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
};

export default QuestionSetProgressView;
