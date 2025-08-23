// Offline Indicator - Shows connection status and sync progress
// Provides user feedback about offline capabilities and data sync

'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Database,
  Zap,
  CloudOff,
  Upload
} from 'lucide-react';
import { offlineManager } from '@/lib/offline-manager';

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

interface SyncStatus {
  lastSyncAt?: number;
  pendingCount: number;
  syncing: boolean;
  syncedCount: number;
  failedCount: number;
}

export default function OfflineIndicator({ className = '', showDetails = false }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    pendingCount: 0,
    syncing: false,
    syncedCount: 0,
    failedCount: 0
  });
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [lastOfflineAction, setLastOfflineAction] = useState<string | null>(null);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for ALCHM-specific offline events
    const handleOfflineEvent = (event: CustomEvent) => {
      const { detail } = event;
      if (detail.offline) {
        setIsOnline(false);
      }
    };

    const handleSyncCompleted = (event: CustomEvent) => {
      const { syncedCount, failedCount } = event.detail;
      setSyncStatus(prev => ({
        ...prev,
        syncedCount,
        failedCount,
        syncing: false,
        lastSyncAt: Date.now()
      }));
    };

    const handleSyncStarted = () => {
      setSyncStatus(prev => ({
        ...prev,
        syncing: true
      }));
    };

    window.addEventListener('alchm-offline', handleOfflineEvent);
    window.addEventListener('alchm-sync-completed', handleSyncCompleted);
    window.addEventListener('alchm-sync-started', handleSyncStarted);

    // Check initial sync status
    updateSyncStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('alchm-offline', handleOfflineEvent);
      window.removeEventListener('alchm-sync-completed', handleSyncCompleted);
      window.removeEventListener('alchm-sync-started', handleSyncStarted);
    };
  }, []);

  const updateSyncStatus = async () => {
    // This would be implemented to check actual sync status
    // For now, using mock data
    setSyncStatus({
      pendingCount: 0,
      syncing: false,
      syncedCount: 0,
      failedCount: 0,
      lastSyncAt: Date.now()
    });
  };

  const handleManualSync = async () => {
    if (!isOnline) return;

    setSyncStatus(prev => ({ ...prev, syncing: true }));
    
    try {
      const result = await offlineManager.syncOfflineData();
      setSyncStatus(prev => ({
        ...prev,
        syncing: false,
        syncedCount: result.synced,
        failedCount: result.failed,
        lastSyncAt: Date.now()
      }));
    } catch (error) {
      console.error('Manual sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncing: false
      }));
    }
  };

  const getConnectionStatus = () => {
    if (isOnline) {
      return {
        icon: Wifi,
        text: 'Online',
        color: 'text-green-400',
        bgColor: 'bg-green-600'
      };
    } else {
      return {
        icon: WifiOff,
        text: 'Offline',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-600'
      };
    }
  };

  const getSyncStatusText = () => {
    if (syncStatus.syncing) {
      return 'Syncing...';
    }
    
    if (syncStatus.lastSyncAt) {
      const minutesAgo = Math.floor((Date.now() - syncStatus.lastSyncAt) / (1000 * 60));
      if (minutesAgo < 1) return 'Just synced';
      if (minutesAgo < 60) return `Synced ${minutesAgo}m ago`;
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `Synced ${hoursAgo}h ago`;
    }
    
    return 'Not synced';
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${status.bgColor} ${isOnline ? 'animate-pulse' : ''}`}></div>
        <span className={`text-sm ${status.color}`}>{status.text}</span>
        
        {syncStatus.pendingCount > 0 && (
          <Badge variant="outline" className="border-yellow-400 text-yellow-300 text-xs">
            {syncStatus.pendingCount} pending
          </Badge>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Detailed status card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-4">
          <div className="space-y-4">
            {/* Connection status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${status.color}`} />
                <span className="font-medium text-white">{status.text}</span>
              </div>
              
              {isOnline && (
                <Button
                  onClick={handleManualSync}
                  disabled={syncStatus.syncing}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  {syncStatus.syncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {syncStatus.syncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              )}
            </div>

            {/* Sync status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last sync</span>
                <span className="text-gray-300">{getSyncStatusText()}</span>
              </div>
              
              {syncStatus.pendingCount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Pending items</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300">{syncStatus.pendingCount}</span>
                  </div>
                </div>
              )}

              {syncStatus.lastSyncAt && (syncStatus.syncedCount > 0 || syncStatus.failedCount > 0) && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Last sync result</span>
                  <div className="flex items-center gap-2">
                    {syncStatus.syncedCount > 0 && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-green-300">{syncStatus.syncedCount}</span>
                      </div>
                    )}
                    {syncStatus.failedCount > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span className="text-red-300">{syncStatus.failedCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Offline capabilities info */}
            {!isOnline && (
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Offline Mode Active</span>
                </div>
                <div className="space-y-1 text-xs text-blue-200">
                  <p>• Your entries are saved locally</p>
                  <p>• Changes will sync when connection returns</p>
                  <p>• All core features remain available</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offline toast notification */}
      {showOfflineToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Card className="bg-gradient-to-r from-yellow-900/90 to-orange-900/90 border-yellow-500/30 text-white max-w-sm">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CloudOff className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-300 mb-1">You're now offline</h4>
                  <p className="text-sm text-yellow-200">
                    Don't worry! You can continue journaling. Your entries will sync automatically when you're back online.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sync success notification */}
      {syncStatus.lastSyncAt && syncStatus.syncedCount > 0 && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
          <Card className="bg-gradient-to-r from-green-900/90 to-emerald-900/90 border-green-500/30 text-white">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-200">
                  {syncStatus.syncedCount} items synced successfully
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook for offline status
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingSync, setHasPendingSync] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    hasPendingSync,
    canSync: isOnline && !offlineManager.syncing
  };
}