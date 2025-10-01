// Minimal Firebase app initialization - only loads the core Firebase app
// This ensures the smallest possible initial bundle for non-auth pages

import { initializeApp, getApp, getApps } from 'firebase/app';
import { validateFirebaseConfig, logFirebaseConfigValidation } from './firebase-config-validator';

// BUNDLE-OPTIMIZED Firebase configuration - only essential properties
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  // Optional properties conditionally included to minimize bundle size
  ...(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET && {
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  }),
  ...(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID && {
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  }),
  ...(process.env.NEXT_PUBLIC_FIREBASE_APP_ID && {
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  })
  // Note: measurementId removed as Analytics is lazy-loaded separately
};

// Validate configuration before initializing
const validation = validateFirebaseConfig();
if (!validation.isValid) {
  console.error('❌ Firebase configuration invalid. Missing variables:', validation.missingVariables);
  if (process.env.NODE_ENV === 'development') {
    logFirebaseConfigValidation();
  }
  throw new Error(`Firebase configuration invalid. Missing: ${validation.missingVariables.join(', ')}`);
}

// Log warnings in development
if (validation.warnings.length > 0 && process.env.NODE_ENV === 'development') {
  console.warn('⚠️ Firebase configuration warnings:', validation.warnings);
}

// Single Firebase app instance - core only (minimal bundle impact)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);