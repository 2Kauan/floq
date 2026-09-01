import Dexie, { Table } from 'dexie';
import { Book, Highlight, CoverImage, AppSettings } from '../types';

export class MarginaliaDatabase extends Dexie {
  books!: Table<Book, string>;
  highlights!: Table<Highlight, string>;
  coverImages!: Table<CoverImage, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('marginaliaDB');
    this.version(1).stores({
      books: 'id, title, author, createdAt, *tags',
      highlights: 'id, bookId, createdAt, [bookId+createdAt], *tags',
      coverImages: 'id',
      settings: 'id',
    });
  }
}

export const db = new MarginaliaDatabase();

// Initialize singleton settings if absent
export async function initializeDatabase(): Promise<void> {
  const existingSettings = await db.settings.get('singleton');
  if (!existingSettings) {
    await db.settings.put({
      id: 'singleton',
      theme: 'light',
      lastExportAt: null,
    });
  }
}
