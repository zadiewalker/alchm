'use client';

import { firestoreClient } from './firestoreClient';
import { journalCache } from './cache';
import {
  JournalEntry,
  OfflineQueueItem,
  SubscriptionState,
  SerializedJournalEntry
} from '@/types/journal';

// Data synchronization and serialization manager
export class DataSyncManager {
  private syncInProgress = false;
  private syncListeners: ((state: SyncState) => void)[] = [];
  private conflictResolver?: ConflictResolver;

  constructor(conflictResolver?: ConflictResolver) {
    this.conflictResolver = conflictResolver;
    this.setupAutoSync();
  }

  // Auto-sync when coming back online
  private setupAutoSync(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.syncOfflineChanges();
    });

    // Periodic sync check
    setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.syncOfflineChanges();
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Serialize journal entry for storage/transmission
  static serializeEntry(entry: JournalEntry): SerializedJournalEntry {
    return {
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      analysis: entry.analysis ? {
        ...entry.analysis,
        processedAt: entry.analysis.processedAt.toISOString()
      } : undefined,
      traumaIndicators: entry.traumaIndicators ? {
        ...entry.traumaIndicators,
        assessedAt: entry.traumaIndicators.assessedAt.toISOString()
      } : undefined
    };
  }

  // Deserialize journal entry from storage/transmission
  static deserializeEntry(serialized: SerializedJournalEntry): JournalEntry {
    return {
      ...serialized,
      createdAt: new Date(serialized.createdAt),
      updatedAt: new Date(serialized.updatedAt),
      analysis: serialized.analysis ? {
        ...serialized.analysis,
        processedAt: new Date(serialized.analysis.processedAt)
      } : undefined,
      traumaIndicators: serialized.traumaIndicators ? {
        ...serialized.traumaIndicators,
        assessedAt: new Date(serialized.traumaIndicators.assessedAt)
      } : undefined
    };
  }

  // Sync offline changes when coming back online
  async syncOfflineChanges(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return { success: false, message: 'Sync already in progress' };
    }

    this.syncInProgress = true;
    this.notifyListeners({ isOnline: true, isSyncing: true, error: null });

    try {
      // Get offline queue size
      const queueSize = firestoreClient.getOfflineQueueSize();
      
      if (queueSize === 0) {
        this.notifyListeners({ isOnline: true, isSyncing: false, error: null });
        return { success: true, message: 'No offline changes to sync' };
      }

      // Process offline queue
      // Note: The firestoreClient handles the actual queue processing
      // Here we just monitor and provide feedback

      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts && firestoreClient.getOfflineQueueSize() > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for queue processing
        attempts++;
      }

      const remainingItems = firestoreClient.getOfflineQueueSize();
      
      if (remainingItems > 0) {
        this.notifyListeners({ 
          isOnline: true, 
          isSyncing: false, 
          error: `${remainingItems} items failed to sync`
        });
        return { 
          success: false, 
          message: `${remainingItems} items failed to sync after ${maxAttempts} attempts`
        };
      }

      this.notifyListeners({ isOnline: true, isSyncing: false, error: null });
      return { success: true, message: 'All offline changes synced successfully' };

    } catch (error) {
      console.error('[DataSync] Sync failed:', error);
      this.notifyListeners({ 
        isOnline: true, 
        isSyncing: false, 
        error: error instanceof Error ? error.message : 'Sync failed'
      });
      return { success: false, message: 'Sync failed due to an error' };
    } finally {
      this.syncInProgress = false;
    }
  }

  // Resolve conflicts between local and remote data
  async resolveConflicts(userId: string): Promise<ConflictResolution[]> {
    if (!this.conflictResolver) {
      return [];
    }

    try {
      // Get local cached entries
      const localEntries = journalCache.getJournals(userId) || [];
      
      // Get remote entries
      const remoteEntries = await firestoreClient.getEntries(userId, {
        limit: 100,
        orderBy: 'updatedAt',
        orderDirection: 'desc'
      });

      const conflicts: DataConflict[] = [];

      // Find conflicts by comparing versions and update times
      for (const localEntry of localEntries) {
        const remoteEntry = remoteEntries.find(r => r.id === localEntry.id);
        
        if (remoteEntry) {
          // Check for version conflicts
          if (localEntry.version !== remoteEntry.version) {
            conflicts.push({
              entryId: localEntry.id,
              localEntry,
              remoteEntry,
              conflictType: 'version_mismatch'
            });
          }
          // Check for timestamp conflicts
          else if (localEntry.updatedAt.getTime() !== remoteEntry.updatedAt.getTime()) {
            conflicts.push({
              entryId: localEntry.id,
              localEntry,
              remoteEntry,
              conflictType: 'timestamp_mismatch'
            });
          }
        }
      }

      // Resolve conflicts using the provided resolver
      const resolutions: ConflictResolution[] = [];
      for (const conflict of conflicts) {
        const resolution = await this.conflictResolver.resolve(conflict);
        resolutions.push(resolution);

        // Apply resolution
        if (resolution.action === 'use_local') {
          await firestoreClient.updateEntry(userId, conflict.entryId, conflict.localEntry);
        } else if (resolution.action === 'use_remote') {
          journalCache.setJournalEntry(conflict.entryId, conflict.remoteEntry);
        } else if (resolution.action === 'merge') {
          const mergedEntry = resolution.mergedEntry!;
          await firestoreClient.updateEntry(userId, conflict.entryId, mergedEntry);
          journalCache.setJournalEntry(conflict.entryId, mergedEntry);
        }
      }

      return resolutions;
    } catch (error) {
      console.error('[DataSync] Conflict resolution failed:', error);
      return [];
    }
  }

  // Backup data to local storage
  async backupToLocal(userId: string): Promise<BackupResult> {
    try {
      const entries = await firestoreClient.getEntries(userId, {
        limit: 1000, // Backup last 1000 entries
        orderBy: 'createdAt',
        orderDirection: 'desc'
      });

      const serializedEntries = entries.map(entry => DataSyncManager.serializeEntry(entry));
      
      const backup = {
        userId,
        timestamp: new Date().toISOString(),
        version: '1.0',
        entries: serializedEntries
      };

      const backupKey = `alchm_backup_${userId}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));

      return {
        success: true,
        entryCount: entries.length,
        backupSize: JSON.stringify(backup).length,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('[DataSync] Backup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backup failed'
      };
    }
  }

  // Restore data from local backup
  async restoreFromLocal(userId: string): Promise<RestoreResult> {
    try {
      const backupKey = `alchm_backup_${userId}`;
      const backupData = localStorage.getItem(backupKey);
      
      if (!backupData) {
        return {
          success: false,
          error: 'No backup found for user'
        };
      }

      const backup = JSON.parse(backupData);
      const entries = backup.entries.map((serialized: SerializedJournalEntry) => 
        DataSyncManager.deserializeEntry(serialized)
      );

      // Store in cache
      journalCache.setJournals(userId, entries);

      return {
        success: true,
        entryCount: entries.length,
        backupDate: new Date(backup.timestamp)
      };
    } catch (error) {
      console.error('[DataSync] Restore failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Restore failed'
      };
    }
  }

  // Export data for external backup
  async exportData(userId: string, format: 'json' | 'csv' = 'json'): Promise<ExportResult> {
    try {
      const entries = await firestoreClient.getEntries(userId, {
        limit: 10000,
        orderBy: 'createdAt',
        orderDirection: 'asc'
      });

      let exportData: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        const serializedEntries = entries.map(entry => DataSyncManager.serializeEntry(entry));
        exportData = JSON.stringify({
          exportDate: new Date().toISOString(),
          userInfo: { userId },
          entries: serializedEntries
        }, null, 2);
        filename = `alchm_export_${userId}_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        // CSV format
        const csvHeaders = ['ID', 'Title', 'Content', 'Emotion', 'Mood', 'Tags', 'Created At', 'Updated At'];
        const csvRows = entries.map(entry => [
          entry.id,
          `"${entry.title.replace(/"/g, '""')}"`,
          `"${entry.content.replace(/"/g, '""')}"`,
          entry.emotion || '',
          entry.mood || '',
          entry.tags?.join(';') || '',
          entry.createdAt.toISOString(),
          entry.updatedAt.toISOString()
        ]);
        
        exportData = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
        filename = `alchm_export_${userId}_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      return {
        success: true,
        data: exportData,
        filename,
        mimeType,
        entryCount: entries.length
      };
    } catch (error) {
      console.error('[DataSync] Export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  // Subscribe to sync state changes
  onSyncStateChange(listener: (state: SyncState) => void): () => void {
    this.syncListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.syncListeners.indexOf(listener);
      if (index > -1) {
        this.syncListeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(state: SyncState): void {
    this.syncListeners.forEach(listener => listener(state));
  }

  // Get current sync state
  getSyncState(): SyncState {
    const subscriptionState = firestoreClient.getSubscriptionState();
    return {
      isOnline: subscriptionState.isOnline,
      isSyncing: this.syncInProgress,
      error: subscriptionState.error
    };
  }
}

// Interfaces for sync functionality

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  error: string | null;
}

export interface SyncResult {
  success: boolean;
  message: string;
}

export interface DataConflict {
  entryId: string;
  localEntry: JournalEntry;
  remoteEntry: JournalEntry;
  conflictType: 'version_mismatch' | 'timestamp_mismatch' | 'content_conflict';
}

export interface ConflictResolution {
  entryId: string;
  action: 'use_local' | 'use_remote' | 'merge';
  mergedEntry?: JournalEntry;
}

export interface ConflictResolver {
  resolve(conflict: DataConflict): Promise<ConflictResolution>;
}

export interface BackupResult {
  success: boolean;
  entryCount?: number;
  backupSize?: number;
  timestamp?: Date;
  error?: string;
}

export interface RestoreResult {
  success: boolean;
  entryCount?: number;
  backupDate?: Date;
  error?: string;
}

export interface ExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  mimeType?: string;
  entryCount?: number;
  error?: string;
}

// Default conflict resolver - prefers newer entries
export class DefaultConflictResolver implements ConflictResolver {
  async resolve(conflict: DataConflict): Promise<ConflictResolution> {
    // Simple strategy: use the entry with the latest update time
    const useLocal = conflict.localEntry.updatedAt >= conflict.remoteEntry.updatedAt;
    
    return {
      entryId: conflict.entryId,
      action: useLocal ? 'use_local' : 'use_remote'
    };
  }
}

// Smart conflict resolver - attempts to merge non-conflicting changes
export class SmartConflictResolver implements ConflictResolver {
  async resolve(conflict: DataConflict): Promise<ConflictResolution> {
    const { localEntry, remoteEntry } = conflict;
    
    // If only content changed in one version, merge
    if (localEntry.title === remoteEntry.title && 
        localEntry.emotion === remoteEntry.emotion &&
        JSON.stringify(localEntry.tags) === JSON.stringify(remoteEntry.tags)) {
      
      // Merge content if one is a subset of the other
      const mergedContent = localEntry.content.length > remoteEntry.content.length
        ? localEntry.content
        : remoteEntry.content;
      
      const mergedEntry: JournalEntry = {
        ...localEntry,
        content: mergedContent,
        updatedAt: new Date(),
        version: Math.max(localEntry.version, remoteEntry.version) + 1
      };
      
      return {
        entryId: conflict.entryId,
        action: 'merge',
        mergedEntry
      };
    }
    
    // Fall back to using newer entry
    const useLocal = localEntry.updatedAt >= remoteEntry.updatedAt;
    return {
      entryId: conflict.entryId,
      action: useLocal ? 'use_local' : 'use_remote'
    };
  }
}

// Export singleton instance
export const dataSyncManager = new DataSyncManager(new SmartConflictResolver());