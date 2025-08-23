'use client';

import {
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Unsubscribe,
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  doc,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { journalCache } from './cache';
import {
  JournalEntry,
  JournalEntryFirestore,
  SubscriptionOptions,
  SubscriptionState,
  DatabaseError,
  DatabaseErrorCode,
  COLLECTIONS
} from '@/types/journal';

// Real-time subscription manager with optimizations
export class RealtimeManager {
  private subscriptions = new Map<string, ActiveSubscription>();
  private connectionState: ConnectionState = {
    isConnected: true,
    lastHeartbeat: new Date(),
    reconnectAttempts: 0,
    latency: 0
  };
  private listeners: ((state: SubscriptionState) => void)[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private batchedUpdates = new Map<string, BatchedUpdate>();
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.startHeartbeat();
    this.setupConnectionMonitoring();
  }

  // Start connection heartbeat
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.checkConnection();
    }, 30000); // Check every 30 seconds
  }

  // Setup connection monitoring
  private setupConnectionMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor network status
    window.addEventListener('online', () => {
      this.handleConnectionChange(true);
    });

    window.addEventListener('offline', () => {
      this.handleConnectionChange(false);
    });

    // Monitor visibility changes for subscription management
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseNonEssentialSubscriptions();
      } else {
        this.resumeSubscriptions();
      }
    });
  }

  // Check connection health
  private async checkConnection(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Simple heartbeat to test connection
      const testQuery = query(
        collection(db, COLLECTIONS.JOURNAL_ENTRIES),
        limit(1)
      );
      
      await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
          testQuery,
          () => {
            unsubscribe();
            resolve(true);
          },
          (error) => {
            unsubscribe();
            reject(error);
          }
        );
      });

      const latency = Date.now() - startTime;
      
      this.connectionState = {
        isConnected: true,
        lastHeartbeat: new Date(),
        reconnectAttempts: 0,
        latency
      };

      this.notifyListeners();
    } catch (error) {
      console.warn('[RealtimeManager] Connection check failed:', error);
      this.handleConnectionLoss();
    }
  }

  // Handle connection changes
  private handleConnectionChange(isOnline: boolean): void {
    if (isOnline) {
      this.handleConnectionRestore();
    } else {
      this.handleConnectionLoss();
    }
  }

  // Handle connection loss
  private handleConnectionLoss(): void {
    this.connectionState.isConnected = false;
    this.connectionState.reconnectAttempts++;

    // Pause subscriptions to reduce error noise
    this.pauseSubscriptions();

    // Schedule reconnection attempt with exponential backoff
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const backoffDelay = Math.min(
      1000 * Math.pow(2, this.connectionState.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    this.reconnectTimeout = setTimeout(() => {
      this.attemptReconnection();
    }, backoffDelay);

    this.notifyListeners();
  }

  // Handle connection restoration
  private handleConnectionRestore(): void {
    this.connectionState.isConnected = true;
    this.connectionState.reconnectAttempts = 0;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Resume all subscriptions
    this.resumeSubscriptions();
    this.notifyListeners();
  }

  // Attempt to reconnect
  private async attemptReconnection(): Promise<void> {
    try {
      await this.checkConnection();
      console.log('[RealtimeManager] Reconnection successful');
    } catch (error) {
      console.warn('[RealtimeManager] Reconnection failed, will retry');
      this.handleConnectionLoss();
    }
  }

  // Pause subscriptions (reduce resource usage)
  private pauseSubscriptions(): void {
    for (const subscription of this.subscriptions.values()) {
      if (subscription.unsubscribe && !subscription.isPaused) {
        subscription.unsubscribe();
        subscription.isPaused = true;
      }
    }
  }

  // Pause only non-essential subscriptions
  private pauseNonEssentialSubscriptions(): void {
    for (const subscription of this.subscriptions.values()) {
      if (!subscription.options.essential && subscription.unsubscribe && !subscription.isPaused) {
        subscription.unsubscribe();
        subscription.isPaused = true;
      }
    }
  }

  // Resume all subscriptions
  private resumeSubscriptions(): void {
    for (const [subscriptionId, subscription] of this.subscriptions.entries()) {
      if (subscription.isPaused) {
        this.restartSubscription(subscriptionId, subscription);
      }
    }
  }

  // Restart a specific subscription
  private restartSubscription(subscriptionId: string, subscription: ActiveSubscription): void {
    try {
      const unsubscribe = onSnapshot(
        subscription.query,
        {
          includeMetadataChanges: subscription.options.includeMetadataChanges || false
        },
        (snapshot) => this.handleQuerySnapshot(subscriptionId, snapshot),
        (error) => this.handleSubscriptionError(subscriptionId, error)
      );

      subscription.unsubscribe = unsubscribe;
      subscription.isPaused = false;
      subscription.lastUpdate = new Date();
    } catch (error) {
      console.error('[RealtimeManager] Failed to restart subscription:', subscriptionId, error);
    }
  }

  // Handle query snapshot with batching and optimizations
  private handleQuerySnapshot(subscriptionId: string, snapshot: QuerySnapshot): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    try {
      // Detect and handle different types of changes
      const changes = this.analyzeChanges(snapshot);
      
      // Update subscription state
      subscription.lastUpdate = new Date();
      subscription.documentCount = snapshot.size;
      subscription.fromCache = snapshot.metadata.fromCache;

      // Process changes efficiently
      if (subscription.options.batchUpdates) {
        this.batchUpdate(subscriptionId, changes);
      } else {
        this.processChangesImmediately(subscriptionId, changes);
      }

    } catch (error) {
      console.error('[RealtimeManager] Error processing snapshot:', error);
      this.handleSubscriptionError(subscriptionId, error);
    }
  }

  // Analyze changes in snapshot
  private analyzeChanges(snapshot: QuerySnapshot): ProcessedChanges {
    const added: JournalEntry[] = [];
    const modified: JournalEntry[] = [];
    const removed: string[] = [];

    snapshot.docChanges().forEach((change) => {
      const data = change.doc.data() as JournalEntryFirestore;
      const entry = this.serializeEntry(data, change.doc.id);

      switch (change.type) {
        case 'added':
          added.push(entry);
          break;
        case 'modified':
          modified.push(entry);
          break;
        case 'removed':
          removed.push(change.doc.id);
          break;
      }
    });

    return { added, modified, removed };
  }

  // Batch updates for performance
  private batchUpdate(subscriptionId: string, changes: ProcessedChanges): void {
    const existing = this.batchedUpdates.get(subscriptionId);
    
    if (existing) {
      // Merge with existing batch
      existing.changes.added.push(...changes.added);
      existing.changes.modified.push(...changes.modified);
      existing.changes.removed.push(...changes.removed);
      existing.lastUpdate = new Date();
    } else {
      // Create new batch
      this.batchedUpdates.set(subscriptionId, {
        subscriptionId,
        changes,
        lastUpdate: new Date()
      });
    }

    // Schedule batch processing
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.processBatchedUpdates();
      }, 100); // 100ms batch window
    }
  }

  // Process batched updates
  private processBatchedUpdates(): void {
    for (const batch of this.batchedUpdates.values()) {
      this.processChangesImmediately(batch.subscriptionId, batch.changes);
    }

    this.batchedUpdates.clear();
    this.batchTimeout = null;
  }

  // Process changes immediately
  private processChangesImmediately(subscriptionId: string, changes: ProcessedChanges): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    try {
      // Update cache if enabled
      if (subscription.options.updateCache) {
        this.updateCache(subscription.userId, changes);
      }

      // Notify callback
      subscription.callback(changes, null);

    } catch (error) {
      console.error('[RealtimeManager] Error processing changes:', error);
      subscription.callback(changes, this.mapFirestoreError(error));
    }
  }

  // Update cache with changes
  private updateCache(userId: string, changes: ProcessedChanges): void {
    // Get current cached entries
    let cachedEntries = journalCache.getJournals(userId) || [];

    // Apply additions
    for (const entry of changes.added) {
      const existingIndex = cachedEntries.findIndex(e => e.id === entry.id);
      if (existingIndex === -1) {
        cachedEntries.unshift(entry); // Add to beginning
      }
    }

    // Apply modifications
    for (const entry of changes.modified) {
      const existingIndex = cachedEntries.findIndex(e => e.id === entry.id);
      if (existingIndex >= 0) {
        cachedEntries[existingIndex] = entry;
      }
    }

    // Apply removals
    for (const entryId of changes.removed) {
      cachedEntries = cachedEntries.filter(e => e.id !== entryId);
    }

    // Sort by creation date (newest first)
    cachedEntries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Update cache
    journalCache.setJournals(userId, cachedEntries);
  }

  // Handle subscription errors
  private handleSubscriptionError(subscriptionId: string, error: any): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    console.error('[RealtimeManager] Subscription error:', subscriptionId, error);

    const dbError = this.mapFirestoreError(error);
    subscription.callback({ added: [], modified: [], removed: [] }, dbError);

    // Attempt to restart subscription after a delay
    setTimeout(() => {
      if (this.subscriptions.has(subscriptionId)) {
        this.restartSubscription(subscriptionId, subscription);
      }
    }, 5000);
  }

  // Serialize Firestore entry
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

  // Map Firestore errors
  private mapFirestoreError(error: any): DatabaseError {
    const message = error.message || 'Unknown database error';
    
    let code: DatabaseErrorCode;
    switch (error.code) {
      case 'permission-denied':
        code = DatabaseErrorCode.PERMISSION_DENIED;
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

  // Notify state listeners
  private notifyListeners(): void {
    const state: SubscriptionState = {
      isActive: this.subscriptions.size > 0,
      isOnline: this.connectionState.isConnected,
      lastUpdate: this.connectionState.lastHeartbeat,
      error: this.connectionState.isConnected ? null : 'Connection lost',
      pendingChanges: Array.from(this.subscriptions.values())
        .reduce((sum, sub) => sum + (sub.fromCache ? 1 : 0), 0)
    };

    this.listeners.forEach(listener => listener(state));
  }

  // Public API

  // Subscribe to journal entries with optimizations
  subscribeToEntries(
    userId: string,
    options: EnhancedSubscriptionOptions = {},
    callback: (changes: ProcessedChanges, error?: DatabaseError) => void
  ): string {
    const subscriptionId = `entries_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Build optimized query
    let q = query(
      collection(db, COLLECTIONS.JOURNAL_ENTRIES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    // Apply filters
    if (options.maxEntries) {
      q = query(q, limit(options.maxEntries));
    }

    if (options.onlyRecent) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      q = query(q, where('createdAt', '>=', thirtyDaysAgo));
    }

    // Create subscription
    const subscription: ActiveSubscription = {
      id: subscriptionId,
      userId,
      query: q,
      callback,
      options: {
        updateCache: true,
        batchUpdates: true,
        essential: false,
        includeMetadataChanges: false,
        ...options
      },
      unsubscribe: null,
      isPaused: false,
      lastUpdate: new Date(),
      documentCount: 0,
      fromCache: false
    };

    // Start subscription
    try {
      const unsubscribe = onSnapshot(
        q,
        {
          includeMetadataChanges: subscription.options.includeMetadataChanges
        },
        (snapshot) => this.handleQuerySnapshot(subscriptionId, snapshot),
        (error) => this.handleSubscriptionError(subscriptionId, error)
      );

      subscription.unsubscribe = unsubscribe;
      this.subscriptions.set(subscriptionId, subscription);

      console.log('[RealtimeManager] Subscription started:', subscriptionId);
      return subscriptionId;
    } catch (error) {
      console.error('[RealtimeManager] Failed to start subscription:', error);
      throw this.mapFirestoreError(error);
    }
  }

  // Unsubscribe from updates
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription && subscription.unsubscribe) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log('[RealtimeManager] Subscription stopped:', subscriptionId);
    }
  }

  // Unsubscribe all
  unsubscribeAll(): void {
    for (const [subscriptionId, subscription] of this.subscriptions.entries()) {
      if (subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    }
    this.subscriptions.clear();
    console.log('[RealtimeManager] All subscriptions stopped');
  }

  // Subscribe to state changes
  onStateChange(listener: (state: SubscriptionState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get current state
  getState(): SubscriptionState {
    return {
      isActive: this.subscriptions.size > 0,
      isOnline: this.connectionState.isConnected,
      lastUpdate: this.connectionState.lastHeartbeat,
      error: this.connectionState.isConnected ? null : 'Connection lost',
      pendingChanges: Array.from(this.subscriptions.values())
        .reduce((sum, sub) => sum + (sub.fromCache ? 1 : 0), 0)
    };
  }

  // Get subscription info
  getSubscriptionInfo(): SubscriptionInfo[] {
    return Array.from(this.subscriptions.values()).map(sub => ({
      id: sub.id,
      userId: sub.userId,
      documentCount: sub.documentCount,
      lastUpdate: sub.lastUpdate,
      fromCache: sub.fromCache,
      isPaused: sub.isPaused
    }));
  }

  // Get connection metrics
  getConnectionMetrics(): ConnectionMetrics {
    return {
      isConnected: this.connectionState.isConnected,
      latency: this.connectionState.latency,
      reconnectAttempts: this.connectionState.reconnectAttempts,
      activeSubscriptions: this.subscriptions.size,
      lastHeartbeat: this.connectionState.lastHeartbeat
    };
  }

  // Cleanup
  destroy(): void {
    this.unsubscribeAll();
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    
    this.listeners = [];
  }
}

// Interfaces for real-time functionality

interface ActiveSubscription {
  id: string;
  userId: string;
  query: any;
  callback: (changes: ProcessedChanges, error?: DatabaseError) => void;
  options: EnhancedSubscriptionOptions;
  unsubscribe: Unsubscribe | null;
  isPaused: boolean;
  lastUpdate: Date;
  documentCount: number;
  fromCache: boolean;
}

interface EnhancedSubscriptionOptions extends SubscriptionOptions {
  updateCache?: boolean;
  batchUpdates?: boolean;
  essential?: boolean;
  includeMetadataChanges?: boolean;
}

interface ProcessedChanges {
  added: JournalEntry[];
  modified: JournalEntry[];
  removed: string[];
}

interface BatchedUpdate {
  subscriptionId: string;
  changes: ProcessedChanges;
  lastUpdate: Date;
}

interface ConnectionState {
  isConnected: boolean;
  lastHeartbeat: Date;
  reconnectAttempts: number;
  latency: number;
}

interface SubscriptionInfo {
  id: string;
  userId: string;
  documentCount: number;
  lastUpdate: Date;
  fromCache: boolean;
  isPaused: boolean;
}

interface ConnectionMetrics {
  isConnected: boolean;
  latency: number;
  reconnectAttempts: number;
  activeSubscriptions: number;
  lastHeartbeat: Date;
}

// Export singleton instance
export const realtimeManager = new RealtimeManager();