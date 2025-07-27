import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiPlusSquare, FiEdit } from 'react-icons/fi';
import styles from './CreateHubPage.module.css';

const CreateHubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New</h1>
      <div className={styles.grid}>
        <div className="card" onClick={() => navigate('/create/blueprint-from-source')}>
          <FiPlusSquare className={styles.icon} />
          <h2 className={styles.cardTitle}>Create Blueprint from Source</h2>
          <p className={styles.cardDescription}>Generate a new learning blueprint from text, a URL, or a file.</p>
        </div>
        <div className="card" onClick={() => navigate('/create-questions-from-blueprint')}>
          <FiFileText className={styles.icon} />
          <h2 className={styles.cardTitle}>Create Questions from Blueprint</h2>
          <p className={styles.cardDescription}>Use an existing learning blueprint to generate a new question set.</p>
        </div>
        <div className="card" onClick={() => navigate('/create-questions-from-scratch')}>
          <FiEdit className={styles.icon} />
          <h2 className={styles.cardTitle}>Create Questions from Scratch</h2>
          <p className={styles.cardDescription}>Manually build a question set from scratch for targeted learning.</p>
        </div>
      </div>
    </div>
  );
};

export default CreateHubPage;
