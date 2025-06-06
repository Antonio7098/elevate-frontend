import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiFolder, 
  FiTrash2, 
  FiEdit2, 
  FiChevronRight,
  FiLoader,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getFolders, createFolder, deleteFolder } from '../services/folderService';
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
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<CreateFolderData>({ 
    name: '', 
    description: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Load folders
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

  // Initial load
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  // Handle folder creation
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolder.name.trim()) return;

    try {
      setIsSubmitting(true);
      await createFolder({
        name: newFolder.name.trim(),
        description: newFolder.description?.trim() || undefined,
      });
      
      await loadFolders();
      setNewFolder({ name: '', description: '' });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create folder:', err);
      setError('Failed to create folder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle folder deletion
  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm('Are you sure you want to delete this folder? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(folderId);
      await deleteFolder(folderId);
      await loadFolders();
    } catch (err) {
      console.error('Failed to delete folder:', err);
      setError('Failed to delete folder. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <FolderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

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
          <FiPlus style={{marginRight: 8, width: 16, height: 16}} />
          New Folder
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <FiAlertCircle style={{width: 20, height: 20}} />
          <span>{error}</span>
        </div>
      )}

      {folders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <FiFolder style={{width: 32, height: 32, color: '#6366f1'}} />
          </div>
          <h3 className={styles.emptyTitle}>No folders yet</h3>
          <p className={styles.emptyDesc}>
            Organize your study materials by creating your first folder
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.emptyBtn}
          >
            <FiPlus style={{marginRight: 8, width: 16, height: 16}} />
            Create Folder
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={styles.folderCard}
              tabIndex={0}
            >
              <div className={styles.folderRow}>
                <div style={{display: 'flex', alignItems: 'flex-start'}}>
                  <div className={styles.folderIcon}>
                    <FiFolder style={{width: 20, height: 20}} />
                  </div>
                  <div className={styles.folderInfo}>
                    <h3 className={styles.folderName}>{folder.name}</h3>
                    {folder.description && (
                      <p className={styles.folderDesc}>
                        {folder.description}
                      </p>
                    )}
                    <div className={styles.folderDate}>
                      Created {formatDate(folder.createdAt)}
                    </div>
                  </div>
                </div>
                <div className={styles.folderActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className={styles.actionBtn}
                    title="Edit folder"
                  >
                    <FiEdit2 style={{width: 16, height: 16}} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                    disabled={isDeleting === folder.id}
                    className={styles.actionBtn}
                    title="Delete folder"
                  >
                    {isDeleting === folder.id ? (
                      <FiLoader style={{width: 16, height: 16}} className="animate-spin" />
                    ) : (
                      <FiTrash2 style={{width: 16, height: 16}} />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate(`/folders/${folder.id}`)}
                className={styles.viewBtn}
              >
                View contents
                <FiChevronRight style={{width: 16, height: 16}} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      {isCreateModalOpen && (
        <div className={styles.modalBackdrop}>
          <div 
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create New Folder</h2>
                <p className={styles.modalDesc}>Organize your study materials</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className={styles.closeBtn}
                aria-label="Close"
              >
                <FiX style={{width: 20, height: 20}} />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className={styles.form}>
              <div>
                <label htmlFor="folder-name" className={styles.formLabel}>
                  Folder Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="folder-name"
                  required
                  value={newFolder.name}
                  onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  className={styles.formInput}
                  placeholder="e.g., Math Notes"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="folder-description" className={styles.formLabel}>
                  Description <span className={styles.optional}>(Optional)</span>
                </label>
                <textarea
                  id="folder-description"
                  rows={3}
                  value={newFolder.description}
                  onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="Add a brief description..."
                />
              </div>
              <div className={styles.formFooter}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={styles.cancelBtn}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newFolder.name.trim()}
                  className={styles.submitBtn}
                  style={isSubmitting || !newFolder.name.trim() ? {opacity: 0.7, cursor: 'not-allowed'} : {}}
                >
                  {isSubmitting ? (
                    <span style={{display: 'flex', alignItems: 'center'}}>
                      <FiLoader style={{marginLeft: -4, marginRight: 8, width: 16, height: 16}} className="animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Folder'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoldersPage;
