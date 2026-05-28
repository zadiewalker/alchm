/**
 * React Hook for Notification Management in ALCHM
 * 
 * Provides a clean interface for components to interact with the notification system
 * Handles permission management, scheduling, and state tracking
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useFeatureAccess } from './useSubscription';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { clientStorageService } from '@/services/storage/clientStorageService';
import type { 
  NotificationContext,
  NotificationPermissionState,
  NotificationStats,
} from '@/types/notifications';

// Dynamic imports for notification service to avoid build-time dependencies

interface NotificationState {
  isInitialized: boolean;
  permissions: NotificationPermissionState | null;
  stats: NotificationStats | null;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  initialize: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  scheduleJournalNotification: (entryId: string, containerId?: string) => Promise<boolean>;
  scheduleRecommended: () => Promise<{ scheduled: number; skipped: number; errors: number }>;
  cancelNotification: (notificationId: string) => Promise<boolean>;
  cancelAll: () => Promise<boolean>;
  refreshStats: () => Promise<void>;
}

export function useNotifications(): NotificationState & NotificationActions {
  const { user, profile } = useAuth();
  const { hasALCHM } = useFeatureAccess();
  
  const [state, setState] = useState<NotificationState>({
    isInitialized: false,
    permissions: null,
    stats: null,
    isLoading: true,
    error: null
  });

  // Initialize notification service on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const { 
          initializeNotifications, 
          checkNotificationPermissions, 
          getNotificationStats 
        } = await import('@/services/notifications/notificationService');
        
        await initializeNotifications();
        
        if (!mounted) return;
        
        const permissions = await checkNotificationPermissions();
        const stats = await getNotificationStats();
        
        setState(prev => ({
          ...prev,
          isInitialized: true,
          permissions,
          stats,
          isLoading: false
        }));

      } catch (error) {
        console.error('[useNotifications] Initialization failed:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Initialization failed'
          }));
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Create notification context from current user state
  const createContext = useCallback((additionalContext: Partial<NotificationContext> = {}): NotificationContext => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return {
      userId: user?.uid || 'anonymous',
      hasALCHM,
      timeZone,
      preferredTime: profile?.notificationPreference || 'afternoon',
      ...additionalContext
    };
  }, [user?.uid, hasALCHM, profile?.notificationPreference]);

  // Initialize notifications
  const initialize = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { 
        initializeNotifications, 
        checkNotificationPermissions, 
        getNotificationStats 
      } = await import('@/services/notifications/notificationService');
      
      await initializeNotifications();
      
      const permissions = await checkNotificationPermissions();
      const stats = await getNotificationStats();
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        permissions,
        stats,
        isLoading: false
      }));
      
    } catch (error) {
      console.error('[useNotifications] Initialize failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Initialize failed'
      }));
    }
  }, []);

  // Request notification permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const { requestNotificationPermissions } = await import('@/services/notifications/notificationService');
      const permissions = await requestNotificationPermissions();
      
      setState(prev => ({ ...prev, permissions }));
      
      return permissions.granted;
      
    } catch (error) {
      console.error('[useNotifications] Permission request failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Permission request failed'
      }));
      return false;
    }
  }, []);

  // Schedule notification for journal entry (seed return)
  const scheduleJournalNotification = useCallback(async (
    entryId: string, 
    containerId?: string
  ): Promise<boolean> => {
    try {
      const context = createContext({
        entryId,
        containerId,
        entryDate: new Date().toISOString(),
        returnType: 'seed',
      });
      
      const { scheduleNotification, getNotificationStats } = await import('@/services/notifications/notificationService');
      const result = await scheduleNotification('seedReturn', context);
      
      if (result.success) {
        // Refresh stats
        const stats = await getNotificationStats();
        setState(prev => ({ ...prev, stats }));
      }
      
      return result.success;
      
    } catch (error) {
      console.error('[useNotifications] Failed to schedule journal notification:', error);
      return false;
    }
  }, [createContext]);

  // Schedule all recommended notifications based on current context
  const scheduleRecommended = useCallback(async (): Promise<{ 
    scheduled: number; 
    skipped: number; 
    errors: number 
  }> => {
    try {
      const context = createContext();
      const { scheduleRecommendedNotifications, getNotificationStats } = await import('@/services/notifications/notificationService');
      const result = await scheduleRecommendedNotifications(context);
      
      // Refresh stats after scheduling
      const stats = await getNotificationStats();
      setState(prev => ({ ...prev, stats }));
      
      return {
        scheduled: result.scheduled.length,
        skipped: result.skipped.length,
        errors: result.errors.length
      };
      
    } catch (error) {
      console.error('[useNotifications] Failed to schedule recommended notifications:', error);
      return { scheduled: 0, skipped: 0, errors: 1 };
    }
  }, [createContext]);

  // Cancel specific notification
  const cancelNotificationById = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const { cancelNotification, getNotificationStats } = await import('@/services/notifications/notificationService');
      const result = await cancelNotification(notificationId);
      
      if (result.success) {
        const stats = await getNotificationStats();
        setState(prev => ({ ...prev, stats }));
      }
      
      return result.success;
      
    } catch (error) {
      console.error('[useNotifications] Failed to cancel notification:', error);
      return false;
    }
  }, []);

  // Cancel all pending notifications
  const cancelAll = useCallback(async (): Promise<boolean> => {
    try {
      const { cancelAllNotifications, getNotificationStats } = await import('@/services/notifications/notificationService');
      const result = await cancelAllNotifications();
      
      if (result.success) {
        const stats = await getNotificationStats();
        setState(prev => ({ ...prev, stats }));
      }
      
      return result.success;
      
    } catch (error) {
      console.error('[useNotifications] Failed to cancel all notifications:', error);
      return false;
    }
  }, []);

  // Refresh notification stats
  const refreshStats = useCallback(async (): Promise<void> => {
    try {
      const { getNotificationStats } = await import('@/services/notifications/notificationService');
      const stats = await getNotificationStats();
      setState(prev => ({ ...prev, stats }));
    } catch (error) {
      console.error('[useNotifications] Failed to refresh stats:', error);
    }
  }, []);

  return {
    ...state,
    initialize,
    requestPermissions,
    scheduleJournalNotification,
    scheduleRecommended,
    cancelNotification: cancelNotificationById,
    cancelAll,
    refreshStats
  };
}

// Convenience hook for checking if notifications should be requested
type NotificationPermissionTiming = {
  shouldRequestPermissions: boolean;
  firstEntryCompleted: boolean;
  markFirstEntryCompleted: () => void;
  markPermissionsRequested: () => void;
};

export function useNotificationPermissionTiming(): NotificationPermissionTiming {
  const { user } = useAuth();
  const [shouldRequestPermissions, setShouldRequestPermissions] = useState(false);
  const [firstEntryCompleted, setFirstEntryCompleted] = useState(false);

  // Check if user has completed their first entry
  useEffect(() => {
    const checkFirstEntry = () => {
      const hasCompletedFirstEntry = clientStorageService.get(STORAGE_KEYS.FIRST_ENTRY_COMPLETED) === 'true';
      setFirstEntryCompleted(hasCompletedFirstEntry);
      
      // If they've completed first entry but haven't been asked for permissions
      if (hasCompletedFirstEntry && !clientStorageService.get(STORAGE_KEYS.NOTIFICATION_PERMISSIONS_REQUESTED)) {
        setShouldRequestPermissions(true);
      }
    };

    if (user) {
      checkFirstEntry();
    }
  }, [user]);

  const markFirstEntryCompleted = useCallback(() => {
    clientStorageService.set(STORAGE_KEYS.FIRST_ENTRY_COMPLETED, 'true');
    setFirstEntryCompleted(true);
    
    // Set flag to request permissions after a short delay
    setTimeout(() => {
      setShouldRequestPermissions(true);
    }, 2000); // 2 second delay after entry completion
  }, []);

  const markPermissionsRequested = useCallback(() => {
    clientStorageService.set(STORAGE_KEYS.NOTIFICATION_PERMISSIONS_REQUESTED, 'true');
    setShouldRequestPermissions(false);
  }, []);

  return {
    shouldRequestPermissions,
    firstEntryCompleted,
    markFirstEntryCompleted,
    markPermissionsRequested
  };
}
