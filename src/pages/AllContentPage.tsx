import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiAlertCircle, FiLoader, FiFolder, FiChevronRight, FiFileText, FiBook } from 'react-icons/fi';
import styles from './AllContentPage.module.css';

interface Question {
  id: string;
  text: string;
  questionSetId: string;
  questionSetName: string;
}

interface Note {
  id: string;
  title: string;
  plainText: string;
}

interface FolderWithContent {
  id: string;
  name: string;
  questions?: Question[];
  notes?: Note[];
  subfolders: FolderWithContent[];
}

export function AllContentPage() {
  const [data, setData] = useState<FolderWithContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentFolder, setCurrentFolder] = useState<FolderWithContent | null>(null);
  
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const isQuestionsView = window.location.pathname.includes('/all-questions');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        };

        // Fetch current folder details
        const folderResponse = await fetch(
          `http://localhost:3000/api/folders/${folderId}`,
          { headers }
        );
        if (!folderResponse.ok) throw new Error(`Failed to fetch folder: ${folderResponse.status}`);
        const folderData = await folderResponse.json();
        setCurrentFolder(folderData);

        // Fetch aggregated content
        const endpoint = isQuestionsView 
          ? `/api/folders/${folderId}/all-questions`
          : `/api/folders/${folderId}/all-notes`;
        
        const contentResponse = await fetch(
          `http://localhost:3000${endpoint}`,
          { headers }
        );
        if (!contentResponse.ok) throw new Error(`Failed to fetch content: ${contentResponse.status}`);
        const contentData = await contentResponse.json();
        setData(contentData);
      } catch (err) {
        console.error("❌ [AllContentPage] Error fetching data:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [folderId, isQuestionsView]);

  const renderContent = (folder: FolderWithContent) => {
    const content = isQuestionsView ? folder.questions : folder.notes;
    if (!content || content.length === 0) return null;

    return (
      <div key={folder.id} className={styles.folderSection}>
        <h2 className={styles.folderName}>{folder.name}</h2>
        <div className={styles.contentGrid}>
          {content.map(item => {
            if (isQuestionsView) {
              const question = item as Question;
              return (
                <Link
                  key={question.id}
                  to={`/question-sets/${question.questionSetId}`}
                  className={styles.contentItem}
                >
                  <div className={styles.contentInfo}>
                    <FiBook className={styles.contentIcon} />
                    <div>
                      <h3 className={styles.contentTitle}>
                        {question.text}
                      </h3>
                      <p className={styles.questionSetName}>
                        {question.questionSetName}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            } else {
              const note = item as Note;
              return (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className={styles.contentItem}
                >
                  <div className={styles.contentInfo}>
                    <FiFileText className={styles.contentIcon} />
                    <div>
                      <h3 className={styles.contentTitle}>
                        {note.title}
                      </h3>
                      {note.plainText && (
                        <p className={styles.contentPreview}>
                          {note.plainText.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const renderFolderTree = (folder: FolderWithContent) => {
    return (
      <div key={folder.id}>
        {renderContent(folder)}
        {folder.subfolders.map(subfolder => renderFolderTree(subfolder))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Loading...</h1>
          </div>
        </div>
        <div className={styles.loadingContent}>
          <FiLoader className={styles.spinner} />
          Loading content...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <FiAlertCircle />
          <span>Failed to load content: {error.message}</span>
        </div>
      </div>
    );
  }

  if (!data || !currentFolder) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <FiAlertCircle />
          <span>No content found</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link to="/folders" className={styles.breadcrumbLink}>
          Folders
        </Link>
        <FiChevronRight className={styles.breadcrumbSeparator} />
        <Link to={`/folders/${folderId}`} className={styles.breadcrumbLink}>
          {currentFolder.name}
        </Link>
        <FiChevronRight className={styles.breadcrumbSeparator} />
        <span className={styles.breadcrumbLink}>
          {isQuestionsView ? 'All Questions' : 'All Notes'}
        </span>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {isQuestionsView ? 'All Questions' : 'All Notes'}
          </h1>
          <p className={styles.subtitle}>
            {isQuestionsView 
              ? 'View all questions in this folder and its subfolders'
              : 'View all notes in this folder and its subfolders'
            }
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {renderFolderTree(data)}
      </div>
    </div>
  );
} 