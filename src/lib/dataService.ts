import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { getStorageItemWithFallback, setStorageItemNormalized } from './storageKeys';

// Types for our data structures
export interface UserProfile {
  id: string;
  email: string;
  userTier: 'sanctuary' | 'growth' | 'transformation';
  stripeCustomerId?: string;
  createdAt: Date;
  lastActive: Date;
  settings: {
    notifications: boolean;
    gentleReminders: boolean;
    crisisSupport: boolean;
    journalReminders: boolean;
    privateMode: boolean;
    soundHealing: boolean;
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
  pathwayId?: string;
  pathwayStep?: number;
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

export interface PathwayProgress {
  id: string;
  userId: string;
  pathwayId: string;
  currentStage: number;
  completedStages: number[];
  responses: { [stageIndex: number]: string[] };
  startedAt: Date;
  lastAccessed: Date;
  completedAt?: Date;
  integrationLevel?: number;
}

export interface DreamEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  emotions: string[];
  symbols: string[];
  themes: string[];
  insights: string[];
  intensity: number;
  createdAt: Date;
}

export interface ShadowWorkProgress {
  id: string;
  userId: string;
  breakthroughMoments: string[];
  shadowPatterns: string[];
  emotionalIntensity: { [exerciseIndex: number]: number };
  voiceTranscripts: string[];
  emotionalInsights: any[];
  integrationLevel: number;
  lastUpdated: Date;
}

// Data Service Class
class DataService {
  private userId: string | null = null;

  // Initialize with user ID
  setUserId(uid: string) {
    this.userId = uid;
  }

