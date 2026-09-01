import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '../common/Button';

export function PwaUpdateBanner() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // Only in browser environment where service worker is available
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      import('virtual:pwa-register')
        .then(({ registerSW }) => {
          const update = registerSW({
            onNeedRefresh() {
              setNeedRefresh(true);
            },
            onOfflineReady() {
              // App ready to work offline
            },
          });
          setUpdateSW(() => update);
        })
        .catch(() => {
          // Ignore when PWA plugin virtual module is not active during tests
        });
    }
  }, []);

  if (!needRefresh) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-surface border border-accent/40 shadow-xl rounded-xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Nova versão disponível</p>
          <p className="text-xs text-ink-muted">Atualize para obter as melhorias mais recentes.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            if (updateSW) {
              updateSW().then(() => window.location.reload());
            } else {
              window.location.reload();
            }
          }}
        >
          Atualizar
        </Button>
        <button
          type="button"
          aria-label="Dispensar aviso de atualização"
          onClick={() => setNeedRefresh(false)}
          className="p-1 rounded-md text-ink-muted hover:text-ink"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
