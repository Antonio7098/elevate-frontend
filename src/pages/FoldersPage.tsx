import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiAlertCircle, FiLoader, FiPlus, FiFolder, FiChevronRight, FiFileText, FiBook } from 'react-icons/fi';
import { CreateFolderModal } from '../components/modals/CreateFolderModal';
import { createFolder } from '../services/folderService';
import type { Folder } from '../types/folder';
import type { QuestionSet } from '../types/questionSet';
import type { Note } from '../types/note.types';
import styles from './FoldersPage.module.css';

console.log("🟢 [FoldersPage] Module loaded");

export default function FoldersPage() {
  console.log("🟢 [FoldersPage] Component initialized");
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  console.log('📍 [FoldersPage] URL parameters:', { folderId });

  useEffect(() => {
    console.log("🔄 [FoldersPage] Starting data fetch");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        };

        // Fetch sub-folders
        const foldersResponse = await fetch(
          `http://localhost:3000/api/folders${folderId ? `?parentId=${folderId}` : ''}`,
          { headers }
        );
        if (!foldersResponse.ok) throw new Error(`Failed to fetch folders: ${foldersResponse.status}`);
        const foldersData = await foldersResponse.json();
        setFolders(foldersData);

        // If we're in a folder, fetch its details and content
        if (folderId) {
          // Fetch current folder details
          const folderResponse = await fetch(
            `http://localhost:3000/api/folders/${folderId}`,
            { headers }
          );
          if (folderResponse.ok) {
            const folderData = await folderResponse.json();
            setCurrentFolder(folderData);
          }

          // Fetch question sets in this folder
          const questionSetsResponse = await fetch(
            `http://localhost:3000/api/folders/${folderId}/questionsets`,
            { headers }
          );
          if (questionSetsResponse.ok) {
            const questionSetsData = await questionSetsResponse.json();
            setQuestionSets(questionSetsData);
          }

          // Fetch notes in this folder
          const notesResponse = await fetch(
            `http://localhost:3000/api/notes?folderId=${folderId}`,
            { headers }
          );
          if (notesResponse.ok) {
            const notesData = await notesResponse.json();
            setNotes(notesData);
          }
        } else {
          setCurrentFolder(null);
          setQuestionSets([]);
          setNotes([]);
        }
      } catch (err) {
        console.error("❌ [FoldersPage] Error fetching data:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [folderId]);

  const handleNewFolder = () => {
    setIsModalOpen(true);
  };

  const handleCreateFolder = async (name: string, description: string) => {
    try {
      const newFolder = await createFolder({ name, description, parentId: folderId || null });
      setFolders(prevFolders => [...prevFolders, newFolder]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create folder'));
    }
  };

  const handleNewQuestionSet = () => {
    navigate(`/folders/${folderId}/question-sets/new`);
  };

  const handleNewNote = () => {
    navigate(`/folders/${folderId}/notes/new`);
  };

  if (isLoading) {
    console.log("🔄 [FoldersPage] Rendering loading state");
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Loading...</h1>
          </div>
        </div>
        <div className={styles.folderList}>
          <div className={styles.folderItem}>
            <FiLoader className={styles.spinner} />
            Loading content...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ [FoldersPage] Error loading content:', error);
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <FiAlertCircle />
          <span>Failed to load content: {error.message}</span>
        </div>
      </div>
    );
  }

  console.log("🎨 [FoldersPage] Rendering content");
  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link to="/folders" className={styles.breadcrumbLink}>
          Folders
        </Link>
        {currentFolder && (
          <>
            <FiChevronRight className={styles.breadcrumbSeparator} />
            <span className={styles.breadcrumbLink}>{currentFolder.name}</span>
          </>
        )}
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {currentFolder ? currentFolder.name : 'Folders'}
          </h1>
          {currentFolder && (
            <p className={styles.subtitle}>
              {currentFolder.description || 'No description'}
            </p>
          )}
        </div>
        <div className={styles.headerActions}>
          {currentFolder && (
            <>
              <Link 
                to={`/folders/${folderId}/all-questions`}
                className={styles.actionButton}
              >
                View Questions
              </Link>
              <Link 
                to={`/folders/${folderId}/all-notes`}
                className={styles.actionButton}
              >
                View Notes
              </Link>
            </>
          )}
          <button 
            className={styles.newFolderBtn}
            onClick={handleNewFolder}
          >
            <FiPlus />
            Add +
          </button>
        </div>
      </div>

      {/* Sub-folders Section */}
      {folders.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sub-folders</h2>
          </div>
          <div className={styles.folderList}>
            {folders.map(folder => (
              <Link 
                key={folder.id} 
                to={`/folders/${folder.id}`}
                className={styles.folderItem}
              >
                <div className={styles.folderInfo}>
                  <FiFolder className={styles.folderIcon} />
                  <div>
                    <h3 className={styles.folderName}>{folder.name}</h3>
                    {folder.description && (
                      <p className={styles.folderDescription}>{folder.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Question Sets Section */}
      {questionSets.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Question Sets</h2>
            <button 
              className={styles.newNoteBtn}
              onClick={handleNewQuestionSet}
            >
              <FiPlus />
              New Question Set
            </button>
          </div>
          <div className={styles.notesGrid}>
            {questionSets.map(set => (
              <div key={set.id} className="card">
                <Link to={`/question-sets/${set.id}`} className={styles.cardInfoLink}>
                  <div className={styles.folderInfo}>
                    <FiBook className={styles.folderIcon} />
                    <div>
                      <h3 className={styles.folderName}>{set.name}</h3>
                      {set.description && (
                        <p className={styles.folderDescription}>{set.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className={styles.cardActions}>
                  <button
                    className={styles.reviewBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/review/select/${set.id}`);
                    }}
                  >
                    Begin Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notes Section */}
      {notes.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Notes</h2>
            <button 
              className={styles.newNoteBtn}
              onClick={handleNewNote}
            >
              <FiPlus />
              New Note
            </button>
          </div>
          <div className={styles.notesGrid}>
            {notes.map(note => (
              <Link 
                key={note.id} 
                to={`/notes/${note.id}`}
                className={styles.folderItem}
              >
                <div className={styles.folderInfo}>
                  <FiFileText className={styles.folderIcon} />
                  <div>
                    <h3 className={styles.folderName}>{note.title}</h3>
                    {note.plainText && (
                      <p className={styles.folderDescription}>
                        {note.plainText.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {folders.length === 0 && questionSets.length === 0 && notes.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconContainer}>
            <FiFolder className={styles.emptyFolderIcon} />
          </div>
          <h2 className={styles.emptyTitle}>No content yet</h2>
          <p className={styles.emptyDescription}>
            Get started by creating a new folder, question set, or note.
          </p>
          <button 
            className={styles.emptyStateBtn}
            onClick={handleNewFolder}
          >
            <FiPlus />
            Create New Content
          </button>
        </div>
      )}

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}