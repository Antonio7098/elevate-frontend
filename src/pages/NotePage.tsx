import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './NotePage.module.css';

// Import actual components
import { InsightCatalystSidebar } from '../components/notes/InsightCatalystSidebar';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { NoteEditor } from '../components/notes/NoteEditor';
import { NoteViewer } from '../components/notes/NoteViewer';

// Import services and types (assuming they exist)
import { getNote, updateNote } from '../services/noteService';
import type { Note, UpdateNoteData } from '../types/note.types';
import { type CustomBlock, type FullCustomBlock } from "../lib/blocknote/schema";

const NotePage: React.FC = () => {
  console.log('NotePage rendered');
  const { noteId } = useParams<{ noteId: string }>();
  
  const [isIncatsVisible, setIncatsVisible] = useState(true);
  const [isChatVisible, setChatVisible] = useState(true);
  
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState<(CustomBlock | FullCustomBlock)[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`[NotePage Effect] Note ID: ${noteId}`);
    if (!noteId || noteId === 'new') {
        setIsEditMode(true);
        setIsLoading(false);
        setNote({ id: 'new', title: 'Untitled Note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Note);
        setContent([]);
        return;
    }

    const fetchNote = async () => {
      console.log(`[NotePage] Fetching note with ID: ${noteId}`);
      try {
        setIsLoading(true);
        const fetchedNote = await getNote(noteId);
        console.log('[NotePage] Note fetched successfully:', fetchedNote);
        setNote(fetchedNote);
        setContent(fetchedNote.content || []);
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
        content: content,
        folderId: note.folderId,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const currentNoteId = noteId || 'new';

  return (
    <div className={styles.notePageContainer}>
        <div className={styles.toolbar}>
            <div className={styles.leftButtons}>
                <button onClick={() => setIncatsVisible(!isIncatsVisible)} className={styles.toggleButton}>
                    {isIncatsVisible ? 'Hide InCat' : 'Show InCat'}
                </button>
            </div>
            <div className={styles.centerButtons}>
                <button onClick={() => setIsEditMode(!isEditMode)} className={styles.toggleButton}>
                    {isEditMode ? 'View Mode' : 'Edit Mode'}
                </button>
                {isEditMode && <button onClick={handleSaveChanges} className={styles.toggleButton}>Save</button>}
            </div>
            <div className={styles.rightButtons}>
                <button onClick={() => setChatVisible(!isChatVisible)} className={styles.toggleButton}>
                    {isChatVisible ? 'Hide Chat' : 'Show Chat'}
                </button>
            </div>
        </div>

        <div className={styles.panelsContainer}>
            {isIncatsVisible && (
                <div className={styles.sidePanel}>
                    <InsightCatalystSidebar noteId={currentNoteId} />
                </div>
            )}
            
            <div className={styles.notePanel}>
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
                <div className={styles.sidePanel}>
                    <ChatSidebar noteId={currentNoteId} />
                </div>
            )}
        </div>
    </div>
  );
};

export default NotePage;
