import React from 'react';
import { FiFolder, FiBook, FiFileText, FiPlus } from 'react-icons/fi';
import styles from './AddContentModal.module.css';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFolder: () => void;
  onAddQuestionSet: () => void;
  onAddNote: () => void;
  onAddBlueprint: () => void;
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  onAddFolder,
  onAddQuestionSet,
  onAddNote,
  onAddBlueprint,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>What would you like to add?</h2>
        <div className={styles.optionsGrid}>
          <button className={styles.optionButton} onClick={() => { onAddFolder(); onClose(); }}>
            <FiFolder className={styles.optionIcon} />
            <span>New Folder</span>
          </button>
          <button className={styles.optionButton} onClick={() => { onAddQuestionSet(); onClose(); }}>
            <FiBook className={styles.optionIcon} />
            <span>New Question Set</span>
          </button>
          <button className={styles.optionButton} onClick={() => { onAddNote(); onClose(); }}>
            <FiFileText className={styles.optionIcon} />
            <span>New Note</span>
          </button>
          <button className={styles.optionButton} onClick={() => { onAddBlueprint(); onClose(); }}>
            <FiPlus className={styles.optionIcon} />
            <span>New Blueprint</span>
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
