import React from 'react';
import type { Note, NoteBlock } from '../../types/note.types';
import styles from './NoteViewer.module.css';

interface NoteViewerProps {
  note: Note;
  content: NoteBlock[];
}

export const NoteViewer: React.FC<NoteViewerProps> = ({ note, content }) => {
  return (
    <div className={styles.viewerContainer}>
      <h1 className={styles.title}>{note.title}</h1>
      <div className={styles.metadata}>
        <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
        {note.wordCount && <span>Words: {note.wordCount}</span>}
        {note.readingTime && <span>Reading Time: {note.readingTime} min</span>}
      </div>
      <div className={styles.content}>
        {content.map((block, index) => {
          if (block.type === 'insightCatalyst') {
            return (
              <div key={block.id || index} className={styles.catalyst}>
                <span className={styles.catalystType}>{block.props.type}</span>
                <p>{block.content}</p>
                {block.props.metadata?.tags && (
                  <div className={styles.tags}>
                    {block.props.metadata.tags.map((tag: string) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <div key={block.id || index} className={styles.block}>
              {block.type === 'paragraph' && (
                <p>{block.content}</p>
              )}
              {block.type === 'heading' && (
                <h2>{block.content}</h2>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 