import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchOverallStats, fetchFolders, fetchFolderStats, fetchQuestionSetStats, fetchQuestionSetQuestions } from '../api/stats';
import type { OverallStats, FolderSummary, FolderStatsDetails, QuestionSetStatsDetails, QuestionStat } from '../api/stats';
import MasteryLineChart from '../components/stats/MasteryLineChart';
import CircularProgress from '../components/stats/CircularProgress';
import { UUESegmentedProgressBar } from '../components/stats/SegmentedProgressBar';
import styles from './MyProgressPage.module.css';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import QuestionStatItem from '../components/stats/QuestionStatItem'; // For Set View
import { getFolders, pinFolder, getFolder } from '../services/folderService';
import { getQuestionSets, pinQuestionSet } from '../services/questionSetService';
import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';
import CarouselItemCard from '../components/stats/CarouselItemCard';

type ProgressItem = (Folder | QuestionSet) & { isPinned: boolean };

// Recursive component to display folders with their subfolders
const FolderTree: React.FC<{
  folders: Folder[];
  questionSets: QuestionSet[];
  onPin: (item: ProgressItem) => void;
  onUnpin: (item: ProgressItem) => void;
  navigate: (path: string) => void;
}> = ({ folders, questionSets, onPin, onUnpin, navigate }) => {
  console.log('🌳 [FolderTree] Rendering with:', { folders, questionSets });
  console.log('🌳 [FolderTree] folders length:', folders.length);
  console.log('🌳 [FolderTree] questionSets length:', questionSets.length);
  
  // State to track which folders are expanded
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  
  const toggleFolder = (folderId: string) => {
    console.log('🔄 [FolderTree] Toggling folder:', folderId);
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
        console.log('🔄 [FolderTree] Collapsed folder:', folderId);
      } else {
        newSet.add(folderId);
        console.log('🔄 [FolderTree] Expanded folder:', folderId);
      }
      console.log('🔄 [FolderTree] New expanded folders:', Array.from(newSet));
      return newSet;
    });
  };
  
  const renderFolder = (folder: Folder, depth: number = 0) => {
    console.log('📁 [FolderTree] Rendering folder:', folder.name, 'with children:', folder.children.length);
    const folderQuestionSets = questionSets.filter(qs => qs.folderId === folder.id);
    const hasChildren = folder.children.length > 0 || folderQuestionSets.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    console.log('📁 [FolderTree] folder has children:', hasChildren, 'children count:', folder.children.length, 'question sets count:', folderQuestionSets.length);
    
    return (
      <div key={folder.id} className={styles.folderTreeItem} style={{ marginLeft: `${depth * 20}px` }}>
        <div className={styles.folderHeader}>
          <div 
            className={styles.folderCard}
            onClick={() => navigate(`/my-progress/folders/${folder.id}`)}
            tabIndex={0}
            role="button"
            aria-label={`View progress for ${folder.name}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/my-progress/folders/${folder.id}`); }}
          >
            <CarouselItemCard
              name={folder.name}
              masteryScore={folder.masteryScore || 0}
              understandScore={0} // These would need to be added to Folder type if available
              useScore={0}
              exploreScore={0}
              onClick={() => navigate(`/my-progress/folders/${folder.id}`)}
            />
          </div>
          <div className={styles.folderActions}>
            {hasChildren && (
              <button
                className={styles.dropdownButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            <button
              className={styles.pinButton}
              onClick={() => onPin({ ...folder, isPinned: !!folder.isPinned })}
            >
              {folder.isPinned ? '📌' : 'Pin'}
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className={styles.folderChildren}>
            {/* Render subfolders */}
            {(() => {
              console.log('📂 [FolderTree] Rendering children for folder:', folder.name, 'children count:', folder.children.length);
              return folder.children.map(childFolder => {
                console.log('📂 [FolderTree] Rendering child folder:', childFolder.name);
                return renderFolder(childFolder, depth + 1);
              });
            })()}
            
            {/* Render question sets in this folder */}
            {folderQuestionSets.map(set => (
              <div key={set.id} className={styles.questionSetItem} style={{ marginLeft: `${(depth + 1) * 20}px` }}>
                <div className={styles.questionSetCard}>
                  <CarouselItemCard
                    name={set.name}
                    masteryScore={set.currentTotalMasteryScore || 0}
                    understandScore={0} // These would need to be added to QuestionSet type if available
                    useScore={0}
                    exploreScore={0}
                    onClick={() => navigate(`/my-progress/sets/${set.id}`)}
                  />
                </div>
                <button
                  className={styles.pinButton}
                  onClick={() => onPin({ ...set, isPinned: !!set.isPinned })}
                >
                  {set.isPinned ? '📌' : 'Pin'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Only render top-level folders (those without parents or with null parentId)
  const topLevelFolders = folders.filter(folder => !folder.parentId);
  console.log('🌳 [FolderTree] topLevelFolders:', topLevelFolders.map(f => ({ name: f.name, children: f.children.length })));
  
  return (
    <div className={styles.folderTree}>
      {topLevelFolders.map(folder => renderFolder(folder))}
    </div>
  );
};

const SubfolderList: React.FC<{
  subfolders: any[];
  navigate: (path: string) => void;
}> = ({ subfolders, navigate }) => {
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [subfolderData, setSubfolderData] = useState<{ [id: string]: any }>({});
  const [loading, setLoading] = useState<{ [id: string]: boolean }>({});

  const handleToggle = async (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    if (!subfolderData[id] && !loading[id]) {
      setLoading(prev => ({ ...prev, [id]: true }));
      try {
        const data = await getFolder(id);
        setSubfolderData(prev => ({ ...prev, [id]: data }));
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div>
      {subfolders.length === 0 && <p>No subfolders found in this folder.</p>}
      {subfolders.map(sub => (
        <div key={sub.id} style={{ marginBottom: '0.5rem', marginLeft: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.5rem', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              style={{ minWidth: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
              onClick={() => handleToggle(sub.id)}
              aria-label={expanded[sub.id] ? 'Collapse subfolder' : 'Expand subfolder'}
            >
              {expanded[sub.id] ? '▼' : '▶'}
            </button>
            <span
              style={{ fontWeight: 500, cursor: 'pointer' }}
              onClick={() => navigate(`/my-progress/folders/${sub.id}`)}
              tabIndex={0}
              role="button"
              aria-label={`View progress for ${sub.name}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/my-progress/folders/${sub.id}`); }}
            >
              {sub.name}
            </span>
          </div>
          {expanded[sub.id] && (
            <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              {loading[sub.id] && <span>Loading...</span>}
              {subfolderData[sub.id] && subfolderData[sub.id].subfolders && (
                <SubfolderList subfolders={subfolderData[sub.id].subfolders} navigate={navigate} />
              )}
              {subfolderData[sub.id] && (!subfolderData[sub.id].subfolders || subfolderData[sub.id].subfolders.length === 0) && (
                <span style={{ color: '#888' }}>No further subfolders.</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const MyProgressPage: React.FC = () => {
  const { folderId, setId } = useParams<{ folderId?: string; setId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

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
        // Find the folder name for better logging
        const folder = folders.find(f => f.id === folderId);
        console.log(`📁 [MyProgressPage] Fetching details for folder: ${folder?.name || 'Unknown'} (ID: ${folderId})`);
        const data = await fetchFolderStats(folderId);
        
        if (!isMounted) return;
        
        console.log('📁 [MyProgressPage] Folder details:', data);
        console.log('📁 [MyProgressPage] Folder details keys:', Object.keys(data));
        console.log('📁 [MyProgressPage] questionSetSummaries:', data.questionSetSummaries);
        console.log('📁 [MyProgressPage] questionSetSummaries type:', typeof data.questionSetSummaries);
        console.log('📁 [MyProgressPage] questionSetSummaries length:', data.questionSetSummaries?.length);
        console.log('📁 [MyProgressPage] Folder mastery history:', data.masteryHistory);
        console.log('📁 [MyProgressPage] Folder mastery history length:', data.masteryHistory?.length);
        
        // Test: Try to fetch mastery history for the first question set in this folder
        if (data.questionSets && data.questionSets.length > 0) {
          const firstQuestionSet = data.questionSets[0];
          console.log(`🧪 [MyProgressPage] Testing mastery history for question set: ${firstQuestionSet.name} (ID: ${firstQuestionSet.id})`);
          try {
            const questionSetStats = await fetchQuestionSetStats(firstQuestionSet.id);
            console.log(`🧪 [MyProgressPage] Question set stats:`, questionSetStats);
            console.log(`🧪 [MyProgressPage] Question set mastery history length:`, questionSetStats.masteryHistory?.length || 0);
            console.log(`🧪 [MyProgressPage] Question set mastery history:`, questionSetStats.masteryHistory);
          } catch (err) {
            console.log(`🧪 [MyProgressPage] Failed to fetch question set stats:`, err);
          }
        }
        
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
  }, [folderId, location.search]);

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
        console.log('📊 [MyProgressPage] Set mastery history:', statsRes.masteryHistory);
        console.log('📊 [MyProgressPage] Set mastery history length:', statsRes.masteryHistory?.length);
        console.log('📊 [MyProgressPage] Set mastery history structure:', statsRes.masteryHistory?.[0]);
        console.log('📊 [MyProgressPage] Set mastery history data points:', statsRes.masteryHistory?.map((point, index) => ({ index, timestamp: point.timestamp, score: point.score })));
        
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
  }, [setId, location.search]);

  // Fetch all folders and sets on mount
  useEffect(() => {
    console.log('🔄 [MyProgressPage] fetchAllItems useEffect triggered');
    console.log('🔄 [MyProgressPage] Current location.search:', location.search);
    
    // Check for refresh parameter
    const searchParams = new URLSearchParams(location.search);
    const shouldRefresh = searchParams.get('refresh') === 'true';
    
    console.log('🔄 [MyProgressPage] shouldRefresh:', shouldRefresh);
    
    let isMounted = true;
    const fetchAllItems = async () => {
      try {
        console.log('🔄 [MyProgressPage] fetchAllItems function started');
        setLoadingOverall(true);
        setErrorOverall(null);
        
        // Fetch folders, question sets, and stats data in parallel
        console.log('🔄 [MyProgressPage] Calling getFolders(), getQuestionSets(), and stats APIs');
        const [foldersRes, setsRes, statsRes, foldersStatsRes] = await Promise.all([
          getFolders(),
          getQuestionSets('all'),
          fetchOverallStats().catch(err => {
            console.error('Error in fetchOverallStats:', err);
            return null;
          }),
          fetchFolders().catch(err => {
            console.error('Error in fetchFolders:', err);
            return [];
          })
        ]);

        if (!isMounted) return;

        console.log('✅ [MyProgressPage] fetchAllItems results:', { foldersRes, setsRes, statsRes, foldersStatsRes });
        console.log('✅ [MyProgressPage] foldersRes length:', foldersRes.length);
        console.log('✅ [MyProgressPage] setsRes length:', setsRes.length);

        // Combine and split items based on isPinned flag
        const allItems = [
          ...foldersRes.map(f => ({ ...f, isPinned: !!f.isPinned })),
          ...setsRes.map(s => ({ ...s, isPinned: !!s.isPinned }))
        ];

        console.log('✅ [MyProgressPage] allItems length:', allItems.length);
        console.log('✅ [MyProgressPage] folders state being set:', foldersRes);

        setFolders(foldersRes);
        setQuestionSets(setsRes);
        setPinnedItems(allItems.filter(item => item.isPinned));
        setUnpinnedItems(allItems.filter(item => !item.isPinned));
        
        // Always update stats data to ensure fresh data
        if (statsRes) {
          console.log('🔄 [MyProgressPage] Updating overall stats with fresh data');
          setOverallStats(statsRes);
        }
        
        if (Array.isArray(foldersStatsRes)) {
          console.log('🔄 [MyProgressPage] Updating top folders with fresh data');
          setTopFolders(foldersStatsRes);
        }
        
        setLoadingOverall(false);
        
        // Clear refresh parameter after successful data fetch
        if (shouldRefresh) {
          console.log('🔄 [MyProgressPage] Data refreshed successfully, clearing URL parameter');
          navigate(location.pathname, { replace: true });
        }
      } catch (err) {
        console.error('❌ [MyProgressPage] fetchAllItems error:', err);
        if (!isMounted) return;
        setErrorOverall('Failed to load items. Please try again.');
        setLoadingOverall(false);
      }
    };
    fetchAllItems();
    return () => { isMounted = false; };
  }, [location.search, navigate]);

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
    
    // Ensure questionSetSummaries exists (API returns questionSets, not questionSetSummaries)
    const questionSetSummaries = folderDetails.questionSetSummaries || folderDetails.questionSets || [];
    const subfolders = folderDetails.subfolders || [];

    return (
      <div className={styles.pageRoot}>
        <Breadcrumbs />
        {/* Styles for folderPage, pageTitle, topSection, chartCard, uuBarBox, sectionTitle, setsGrid, setCard, setInfo, setName, setCount 
            need to be available in MyProgressPage.module.css or imported/adapted */}
        <div className={styles.folderPage}> 
          <h1 className={styles.pageTitle}>{folderDetails.name || `Folder ${folderDetails.id}`} - Folder Progress</h1>
          <div className={styles.topSection}>
            <div className={styles.chartCard}>
              <MasteryLineChart
                data={folderDetails.masteryHistory}
                title={`${folderDetails.name || 'undefined'} Mastery Over Time`}
                height={260}
              />
            </div>
            <div className={styles.uuBarBox}>
              <UUESegmentedProgressBar
                understandScore={folderDetails.understandScore || 0}
                useScore={folderDetails.useScore || 0}
                exploreScore={folderDetails.exploreScore || 0}
                height={12}
                showLabels={true}
                showValues={true}
              />
            </div>
          </div>
          {/* Subfolders Section */}
          <h2 className={styles.sectionTitle}>Subfolders</h2>
          <SubfolderList subfolders={subfolders} navigate={navigate} />
          {/* Question Sets Section */}
          <h2 className={styles.sectionTitle}>Question Sets in this Folder</h2>
          <div className={styles.setsGrid}>
            {questionSetSummaries && questionSetSummaries.length > 0 ? (
              questionSetSummaries.map((set) => (
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
              ))
            ) : (
              <p>No question sets found in this folder.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // OVERALL VIEW (Default if no folderId or setId)
  console.log('🎯 [MyProgressPage] Rendering OVERALL VIEW');
  console.log('🎯 [MyProgressPage] Current state:', { folderId, setId, folders: folders.length, questionSets: questionSets.length });
  return (
    <div className={styles.pageRoot}>
      <Breadcrumbs />
      <div className={styles.progressPage}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>My Progress</h1>
          <button
            onClick={async () => {
              console.log('🔄 [MyProgressPage] Manual refresh triggered');
              setLoadingOverall(true);
              setErrorOverall(null);
              
              try {
                // Force refetch all data
                const [foldersRes, setsRes, statsRes, foldersStatsRes] = await Promise.all([
                  getFolders(),
                  getQuestionSets('all'),
                  fetchOverallStats(),
                  fetchFolders()
                ]);
                
                console.log('✅ [MyProgressPage] Manual refresh results:', { foldersRes, setsRes, statsRes, foldersStatsRes });
                
                // Update all state with fresh data
                setFolders(foldersRes);
                setQuestionSets(setsRes);
                setOverallStats(statsRes);
                setTopFolders(Array.isArray(foldersStatsRes) ? foldersStatsRes : []);
                
                // Update pinned/unpinned items
                const allItems = [
                  ...foldersRes.map(f => ({ ...f, isPinned: !!f.isPinned })),
                  ...setsRes.map(s => ({ ...s, isPinned: !!s.isPinned }))
                ];
                setPinnedItems(allItems.filter(item => item.isPinned));
                setUnpinnedItems(allItems.filter(item => !item.isPinned));
                
                console.log('✅ [MyProgressPage] Manual refresh completed successfully');
              } catch (err) {
                console.error('❌ [MyProgressPage] Manual refresh error:', err);
                setErrorOverall('Failed to refresh data. Please try again.');
              } finally {
                setLoadingOverall(false);
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
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
                    data={('masteryHistory' in item && Array.isArray(item.masteryHistory)) ? item.masteryHistory : []}
                    title={item.name}
                    height={200}
                  />
                  <UUESegmentedProgressBar
                    understandScore={('understandScore' in item && typeof item.understandScore === 'number') ? item.understandScore : 0}
                    useScore={('useScore' in item && typeof item.useScore === 'number') ? item.useScore : 0}
                    exploreScore={('exploreScore' in item && typeof item.exploreScore === 'number') ? item.exploreScore : 0}
                    height={8}
                    showLabels={true}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Folder Tree Section */}
        <section className={styles.folderTreeSection}>
          <h2 className={styles.sectionTitle}>All Folders & Sets</h2>
          <FolderTree
            folders={folders}
            questionSets={questionSets}
            onPin={handlePin}
            onUnpin={handleUnpin}
            navigate={navigate}
          />
        </section>
      </div>
    </div>
  );
};

export default MyProgressPage;
