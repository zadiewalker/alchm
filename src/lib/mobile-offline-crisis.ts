/**
 * MOBILE OFFLINE CRISIS SUPPORT
 * Ensures ALCHM remains fully functional offline during crisis situations
 * 
 * This system provides:
 * - Offline journaling with automatic sync when connection returns
 * - Cached crisis resources and emergency contacts
 * - Offline-first performance for users in emotional distress
 * - Data persistence across app sessions and crashes
 */

export interface OfflineJournalEntry {
  id: string;
  content: string;
  mood?: string;
  timestamp: number;
  encrypted: boolean;
  synced: boolean;
  priority: 'normal' | 'crisis' | 'emergency';
}

export interface CrisisResource {
  id: string;
  title: string;
  content: string;
  contactInfo: string[];
  category: 'suicide' | 'abuse' | 'addiction' | 'general';
  priority: number;
}

export class MobileOfflineCrisisSupport {
  private static instance: MobileOfflineCrisisSupport | null = null;
  private isOnline = navigator.onLine;
  private offlineQueue: OfflineJournalEntry[] = [];
  private syncQueue: string[] = [];
  private crisisResources: CrisisResource[] = [];
  private encryptionKey: string | null = null;

  private readonly STORAGE_KEYS = {
    JOURNAL_ENTRIES: 'alchm_offline_journal_entries',
    CRISIS_RESOURCES: 'alchm_cached_crisis_resources', 
    SYNC_QUEUE: 'alchm_sync_queue',
    ENCRYPTION_KEY: 'alchm_encryption_key',
    USER_PREFERENCES: 'alchm_offline_preferences'
  };

  private constructor() {
    this.initializeOfflineSupport();
  }

  static getInstance(): MobileOfflineCrisisSupport {
    if (!this.instance) {
      this.instance = new MobileOfflineCrisisSupport();
    }
    return this.instance;
  }

  private async initializeOfflineSupport(): Promise<void> {
    console.log('📱 Initializing Mobile Offline Crisis Support...');

    // Set up connection monitoring
    this.setupConnectionMonitoring();

    // Initialize encryption
    await this.initializeEncryption();

    // Load cached data
    this.loadOfflineData();

    // Cache essential crisis resources
    await this.cacheEssentialCrisisResources();

    // Set up automatic sync
    this.setupAutoSync();

    // Set up emergency backup system
    this.setupEmergencyBackup();

    console.log('✅ Mobile Offline Crisis Support Ready');
  }

