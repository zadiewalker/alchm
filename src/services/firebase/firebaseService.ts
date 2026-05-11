import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  onSnapshot,
  type DocumentReference,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { isNativePlatform } from '@/services/platform/platformService';

const publicFirebaseEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
} as const;

function validateFirebaseConfig(): void {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ] as const;

  for (const varName of requiredVars) {
    if (!publicFirebaseEnv[varName]) {
      throw new Error(`Missing required Firebase environment variable: ${varName}`);
    }
  }
}

const firebaseConfig = {
  apiKey: publicFirebaseEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: publicFirebaseEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: publicFirebaseEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: publicFirebaseEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: publicFirebaseEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: publicFirebaseEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null | undefined;
let authInstance: Auth | null | undefined;
let firestoreInstance: Firestore | null | undefined;
let functionsInstance: Functions | null | undefined;
let authPersistenceInitialized = false;

function initializeFirebaseApp(): FirebaseApp | null {
  if (app !== undefined) {
    return app;
  }

  try {
    if (typeof window !== 'undefined') {
      validateFirebaseConfig();
    }

    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    return app;
  } catch (error) {
    console.warn('[Firebase] Initialization failed:', error);
    app = null;
    return app;
  }
}

async function initializeAuthPersistence(): Promise<void> {
  const auth = getFirebaseAuthOrNull();
  if (!auth) return;

  try {
    if (isNativePlatform()) {
      console.log('[Firebase] Skipping browserLocalPersistence on native platform');
      return;
    }

    await setPersistence(auth, browserLocalPersistence);
    console.log('[Firebase] Auth persistence enabled');
  } catch (err) {
    console.warn(
      '[Firebase] Auth persistence failed, continuing without persistence:',
      err instanceof Error ? err.message : err
    );
  }
}

export function getFirebaseAppOrNull(): FirebaseApp | null {
  return initializeFirebaseApp();
}

export function getFirebaseApp(): FirebaseApp {
  const firebaseApp = getFirebaseAppOrNull();
  if (!firebaseApp) {
    throw new Error('Firebase app is unavailable.');
  }
  return firebaseApp;
}

export function getFirebaseAuthOrNull(): Auth | null {
  if (authInstance !== undefined) {
    return authInstance;
  }

  const firebaseApp = getFirebaseAppOrNull();
  if (!firebaseApp) {
    authInstance = null;
    return authInstance;
  }

  authInstance = getAuth(firebaseApp);

  if (typeof window !== 'undefined' && !authPersistenceInitialized) {
    authPersistenceInitialized = true;
    setTimeout(initializeAuthPersistence, 0);
  }

  return authInstance;
}

export function getFirebaseAuth(): Auth {
  const auth = getFirebaseAuthOrNull();
  if (!auth) {
    throw new Error('Firebase auth is unavailable.');
  }
  return auth;
}

export function getFirestoreDbOrNull(): Firestore | null {
  if (firestoreInstance !== undefined) {
    return firestoreInstance;
  }

  const firebaseApp = getFirebaseAppOrNull();
  if (!firebaseApp) {
    firestoreInstance = null;
    return firestoreInstance;
  }

  try {
    firestoreInstance = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (err) {
    console.warn('[Firebase] Falling back to default Firestore initialization:', err);
    try {
      firestoreInstance = getFirestore(firebaseApp);
    } catch (fallbackErr) {
      console.warn('[Firebase] Firestore initialization failed completely:', fallbackErr);
      firestoreInstance = null;
    }
  }

  return firestoreInstance;
}

export function getFirestoreDb(): Firestore {
  const db = getFirestoreDbOrNull();
  if (!db) {
    throw new Error('Firestore is unavailable.');
  }
  return db;
}

export function getFirebaseFunctionsOrNull(): Functions | null {
  if (functionsInstance !== undefined) {
    return functionsInstance;
  }

  const firebaseApp = getFirebaseAppOrNull();
  if (!firebaseApp) {
    functionsInstance = null;
    return functionsInstance;
  }

  functionsInstance = getFunctions(firebaseApp);
  return functionsInstance;
}

export function getFirebaseFunctions(): Functions {
  const functions = getFirebaseFunctionsOrNull();
  if (!functions) {
    throw new Error('Firebase functions are unavailable.');
  }
  return functions;
}

export function subscribeToDocument<T>(
  ref: DocumentReference | null,
  onData: (data: T | null) => void,
  onError: (error: Error) => void,
  transform?: (data: unknown) => T
): Unsubscribe {
  if (!ref) {
    onData(null);
    return () => {};
  }

  return onSnapshot(
    ref,
    (snap) => {
      const raw = snap.exists() ? snap.data() : null;
      onData(raw && transform ? transform(raw) : (raw as T | null));
    },
    (error) => {
      console.warn('[Firestore] Snapshot error:', error.message);
      onError(error);
    }
  );
}

export type { DocumentReference, Firestore, Auth, Functions, FirebaseApp };
