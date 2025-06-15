import type { CustomBlock } from '../lib/blocknote/schema';

export interface Note {
  id: string | number;
  title: string;
  content: CustomBlock[];
  plainText: string;
  folderId: string | number;
  userId: string | number;
  createdAt: string;
  updatedAt: string;
  questionSetId: string | number | null;
}

export interface CreateNoteData {
  title: string;
  content: CustomBlock[];
  folderId: string | number;
}

export interface UpdateNoteData {
  title?: string;
  content?: CustomBlock[];
  folderId?: string | number;
} 