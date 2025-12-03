// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getServerConfig } from './config';

/**
 * Ensure a single Admin app instance for SSR/API routes.
 * Exports helpers expected by the rest of the codebase:
 *  - ensureAdmin()
 *  - initAdmin() (alias of ensureAdmin for older imports)
 *  - getDb()
 *  - getUidFromSessionCookie()
 */
let app: admin.app.App | undefined;

/**
 * Initializes or returns the Firebase Admin app instance with a service account.
 * @returns {admin.app.App} The initialized Admin app instance.
 */
export function ensureAdmin(): admin.app.App {
  if (!app) {
    try {
      // Get secure configuration with validation
      const serverConfig = getServerConfig();
      
      // Check if we're in build time - if so, skip Firebase Admin initialization
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        throw new Error('Firebase Admin not available during build');
      }
      
      // Check if required credentials are available
      if (!serverConfig.firebase.projectId || !serverConfig.firebase.clientEmail || !serverConfig.firebase.privateKey) {
        throw new Error('Missing Firebase Admin credentials');
      }
      
      // Construct service account from secure config
      const serviceAccount: admin.ServiceAccount = {
        projectId: serverConfig.firebase.projectId,
        clientEmail: serverConfig.firebase.clientEmail,
        privateKey: serverConfig.firebase.privateKey.replace(/\\n/g, '\n'),
      };
      
      app = admin.apps.length
        ? admin.app()
        : admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      throw new Error('Failed to initialize Firebase Admin SDK. Please check your service account configuration.');
    }
  }
  return app;
}

// Back-compat alias (some files import initAdmin)
export const initAdmin = ensureAdmin;

/**
 * Returns the Firebase Auth instance
 * @returns {admin.auth.Auth} The Auth instance
 */
export function getAuthInstance(): admin.auth.Auth {
  ensureAdmin();
  return getAuth();
}

// Export Firestore instance for compatibility
export const adminFirestore = {
  collection: (path: string) => {
    return getDb().collection(path);
  },
  doc: (path: string) => {
    return getDb().doc(path);
  },
  batch: () => {
    return getDb().batch();
  },
  runTransaction: (updateFunction: any) => {
    return getDb().runTransaction(updateFunction);
  }
};

// Export auth instance for compatibility
export const adminAuth = {
  deleteUser: async (uid: string) => {
    ensureAdmin();
    return getAuth().deleteUser(uid);
  },
  getUserByEmail: async (email: string) => {
    ensureAdmin();
    return getAuth().getUserByEmail(email);
  },
  getUser: async (uid: string) => {
    ensureAdmin();
    return getAuth().getUser(uid);
  },
  verifyIdToken: async (idToken: string) => {
    ensureAdmin();
    return getAuth().verifyIdToken(idToken);
  },
  createSessionCookie: async (idToken: string, options: { expiresIn: number }) => {
    ensureAdmin();
    return getAuth().createSessionCookie(idToken, options);
  },
  verifySessionCookie: async (sessionCookie: string, checkRevoked?: boolean) => {
    ensureAdmin();
    return getAuth().verifySessionCookie(sessionCookie, checkRevoked);
  }
};

// Export auth object that lazily initializes
export const auth = {
  verifyIdToken: async (idToken: string) => {
    ensureAdmin();
    return getAuth().verifyIdToken(idToken);
  },
  createSessionCookie: async (idToken: string, options: { expiresIn: number }) => {
    ensureAdmin();
    return getAuth().createSessionCookie(idToken, options);
  },
  verifySessionCookie: async (sessionCookie: string, checkRevoked?: boolean) => {
    ensureAdmin();
    return getAuth().verifySessionCookie(sessionCookie, checkRevoked);
  },
  revokeRefreshTokens: async (uid: string) => {
    ensureAdmin();
    return getAuth().revokeRefreshTokens(uid);
  }
};

/**
 * Returns the Firestore instance, initialized with ensureAdmin().
 * @returns {admin.firestore.Firestore} The Firestore instance.
 */
export function getDb(): admin.firestore.Firestore {
  ensureAdmin();
  return getFirestore();
}

/**
 * Verifies a Firebase session cookie and returns the UID (or null).
 * Pass the raw Cookie header (e.g., req.headers.get('cookie')) or use request.cookies.get() value.
 * @param cookieHeader - The raw Cookie header string or cookie value.
 * @returns {Promise<string | null>} The UID if valid, null otherwise.
 */
export async function getUidFromSessionCookie(
  cookieHeader?: string | null,
): Promise<string | null> {
  let session: string | null = null;
  if (cookieHeader) {
    if (typeof cookieHeader === 'string') {
      // Parse raw Cookie header if provided
      const parts = cookieHeader.split(/; */);
      for (const p of parts) {
        const [k, ...rest] = p.split('=');
        if (k?.trim() === '__session') {
          session = decodeURIComponent(rest.join('=') ?? '');
          break;
        }
      }
    } else {
      // Assume cookieHeader is the value from request.cookies.get('__session')
      session = cookieHeader;
    }
  }

  if (!session) return null;
  try {
    ensureAdmin();
    const decoded = await getAuth().verifySessionCookie(session, true);
    return decoded.uid ?? null;
  } catch (error) {
    console.error('getUidFromSessionCookie error:', error);
    return null;
  }
}

// Additional exports for compatibility
export const initializeFirebaseAdmin = ensureAdmin;
export const adminDb = getDb;