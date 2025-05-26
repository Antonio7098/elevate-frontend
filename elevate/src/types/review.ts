export interface ReviewItem {
  id: string;
  question: string;
  answer: string;
  dueDate: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  folderId: string;
}
