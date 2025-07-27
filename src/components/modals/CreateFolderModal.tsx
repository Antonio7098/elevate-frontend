import { useState } from 'react';
import styles from './CreateFolderModal.module.css';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export function CreateFolderModal({ isOpen, onClose, onCreate }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name, description);
  };

  return (
    <div className={styles.overlay}>
      <div className="card">
        <h2>Create New Folder</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Folder Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.createButton}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
