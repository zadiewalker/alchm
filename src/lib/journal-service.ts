import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { encrypt, decrypt } from '@/lib/crypto';

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Offline persistence not available');
  }
});

export interface JournalEntry {
  id?: string;
  userId: string;
  content: string;
  encryptedContent?: string;
  iv?: string;
  mood?: number;
  tags?: string[];
  pathway?: string;
  emotionalContext?: any;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  wordCount: number;
  isEncrypted: boolean;
}

export interface UserStats {
  userId: string;
  streak: number;
  totalEntries: number;
  lastEntryDate: Timestamp | Date;
  longestStreak: number;
  totalWords: number;
  averageMood?: number;
}

// Journal CRUD Operations
export const journalService = {
  // Create a new journal entry
  async createEntry(
    userId: string, 
    content: string, 
    options?: { 
      mood?: number; 
      tags?: string[]; 
      pathway?: string;
      encrypt?: boolean;
      emotionalContext?: any;
    }
  ): Promise<string> {
    try {
      const entryData: JournalEntry = {
        userId,
        content: options?.encrypt ? '' : content,
        mood: options?.mood,
        tags: options?.tags || [],
        pathway: options?.pathway,
        emotionalContext: options?.emotionalContext,
        createdAt: serverTimestamp() as Timestamp,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        isEncrypted: options?.encrypt || false
      };

      // Encrypt content if requested
      if (options?.encrypt) {
        const encrypted = await encrypt(content);
        entryData.encryptedContent = encrypted.content;
        entryData.iv = encrypted.iv;
        entryData.content = ''; // Clear plaintext
      }

      // Create typeof window !== 'undefined' && document with auto-generated ID
      const entryRef = doc(collection(db, 'journals', userId, 'entries'));
      await setDoc(entryRef, entryData);

      // Update user stats
      await this.updateUserStats(userId);

      return entryRef.id;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  },

  // Get a single journal entry
  async getEntry(userId: string, entryId: string): Promise<JournalEntry | null> {
    try {
      const entryRef = doc(db, 'journals', userId, 'entries', entryId);
      const entryDoc = await getDoc(entryRef);
      
      if (!entryDoc.exists()) {
        return null;
      }

      const data = entryDoc.data() as JournalEntry;
      data.id = entryDoc.id;

      // Decrypt if encrypted
      if (data.isEncrypted && data.encryptedContent && data.iv) {
        data.content = await decrypt(data.encryptedContent, data.iv);
      }

      return data;
    } catch (error) {
      console.error('Error getting journal entry:', error);
      throw error;
    }
  },

  // Get all entries for a user
  async getEntries(
    userId: string, 
    options?: { 
      limit?: number; 
      startDate?: Date; 
      endDate?: Date;
      pathway?: string;
    }
  ): Promise<JournalEntry[]> {
    try {
      const entriesRef = collection(db, 'journals', userId, 'entries');
      let q = query(entriesRef, orderBy('createdAt', 'desc'));

      // Apply filters
      if (options?.pathway) {
        q = query(q, where('pathway', '==', options.pathway));
      }
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const entries: JournalEntry[] = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data() as JournalEntry;
        data.id = doc.id;

        // Decrypt if encrypted
        if (data.isEncrypted && data.encryptedContent && data.iv) {
          data.content = await decrypt(data.encryptedContent, data.iv);
        }

        entries.push(data);
      }

      return entries;
    } catch (error) {
      console.error('Error getting journal entries:', error);
      throw error;
    }
  },

  // Update an entry
  async updateEntry(
    userId: string, 
    entryId: string, 
    updates: Partial<JournalEntry>
  ): Promise<void> {
    try {
      const entryRef = doc(db, 'journals', userId, 'entries', entryId);
      
      // Handle encryption if content is being updated
      if (updates.content && updates.isEncrypted) {
        const encrypted = await encrypt(updates.content);
        updates.encryptedContent = encrypted.content;
        updates.iv = encrypted.iv;
        updates.content = ''; // Clear plaintext
      }

      // Add updated timestamp
      updates.updatedAt = serverTimestamp() as Timestamp;

      // Recalculate word count if content changed
      if (updates.content || updates.encryptedContent) {
        const content = updates.content || 
          (updates.encryptedContent ? await decrypt(updates.encryptedContent, updates.iv!) : '');
        updates.wordCount = content.split(/\s+/).filter(Boolean).length;
      }

      await updateDoc(entryRef, updates);
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  },

  // Delete an entry
  async deleteEntry(userId: string, entryId: string): Promise<void> {
    try {
      const entryRef = doc(db, 'journals', userId, 'entries', entryId);
      await deleteDoc(entryRef);
      
      // Update stats
      await this.updateUserStats(userId);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  },

  // Update user statistics
  async updateUserStats(userId: string): Promise<void> {
    try {
      const entries = await this.getEntries(userId);
      
      if (entries.length === 0) {
        return;
      }

      // Calculate stats
      const sortedEntries = entries.sort((a, b) => {
        const aTime = (a.createdAt as Timestamp).toMillis();
        const bTime = (b.createdAt as Timestamp).toMillis();
        return aTime - bTime;
      });

      const lastEntry = sortedEntries[sortedEntries.length - 1];
      const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);
      const avgMood = entries
        .filter(e => e.mood)
        .reduce((sum, e, _, arr) => sum + e.mood! / arr.length, 0);

      // Calculate streak
      const streak = this.calculateStreak(sortedEntries);

      const stats: UserStats = {
        userId,
        streak: streak.current,
        totalEntries: entries.length,
        lastEntryDate: lastEntry.createdAt,
        longestStreak: streak.longest,
        totalWords,
        averageMood: avgMood || undefined
      };

      // Save stats
      const statsRef = doc(db, 'stats', userId);
      await setDoc(statsRef, stats);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  },

  // Calculate writing streak
  calculateStreak(entries: JournalEntry[]): { current: number; longest: number } {
    if (entries.length === 0) return { current: 0, longest: 0 };
    
    const firstEntry = entries[0];
    if (!firstEntry) return { current: 0, longest: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    let lastDate = new Date((firstEntry.createdAt as Timestamp).toMillis());
    lastDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < entries.length; i++) {
      const currentEntry = entries[i];
      if (!currentEntry) continue;
      
      const entryDate = new Date((currentEntry.createdAt as Timestamp).toMillis());
      entryDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else if (dayDiff > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
      
      lastDate = entryDate;
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Check if streak is current
    const lastEntry = entries[entries.length - 1];
    if (!lastEntry) return { current: 0, longest: longestStreak };
    
    const lastEntryDate = new Date((lastEntry.createdAt as Timestamp).toMillis());
    lastEntryDate.setHours(0, 0, 0, 0);
    const daysSinceLastEntry = Math.floor((today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastEntry <= 1) {
      currentStreak = tempStreak;
    }

    return { current: currentStreak, longest: longestStreak };
  },

  // Get user stats
  async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const statsRef = doc(db, 'stats', userId);
      const statsDoc = await getDoc(statsRef);
      
      if (!statsDoc.exists()) {
        // Initialize stats if they don't exist
        await this.updateUserStats(userId);
        const newStatsDoc = await getDoc(statsRef);
        return newStatsDoc.exists() ? newStatsDoc.data() as UserStats : null;
      }

      return statsDoc.data() as UserStats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  },

  // Real-time subscription to entries
  subscribeToEntries(
    userId: string, 
    callback: (entries: JournalEntry[]) => void
  ): () => void {
    const entriesRef = collection(db, 'journals', userId, 'entries');
    const q = query(entriesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const entries: JournalEntry[] = [];
      
      for (const doc of snapshot.docs) {
        const data = doc.data() as JournalEntry;
        data.id = doc.id;

        // Decrypt if encrypted
        if (data.isEncrypted && data.encryptedContent && data.iv) {
          try {
            data.content = await decrypt(data.encryptedContent, data.iv);
          } catch (err) {
            console.error('Decryption error:', err);
            data.content = '[Encrypted]';
          }
        }

        entries.push(data);
      }

      callback(entries);
    });

    return unsubscribe;
  }
};

export default journalService;