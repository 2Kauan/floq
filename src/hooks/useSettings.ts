import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase } from '../db/database';
import { AppSettings, ThemeMode } from '../types';
import { updateTheme } from '../services/settingsService';

export function useSettings() {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    initializeDatabase().then(() => setIsInit(true));
  }, []);

  const settings = useLiveQuery(() => db.settings.get('singleton'), [isInit]);

  const currentTheme = settings?.theme || 'system';

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(theme: ThemeMode) {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }

    applyTheme(currentTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  const setTheme = async (theme: ThemeMode) => {
    await updateTheme(theme);
  };

  const defaultSettings: AppSettings = {
    id: 'singleton',
    theme: 'system',
    lastExportAt: null,
  };

  return {
    settings: settings || defaultSettings,
    isLoading: settings === undefined,
    setTheme,
  };
}
