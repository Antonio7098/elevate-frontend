
import { useBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/style.css';
import '@blocknote/mantine/style.css';
import type { BlockSchemaFromSpecs } from '@blocknote/core';

import type { Note } from '../../types/note.types';
import { type CustomBlock, type FullCustomBlock, schema, customBlockSpecs } from '../../lib/blocknote/schema';
import styles from './NoteViewer.module.css';

interface NoteViewerProps {
  note: Note;
  content: (CustomBlock | FullCustomBlock)[];
}

export const NoteViewer = ({ note, content }: NoteViewerProps) => {
  const editor = useBlockNote<BlockSchemaFromSpecs<typeof customBlockSpecs>>({
    initialContent: content,
    schema,
  });

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
        <BlockNoteView editor={editor} editable={false} />
      </div>
    </div>
  );
}; 