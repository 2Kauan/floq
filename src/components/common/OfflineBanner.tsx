import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="w-full bg-border/80 border-b border-border text-ink-muted text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 backdrop-blur-xs"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>Você está sem conexão. Busca automática de capas não disponível, mas seus livros e destaques continuam salvos e acessíveis.</span>
    </div>
  );
}
