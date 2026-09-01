import { ArrowUpDown, Filter, X } from 'lucide-react';
import { ShelfFilters, ShelfSortOption } from '../../types';

export interface FilterBarProps {
  filters: ShelfFilters;
  onFilterChange: (filters: ShelfFilters) => void;
  availableGenres: string[];
  availableTags: string[];
}

export function FilterBar({
  filters,
  onFilterChange,
  availableGenres,
  availableTags,
}: FilterBarProps) {
  const sortOptions: { value: ShelfSortOption; label: string }[] = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'title_asc', label: 'Título A-Z' },
    { value: 'highlights_desc', label: 'Mais destaques' },
    { value: 'author_asc', label: 'Autor A-Z' },
  ];

  const activeFiltersCount =
    (filters.selectedGenre ? 1 : 0) +
    (filters.selectedTag ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const clearFilters = () => {
    onFilterChange({
      ...filters,
      searchQuery: '',
      selectedGenre: null,
      selectedTag: null,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 border-b border-border mb-6">
      {/* Scrollable Filters */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted shrink-0 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-accent" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {/* Genre Selector */}
        {availableGenres.length > 0 && (
          <select
            value={filters.selectedGenre || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                selectedGenre: e.target.value || null,
              })
            }
            aria-label="Filtrar por gênero literário"
            className="text-xs bg-surface border border-border text-ink rounded-lg px-2.5 py-1.5 outline-none focus:border-accent cursor-pointer shrink-0"
          >
            <option value="">Todos os Gêneros</option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        )}

        {/* Tag Selector */}
        {availableTags.length > 0 && (
          <select
            value={filters.selectedTag || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                selectedTag: e.target.value || null,
              })
            }
            aria-label="Filtrar por tag"
            className="text-xs bg-surface border border-border text-ink rounded-lg px-2.5 py-1.5 outline-none focus:border-accent cursor-pointer shrink-0"
          >
            <option value="">Todas as Tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        )}

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors shrink-0"
          >
            <X className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-ink-muted" />
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortBy: e.target.value as ShelfSortOption,
            })
          }
          aria-label="Ordenar estante"
          className="text-xs bg-surface border border-border text-ink rounded-lg px-2.5 py-1.5 outline-none focus:border-accent cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
