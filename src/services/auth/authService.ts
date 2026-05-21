import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  OAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  linkWithPopup,
  linkWithRedirect,
  linkWithCredential,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  EmailAuthProvider,
  type AuthError,
  type User,
  type UserCredential,
  deleteUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, writeBatch, getDocs, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import {
  getFirebaseAuth,
  getFirebaseAuthOrNull,
  getFirestoreDb,
  getFirestoreDbOrNull,
  getFirebaseFunctions,
} from '@/services/firebase/firebaseService';
import { resetRevenueCatIdentity } from '@/services/subscriptions/revenueCatService';
import { isNativePlatform } from '@/services/platform/platformService';
import { recordOperationalException } from '@/services/monitoring/telemetry';
import type { UserProfile, AppTier } from '@/types/user';
import type { AuthFlowResult, AuthProfileSeed, SupportedAuthProvider } from '@/types/auth';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { getStorageItemWithFallback, removeStorageItemNormalized, setStorageItemNormalized } from '@/utils/storage';

const OFFLINE_UID = 'local_offline_user';
let cachedUid: string | null = null;
const LOCAL_STATE_KEYS_TO_CLEAR = [
  STORAGE_KEYS.USER_ID,
  STORAGE_KEYS.AUTH_STATE,
  STORAGE_KEYS.USER_TIER,
  STORAGE_KEYS.SUBSCRIPTION_CACHE,
  STORAGE_KEYS.ONBOARDING_STATE,
  STORAGE_KEYS.ONBOARDING_STEP,
  STORAGE_KEYS.ONBOARDING_WHY,
  STORAGE_KEYS.MINI_ENTRY_DRAFT,
  STORAGE_KEYS.NOTIFICATION_PREF,
  STORAGE_KEYS.NOTIFICATION_PREFERENCE,
  STORAGE_KEYS.NOTIFICATION_CADENCE,
  STORAGE_KEYS.LAST_NOTIFICATION_TAP,
  STORAGE_KEYS.PENDING_NOTIFICATION_NAV,
  STORAGE_KEYS.FIRST_ENTRY_COMPLETED,
  STORAGE_KEYS.NOTIFICATION_PERMISSIONS_REQUESTED,
  STORAGE_KEYS.ACTIVE_CONTAINER_ID,
  STORAGE_KEYS.CONTAINER_DAY,
  STORAGE_KEYS.LAST_SESSION_DATE,
  STORAGE_KEYS.LAST_SEED,
  STORAGE_KEYS.ONBOARDING_DATA,
  STORAGE_KEYS.PENDING_AUTH_PROVIDER,
  STORAGE_KEYS.PENDING_AUTH_UPGRADE,
  STORAGE_KEYS.PENDING_AUTH_PROFILE,
] as const;

type PendingAuthState = {
  provider: SupportedAuthProvider;
  anonymousUid?: string;
  profileSeed?: AuthProfileSeed;
};

function cacheUID(uid: string): void {
  cachedUid = uid;
}

export function getCachedUID(): string | null {
  return cachedUid;
}

export const getCurrentAuthUser = {
  get authAvailable(): boolean {
    return Boolean(getFirebaseAuthOrNull());
  },
};

export function clearLocalAuthState(): void {
  cachedUid = null;
  LOCAL_STATE_KEYS_TO_CLEAR.forEach((key) => removeStorageItemNormalized(key));
}

function sanitizeDisplayName(value?: string): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, 48);
}

function normalizeProfileSeed(seed?: AuthProfileSeed): AuthProfileSeed {
  return {
    displayName: sanitizeDisplayName(seed?.displayName),
    notificationPreference: seed?.notificationPreference === 'seeds_only' ? 'seeds_only' : 'none',
  };
}

function getReadableAuthError(error: unknown, fallback = 'That could not be completed right now.'): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const code = error.message;

  if (code.includes('auth/invalid-email')) {
    return 'Enter a valid email address.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists. Sign in instead.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Use a password with at least 8 characters.';
  }
  if (code.includes('auth/user-not-found') || code.includes('auth/wrong-password') || code.includes('auth/invalid-credential')) {
    return 'Email or password is incorrect.';
  }
  if (code.includes('auth/missing-email')) {
    return 'Enter your email address first.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Too many attempts happened too quickly. Pause, then try again.';
  }
  if (code.includes('auth/popup-closed-by-user')) {
    return 'Apple sign-in was closed before it finished.';
  }
  if (code.includes('auth/account-exists-with-different-credential')) {
    return 'This sign-in belongs to a different account. Use the account you already created.';
  }
  if (code.includes('auth/credential-already-in-use')) {
    return 'This sign-in is already connected to an account. Continue into that account instead.';
  }

  return fallback;
}

