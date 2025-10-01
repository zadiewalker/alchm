'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
// Temporarily disabled for client-side compatibility
// import { UniversalPathwayApi } from '@/lib/pathways/universal-pathway-api';
// import { AlchmMasterPathwayOrchestrator } from '@/lib/pathways/alchm-master-pathway-orchestrator';
// import { PathwaySynergyEngine } from '@/lib/pathways/pathway-synergy-engine';

interface PathwaysState {
  userProfile: any;
  activePathways: any[];
  completedPathways: any[];
  recommendations: any[];
  synergies: any[];
  categories: any[];
  loading: boolean;
  error: string | null;
}

interface PathwaysContextType extends PathwaysState {
  startPathway: (pathwayId: string, userGoals?: any[]) => Promise<void>;
  logProgress: (pathwayId: string, progressData: any) => Promise<void>;
  completeMilestone: (pathwayId: string, milestoneId: string) => Promise<void>;
  activateSynergy: (synergyId: string) => Promise<void>;
  pausePathway: (pathwayId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

type PathwaysAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER_PROFILE'; payload: any }
  | { type: 'SET_RECOMMENDATIONS'; payload: any[] }
  | { type: 'SET_SYNERGIES'; payload: any[] }
  | { type: 'SET_CATEGORIES'; payload: any[] }
  | { type: 'UPDATE_PATHWAY_PROGRESS'; payload: { pathwayId: string; progress: any } }
  | { type: 'START_PATHWAY_SUCCESS'; payload: { pathwayId: string } }
  | { type: 'COMPLETE_MILESTONE_SUCCESS'; payload: { pathwayId: string; milestoneId: string } };

const initialState: PathwaysState = {
  userProfile: null,
  activePathways: [],
  completedPathways: [],
  recommendations: [],
  synergies: [],
  categories: [],
  loading: true,
  error: null
};

const pathwaysReducer = (state: PathwaysState, action: PathwaysAction): PathwaysState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER_PROFILE':
      return { 
        ...state, 
        userProfile: action.payload,
        activePathways: action.payload?.active_pathways || [],
        completedPathways: action.payload?.completed_pathways || []
      };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'SET_SYNERGIES':
      return { ...state, synergies: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'UPDATE_PATHWAY_PROGRESS':
      return {
        ...state,
        activePathways: state.activePathways.map(pathway =>
          pathway.pathway_id === action.payload.pathwayId
            ? { ...pathway, ...action.payload.progress }
            : pathway
        )
      };
    case 'START_PATHWAY_SUCCESS':
      // This will be handled by refreshing the data
      return state;
    case 'COMPLETE_MILESTONE_SUCCESS':
      // This will be handled by refreshing the data
      return state;
    default:
      return state;
  }
};

const PathwaysContext = createContext<PathwaysContextType | null>(null);

export function PathwaysProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(pathwaysReducer, initialState);
  const { user } = useAuth();

  // Initialize API instances
  // Temporarily disabled for client-side compatibility
  // const pathwayApi = new UniversalPathwayApi();
  // const orchestrator = new AlchmMasterPathwayOrchestrator();
  // const synergyEngine = new PathwaySynergyEngine();

  // Load all pathway data - simplified for now
  const refreshData = async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Mock data for now until server-side API is available
      const userProfile = { active_pathways: [], coherence_score: 0.3 };
      const recommendations: any[] = [];
      const synergies: any[] = [];
      const categories: any[] = [];

      dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      dispatch({ type: 'SET_SYNERGIES', payload: synergies });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });

    } catch (error) {
      console.error('Error loading pathway data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load pathway data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Reset state when user logs out
      dispatch({ type: 'SET_USER_PROFILE', payload: null });
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: [] });
      dispatch({ type: 'SET_SYNERGIES', payload: [] });
      dispatch({ type: 'SET_CATEGORIES', payload: [] });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  // Start a pathway
  const startPathway = async (pathwayId: string, userGoals?: any[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await pathwayApi.startPathway(user.uid, pathwayId, userGoals);
      dispatch({ type: 'START_PATHWAY_SUCCESS', payload: { pathwayId } });
      
      // Refresh data to show the new pathway
      await refreshData();
    } catch (error) {
      console.error('Error starting pathway:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to start pathway' });
      throw error;
    }
  };

  // Log pathway progress
  const logProgress = async (pathwayId: string, progressData: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await pathwayApi.logPathwayProgress(user.uid, pathwayId, progressData);
      dispatch({ 
        type: 'UPDATE_PATHWAY_PROGRESS', 
        payload: { pathwayId, progress: progressData } 
      });
    } catch (error) {
      console.error('Error logging progress:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to log progress' });
      throw error;
    }
  };

  // Complete a milestone
  const completeMilestone = async (pathwayId: string, milestoneId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const result = await pathwayApi.completeMilestone(user.uid, pathwayId, milestoneId);
      dispatch({ 
        type: 'COMPLETE_MILESTONE_SUCCESS', 
        payload: { pathwayId, milestoneId } 
      });
      
      // Refresh data to show milestone completion
      await refreshData();
      
      return result;
    } catch (error) {
      console.error('Error completing milestone:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to complete milestone' });
      throw error;
    }
  };

  // Activate a synergy
  const activateSynergy = async (synergyId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await synergyEngine.activateSynergy(user.uid, synergyId);
      
      // Refresh synergies to show the activation
      const updatedSynergies = await synergyEngine.detectActiveSynergies(user.uid);
      dispatch({ type: 'SET_SYNERGIES', payload: updatedSynergies });
    } catch (error) {
      console.error('Error activating synergy:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to activate synergy' });
      throw error;
    }
  };

  // Pause a pathway
  const pausePathway = async (pathwayId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await pathwayApi.pausePathway(user.uid, pathwayId);
      
      // Refresh data to show the paused status
      await refreshData();
    } catch (error) {
      console.error('Error pausing pathway:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to pause pathway' });
      throw error;
    }
  };

  const contextValue: PathwaysContextType = {
    ...state,
    startPathway,
    logProgress,
    completeMilestone,
    activateSynergy,
    pausePathway,
    refreshData
  };

  return (
    <PathwaysContext.Provider value={contextValue}>
      {children}
    </PathwaysContext.Provider>
  );
}

export function usePathways() {
  const context = useContext(PathwaysContext);
  if (!context) {
    throw new Error('usePathways must be used within a PathwaysProvider');
  }
  return context;
}

export default PathwaysContext;