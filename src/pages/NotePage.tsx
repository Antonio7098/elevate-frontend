import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styles from './NotePage.module.css';

// Import actual components
import { InsightCatalystSidebar } from '../components/notes/InsightCatalystSidebar';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { NoteEditor } from '../components/notes/NoteEditor';
import { NoteViewer } from '../components/notes/NoteViewer';
import LoadingText from '../components/LoadingText';

// Import services and types (assuming they exist)
import { getNote, updateNote } from '../services/noteService';
import type { Note, UpdateNoteData } from '../types/note.types';
import { type CustomBlock, type FullCustomBlock } from "../lib/blocknote/schema";

const NotePage: React.FC = () => {
  console.log('NotePage rendered');
  const { noteId } = useParams<{ noteId: string }>();
  
  const [isIncatsVisible, setIncatsVisible] = useState(true);
  const [isChatVisible, setChatVisible] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(320);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(320);
  const isDraggingLeftRef = useRef(false);
  const isDraggingRightRef = useRef(false);
  
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState<(CustomBlock | FullCustomBlock)[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeToBlocks = (fetched: Note): (CustomBlock | FullCustomBlock)[] => {
    // Prefer structured blocks if available
    if (Array.isArray((fetched as any).contentBlocks)) {
      return (fetched as any).contentBlocks as (CustomBlock | FullCustomBlock)[];
    }
    // Legacy: backend might return content as blocks array under content
    const legacyContent = (fetched as any).content;
    if (Array.isArray(legacyContent)) return legacyContent as (CustomBlock | FullCustomBlock)[];
    // If legacy HTML string or anything else, provide a default block to avoid BlockNote error
    return [
      {
        id: 'default-block',
        type: 'paragraph',
        content: [
          { type: 'text', text: '', styles: {} }
        ],
        props: {}
      } as FullCustomBlock
    ];
  };

  const blocksToPlainText = (blocks: (CustomBlock | FullCustomBlock)[]): string => {
    const inlineText = (block: any): string => {
      const selfText = Array.isArray(block.content)
        ? block.content
            .filter((n: any) => n && typeof n === 'object')
            .map((n: any) => (n.type === 'text' && typeof n.text === 'string' ? n.text : ''))
            .join('')
        : '';
      const childrenText = Array.isArray(block.children)
        ? block.children.map((child: any) => inlineText(child)).filter(Boolean).join('\n')
        : '';
      return [selfText, childrenText].filter(Boolean).join('\n');
    };

    return blocks
      .map((b) => inlineText(b))
      .filter(Boolean)
      .join('\n\n')
      .trim();
  };

  useEffect(() => {
    console.log(`[NotePage Effect] Note ID: ${noteId}`);
    if (!noteId || noteId === 'new') {
        setIsEditMode(true);
        setIsLoading(false);
        setNote({ id: 'new', title: 'Untitled Note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Note);
        setContent([]);
        return;
    }

    // Guard: avoid calling backend with mock-style ids like 'note-1'
    const isLikelyMockId = /^note-\d+$/i.test(noteId);
    if (isLikelyMockId) {
      setIsLoading(false);
      setError('This looks like a mock note id (note-1). Please open a real note from the list.');
      return;
    }

    const fetchNote = async () => {
      console.log(`[NotePage] Fetching note with ID: ${noteId}`);
      try {
        setIsLoading(true);
        const fetchedNote = await getNote(noteId);
        console.log('[NotePage] Note fetched successfully:', fetchedNote);
        setNote(fetchedNote);
        // Normalize to BlockNote blocks for editor/viewer
        setContent(normalizeToBlocks(fetchedNote));
        setError(null);
      } catch (err) {
        setError('Failed to fetch note.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleContentChange = (newContent: FullCustomBlock[]) => {
    console.log('[NotePage] Content changed:', newContent);
    setContent(newContent);
  };

  const handleSaveChanges = async () => {
    console.log('[NotePage] Initiating save changes...');
    if (!note) return;

    try {
      // Handle creating a new note vs. updating an existing one
      if (note.id === 'new') {
        // TODO: Implement create note functionality.
        // This will require selecting a folder, which is not yet implemented in the UI.
        setError('Creating new notes is not yet supported from this page. Please create notes from a folder.');
        console.error('Save new note not implemented: folderId is missing.');
        return;
      }

      // For existing notes, prepare the update data
      const updates: UpdateNoteData = {
        title: note.title,
        contentBlocks: content,
        folderId: note.folderId,
        questionSetId: (note as any).questionSetId ?? undefined,
        plainText: blocksToPlainText(content),
      };

      await updateNote(note.id, updates);
      console.log('[NotePage] Note updated successfully.');
      setIsEditMode(false);
      setError(null); // Clear error on successful save
    } catch (err) {
      setError('Failed to save changes.');
      console.error('Failed to save note:', err);
    }
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingLeftRef.current) {
      // Calculate new width for left panel based on mouse position relative to container
      const container = document.getElementById('note-panels-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newWidth = Math.max(200, Math.min(e.clientX - rect.left, 600));
      setLeftPanelWidth(newWidth);
    } else if (isDraggingRightRef.current) {
      const container = document.getElementById('note-panels-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const fromRight = rect.right - e.clientX;
      const newWidth = Math.max(200, Math.min(fromRight, 600));
      setRightPanelWidth(newWidth);
    }
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingLeftRef.current = false;
    isDraggingRightRef.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const startDragLeft = () => {
    isDraggingLeftRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const startDragRight = () => {
    isDraggingRightRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  if (isLoading) {
    return <div><LoadingText /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const currentNoteId = noteId || 'new';

  return (
    <div className={styles.notePageContainer}>
        <div id="note-panels-container" className={styles.panelsContainer}>
            {isIncatsVisible ? (
              <div className={styles.sidePanel} style={{ width: leftPanelWidth }}>
                <button
                  className={`${styles.panelIconButton} ${styles.collapseLeft}`}
                  onClick={() => setIncatsVisible(false)}
                  aria-label="Hide insight catalysts"
                >
                  ◀
                </button>
                <InsightCatalystSidebar noteId={currentNoteId} />
              </div>
            ) : (
              <button
                className={`${styles.expandButton} ${styles.expandLeftTop}`}
                onClick={() => setIncatsVisible(true)}
                aria-label="Show insight catalysts"
              >
                InCats
              </button>
            )}

            {isIncatsVisible && (
              <div className={`${styles.resizer} ${styles.resizerLeft}`}
                   onMouseDown={startDragLeft}
                   role="separator"
                   aria-orientation="vertical"
                   aria-label="Resize insight catalysts panel"/>
            )}

            <div className={styles.notePanel}>
              <div className={styles.panelControls}>
                <button
                  className={styles.miniButton}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? 'View' : 'Edit'}
                </button>
                {isEditMode && (
                  <button className={styles.miniButton} onClick={handleSaveChanges}>Save</button>
                )}
              </div>
              {isEditMode ? (
                <NoteEditor 
                  initialContent={content}
                  onContentChange={handleContentChange}
                  editable={true}
                />
              ) : note ? (
                <NoteViewer note={note} content={content} />
              ) : (
                <div>Select or create a note to view.</div>
              )}
            </div>

            {isChatVisible && (
              <div className={`${styles.resizer} ${styles.resizerRight}`}
                   onMouseDown={startDragRight}
                   role="separator"
                   aria-orientation="vertical"
                   aria-label="Resize chat panel"/>
            )}

            {isChatVisible ? (
              <div className={styles.sidePanel} style={{ width: rightPanelWidth }}>
                <button
                  className={`${styles.panelIconButton} ${styles.collapseRight}`}
                  onClick={() => setChatVisible(false)}
                  aria-label="Hide chat"
                >
                  ▶
                </button>
                <ChatSidebar noteId={currentNoteId} />
              </div>
            ) : (
              <button
                className={`${styles.expandButton} ${styles.expandRightTop}`}
                onClick={() => setChatVisible(true)}
                aria-label="Show chat"
              >
                Chat
              </button>
            )}
        </div>
    </div>
  );
};

export default NotePage;
