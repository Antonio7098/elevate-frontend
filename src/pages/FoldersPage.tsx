import { useState, useEffect, useCallback } from 'react';

import {
  FiPlus,
  FiFolder,
  FiLoader,
  FiX,
  FiAlertCircle,
  FiPlusCircle
} from 'react-icons/fi';
import { FolderListItem } from '../components/folders/FolderListItem';

import { getFolders, createFolder, deleteFolder, updateFolder } from '../services/folderService';
import type { Folder, CreateFolderData } from '../types/folder';
import styles from './FoldersPage.module.css';

// Skeleton loader for folders
const FolderSkeleton = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonBar}></div>
    <div className={styles.skeletonBarSmall}></div>
  </div>
);

const FoldersPage = () => {
  // --- Edit Folder State ---
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editFolderData, setEditFolderData] = useState<CreateFolderData>({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<CreateFolderData>({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Stores ID of folder being deleted


  const loadFolders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFolders();
      setFolders(data);
    } catch (err) {
      console.error('Failed to load folders:', err);
      setError('Failed to load folders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolder.name.trim()) return;

    try {
      setIsSubmitting(true);
      await createFolder({
        name: newFolder.name.trim(),
        description: newFolder.description?.trim() || undefined,
      });
      await loadFolders(); // Refresh folder list
      setNewFolder({ name: '', description: '' }); // Reset form
      setIsCreateModalOpen(false); // Close modal
    } catch (err) {
      console.error('Failed to create folder:', err);
      setError('Failed to create folder. Please try again.'); // Consider showing error in modal
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    // Optional: Add a confirmation dialog here if not present in FolderListItem
    // if (!window.confirm('Are you sure you want to delete this folder?')) return;
    try {
      setIsDeleting(folderId);
      await deleteFolder(folderId);
      await loadFolders(); // Refresh folder list
    } catch (err) {
      console.error('Failed to delete folder:', err);
      setError('Failed to delete folder. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle edit button click from FolderListItem
  const handleEditClick = (folder: Folder) => {
    setEditFolderId(folder.id);
    setEditFolderData({ name: folder.name, description: folder.description || '' });
    setIsCreateModalOpen(false);
  };

  // Handle edit modal input change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFolderData({ ...editFolderData, [e.target.name]: e.target.value });
  };

  // Handle edit modal submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFolderId) return;
    try {
      setIsEditing(true);
      await updateFolder(editFolderId, {
        name: editFolderData.name.trim(),
        description: editFolderData.description?.trim() || undefined,
      });
      await loadFolders();
      setEditFolderId(null);
      setEditFolderData({ name: '', description: '' });
    } catch (err) {
      setError('Failed to update folder. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.folderList}>
          {[1, 2, 3].map((i) => (
            <FolderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Removed error display from here as it's better handled within the main layout or via toasts

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Folders</h1>
          <p className={styles.subtitle}>
            {folders.length} {folders.length === 1 ? 'folder' : 'folders'}
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className={styles.newFolderBtn}
        >
          <FiPlus style={{ marginRight: 8, width: 16, height: 16 }} />
          New Folder
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <FiAlertCircle style={{ width: 20, height: 20 }} />
          <span>{error}</span>
        </div>
      )}

      {folders.length === 0 && !isLoading ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconContainer}>
            <FiFolder className={styles.emptyFolderIcon} />
          </div>
          <h3 className={styles.emptyTitle}>No folders yet</h3>
          <p className={styles.emptyDescription}>
            Organize your study materials by creating your first folder.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`${styles.newFolderBtn} ${styles.emptyStateBtn}`}
          >
            <FiPlusCircle style={{ marginRight: 8, width: 18, height: 18 }} />
            Create Folder
          </button>
        </div>
      ) : (
        <div className={styles.folderList}>
          {folders.map((folder) => (
            <FolderListItem
              key={folder.id}
              folder={folder}
              onDelete={handleDeleteFolder}
              isDeleting={isDeleting === folder.id}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      {isCreateModalOpen ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Folder</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className={styles.closeBtn}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="folder-name" className={styles.formLabel}>
                  Folder Name <span className={styles.requiredIndicator}>*</span>
                </label>
                <input
                  type="text"
                  id="folder-name"
                  value={newFolder.name}
                  onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  className={styles.formInput}
                  placeholder="e.g., Advanced Calculus Notes"
                  required
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="folder-description" className={styles.formLabel}>
                  Description (Optional)
                </label>
                <textarea
                  id="folder-description"
                  value={newFolder.description}
                  onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="A brief summary of what this folder contains"
                  rows={3}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isSubmitting || !newFolder.name.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className={styles.spinner} /> Creating...
                    </>
                  ) : (
                    'Create Folder'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {/* Edit Folder Modal */}
      {editFolderId ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Folder</h2>
              <button
                onClick={() => setEditFolderId(null)}
                className={styles.closeBtn}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="edit-folder-name" className={styles.formLabel}>
                  Folder Name <span className={styles.requiredIndicator}>*</span>
                </label>
                <input
                  type="text"
                  id="edit-folder-name"
                  name="name"
                  value={editFolderData.name}
                  onChange={handleEditChange}
                  className={styles.formInput}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="edit-folder-description" className={styles.formLabel}>
                  Description (Optional)
                </label>
                <textarea
                  id="edit-folder-description"
                  name="description"
                  value={editFolderData.description}
                  onChange={handleEditChange}
                  className={styles.formTextarea}
                  rows={3}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setEditFolderId(null)}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isEditing || !editFolderData.name.trim()}
                >
                  {isEditing ? (
                    <><FiLoader className={styles.spinner} /> Saving...</>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FoldersPage;
