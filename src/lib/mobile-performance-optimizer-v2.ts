'use client';

/**
 * ALCHM Mobile Performance Optimizer
 * Optimizes for extended journaling sessions, offline capabilities, and crisis-safe performance
 */

import React from 'react';

export interface PerformanceMetrics {
  memoryUsage: number;
  textLength: number;
  sessionDuration: number;
  batteryLevel?: number;
  networkType: string;
  deviceMemory?: number;
}

export interface OfflineCapabilities {
  hasServiceWorker: boolean;
  hasOfflineStorage: boolean;
  hasOfflineCrisisResources: boolean;
  lastSyncTime: number;
  pendingSyncs: number;
}

class MobilePerformanceOptimizer {
  private metrics: PerformanceMetrics;
  private sessionStart: number = Date.now();
  private memoryCleanupInterval: NodeJS.Timeout | null = null;
  private offlineStorage: Map<string, any> = new Map();
  private storeDatabase: IDBDatabase | null = null;
  
  private readonly PERFORMANCE_THRESHOLDS = {
    MAX_MEMORY_USAGE: 50, // MB
    MAX_TEXT_LENGTH: 50000, // characters before chunking
    MEMORY_CLEANUP_INTERVAL: 30000, // 30 seconds
    BATTERY_SAVE_THRESHOLD: 0.2, // 20% battery
  };

  constructor() {
    this.metrics = this.initializeMetrics();
    this.initializePerformanceMonitoring();
    this.initializeMemoryManagement();
    this.initializeOfflineCapabilities();
  }

