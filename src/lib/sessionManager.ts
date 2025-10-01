'use client';

import { getAuth } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken,
  User as FirebaseUser
} from 'firebase/auth';
import { AuthError, AuthErrorCode, FIREBASE_ERROR_MAP, AUTH_ERROR_MESSAGES } from '../types/auth';

// Session storage keys
const SESSION_STORAGE_KEY = 'alchm_session_data';
const REFRESH_TIMER_KEY = 'alchm_refresh_timer';

export interface SessionData {
  token: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    emailVerified: boolean;
  };
}

class SessionManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private authStateChangeListener: (() => void) | null = null;
  private sessionRefreshPromise: Promise<string> | null = null;

  constructor() {
    this.initializeSessionMonitoring();
  }

  // Initialize session monitoring and auto-refresh
  private initializeSessionMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Listen to Firebase auth state changes
    this.authStateChangeListener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.refreshSessionToken();
        this.scheduleTokenRefresh();
      } else {
        this.clearSession();
        this.clearRefreshTimer();
      }
    });

    // Restore session on page load
    this.restoreSession();
  }

  // Sign in with email and password
  async signIn(email: string, password: string, rememberMe: boolean = true): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const sessionToken = await this.createSessionCookie(userCredential.user);
      
      if (rememberMe) {
        await this.persistSession(userCredential.user, sessionToken);
      }
      
      this.scheduleTokenRefresh();
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName && userCredential.user) {
        await userCredential.user.updateProfile({ displayName });
      }
      
      const sessionToken = await this.createSessionCookie(userCredential.user);
      await this.persistSession(userCredential.user, sessionToken);
      
      this.scheduleTokenRefresh();
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      await this.clearSessionCookie();
      this.clearSession();
      this.clearRefreshTimer();
    } catch (error: any) {
      console.error('[SessionManager] Sign out error:', error);
      // Clear local session even if server sign out fails
      this.clearSession();
      this.clearRefreshTimer();
    }
  }

  // Refresh session token
  async refreshSessionToken(): Promise<string> {
    // Prevent concurrent refresh requests
    if (this.sessionRefreshPromise) {
      return this.sessionRefreshPromise;
    }

    this.sessionRefreshPromise = this.performTokenRefresh();
    
    try {
      const token = await this.sessionRefreshPromise;
      return token;
    } finally {
      this.sessionRefreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user for token refresh');
    }

    try {
      // Force refresh to get a new token
      const token = await getIdToken(user, true);
      
      // Create session cookie on server
      const sessionToken = await this.createSessionCookie(user);
      
      // Update stored session data
      const sessionData = this.getStoredSession();
      if (sessionData) {
        sessionData.token = sessionToken;
        sessionData.expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
        this.storeSession(sessionData);
      }
      
      return sessionToken;
    } catch (error) {
      console.error('[SessionManager] Token refresh failed:', error);
      throw this.mapFirebaseError(error);
    }
  }

  // Create session cookie on server
  private async createSessionCookie(user: FirebaseUser): Promise<string> {
    try {
      const idToken = await getIdToken(user);
      
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error(`Session creation failed: ${response.status}`);
      }

      const { sessionCookie } = await response.json();
      return sessionCookie;
    } catch (error) {
      console.error('[SessionManager] Session cookie creation failed:', error);
      throw error;
    }
  }

  // Clear session cookie on server
  private async clearSessionCookie(): Promise<void> {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('[SessionManager] Session cookie clearing failed:', error);
    }
  }

  // Persist session data to localStorage
  private async persistSession(user: FirebaseUser, sessionToken: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const refreshToken = user.refreshToken;
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour

    const sessionData: SessionData = {
      token: sessionToken,
      refreshToken,
      expiresAt,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      },
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('[SessionManager] Failed to persist session:', error);
    }
  }

  // Restore session from localStorage
  private restoreSession(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return;

      const sessionData: SessionData = JSON.parse(stored);
      
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        this.clearSession();
        return;
      }

      // Schedule refresh for this session
      this.scheduleTokenRefresh();
    } catch (error) {
      console.warn('[SessionManager] Failed to restore session:', error);
      this.clearSession();
    }
  }

  // Get stored session data
  private getStoredSession(): SessionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('[SessionManager] Failed to get stored session:', error);
      return null;
    }
  }

  // Store updated session data
  private storeSession(sessionData: SessionData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('[SessionManager] Failed to store session:', error);
    }
  }

  // Clear session data
  private clearSession(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TIMER_KEY);
    } catch (error) {
      console.warn('[SessionManager] Failed to clear session:', error);
    }
  }

  // Schedule automatic token refresh
  private scheduleTokenRefresh(): void {
    this.clearRefreshTimer();

    const sessionData = this.getStoredSession();
    if (!sessionData) return;

    // Refresh 5 minutes before expiry
    const refreshIn = Math.max(0, sessionData.expiresAt - Date.now() - (5 * 60 * 1000));

    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshSessionToken();
        // Schedule next refresh
        this.scheduleTokenRefresh();
      } catch (error) {
        console.error('[SessionManager] Scheduled refresh failed:', error);
        // Clear session on refresh failure
        this.clearSession();
      }
    }, refreshIn);

    // Store timer ID for cleanup
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TIMER_KEY, this.refreshTimer.toString());
    }
  }

  // Clear refresh timer
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Check if session is valid and not near expiry
  isSessionValid(): boolean {
    const sessionData = this.getStoredSession();
    if (!sessionData) return false;

    // Consider session invalid if it expires within 10 minutes
    const tenMinutes = 10 * 60 * 1000;
    return Date.now() + tenMinutes < sessionData.expiresAt;
  }

  // Get current session data
  getCurrentSession(): SessionData | null {
    return this.getStoredSession();
  }

  // Map Firebase errors to our error types
  private mapFirebaseError(error: any): AuthError {
    const code = FIREBASE_ERROR_MAP[error.code] || AuthErrorCode.UNKNOWN_ERROR;
    
    return {
      code,
      message: error.message || 'An unexpected error occurred',
      userMessage: AUTH_ERROR_MESSAGES[code],
      details: error
    };
  }

  // Cleanup on unmount
  destroy(): void {
    this.clearRefreshTimer();
    if (this.authStateChangeListener) {
      this.authStateChangeListener();
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();

// React hook for session management
export function useSessionManager() {
  return {
    signIn: sessionManager.signIn.bind(sessionManager),
    signUp: sessionManager.signUp.bind(sessionManager),
    signOut: sessionManager.signOut.bind(sessionManager),
    refreshSession: sessionManager.refreshSessionToken.bind(sessionManager),
    isSessionValid: sessionManager.isSessionValid.bind(sessionManager),
    getCurrentSession: sessionManager.getCurrentSession.bind(sessionManager),
  };
}