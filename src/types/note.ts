export interface Note {
  id: string | number;
  title: string;
  content: {
    text: string;
  };
  plainText: string;
  folderId: string | number;
  userId: string | number;
  createdAt: string;
  updatedAt: string;
  questionSetId: string | number | null;
}

export interface CreateNoteData {
  title: string;
  content: string;
  folderId: string | number;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  folderId?: string | number;
} 