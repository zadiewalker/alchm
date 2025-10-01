'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { initAuth, initFirestore, getCurrentUserSync } from './firebase-dynamic';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const setupAuth = async () => {
      const { onAuthStateChanged } = await import('firebase/auth');
      const auth = await initAuth();
      
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setAuthState({
          user,
          loading: false,
          error: null
        });
      });
    };
    
    setupAuth();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [{ signInWithEmailAndPassword }, auth] = await Promise.all([
        import('firebase/auth'),
        initAuth()
      ]);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      const friendlyError = getFriendlyErrorMessage(error.code);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: friendlyError 
      }));
      throw new Error(friendlyError);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [{ createUserWithEmailAndPassword }, { doc, setDoc }, auth, db] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
        initAuth(),
        getFirestore()
      ]);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || user.displayName || 'ALCHM User',
        createdAt: new Date(),
        lastActiveAt: new Date(),
        tier: 'free',
        preferences: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: 'en',
          notificationSettings: {
            dailyReflectionReminder: true,
            dailyReminderTime: '20:00',
            moodCheckInReminder: false,
            crisisAlerts: true,
            achievementCelebrations: true,
            weeklyInsights: true
          },
          privacySettings: {
            dataRetentionPeriod: 365,
            shareAnonymizedInsights: false,
            allowResearchParticipation: false
          }
        },
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        riskLevel: 'low',
        crisisPreventionEnabled: true,
        emergencyContacts: []
      });
      
      return user;
    } catch (error: any) {
      const friendlyError = getFriendlyErrorMessage(error.code);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: friendlyError 
      }));
      throw new Error(friendlyError);
    }
  };

  const signInWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [{ signInWithPopup, GoogleAuthProvider }, { doc, getDoc, setDoc }, auth, db] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
        initAuth(),
        getFirestore()
      ]);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || 'ALCHM User',
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastActiveAt: new Date(),
          tier: 'free',
          preferences: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: 'en',
            notificationSettings: {
              dailyReflectionReminder: true,
              dailyReminderTime: '20:00',
              moodCheckInReminder: false,
              crisisAlerts: true,
              achievementCelebrations: true,
              weeklyInsights: true
            },
            privacySettings: {
              dataRetentionPeriod: 365,
              shareAnonymizedInsights: false,
              allowResearchParticipation: false
            }
          },
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
          riskLevel: 'low',
          crisisPreventionEnabled: true,
          emergencyContacts: []
        });
      }
      
      return user;
    } catch (error: any) {
      const friendlyError = getFriendlyErrorMessage(error.code);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: friendlyError 
      }));
      throw new Error(friendlyError);
    }
  };

  const signOut = async () => {
    try {
      const [{ signOut: firebaseSignOut }, auth] = await Promise.all([
        import('firebase/auth'),
        initAuth()
      ]);
      
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    clearError,
    isAuthenticated: !!authState.user
  };
}

function getFriendlyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return "We don't have an account with this email address. Would you like to create a new account?";
    case 'auth/wrong-password':
      return 'The password you entered is incorrect. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Please choose a stronger password (at least 6 characters).';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again if you want to continue.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    default:
      return 'Something went wrong. Please try again in a moment.';
  }
}