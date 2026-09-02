import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Quote, Search, Settings, Plus, Feather, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { useBooks } from '../../hooks/useBooks';
import { useHighlights } from '../../hooks/useHighlights';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { InstallModal } from '../settings/InstallModal';

export function DesktopSidebar() {
  const { books } = useBooks();
  const { highlights } = useHighlights();
  const { isStandalone, isInstallable, promptInstall } = usePwaInstall();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const navItems = [
    { label: 'Mural', icon: Quote, path: '/mural' },
    { label: 'Estante', icon: BookOpen, path: '/' },
    { label: 'Buscar', icon: Search, path: '/search' },
    { label: 'Ajustes', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0 shrink-0 p-6 z-30 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shadow-sm">
          <Feather className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-wider">
            FLOQT
          </h1>
          <p className="text-[11px] text-ink-muted">Biblioteca de destaques</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <NavLink
        to="/books/new"
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover shadow-sm transition-all duration-150 mb-6"
      >
        <Plus className="w-4 h-4" />
        <span>Adicionar Livro</span>
      </NavLink>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-1.5 flex-1" role="navigation" aria-label="Menu Lateral">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-ink-muted hover:text-ink hover:bg-bg/80'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Library Stats & Install CTA */}
      <div className="pt-4 border-t border-border mt-auto space-y-3">
        {!isStandalone && (
          <button
            type="button"
            onClick={async () => {
              if (isInstallable) {
                const res = await promptInstall();
                if (res === 'unsupported') {
                  setIsInstallModalOpen(true);
                }
              } else {
                setIsInstallModalOpen(true);
              }
            }}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-accent/10 hover:bg-accent/15 text-accent border border-accent/20 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar Aplicativo</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-lg bg-bg/60 border border-border">
          <div>
            <div className="text-lg font-serif font-bold text-ink">{books.length}</div>
            <div className="text-[11px] text-ink-muted">{books.length === 1 ? 'Livro' : 'Livros'}</div>
          </div>
          <div>
            <div className="text-lg font-serif font-bold text-ink">{highlights.length}</div>
            <div className="text-[11px] text-ink-muted">{highlights.length === 1 ? 'Frase' : 'Frases'}</div>
          </div>
        </div>
      </div>

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </aside>
  );
}
