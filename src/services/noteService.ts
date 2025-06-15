import apiClient from './apiClient';
import type { Note } from '../types/note';

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
    const note = response.data;
    console.log('noteService - Raw note data:', note);
    
    // Handle content structure
    let content = [];
    if (note.content) {
      if (Array.isArray(note.content)) {
        content = note.content;
      } else if (typeof note.content === 'object' && note.content.blocks) {
        content = note.content.blocks;
      }
    }
    
    return {
      ...note,
      content
    };
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (note: Partial<Note>): Promise<Note> => {
  try {
    const response = await apiClient.post('/notes', note);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<Note> => {
  try {
    const response = await apiClient.put(`/notes/${noteId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
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