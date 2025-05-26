export interface Folder {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateFolderData {
  name: string;
  description?: string;
}
