'use client';

// EMERGENCY: Crisis-optimized authentication for mobile users
// Minimal dependencies, maximum reliability

import { getEmergencyFirebaseAuth, createEmergencySession } from '@/lib/emergency-firebase';

// Emergency authentication result
interface EmergencyAuthResult {
  success: boolean;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
  };
  error?: string;
  requiresRedirect?: boolean;
}

// CRISIS-CRITICAL: Emergency Google sign-in for mobile
export async function emergencyGoogleSignIn(): Promise<EmergencyAuthResult> {
  try {
    const auth = await getEmergencyFirebaseAuth();
    const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import('firebase/auth');
    
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    // Detect mobile for redirect vs popup
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS: Use redirect to avoid popup blocking
      await signInWithRedirect(auth, provider);
      return { success: true, requiresRedirect: true };
    } else if (isMobile) {
      // Android mobile: Try popup first
      try {
        const result = await signInWithPopup(auth, provider);
        const success = createEmergencySession(result.user.uid, result.user.email || '');
        
        return {
          success: true,
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          }
        };
      } catch (popupError: any) {
        // Fallback to redirect on mobile
        if (popupError.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
          return { success: true, requiresRedirect: true };
        }
        throw popupError;
      }
    } else {
      // Desktop: Use popup
      const result = await signInWithPopup(auth, provider);
      const success = createEmergencySession(result.user.uid, result.user.email || '');
      
      return {
        success: true,
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName
        }
      };
    }
  } catch (error: any) {
    console.error('Emergency Google sign-in failed:', error);
    
    return {
      success: false,
      error: getEmergencyErrorMessage(error.code || error.message)
    };
  }
}

// CRISIS-CRITICAL: Emergency email sign-in
export async function emergencyEmailSignIn(email: string, password: string): Promise<EmergencyAuthResult> {
  try {
    const auth = await getEmergencyFirebaseAuth();
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    const success = createEmergencySession(result.user.uid, result.user.email || '');
    
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }
    };
  } catch (error: any) {
    console.error('Emergency email sign-in failed:', error);
    
    return {
      success: false,
      error: getEmergencyErrorMessage(error.code || error.message)
    };
  }
}

// Emergency error messages - trauma-informed
function getEmergencyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return "We don't recognize this email. Would you like to create an account instead?";
    case 'auth/wrong-password':
      return 'Password incorrect. Take your time - you can try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment before trying again.';
    case 'auth/network-request-failed':
      return 'Connection issue. Please check your internet and try again.';
    case 'auth/popup-blocked':
      return 'Pop-ups are blocked. We\'ll try a different sign-in method.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. You can try again when ready.';
    default:
      return 'Sign-in encountered an issue. You\'re safe here - please try again.';
  }
}