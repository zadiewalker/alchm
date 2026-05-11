import { doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, limit, getDocs, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { UserContainer, ContainerTier } from '@/types/container';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/utils/storage';
import { getAllQueuedEntries } from '@/services/offline/localQueue';
import type { QueuedEntry } from '@/types/journal';

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
  insights?: string[];
  aiAnalysis?: {
    emotionalTone: number;
    themes: string[];
    suggestions: string[];
    breakthroughDetected: boolean;
  };
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

  private updateEntryRhythmMetrics(entryDate: Date) {
    try {
      setStorageItemNormalized(STORAGE_KEYS.LAST_ENTRY_DATE, entryDate.toISOString());
      const previousCount = Number.parseInt(getStorageItemWithFallback(STORAGE_KEYS.ENTRY_COUNT) || '0', 10) || 0;
      setStorageItemNormalized(STORAGE_KEYS.ENTRY_COUNT, String(previousCount + 1));
    } catch {
      // no-op
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

  async createUserContainer(data: {
    containerId: string;
    containerName: string;
    tier: ContainerTier;
    userId: string;
  }): Promise<string> {
    if (!this.userId) {
      throw new Error('User must be authenticated to create containers');
    }

    try {
      const db = this.getDb();
      const activeContainersQuery = query(
        collection(db, 'users', this.userId, 'containers'),
        where('status', '==', 'active'),
        limit(1)
      );
      const activeContainersSnapshot = await getDocs(activeContainersQuery);
      if (!activeContainersSnapshot.empty) {
        throw new Error('An active container already exists');
      }

      const userContainerRef = collection(db, 'users', this.userId, 'containers');
      const docRef = await addDoc(userContainerRef, {
        containerId: data.containerId,
        containerName: data.containerName,
        tier: data.tier,
        status: 'active',
        startedAt: serverTimestamp(),
        currentDay: 1,
        missedDays: [],
        sessionIds: [],
        completionCeremonyViewed: false,
        userId: this.userId,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating user container:', error);
      throw error;
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
          startedAt: data.startedAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate(),
          lastEntryAt: data.lastEntryAt?.toDate(),
        } as UserContainer;
      });
    } catch (error) {
      console.error('Error getting user containers:', error);
      return [];
    }
  }

  async updateUserContainer(id: string, updates: Partial<Omit<UserContainer, 'id'>>): Promise<void> {
    if (!this.userId) {
      throw new Error('User must be authenticated to update containers');
    }

    try {
      const containerRef = doc(this.getDb(), 'users', this.userId, 'containers', id);
      const updateData = { ...updates };

      if (updateData.startedAt) updateData.startedAt = Timestamp.fromDate(updateData.startedAt as unknown as Date);
      if (updateData.completedAt) updateData.completedAt = Timestamp.fromDate(updateData.completedAt as unknown as Date);
      if (updateData.lastEntryAt) updateData.lastEntryAt = Timestamp.fromDate(updateData.lastEntryAt as unknown as Date);

      await updateDoc(containerRef, updateData);
    } catch (error) {
      console.error('Error updating user container:', error);
      throw error;
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
