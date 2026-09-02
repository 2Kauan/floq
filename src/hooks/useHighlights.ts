import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function useHighlights(bookId?: string) {
  const highlights = useLiveQuery(
    async () => {
      let list = bookId
        ? await db.highlights.where('bookId').equals(bookId).toArray()
        : await db.highlights.toArray();

      return list.sort((a, b) => {
        const hasOrderA = typeof a.order === 'number';
        const hasOrderB = typeof b.order === 'number';

        if (hasOrderA && hasOrderB) {
          return (a.order as number) - (b.order as number);
        }
        if (hasOrderA) return -1;
        if (hasOrderB) return 1;

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
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
