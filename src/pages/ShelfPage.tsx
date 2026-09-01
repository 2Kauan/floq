import { useState, useMemo } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useHighlightCounts } from '../hooks/useHighlights';
import { BookCard } from '../components/shelf/BookCard';
import { ShelfHeader } from '../components/shelf/ShelfHeader';
import { FilterBar } from '../components/shelf/FilterBar';
import { BookCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { BookOpen, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShelfFilters } from '../types';

export function ShelfPage() {
  const navigate = useNavigate();
  const { books, isLoading, genres, tags } = useBooks();
  const highlightCounts = useHighlightCounts();

  const [filters, setFilters] = useState<ShelfFilters>({
    searchQuery: '',
    selectedGenre: null,
    selectedTag: null,
    sortBy: 'recent',
  });

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (filters.selectedGenre) {
      result = result.filter(
        (b) => b.genre && b.genre.toLowerCase() === filters.selectedGenre?.toLowerCase()
      );
    }

    // Tag filter
    if (filters.selectedTag) {
      result = result.filter((b) =>
        b.tags.some((t) => t.toLowerCase() === filters.selectedTag?.toLowerCase())
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title_asc':
          return a.title.localeCompare(b.title, 'pt-BR');
        case 'author_asc':
          return (a.author || '').localeCompare(b.author || '', 'pt-BR');
        case 'highlights_desc': {
          const countA = highlightCounts.get(a.id) || 0;
          const countB = highlightCounts.get(b.id) || 0;
          return countB - countA;
        }
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [books, filters, highlightCounts]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="h-8 w-40 bg-ink/10 rounded-md mb-6 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Zero-state: no books created yet
  if (books.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="Sua estante está vazia"
          description="Adicione seu primeiro livro e comece a colecionar os trechos, frases e marginálias que te marcaram."
          actionLabel="Adicionar primeiro livro"
          onAction={() => navigate('/books/new')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ShelfHeader
        totalBooks={books.length}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
      />

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        availableGenres={genres}
        availableTags={tags}
      />

      {filteredAndSortedBooks.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={<SearchX className="w-8 h-8" />}
            title="Nenhum livro encontrado"
            description="Não encontramos nenhum livro com os filtros ou termo de busca aplicado."
            actionLabel="Limpar filtros"
            onAction={() =>
              setFilters({
                searchQuery: '',
                selectedGenre: null,
                selectedTag: null,
                sortBy: 'recent',
              })
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredAndSortedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              highlightCount={highlightCounts.get(book.id) || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
