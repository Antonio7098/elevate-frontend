export type CatalystType = 'question' | 'reflection' | 'connection' | 'action' | 'insight';

export interface InsightCatalyst {
  id: string;
  noteId: string;
  type: CatalystType;
  text: string;
  createdAt: string;
  updatedAt: string;
  position?: number; // For ordering in the note
  metadata?: {
    aiGenerated?: boolean;
    tags?: string[];
    relatedCatalysts?: string[]; // IDs of related catalysts
    importance?: number; // 0-1 scale
    status?: 'active' | 'resolved' | 'archived';
  };
} 