function persistPendingAuthState(state: PendingAuthState): void {
  setStorageItemNormalized(STORAGE_KEYS.PENDING_AUTH_PROVIDER, state.provider);
  setStorageItemNormalized(STORAGE_KEYS.PENDING_AUTH_UPGRADE, state.anonymousUid ?? '');
  setStorageItemNormalized(STORAGE_KEYS.PENDING_AUTH_PROFILE, JSON.stringify(normalizeProfileSeed(state.profileSeed)));
}

function readPendingAuthState(): PendingAuthState | null {
  const provider = getStorageItemWithFallback(STORAGE_KEYS.PENDING_AUTH_PROVIDER);
  if (!provider || (provider !== 'apple' && provider !== 'email' && provider !== 'anonymous')) {
    return null;
  }

  const anonymousUid = getStorageItemWithFallback(STORAGE_KEYS.PENDING_AUTH_UPGRADE) || undefined;

  let profileSeed: AuthProfileSeed | undefined;
  try {
    const raw = getStorageItemWithFallback(STORAGE_KEYS.PENDING_AUTH_PROFILE);
    if (raw) {
      profileSeed = normalizeProfileSeed(JSON.parse(raw));
    }
  } catch {
    profileSeed = undefined;
  }

  return {
    provider,
    anonymousUid,
    profileSeed,
  };
}

function clearPendingAuthState(): void {
  removeStorageItemNormalized(STORAGE_KEYS.PENDING_AUTH_PROVIDER);
  removeStorageItemNormalized(STORAGE_KEYS.PENDING_AUTH_UPGRADE);
  removeStorageItemNormalized(STORAGE_KEYS.PENDING_AUTH_PROFILE);
}

async function finalizeAuthResult(
  user: User,
  provider: SupportedAuthProvider,
  options: {
    anonymousUid?: string;
    profileSeed?: AuthProfileSeed;
  } = {}
): Promise<{ user: User; profile: UserProfile }> {
  const profileSeed = normalizeProfileSeed(options.profileSeed);

  if (options.anonymousUid && options.anonymousUid !== user.uid) {
    await migrateAnonymousData(options.anonymousUid, user.uid);
  }

  cacheUID(user.uid);
  const profile = await createUserProfile(user, provider, {
    displayName: profileSeed.displayName,
    notificationPreference: profileSeed.notificationPreference ?? 'none',
    wasAnonymous: Boolean(options.anonymousUid),
    anonymousUid: options.anonymousUid,
  });

  clearPendingAuthState();

  return { user, profile };
}

function createAppleProvider(): OAuthProvider {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  return provider;
}

