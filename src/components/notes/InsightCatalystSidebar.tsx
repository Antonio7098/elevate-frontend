import { useEffect, useState } from 'react';
import type { InsightCatalyst } from '../../types/insightCatalyst.types';
import { FiPlus } from 'react-icons/fi';
import { getCatalystsForNote, createCatalyst } from '../../services/insightCatalystService';
import InsightCatalystDisplay from '../insightCatalysts/InsightCatalystDisplay';
import styles from './InsightCatalystSidebar.module.css';

interface InsightCatalystSidebarProps {
  noteId: string;
}

export const InsightCatalystSidebar = ({ noteId }: InsightCatalystSidebarProps) => {
  const [catalysts, setCatalysts] = useState<InsightCatalyst[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        text: 'New catalyst...',
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
          <FiPlus style={{ marginRight: '0.5rem' }} />
          Create New
        </button>
      </div>
      
      <div className={styles.catalystList}>
        {catalysts.length > 0 ? (
          catalysts.map(catalyst => (
            <InsightCatalystDisplay key={catalyst.id} catalyst={catalyst} />
          ))
        ) : (
          <p className={styles.emptyMessage}>No insight catalysts for this note yet.</p>
        )}
      </div>
    </div>
  );
}; 