  private initializeMetrics(): PerformanceMetrics {
    // Check if we're in client-side environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        memoryUsage: 0,
        textLength: 0,
        sessionDuration: 0,
        batteryLevel: undefined,
        networkType: 'unknown',
        deviceMemory: undefined
      };
    }

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    return {
      memoryUsage: this.getMemoryUsage(),
      textLength: 0,
      sessionDuration: 0,
      batteryLevel: undefined,
      networkType: connection?.effectiveType || 'unknown',
      deviceMemory: (navigator as any).deviceMemory || undefined
    };
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  }

  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    try {
      // Monitor battery if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          this.metrics.batteryLevel = battery.level;
          battery.addEventListener('levelchange', () => {
            this.metrics.batteryLevel = battery.level;
            this.optimizeForBattery();
          });
        });
      }

      // Monitor network changes
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        connection.addEventListener('change', () => {
          this.metrics.networkType = connection.effectiveType;
          this.optimizeForNetwork();
        });
      }
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
  }

  private initializeMemoryManagement(): void {
    if (typeof window === 'undefined') return;

    this.memoryCleanupInterval = setInterval(() => {
      this.performMemoryCleanup();
      this.updateSessionMetrics();
    }, this.PERFORMANCE_THRESHOLDS.MEMORY_CLEANUP_INTERVAL);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleAppBackgrounded();
      } else {
        this.handleAppForegrounded();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.saveSessionState();
    });
  }

  private initializeOfflineCapabilities(): void {
    if (typeof window === 'undefined') return;

    this.registerServiceWorker();
    this.initializeOfflineStorage();
    this.cacheOfflineCrisisResources();
    
    window.addEventListener('online', () => {
      console.log('Connection restored - syncing offline data');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost - enabling offline mode');
      this.enableOfflineMode();
    });
  }

  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      await navigator.serviceWorker.register('/crisis-sw.js', { scope: '/' });
      console.log('Service worker registered successfully');
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  }

  private initializeOfflineStorage(): void {
    if ('indexedDB' in window) {
      this.setupIndexedDB();
    } else {
      this.setupLocalStorageFallback();
    }
  }

  private setupIndexedDB(): void {
    const request = indexedDB.open('AlchmOfflineDB', 1);

    request.onerror = () => {
      console.warn('IndexedDB failed, falling back to localStorage');
      this.setupLocalStorageFallback();
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log('IndexedDB initialized successfully');
      this.storeDatabase = db;
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('journalEntries')) {
        db.createObjectStore('journalEntries', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('crisisResources')) {
        db.createObjectStore('crisisResources', { keyPath: 'id' });
      }
    };
  }

  private setupLocalStorageFallback(): void {
    try {
      localStorage.setItem('alchm_test', 'test');
      localStorage.removeItem('alchm_test');
      console.log('Using localStorage for offline storage');
    } catch (error) {
      console.warn('localStorage not available, offline features limited');
    }
  }

  private async cacheOfflineCrisisResources(): Promise<void> {
    const crisisResources = {
      emergency: { us: { number: '911', description: 'Emergency Services' } },
      crisis: { us: { number: '988', description: 'Crisis Lifeline' } },
      supportMessages: {
        en: 'You are not alone. Help is available right now.',
        es: 'No estás solo. La ayuda está disponible ahora mismo.',
        pt: 'Você não está sozinho. A ajuda está disponível agora.',
        ko: '당신은 혼자가 아닙니다. 지금 도움을 받을 수 있습니다.',
        hi: 'आप अकेले नहीं हैं। अभी सहायता उपलब्ध है।',
        de: 'Sie sind nicht allein. Hilfe ist jetzt verfügbar.'
      }
    };

    try {
      if (this.storeDatabase) {
        const transaction = this.storeDatabase.transaction(['crisisResources'], 'readwrite');
        const store = transaction.objectStore('crisisResources');
        await store.put({ id: 'crisis_resources', data: crisisResources });
      } else {
        localStorage.setItem('alchm_crisis_resources', JSON.stringify(crisisResources));
      }
      console.log('Crisis resources cached for offline access');
    } catch (error) {
      console.warn('Failed to cache crisis resources:', error);
    }
  }

  public optimizeTextHandling(text: string): {
    shouldChunk: boolean;
    chunks: string[];
    memoryOptimization: string;
  } {
    const textLength = text.length;
    this.metrics.textLength = textLength;

    const shouldChunk = textLength > this.PERFORMANCE_THRESHOLDS.MAX_TEXT_LENGTH;
    let chunks: string[] = [];
    let memoryOptimization = 'none';

    if (shouldChunk) {
      const chunkSize = Math.floor(this.PERFORMANCE_THRESHOLDS.MAX_TEXT_LENGTH / 2);
      chunks = this.chunkText(text, chunkSize);
      memoryOptimization = 'chunked';
    } else {
      chunks = [text];
    }

    if (this.metrics.deviceMemory && this.metrics.deviceMemory < 4) {
      memoryOptimization = 'aggressive';
      chunks = this.chunkText(text, 1000);
    }

    return { shouldChunk, chunks, memoryOptimization };
  }

  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  public async storeOfflineJournalEntry(entry: {
    id?: string;
    content: string;
    timestamp: number;
    mood?: string;
    synced: boolean;
  }): Promise<boolean> {
    try {
      if (this.storeDatabase) {
        const transaction = this.storeDatabase.transaction(['journalEntries'], 'readwrite');
        const store = transaction.objectStore('journalEntries');
        await store.add(entry);
      } else {
        const entries = JSON.parse(localStorage.getItem('alchm_offline_entries') || '[]');
        entries.push(entry);
        localStorage.setItem('alchm_offline_entries', JSON.stringify(entries));
      }
      return true;
    } catch (error) {
      console.error('Failed to store offline entry:', error);
      return false;
    }
  }

  public async syncOfflineData(): Promise<void> {
    try {
      const offlineEntries = await this.getOfflineJournalEntries();
      const unsyncedEntries = offlineEntries.filter(entry => !entry.synced);

      for (const entry of unsyncedEntries) {
        try {
          const response = await fetch('/api/journal/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
          });

          if (response.ok) {
            entry.synced = true;
            await this.updateOfflineEntry(entry);
          }
        } catch (error) {
          console.warn(`Failed to sync entry ${entry.id}:`, error);
        }
      }

      console.log(`Synced ${unsyncedEntries.length} offline entries`);
    } catch (error) {
      console.error('Offline sync failed:', error);
    }
  }

  private async getOfflineJournalEntries(): Promise<any[]> {
    try {
      if (this.storeDatabase) {
        const transaction = this.storeDatabase.transaction(['journalEntries'], 'readonly');
        const store = transaction.objectStore('journalEntries');
        const request = store.getAll();
        
        return new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } else {
        const entries = JSON.parse(localStorage.getItem('alchm_offline_entries') || '[]');
        return entries;
      }
    } catch (error) {
      console.error('Failed to get offline entries:', error);
      return [];
    }
  }

  private async updateOfflineEntry(entry: any): Promise<void> {
    if (this.storeDatabase) {
      const transaction = this.storeDatabase.transaction(['journalEntries'], 'readwrite');
      const store = transaction.objectStore('journalEntries');
      await store.put(entry);
    } else {
      const entries = JSON.parse(localStorage.getItem('alchm_offline_entries') || '[]');
      const index = entries.findIndex((e: any) => e.id === entry.id);
      if (index !== -1) {
        entries[index] = entry;
        localStorage.setItem('alchm_offline_entries', JSON.stringify(entries));
      }
    }
  }

  private performMemoryCleanup(): void {
    this.metrics.memoryUsage = this.getMemoryUsage();
    
    if (this.metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.MAX_MEMORY_USAGE) {
      console.log(`Memory cleanup triggered: ${this.metrics.memoryUsage}MB used`);
      
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      this.offlineStorage.clear();
      this.dispatchMemoryPressureEvent();
    }
  }

  private dispatchMemoryPressureEvent(): void {
    const event = new CustomEvent('alchm-memory-pressure', {
      detail: { memoryUsage: this.metrics.memoryUsage }
    });
    window.dispatchEvent(event);
  }

  private optimizeForBattery(): void {
    if (!this.metrics.batteryLevel) return;
    
    if (this.metrics.batteryLevel < this.PERFORMANCE_THRESHOLDS.BATTERY_SAVE_THRESHOLD) {
      console.log('Low battery detected - enabling power saving mode');
      
      const event = new CustomEvent('alchm-battery-low', {
        detail: { batteryLevel: this.metrics.batteryLevel }
      });
      window.dispatchEvent(event);
    }
  }

  private optimizeForNetwork(): void {
    const isSlowConnection = this.metrics.networkType === '2g' || this.metrics.networkType === 'slow-2g';
    
    if (isSlowConnection) {
      console.log('Slow connection detected - optimizing for bandwidth');
      
      const event = new CustomEvent('alchm-slow-connection', {
        detail: { networkType: this.metrics.networkType }
      });
      window.dispatchEvent(event);
    }
  }

  private enableOfflineMode(): void {
    console.log('Offline mode enabled');
    
    const event = new CustomEvent('alchm-offline-mode', {
      detail: { 
        hasOfflineStorage: this.storeDatabase !== null || typeof localStorage !== 'undefined',
        offlineCapabilities: this.getOfflineCapabilities()
      }
    });
    window.dispatchEvent(event);
  }

  private handleAppBackgrounded(): void {
    this.saveSessionState();
    console.log('App backgrounded - optimizing for background execution');
  }

  private handleAppForegrounded(): void {
    console.log('App foregrounded - resuming normal operations');
  }

  private saveSessionState(): void {
    const sessionState = {
      metrics: this.metrics,
      sessionStart: this.sessionStart,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('alchm_session_state', JSON.stringify(sessionState));
    } catch (error) {
      console.warn('Failed to save session state:', error);
    }
  }

  private updateSessionMetrics(): void {
    this.metrics.sessionDuration = Date.now() - this.sessionStart;
    this.metrics.memoryUsage = this.getMemoryUsage();
  }

  public getOfflineCapabilities(): OfflineCapabilities {
    return {
      hasServiceWorker: 'serviceWorker' in navigator,
      hasOfflineStorage: this.storeDatabase !== null || typeof localStorage !== 'undefined',
      hasOfflineCrisisResources: this.hasOfflineCrisisResources(),
      lastSyncTime: this.getLastSyncTime(),
      pendingSyncs: 0
    };
  }

  private hasOfflineCrisisResources(): boolean {
    try {
      return localStorage.getItem('alchm_crisis_resources') !== null;
    } catch {
      return false;
    }
  }

  private getLastSyncTime(): number {
    try {
      const lastSync = localStorage.getItem('alchm_last_sync');
      return lastSync ? parseInt(lastSync, 10) : 0;
    } catch {
      return 0;
    }
  }

  public getMetrics(): PerformanceMetrics {
    this.updateSessionMetrics();
    return { ...this.metrics };
  }

  public cleanup(): void {
    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
    }
    
    if (this.storeDatabase) {
      this.storeDatabase.close();
    }
  }
}

export const mobilePerformanceOptimizer = new MobilePerformanceOptimizer();

export function useMobileOptimization() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);
  const [isOffline, setIsOffline] = React.useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(mobilePerformanceOptimizer.getMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    const handleMemoryPressure = () => updateMetrics();
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('alchm-memory-pressure', handleMemoryPressure);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('alchm-memory-pressure', handleMemoryPressure);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    metrics,
    isOffline,
    storeOffline: mobilePerformanceOptimizer.storeOfflineJournalEntry.bind(mobilePerformanceOptimizer),
    syncOfflineData: mobilePerformanceOptimizer.syncOfflineData.bind(mobilePerformanceOptimizer),
    optimizeText: mobilePerformanceOptimizer.optimizeTextHandling.bind(mobilePerformanceOptimizer)
  };
}