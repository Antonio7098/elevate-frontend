import type { Block as BlockNoteBlock } from '@blocknote/core';

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

export interface CustomBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'quote' | 'codeBlock' | 'bulletListItem' | 'numberedListItem' | 'checkListItem' | 'table' | 'file' | 'image' | 'video' | 'audio';
  content: string;
}

export type NoteBlock = BlockNoteBlock | CatalystBlock;

export interface Note {
  id: string;
  title: string;
  content: NoteBlock[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  folderId?: string;
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