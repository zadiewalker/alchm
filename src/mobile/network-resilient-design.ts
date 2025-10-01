'use client';

/**
 * Network-Resilient Design System for ALCHM
 * Ensures app functionality during poor network conditions or offline scenarios
 * Critical for users in crisis who may have limited connectivity
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface CachedResource {
  url: string;
  data: any;
  timestamp: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'html' | 'json' | 'image' | 'audio' | 'video' | 'other';
}

interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

interface ConnectionQuality {
  level: 'excellent' | 'good' | 'poor' | 'critical' | 'offline';
  adaptations: string[];
}

class NetworkResilientManager {
  private networkStatus: NetworkStatus;
  private offlineStorage: Map<string, CachedResource> = new Map();
  private offlineQueue: OfflineAction[] = [];
  private retryIntervals: Map<string, NodeJS.Timeout> = new Map();
  private connectionCallbacks: Array<(status: NetworkStatus) => void> = [];
  private qualityCallbacks: Array<(quality: ConnectionQuality) => void> = [];
  private currentQuality: ConnectionQuality = { level: 'good', adaptations: [] };

  constructor() {
    this.networkStatus = {
      isOnline: typeof window !== 'undefined' && navigator.onLine,
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false
    };

    this.initialize();
  }

  private initialize() {
    this.setupNetworkListeners();
    this.loadCachedResources();
    this.setupServiceWorkerCommunication();
    this.startNetworkQualityMonitoring();
    this.loadOfflineQueue();
  }

  private setupNetworkListeners() {
    // Basic online/offline detection
    typeof window !== 'undefined' && window.addEventListener('online', this.handleOnline.bind(this));
    typeof window !== 'undefined' && window.addEventListener('offline', this.handleOffline.bind(this));

    // Network Information API
    if (typeof window !== 'undefined' && navigator && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      
      this.updateNetworkStatus();
      connection.addEventListener('change', this.updateNetworkStatus.bind(this));
    }

    // Visibility API for optimizing when app is backgrounded
    typeof window !== 'undefined' && document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private handleOnline() {
    this.networkStatus.isOnline = true;
    this.processOfflineQueue();
    this.notifyConnectionChange();
  }

  private handleOffline() {
    this.networkStatus.isOnline = false;
    this.notifyConnectionChange();
    this.showOfflineNotification();
  }

  private handleVisibilityChange() {
    if (typeof window !== 'undefined' && document.hidden) {
      // App is backgrounded - pause non-critical network operations
      this.pauseNonCriticalOperations();
    } else {
      // App is visible - resume operations
      this.resumeOperations();
    }
  }

  private updateNetworkStatus() {
    const connection = (typeof window !== 'undefined' && navigator as any).connection;
    if (!connection) return;

    this.networkStatus = {
      ...this.networkStatus,
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    };

    this.updateConnectionQuality();
    this.notifyConnectionChange();
  }

  private updateConnectionQuality() {
    const { isOnline, effectiveType, rtt, downlink } = this.networkStatus;
    
    if (!isOnline) {
      this.currentQuality = {
        level: 'offline',
        adaptations: ['offline_mode', 'cached_only', 'queue_actions']
      };
      return;
    }

    let level: ConnectionQuality['level'];
    let adaptations: string[] = [];

    // Determine connection quality
    if (effectiveType === '4g' && rtt < 150 && downlink > 1.5) {
      level = 'excellent';
    } else if (effectiveType === '4g' || (effectiveType === '3g' && rtt < 300)) {
      level = 'good';
    } else if (effectiveType === '3g' || effectiveType === '2g') {
      level = 'poor';
      adaptations.push('compress_images', 'reduce_animations', 'limit_concurrent_requests');
    } else {
      level = 'critical';
      adaptations.push('text_only', 'essential_requests_only', 'aggressive_caching');
    }

    // Additional adaptations based on saveData preference
    if (this.networkStatus.saveData) {
      adaptations.push('save_data_mode', 'no_auto_downloads');
    }

    this.currentQuality = { level, adaptations };
    this.applyNetworkAdaptations();
    this.notifyQualityChange();
  }

  private applyNetworkAdaptations() {
    const adaptations = this.currentQuality.adaptations;

    // Apply CSS classes for visual adaptations
    typeof window !== 'undefined' && document.body.classList.remove('excellent-connection', 'good-connection', 'poor-connection', 'critical-connection', 'offline-mode');
    typeof window !== 'undefined' && document.body.classList.add(`${this.currentQuality.level}-connection`);

    // Apply specific adaptations
    if (adaptations.includes('compress_images')) {
      this.enableImageCompression();
    }

    if (adaptations.includes('reduce_animations')) {
      this.reduceAnimations();
    }

    if (adaptations.includes('text_only')) {
      this.enableTextOnlyMode();
    }

    if (adaptations.includes('essential_requests_only')) {
      this.limitToEssentialRequests();
    }
  }

  private loadCachedResources() {
    try {
      const cached = typeof window !== 'undefined' && localStorage.getItem('alchm_cached_resources');
      if (cached) {
        const resources = JSON.parse(cached);
        resources.forEach((resource: CachedResource) => {
          this.offlineStorage.set(resource.url, resource);
        });
      }
    } catch (error) {
      console.error('Error loading cached resources:', error);
    }
  }

  private saveCachedResources() {
    try {
      const resources = Array.from(this.offlineStorage.values());
      typeof window !== 'undefined' && localStorage.setItem('alchm_cached_resources', JSON.stringify(resources));
    } catch (error) {
      console.error('Error saving cached resources:', error);
    }
  }

  private loadOfflineQueue() {
    try {
      const queue = typeof window !== 'undefined' && localStorage.getItem('alchm_offline_queue');
      if (queue) {
        this.offlineQueue = JSON.parse(queue);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  private saveOfflineQueue() {
    try {
      typeof window !== 'undefined' && localStorage.setItem('alchm_offline_queue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  private setupServiceWorkerCommunication() {
    if ('serviceWorker' in typeof window !== 'undefined' && navigator) {
      typeof window !== 'undefined' && navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'RESOURCE_CACHED':
            this.handleResourceCached(data);
            break;
          case 'OFFLINE_ACTION_QUEUED':
            this.handleOfflineActionQueued(data);
            break;
          case 'NETWORK_STATUS_UPDATE':
            this.handleNetworkStatusUpdate(data);
            break;
        }
      });
    }
  }

  private startNetworkQualityMonitoring() {
    // Monitor actual network performance through timing API
    if ('PerformanceObserver' in typeof window !== 'undefined' && window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation' || entry.entryType === 'resource') {
            this.analyzeNetworkTiming(entry as PerformanceNavigationTiming);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }
  }

  private analyzeNetworkTiming(entry: PerformanceNavigationTiming) {
    const totalTime = entry.loadEventEnd - entry.fetchStart;
    const networkTime = entry.responseEnd - entry.requestStart;
    
    // If network operations are consistently slow, downgrade quality
    if (networkTime > 3000 && this.currentQuality.level !== 'offline') {
      this.currentQuality.level = 'poor';
      this.currentQuality.adaptations.push('slow_network_detected');
      this.applyNetworkAdaptations();
    }
  }

  private processOfflineQueue() {
    if (!this.networkStatus.isOnline || this.offlineQueue.length === 0) return;

    const actionsToProcess = [...this.offlineQueue];
    this.offlineQueue = [];

    actionsToProcess.forEach(async (action) => {
      try {
        await this.retryOfflineAction(action);
      } catch (error) {
        console.error('Failed to process offline action:', error);
        
        if (action.retryCount < action.maxRetries) {
          action.retryCount++;
          this.offlineQueue.push(action);
        }
      }
    });

    this.saveOfflineQueue();
  }

  private async retryOfflineAction(action: OfflineAction): Promise<void> {
    // Implementation depends on action type
    switch (action.type) {
      case 'journal_save':
        return this.retryJournalSave(action.data);
      case 'crisis_log':
        return this.retryCrisisLog(action.data);
      case 'user_preference':
        return this.retryUserPreference(action.data);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async retryJournalSave(data: any): Promise<void> {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Journal save failed');
    }
  }

  private async retryCrisisLog(data: any): Promise<void> {
    const response = await fetch('/api/crisis-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Crisis log failed');
    }
  }

  private async retryUserPreference(data: any): Promise<void> {
    const response = await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('User preference update failed');
    }
  }

  private enableImageCompression() {
    const images = typeof window !== 'undefined' && document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      const originalSrc = htmlImg.dataset.src;
      if (originalSrc) {
        // Add compression parameters or use compressed version
        htmlImg.src = `${originalSrc}?compress=true&quality=60`;
      }
    });
  }

  private reduceAnimations() {
    typeof window !== 'undefined' && document.body.classList.add('reduced-animations');
  }

  private enableTextOnlyMode() {
    typeof window !== 'undefined' && document.body.classList.add('text-only-mode');
  }

  private limitToEssentialRequests() {
    // Cancel non-essential requests
    // Implementation would depend on request tracking system
    console.log('Limiting to essential requests only');
  }

  private pauseNonCriticalOperations() {
    // Pause background sync, analytics, etc.
    typeof window !== 'undefined' && document.body.classList.add('background-paused');
  }

  private resumeOperations() {
    typeof window !== 'undefined' && document.body.classList.remove('background-paused');
  }

  private handleResourceCached(data: any) {
    const resource: CachedResource = {
      url: data.url,
      data: data.data,
      timestamp: Date.now(),
      priority: data.priority || 'medium',
      type: data.type || 'other'
    };

    this.offlineStorage.set(resource.url, resource);
    this.saveCachedResources();
  }

  private handleOfflineActionQueued(data: any) {
    this.offlineQueue.push(data);
    this.saveOfflineQueue();
  }

  private handleNetworkStatusUpdate(data: any) {
    this.networkStatus = { ...this.networkStatus, ...data };
    this.updateConnectionQuality();
  }

  private showOfflineNotification() {
    const notification = typeof window !== 'undefined' && document.createElement('div');
    notification.id = 'offline-notification';
    notification.className = 'network-notification offline';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">📵</span>
        <div class="notification-text">
          <strong>You're offline</strong>
          <p>Crisis resources are still available</p>
        </div>
      </div>
    `;

    typeof window !== 'undefined' && document.body.appendChild(notification);

    // Auto-remove when back online
    const removeOnline = () => {
      notification.remove();
      typeof window !== 'undefined' && window.removeEventListener('online', removeOnline);
    };
    typeof window !== 'undefined' && window.addEventListener('online', removeOnline);
  }

  private notifyConnectionChange() {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(this.networkStatus);
      } catch (error) {
        console.error('Error in connection callback:', error);
      }
    });
  }

  private notifyQualityChange() {
    this.qualityCallbacks.forEach(callback => {
      try {
        callback(this.currentQuality);
      } catch (error) {
        console.error('Error in quality callback:', error);
      }
    });
  }

  // Public API
  public getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  public getConnectionQuality(): ConnectionQuality {
    return { ...this.currentQuality };
  }

  public cacheResource(url: string, data: any, priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'): void {
    const resource: CachedResource = {
      url,
      data,
      timestamp: Date.now(),
      priority,
      type: 'other'
    };

    this.offlineStorage.set(url, resource);
    this.saveCachedResources();
  }

  public getCachedResource(url: string): CachedResource | null {
    return this.offlineStorage.get(url) || null;
  }

  public queueOfflineAction(action: Omit<OfflineAction, 'timestamp' | 'retryCount'>): void {
    const offlineAction: OfflineAction = {
      ...action,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.offlineQueue.push(offlineAction);
    this.saveOfflineQueue();
  }

  public onNetworkChange(callback: (status: NetworkStatus) => void): () => void {
    this.connectionCallbacks.push(callback);
    
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  public onQualityChange(callback: (quality: ConnectionQuality) => void): () => void {
    this.qualityCallbacks.push(callback);
    
    return () => {
      const index = this.qualityCallbacks.indexOf(callback);
      if (index > -1) {
        this.qualityCallbacks.splice(index, 1);
      }
    };
  }

  public async makeResilientRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // Try to get from cache first if offline or poor connection
    if (!this.networkStatus.isOnline || this.currentQuality.level === 'critical') {
      const cached = this.getCachedResource(url);
      if (cached) {
        return new Response(JSON.stringify(cached.data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    try {
      // Add timeout based on connection quality
      const timeout = this.getTimeoutForQuality();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Cache successful responses
      if (response.ok) {
        const data = await response.clone().json().catch(() => null);
        if (data) {
          this.cacheResource(url, data, 'medium');
        }
      }

      return response;

    } catch (error) {
      // If request fails, try cache
      const cached = this.getCachedResource(url);
      if (cached) {
        console.warn('Network request failed, using cached data:', error);
        return new Response(JSON.stringify(cached.data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      throw error;
    }
  }

  private getTimeoutForQuality(): number {
    switch (this.currentQuality.level) {
      case 'excellent': return 5000;
      case 'good': return 8000;
      case 'poor': return 15000;
      case 'critical': return 30000;
      default: return 10000;
    }
  }
}

// Create singleton instance
const networkResilientManager = new NetworkResilientManager();

// Export utilities
export const getNetworkStatus = () => networkResilientManager.getNetworkStatus();
export const getConnectionQuality = () => networkResilientManager.getConnectionQuality();
export const cacheResource = (url: string, data: any, priority?: 'critical' | 'high' | 'medium' | 'low') => 
  networkResilientManager.cacheResource(url, data, priority);
export const getCachedResource = (url: string) => networkResilientManager.getCachedResource(url);
export const queueOfflineAction = (action: Omit<OfflineAction, 'timestamp' | 'retryCount'>) => 
  networkResilientManager.queueOfflineAction(action);
export const onNetworkChange = (callback: (status: NetworkStatus) => void) => 
  networkResilientManager.onNetworkChange(callback);
export const onQualityChange = (callback: (quality: ConnectionQuality) => void) => 
  networkResilientManager.onQualityChange(callback);
export const makeResilientRequest = (url: string, options?: RequestInit) => 
  networkResilientManager.makeResilientRequest(url, options);

export default networkResilientManager;

// React hook for network resilience
export function useNetworkResilience() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => getNetworkStatus());
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>(() => getConnectionQuality());
  const [isOffline, setIsOffline] = useState(!networkStatus.isOnline);

  useEffect(() => {
    const unsubscribeNetwork = onNetworkChange((status) => {
      setNetworkStatus(status);
      setIsOffline(!status.isOnline);
    });

    const unsubscribeQuality = onQualityChange((quality) => {
      setConnectionQuality(quality);
    });

    return () => {
      unsubscribeNetwork();
      unsubscribeQuality();
    };
  }, []);

  const saveForLater = useCallback((actionType: string, data: any, maxRetries: number = 3) => {
    queueOfflineAction({
      id: `${actionType}_${Date.now()}`,
      type: actionType,
      data,
      maxRetries
    });
  }, []);

  const loadCached = useCallback((url: string) => {
    return getCachedResource(url);
  }, []);

  return {
    networkStatus,
    connectionQuality,
    isOffline,
    isSlowConnection: connectionQuality.level === 'poor' || connectionQuality.level === 'critical',
    adaptations: connectionQuality.adaptations,
    saveForLater,
    loadCached,
    makeRequest: makeResilientRequest
  };
}