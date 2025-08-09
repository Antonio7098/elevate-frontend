import { useEffect, useMemo, useState } from 'react';
import type { InsightCatalyst } from '../../types/insightCatalyst.types';
import { FiPlus } from 'react-icons/fi';
import { getCatalystsForNote, createCatalyst } from '../../services/insightCatalystService';
import InsightCatalystDisplay from '../insightCatalysts/InsightCatalystDisplay';
import styles from './InsightCatalystSidebar.module.css';

interface ContentLink {
  id: string;
  label: string;
  onClick: () => void;
}

interface InsightCatalystSidebarProps {
  noteId: string;
  // Optional content lists to support toggling
  noteHeadings?: Array<{ id: string; text: string; onClick: () => void }>;
  questionLinks?: Array<{ id: string; text: string; onClick: () => void }>;
}

export const InsightCatalystSidebar = ({ noteId, noteHeadings = [], questionLinks = [] }: InsightCatalystSidebarProps) => {
  const [catalysts, setCatalysts] = useState<InsightCatalyst[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incats' | 'contents'>('incats');

  useEffect(() => {
    const fetchCatalysts = async () => {
      try {
        const data = await getCatalystsForNote(noteId);
        setCatalysts(data);
      } catch {
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
    } catch {
      console.warn('Cannot create catalyst: endpoint not available yet');
    }
  };

  const hasNoteHeadings = noteHeadings.length > 0;
  const hasQuestionLinks = questionLinks.length > 0;

  if (isLoading) {
    return <div className={styles.sidebar}>Loading...</div>;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'incats' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('incats')}
            type="button"
          >
            InCats
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'contents' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('contents')}
            type="button"
          >
            Contents
          </button>
        </div>
        {activeTab === 'incats' && (
          <button 
            className={styles.createButton}
            onClick={handleCreateCatalyst}
            type="button"
          >
            <FiPlus style={{ marginRight: '0.5rem' }} />
            Create New
          </button>
        )}
      </div>

      {activeTab === 'incats' ? (
        <div className={styles.catalystList}>
          {catalysts.length > 0 ? (
            catalysts.map(catalyst => (
              <InsightCatalystDisplay key={catalyst.id} catalyst={catalyst} />
            ))
          ) : (
            <p className={styles.emptyMessage}>No insight catalysts for this note yet.</p>
          )}
        </div>
      ) : (
        <div className={styles.contentsList}>
          {(hasNoteHeadings || hasQuestionLinks) ? (
            <>
              {hasNoteHeadings && (
                <div className={styles.contentsSection}>
                  <div className={styles.contentsTitle}>Sections</div>
                  <ul className={styles.linkList}>
                    {noteHeadings.map(h => (
                      <li key={h.id}>
                        <button className={styles.linkButton} onClick={h.onClick} type="button">
                          {h.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hasQuestionLinks && (
                <div className={styles.contentsSection}>
                  <div className={styles.contentsTitle}>Questions</div>
                  <ul className={styles.linkList}>
                    {questionLinks.map(q => (
                      <li key={q.id}>
                        <button className={styles.linkButton} onClick={q.onClick} type="button">
                          {q.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className={styles.emptyMessage}>No contents to show.</p>
          )}
        </div>
      )}
    </div>
  );
}; 