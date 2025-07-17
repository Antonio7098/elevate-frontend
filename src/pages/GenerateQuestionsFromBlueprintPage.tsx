import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningBlueprintById, generateQuestionsFromBlueprint } from '../services/learningBlueprintService';
import { getFolders } from '../services/folderService';
import type { LearningBlueprint } from '../types/questionSet';
import type { Folder } from '../types/folder';
import { FiLoader, FiAlertCircle, FiArrowLeft, FiCpu } from 'react-icons/fi';
import styles from './GenerateQuestionsFromBlueprintPage.module.css';

const GenerateQuestionsFromBlueprintPage: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const navigate = useNavigate();

  const [blueprint, setBlueprint] = useState<LearningBlueprint | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [questionSetName, setQuestionSetName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!blueprintId) {
        setError('Blueprint ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const [blueprintData, foldersData] = await Promise.all([
          getLearningBlueprintById(blueprintId),
          getFolders(),
        ]);
        setBlueprint(blueprintData);
        setFolders(foldersData);
        if (foldersData.length > 0) {
          setSelectedFolderId(foldersData[0].id);
        }
        setQuestionSetName(`Questions for blueprint from ${new Date(blueprintData.createdAt).toLocaleDateString()}`);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [blueprintId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blueprintId || !selectedFolderId || !questionSetName) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setIsGenerating(true);
      setError(null);
      const result = await generateQuestionsFromBlueprint(blueprintId, {
        name: questionSetName,
        folderId: selectedFolderId,
      });
      navigate(`/question-sets/${result.questionSet.id}`);
    } catch (err) {
      setError('Failed to generate questions.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className={styles.centeredMessage}><FiLoader className={styles.spinner} /> Loading...</div>;
  }

  if (error) {
    return <div className={`${styles.centeredMessage} ${styles.error}`}><FiAlertCircle /> {error}</div>;
  }

  return (
    <div className={styles.container}>
       <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <FiArrowLeft /> Back
        </button>
        <h1 className={styles.title}>Generate Questions</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.blueprintPreview}>
          <h3>Blueprint Source</h3>
          <p>{blueprint?.sourceText}</p>
        </div>

        <form onSubmit={handleGenerate} className={styles.form}>
          <h3>Configuration</h3>
          <div className={styles.formGroup}>
            <label htmlFor="questionSetName">Question Set Name</label>
            <input
              id="questionSetName"
              type="text"
              value={questionSetName}
              onChange={(e) => setQuestionSetName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="folder">Save to Folder</label>
            <select
              id="folder"
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              required
            >
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.generateButton} disabled={isGenerating}>
            {isGenerating ? <FiLoader className={styles.spinner} /> : <FiCpu />}
            {isGenerating ? 'Generating...' : 'Generate Question Set'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateQuestionsFromBlueprintPage;
