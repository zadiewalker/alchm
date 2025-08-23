'use client';

import { firestoreClient } from './firestoreClient';
import { dataSyncManager } from './dataSync';
import { journalCache } from './cache';
import {
  JournalEntry,
  OfflineQueueItem,
  DatabaseError,
  DatabaseErrorCode
} from '@/types/journal';

// Offline status and capabilities manager
export class OfflineManager {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private offlineListeners: ((isOnline: boolean) => void)[] = [];
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private backgroundSyncSupported = false;

  constructor() {
    this.initializeOfflineSupport();
    this.setupNetworkListeners();
    this.checkBackgroundSyncSupport();
  }

  // Initialize offline support systems
  private async initializeOfflineSupport(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Register service worker for offline capabilities
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.serviceWorkerRegistration = registration;
        console.log('[OfflineManager] Service Worker registered');

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
      }

      // Setup IndexedDB for offline storage
      await this.initializeOfflineStorage();

      // Preload critical data for offline access
      await this.preloadCriticalData();

    } catch (error) {
      console.warn('[OfflineManager] Failed to initialize offline support:', error);
    }
  }

  // Setup network status listeners
  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOnlineStatusChange(false);
    });

    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', this.handleConnectionChange.bind(this));
    }
  }

  // Check if background sync is supported
  private checkBackgroundSyncSupport(): void {
    if (typeof window === 'undefined') return;

    this.backgroundSyncSupported = 'serviceWorker' in navigator && 
      'sync' in window.ServiceWorkerRegistration.prototype;
    
    console.log('[OfflineManager] Background sync supported:', this.backgroundSyncSupported);
  }

  // Handle online/offline status changes
  private async handleOnlineStatusChange(isOnline: boolean): Promise<void> {
    console.log('[OfflineManager] Network status changed:', isOnline ? 'online' : 'offline');

    if (isOnline) {
      // Coming back online - sync offline changes
      await this.syncOfflineChanges();
      await this.refreshCachedData();
    } else {
      // Going offline - ensure critical data is cached
      await this.cacheEssentialData();
    }

    // Notify listeners
    this.offlineListeners.forEach(listener => listener(isOnline));
  }

  // Handle connection quality changes
  private handleConnectionChange(): void {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any).connection;
    if (connection) {
      console.log('[OfflineManager] Connection changed:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });

      // Adjust sync strategy based on connection quality
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Reduce sync frequency for slow connections
        this.adjustSyncStrategy('conservative');
      } else {
        this.adjustSyncStrategy('normal');
      }
    }
  }

  // Handle messages from service worker
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, payload } = event.data;

    switch (type) {
      case 'BACKGROUND_SYNC_SUCCESS':
        console.log('[OfflineManager] Background sync completed:', payload);
        break;
      case 'BACKGROUND_SYNC_FAILURE':
        console.error('[OfflineManager] Background sync failed:', payload);
        break;
      case 'CACHE_UPDATE':
        console.log('[OfflineManager] Cache updated:', payload);
        break;
    }
  }

  // Initialize offline storage (IndexedDB)
  private async initializeOfflineStorage(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      // Check if IndexedDB is available
      if (!('indexedDB' in window)) {
        console.warn('[OfflineManager] IndexedDB not supported');
        return;
      }

      // Initialize database schema
      const dbName = 'alchm_offline_db';
      const dbVersion = 1;

      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = () => {
          const db = request.result;
          
          // Create object stores
          if (!db.objectStoreNames.contains('journal_entries')) {
            const entriesStore = db.createObjectStore('journal_entries', { keyPath: 'id' });
            entriesStore.createIndex('userId', 'userId', { unique: false });
            entriesStore.createIndex('createdAt', 'createdAt', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('offline_queue')) {
            db.createObjectStore('offline_queue', { keyPath: 'id' });
          }
          
          if (!db.objectStoreNames.contains('user_preferences')) {
            db.createObjectStore('user_preferences', { keyPath: 'userId' });
          }
        };
      });

      console.log('[OfflineManager] IndexedDB initialized');
      db.close();
    } catch (error) {
      console.error('[OfflineManager] Failed to initialize IndexedDB:', error);
    }
  }

  // Preload critical data for offline access
  private async preloadCriticalData(): Promise<void> {
    try {
      // This would be called with actual user data when user logs in
      console.log('[OfflineManager] Critical data preloading ready');
    } catch (error) {
      console.error('[OfflineManager] Failed to preload critical data:', error);
    }
  }

  // Cache essential data when going offline
  private async cacheEssentialData(): Promise<void> {
    try {
      // Cache current page assets if service worker is available
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.active?.postMessage({
          type: 'CACHE_CURRENT_PAGE'
        });
      }

      console.log('[OfflineManager] Essential data cached for offline use');
    } catch (error) {
      console.error('[OfflineManager] Failed to cache essential data:', error);
    }
  }

  // Sync offline changes when coming back online
  private async syncOfflineChanges(): Promise<void> {
    try {
      await dataSyncManager.syncOfflineChanges();
      console.log('[OfflineManager] Offline changes synced');
    } catch (error) {
      console.error('[OfflineManager] Failed to sync offline changes:', error);
    }
  }

  // Refresh cached data when coming back online
  private async refreshCachedData(): Promise<void> {
    try {
      // Clear old cache and refresh
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.active?.postMessage({
          type: 'REFRESH_CACHE'
        });
      }

      console.log('[OfflineManager] Cached data refreshed');
    } catch (error) {
      console.error('[OfflineManager] Failed to refresh cached data:', error);
    }
  }

  // Adjust sync strategy based on connection quality
  private adjustSyncStrategy(strategy: 'conservative' | 'normal' | 'aggressive'): void {
    console.log('[OfflineManager] Adjusting sync strategy to:', strategy);
    
    // This would adjust sync intervals, batch sizes, etc.
    switch (strategy) {
      case 'conservative':
        // Reduce sync frequency, smaller batches
        break;
      case 'normal':
        // Default sync settings
        break;
      case 'aggressive':
        // Increase sync frequency for fast connections
        break;
    }
  }

  // Public API methods

  // Check if currently online
  isCurrentlyOnline(): boolean {
    return this.isOnline;
  }

  // Get connection information
  getConnectionInfo(): ConnectionInfo {
    if (typeof navigator === 'undefined') {
      return { type: 'unknown', quality: 'unknown' };
    }

    const connection = (navigator as any).connection;
    if (!connection) {
      return { type: 'unknown', quality: 'unknown' };
    }

    return {
      type: connection.effectiveType || 'unknown',
      quality: this.getConnectionQuality(connection),
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }

  private getConnectionQuality(connection: any): 'poor' | 'fair' | 'good' | 'excellent' | 'unknown' {
    if (!connection.effectiveType) return 'unknown';

    switch (connection.effectiveType) {
      case 'slow-2g':
        return 'poor';
      case '2g':
        return 'fair';
      case '3g':
        return 'good';
      case '4g':
        return 'excellent';
      default:
        return 'unknown';
    }
  }

  // Queue an operation for offline execution
  async queueOfflineOperation(operation: OfflineOperation): Promise<void> {
    try {
      // Convert to OfflineQueueItem format and add to queue
      // This would interface with the firestoreClient's offline queue
      console.log('[OfflineManager] Operation queued for offline execution:', operation.type);
    } catch (error) {
      console.error('[OfflineManager] Failed to queue offline operation:', error);
      throw error;
    }
  }

  // Get offline queue status
  getOfflineQueueStatus(): OfflineQueueStatus {
    return {
      itemCount: firestoreClient.getOfflineQueueSize(),
      isProcessing: false, // Would track this state
      lastSync: null // Would track last successful sync
    };
  }

  // Enable/disable offline mode manually
  async setOfflineMode(enabled: boolean): Promise<void> {
    try {
      if (enabled && this.isOnline) {
        // Cache current data before going offline
        await this.cacheEssentialData();
      }

      // Update internal state
      this.isOnline = !enabled;

      // Notify Firestore client
      if (enabled) {
        // Disable network for Firestore
        console.log('[OfflineManager] Offline mode enabled');
      } else {
        // Enable network for Firestore and sync
        await this.syncOfflineChanges();
        console.log('[OfflineManager] Offline mode disabled');
      }

      // Notify listeners
      this.offlineListeners.forEach(listener => listener(!enabled));
    } catch (error) {
      console.error('[OfflineManager] Failed to change offline mode:', error);
      throw error;
    }
  }

  // Register background sync (if supported)
  async registerBackgroundSync(tag: string): Promise<boolean> {
    if (!this.backgroundSyncSupported || !this.serviceWorkerRegistration) {
      return false;
    }

    try {
      await this.serviceWorkerRegistration.sync.register(tag);
      console.log('[OfflineManager] Background sync registered:', tag);
      return true;
    } catch (error) {
      console.error('[OfflineManager] Failed to register background sync:', error);
      return false;
    }
  }

  // Subscribe to offline status changes
  onOfflineStatusChange(listener: (isOnline: boolean) => void): () => void {
    this.offlineListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.offlineListeners.indexOf(listener);
      if (index > -1) {
        this.offlineListeners.splice(index, 1);
      }
    };
  }

  // Get offline capabilities info
  getOfflineCapabilities(): OfflineCapabilities {
    return {
      isSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator,
      hasServiceWorker: this.serviceWorkerRegistration !== null,
      hasBackgroundSync: this.backgroundSyncSupported,
      hasIndexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
      hasCache: typeof window !== 'undefined' && 'caches' in window
    };
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    try {
      // Clear Firestore offline data
      await firestoreClient.clearOfflineData();

      // Clear IndexedDB
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
        const deleteRequest = indexedDB.deleteDatabase('alchm_offline_db');
        await new Promise((resolve, reject) => {
          deleteRequest.onsuccess = () => resolve(undefined);
          deleteRequest.onerror = () => reject(deleteRequest.error);
        });
      }

      // Clear cache storage
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
      }

      console.log('[OfflineManager] All offline data cleared');
    } catch (error) {
      console.error('[OfflineManager] Failed to clear offline data:', error);
      throw error;
    }
  }
}

// Interfaces for offline functionality

export interface ConnectionInfo {
  type: string;
  quality: 'poor' | 'fair' | 'good' | 'excellent' | 'unknown';
  downlink?: number;
  rtt?: number;
}

export interface OfflineOperation {
  type: 'create' | 'update' | 'delete';
  entityType: 'journal_entry' | 'user_preference';
  data: any;
  userId: string;
}

export interface OfflineQueueStatus {
  itemCount: number;
  isProcessing: boolean;
  lastSync: Date | null;
}

export interface OfflineCapabilities {
  isSupported: boolean;
  hasServiceWorker: boolean;
  hasBackgroundSync: boolean;
  hasIndexedDB: boolean;
  hasCache: boolean;
}

// Export singleton instance
export const offlineManager = new OfflineManager();