  private setupConnectionMonitoring(): void {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored - Syncing offline data');
      this.isOnline = true;
      this.syncOfflineData();
      this.showConnectionStatus('online');
    });

    window.addEventListener('offline', () => {
      console.log('📱 Connection lost - Enabling offline mode');
      this.isOnline = false;
      this.showConnectionStatus('offline');
    });

    // Advanced connection quality monitoring
    this.monitorConnectionQuality();
  }

  private monitorConnectionQuality(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      connection.addEventListener('change', () => {
        const isSlowConnection = ['slow-2g', '2g'].includes(connection.effectiveType);
        
        if (isSlowConnection) {
          console.log('📶 Slow connection detected - Enabling offline-first mode');
          this.enableOfflineFirstMode();
        }
      });
    }
  }

  private async initializeEncryption(): Promise<void> {
    try {
      // Generate or retrieve encryption key for sensitive data
      let encryptionKey = localStorage.getItem(this.STORAGE_KEYS.ENCRYPTION_KEY);
      
      if (!encryptionKey) {
        // Generate new encryption key
        const keyData = new Uint8Array(32);
        crypto.getRandomValues(keyData);
        encryptionKey = Array.from(keyData).map(b => b.toString(16).padStart(2, '0')).join('');
        
        localStorage.setItem(this.STORAGE_KEYS.ENCRYPTION_KEY, encryptionKey);
      }
      
      this.encryptionKey = encryptionKey;
    } catch (error) {
      console.warn('Encryption initialization failed, using fallback:', error);
      this.encryptionKey = 'fallback_key_for_basic_encoding';
    }
  }

  private loadOfflineData(): void {
    try {
      // Load offline journal entries
      const savedEntries = localStorage.getItem(this.STORAGE_KEYS.JOURNAL_ENTRIES);
      if (savedEntries) {
        this.offlineQueue = JSON.parse(savedEntries);
        console.log(`📝 Loaded ${this.offlineQueue.length} offline journal entries`);
      }

      // Load sync queue
      const savedSyncQueue = localStorage.getItem(this.STORAGE_KEYS.SYNC_QUEUE);
      if (savedSyncQueue) {
        this.syncQueue = JSON.parse(savedSyncQueue);
      }

      // Load cached crisis resources
      const savedResources = localStorage.getItem(this.STORAGE_KEYS.CRISIS_RESOURCES);
      if (savedResources) {
        this.crisisResources = JSON.parse(savedResources);
        console.log(`🆘 Loaded ${this.crisisResources.length} cached crisis resources`);
      }
    } catch (error) {
      console.warn('Error loading offline data:', error);
      this.initializeEmptyState();
    }
  }

  private initializeEmptyState(): void {
    this.offlineQueue = [];
    this.syncQueue = [];
    this.crisisResources = [];
  }

  private async cacheEssentialCrisisResources(): Promise<void> {
    // Essential crisis resources to cache for offline access
    const essentialResources: CrisisResource[] = [
      {
        id: 'suicide-prevention',
        title: '988 Suicide & Crisis Lifeline',
        content: 'Free, confidential support 24/7 for people in distress and those around them.',
        contactInfo: ['tel:988', 'sms:838255'],
        category: 'suicide',
        priority: 1
      },
      {
        id: 'crisis-text-line',
        title: 'Crisis Text Line',
        content: 'Text HOME to 741741 for free, 24/7 crisis support.',
        contactInfo: ['sms:741741'],
        category: 'general',
        priority: 2
      },
      {
        id: 'domestic-violence',
        title: 'National Domestic Violence Hotline',
        content: '24/7 support for domestic violence survivors.',
        contactInfo: ['tel:1-800-799-7233', 'sms:88788'],
        category: 'abuse',
        priority: 3
      },
      {
        id: 'substance-abuse',
        title: 'SAMHSA National Helpline',
        content: 'Treatment referral and information service for substance abuse.',
        contactInfo: ['tel:1-800-662-4357'],
        category: 'addiction',
        priority: 4
      },
      {
        id: 'lgbtq-crisis',
        title: 'TrevorLifeline',
        content: '24/7 crisis support for LGBTQ young people.',
        contactInfo: ['tel:1-866-488-7386', 'sms:START-to-678678'],
        category: 'general',
        priority: 5
      },
      {
        id: 'emergency-services',
        title: 'Emergency Services',
        content: 'Call 911 for immediate emergency assistance.',
        contactInfo: ['tel:911'],
        category: 'general',
        priority: 0
      }
    ];

    // Cache the resources
    this.crisisResources = essentialResources;
    this.saveCrisisResources();

    // Preload additional resources if online
    if (this.isOnline) {
      await this.fetchAndCacheAdditionalResources();
    }
  }

  private async fetchAndCacheAdditionalResources(): Promise<void> {
    try {
      // Attempt to fetch updated crisis resources from server
      const response = await fetch('/api/crisis-resources', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const additionalResources = await response.json();
        this.crisisResources = [...this.crisisResources, ...additionalResources];
        this.saveCrisisResources();
        console.log('📚 Additional crisis resources cached');
      }
    } catch (error) {
      console.warn('Could not fetch additional crisis resources:', error);
    }
  }

  private setupAutoSync(): void {
    // Attempt sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && (this.offlineQueue.length > 0 || this.syncQueue.length > 0)) {
        this.syncOfflineData();
      }
    }, 30000);

    // Sync immediately when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncOfflineData();
      }
    });

    // Sync before page unload
    window.addEventListener('beforeunload', () => {
      if (this.isOnline) {
        this.syncOfflineData();
      }
    });
  }

  private setupEmergencyBackup(): void {
    // Create multiple backup locations for critical data
    setInterval(() => {
      this.createEmergencyBackup();
    }, 60000); // Every minute

    // Backup on critical actions
    window.addEventListener('alchm:emergency-mode-activated', () => {
      this.createEmergencyBackup();
    });
  }

  private createEmergencyBackup(): void {
    try {
      const backupData = {
        journalEntries: this.offlineQueue,
        timestamp: Date.now(),
        version: '1.0',
        deviceInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform
        }
      };

      // Primary backup in localStorage
      localStorage.setItem('alchm_emergency_backup_primary', JSON.stringify(backupData));

      // Secondary backup in sessionStorage
      sessionStorage.setItem('alchm_emergency_backup_secondary', JSON.stringify(backupData));

      // IndexedDB backup for larger storage
      this.createIndexedDBBackup(backupData);

    } catch (error) {
      console.warn('Emergency backup failed:', error);
    }
  }

  private async createIndexedDBBackup(data: any): Promise<void> {
    try {
      if ('indexedDB' in window) {
        const request = indexedDB.open('ALCHMEmergencyBackup', 1);
        
        request.onerror = () => {
          console.warn('IndexedDB backup failed');
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['backups'], 'readwrite');
          const store = transaction.objectStore('backups');
          
          store.put({
            id: 'latest_backup',
            data: data,
            timestamp: Date.now()
          });
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('backups')) {
            db.createObjectStore('backups', { keyPath: 'id' });
          }
        };
      }
    } catch (error) {
      console.warn('IndexedDB backup error:', error);
    }
  }

  // Public API for saving journal entries offline
  public async saveJournalEntryOffline(
    content: string, 
    mood?: string, 
    priority: 'normal' | 'crisis' | 'emergency' = 'normal'
  ): Promise<string> {
    const entryId = this.generateEntryId();
    
    const entry: OfflineJournalEntry = {
      id: entryId,
      content: await this.encryptSensitiveData(content),
      mood,
      timestamp: Date.now(),
      encrypted: true,
      synced: false,
      priority
    };

    // Add to offline queue
    this.offlineQueue.push(entry);
    
    // Save to localStorage immediately
    this.saveOfflineEntries();

    // Add to sync queue for when connection returns
    this.syncQueue.push(entryId);
    this.saveSyncQueue();

    console.log(`📝 Journal entry saved offline (Priority: ${priority})`);

    // Attempt immediate sync if online
    if (this.isOnline) {
      setTimeout(() => this.syncOfflineData(), 1000);
    }

    return entryId;
  }

  public getCachedCrisisResources(): CrisisResource[] {
    return this.crisisResources.sort((a, b) => a.priority - b.priority);
  }

  public getOfflineJournalEntries(): OfflineJournalEntry[] {
    return this.offlineQueue
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(entry => ({
        ...entry,
        content: this.decryptSensitiveData(entry.content)
      }));
  }

  public isOfflineModeEnabled(): boolean {
    return !this.isOnline || this.offlineQueue.length > 0;
  }

  public getUnsyncedCount(): number {
    return this.offlineQueue.filter(entry => !entry.synced).length;
  }

  // Crisis-specific methods
  public async saveCrisisEntry(content: string): Promise<string> {
    console.log('🚨 Saving crisis journal entry with high priority');
    
    // Crisis entries get highest priority
    const entryId = await this.saveJournalEntryOffline(content, 'crisis', 'crisis');
    
    // Create additional backups for crisis entries
    this.createEmergencyBackup();
    
    // Show confirmation to user
    this.showCrisisEntrySavedNotification();
    
    return entryId;
  }

  public async getEmergencyContacts(): Promise<string[]> {
    const emergencyResources = this.crisisResources
      .filter(resource => resource.priority <= 2)
      .flatMap(resource => resource.contactInfo);
    
    return emergencyResources;
  }

  public async enableOfflineFirstMode(): void {
    console.log('📱 Enabling offline-first mode for optimal performance');
    
    // Prioritize local storage and caching
    this.createEmergencyBackup();
    
    // Notify the app to switch to offline-first UI
    const event = new CustomEvent('alchm:offline-first-enabled', {
      detail: {
        reason: 'connection_quality',
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }

  // Private helper methods
  private generateEntryId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async encryptSensitiveData(data: string): Promise<string> {
    if (!this.encryptionKey) return data;
    
    try {
      // Simple XOR encryption for local storage
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(
          data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return btoa(result);
    } catch (error) {
      console.warn('Encryption failed, storing as plain text:', error);
      return data;
    }
  }

  private decryptSensitiveData(encryptedData: string): string {
    if (!this.encryptionKey) return encryptedData;
    
    try {
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(
          data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return result;
    } catch (error) {
      console.warn('Decryption failed, returning as-is:', error);
      return encryptedData;
    }
  }

  private saveOfflineEntries(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.warn('Failed to save offline entries:', error);
      this.handleStorageError(error);
    }
  }

  private saveSyncQueue(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.warn('Failed to save sync queue:', error);
    }
  }

  private saveCrisisResources(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.CRISIS_RESOURCES, JSON.stringify(this.crisisResources));
    } catch (error) {
      console.warn('Failed to save crisis resources:', error);
    }
  }

  private handleStorageError(error: any): void {
    // Handle storage quota exceeded or other storage errors
    console.warn('Storage error detected, attempting cleanup:', error);
    
    // Remove old entries to make space
    if (this.offlineQueue.length > 50) {
      const entriesToRemove = this.offlineQueue
        .filter(entry => entry.synced)
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, 10);
        
      entriesToRemove.forEach(entry => {
        const index = this.offlineQueue.findIndex(e => e.id === entry.id);
        if (index > -1) {
          this.offlineQueue.splice(index, 1);
        }
      });
      
      // Try saving again
      this.saveOfflineEntries();
    }
  }

  private async syncOfflineData(): Promise<void> {
    if (!this.isOnline || this.offlineQueue.length === 0) return;

    console.log(`🔄 Syncing ${this.offlineQueue.length} offline entries...`);
    
    // Prioritize crisis entries
    const entriesToSync = this.offlineQueue
      .filter(entry => !entry.synced)
      .sort((a, b) => {
        const priorityOrder = { emergency: 0, crisis: 1, normal: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    for (const entry of entriesToSync) {
      try {
        await this.syncSingleEntry(entry);
      } catch (error) {
        console.warn(`Failed to sync entry ${entry.id}:`, error);
        // Continue with other entries even if one fails
      }
    }

    // Clean up synced entries
    this.cleanupSyncedEntries();
  }

  private async syncSingleEntry(entry: OfflineJournalEntry): Promise<void> {
    try {
      const decryptedContent = this.decryptSensitiveData(entry.content);
      
      const response = await fetch('/api/journal/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('alchm_auth_token')}`
        },
        body: JSON.stringify({
          offlineId: entry.id,
          content: decryptedContent,
          mood: entry.mood,
          timestamp: entry.timestamp,
          priority: entry.priority
        })
      });

      if (response.ok) {
        entry.synced = true;
        this.saveOfflineEntries();
        console.log(`✅ Synced entry ${entry.id}`);
      } else {
        throw new Error(`Sync failed with status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Sync failed for entry ${entry.id}:`, error);
      throw error;
    }
  }

  private cleanupSyncedEntries(): void {
    const initialCount = this.offlineQueue.length;
    
    // Keep synced entries for 24 hours as backup
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    this.offlineQueue = this.offlineQueue.filter(entry => 
      !entry.synced || entry.timestamp > oneDayAgo
    );

    this.syncQueue = this.syncQueue.filter(entryId => 
      this.offlineQueue.some(entry => entry.id === entryId && !entry.synced)
    );

    const finalCount = this.offlineQueue.length;
    
    if (initialCount > finalCount) {
      console.log(`🧹 Cleaned up ${initialCount - finalCount} old synced entries`);
      this.saveOfflineEntries();
      this.saveSyncQueue();
    }
  }

  private showConnectionStatus(status: 'online' | 'offline'): void {
    const existingIndicator = document.getElementById('connection-status-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    const indicator = document.createElement('div');
    indicator.id = 'connection-status-indicator';
    
    if (status === 'offline') {
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(145deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95));
          color: white;
          padding: 12px 16px;
          text-align: center;
          font-weight: 600;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          font-size: 14px;
        ">
          📱 Offline Mode Active - Your entries are saved locally and will sync when connection returns
        </div>
      `;
    } else {
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(145deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95));
          color: white;
          padding: 12px 16px;
          text-align: center;
          font-weight: 600;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
          font-size: 14px;
          animation: slideDown 0.3s ease;
        ">
          🌐 Connection Restored - Syncing ${this.getUnsyncedCount()} offline entries
        </div>
      `;
      
      // Auto-remove success message after 3 seconds
      setTimeout(() => {
        const element = document.getElementById('connection-status-indicator');
        if (element) {
          element.style.animation = 'slideUp 0.3s ease';
          setTimeout(() => element.remove(), 300);
        }
      }, 3000);
    }

    document.body.appendChild(indicator);
  }

  private showCrisisEntrySavedNotification(): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(145deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95));
        color: white;
        padding: 16px 24px;
        border-radius: 20px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
        font-size: 16px;
        text-align: center;
        max-width: 320px;
        animation: fadeInUp 0.5s ease;
      ">
        ✅ Crisis entry saved securely offline
        <div style="font-size: 12px; margin-top: 6px; opacity: 0.9;">
          ${this.isOnline ? 'Will sync immediately' : 'Will sync when connection returns'}
        </div>
      </div>
      
      <style>
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
    `;

    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.5s ease';
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }
}

// Initialize offline support on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    MobileOfflineCrisisSupport.getInstance();
  });

  // Listen for offline-first mode events
  window.addEventListener('alchm:offline-first-enabled', (event: any) => {
    console.log('📱 Offline-first mode enabled:', event.detail);
  });
}

export default MobileOfflineCrisisSupport;