import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function useHighlights(bookId?: string) {
  const highlights = useLiveQuery(
    () => {
      if (bookId) {
        return db.highlights
          .where('bookId')
          .equals(bookId)
          .reverse()
          .sortBy('createdAt');
      }
      return db.highlights.reverse().sortBy('createdAt');
    },
    [bookId]
  );

  return {
    highlights: highlights || [],
    isLoading: highlights === undefined,
    count: (highlights || []).length,
  };
}

export function useHighlightCounts() {
  const counts = useLiveQuery(async () => {
    const allHighlights = await db.highlights.toArray();
    const map = new Map<string, number>();
    for (const h of allHighlights) {
      map.set(h.bookId, (map.get(h.bookId) || 0) + 1);
    }
    return map;
  }, []);

  return counts || new Map<string, number>();
}
