import { db } from '../db/database';
import { AppSettings, ThemeMode } from '../types';

export async function getSettings(): Promise<AppSettings> {
  let settings = await db.settings.get('singleton');
  if (!settings) {
    settings = {
      id: 'singleton',
      theme: 'light',
      lastExportAt: null,
    };
    await db.settings.put(settings);
  }
  return settings;
}

export async function updateTheme(theme: ThemeMode): Promise<void> {
  const current = await getSettings();
  await db.settings.put({
    ...current,
    theme,
  });
}

export async function updateLastExportAt(isoDate: string): Promise<void> {
  const current = await getSettings();
  await db.settings.put({
    ...current,
    lastExportAt: isoDate,
  });
}
