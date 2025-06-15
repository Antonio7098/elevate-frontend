import React, { useEffect, useState } from 'react';
import type { InsightCatalyst } from '../../types/insightCatalyst.types';
import { getCatalystsForNote, createCatalyst } from '../../services/insightCatalystService';
import styles from './InsightCatalystSidebar.module.css';

interface InsightCatalystSidebarProps {
  noteId: string;
}

export const InsightCatalystSidebar: React.FC<InsightCatalystSidebarProps> = ({ noteId }) => {
  const [catalysts, setCatalysts] = useState<InsightCatalyst[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalysts = async () => {
      try {
        const data = await getCatalystsForNote(noteId);
        setCatalysts(data);
      } catch (err) {
        // If the endpoint doesn't exist, just show an empty list
        setCatalysts([]);
        console.warn('Insight catalysts endpoint not available yet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalysts();
  }, [noteId]);

  const handleCreateCatalyst = async () => {
    try {
      const newCatalyst = await createCatalyst(noteId, {
        type: 'question',
        content: 'New catalyst...',
        metadata: {
          status: 'active',
          importance: 0.5
        }
      });
      setCatalysts(prev => [...prev, newCatalyst]);
    } catch (err) {
      console.warn('Cannot create catalyst: endpoint not available yet');
    }
  };

  if (isLoading) {
    return <div className={styles.sidebar}>Loading catalysts...</div>;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Insight Catalysts</h2>
        <button 
          className={styles.createButton}
          onClick={handleCreateCatalyst}
        >
          Create New
        </button>
      </div>
      
      <div className={styles.catalystList}>
        {catalysts.map(catalyst => (
          <div key={catalyst.id} className={styles.catalystItem}>
            <div className={styles.catalystType}>{catalyst.type}</div>
            <div className={styles.catalystContent}>{catalyst.content}</div>
            {catalyst.metadata?.tags && (
              <div className={styles.tags}>
                {catalyst.metadata.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 