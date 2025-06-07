export interface Folder {
  id: string;
  name: string;
  description?: string;
  questionSetCount?: number;
  masteryScore?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateFolderData {
  name: string;
  description?: string;
}

export interface UpdateFolderData {
  name?: string;
  description?: string;
}
