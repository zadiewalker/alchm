import { doc, deleteDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { deleteAccount as deleteAccountFromAuthService } from '@/services/auth/authService';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { getStorageItemWithFallback, removeStorageItemNormalized, setStorageItemNormalized } from '@/utils/storage';

export interface AppSettings {
  theme: 'dark';
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  eveningCheckInEnabled: boolean;
  eveningCheckInTime: string;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  autoSaveEnabled: boolean;
  autoSaveIntervalMs: number;
  preferredFramework: string | null;
  lastExportDate: string | null;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  dailyReminderEnabled: false,
  dailyReminderTime: '09:00',
  eveningCheckInEnabled: false,
  eveningCheckInTime: '21:00',
  analyticsEnabled: true,
  crashReportingEnabled: true,
  autoSaveEnabled: true,
  autoSaveIntervalMs: 10000,
  preferredFramework: null,
  lastExportDate: null,
};

export function getSettings(): AppSettings {
  try {
    const raw = getStorageItemWithFallback(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function updateSettings(partial: Partial<AppSettings>): AppSettings {
  const updated = { ...getSettings(), ...partial };
  setStorageItemNormalized(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

export function clearLegacyLocalSettingsData(): AppSettings {
  [
    'journal_entries',
    'dream_entries',
    'alchm-settings',
    'alchm_settings',
    'userTier',
    'userEmail',
  ].forEach((key) => removeStorageItemNormalized(key));
  return updateSettings(DEFAULT_SETTINGS);
}

export async function updateNotificationPreference(
  userId: string,
  preference: import('@/types/user').NotificationPreference
): Promise<void> {
  const { setDoc, serverTimestamp } = await import('firebase/firestore');
  const db = getFirestoreDb();
  const profileRef = doc(db, 'users', userId, 'profile', 'main');
  await setDoc(
    profileRef,
    { notificationPreference: preference, lastSeenAt: serverTimestamp() },
    { merge: true }
  );
}

export async function clearKheperaMemory(userId: string): Promise<void> {
  const db = getFirestoreDb();
  const memRef = doc(db, 'users', userId, 'khepera', 'memory');
  await deleteDoc(memRef);
}

export async function deleteAccount(userId: string): Promise<void> {
  await deleteAccountFromAuthService(userId);
}
