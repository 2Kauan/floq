import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Quote, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { useHighlights } from '../hooks/useHighlights';
import { useCoverImage } from '../hooks/useCoverImage';
import { CoverPlaceholder } from '../components/shelf/CoverPlaceholder';
import { HighlightExpandedModal } from '../components/highlights/HighlightExpandedModal';
import { Book, Highlight } from '../types';

function BookResultItem({ book, highlightCount }: { book: Book; highlightCount: number }) {
  const navigate = useNavigate();
  const { coverUrl } = useCoverImage(book.coverId);

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="p-3.5 bg-surface border border-border rounded-xl shadow-2xs hover:shadow-md hover:border-accent/40 transition-all cursor-pointer flex items-center gap-4"
    >
      <div className="w-12 aspect-2/3 shrink-0 rounded-sm overflow-hidden bg-bg">
        {coverUrl ? (
          <img src={coverUrl} alt={`Capa de ${book.title}`} className="w-full h-full object-cover" />
        ) : (
          <CoverPlaceholder title={book.title} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-serif font-semibold text-ink line-clamp-1">{book.title}</h4>
        {book.author && <p className="text-xs text-ink-muted line-clamp-1 mt-0.5">{book.author}</p>}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-accent font-medium">
            {highlightCount} {highlightCount === 1 ? 'destaque' : 'destaques'}
          </span>
          {book.genre && (
            <span className="text-[10px] bg-bg border border-border text-ink-muted px-2 py-0.5 rounded-full">
              {book.genre}
            </span>
          )}
        </div>
      </div>

      <ArrowRight className="w-4 h-4 text-ink-muted shrink-0" />
    </div>
  );
}

export function GlobalSearchPage() {
  const [query, setQuery] = useState('');
  const { books, tags: allTags } = useBooks();
  const { highlights } = useHighlights();

  const [expandedHighlight, setExpandedHighlight] = useState<Highlight | null>(null);

  // Search matching
  const { matchedBooks, matchedHighlights } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      return { matchedBooks: [], matchedHighlights: [] };
    }

    const bResults = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q))) ||
        (b.genre && b.genre.toLowerCase().includes(q))
    );

    const hResults = highlights.filter(
      (h) =>
        h.text.toLowerCase().includes(q) ||
        (h.comment && h.comment.toLowerCase().includes(q)) ||
        (h.tags && h.tags.some((t) => t.toLowerCase().includes(q)))
    );

    return { matchedBooks: bResults, matchedHighlights: hResults };
  }, [query, books, highlights]);

  const bookMap = useMemo(() => {
    const map = new Map<string, Book>();
    for (const b of books) {
      map.set(b.id, b);
    }
    return map;
  }, [books]);

  const highlightCountsByBook = useMemo(() => {
    const map = new Map<string, number>();
    for (const h of highlights) {
      map.set(h.bookId, (map.get(h.bookId) || 0) + 1);
    }
    return map;
  }, [highlights]);

  const isQueryTooShort = query.trim().length > 0 && query.trim().length < 2;
  const hasSearched = query.trim().length >= 2;
  const hasNoResults = hasSearched && matchedBooks.length === 0 && matchedHighlights.length === 0;

  return (
    <div className="max-w-3xl mx-auto flex flex-col space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
          Buscar na Biblioteca
        </h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Pesquise através de livros, autores, frases marcadas e reflexões.
        </p>
      </div>

      {/* Global Search Input */}
      <div className="relative w-full">
        <Search className="w-5 h-5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite um título, autor, frase ou #tag..."
          autoFocus
          className="w-full bg-surface border border-border rounded-xl pl-12 pr-11 py-3 text-sm text-ink placeholder:text-ink-muted/70 outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-sm transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Limpar pesquisa"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isQueryTooShort && (
        <p className="text-xs text-ink-muted text-center py-2">
          Digite pelo menos 2 caracteres para pesquisar.
        </p>
      )}

      {/* Tag Suggestions when query is empty */}
      {!query && allTags.length > 0 && (
        <div className="p-5 bg-surface border border-border rounded-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5 text-accent" />
            <span>Tags populares</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="text-xs px-3 py-1.5 rounded-full bg-bg border border-border text-ink hover:border-accent hover:text-accent transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results state */}
      {hasNoResults && (
        <div className="p-8 bg-surface border border-border rounded-xl text-center">
          <p className="text-base font-serif font-semibold text-ink mb-1">
            Nenhum resultado para "{query}"
          </p>
          <p className="text-xs text-ink-muted">
            Tente buscar por outras palavras-chave ou termos mais curtos.
          </p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !hasNoResults && (
        <div className="space-y-8">
          {/* Books Group */}
          {matchedBooks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <h3 className="text-base font-serif font-bold text-ink">
                  Livros ({matchedBooks.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedBooks.map((book) => (
                  <BookResultItem
                    key={book.id}
                    book={book}
                    highlightCount={highlightCountsByBook.get(book.id) || 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Highlights Group */}
          {matchedHighlights.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-accent" />
                <h3 className="text-base font-serif font-bold text-ink">
                  Destaques Literários ({matchedHighlights.length})
                </h3>
              </div>

              <div className="space-y-3">
                {matchedHighlights.map((h) => {
                  const parentBook = bookMap.get(h.bookId);
                  return (
                    <article
                      key={h.id}
                      onClick={() => setExpandedHighlight(h)}
                      className="p-4 bg-surface border border-border rounded-xl shadow-2xs hover:shadow-md hover:border-accent/40 transition-all cursor-pointer"
                    >
                      {parentBook && (
                        <div className="text-xs text-ink-muted mb-2 flex items-center justify-between">
                          <span className="font-semibold text-accent line-clamp-1">
                            {parentBook.title}
                          </span>
                          {h.page && <span>pág. {h.page}</span>}
                        </div>
                      )}

                      <blockquote className="text-sm font-serif italic text-ink leading-relaxed line-clamp-3 mb-2">
                        “{h.text}”
                      </blockquote>

                      {h.comment && (
                        <p className="text-xs text-ink-muted line-clamp-1 bg-bg/50 p-2 rounded">
                          <strong className="text-ink font-sans">Nota: </strong>
                          {h.comment}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded Modal for matching highlight */}
      <HighlightExpandedModal
        isOpen={Boolean(expandedHighlight)}
        highlight={expandedHighlight}
        book={expandedHighlight ? bookMap.get(expandedHighlight.bookId) : null}
        onClose={() => setExpandedHighlight(null)}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
