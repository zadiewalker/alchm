import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPlatform } from '@/services/platform/platformService';
import { dataService, UserProfile, JournalEntry, DreamEntry, PathwayProgress, ShadowWorkProgress } from '@/services/data/legacyDataService';
import { dataService as containerDataService } from '@/services/data/dataService';
import type { UserContainer } from '@/types/container';

// Custom hook for data management
type UseDataReturn = ReturnType<typeof createUseDataReturn>;

function createUseDataReturn() {
  return {} as {
    isInitialized: boolean;
    userProfile: UserProfile | null;
    migrationStatus: 'none' | 'pending' | 'running' | 'completed' | 'error';
    isLoggedIn: boolean;
    migrateData: () => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    saveJournalEntry: (entry: Omit<JournalEntry, 'id' | 'userId'>) => Promise<string>;
    getJournalEntries: (limit?: number) => Promise<JournalEntry[]>;
    saveDreamEntry: (dream: Omit<DreamEntry, 'id' | 'userId'>) => Promise<string>;
    getDreamEntries: () => Promise<DreamEntry[]>;
    savePathwayProgress: (progress: Omit<PathwayProgress, 'id' | 'userId'>) => Promise<void>;
    getPathwayProgress: (pathwayId: string) => Promise<PathwayProgress | null>;
    saveShadowWorkProgress: (progress: Omit<ShadowWorkProgress, 'id' | 'userId'>) => Promise<void>;
    getShadowWorkProgress: () => Promise<ShadowWorkProgress | null>;
    getUserContainers: () => Promise<UserContainer[]>;
  };
}

export const useData = (): UseDataReturn => {
  const { user, isLoading: authLoading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<'none' | 'pending' | 'running' | 'completed' | 'error'>('none');

  // Initialize data service when user state changes
  useEffect(() => {
    const initializeDataService = async () => {
      try {
        // For ALCHM, we'll initialize immediately for anonymous users
        // Don't wait for auth to complete since we support anonymous usage
        if (!authLoading || (!user && authLoading)) {
          if (user) {
            // User is logged in - set up Firebase
            dataService.setUserId(user.uid);
            
            // Check if migration is needed
            const hasLocalData = checkForLocalStorageData();
            if (hasLocalData) {
              setMigrationStatus('pending');
            }
          } else {
            // Anonymous user - use localStorage
            dataService.setUserId('');
          }

          // Load user profile
          try {
            const profile = await dataService.getUserProfile();
            setUserProfile(profile);
          } catch (error) {
            console.error('❌ Error loading user profile:', error);
            // Don't fail initialization just because profile loading failed
          }

          setIsInitialized(true);
        }
      } catch (error) {
        console.error('❌ Data service initialization failed:', error);
        // Still allow app to function with minimal data
        setIsInitialized(true);
      }
    };

    initializeDataService();
  }, [user, authLoading]);

  // iOS-specific fallback: Force initialization immediately for iOS to prevent blank screen
  useEffect(() => {
    const platform = getPlatform();
    const isIOS = platform === 'ios';
    
    const fallbackTimer = setTimeout(() => {
      if (!isInitialized) {
        dataService.setUserId('');
        setIsInitialized(true);
      }
    }, isIOS ? 500 : 1000); // Faster fallback for iOS

    return () => clearTimeout(fallbackTimer);
  }, [isInitialized, authLoading]);

  const checkForLocalStorageData = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('journal_') || 
        key.startsWith('dream_') || 
        key.startsWith('shadow_') || 
        key.startsWith('alchm_') ||
        key.startsWith('alchm-') ||
        key.startsWith('pathway_')
      );
      return keys.length > 0;
    } catch (error) {
      return false;
    }
  };

  // Migration function
  const migrateData = useCallback(async () => {
    if (!user || migrationStatus !== 'pending') return;

    setMigrationStatus('running');
    try {
      await dataService.migrateLocalStorageToFirebase();
      setMigrationStatus('completed');
      
      // Clear localStorage after successful migration
      if (typeof window !== 'undefined') {
        try {
          const keys = Object.keys(localStorage).filter(key => 
            key.startsWith('journal_') || 
            key.startsWith('dream_') || 
            key.startsWith('shadow_') ||
            key.startsWith('alchm-') ||
            key.startsWith('pathway_')
          );
          keys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
        }
      }
      
      // Reload user profile after migration
      const profile = await dataService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationStatus('error');
    }
  }, [user, migrationStatus]);

  // User profile management
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      await dataService.updateUserProfile(updates);
      const updatedProfile = await dataService.getUserProfile();
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }, []);

  // Journal management
  const saveJournalEntry = useCallback(async (entry: Omit<JournalEntry, 'id' | 'userId'>) => {
    try {
      return await dataService.saveJournalEntry(entry);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }, []);

  const getJournalEntries = useCallback(async (limit?: number) => {
    try {
      return await dataService.getJournalEntries(limit);
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }, []);

  // Dreams management
  const saveDreamEntry = useCallback(async (dream: Omit<DreamEntry, 'id' | 'userId'>) => {
    try {
      return await dataService.saveDreamEntry(dream);
    } catch (error) {
      console.error('Error saving dream entry:', error);
      throw error;
    }
  }, []);

  const getDreamEntries = useCallback(async () => {
    try {
      return await dataService.getDreamEntries();
    } catch (error) {
      console.error('Error getting dream entries:', error);
      return [];
    }
  }, []);

  // Pathway progress management
  const savePathwayProgress = useCallback(async (progress: Omit<PathwayProgress, 'id' | 'userId'>) => {
    try {
      await dataService.savePathwayProgress(progress);
    } catch (error) {
      console.error('Error saving pathway progress:', error);
      throw error;
    }
  }, []);

  const getPathwayProgress = useCallback(async (pathwayId: string) => {
    try {
      return await dataService.getPathwayProgress(pathwayId);
    } catch (error) {
      console.error('Error getting pathway progress:', error);
      return null;
    }
  }, []);

  // Shadow work management
  const saveShadowWorkProgress = useCallback(async (progress: Omit<ShadowWorkProgress, 'id' | 'userId'>) => {
    try {
      await dataService.saveShadowWorkProgress(progress);
    } catch (error) {
      console.error('Error saving shadow work progress:', error);
      throw error;
    }
  }, []);

  const getShadowWorkProgress = useCallback(async () => {
    try {
      return await dataService.getShadowWorkProgress();
    } catch (error) {
      console.error('Error getting shadow work progress:', error);
      return null;
    }
  }, []);

  const getUserContainers = useCallback(async () => {
    try {
      return await containerDataService.getUserContainers();
    } catch (error) {
      console.error('Error getting user containers:', error);
      return [];
    }
  }, []);

  return {
    // State
    isInitialized,
    userProfile,
    migrationStatus,
    isLoggedIn: !!user,
    
    // Migration
    migrateData,
    
    // User management
    updateUserProfile,
    
    // Journal management
    saveJournalEntry,
    getJournalEntries,
    
    // Dreams management
    saveDreamEntry,
    getDreamEntries,
    
    // Pathway management
    savePathwayProgress,
    getPathwayProgress,
    
    // Shadow work management
    saveShadowWorkProgress,
    getShadowWorkProgress,

    // Container management
    getUserContainers
  };
};

export default useData;
