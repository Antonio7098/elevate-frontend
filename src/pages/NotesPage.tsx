import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { FiArrowLeft, FiSave, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { getNoteById, createNote, updateNote, deleteNote } from '../services/noteService';
import type { CreateNoteData, UpdateNoteData } from '../types/note';
import styles from './NotesPage.module.css';
import ChatPanel from '../components/ChatPanel';

const NotesPage = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewNote = noteId === 'new';
  const urlFolderId = searchParams.get('folderId');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [effectiveFolderId, setEffectiveFolderId] = useState<string | null>(urlFolderId);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [showChat, setShowChat] = useState(false);

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

  // Update effectiveFolderId when note data is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setOriginalTitle(note.title);
      setOriginalContent(note.content);
      // Use URL folderId if available, otherwise use note's folderId
      setEffectiveFolderId(urlFolderId || (note.folderId ? String(note.folderId) : null));
    }
  }, [note, urlFolderId]);

  // Redirect to dashboard if note is not found
  useEffect(() => {
    console.log('Note loading state:', { isError, isNewNote, noteId, note });
    if (isError && !isNewNote) {
      console.log('Redirecting to dashboard due to error');
      navigate('/');
    }
  }, [isError, isNewNote, navigate, noteId, note]);

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateNoteData) => createNote(data),
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes', effectiveFolderId] });
      navigate(`/notes/${newNote.id}?folderId=${effectiveFolderId}`);
    }
  });

  // Update note mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateNoteData) => updateNote(noteId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
      queryClient.invalidateQueries({ queryKey: ['notes', effectiveFolderId] });
    }
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(noteId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', effectiveFolderId] });
      navigate(`/folders/${effectiveFolderId}`);
    }
  });

  const handleSave = () => {
    if (!effectiveFolderId) {
      alert('No folder selected');
      return;
    }

    if (isNewNote) {
      createMutation.mutate({
        title,
        content,
        folderId: effectiveFolderId
      });
    } else {
      const updatePayload: any = {};
      if (title && title.trim() !== '') updatePayload.title = title;
      if (content && content.trim() !== '') updatePayload.content = content;
      updatePayload.folderId = effectiveFolderId;
      updateMutation.mutate(updatePayload, {
        onSuccess: () => {
          setIsEditMode(false);
          setOriginalTitle(title);
          setOriginalContent(content);
        }
      });
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setTitle(originalTitle);
    setContent(originalContent);
    setIsEditMode(false);
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
    <div className={styles.containerWithChat}>
      <div className={styles.rightSidebar}>
        <button
          className={styles.toggleChatBtn}
          onClick={() => setShowChat((prev) => !prev)}
          title={showChat ? 'Hide Chat' : 'Show Chat'}
        >
          <FiMessageSquare /> {showChat ? 'Hide Chat' : 'Chat'}
        </button>
        {showChat && (
          <div className={styles.chatPanelWrapper}>
            <ChatPanel />
          </div>
        )}
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(`/folders/${effectiveFolderId}`)}
          >
            <FiArrowLeft /> Back to Folder
          </button>
          <div className={styles.actions}>
            {isEditMode ? (
              <>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <FiSave /> Save
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={handleCancel}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {!isNewNote && (
                  <button 
                    className={styles.saveButton}
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
                {!isNewNote && (
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    <FiTrash2 /> Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.editor}>
          {isEditMode ? (
            <>
              <input
                type="text"
                className={styles.titleInput}
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <ReactQuill
                theme="bubble"
                value={content}
                onChange={setContent}
                className={styles.quillEditor}
              />
            </>
          ) : (
            <>
              <h1 className={styles.titleInput} style={{ border: 'none', fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h1>
              <ReactQuill
                theme="bubble"
                value={content}
                readOnly
                className={styles.quillEditor}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage; 