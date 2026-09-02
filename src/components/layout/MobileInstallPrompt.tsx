import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { InstallModal } from '../settings/InstallModal';

export function MobileInstallPrompt() {
  const { isStandalone, isInstallable, promptInstall } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Only show on small screen devices and if not standalone and not dismissed this session
    const hasDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (!isStandalone && !hasDismissed) {
      setIsDismissed(false);
    }
  }, [isStandalone]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await promptInstall();
      if (outcome === 'unsupported') {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (isStandalone || isDismissed) return null;

  return (
    <>
      <div className="md:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-accent/20 px-3 py-2 flex items-center justify-between gap-2 text-xs shadow-xs animate-in fade-in slide-in-from-top-2">
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-2.5 text-left flex-1 min-w-0"
        >
          <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="font-semibold text-ink text-[12px]">Instalar FLOQT no celular</p>
            <p className="text-[10px] text-ink-muted truncate">Acesso rápido na tela inicial e 100% offline</p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleClick}
            className="px-2.5 py-1 bg-accent text-white font-medium text-[11px] rounded-md shadow-2xs hover:bg-accent-hover transition-colors flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Instalar</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Fechar aviso"
            className="p-1 text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <InstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
