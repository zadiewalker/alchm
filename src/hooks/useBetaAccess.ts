'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { betaUserService } from '@/lib/beta/betaUserService';
import { BetaUser } from '@/types/beta';

export interface BetaAccessState {
  isBetaUser: boolean;
  betaUser: BetaUser | null;
  loading: boolean;
  error: string | null;
  hasFeatureFlag: (flag: string) => boolean;
  canAccessFeature: (feature: string) => boolean;
  updateActivity: (activity: { sessionDuration?: number; featuresUsed?: string[]; pageVisited?: string }) => Promise<void>;
}

// Feature flag mapping to permissions
const FEATURE_PERMISSIONS: Record<string, keyof BetaUser['permissions']> = {
  'beta_features': 'canAccessBetaFeatures',
  'bug_reporting': 'canReportBugs',
  'surveys': 'canParticipateInSurveys',
  'interviews': 'canScheduleInterviews',
  'analytics': 'canAccessAnalytics'
};

export function useBetaAccess(): BetaAccessState {
  const { user } = useAuth();
  const [betaUser, setBetaUser] = useState<BetaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBetaUser();
    } else {
      setBetaUser(null);
      setLoading(false);
    }
  }, [user]);

  const loadBetaUser = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const beta = await betaUserService.getBetaUser(user.uid);
      setBetaUser(beta);
      
      // Update last active timestamp
      if (beta) {
        await betaUserService.updateUserActivity(user.uid, {
          pageVisited: window.location.pathname
        });
      }
    } catch (err) {
      console.error('Error loading beta user:', err);
      setError('Failed to load beta access information');
      setBetaUser(null);
    } finally {
      setLoading(false);
    }
  };

  const hasFeatureFlag = (flag: string): boolean => {
    if (!betaUser || betaUser.status !== 'active') return false;
    return betaUser.permissions.featureFlags.includes(flag);
  };

  const canAccessFeature = (feature: string): boolean => {
    if (!betaUser || betaUser.status !== 'active') return false;
    
    const permissionKey = FEATURE_PERMISSIONS[feature];
    if (permissionKey) {
      return betaUser.permissions[permissionKey] as boolean;
    }
    
    // Default to checking feature flags
    return hasFeatureFlag(feature);
  };

  const updateActivity = async (activity: {
    sessionDuration?: number;
    featuresUsed?: string[];
    pageVisited?: string;
  }) => {
    if (!user || !betaUser) return;

    try {
      await betaUserService.updateUserActivity(user.uid, activity);
      
      // Update local state if session data changed
      if (activity.sessionDuration || activity.featuresUsed) {
        const updatedUser = await betaUserService.getBetaUser(user.uid);
        if (updatedUser) {
          setBetaUser(updatedUser);
        }
      }
    } catch (err) {
      console.error('Error updating beta user activity:', err);
    }
  };

  return {
    isBetaUser: !!betaUser && betaUser.status === 'active',
    betaUser,
    loading,
    error,
    hasFeatureFlag,
    canAccessFeature,
    updateActivity
  };
}

// HOC for beta feature gating
export function withBetaAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredFeature?: string
) {
  return function BetaGatedComponent(props: P) {
    const { isBetaUser, canAccessFeature, loading } = useBetaAccess();

    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isBetaUser || (requiredFeature && !canAccessFeature(requiredFeature))) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">
            Beta Access Required
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            This feature is currently in beta testing. Please join our beta program to access it.
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook for tracking feature usage
export function useBetaFeatureTracking() {
  const { updateActivity, isBetaUser } = useBetaAccess();

  const trackFeatureUsage = async (featureName: string, duration?: number) => {
    if (!isBetaUser) return;

    await updateActivity({
      featuresUsed: [featureName],
      sessionDuration: duration
    });
  };

  const trackPageVisit = async (pageName: string) => {
    if (!isBetaUser) return;

    await updateActivity({
      pageVisited: pageName
    });
  };

  return {
    trackFeatureUsage,
    trackPageVisit,
    isBetaUser
  };
}