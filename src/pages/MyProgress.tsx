import React, { useState, useEffect } from 'react';
import styles from './MyProgress.module.css';
import { getFolders } from '../services/folderService';
import type { Folder } from '../types/folder';
import { getQuestionSets } from '../services/questionSetService';
import type { QuestionSet } from '../types/questionSet';
import type { FolderStats, SetStats } from '../types/stats.types';
import { getFolderStats, getSetStats } from '../services/statsService';
import MasteryOverTimeChart from '../components/stats/MasteryOverTimeChart';
import UUEScoresWidget from '../components/stats/UUEScoresWidget';
import SRStatusWidget from '../components/stats/SRStatusWidget';

const MyProgress: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);

  const [isLoadingFolders, setIsLoadingFolders] = useState<boolean>(false);
  const [isLoadingSets, setIsLoadingSets] = useState<boolean>(false);

  const [errorFolders, setErrorFolders] = useState<string | null>(null);
  const [errorSets, setErrorSets] = useState<string | null>(null);

  // State for fetched stats data
  const [folderStats, setFolderStats] = useState<FolderStats | null>(null);
  const [setStats, setSetStats] = useState<SetStats | null>(null);

  // State for stats loading and errors
  const [isLoadingFolderStats, setIsLoadingFolderStats] = useState<boolean>(false);
  const [isLoadingSetStats, setIsLoadingSetStats] = useState<boolean>(false);
  const [errorFolderStats, setErrorFolderStats] = useState<string | null>(null);
  const [errorSetStats, setErrorSetStats] = useState<string | null>(null);

  // Fetch folders on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      setErrorFolders(null);
      try {
        const data = await getFolders();
        setFolders(data);
      } catch (err) {
        setErrorFolders('Failed to load folders.');
        console.error(err);
      }
      setIsLoadingFolders(false);
    };
    fetchFolders();
  }, []);

  // Fetch question sets when selectedFolderId changes
  useEffect(() => {
    if (selectedFolderId) {
      const fetchQuestionSets = async () => {
        setIsLoadingSets(true);
        setErrorSets(null);
        setQuestionSets([]); // Clear previous sets
        try {
          const data = await getQuestionSets(selectedFolderId);
          setQuestionSets(data);
        } catch (err) {
          setErrorSets('Failed to load question sets.');
          console.error(err);
        }
        setIsLoadingSets(false);
      };
      fetchQuestionSets();
    } else {
      setQuestionSets([]); // Clear sets if no folder is selected
      setSelectedSetId(null); // Reset selected set ID
    }
    // Clear stats when folder changes
    setFolderStats(null);
    setSetStats(null);
    setErrorFolderStats(null);
    setErrorSetStats(null);
  }, [selectedFolderId]);

  // Fetch Folder Stats when selectedFolderId changes and no selectedSetId
  useEffect(() => {
    if (selectedFolderId && !selectedSetId) {
      const fetchFolderStatistics = async () => {
        setIsLoadingFolderStats(true);
        setErrorFolderStats(null);
        setFolderStats(null); // Clear previous folder stats
        try {
          const data = await getFolderStats(selectedFolderId);
          console.log('Fetched Folder Stats:', data);
          setFolderStats(data);
        } catch (err) {
          setErrorFolderStats('Failed to load folder statistics.');
          console.error(err);
        }
        setIsLoadingFolderStats(false);
      };
      fetchFolderStatistics();
    } else {
      setFolderStats(null); // Clear folder stats if no folder selected or if a set is selected
    }
  }, [selectedFolderId, selectedSetId]);

  // Fetch Set Stats when selectedSetId changes
  useEffect(() => {
    if (selectedSetId) {
      const fetchSetStatistics = async () => {
        setIsLoadingSetStats(true);
        setErrorSetStats(null);
        setSetStats(null); // Clear previous set stats
        setFolderStats(null); // Clear folder stats as set stats take precedence
        try {
          const data = await getSetStats(selectedSetId);
          console.log('Fetched Set Stats:', data);
          setSetStats(data);
        } catch (err) {
          setErrorSetStats('Failed to load question set statistics.');
          console.error(err);
        }
        setIsLoadingSetStats(false);
      };
      fetchSetStatistics();
    } else {
      setSetStats(null); // Clear set stats if no set is selected
    }
  }, [selectedSetId]);

  const handleFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const folderId = event.target.value;
    setSelectedFolderId(folderId || null);
    setSelectedSetId(null); // Reset set selection when folder changes
  };

  const handleSetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSetId(event.target.value || null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Statistics</h1>
      
      <div className={styles.selectors}>
        <div className={styles.selectorItem}>
          <label htmlFor="folder-select">Select Folder:</label>
          <select 
            id="folder-select" 
            value={selectedFolderId || ''} 
            onChange={handleFolderChange}
            disabled={isLoadingFolders}
          >
            <option value="">-- Select a Folder --</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          {isLoadingFolders && <p>Loading folders...</p>}
          {errorFolders && <p className={styles.errorText}>{errorFolders}</p>}
        </div>

        <div className={styles.selectorItem}>
          <label htmlFor="set-select">Select Question Set:</label>
          <select 
            id="set-select" 
            value={selectedSetId || ''} 
            onChange={handleSetChange}
            disabled={!selectedFolderId || isLoadingSets || questionSets.length === 0}
          >
            <option value="">-- Select a Question Set --</option>
            {questionSets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>
          {selectedFolderId && isLoadingSets && <p>Loading question sets...</p>}
          {selectedFolderId && !isLoadingSets && errorSets && <p className={styles.errorText}>{errorSets}</p>}
          {selectedFolderId && !isLoadingSets && !errorSets && questionSets.length === 0 && <p>No question sets in this folder.</p>}
        </div>
      </div>

      <div className={`${styles.card} ${styles.statsDisplayArea}`}>
        {isLoadingFolderStats && <p>Loading folder statistics...</p>}
        {errorFolderStats && <p className={styles.errorText}>{errorFolderStats}</p>}
        {/* Folder Stats Display */}
        {folderStats && !selectedSetId ? (
          <div className={styles.folderStatsContainer}>
            <div> 
              <h3>Folder Stats: {folders.find(f => f.id === selectedFolderId)?.name}</h3>
              <p>Total Sets: {folderStats.questionSetSummaries.length}</p>
              {folderStats.masteryHistory && <MasteryOverTimeChart data={folderStats.masteryHistory} title="Folder Mastery Over Time" />}
              <h4>Question Set Summaries:</h4>
              {folderStats.questionSetSummaries.length > 0 ? (
                <ul>
                  {folderStats.questionSetSummaries.map(summary => (
                    <li key={summary.id}>
                      {summary.name} (Mastery: {summary.mastery?.toFixed(2) || 'N/A'}, Last Reviewed: {summary.lastReviewedAt ? new Date(summary.lastReviewedAt).toLocaleDateString() : 'N/A'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No question sets in this folder to display stats for.</p>
              )}
            </div>
          </div>
        ) : null}

        {isLoadingSetStats && <p>Loading question set statistics...</p>}
        {errorSetStats && <p className={styles.errorText}>{errorSetStats}</p>}
        {/* Set Stats Display */}
        {setStats && selectedSetId ? (
          <div className={styles.setStatsContainer}>
            <div>
              <h3>Set Stats: {questionSets.find(s => s.id === selectedSetId)?.name}</h3>
              <p>Overall Mastery: {setStats.masteryHistory && setStats.masteryHistory.length > 0 && typeof setStats.masteryHistory[setStats.masteryHistory.length - 1]?.totalMasteryScore === 'number' ? setStats.masteryHistory[setStats.masteryHistory.length - 1].totalMasteryScore.toFixed(2) : 'N/A'}</p>
              <UUEScoresWidget scores={setStats.uueScores} />
              <SRStatusWidget status={setStats.srStatus} />
              {setStats.masteryHistory && <MasteryOverTimeChart data={setStats.masteryHistory} title="Question Set Mastery Over Time" />}
            </div>
          </div>
        ) : null}

        {!selectedFolderId && !selectedSetId && !isLoadingFolderStats && !isLoadingSetStats && (
          <p className={styles.text}>Please select a folder or question set to view statistics.</p>
        )}
      </div>
    </div>
  );
};

export default MyProgress;
