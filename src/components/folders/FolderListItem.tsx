import React from 'react';
import { FiFolder, FiChevronRight, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import type { Folder } from '../../types/folder';
import styles from './FolderListItem.module.css';

interface FolderListItemProps {
  folder: Folder;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  onEdit?: (folder: Folder) => void;
}

export const FolderListItem: React.FC<FolderListItemProps> = ({
  folder,
  onDelete,
  isDeleting = false,
  onEdit,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(folder.id);
  };

  return (
    <Link to={`/folders/${folder.id}`} className={styles.folderItem}>
      <div className={styles.folderInfo}>
        <div className={styles.folderIcon}>
          <FiFolder />
        </div>
        <div>
          <h3 className={styles.folderName}>{folder.name}</h3>
          {folder.description && (
            <p className={styles.folderDescription}>{folder.description}</p>
          )}
          <div className={styles.metaInfo}>
            <span className={styles.itemCount}>
              {folder.questionSetCount || 0} sets
            </span>
            <span className={styles.divider}>•</span>
            <span className={styles.mastery}>
              Mastery: {folder.masteryScore ? `${folder.masteryScore}%` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onEdit) onEdit(folder);
          }}
          aria-label="Edit folder"
        >
          <FiEdit2 />
        </button>
        <button
          className={`${styles.actionButton} ${styles.deleteButton}`}
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete folder"
        >
          {isDeleting ? 'Deleting...' : <FiTrash2 />}
        </button>
        <FiChevronRight className={styles.chevron} />
      </div>
    </Link>
  );
};


