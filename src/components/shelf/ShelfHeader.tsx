import { Search, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ShelfHeaderProps {
  totalBooks: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ShelfHeader({
  totalBooks,
  searchQuery,
  onSearchChange,
}: ShelfHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
            Minha Estante
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            {totalBooks === 0
              ? 'Nenhum livro ainda'
              : totalBooks === 1
              ? '1 livro na coleção'
              : `${totalBooks} livros na coleção`}
          </p>
        </div>

        {/* Mobile Add Book Button */}
        <Link
          to="/books/new"
          className="md:hidden flex items-center gap-1.5 px-3.5 py-2 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-hover shadow-sm"
          aria-label="Adicionar novo livro"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Livro</span>
        </Link>
      </div>

      {/* Quick Shelf Search */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar por título, autor ou tag na estante..."
          className="w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Limpar pesquisa"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
