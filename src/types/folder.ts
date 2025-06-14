export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  children: Folder[];
  questionSetCount?: number;
  masteryScore?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPinned?: boolean;
}

export interface CreateFolderData {
  name: string;
  description?: string;
  parentId?: string | null;
}

export interface UpdateFolderData {
  name?: string;
  description?: string;
  parentId?: string | null;
}
