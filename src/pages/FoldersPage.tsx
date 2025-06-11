import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiFolder, FiPlus, FiChevronRight, FiAlertCircle, FiLoader, FiX, FiPlusCircle, FiTrash2, FiEdit2, FiArrowLeft, FiFileText } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createFolder, getFolders, deleteFolder, updateFolder } from '../services/folderService';
import { getQuestionSets } from '../services/questionSetService';
import type { Folder, CreateFolderData, UpdateFolderData } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';
import styles from './FoldersPage.module.css';
import { FolderListItem } from '../components/folders/FolderListItem';

console.log("🟢 FoldersPage.tsx loaded and running!");

// Skeleton loader for folders
const FolderSkeleton = () => (
  <div className={styles.skeleton}>
    <div className={styles.skeletonBar}></div>
    <div className={styles.skeletonBarSmall}></div>
  </div>
);

// Breadcrumb component
const Breadcrumbs = ({ folders, currentFolder }: { folders: Folder[], currentFolder: Folder | null }) => {
  const breadcrumbs: Folder[] = [];
  let current = currentFolder;

  // Build breadcrumb path by traversing up the tree
  while (current) {
    breadcrumbs.unshift(current);
    current = folders.find(f => f.id === current?.parentId) || null;
  }

  return (
    <div className={styles.breadcrumbs}>
      <Link to="/folders" className={styles.breadcrumbLink}>
        My Folders
      </Link>
      {breadcrumbs.map((folder) => (
        <div key={folder.id} className={styles.breadcrumbItem}>
          <FiChevronRight className={styles.breadcrumbSeparator} />
          <Link 
            to={`/folders/${folder.id}`}
            className={styles.breadcrumbLink}
          >
            {folder.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default function FoldersPage() {
  const { folderId } = useParams<{ folderId: string }>();
  console.log('📍 [FoldersPage] Current folderId:', folderId);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<CreateFolderData>({ name: '', description: '', parentId: folderId || null });
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editFolderData, setEditFolderData] = useState<UpdateFolderData>({ name: '', description: '', parentId: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all folders
  const { data: folders = [], isLoading: isLoadingFolders } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders
  });

  // Fetch question sets for the current folder
  const { data: questionSets = [], isLoading: isLoadingQuestionSets } = useQuery({
    queryKey: ['questionSets', folderId],
    queryFn: () => folderId ? getQuestionSets(folderId) : Promise.resolve([]),
    enabled: !!folderId
  });

  // Fetch current folder if folderId is provided
  const { data: currentFolderData, isLoading: isLoadingCurrentFolder } = useQuery({
    queryKey: ['folder', folderId],
    queryFn: () => folderId ? getFolders().then(folders => 
      folders.find(f => f.id === folderId)
    ) : null,
    enabled: !!folderId
  });

  // Flatten the nested folder structure
  const flattenedFolders = useMemo(() => {
    const flatten = (folders: Folder[]): Folder[] => {
      return folders.reduce((acc: Folder[], folder) => {
        acc.push(folder);
        if (folder.children && folder.children.length > 0) {
          acc.push(...flatten(folder.children));
        }
        return acc;
      }, []);
    };
    return flatten(folders);
  }, [folders]);

  const displayFolders = useMemo(() => {
    return flattenedFolders.filter(folder => {
      const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (folder.description && folder.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (folderId) {
        return String(folder.parentId) === String(folderId) && matchesSearch;
      }
      return !folder.parentId && matchesSearch;
    });
  }, [flattenedFolders, folderId, searchQuery]);

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setIsCreateModalOpen(false);
      setNewFolder({ name: '', description: '', parentId: folderId || null });
    },
    onError: (error) => {
      setError('Failed to create folder. Please try again.');
      console.error('Error creating folder:', error);
    }
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setIsDeleting(null);
      setFolderToDelete(null);
      // If we're in the folder being deleted, navigate back to root
      if (folderId === folderToDelete?.id) {
        navigate('/folders');
      }
    },
    onError: (error) => {
      setError('Failed to delete folder. Please try again.');
      console.error('Error deleting folder:', error);
      setIsDeleting(null);
    }
  });

  // Update folder mutation
  const updateFolderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderData }) => updateFolder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setIsEditModalOpen(false);
      setEditFolderId(null);
      setEditFolderData({ name: '', description: '', parentId: null });
    },
    onError: (error) => {
      setError('Failed to update folder. Please try again.');
      console.error('Error updating folder:', error);
    }
  });

  // Reset new folder parentId when folderId changes
  useEffect(() => {
    setNewFolder(prev => ({ ...prev, parentId: folderId || null }));
  }, [folderId]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createFolderMutation.mutateAsync(newFolder);
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteFolderMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFolderId) return;
    
    setIsSubmitting(true);
    try {
      await updateFolderMutation.mutateAsync({ id: editFolderId, data: editFolderData });
    } catch (error) {
      console.error('Error updating folder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {folderId ? (currentFolderData?.name || 'Loading...') : 'Folders'}
          </h1>
          <p className={styles.subtitle}>
            {folderId ? 'View folder contents' : 'Organize your study materials'}
          </p>
        </div>
        <button
          className={styles.newFolderBtn}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FiPlus />
          New Folder
        </button>
      </div>

      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <button 
          className={styles.breadcrumbLink} 
          onClick={() => navigate('/folders')}
        >
          <FiArrowLeft /> Back to Folders
        </button>
        {folderId && currentFolderData && (
          <>
            <FiChevronRight className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbLink}>{currentFolderData.name}</span>
          </>
        )}
      </div>

      {/* Loading State */}
      {(isLoadingFolders || isLoadingQuestionSets) && (
        <div className={styles.folderList}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeleton}>
              <div className={styles.skeletonBar} />
              <div className={styles.skeletonBarSmall} />
            </div>
          ))}
        </div>
      )}

      {/* Folder List */}
      <div className={styles.folderList}>
        {/* Display folders */}
        {displayFolders.map(folder => (
          <div key={folder.id} className={styles.folderItem}>
            <Link to={`/folders/${folder.id}`} className={styles.folderLink}>
              <FiFolder className={styles.folderIcon} />
              <div className={styles.folderInfo}>
                <h3 className={styles.folderName}>{folder.name}</h3>
                {folder.description && (
                  <p className={styles.folderDescription}>{folder.description}</p>
                )}
              </div>
            </Link>
            <div className={styles.folderActions}>
              <button
                className={styles.actionButton}
                onClick={() => {
                  setEditFolderId(folder.id);
                  setEditFolderData({
                    name: folder.name,
                    description: folder.description || '',
                    parentId: folder.parentId
                  });
                  setIsEditModalOpen(true);
                }}
              >
                <FiEdit2 /> Edit
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => {
                  setFolderToDelete(folder);
                  setIsDeleting(folder.id);
                }}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Display question sets */}
        {folderId && questionSets.map(questionSet => (
          <div key={questionSet.id} className={styles.folderItem}>
            <Link to={`/question-sets/${questionSet.id}`} className={styles.folderLink}>
              <FiFileText className={styles.folderIcon} />
              <div className={styles.folderInfo}>
                <h3 className={styles.folderName}>{questionSet.name}</h3>
                {questionSet.description && (
                  <p className={styles.folderDescription}>{questionSet.description}</p>
                )}
              </div>
            </Link>
            <div className={styles.folderActions}>
              <button
                className={styles.actionButton}
                onClick={() => navigate(`/question-sets/${questionSet.id}/edit`)}
              >
                <FiEdit2 /> Edit
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleDeleteFolder(questionSet.id)}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {!isLoadingFolders && !isLoadingQuestionSets && displayFolders.length === 0 && (!folderId || questionSets.length === 0) && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <FiFolder className={styles.emptyFolderIcon} />
            </div>
            <h3 className={styles.emptyTitle}>No folders found</h3>
            <p className={styles.emptyDescription}>
              {folderId 
                ? "This folder is empty. Create a new subfolder or question set to get started."
                : "Create your first folder to start organizing your content."}
            </p>
            <button 
              className={styles.emptyStateBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus /> Create New Folder
            </button>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {isCreateModalOpen && (
        <div className={styles.elevateModalBackdrop}>
          <div className={styles.elevateModal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Folder</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setIsCreateModalOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Name<span className={styles.requiredIndicator}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newFolder.name}
                  onChange={(e) => setNewFolder(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Enter folder name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  value={newFolder.description}
                  onChange={(e) => setNewFolder(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter folder description (optional)"
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className={styles.spinner} />
                      Creating...
                    </>
                  ) : (
                    'Create Folder'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {isEditModalOpen && editFolderId && (
        <div className={styles.elevateModalBackdrop}>
          <div className={styles.elevateModal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Folder</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setIsEditModalOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdateFolder} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Name<span className={styles.requiredIndicator}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editFolderData.name}
                  onChange={(e) => setEditFolderData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Enter folder name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  value={editFolderData.description}
                  onChange={(e) => setEditFolderData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter folder description (optional)"
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className={styles.spinner} />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}