import apiClient from './apiClient';
import type { Note, CreateNoteData, UpdateNoteData } from '../types/note.types';

// Get all notes for a folder
export const getNotesForFolder = async (folderId: string): Promise<Note[]> => {
  try {
    console.log('📝 [noteService] Fetching notes for folder:', folderId);
    const response = await apiClient.get<Note[]>(`/notes?folderId=${folderId}`);
    console.log('📝 [noteService] Notes API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('📝 [noteService] Failed to fetch notes for folder:', error);
    return [];
  }
};

// Get a specific note by ID
export const getNote = async (noteId: string): Promise<Note> => {
  try {
    const response = await apiClient.get(`/notes/${noteId}`);
    const note = response.data as Note;
    console.log('noteService - Raw note data:', note);

    // Prefer contentBlocks from backend; do not attempt to coerce HTML into blocks here
    return note;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (note: CreateNoteData): Promise<Note> => {
  try {
    // Send new request shape; keep legacy content if provided
    const payload: any = {
      title: note.title,
      contentBlocks: note.contentBlocks,
      folderId: note.folderId,
    };
    if (note.questionSetId !== undefined) payload.questionSetId = note.questionSetId;
    if (note.content) payload.content = note.content; // legacy HTML (optional)

    const response = await apiClient.post('/notes', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (noteId: string, updates: UpdateNoteData): Promise<Note> => {
  // Build preferred payload using contentBlocks
  const payload: any = {
    title: updates.title,
    contentBlocks: updates.contentBlocks,
    folderId: updates.folderId,
  };
  if (updates.questionSetId !== undefined) payload.questionSetId = updates.questionSetId;
  // If legacy HTML provided, keep it for migration support
  if (typeof updates.content === 'string') payload.content = updates.content;
  if (updates.plainText !== undefined) payload.plainText = updates.plainText;

  const response = await apiClient.put(`/notes/${noteId}`, payload);
  return response.data;
};

// Delete a note
export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await apiClient.delete(`/notes/${noteId}`);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};