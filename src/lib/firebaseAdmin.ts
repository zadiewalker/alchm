// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getServerEnv } from './env';

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
    const env = getServerEnv();
    const serviceAccount = JSON.parse(env.firebaseServiceAccountKey);
    
    app = admin.apps.length
      ? admin.app()
      : admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
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