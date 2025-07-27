import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningBlueprintById } from '../services/learningBlueprintService';
import type { LearningBlueprint } from '../types/questionSet';
import { FiLoader, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import styles from './BlueprintDetailPage.module.css';

const BlueprintDetailPage: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const navigate = useNavigate();
  const [blueprint, setBlueprint] = useState<LearningBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlueprint = async () => {
      if (!blueprintId) {
        setError('Blueprint ID is missing.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getLearningBlueprintById(blueprintId);
        setBlueprint(data);
      } catch {
        setError('Failed to load learning blueprint.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlueprint();
  }, [blueprintId]);

  if (isLoading) {
    return <div className={styles.centeredMessage}><FiLoader className={styles.spinner} /> Loading blueprint...</div>;
  }

  if (error) {
    return <div className={`${styles.centeredMessage} ${styles.error}`}><FiAlertCircle /> {error}</div>;
  }

  if (!blueprint) {
    return <div className={styles.centeredMessage}>Blueprint not found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/blueprints')} className={styles.backButton}>
          <FiArrowLeft /> Back to Blueprints
        </button>
        <h1 className={styles.title}>Blueprint Details</h1>
      </div>
      <div className={styles.contentGrid}>
        <div className={styles.sourcePanel}>
          <h2>Source Text</h2>
          <p className={styles.sourceText}>{blueprint.sourceText}</p>
        </div>
        <div className={styles.jsonPanel}>
          <h2>Blueprint JSON</h2>
          <pre className={styles.jsonViewer}>
            {JSON.stringify(blueprint.blueprintJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BlueprintDetailPage;
