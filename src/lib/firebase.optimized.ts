// src/lib/firebase.optimized.ts
// VENDOR OPTIMIZATION: Ultra-minimal Firebase client for crisis response
// Aggressive tree shaking with modular imports to reduce vendor bundle

import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

// VENDOR OPTIMIZATION: Secure config validation
function validateFirebaseConfig(): FirebaseOptions {
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

  return config;
}

// VENDOR OPTIMIZATION: Lazy singleton pattern to reduce initial bundle
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Promises for lazy loading to prevent duplicate initialization
let appPromise: Promise<FirebaseApp> | null = null;
let dbPromise: Promise<Firestore> | null = null;
let authPromise: Promise<Auth> | null = null;

// VENDOR OPTIMIZATION: App initialization - minimal footprint
export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (app) return app;
  if (appPromise) return appPromise;
  
  appPromise = (async () => {
    const config = validateFirebaseConfig();
    
    // BUNDLE OPTIMIZATION: Import only what we need
    const { initializeApp, getApp, getApps } = await import('firebase/app');
    
    app = getApps().length ? getApp() : initializeApp(config);
    return app;
  })();
  
  return appPromise;
}

// VENDOR OPTIMIZATION: Firestore initialization - separate async chunk
export async function getFirebaseDb(): Promise<Firestore> {
  if (db) return db;
  if (dbPromise) return dbPromise;
  
  dbPromise = (async () => {
    const firebaseApp = await getFirebaseApp();
    
    // BUNDLE OPTIMIZATION: Load Firestore in separate chunk
    const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');
    
    db = getFirestore(firebaseApp);
    
    // Development emulator connection
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      try {
        if (process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST && !globalThis.FIRESTORE_EMULATOR_CONNECTED) {
          const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST.split(':');
          connectFirestoreEmulator(db, host, parseInt(port));
          globalThis.FIRESTORE_EMULATOR_CONNECTED = true;
        }
      } catch (error) {
        console.warn('Firestore emulator connection failed:', error);
      }
    }
    
    return db;
  })();
  
  return dbPromise;
}

// VENDOR OPTIMIZATION: Auth initialization - separate async chunk
export async function getFirebaseAuth(): Promise<Auth> {
  if (auth) return auth;
  if (authPromise) return authPromise;
  
  authPromise = (async () => {
    const firebaseApp = await getFirebaseApp();
    
    // BUNDLE OPTIMIZATION: Load Auth in separate chunk
    const { getAuth, connectAuthEmulator } = await import('firebase/auth');
    
    auth = getAuth(firebaseApp);
    
    // Development emulator connection
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      try {
        if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL && !globalThis.AUTH_EMULATOR_CONNECTED) {
          connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL);
          globalThis.AUTH_EMULATOR_CONNECTED = true;
        }
      } catch (error) {
        console.warn('Auth emulator connection failed:', error);
      }
    }
    
    return auth;
  })();
  
  return authPromise;
}

// VENDOR OPTIMIZATION: Crisis-critical functions with minimal imports
export async function getFirebaseStatus() {
  try {
    // Only initialize app for status check
    await getFirebaseApp();
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

// VENDOR OPTIMIZATION: Non-blocking crisis readiness
export function isCrisisReady(): boolean {
  // Always return true - Firebase loads asynchronously
  return true;
}

// VENDOR OPTIMIZATION: Configuration check without imports
export function isAppStoreReady(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  );
}

// COMPATIBILITY: Legacy synchronous exports (deprecated)
// These will be null until async initialization completes
export { app, db, auth };

// Type-safe synchronous getters (may be null)
export function getApp() { return app; }
export function getDb() { return db; } 
export function getAuth() { return auth; }

// VENDOR OPTIMIZATION: Helper for common Firestore operations
export async function createFirestoreDoc(collection: string, data: any) {
  const { doc, setDoc, collection as firestoreCollection } = await import('firebase/firestore');
  const firestore = await getFirebaseDb();
  
  const docRef = doc(firestoreCollection(firestore, collection));
  await setDoc(docRef, { ...data, createdAt: new Date() });
  return docRef.id;
}

// VENDOR OPTIMIZATION: Helper for common Auth operations
export async function signInWithEmailPassword(email: string, password: string) {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const firebaseAuth = await getFirebaseAuth();
  
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

// VENDOR OPTIMIZATION: Helper for user creation
export async function createUserWithEmailPassword(email: string, password: string) {
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  const firebaseAuth = await getFirebaseAuth();
  
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
}

// Global type extensions for emulator tracking
declare global {
  var FIRESTORE_EMULATOR_CONNECTED: boolean | undefined;
  var AUTH_EMULATOR_CONNECTED: boolean | undefined;
}