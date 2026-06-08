import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import type { UserContainer } from '@/types/container';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/utils/storage';
import { getAllQueuedEntries } from '@/services/offline/localQueue';
import type { EmotionalTone, QueuedEntry, ThemeTag } from '@/types/journal';

export interface UserProfile {
  id: string;
  email: string;
  userTier: 'sanctuary' | 'transformation';
  stripeCustomerId?: string;
  createdAt: Date;
  lastActive: Date;
  settings: {
    notifications: boolean;
    gentleReminders: boolean;
    crisisSupport: boolean;
    journalReminders: boolean;
    privateMode: boolean;
    soundSupport: boolean;
    breathingCues: boolean;
    darkMode: boolean;
    preferredName?: string;
    customCrisisNumber?: string;
    supportPerson?: string;
    safeWords: string[];
  };
}

export interface JournalEntry {
  id: string;
  userId: string;
  title?: string;
  content: string;
  mood?: number;
  emotions: string[];
  tags: string[];
  type?: 'journal' | 'checkin';
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  kheperaReflection?: string;
  kheperaFrameworks?: string[];
  moodWords?: string[];
  emotionalTone?: EmotionalTone;
  aiAnalysis?: {
    emotionalTone?: unknown;
  };
  themes?: ThemeTag[];
  insights?: string[];
}

class DataService {
  private userId: string | null = null;

  private getDb() {
    return getFirestoreDb();
  }

  setUserId(uid: string) {
    this.userId = uid;
  }

  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const item = getStorageItemWithFallback(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  private setToLocalStorage<T>(key: string, data: T) {
    try {
      setStorageItemNormalized(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to browser storage:', error);
    }
  }

  private toDate(value: unknown): Date {
    if (value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>) && typeof (value as { toDate: () => Date }).toDate === 'function') {
      return (value as { toDate: () => Date }).toDate();
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return new Date();
  }

  private toStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  }

  private toEmotionalTone(value: unknown): EmotionalTone | undefined {
    switch (value) {
      case 'processing':
      case 'grief':
      case 'anger':
      case 'anxiety':
      case 'clarity':
      case 'numbness':
      case 'tenderness':
      case 'ambivalence':
        return value;
      default:
        return undefined;
    }
  }

  private toLegacyAiAnalysis(value: unknown): JournalEntry['aiAnalysis'] {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return undefined;
    }

    const emotionalTone = (value as Record<string, unknown>).emotionalTone;
    return typeof emotionalTone === 'string' ? { emotionalTone } : undefined;
  }

  private toThemeTags(value: unknown): ThemeTag[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((theme): theme is ThemeTag => {
      switch (theme) {
        case 'grief_loss':
        case 'relationship_tension':
        case 'self_worth':
        case 'identity':
        case 'work_purpose':
        case 'fear_uncertainty':
        case 'anger_injustice':
        case 'body_health':
        case 'creativity_expression':
        case 'spirituality_meaning':
        case 'rest_recovery':
        case 'joy_gratitude':
        case 'transition_change':
        case 'boundary_setting':
        case 'childhood_origin':
          return true;
        default:
          return false;
      }
    });
  }

  private mapSessionToJournalEntry(id: string, data: Record<string, unknown>): JournalEntry {
    const content = typeof data.entryText === 'string'
      ? data.entryText
      : typeof data.content === 'string'
        ? data.content
        : '';

    const kheperaReflection = typeof data.kheperaResponse === 'string'
      ? data.kheperaResponse
      : typeof data.kheperaReflection === 'string'
        ? data.kheperaReflection
        : undefined;

    const seed = typeof data.seed === 'string' ? data.seed.trim() : '';

    return {
      id,
      userId: typeof data.userId === 'string' ? data.userId : this.userId || 'anonymous',
      title: typeof data.title === 'string' ? data.title : undefined,
      content,
      mood: typeof data.mood === 'number' ? data.mood : undefined,
      emotions: Array.isArray(data.emotions) ? data.emotions.filter((item): item is string => typeof item === 'string') : [],
      tags: Array.isArray(data.tags) ? data.tags.filter((item): item is string => typeof item === 'string') : [],
      type: data.type === 'checkin' ? 'checkin' : 'journal',
      isPrivate: data.isPrivate !== false,
      createdAt: this.toDate(data.createdAt ?? data.writtenAt),
      updatedAt: this.toDate(data.updatedAt ?? data.createdAt ?? data.writtenAt),
      kheperaReflection,
      insights: seed ? [seed] : [],
      moodWords: Array.isArray(data.moodWords) ? data.moodWords.filter((item): item is string => typeof item === 'string') : undefined,
      emotionalTone: this.toEmotionalTone(data.emotionalTone),
      aiAnalysis: this.toLegacyAiAnalysis(data.aiAnalysis),
      themes: this.toThemeTags(data.themes),
    };
  }