export async function signInAnon(): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await signInAnonymously(auth);
  cacheUID(result.user.uid);
  return result.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  profileSeed?: AuthProfileSeed
): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;
  const wasAnonymous = currentUser?.isAnonymous ?? false;
  const anonymousUid = wasAnonymous ? currentUser?.uid : undefined;
  const normalizedProfileSeed = normalizeProfileSeed(profileSeed);

  if (wasAnonymous && currentUser) {
    const credential = EmailAuthProvider.credential(email, password);
    try {
      const result = await linkWithCredential(currentUser, credential);
      return finalizeAuthResult(result.user, 'email', {
        anonymousUid,
        profileSeed: normalizedProfileSeed,
      });
    } catch (error) {
      if (error instanceof Error && (
        error.message.includes('auth/email-already-in-use') ||
        error.message.includes('auth/credential-already-in-use'))
      ) {
        throw new Error('auth/email-already-in-use');
      }

      throw error;
    }
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  return finalizeAuthResult(result.user, 'email', {
    profileSeed: normalizedProfileSeed,
  });
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User; profile: UserProfile }> {
  const auth = getFirebaseAuth();
  const anonymousUid = auth.currentUser?.isAnonymous ? auth.currentUser.uid : undefined;
  const result = await signInWithEmailAndPassword(auth, email, password);
  return finalizeAuthResult(result.user, 'email', {
    anonymousUid,
  });
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function signInWithApple(
  profileSeed?: AuthProfileSeed
): Promise<AuthFlowResult> {
  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;
  const anonymousUid = currentUser?.isAnonymous ? currentUser.uid : undefined;
  const provider = createAppleProvider();
  const normalizedProfileSeed = normalizeProfileSeed(profileSeed);

  persistPendingAuthState({
    provider: 'apple',
    anonymousUid,
    profileSeed: normalizedProfileSeed,
  });

  if (isNativePlatform()) {
    try {
      if (currentUser?.isAnonymous) {
        await linkWithRedirect(currentUser, provider);
      } else {
        await signInWithRedirect(auth, provider);
      }
      return 'redirect';
    } catch (error) {
      recordOperationalException('sync_issue', error, { state: 'apple_redirect_start_failed', issue: 'apple_redirect_start_failed' });
      clearPendingAuthState();
      throw new Error(getReadableAuthError(error, 'Apple sign-in could not be started right now.'));
    }
  }

  try {
    if (currentUser?.isAnonymous) {
      const result = await linkWithPopup(currentUser, provider);
      await finalizeAuthResult(result.user, 'apple', {
        anonymousUid,
        profileSeed: normalizedProfileSeed,
      });
      return 'complete';
    }

    const result = await signInWithPopup(auth, provider);
    await finalizeAuthResult(result.user, 'apple', {
      profileSeed: normalizedProfileSeed,
    });
    return 'complete';
  } catch (error) {
    const appleCredential = error instanceof Error
      ? OAuthProvider.credentialFromError(error as AuthError)
      : null;
    if (anonymousUid && appleCredential) {
      const result = await signInWithCredential(auth, appleCredential);
      await finalizeAuthResult(result.user, 'apple', {
        anonymousUid,
        profileSeed: normalizedProfileSeed,
      });
      return 'complete';
    }

    clearPendingAuthState();
    throw new Error(getReadableAuthError(error, 'Apple sign-in could not be completed right now.'));
  }
}

export async function resolvePendingAuthRedirect(): Promise<{ user: User; profile: UserProfile } | null> {
  const auth = getFirebaseAuthOrNull();
  const pendingState = readPendingAuthState();
  if (!auth || !pendingState || pendingState.provider !== 'apple') {
    return null;
  }

  try {
    const result = await getRedirectResult(auth);
    if (!result?.user) {
      return null;
    }

    return await finalizeAuthResult(result.user, 'apple', {
      anonymousUid: pendingState.anonymousUid,
      profileSeed: pendingState.profileSeed,
    });
  } catch (error) {
    const appleCredential = error instanceof Error
      ? OAuthProvider.credentialFromError(error as AuthError)
      : null;
    if (appleCredential) {
      const result = await signInWithCredential(auth, appleCredential);
      return finalizeAuthResult(result.user, 'apple', {
        anonymousUid: pendingState.anonymousUid,
        profileSeed: pendingState.profileSeed,
      });
    }

    clearPendingAuthState();
    throw new Error(getReadableAuthError(error, 'Apple sign-in could not be completed right now.'));
  }
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuthOrNull();
  if (!auth) {
    clearLocalAuthState();
    return;
  }

  const user = auth.currentUser;
  const db = getFirestoreDbOrNull();
  if (user && !user.isAnonymous && db) {
    const profileRef = doc(db, 'users', user.uid, 'profile', 'main');
    await setDoc(profileRef, { lastSeenAt: serverTimestamp() }, { merge: true }).catch(() => {});
  }

  await firebaseSignOut(auth);
  await resetRevenueCatIdentity().catch(() => {});
  clearLocalAuthState();
}

export async function deleteAccount(userId: string): Promise<void> {
  const auth = getFirebaseAuthOrNull();
  const user = auth?.currentUser;
  if (!auth || !user) throw new Error('No authenticated user');

  await user.getIdToken(true);

  const deleteAccountNow = httpsCallable(getFirebaseFunctions(), 'deleteAccountNow');
  await deleteAccountNow({ userId });

  clearLocalAuthState();
  await resetRevenueCatIdentity().catch(() => {});
  try {
    await firebaseSignOut(auth);
  } catch {
    // no-op
  }
  try {
    await deleteUser(user);
  } catch {
    // Account may already be deleted on the server.
  }
}

export function onAuthChanged(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuthOrNull();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

let authPromise: Promise<User> | null = null;

export async function ensureAuth(timeoutMs = 12000): Promise<User> {
  if (authPromise) {
    return authPromise;
  }

  authPromise = new Promise((resolve) => {
    try {
      const auth = getFirebaseAuthOrNull();
      if (!auth) {
        cacheUID(OFFLINE_UID);
        resolve({ uid: OFFLINE_UID } as User);
        return;
      }

      if (auth.currentUser) {
        cacheUID(auth.currentUser.uid);
        resolve(auth.currentUser);
        return;
      }

      let resolved = false;
      const timer = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        unsubscribe();
        cacheUID(OFFLINE_UID);
        resolve({ uid: OFFLINE_UID } as User);
      }, timeoutMs);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);

        if (user) {
          cacheUID(user.uid);
          resolve(user);
          return;
        }

        signInAnon()
          .then(resolve)
          .catch(() => {
            cacheUID(OFFLINE_UID);
            resolve({ uid: OFFLINE_UID } as User);
          });
      });
    } catch {
      cacheUID(OFFLINE_UID);
      resolve({ uid: OFFLINE_UID } as User);
    }
  });

  try {
    return await authPromise;
  } finally {
    authPromise = null;
  }
}

