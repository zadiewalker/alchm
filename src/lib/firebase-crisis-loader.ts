// EMERGENCY: Crisis-first Firebase loader
// Ultra-minimal Firebase bundle for immediate crisis access

import type { FirebaseApp } from 'firebase/app';

let firebaseApp: FirebaseApp | null = null;
let authInstance: any = null;
let dbInstance: any = null;

// CRITICAL: Load only essential Firebase features synchronously
export const getCrisisFirebase = async () => {
  if (firebaseApp) return { app: firebaseApp, auth: authInstance, db: dbInstance };

  // Ultra-minimal config for crisis scenarios
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  // Dynamic import Firebase app only when needed
  const { initializeApp, getApp, getApps } = await import('firebase/app');
  firebaseApp = getApps().length ? getApp() : initializeApp(config);

  return { app: firebaseApp };
};

// Load auth only when actually needed (not during crisis)
export const getAuthWhenNeeded = async () => {
  if (authInstance) return authInstance;
  
  const { app } = await getCrisisFirebase();
  const { getAuth } = await import('firebase/auth');
  authInstance = getAuth(app);
  return authInstance;
};

// Load Firestore only when journaling (not during crisis)
export const getFirestoreWhenNeeded = async () => {
  if (dbInstance) return dbInstance;
  
  const { app } = await getCrisisFirebase();
  const { getFirestore } = await import('firebase/firestore');
  dbInstance = getFirestore(app);
  return dbInstance;
};

// Crisis safety check - always works
export const isCrisisSystemReady = () => {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
};