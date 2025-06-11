import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import type { Note } from '../../types/note';
import styles from './NoteCard.module.css';

console.log("🟢 [NoteCard] Module loaded");

export function NoteCard({ note }: { note: Note }) {
  console.log('🟢 [NoteCard] Component rendered with note ID:', note.id);
  
  const handleClick = (e: React.MouseEvent) => {
    console.log('📝 [NoteCard] Note clicked:', note.id);
  };

  return (
    <Link 
      to={`/notes/${String(note.id)}`} 
      className={styles.card}
      onClick={handleClick}
    >
      <div className={styles.iconContainer}>
        <FiEdit className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{note.title}</h3>
        <p className={styles.preview}>{note.content.text}</p>
      </div>
    </Link>
  );
} 