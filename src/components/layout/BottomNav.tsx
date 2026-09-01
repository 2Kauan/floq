import { NavLink } from 'react-router-dom';
import { BookOpen, Quote, Search, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomNav() {
  const navItems = [
    { label: 'Mural', icon: Quote, path: '/mural' },
    { label: 'Estante', icon: BookOpen, path: '/' },
    { label: 'Buscar', icon: Search, path: '/search' },
    { label: 'Ajustes', icon: Settings, path: '/settings' },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Navegação Principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around h-16 px-2 md:hidden safe-area-pb"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors duration-150',
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-ink-muted hover:text-ink'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={clsx(
                    'p-1 rounded-full transition-transform',
                    isActive ? 'scale-110' : ''
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="mt-0.5 text-[11px]">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
