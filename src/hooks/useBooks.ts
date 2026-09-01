import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function useBooks() {
  const books = useLiveQuery(() => db.books.toArray(), []);

  const genres = Array.from(
    new Set(
      (books || [])
        .map((b) => b.genre)
        .filter((g): g is string => Boolean(g && g.trim()))
    )
  ).sort();

  const tags = Array.from(
    new Set(
      (books || []).flatMap((b) => b.tags || []).filter((t) => Boolean(t && t.trim()))
    )
  ).sort();

  return {
    books: books || [],
    isLoading: books === undefined,
    genres,
    tags,
  };
}

export function useBook(id: string | undefined) {
  const book = useLiveQuery(() => (id ? db.books.get(id) : undefined), [id]);

  return {
    book,
    isLoading: id !== undefined && book === undefined,
  };
}
