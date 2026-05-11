'use client';

import { useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { getFirebaseAuthOrNull } from '@/services/firebase/firebaseService';
import { useSafeAsync } from './useSafeAsync';
import type { AuthState, UserProfile, AppTier } from '@/types/user';
import type { AuthFlowResult, AuthProfileSeed } from '@/types/auth';

export function useAuth(): AuthState & {
  userId?: string;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (tier: AppTier) => Promise<void>;
  signUpWithEmail: (email: string, password: string, profileSeed?: AuthProfileSeed) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithApple: (profileSeed?: AuthProfileSeed) => Promise<AuthFlowResult>;
  sendPasswordReset: (email: string) => Promise<void>;
} {
  const { isMounted, safeDispatch } = useSafeAsync();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isAnonymous: true,
  });

  const setStateSafe = safeDispatch(setState);

  const loadProfile = useCallback(async (user: User) => {
    try {
      const { loadUserProfile } = await import('@/services/auth/authService');
      const profile: UserProfile | null = await loadUserProfile(user);

      if (isMounted()) {
        setStateSafe({
          user,
          profile,
          isLoading: false,
          isAuthenticated: !user.isAnonymous,
          isAnonymous: user.isAnonymous,
        });
      }
    } catch {
      if (isMounted()) {
        setStateSafe(prev => ({
          ...prev,
          user,
          isLoading: false,
          isAuthenticated: !user.isAnonymous,
          isAnonymous: user.isAnonymous,
        }));
      }
    }
  }, [isMounted, setStateSafe]);

  useEffect(() => {
    const auth = getFirebaseAuthOrNull();
    if (!auth) {
      if (isMounted()) {
        setStateSafe(prev => ({ ...prev, isLoading: false }));
      }
      return;
    }

    let unsubscribe = () => {};
    let cancelled = false;

    void import('@/services/auth/authService')
      .then(async ({ onAuthChanged, resolvePendingAuthRedirect }) => {
        try {
          await resolvePendingAuthRedirect();
        } catch {
          // Redirect completion failures surface through the auth UI entry points.
        }

        if (cancelled) return;
        unsubscribe = onAuthChanged((user) => {
          if (user) {
            void loadProfile(user);
            return;
          }

          if (isMounted()) {
            setStateSafe({
              user: null,
              profile: null,
              isLoading: false,
              isAuthenticated: false,
              isAnonymous: true,
            });
          }
        });
      })
      .catch(() => {
        if (isMounted()) {
          setStateSafe(prev => ({ ...prev, isLoading: false }));
        }
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [loadProfile, isMounted, setStateSafe]);

  const signOut = useCallback(async () => {
    const { signOut: _signOut } = await import('@/services/auth/authService');
    await _signOut();
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, profileSeed?: AuthProfileSeed) => {
    const authService = await import('@/services/auth/authService');
    await authService.signUpWithEmail(email, password, profileSeed);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const authService = await import('@/services/auth/authService');
    await authService.signInWithEmail(email, password);
  }, []);

  const signInWithApple = useCallback(async (profileSeed?: AuthProfileSeed) => {
    const authService = await import('@/services/auth/authService');
    return authService.signInWithApple(profileSeed);
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const authService = await import('@/services/auth/authService');
    await authService.sendPasswordReset(email);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (state.user) await loadProfile(state.user);
  }, [state.user, loadProfile]);

  const updateProfile = useCallback(async (tier: AppTier) => {
    if (!state.user) return;

    try {
      const { updateUserProfileTier } = await import('@/services/auth/authService');
      await updateUserProfileTier(state.user.uid, tier);

      // Update local state
      if (state.profile) {
        setStateSafe(prev => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, tier } : null
        }));
      }
    } catch (error) {
      console.error('Failed to update profile tier:', error);
    }
  }, [state.user, state.profile, setStateSafe]);

  return {
    ...state,
    userId: state.user?.uid,
    signOut,
    refreshProfile,
    updateProfile,
    signUpWithEmail,
    signInWithEmail,
    signInWithApple,
    sendPasswordReset,
  };
}
