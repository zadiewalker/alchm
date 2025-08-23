'use client';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  writeBatch,
  enableNetwork,
  disableNetwork,
  connectFirestoreEmulator,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  enableIndexedDbPersistence,
  clearIndexedDbPersistence
} from 'firebase/firestore';
import { db } from './firebase';
import {
  JournalEntry,
  JournalEntryFirestore,
  JournalQueryOptions,
  BatchOperation,
  SubscriptionOptions,
  SearchOptions,
  SearchResult,
  JournalStats,
  OfflineQueueItem,
  SubscriptionState,
  QueryPerformance,
  DatabaseError,
  DatabaseErrorCode,
  COLLECTIONS
} from '../types/journal';

// Performance monitoring
class PerformanceMonitor {
  private metrics: QueryPerformance[] = [];
  private readonly maxMetrics = 100;

  startQuery(queryType: string): () => QueryPerformance {
    const startTime = Date.now();
    let documentsRead = 0;
    let cacheHit = false;

    return () => {
      const duration = Date.now() - startTime;
      const metric: QueryPerformance = {
        queryType,
        duration,
        documentsRead,
        cacheHit,
        timestamp: new Date()
      };

      this.metrics.push(metric);
      if (this.metrics.length > this.maxMetrics) {
        this.metrics.shift();
      }

      return metric;
    };
  }

  getMetrics(): QueryPerformance[] {
    return [...this.metrics];
  }

  getAverageQueryTime(queryType?: string): number {
    const relevantMetrics = queryType 
      ? this.metrics.filter(m => m.queryType === queryType)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    
    const totalTime = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalTime / relevantMetrics.length;
  }
}

// Offline queue manager
class OfflineQueueManager {
  private queue: OfflineQueueItem[] = [];
  private isProcessing = false;
  private readonly storageKey = 'alchm_offline_queue';

  constructor() {
    this.loadQueue();
  }

  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.warn('[OfflineQueue] Failed to load queue:', error);
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.warn('[OfflineQueue] Failed to save queue:', error);
    }
  }

  addToQueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retryCount'>): void {
    const queueItem: OfflineQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      retryCount: 0,
      ...item
    };

    this.queue.push(queueItem);
    this.saveQueue();
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const processedItems: string[] = [];

    try {
      for (const item of this.queue) {
        try {
          await this.processQueueItem(item);
          processedItems.push(item.id);
        } catch (error) {
          console.error('[OfflineQueue] Failed to process item:', error);
          
          // Increment retry count
          item.retryCount++;
          if (item.retryCount >= item.maxRetries) {
            processedItems.push(item.id); // Remove from queue
            console.warn('[OfflineQueue] Max retries reached for item:', item.id);
          }
        }
      }

      // Remove processed items
      this.queue = this.queue.filter(item => !processedItems.includes(item.id));
      this.saveQueue();

    } finally {
      this.isProcessing = false;
    }
  }

  private async processQueueItem(item: OfflineQueueItem): Promise<void> {
    const collectionRef = collection(db, item.collection);

    switch (item.operation) {
      case 'create':
        await addDoc(collectionRef, item.data);
        break;
      case 'update':
        if (!item.docId) throw new Error('Document ID required for update');
        await updateDoc(doc(db, item.collection, item.docId), item.data);
        break;
      case 'delete':
        if (!item.docId) throw new Error('Document ID required for delete');
        await deleteDoc(doc(db, item.collection, item.docId));
        break;
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }
}

// Optimized Firestore client
export class OptimizedFirestoreClient {
  private performanceMonitor = new PerformanceMonitor();
  private offlineQueue = new OfflineQueueManager();
  private subscriptionState: SubscriptionState = {
    isActive: false,
    isOnline: navigator.onLine,
    lastUpdate: null,
    error: null,
    pendingChanges: 0
  };
  private activeSubscriptions = new Map<string, Unsubscribe>();

  constructor() {
    this.initializeOfflineSupport();
    this.setupNetworkMonitoring();
  }

