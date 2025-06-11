import { apiClient } from './apiClient';
import type { Note, CreateNoteData, UpdateNoteData } from '../types/note';

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
export const getNoteById = async (noteId: string): Promise<Note> => {
  console.log('📝 [noteService] Making API call to get note:', noteId);
  try {
    const response = await apiClient.get<Note>(`/notes/${noteId}`);
    console.log('📝 [noteService] Note API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('📝 [noteService] Error fetching note:', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await apiClient.post<Note>('/notes', noteData);
  return response.data;
};

// Update an existing note
export const updateNote = async (noteId: string, noteData: UpdateNoteData): Promise<Note> => {
  const response = await apiClient.put<Note>(`/notes/${noteId}`, noteData);
  return response.data;
};

// Delete a note
export const deleteNote = async (noteId: string): Promise<void> => {
  await apiClient.delete(`/notes/${noteId}`);
}; 