  // Generic localStorage backup
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
      console.warn('Failed to save to localStorage:', error);
    }
  }

  // User Profile Management
  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.userId) {
      // Fallback to localStorage for anonymous users
      const email = getStorageItemWithFallback('userEmail') || '';
      const tier = getStorageItemWithFallback('userTier') as 'sanctuary' | 'growth' | 'transformation' || 'sanctuary';
      const localSettings = this.getFromLocalStorage<Record<string, any>>('alchm_settings');
      const settings = { ...this.getDefaultSettings(), ...(localSettings ?? {}) };
      
      return {
        id: 'anonymous',
        email,
        userTier: tier,
        createdAt: new Date(),
        lastActive: new Date(),
        settings
      };
    }

    try {
      const userDoc = doc(db, 'users', this.userId);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          id: userSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate() || new Date()
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
      // Save to localStorage for anonymous users
      if (profile.userTier) setStorageItemNormalized('userTier', profile.userTier);
      if (profile.email) setStorageItemNormalized('userEmail', profile.email);
      if (profile.settings) this.setToLocalStorage('alchm_settings', profile.settings);
      return;
    }

    try {
      const userDoc = doc(db, 'users', this.userId);
      await setDoc(userDoc, {
        ...profile,
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
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
      soundHealing: true,
      breathingCues: true,
      darkMode: false,
      safeWords: ['breathe', 'safe', 'grounded']
    };
  }

  // Journal Entry Management
  async saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'userId'>): Promise<string> {
    if (!this.userId) {
      // Save to localStorage for anonymous users
      const entryId = Date.now().toString();
      const fullEntry = { ...entry, id: entryId, userId: 'anonymous' };
      const existingEntries = this.getFromLocalStorage<JournalEntry[]>('journal_entries') || [];
      existingEntries.push(fullEntry);
      this.setToLocalStorage('journal_entries', existingEntries);
      return entryId;
    }

    try {
      const entriesRef = collection(db, 'journalEntries');
      const docRef = await addDoc(entriesRef, {
        ...entry,
        userId: this.userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }

  async getJournalEntries(limit: number = 50): Promise<JournalEntry[]> {
    if (!this.userId) {
      // Get from localStorage for anonymous users
      const entries = this.getFromLocalStorage<JournalEntry[]>('journal_entries') || [];
      return entries
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    }

    try {
      const entriesRef = collection(db, 'journalEntries');
      const q = query(
        entriesRef,
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc'),
        // Note: We'd need to add limit() here but it requires an index
      );
      
      const querySnapshot = await getDocs(q);
      const entries: JournalEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as JournalEntry);
      });
      
      return entries.slice(0, limit);
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }

  // Pathway Progress Management
  async savePathwayProgress(progress: Omit<PathwayProgress, 'id' | 'userId'>): Promise<void> {
    if (!this.userId) {
      // Save to localStorage for anonymous users
      const progressKey = `pathway_progress_${progress.pathwayId}`;
      this.setToLocalStorage(progressKey, { ...progress, userId: 'anonymous' });
      return;
    }

    try {
      const progressRef = doc(db, 'pathwayProgress', `${this.userId}_${progress.pathwayId}`);
      await setDoc(progressRef, {
        ...progress,
        userId: this.userId,
        lastAccessed: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving pathway progress:', error);
      throw error;
    }
  }

  async getPathwayProgress(pathwayId: string): Promise<PathwayProgress | null> {
    if (!this.userId) {
      // Get from localStorage for anonymous users
      const progressKey = `pathway_progress_${pathwayId}`;
      const progress = this.getFromLocalStorage<PathwayProgress>(progressKey);
      return progress ? {
        ...progress,
        startedAt: new Date(progress.startedAt),
        lastAccessed: new Date(progress.lastAccessed),
        completedAt: progress.completedAt ? new Date(progress.completedAt) : undefined
      } : null;
    }

    try {
      const progressRef = doc(db, 'pathwayProgress', `${this.userId}_${pathwayId}`);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const data = progressSnap.data();
        return {
          id: progressSnap.id,
          ...data,
          startedAt: data.startedAt?.toDate() || new Date(),
          lastAccessed: data.lastAccessed?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate()
        } as PathwayProgress;
      }
      return null;
    } catch (error) {
      console.error('Error getting pathway progress:', error);
      return null;
    }
  }

  // Dream Entry Management
  async saveDreamEntry(dream: Omit<DreamEntry, 'id' | 'userId'>): Promise<string> {
    if (!this.userId) {
      // Save to localStorage for anonymous users
      const dreamId = Date.now().toString();
      const fullDream = { ...dream, id: dreamId, userId: 'anonymous' };
      const existingDreams = this.getFromLocalStorage<DreamEntry[]>('dream_entries') || [];
      existingDreams.push(fullDream);
      this.setToLocalStorage('dream_entries', existingDreams);
      return dreamId;
    }

    try {
      const dreamsRef = collection(db, 'dreamEntries');
      const docRef = await addDoc(dreamsRef, {
        ...dream,
        userId: this.userId,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving dream entry:', error);
      throw error;
    }
  }

  async getDreamEntries(): Promise<DreamEntry[]> {
    if (!this.userId) {
      // Get from localStorage for anonymous users
      const dreams = this.getFromLocalStorage<DreamEntry[]>('dream_entries') || [];
      return dreams
        .map(dream => ({ ...dream, createdAt: new Date(dream.createdAt) }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    try {
      const dreamsRef = collection(db, 'dreamEntries');
      const q = query(
        dreamsRef,
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const dreams: DreamEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dreams.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as DreamEntry);
      });
      
      return dreams;
    } catch (error) {
      console.error('Error getting dream entries:', error);
      return [];
    }
  }

  // Shadow Work Progress Management
  async saveShadowWorkProgress(progress: Omit<ShadowWorkProgress, 'id' | 'userId'>): Promise<void> {
    if (!this.userId) {
      // Save to localStorage for anonymous users
      this.setToLocalStorage('shadow_work_progress', { ...progress, userId: 'anonymous' });
      return;
    }

    try {
      const progressRef = doc(db, 'shadowWorkProgress', this.userId);
      await setDoc(progressRef, {
        ...progress,
        userId: this.userId,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving shadow work progress:', error);
      throw error;
    }
  }

  async getShadowWorkProgress(): Promise<ShadowWorkProgress | null> {
    if (!this.userId) {
      // Get from localStorage for anonymous users
      const progress = this.getFromLocalStorage<ShadowWorkProgress>('shadow_work_progress');
      return progress ? {
        ...progress,
        lastUpdated: new Date(progress.lastUpdated)
      } : null;
    }

    try {
      const progressRef = doc(db, 'shadowWorkProgress', this.userId);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const data = progressSnap.data();
        return {
          id: progressSnap.id,
          ...data,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        } as ShadowWorkProgress;
      }
      return null;
    } catch (error) {
      console.error('Error getting shadow work progress:', error);
      return null;
    }
  }

  // Migration utilities
  async migrateLocalStorageToFirebase(): Promise<void> {
    if (!this.userId) return;

    try {
      // Migrate journal entries
      const localJournalEntries = this.getFromLocalStorage<JournalEntry[]>('journal_entries') || [];
      for (const entry of localJournalEntries) {
        await this.saveJournalEntry({
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          emotions: entry.emotions || [],
          tags: entry.tags || [],
          isPrivate: entry.isPrivate !== false,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt || entry.createdAt),
          pathwayId: entry.pathwayId,
          insights: entry.insights,
          aiAnalysis: entry.aiAnalysis
        });
      }

      // Migrate dream entries
      const localDreamEntries = this.getFromLocalStorage<DreamEntry[]>('dream_entries') || [];
      for (const dream of localDreamEntries) {
        await this.saveDreamEntry({
          title: dream.title,
          content: dream.content,
          emotions: dream.emotions || [],
          symbols: dream.symbols || [],
          themes: dream.themes || [],
          insights: dream.insights || [],
          intensity: dream.intensity || 0,
          createdAt: new Date(dream.createdAt)
        });
      }

      // Migrate shadow work progress
      const localShadowProgress = this.getFromLocalStorage<ShadowWorkProgress>('shadow_work_progress');
      if (localShadowProgress) {
        await this.saveShadowWorkProgress({
          breakthroughMoments: localShadowProgress.breakthroughMoments || [],
          shadowPatterns: localShadowProgress.shadowPatterns || [],
          emotionalIntensity: localShadowProgress.emotionalIntensity || {},
          voiceTranscripts: localShadowProgress.voiceTranscripts || [],
          emotionalInsights: localShadowProgress.emotionalInsights || [],
          integrationLevel: localShadowProgress.integrationLevel || 0,
          lastUpdated: new Date()
        });
      }

      // Migrate user settings
      const localSettings = this.getFromLocalStorage<Partial<UserProfile['settings']>>('alchm_settings');
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

// Singleton instance
export const dataService = new DataService();
export default dataService;
