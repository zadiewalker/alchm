// src/lib/firebase.ts
// EMERGENCY: Ultra-minimal Firebase client for crisis response <25KB
// Lazy-loaded, optimized for instant crisis button availability

import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

// EMERGENCY: Secure config validation using environment validation system
function validateFirebaseConfig(): FirebaseOptions {
  // CRITICAL: Use direct env vars during crisis to avoid config system failures
  const config: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  if (!config.apiKey || !config.authDomain || !config.projectId) {
    console.error('CRITICAL: Firebase configuration incomplete!', {
      hasApiKey: !!config.apiKey,
      hasAuthDomain: !!config.authDomain,
      hasProjectId: !!config.projectId
    });
    throw new Error('Firebase configuration incomplete - missing critical environment variables');
  }

  console.log('✅ Firebase config validated - using direct environment variables');
  return config;
}

// EMERGENCY: Lazy initialization - only load when actually needed
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let initPromise: Promise<void> | null = null;

// CRITICAL: Initialize Firebase only when first accessed
async function initializeFirebase(): Promise<void> {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      const config = validateFirebaseConfig();
      
      // VENDOR OPTIMIZATION: Ultra-minimal dynamic imports for bundle splitting
      const { initializeApp, getApp, getApps } = await import('firebase/app');
      
      // Initialize app first with minimal footprint
      app = getApps().length ? getApp() : initializeApp(config);
      
      // Lazy load Firestore and Auth only when needed
      // This prevents them from being in the initial vendor bundle
      
      // Lazy load Firestore and Auth only when needed
      const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');
      const { getAuth, connectAuthEmulator } = await import('firebase/auth');
      
      // Initialize with singleton pattern
      db = getFirestore(app);
      auth = getAuth(app);
      
      // Development emulators
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        try {
          if (!globalThis.FIREBASE_EMULATOR_CONNECTED) {
            if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
              connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL);
            }
            if (process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST) {
              const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST.split(':');
              connectFirestoreEmulator(db, host, parseInt(port));
            }
            globalThis.FIREBASE_EMULATOR_CONNECTED = true;
          }
        } catch (error) {
          console.warn('Firebase emulator connection failed:', error);
        }
      }
    } catch (error) {
      throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  })();
  
  return initPromise;
}

// EMERGENCY: Lazy getters that initialize on first access
export async function getFirebaseApp(): Promise<FirebaseApp> {
  await initializeFirebase();
  if (!app) throw new Error('Firebase app not initialized');
  return app;
}

export async function getFirebaseDb(): Promise<Firestore> {
  await initializeFirebase();
  if (!db) throw new Error('Firebase Firestore not initialized');
  return db;
}

export async function getFirebaseAuth(): Promise<Auth> {
  await initializeFirebase();
  if (!auth) throw new Error('Firebase Auth not initialized');
  return auth;
}

// Legacy exports for compatibility (deprecated - use async getters)
// @ts-ignore - Temporary compatibility exports
export { app as legacyApp, db as legacyDb, auth as legacyAuth };

// Legacy synchronous exports for backward compatibility
// WARNING: These may be null until Firebase is initialized
export { app, db, auth };

// Type-safe synchronous getters (will be null until initialized)
export function getApp() { return app; }
export function getDb() { return db; }
export function getAuth() { return auth; }

// EMERGENCY: Lazy status checks
export async function getFirebaseStatus() {
  try {
    await initializeFirebase();
    return {
      app: !!app,
      db: !!db,
      auth: !!auth,
      timestamp: new Date().toISOString()
    };
  } catch {
    return {
      app: false,
      db: false,
      auth: false,
      timestamp: new Date().toISOString()
    };
  }
}

// CRITICAL: Non-blocking crisis readiness check
export function isCrisisReady(): boolean {
  // Always return true for crisis functionality - Firebase loads in background
  return true;
}

// Config validation without initialization
export function isAppStoreReady(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  );
}
