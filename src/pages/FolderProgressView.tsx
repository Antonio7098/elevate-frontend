import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFolderStats } from '../api/stats';
import type { FolderStatsDetails } from '../api/stats';
import MasteryLineChart from '../components/stats/MasteryLineChart';
import CircularProgress from '../components/stats/CircularProgress';
import { UUESegmentedProgressBar } from '../components/stats/SegmentedProgressBar';
import styles from './FolderProgressView.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';

const FolderProgressView: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [folderStats, setFolderStats] = useState<FolderStatsDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!folderId) return;
    setLoading(true);
    setError(null);
    fetchFolderStats(folderId)
      .then((data) => {
        setFolderStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load folder stats.');
        setLoading(false);
      });
  }, [folderId]);

  if (loading) {
    return <div className={styles.centered}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.centered}>{error}</div>;
  }
  if (!folderStats) {
    return null;
  }

  return (
    <div className={styles.folderPage}>
      <Breadcrumbs />
      <h1 className={styles.pageTitle}>{folderStats.name} Progress</h1>
      <div className={styles.topSection}>
        <div className={styles.chartCard}>
          <MasteryLineChart
            data={folderStats.masteryHistory}
            title={`${folderStats.name} Mastery Over Time`}
            height={260}
          />
        </div>
        <div className={styles.uuBarBox}>
          <UUESegmentedProgressBar
            understandScore={folderStats.understandScore}
            useScore={folderStats.useScore}
            exploreScore={folderStats.exploreScore}
            height={12}
            showLabels={true}
            showValues={true}
          />
        </div>
      </div>
      <h2 className={styles.sectionTitle}>Question Sets</h2>
      <div className={styles.setsGrid}>
        {folderStats.questionSetSummaries.map((set) => (
          <div
            key={set.id}
            className={styles.setCard}
            onClick={() => navigate(`/my-progress/sets/${set.id}`)}
          >
            <CircularProgress
              percentage={set.masteryScore}
              size={70}
              label={set.name}
            />
            <div className={styles.setInfo}>
              <span className={styles.setName}>{set.name}</span>
              <span className={styles.setCount}>{set.questionCount} questions</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderProgressView;
