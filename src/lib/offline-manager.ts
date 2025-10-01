// Offline Manager - Intelligent offline data management for ALCHM
// Handles journal entries, mood data, and AI insights while offline

import { JournalEntry, AIInsight, UserProfile } from '@/types/firestore-schema';

export interface OfflineQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  collection: 'journal_entries' | 'ai_insights' | 'mood_data' | 'user_profile';
  data: any;
  timestamp: number;
  retryCount: number;
  userId: string;
  priority: 'high' | 'medium' | 'low';
}

export interface OfflineStorageQuota {
  used: number;
  available: number;
  quota: number;
  tier: 'free' | 'deep-cut' | 'oracle';
}

export class OfflineManager {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'alchm_offline';
  private readonly DB_VERSION = 3;
  private isOnline = typeof window !== 'undefined' && navigator.onLine;
  private syncInProgress = false;

  constructor() {
    this.setupEventListeners();
    this.initializeDB();
  }

  private setupEventListeners() {
    // Listen for online/offline events
    typeof window !== 'undefined' && window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineEvent();
    });

    typeof window !== 'undefined' && window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOfflineEvent();
    });

    // Listen for service worker messages
    if ('serviceWorker' in typeof window !== 'undefined' && navigator) {
      typeof window !== 'undefined' && navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    }
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('[OfflineManager] Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineManager] Database initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.upgradeDatabase(db, event.oldVersion);
      };
    });
  }

  private upgradeDatabase(db: IDBDatabase, oldVersion: number) {
    console.log(`[OfflineManager] Upgrading database from version ${oldVersion} to ${this.DB_VERSION}`);

    // Create offline queue store
    if (!db.objectStoreNames.contains('offline_queue')) {
      const queueStore = db.createObjectStore('offline_queue', { keyPath: 'id' });
      queueStore.createIndex('timestamp', 'timestamp', { unique: false });
      queueStore.createIndex('priority', 'priority', { unique: false });
      queueStore.createIndex('userId', 'userId', { unique: false });
    }

    // Create journal entries store
    if (!db.objectStoreNames.contains('journal_entries')) {
      const journalStore = db.createObjectStore('journal_entries', { keyPath: 'id' });
      journalStore.createIndex('userId', 'userId', { unique: false });
      journalStore.createIndex('createdAt', 'createdAt', { unique: false });
      journalStore.createIndex('syncStatus', 'syncStatus', { unique: false });
    }

    // Create AI insights store
    if (!db.objectStoreNames.contains('ai_insights')) {
      const insightsStore = db.createObjectStore('ai_insights', { keyPath: 'id' });
      insightsStore.createIndex('userId', 'userId', { unique: false });
      insightsStore.createIndex('entryId', 'entryId', { unique: false });
      insightsStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Create mood data store
    if (!db.objectStoreNames.contains('mood_data')) {
      const moodStore = db.createObjectStore('mood_data', { keyPath: 'id' });
      moodStore.createIndex('userId', 'userId', { unique: false });
      moodStore.createIndex('date', 'date', { unique: false });
    }

    // Create user preferences store
    if (!db.objectStoreNames.contains('user_preferences')) {
      const prefsStore = db.createObjectStore('user_preferences', { keyPath: 'userId' });
    }

    // Create sync status store
    if (!db.objectStoreNames.contains('sync_status')) {
      const syncStore = db.createObjectStore('sync_status', { keyPath: 'key' });
    }
  }

  // Journal Entry Management
  async saveJournalEntryOffline(entry: JournalEntry): Promise<void> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(['journal_entries', 'offline_queue'], 'readwrite');
    
    try {
      // Save entry to local store
      const entryWithSync = {
        ...entry,
        syncStatus: this.isOnline ? 'pending' : 'offline',
        lastModified: Date.now()
      };
      
      await this.putData(transaction.objectStore('journal_entries'), entryWithSync);

      // Add to sync queue if offline or for backup
      if (!this.isOnline || !entry.id.startsWith('temp_')) {
        const queueItem: OfflineQueueItem = {
          id: `journal_${entry.id}_${Date.now()}`,
          operation: entry.id.startsWith('temp_') ? 'create' : 'update',
          collection: 'journal_entries',
          data: entry,
          timestamp: Date.now(),
          retryCount: 0,
          userId: entry.userId,
          priority: 'high' // Journal entries are high priority
        };

        await this.putData(transaction.objectStore('offline_queue'), queueItem);
      }

      console.log('[OfflineManager] Journal entry saved offline:', entry.id);
      
      // Try immediate sync if online
      if (this.isOnline) {
        this.triggerBackgroundSync();
      }

    } catch (error) {
      console.error('[OfflineManager] Failed to save journal entry offline:', error);
      transaction.abort();
      throw error;
    }
  }

  async getOfflineJournalEntries(userId: string, limit = 50): Promise<JournalEntry[]> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(['journal_entries'], 'readonly');
    const store = transaction.objectStore('journal_entries');
    const index = store.index('userId');
    
    const entries = await this.getAllFromIndex(index, userId);
    
    // Sort by creation date, most recent first
    return entries
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, limit);
  }

  // AI Insights Management
  async saveAIInsightOffline(insight: AIInsight): Promise<void> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(['ai_insights', 'offline_queue'], 'readwrite');
    
    try {
      await this.putData(transaction.objectStore('ai_insights'), insight);

      // Add to sync queue for backup to server
      const queueItem: OfflineQueueItem = {
        id: `insight_${insight.id}_${Date.now()}`,
        operation: 'create',
        collection: 'ai_insights',
        data: insight,
        timestamp: Date.now(),
        retryCount: 0,
        userId: insight.userId,
        priority: 'medium'
      };

      await this.putData(transaction.objectStore('offline_queue'), queueItem);
      console.log('[OfflineManager] AI insight saved offline:', insight.id);

    } catch (error) {
      console.error('[OfflineManager] Failed to save AI insight offline:', error);
      transaction.abort();
      throw error;
    }
  }

  async getOfflineAIInsights(userId: string, entryId?: string): Promise<AIInsight[]> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(['ai_insights'], 'readonly');
    const store = transaction.objectStore('ai_insights');
    
    if (entryId) {
      const index = store.index('entryId');
      return await this.getAllFromIndex(index, entryId);
    } else {
      const index = store.index('userId');
      return await this.getAllFromIndex(index, userId);
    }
  }

  // Mood Data Management
  async saveMoodDataOffline(moodData: any): Promise<void> {
    if (!this.db) await this.initializeDB();

    const transaction = this.db!.transaction(['mood_data', 'offline_queue'], 'readwrite');
    
    try {
      await this.putData(transaction.objectStore('mood_data'), moodData);

      const queueItem: OfflineQueueItem = {
        id: `mood_${moodData.id}_${Date.now()}`,
        operation: 'create',
        collection: 'mood_data',
        data: moodData,
        timestamp: Date.now(),
        retryCount: 0,
        userId: moodData.userId,
        priority: 'low'
      };

      await this.putData(transaction.objectStore('offline_queue'), queueItem);

    } catch (error) {
      console.error('[OfflineManager] Failed to save mood data offline:', error);
      transaction.abort();
      throw error;
    }
  }

  // Sync Management
  async syncOfflineData(): Promise<{ synced: number; failed: number }> {
    if (!this.isOnline || this.syncInProgress) {
      return { synced: 0, failed: 0 };
    }

    this.syncInProgress = true;
    let syncedCount = 0;
    let failedCount = 0;

    try {
      const queueItems = await this.getOfflineQueue();
      console.log(`[OfflineManager] Syncing ${queueItems.length} items`);

      // Sort by priority and timestamp
      queueItems.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp - b.timestamp;
      });

      for (const item of queueItems) {
        try {
          await this.syncItem(item);
          await this.removeFromOfflineQueue(item.id);
          syncedCount++;
          console.log('[OfflineManager] Synced item:', item.id);
        } catch (error) {
          console.error('[OfflineManager] Failed to sync item:', item.id, error);
          
          // Update retry count
          item.retryCount++;
          if (item.retryCount < 3) {
            await this.updateOfflineQueueItem(item);
          } else {
            await this.removeFromOfflineQueue(item.id);
            console.warn('[OfflineManager] Max retries reached for item:', item.id);
          }
          failedCount++;
        }
      }

      // Update sync status
      await this.updateSyncStatus({
        lastSyncAt: Date.now(),
        syncedCount,
        failedCount,
        totalPending: queueItems.length - syncedCount
      });

    } catch (error) {
      console.error('[OfflineManager] Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }

    return { synced: syncedCount, failed: failedCount };
  }

  private async syncItem(item: OfflineQueueItem): Promise<void> {
    const { operation, collection, data } = item;
    
    let url = `/api/${collection.replace('_', '-')}`;
    let method = 'POST';
    let body = JSON.stringify(data);

    if (operation === 'update') {
      url += `/${data.id}`;
      method = 'PUT';
    } else if (operation === 'delete') {
      url += `/${data.id}`;
      method = 'DELETE';
      body = null;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Storage Quota Management
  async getStorageQuota(userTier: 'free' | 'deep-cut' | 'oracle'): Promise<OfflineStorageQuota> {
    if (!typeof window !== 'undefined' && navigator.storage || !typeof window !== 'undefined' && navigator.storage.estimate) {
      // Fallback for browsers without storage API
      return {
        used: 0,
        available: 50 * 1024 * 1024, // 50MB fallback
        quota: 50 * 1024 * 1024,
        tier: userTier
      };
    }

    const estimate = await typeof window !== 'undefined' && navigator.storage.estimate();
    const quota = estimate.quota || 0;
    const used = estimate.usage || 0;
    const available = quota - used;

    return {
      used,
      available,
      quota,
      tier: userTier
    };
  }

  async cleanupOldData(userTier: 'free' | 'deep-cut' | 'oracle'): Promise<void> {
    if (!this.db) await this.initializeDB();

    const limits = this.getTierLimits(userTier);
    const cutoffDate = Date.now() - (limits.retentionDays * 24 * 60 * 60 * 1000);

    const transaction = this.db!.transaction(['journal_entries', 'ai_insights', 'mood_data'], 'readwrite');

    try {
      // Clean old journal entries for free tier
      if (userTier === 'free') {
        const journalStore = transaction.objectStore('journal_entries');
        const journalIndex = journalStore.index('createdAt');
        const range = IDBKeyRange.upperBound(cutoffDate);
        
        await this.deleteFromRange(journalIndex, range);
      }

      // Clean old AI insights
      const insightsStore = transaction.objectStore('ai_insights');
      const insightsIndex = insightsStore.index('createdAt');
      const insightsRange = IDBKeyRange.upperBound(cutoffDate);
      
      await this.deleteFromRange(insightsIndex, insightsRange);

      console.log('[OfflineManager] Cleanup completed for tier:', userTier);

    } catch (error) {
      console.error('[OfflineManager] Cleanup failed:', error);
      transaction.abort();
    }
  }

  private getTierLimits(tier: 'free' | 'deep-cut' | 'oracle') {
    switch (tier) {
      case 'oracle':
        return { retentionDays: 365 * 3, maxEntries: 10000 }; // 3 years
      case 'deep-cut':
        return { retentionDays: 365, maxEntries: 5000 }; // 1 year
      default:
        return { retentionDays: 30, maxEntries: 100 }; // 30 days
    }
  }

  // Event Handlers
  private async handleOnlineEvent() {
    console.log('[OfflineManager] Device back online, triggering sync');
    
    // Notify UI
    this.dispatchOfflineEvent('online', { online: true });
    
    // Start background sync
    this.triggerBackgroundSync();
    
    // Sync offline data
    setTimeout(() => {
      this.syncOfflineData();
    }, 1000); // Small delay to ensure connection is stable
  }

  private handleOfflineEvent() {
    console.log('[OfflineManager] Device went offline');
    
    // Notify UI
    this.dispatchOfflineEvent('offline', { online: false });
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    const { type, payload } = event.data;

    switch (type) {
      case 'SYNC_OFFLINE_JOURNALS':
        this.syncOfflineData();
        break;
      case 'SYNC_COMPLETED':
        this.dispatchOfflineEvent('sync-completed', payload);
        break;
      case 'PROCESS_OFFLINE_QUEUE':
        this.syncOfflineData();
        break;
    }
  }

  private dispatchOfflineEvent(type: string, detail: any) {
    typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent(`alchm-${type}`, { detail }));
  }

  private triggerBackgroundSync() {
    if ('serviceWorker' in typeof window !== 'undefined' && navigator && typeof window !== 'undefined' && navigator.serviceWorker.ready) {
      typeof window !== 'undefined' && navigator.serviceWorker.ready.then((registration) => {
        if (registration.sync) {
          registration.sync.register('sync-journal-entries');
          registration.sync.register('offline-queue-sync');
        }
      });
    }
  }

  // Helper methods for IndexedDB operations
  private async putData(store: IDBObjectStore, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllFromIndex(index: IDBIndex, key: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = index.getAll(key);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteFromRange(index: IDBIndex, range: IDBKeyRange): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async getOfflineQueue(): Promise<OfflineQueueItem[]> {
    if (!this.db) return [];

    const transaction = this.db.transaction(['offline_queue'], 'readonly');
    const store = transaction.objectStore('offline_queue');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async removeFromOfflineQueue(itemId: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['offline_queue'], 'readwrite');
    const store = transaction.objectStore('offline_queue');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(itemId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async updateOfflineQueueItem(item: OfflineQueueItem): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['offline_queue'], 'readwrite');
    const store = transaction.objectStore('offline_queue');
    
    return this.putData(store, item);
  }

  private async updateSyncStatus(status: any): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['sync_status'], 'readwrite');
    const store = transaction.objectStore('sync_status');
    
    return this.putData(store, { key: 'last_sync', ...status });
  }

  // Public API
  get online(): boolean {
    return this.isOnline;
  }

  get syncing(): boolean {
    return this.syncInProgress;
  }
}

// Global offline manager instance
export const offlineManager = new OfflineManager();