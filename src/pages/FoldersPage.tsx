import React from 'react';
import { mockFolders } from '../data/legacyMockData';
import styles from './FoldersPage.module.css';

const FoldersPage: React.FC = () => {
  return (
    <div className={styles.foldersPage}>
      <div className={styles.header}>
        <h1>Folders</h1>
        <p>Organize your learning content into folders</p>
      </div>

      <div className={styles.foldersGrid}>
        {mockFolders.map((folder) => (
          <div key={folder.id} className={styles.folderCard}>
            <div className={styles.folderIcon}>
              <span>📁</span>
            </div>
            <div className={styles.folderInfo}>
              <h3>{folder.name}</h3>
              <p>{folder.description}</p>
              <div className={styles.folderMeta}>
                <span className={styles.itemCount}>{folder.itemCount} items</span>
                <span className={styles.folderType}>{folder.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.emptyState}>
        <p>No more folders to display</p>
      </div>
    </div>
  );
};

export default FoldersPage;
