export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string | null;
  year: number | null;
  tags: string[];
  coverId: string | null;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface Highlight {
  id: string;
  bookId: string;
  text: string;
  page: number | null;
  comment: string | null;
  tags: string[];
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface CoverImage {
  id: string;
  blob: Blob;
  mimeType: string;
  originalSource: 'upload' | 'api' | 'camera';
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  id: 'singleton';
  theme: ThemeMode;
  lastExportAt: string | null; // ISO8601
}

export type ShelfSortOption = 'recent' | 'title_asc' | 'highlights_desc' | 'author_asc';

export interface ShelfFilters {
  searchQuery: string;
  selectedGenre: string | null;
  selectedTag: string | null;
  sortBy: ShelfSortOption;
}

export interface ExportBookData extends Omit<Book, 'coverId'> {
  coverFilename: string | null;
  coverBase64?: string | null;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  books: ExportBookData[];
  highlights: Highlight[];
  settings?: AppSettings;
  covers?: Record<string, string>;
}

export type ConflictResolutionOption = 'merge' | 'replace' | 'skip';

export interface BookConflict {
  incomingBook: ExportBookData;
  existingBook: Book;
  incomingHighlights: Highlight[];
  resolution: ConflictResolutionOption;
}

export interface ImportPreviewData {
  totalBooks: number;
  totalHighlights: number;
  newBooks: ExportBookData[];
  newHighlights: Highlight[];
  conflicts: BookConflict[];
  coverBlobs: Map<string, Blob>;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
