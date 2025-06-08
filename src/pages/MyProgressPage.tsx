import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOverallStats, fetchFolders, fetchFolderStats, fetchQuestionSetStats, fetchQuestionSetQuestions } from '../api/stats';
import type { OverallStats, FolderSummary, FolderStatsDetails, QuestionSetStatsDetails, QuestionStat } from '../api/stats';
import MasteryLineChart from '../components/stats/MasteryLineChart';
import CircularProgress from '../components/stats/CircularProgress';
import { UUESegmentedProgressBar } from '../components/stats/SegmentedProgressBar';
import styles from './MyProgressPage.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import QuestionStatItem from '../components/stats/QuestionStatItem'; // For Set View

const MyProgressPage: React.FC = () => {
  const { folderId, setId } = useParams<{ folderId?: string; setId?: string }>();
  const navigate = useNavigate();

  // Overall stats
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [topFolders, setTopFolders] = useState<FolderSummary[]>([]);
  const [loadingOverall, setLoadingOverall] = useState(true);
  const [errorOverall, setErrorOverall] = useState<string | null>(null);

  // Folder-specific stats
  const [folderDetails, setFolderDetails] = useState<FolderStatsDetails | null>(null);
  const [loadingFolder, setLoadingFolder] = useState(false);
  const [errorFolder, setErrorFolder] = useState<string | null>(null);

  // Set-specific stats
  const [setDetails, setSetDetails] = useState<QuestionSetStatsDetails | null>(null);
  const [setQuestions, setSetQuestions] = useState<QuestionStat[]>([]);
  const [loadingSet, setLoadingSet] = useState(false);
  const [errorSet, setErrorSet] = useState<string | null>(null);

  // Fetch Overall Stats and Folders
  useEffect(() => {
    console.log('[MyProgressPage] Checking token before loadData:', localStorage.getItem('token'));
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const loadData = async () => {
      setLoadingOverall(true);
      setErrorOverall(null);

      try {
        console.log('Fetching overall stats and folders...');
        const [statsRes, foldersRes] = await Promise.all([
          fetchOverallStats().catch(err => {
            console.error('Error in fetchOverallStats:', err);
            throw new Error(`Failed to load stats: ${err.message}`);
          }),
          fetchFolders().catch(err => {
            console.error('Error in fetchFolders:', err);
            // Don't fail the whole load if folders fail
            return [];
          }),
        ]);

        if (!isMounted) return;

        console.log('Stats data:', statsRes);
        console.log('Folders data:', foldersRes);

        if (statsRes) {
          setOverallStats(statsRes);
        }
        
        if (Array.isArray(foldersRes)) {
          setTopFolders(foldersRes);
        } else {
          console.warn('Expected folders to be an array, got:', foldersRes);
          setTopFolders([]);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading data:', err);
          setErrorOverall(err instanceof Error ? err.message : 'Failed to load data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoadingOverall(false);
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Fetch Folder-Specific Stats when folderId changes
  useEffect(() => {
    if (!folderId) {
      setFolderDetails(null);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    
    const loadFolderData = async () => {
      setLoadingFolder(true);
      setErrorFolder(null);
      setFolderDetails(null);

      try {
        console.log(`Fetching folder details for folderId: ${folderId}`);
        const data = await fetchFolderStats(folderId);
        
        if (!isMounted) return;
        
        console.log('Folder details:', data);
        setFolderDetails(data);
      } catch (err) {
        if (isMounted) {
          console.error('Error loading folder details:', err);
          setErrorFolder(err instanceof Error ? err.message : 'Failed to load folder details.');
        }
      } finally {
        if (isMounted) {
          setLoadingFolder(false);
        }
      }
    };

    loadFolderData();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [folderId]);

  // Fetch Set-Specific Stats when setId changes
  useEffect(() => {
    if (!setId) {
      setSetDetails(null);
      setSetQuestions([]);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    
    const loadSetData = async () => {
      setLoadingSet(true);
      setErrorSet(null);
      setSetDetails(null);
      setSetQuestions([]);

      try {
        console.log(`Fetching question set details for setId: ${setId}`);
        const [statsRes, questionsRes] = await Promise.all([
          fetchQuestionSetStats(setId).catch(err => {
            console.error('Error fetching set stats:', err);
            throw new Error(`Failed to load set stats: ${err.message}`);
          }),
          fetchQuestionSetQuestions(setId).catch(err => {
            console.error('Error fetching set questions:', err);
            return []; // Return empty array if questions fail to load
          })
        ]);
        
        if (!isMounted) return;
        
        console.log('Set details:', statsRes);
        console.log('Set questions:', questionsRes);
        
        setSetDetails(statsRes);
        setSetQuestions(Array.isArray(questionsRes) ? questionsRes : []);
      } catch (err) {
        if (isMounted) {
          console.error('Error loading set details:', err);
          setErrorSet(err instanceof Error ? err.message : 'Failed to load question set details.');
        }
      } finally {
        if (isMounted) {
          setLoadingSet(false);
        }
      }
    };

    loadSetData();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [setId]);

  // Render logic will be updated later to show specific views
  // For now, let's keep the overall loading/error/data check for the default view
  if (loadingOverall) {
    return <div className={styles.centered}>Loading...</div>;
  }
  if (errorOverall) {
    return <div className={styles.centered}>{errorOverall}</div>;
  }
  if (!overallStats) {
    // This case should ideally be caught by loadingOverall, but as a fallback:
    return <div className={styles.centered}>No overall stats available.</div>;
  }
  // SET VIEW
  if (setId) {
    if (loadingSet) return <div className={styles.centered}>Loading Set Details...</div>;
    if (errorSet) return <div className={styles.centered}>{errorSet}</div>;
    if (!setDetails) return <div className={styles.centered}>Set details not found.</div>;

    return (
      <div className={styles.pageRoot}>
        <Breadcrumbs />
        {/* Styles for setPage, pageTitle, topSection, chartCard, uuBarBox, sectionTitle, questionsList 
            need to be available in MyProgressPage.module.css or imported/adapted */}
        <div className={styles.setPage}> 
          <h1 className={styles.pageTitle}>{setDetails.name} - Set Progress</h1>
          <div className={styles.topSection}>
            <div className={styles.chartCard}>
              <MasteryLineChart
                data={setDetails.masteryHistory}
                title={`${setDetails.name} Mastery Over Time`}
                height={220} // Adjusted height for potentially smaller area
              />
            </div>
            <div className={styles.uuBarBox}>
              <UUESegmentedProgressBar
                understandScore={setDetails.understandScore}
                useScore={setDetails.useScore}
                exploreScore={setDetails.exploreScore}
                height={12}
                showLabels={true}
                showValues={true}
              />
            </div>
          </div>
          <h2 className={styles.sectionTitle}>Questions</h2>
          <div className={styles.questionsList}>
            {setQuestions.map((q) => (
              <QuestionStatItem key={q.id} question={q} />
            ))}
            {setQuestions.length === 0 && <p>No questions found for this set.</p>}
          </div>
        </div>
      </div>
    );
  }

  // FOLDER VIEW
  if (folderId) {
    if (loadingFolder) return <div className={styles.centered}>Loading Folder Details...</div>;
    if (errorFolder) return <div className={styles.centered}>{errorFolder}</div>;
    if (!folderDetails) return <div className={styles.centered}>Folder details not found.</div>;

    return (
      <div className={styles.pageRoot}>
        <Breadcrumbs />
        {/* Styles for folderPage, pageTitle, topSection, chartCard, uuBarBox, sectionTitle, setsGrid, setCard, setInfo, setName, setCount 
            need to be available in MyProgressPage.module.css or imported/adapted */}
        <div className={styles.folderPage}> 
          <h1 className={styles.pageTitle}>{folderDetails.name} - Folder Progress</h1>
          <div className={styles.topSection}>
            <div className={styles.chartCard}>
              <MasteryLineChart
                data={folderDetails.masteryHistory}
                title={`${folderDetails.name} Mastery Over Time`}
                height={260}
              />
            </div>
            <div className={styles.uuBarBox}>
              <UUESegmentedProgressBar
                understandScore={folderDetails.understandScore}
                useScore={folderDetails.useScore}
                exploreScore={folderDetails.exploreScore}
                height={12}
                showLabels={true}
                showValues={true}
              />
            </div>
          </div>
          <h2 className={styles.sectionTitle}>Question Sets in this Folder</h2>
          <div className={styles.setsGrid}>
            {folderDetails.questionSetSummaries.map((set) => (
              <div
                key={set.id}
                className={styles.setCard} 
                onClick={() => navigate(`/my-progress/sets/${set.id}`)}
                tabIndex={0}
                role="button"
                aria-label={`View progress for ${set.name}`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/my-progress/sets/${set.id}`); }}
              >
                <CircularProgress
                  percentage={set.currentMasteryScore || set.masteryScore} // Fallback to masteryScore if currentMasteryScore is not available
                  size={70} 
                  label={set.name} // Label might be redundant if set.name is shown below
                />
                <div className={styles.setInfo}> 
                  <span className={styles.setName}>{set.name}</span>
                  <span className={styles.setCount}>{set.questionCount} questions</span>
                </div>
              </div>
            ))}
            {folderDetails.questionSetSummaries.length === 0 && <p>No question sets found in this folder.</p>}
          </div>
        </div>
      </div>
    );
  }

  // OVERALL VIEW (Default if no folderId or setId)
  return (
    <div className={styles.pageRoot}>
      <Breadcrumbs />
      <div className={styles.progressPage}>
        <h1 className={styles.pageTitle}>My Progress</h1>
        <div className={styles.topSection}>
          <div className={styles.chartCard}>
            <MasteryLineChart
              data={overallStats.masteryHistory}
              title="Mastery Over Time"
              height={260}
            />
          </div>
          <div className={styles.statsSummary}>
            <div className={styles.uuBarBox}>
              <UUESegmentedProgressBar
                understandScore={overallStats.understandScore}
                useScore={overallStats.useScore}
                exploreScore={overallStats.exploreScore}
                height={12}
                showLabels={true}
                showValues={true}
              />
            </div>
            <div className={styles.setsMissedBox}>
              <div className={styles.setsMissedCount}>{overallStats.dueSets}</div>
              <div className={styles.setsMissedLabel}>Sets Missed</div>
            </div>
          </div>
        </div>
        <h2 className={styles.sectionTitle}>Folders</h2>
        <div className={styles.foldersGrid}>
          {topFolders.map((folder) => (
            <div
              key={folder.id}
              className={styles.folderCard}
              onClick={() => navigate(`/my-progress/folders/${folder.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`View progress for ${folder.name}`}
              onKeyDown={e => { if (e.key === 'Enter') navigate(`/my-progress/folders/${folder.id}`); }}
            >
              <CircularProgress
                percentage={folder.currentMasteryScore}
                size={80}
                label={folder.name}
              />
              <div className={styles.folderInfo}>
                <span className={styles.folderName}>{folder.name}</span>
                <span className={styles.folderCount}>{folder.questionSetCount} sets</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProgressPage;
