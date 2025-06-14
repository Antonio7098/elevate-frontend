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
import { getFolders, pinFolder } from '../services/folderService';
import { getQuestionSets, pinQuestionSet } from '../services/questionSetService';
import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';
import CarouselItemCard from '../components/stats/CarouselItemCard';

type ProgressItem = (Folder | QuestionSet) & { isPinned: boolean };

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

  // New state for all folders and sets
  const [folders, setFolders] = useState<Folder[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [pinnedItems, setPinnedItems] = useState<ProgressItem[]>([]);
  const [unpinnedItems, setUnpinnedItems] = useState<ProgressItem[]>([]);

  // State for weekly progress
  const [weeklyProgress, setWeeklyProgress] = useState({
    itemsReviewed: 0,
    masteryGained: 0,
    streakDays: 0
  });

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

  // Fetch all folders and sets on mount
  useEffect(() => {
    let isMounted = true;
    const fetchAllItems = async () => {
      try {
        setLoadingOverall(true);
        setErrorOverall(null);
        
        // Fetch folders and question sets in parallel
        const [foldersRes, setsRes] = await Promise.all([
          getFolders(),
          getQuestionSets('all')
        ]);

        if (!isMounted) return;

        // Combine and split items based on isPinned flag
        const allItems = [
          ...foldersRes.map(f => ({ ...f, isPinned: !!f.isPinned })),
          ...setsRes.map(s => ({ ...s, isPinned: !!s.isPinned }))
        ];

        setFolders(foldersRes);
        setQuestionSets(setsRes);
        setPinnedItems(allItems.filter(item => item.isPinned));
        setUnpinnedItems(allItems.filter(item => !item.isPinned));
        setLoadingOverall(false);
      } catch (err) {
        if (!isMounted) return;
        setErrorOverall('Failed to load items. Please try again.');
        setLoadingOverall(false);
      }
    };
    fetchAllItems();
    return () => { isMounted = false; };
  }, []);

  // Pin/Unpin handlers
  const handlePin = async (item: ProgressItem) => {
    // Optimistically update UI
    setUnpinnedItems(prev => prev.filter(i => i.id !== item.id));
    setPinnedItems(prev => [...prev, { ...item, isPinned: true }]);

    try {
      if ('parentId' in item) {
        // It's a Folder
        await pinFolder(item.id, true);
      } else {
        // It's a QuestionSet
        await pinQuestionSet(item.folderId, item.id, true);
      }
    } catch (err) {
      // Revert UI on error
      setPinnedItems(prev => prev.filter(i => i.id !== item.id));
      setUnpinnedItems(prev => [...prev, { ...item, isPinned: false }]);
      alert('Failed to pin item. Please try again.');
    }
  };

  const handleUnpin = async (item: ProgressItem) => {
    // Optimistically update UI
    setPinnedItems(prev => prev.filter(i => i.id !== item.id));
    setUnpinnedItems(prev => [...prev, { ...item, isPinned: false }]);

    try {
      if ('parentId' in item) {
        // It's a Folder
        await pinFolder(item.id, false);
      } else {
        // It's a QuestionSet
        await pinQuestionSet(item.folderId, item.id, false);
      }
    } catch (err) {
      // Revert UI on error
      setUnpinnedItems(prev => prev.filter(i => i.id !== item.id));
      setPinnedItems(prev => [...prev, { ...item, isPinned: true }]);
      alert('Failed to unpin item. Please try again.');
    }
  };

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
        {/* Weekly Progress Box */}
        <div className={styles.weeklyProgressBox}>
          <h2 className={styles.weeklyProgressTitle}>This Week's Progress</h2>
          <div className={styles.weeklyProgressStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Items Reviewed</div>
              <div className={styles.statValue}>{weeklyProgress.itemsReviewed}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Mastery Gained</div>
              <div className={styles.statValue}>+{weeklyProgress.masteryGained}%</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Streak</div>
              <div className={styles.statValue}>{weeklyProgress.streakDays} days</div>
            </div>
          </div>
        </div>

        {/* Pinned Items Section */}
        <section className={styles.pinnedSection}>
          <h2 className={styles.sectionTitle}>Pinned Items</h2>
          {pinnedItems.length === 0 ? (
            <p className={styles.emptyMessage}>No pinned items yet. Pin your favorite folders and sets from below!</p>
          ) : (
            <div className={styles.pinnedGrid}>
              {pinnedItems.map(item => (
                <div key={item.id} className={styles.pinnedItem}>
                  <button
                    className={styles.unpinButton}
                    onClick={() => handleUnpin(item)}
                    aria-label="Unpin item"
                  >
                    📌
                  </button>
                  <MasteryLineChart
                    data={item.masteryHistory}
                    title={item.name}
                    height={200}
                  />
                  <UUESegmentedProgressBar
                    understandScore={item.understandScore}
                    useScore={item.useScore}
                    exploreScore={item.exploreScore}
                    height={8}
                    showLabels={true}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Carousel Section */}
        <section className={styles.carouselSection}>
          <h2 className={styles.sectionTitle}>All Folders & Sets</h2>
          <div className={styles.carousel}>
            {unpinnedItems.map(item => (
              <div key={item.id} className={styles.carouselItem}>
                <CarouselItemCard
                  name={item.name}
                  masteryScore={('masteryScore' in item && typeof item.masteryScore === 'number') ? item.masteryScore : 0}
                  understandScore={('understandScore' in item && typeof item.understandScore === 'number') ? item.understandScore : 0}
                  useScore={('useScore' in item && typeof item.useScore === 'number') ? item.useScore : 0}
                  exploreScore={('exploreScore' in item && typeof item.exploreScore === 'number') ? item.exploreScore : 0}
                  onClick={() => {
                    if ('parentId' in item) {
                      // It's a Folder
                      navigate(`/my-progress/folders/${item.id}`);
                    } else {
                      // It's a QuestionSet
                      navigate(`/my-progress/sets/${item.id}`);
                    }
                  }}
                />
                <button
                  className={styles.pinButton}
                  onClick={() => handlePin(item)}
                >
                  Pin This Item
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyProgressPage;
