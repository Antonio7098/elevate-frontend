import { type CustomBlock } from '../lib/blocknote/schema';

export type CatalystType = 'question' | 'reflection' | 'connection' | 'action' | 'insight';

export interface CatalystBlock {
  id: string;
  type: 'insightCatalyst';
  content: string;
  props: {
    type: CatalystType;
    text: string;
    metadata: {
      importance: number;
      status: 'active' | 'resolved' | 'archived';
      tags: string[];
    };
  };
}

export interface Note {
  id: string;
  title: string;
  content: CustomBlock[];
  plainText?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  folderId?: string;
  questionSetId?: string | null;
  tags?: string[];
  isArchived?: boolean;
  isPinned?: boolean;
  lastAccessedAt?: string;
  wordCount?: number;
  readingTime?: number;
  summary?: string;
  aiGenerated?: boolean;
  version?: number;
  parentNoteId?: string;
  childNoteIds?: string[];
  collaborators?: string[];
  permissions?: {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
  metadata?: {
    lastCursorPosition?: number;
    lastScrollPosition?: number;
    lastEditSession?: {
      startTime: string;
      endTime: string;
      changes: number;
    };
  };
}

export interface CreateNoteData {
  title: string;
  content: CustomBlock[];
  folderId: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: CustomBlock[];
  folderId?: string;
} 