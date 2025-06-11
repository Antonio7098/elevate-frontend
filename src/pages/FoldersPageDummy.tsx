import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import type { Folder } from '../types/folder';
import styles from './FoldersPage.module.css';

console.log("🟢 [FoldersPage] Module loaded");

export function FoldersPage() {
  console.log("🟢 [FoldersPage] Component initialized");
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { folderId } = useParams<{ folderId: string }>();
  console.log('📍 [FoldersPage] URL parameters:', { folderId });

  useEffect(() => {
    console.log("🔄 [FoldersPage] Starting data fetch");
    const fetchFolders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/folders${folderId ? `?parentId=${folderId}` : ''}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ [FoldersPage] Data fetched:", data);
        setFolders(data);
      } catch (err) {
        console.error("❌ [FoldersPage] Error fetching data:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch folders'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, [folderId]);

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
            Loading folders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('❌ [FoldersPage] Error loading folders:', error);
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <FiAlertCircle />
          <span>Failed to load folders: {error.message}</span>
        </div>
      </div>
    );
  }

  console.log("🎨 [FoldersPage] Rendering folders list");
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {folderId ? 'Folder View' : 'Folders'}
          </h1>
        </div>
      </div>

      <div className={styles.folderList}>
        {folders.length === 0 ? (
          <div className={styles.folderItem}>
            No folders found
          </div>
        ) : (
          folders.map(folder => (
            <div key={folder.id} className={styles.folderItem}>
              {folder.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}