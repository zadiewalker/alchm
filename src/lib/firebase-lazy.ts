// Lazy-loaded Firebase SDK modules for optimal bundle splitting
// This ensures Firebase Auth/Firestore are only loaded when needed

import type { Auth, Firestore, Functions } from 'firebase/app';

// Global instances (will be loaded dynamically)
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let functionsInstance: Functions | null = null;

// Lazy loader for Firebase Auth
export async function getFirebaseAuth(): Promise<Auth> {
  if (authInstance) return authInstance;
  
  const [{ getAuth }, { app }] = await Promise.all([
    import('firebase/auth'),
    import('./firebase-app-only')
  ]);
  
  authInstance = getAuth(app);
  return authInstance;
}

// Lazy loader for Firestore
export async function getFirebaseFirestore(): Promise<Firestore> {
  if (dbInstance) return dbInstance;
  
  const [
    { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager },
    { app }
  ] = await Promise.all([
    import('firebase/firestore'),
    import('./firebase-app-only')
  ]);
  
  // Initialize with persistence only on client side
  if (typeof window !== 'undefined') {
    try {
      dbInstance = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch (error) {
      // Fallback if persistence fails
      dbInstance = getFirestore(app);
    }
  } else {
    dbInstance = getFirestore(app);
  }
  
  return dbInstance;
}

// Lazy loader for Functions
export async function getFirebaseFunctions(): Promise<Functions> {
  if (functionsInstance) return functionsInstance;
  
  const [{ getFunctions }, { app }] = await Promise.all([
    import('firebase/functions'),
    import('./firebase-app-only')
  ]);
  
  functionsInstance = getFunctions(app);
  return functionsInstance;
}

// Lazy loader for Performance (only in production)
export async function getFirebasePerformance() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  try {
    const [{ getPerformance }, { app }] = await Promise.all([
      import('firebase/performance'),
      import('./firebase-app-only')
    ]);
    
    return getPerformance(app);
  } catch (error) {
    console.warn('Firebase Performance monitoring failed to initialize:', error);
    return null;
  }
}

// Lazy loader for Analytics (with support check)
export async function getFirebaseAnalytics() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  try {
    const [{ getAnalytics, isSupported }, { app }] = await Promise.all([
      import('firebase/analytics'),
      import('./firebase-app-only')
    ]);
    
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    console.warn('Firebase Analytics failed to initialize:', error);
    return null;
  }
}

// Crisis-critical: Immediate auth state check without loading full SDK
export function getAuthStateSync() {
  return authInstance?.currentUser || null;
}

// Performance-optimized auth state listener
export async function onAuthStateChangedOptimized(callback: (user: any) => void) {
  const auth = await getFirebaseAuth();
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, callback);
}