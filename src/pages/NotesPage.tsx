import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiArrowLeft, FiSave, FiTrash2 } from 'react-icons/fi';
import { getNoteById, createNote, updateNote, deleteNote } from '../services/noteService';
import type { CreateNoteData, UpdateNoteData } from '../types/note';
import styles from './NotesPage.module.css';

const NotesPage = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewNote = noteId === 'new';
  const folderId = searchParams.get('folderId');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch existing note if editing
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => {
      console.log('Fetching note with ID:', noteId);
      return getNoteById(noteId!);
    },
    enabled: !isNewNote && !!noteId,
    retry: false
  });

  // Redirect to dashboard if note is not found
  useEffect(() => {
    console.log('Note loading state:', { isError, isNewNote, noteId, note });
    if (isError && !isNewNote) {
      console.log('Redirecting to dashboard due to error');
      navigate('/');
    }
  }, [isError, isNewNote, navigate, noteId, note]);

  // Set initial values when note is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes', folderId] });
      navigate(`/notes/${newNote.id}`);
    }
  });

  // Update note mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateNoteData) => updateNote(noteId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      queryClient.invalidateQueries({ queryKey: ['notes', folderId] });
    }
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(noteId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', folderId] });
      navigate(`/folders/${folderId}`);
    }
  });

  const handleSave = () => {
    if (!folderId) {
      alert('No folder selected');
      return;
    }

    if (isNewNote) {
      createMutation.mutate({
        title,
        content,
        folderId
      });
    } else {
      updateMutation.mutate({
        title,
        content
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(`/folders/${folderId}`)}
        >
          <FiArrowLeft /> Back to Folder
        </button>
        <div className={styles.actions}>
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <FiSave /> Save
          </button>
          {!isNewNote && (
            <button 
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <FiTrash2 /> Delete
            </button>
          )}
        </div>
      </div>

      <div className={styles.editor}>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className={styles.quillEditor}
        />
      </div>
    </div>
  );
};

export default NotesPage; 