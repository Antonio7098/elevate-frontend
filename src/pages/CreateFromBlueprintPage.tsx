import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearningBlueprints } from '../services/learningBlueprintService';
import type { LearningBlueprint } from '../types/questionSet';
import { FiArrowLeft, FiLoader, FiAlertCircle, FiCpu } from 'react-icons/fi';
import styles from './CreateFromBlueprintPage.module.css';

const CreateFromBlueprintPage: React.FC = () => {
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
      } catch (err) {
        setError('Failed to load learning blueprints.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlueprints();
  }, []);

  const handleSelectBlueprint = (id: string) => {
    // Navigate to a page where user can configure and generate questions
    // This will be implemented in the next step
    navigate(`/create-questions-from-blueprint/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <FiArrowLeft /> Back
        </button>
        <h1 className={styles.title}>Create Questions from Blueprint</h1>
      </div>

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
              <div key={bp.id} className={styles.card}>
                <h2 className={styles.cardTitle}>Blueprint from {new Date(bp.createdAt).toLocaleDateString()}</h2>
                <p className={styles.cardSnippet}>"{bp.sourceText.substring(0, 100)}..."</p>
                <button onClick={() => handleSelectBlueprint(bp.id)} className={styles.selectButton}>
                  <FiCpu /> Generate Questions
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CreateFromBlueprintPage;