export async function loadUserProfile(user: User): Promise<UserProfile | null> {
  const db = getFirestoreDbOrNull();
  if (!db) return null;

  const profileRef = doc(db, 'users', user.uid, 'profile', 'main');
  const snap = await getDoc(profileRef);
  return snap.exists()
    ? ({ ...snap.data(), userId: user.uid } as UserProfile)
    : null;
}

export async function updateUserProfileTier(userId: string, tier: AppTier): Promise<void> {
  const db = getFirestoreDbOrNull();
  if (!db) return;

  const profileRef = doc(db, 'users', userId, 'profile', 'main');
  await setDoc(profileRef, { tier }, { merge: true });
}

export async function signInCompat(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function signUpCompat(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

async function createUserProfile(
  user: User,
  provider: SupportedAuthProvider,
  overrides: Partial<UserProfile> = {}
): Promise<UserProfile> {
  const db = getFirestoreDb();
  const profileRef = doc(db, 'users', user.uid, 'profile', 'main');
  const existing = await getDoc(profileRef);

  if (existing.exists()) {
    const mergedProfile = {
      ...existing.data(),
      userId: user.uid,
      email: user.email ?? existing.data().email ?? undefined,
      displayName: overrides.displayName ?? user.displayName ?? existing.data().displayName,
      authProvider: provider,
      notificationPreference: overrides.notificationPreference ?? existing.data().notificationPreference ?? 'none',
      wasAnonymous: overrides.wasAnonymous ?? existing.data().wasAnonymous ?? false,
      anonymousUid: overrides.anonymousUid ?? existing.data().anonymousUid,
    } as UserProfile;

    await setDoc(profileRef, {
      email: mergedProfile.email ?? null,
      displayName: mergedProfile.displayName ?? null,
      authProvider: mergedProfile.authProvider,
      notificationPreference: mergedProfile.notificationPreference,
      wasAnonymous: mergedProfile.wasAnonymous,
      anonymousUid: mergedProfile.anonymousUid ?? null,
      lastSeenAt: serverTimestamp(),
    }, { merge: true });
    return mergedProfile;
  }

  const profile: UserProfile = {
    userId: user.uid,
    email: user.email ?? undefined,
    displayName: user.displayName ?? overrides.displayName,
    authProvider: provider,
    tier: 'sanctuary',
    notificationPreference: 'none',
    wasAnonymous: overrides.wasAnonymous ?? false,
    anonymousUid: overrides.anonymousUid,
    createdAt: new Date(),
    lastSeenAt: new Date(),
    ...overrides,
  };

  await setDoc(profileRef, {
    ...profile,
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  });

  return profile;
}

async function getOrCreateProfile(user: User): Promise<UserProfile> {
  const db = getFirestoreDb();
  const profileRef = doc(db, 'users', user.uid, 'profile', 'main');
  const snap = await getDoc(profileRef);

  if (snap.exists()) {
    await setDoc(profileRef, { lastSeenAt: serverTimestamp() }, { merge: true });
    return { ...snap.data(), userId: user.uid } as UserProfile;
  }

  return createUserProfile(user, user.isAnonymous ? 'anonymous' : 'email');
}

async function migrateAnonymousData(
  anonymousUid: string,
  authenticatedUid: string
): Promise<void> {
  if (anonymousUid === authenticatedUid) return;

  const db = getFirestoreDb();
  const batch = writeBatch(db);
  const collections = ['sessions', 'containers', 'khepera'];

  for (const collName of collections) {
    const sourceRef = collection(db, 'users', anonymousUid, collName);
    const destRef = collection(db, 'users', authenticatedUid, collName);

    try {
      const snap = await getDocs(sourceRef);
      snap.docs.forEach(docSnap => {
        const destDoc = doc(destRef, docSnap.id);
        batch.set(destDoc, docSnap.data(), { merge: true });
      });
    } catch {
      // Continue with other collections — partial migration is better than none
    }
  }

  await batch.commit();
}