  // Initialize offline persistence
  private async initializeOfflineSupport(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        await enableIndexedDbPersistence(db, {
          forceOwnership: true
        });
        console.log('[Firestore] Offline persistence enabled');
      }
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        console.warn('[Firestore] Multiple tabs open, persistence only available in one tab');
      } else if (error.code === 'unimplemented') {
        console.warn('[Firestore] Persistence not supported in this browser');
      } else {
        console.error('[Firestore] Failed to enable persistence:', error);
      }
    }
  }

  // Setup network monitoring
  private setupNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.subscriptionState.isOnline = true;
      enableNetwork(db);
      this.offlineQueue.processQueue();
      console.log('[Firestore] Network connection restored');
    });

    window.addEventListener('offline', () => {
      this.subscriptionState.isOnline = false;
      disableNetwork(db);
      console.log('[Firestore] Network connection lost');
    });
  }

  // Data serialization helpers
  private serializeEntry(entry: JournalEntryFirestore, id: string): JournalEntry {
    return {
      id,
      userId: entry.userId,
      title: entry.title,
      content: entry.content,
      emotion: entry.emotion,
      mood: entry.mood,
      tags: entry.tags || [],
      isPrivate: entry.isPrivate,
      createdAt: entry.createdAt.toDate(),
      updatedAt: entry.updatedAt.toDate(),
      version: entry.version,
      analysis: entry.analysis ? {
        ...entry.analysis,
        processedAt: entry.analysis.processedAt.toDate()
      } : undefined,
      traumaIndicators: entry.traumaIndicators ? {
        ...entry.traumaIndicators,
        assessedAt: entry.traumaIndicators.assessedAt.toDate()
      } : undefined
    };
  }

  private deserializeEntry(entry: Partial<JournalEntry>): Partial<JournalEntryFirestore> {
    const result: Partial<JournalEntryFirestore> = {
      ...entry,
      createdAt: entry.createdAt ? Timestamp.fromDate(entry.createdAt) : undefined,
      updatedAt: entry.updatedAt ? Timestamp.fromDate(entry.updatedAt) : undefined
    };

    if (entry.analysis) {
      result.analysis = {
        ...entry.analysis,
        processedAt: Timestamp.fromDate(entry.analysis.processedAt)
      };
    }

    if (entry.traumaIndicators) {
      result.traumaIndicators = {
        ...entry.traumaIndicators,
        assessedAt: Timestamp.fromDate(entry.traumaIndicators.assessedAt)
      };
    }

    delete result.id; // Remove ID from data
    return result;
  }

  // Enhanced query builder
  private buildQuery(userId: string, options: JournalQueryOptions = {}) {
    const endQuery = this.performanceMonitor.startQuery('buildQuery');
    
    let q = query(
      collection(db, COLLECTIONS.JOURNAL_ENTRIES),
      where('userId', '==', userId)
    );

    // Apply additional where clauses
    if (options.where) {
      for (const condition of options.where) {
        q = query(q, where(condition.field as string, condition.operator, condition.value));
      }
    }

    // Apply ordering
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc')); // Default ordering
    }

    // Apply pagination
    if (options.startAfter) {
      const startAfterDoc = doc(db, COLLECTIONS.JOURNAL_ENTRIES, options.startAfter);
      q = query(q, startAfter(startAfterDoc));
    }

    // Apply limit
    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    endQuery();
    return q;
  }

  // Optimized CRUD operations

  async createEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<string> {
    const endQuery = this.performanceMonitor.startQuery('createEntry');

    try {
      const now = new Date();
      const firestoreEntry: Omit<JournalEntryFirestore, 'version'> = {
        ...this.deserializeEntry({
          ...entry,
          createdAt: now,
          updatedAt: now
        }) as JournalEntryFirestore,
        version: 1
      };

      if (this.subscriptionState.isOnline) {
        const docRef = await addDoc(collection(db, COLLECTIONS.JOURNAL_ENTRIES), firestoreEntry);
        return docRef.id;
      } else {
        // Add to offline queue
        const tempId = `temp_${Date.now()}`;
        this.offlineQueue.addToQueue({
          operation: 'create',
          collection: COLLECTIONS.JOURNAL_ENTRIES,
          data: firestoreEntry,
          maxRetries: 3
        });
        return tempId;
      }
    } catch (error) {
      console.error('[Firestore] Create entry failed:', error);
      throw this.mapFirestoreError(error);
    } finally {
      endQuery();
    }
  }

  async getEntry(userId: string, entryId: string): Promise<JournalEntry | null> {
    const endQuery = this.performanceMonitor.startQuery('getEntry');

    try {
      const docRef = doc(db, COLLECTIONS.JOURNAL_ENTRIES, entryId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data() as JournalEntryFirestore;
      
      // Verify ownership
      if (data.userId !== userId) {
        throw new Error('Access denied');
      }

      return this.serializeEntry(data, docSnap.id);
    } catch (error) {
      console.error('[Firestore] Get entry failed:', error);
      throw this.mapFirestoreError(error);
    } finally {
      endQuery();
    }
  }

  async getEntries(userId: string, options: JournalQueryOptions = {}): Promise<JournalEntry[]> {
    const endQuery = this.performanceMonitor.startQuery('getEntries');

    try {
      const q = this.buildQuery(userId, options);
      const querySnapshot = await getDocs(q);

      const entries: JournalEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as JournalEntryFirestore;
        entries.push(this.serializeEntry(data, doc.id));
      });

      return entries;
    } catch (error) {
      console.error('[Firestore] Get entries failed:', error);
      throw this.mapFirestoreError(error);
    } finally {
      endQuery();
    }
  }

  async updateEntry(userId: string, entryId: string, updates: Partial<JournalEntry>): Promise<void> {
    const endQuery = this.performanceMonitor.startQuery('updateEntry');

    try {
      const docRef = doc(db, COLLECTIONS.JOURNAL_ENTRIES, entryId);
      
      // Verify ownership first
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Entry not found');
      }

      const existingData = docSnap.data() as JournalEntryFirestore;
      if (existingData.userId !== userId) {
        throw new Error('Access denied');
      }

      const updateData = {
        ...this.deserializeEntry(updates),
        updatedAt: Timestamp.now(),
        version: existingData.version + 1
      };

      if (this.subscriptionState.isOnline) {
        await updateDoc(docRef, updateData);
      } else {
        this.offlineQueue.addToQueue({
          operation: 'update',
          collection: COLLECTIONS.JOURNAL_ENTRIES,
          docId: entryId,
          data: updateData,
          maxRetries: 3
        });
      }
    } catch (error) {
      console.error('[Firestore] Update entry failed:', error);
      throw this.mapFirestoreError(error);
    } finally {
      endQuery();
    }
  }

  async deleteEntry(userId: string, entryId: string): Promise<void> {
    const endQuery = this.performanceMonitor.startQuery('deleteEntry');

    try {
      const docRef = doc(db, COLLECTIONS.JOURNAL_ENTRIES, entryId);
      
      // Verify ownership first
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Entry not found');
      }

      const existingData = docSnap.data() as JournalEntryFirestore;
      if (existingData.userId !== userId) {
        throw new Error('Access denied');
      }

      if (this.subscriptionState.isOnline) {
        await deleteDoc(docRef);
      } else {
        this.offlineQueue.addToQueue({
          operation: 'delete',
          collection: COLLECTIONS.JOURNAL_ENTRIES,
          docId: entryId,
          data: {},
          maxRetries: 3
        });
      }
    } catch (error) {
      console.error('[Firestore] Delete entry failed:', error);
      throw this.mapFirestoreError(error);
    } finally {
      endQuery();
    }
  }

  // Optimized real-time subscriptions
  subscribeToEntries(
    userId: string, 
    options: SubscriptionOptions = {},
    callback: (entries: JournalEntry[], error?: DatabaseError) => void
  ): string {
    const subscriptionId = `entries_${userId}_${Date.now()}`;
    
    let q = query(
      collection(db, COLLECTIONS.JOURNAL_ENTRIES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (options.onlyRecent) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      q = query(q, where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo)));
    }

    if (options.maxEntries) {
      q = query(q, limit(options.maxEntries));
    }

    const unsubscribe = onSnapshot(
      q,
      {
        includeMetadataChanges: true
      },
      (snapshot) => {
        try {
          const entries: JournalEntry[] = [];
          snapshot.forEach((doc) => {
            if (!doc.metadata.hasPendingWrites) { // Only include synced data
              const data = doc.data() as JournalEntryFirestore;
              entries.push(this.serializeEntry(data, doc.id));
            }
          });

          this.subscriptionState.lastUpdate = new Date();
          this.subscriptionState.error = null;
          this.subscriptionState.pendingChanges = snapshot.docs.filter(d => d.metadata.hasPendingWrites).length;
          
          callback(entries);
        } catch (error) {
          const dbError = this.mapFirestoreError(error);
          this.subscriptionState.error = dbError.message;
          callback([], dbError);
        }
      },
      (error) => {
        const dbError = this.mapFirestoreError(error);
        this.subscriptionState.error = dbError.message;
        callback([], dbError);
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.subscriptionState.isActive = true;

    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): void {
    const unsubscribe = this.activeSubscriptions.get(subscriptionId);
    if (unsubscribe) {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
    }

    if (this.activeSubscriptions.size === 0) {
      this.subscriptionState.isActive = false;
    }
  }

  unsubscribeAll(): void {
    for (const unsubscribe of this.activeSubscriptions.values()) {
      unsubscribe();
    }
    this.activeSubscriptions.clear();
    this.subscriptionState.isActive = false;
  }

  // Batch operations for performance
  async batchOperations(userId: string, operations: BatchOperation[]): Promise<void> {
    const endQuery = this.performanceMonitor.startQuery('batchOperations');

    try {
      const batch = writeBatch(db);
      const now = Timestamp.now();

      for (const operation of operations) {
        switch (operation.type) {
          case 'create': {
            const docRef = doc(collection(db, COLLECTIONS.JOURNAL_ENTRIES));
            const data = {
              ...this.deserializeEntry(operation.entry as JournalEntry),
              userId,
              createdAt: now,
              updatedAt: now,
              version: 1
            };
            batch.set(docRef, data);
            break;
          }
          case 'update': {
            if (!operation.id) throw new Error('ID required for update operation');
            const docRef = doc(db, COLLECTIONS.JOURNAL_ENTRIES, operation.id);
            const data = {
              ...this.deserializeEntry(operation.entry),
              updatedAt: now
            };
            batch.update(docRef, data);
            break;
          }
          case 'delete': {
            if (!operation.id) throw new Error('ID required for delete operation');
            const docRef = doc(db, COLLECTIONS.JOURNAL_ENTRIES, operation.id);
            batch.delete(docRef);
            break;
          }
        }
      }

      await batch.commit();
    } catch (error) {
      console.error('[Firestore] Batch operations failed:', error);
      throw this.mapFirestoreError(error);
    } finally {
      endQuery();
    }
  }

  // Error mapping
  private mapFirestoreError(error: any): DatabaseError {
    const message = error.message || 'Unknown database error';
    
    let code: DatabaseErrorCode;
    switch (error.code) {
      case 'permission-denied':
        code = DatabaseErrorCode.PERMISSION_DENIED;
        break;
      case 'not-found':
        code = DatabaseErrorCode.NOT_FOUND;
        break;
      case 'already-exists':
        code = DatabaseErrorCode.ALREADY_EXISTS;
        break;
      case 'invalid-argument':
        code = DatabaseErrorCode.INVALID_ARGUMENT;
        break;
      case 'resource-exhausted':
        code = DatabaseErrorCode.QUOTA_EXCEEDED;
        break;
      case 'unavailable':
        code = DatabaseErrorCode.NETWORK_ERROR;
        break;
      default:
        code = DatabaseErrorCode.NETWORK_ERROR;
    }

    return {
      code,
      message,
      details: error
    };
  }

  // Utility methods
  getSubscriptionState(): SubscriptionState {
    return { ...this.subscriptionState };
  }

  getPerformanceMetrics(): QueryPerformance[] {
    return this.performanceMonitor.getMetrics();
  }

  getOfflineQueueSize(): number {
    return this.offlineQueue.getQueueSize();
  }

  async clearOfflineData(): Promise<void> {
    try {
      await clearIndexedDbPersistence(db);
      this.offlineQueue.clearQueue();
      console.log('[Firestore] Offline data cleared');
    } catch (error) {
      console.error('[Firestore] Failed to clear offline data:', error);
    }
  }
}

// Export singleton instance
export const firestoreClient = new OptimizedFirestoreClient();