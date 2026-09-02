import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../common/Toast';
import { OfflineBanner } from '../common/OfflineBanner';
import { PwaUpdateBanner } from './PwaUpdateBanner';
import { MobileInstallPrompt } from './MobileInstallPrompt';
import { useSettings } from '../../hooks/useSettings';

export function AppLayout() {
  // Activate theme and initialize database
  useSettings();

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileInstallPrompt />
        <OfflineBanner />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <ToastContainer />
      <PwaUpdateBanner />
    </div>
  );
}