  private mapQueuedEntryToJournalEntry(entry: QueuedEntry): JournalEntry {
    return {
      id: entry.firestoreId || entry.localId,
      userId: entry.userId || 'anonymous',
      title: undefined,
      content: entry.entryText,
      mood: undefined,
      emotions: entry.checkIn ? [entry.checkIn] : [],
      tags: [],
      type: 'journal',
      isPrivate: true,
      createdAt: this.toDate(entry.writtenAt),
      updatedAt: this.toDate(entry.syncedAt || entry.writtenAt),
      kheperaReflection: entry.kheperaResponse,
      insights: entry.seed ? [entry.seed] : [],
      emotionalTone: entry.dominantTone,
      themes: this.toThemeTags(entry.recurringThemes),
    };
  }

  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.userId) {
      const email = getStorageItemWithFallback(STORAGE_KEYS.USER_EMAIL) || '';
      const tier = getStorageItemWithFallback(STORAGE_KEYS.USER_TIER) as 'sanctuary' | 'transformation' || 'sanctuary';
      const localSettings = this.getFromLocalStorage<Record<string, unknown>>(STORAGE_KEYS.SETTINGS);
      const settings = { ...this.getDefaultSettings(), ...(localSettings ?? {}) };

      return {
        id: 'anonymous',
        email,
        userTier: tier,
        createdAt: new Date(),
        lastActive: new Date(),
        settings,
      };
    }

    try {
      const userDoc = doc(this.getDb(), 'users', this.userId);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: userSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
    if (!this.userId) {
      if (profile.userTier) setStorageItemNormalized(STORAGE_KEYS.USER_TIER, profile.userTier);
      if (profile.email) setStorageItemNormalized(STORAGE_KEYS.USER_EMAIL, profile.email);
      if (profile.settings) this.setToLocalStorage(STORAGE_KEYS.SETTINGS, profile.settings);
      return;
    }

    try {
      const userDoc = doc(this.getDb(), 'users', this.userId);
      await setDoc(
        userDoc,
        {
          ...profile,
          lastActive: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  private getDefaultSettings() {
    return {
      notifications: true,
      gentleReminders: true,
      crisisSupport: true,
      journalReminders: false,
      privateMode: false,
      soundSupport: true,
      breathingCues: true,
      darkMode: false,
      safeWords: ['breathe', 'safe', 'grounded'],
    };
  }

  async getJournalEntries(limitCount: number = 50): Promise<JournalEntry[]> {
    if (!this.userId) {
      const entries = await getAllQueuedEntries();
      return entries
        .map((entry) => this.mapQueuedEntryToJournalEntry(entry))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limitCount);
    }

    try {
      const entriesRef = collection(this.getDb(), 'users', this.userId, 'sessions');
      const q = query(entriesRef, orderBy('createdAt', 'desc'), limit(limitCount));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((entryDoc) =>
        this.mapSessionToJournalEntry(entryDoc.id, entryDoc.data() as Record<string, unknown>)
      );
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }

  async getJournalEntryById(entryId: string): Promise<JournalEntry | null> {
    if (!this.userId) {
      return null;
    }

    try {
      const entryRef = doc(this.getDb(), 'users', this.userId, 'sessions', entryId);
      const entrySnap = await getDoc(entryRef);

      if (!entrySnap.exists()) {
        return null;
      }

      return this.mapSessionToJournalEntry(
        entrySnap.id,
        entrySnap.data() as Record<string, unknown>,
      );
    } catch (error) {
      console.error('Error getting journal entry:', error);
      return null;
    }
  }

  async getUserContainers(): Promise<UserContainer[]> {
    if (!this.userId) {
      return [];
    }

    try {
      const userContainersRef = collection(this.getDb(), 'users', this.userId, 'containers');
      const q = query(userContainersRef, orderBy('startedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((containerDoc) => {
        const data = containerDoc.data();
        return {
          id: containerDoc.id,
          ...data,
        } as UserContainer;
      });
    } catch (error) {
      console.error('Error getting user containers:', error);
      return [];
    }
  }

  async getUserContainer(id: string): Promise<UserContainer | null> {
    if (!this.userId) {
      return null;
    }

    try {
      const containerRef = doc(this.getDb(), 'users', this.userId, 'containers', id);
      const containerSnap = await getDoc(containerRef);

      if (containerSnap.exists()) {
        const data = containerSnap.data();
        return {
          id: containerSnap.id,
          ...data,
          startedAt: data.startedAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate(),
          lastEntryAt: data.lastEntryAt?.toDate(),
        } as UserContainer;
      }

      return null;
    } catch (error) {
      console.error('Error getting user container:', error);
      return null;
    }
  }

  async migrateBrowserStorageToFirebase(): Promise<void> {
    if (!this.userId) return;

    try {
      const localSettings = this.getFromLocalStorage<Partial<UserProfile['settings']>>(STORAGE_KEYS.SETTINGS);
      if (localSettings) {
        const mergedSettings = { ...this.getDefaultSettings(), ...localSettings };
        await this.updateUserProfile({ settings: mergedSettings });
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

export const dataService = new DataService();
export default dataService;
