'use client';

/**
 * CRISIS-CRITICAL: EMERGENCY DYNAMIC FIREBASE AUTH
 * All Firebase imports are now dynamic to prevent massive bundle bloat
 * Target: Reduce from 9.37 MiB to <500KB
 */

import { getFirebaseApp } from '@/lib/firebase';

// Firebase Auth instance
let authInstance: any = null;

async function getAuthInstance() {
  if (!authInstance) {
    const app = await getFirebaseApp();
    const { getAuth } = await import('firebase/auth');
    authInstance = getAuth(app);
  }
  return authInstance;
}

// Helper function to create user profile if needed
async function createUserProfileIfNeeded(user: any) {
  try {
    const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
    const db = getFirestore();
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Create user profile
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
    } else {
      // Update last active time for existing users
      await setDoc(doc(db, 'users', user.uid), {
        lastActiveAt: new Date()
      }, { merge: true });
    }
  } catch (error) {
    console.error('User profile creation error:', error);
    // Don't fail authentication if profile creation fails
  }
}

// Email/Password Authentication
export async function signInWithEmail(email: string, password: string) {
  try {
    const auth = await getAuthInstance();
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    return {
      user: null,
      error: getFriendlyErrorMessage(error.code || error.message)
    };
  }
}


// Create Account with Email/Password
export async function createAccountWithEmail(email: string, password: string, displayName?: string) {
  try {
    const auth = await getAuthInstance();
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore after successful account creation
    if (result.user) {
      try {
        const { getFirestore, doc, setDoc } = await import('firebase/firestore');
        const db = getFirestore();
        
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: displayName || result.user.displayName || 'ALCHM User',
          photoURL: result.user.photoURL,
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
      } catch (firestoreError) {
        console.error('User profile creation error:', firestoreError);
        // Don't fail the account creation if profile creation fails
      }
    }
    
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    console.error('Account creation error:', error);
    return {
      user: null,
      error: getFriendlyErrorMessage(error.code || error.message)
    };
  }
}

// Sign Out
export async function signOut() {
  try {
    const auth = await getAuthInstance();
    await auth.signOut();
    
    return {
      error: null
    };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return {
      error: getFriendlyErrorMessage(error.code || error.message)
    };
  }
}

// Helper function for user-friendly error messages
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
    case 'auth/popup-blocked':
      return 'Pop-ups are blocked. Please allow pop-ups or try signing in with email and password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/invalid-credential':
      return 'Invalid login credentials. Please check your email and password.';
    case 'Connection issue':
      return 'Connection issue. Please check your internet connection and try again.';
    default:
      console.log('Unknown auth error code:', errorCode);
      return 'Something went wrong. Please try again in a moment.';
  }
}

// Apple Sign In Authentication (secondary option - guest-first is primary)
export async function signInWithApple() {
  try {
    const auth = await getAuthInstance();
    const { OAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    
    // Use popup for desktop and mobile
    const result = await signInWithPopup(auth, provider);
    
    // Check if user profile exists in Firestore, create if needed
    if (result.user) {
      await createUserProfileIfNeeded(result.user);
    }
    
    return {
      user: result.user,
      error: null,
      authMethod: 'apple-popup'
    };
  } catch (error: any) {
    console.error('Apple sign-in error:', error);
    
    // Handle Apple-specific errors
    if (error.code === 'auth/popup-blocked') {
      try {
        const auth = await getAuthInstance();
        const { OAuthProvider, signInWithRedirect } = await import('firebase/auth');
        const provider = new OAuthProvider('apple.com');
        await signInWithRedirect(auth, provider);
        
        return {
          user: null,
          error: null,
          authMethod: 'apple-redirect',
          pending: true
        };
      } catch (redirectError: any) {
        return {
          user: null,
          error: getFriendlyErrorMessage(redirectError.code || redirectError.message)
        };
      }
    }
    
    return {
      user: null,
      error: getFriendlyErrorMessage(error.code || error.message)
    };
  }
}

// Mobile-optimized Apple Authentication
export async function signInWithAppleMobile() {
  try {
    const auth = await getAuthInstance();
    const { OAuthProvider, signInWithPopup, signInWithRedirect } = await import('firebase/auth');
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    
    // Apple Sign In works well on both iOS Safari and other mobile browsers
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS: Apple Sign In is native and works well with popup
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists in Firestore, create if needed
      if (result.user) {
        await createUserProfileIfNeeded(result.user);
      }
      
      return {
        user: result.user,
        error: null,
        authMethod: 'apple-ios-popup'
      };
    } else {
      // Android and other mobile: Try popup first, fall back to redirect
      try {
        const result = await signInWithPopup(auth, provider);
        
        // Check if user profile exists in Firestore, create if needed
        if (result.user) {
          await createUserProfileIfNeeded(result.user);
        }
        
        return {
          user: result.user,
          error: null,
          authMethod: 'apple-mobile-popup'
        };
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked') {
          // Fall back to redirect
          await signInWithRedirect(auth, provider);
          
          return {
            user: null,
            error: null,
            authMethod: 'apple-redirect-fallback',
            pending: true
          };
        }
        throw popupError;
      }
    }
  } catch (error: any) {
    console.error('Apple mobile sign-in error:', error);
    return {
      user: null,
      error: getFriendlyErrorMessage(error.code || error.message)
    };
  }
}

// Guest/Anonymous Sign In Authentication
export async function signInAsGuest() {
  try {
    const auth = await getAuthInstance();
    const { signInAnonymously } = await import('firebase/auth');
    const result = await signInAnonymously(auth);
    
    return {
      user: result.user,
      error: null
    };
  } catch (error: any) {
    console.error('Guest sign-in error:', error);
    return {
      user: null,
      error: getFriendlyErrorMessage(error.code || error.message)
    };
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const auth = await getAuthInstance();
    return auth.currentUser;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}