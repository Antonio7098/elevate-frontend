import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearningBlueprints } from '../services/learningBlueprintService';
import type { LearningBlueprint } from '../types/questionSet';
import { FiLoader, FiAlertCircle, FiEye } from 'react-icons/fi';
import styles from './BlueprintsPage.module.css';

const BlueprintsPage: React.FC = () => {
  const navigate = useNavigate();
  const [blueprints, setBlueprints] = useState<LearningBlueprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        setIsLoading(true);
        const data = await getLearningBlueprints();
        setBlueprints(data);
      } catch {
        setError('Failed to load learning blueprints.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlueprints();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Learning Blueprints</h1>

      {isLoading && (
        <div className={styles.centeredMessage}>
          <FiLoader className={styles.spinner} />
          <p>Loading blueprints...</p>
        </div>
      )}

      {error && (
        <div className={`${styles.centeredMessage} ${styles.error}`}>
          <FiAlertCircle />
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className={styles.grid}>
          {blueprints.length === 0 ? (
            <p className={styles.centeredMessage}>No learning blueprints found.</p>
          ) : (
            blueprints.map(bp => (
              <div key={bp.id} className="card">
                <h2 className={styles.cardTitle}>Blueprint from {new Date(bp.createdAt).toLocaleDateString()}</h2>
                <p className={styles.cardSnippet}>"{bp.sourceText.substring(0, 150)}..."</p>
                <button onClick={() => navigate(`/blueprints/${bp.id}`)} className={styles.viewButton}>
                  <FiEye /> View Details
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BlueprintsPage;
