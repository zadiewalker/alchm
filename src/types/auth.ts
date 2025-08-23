// Authentication types and error codes for ALCHM

export enum AuthErrorCode {
  // Session-related errors
  NO_SESSION = 'NO_SESSION',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_REVOKED = 'SESSION_REVOKED',
  INVALID_CLAIMS = 'INVALID_CLAIMS',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_DISABLED = 'USER_DISABLED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Network and service errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  userMessage: string;
  canRefresh?: boolean;
  retryAfter?: number;
  details?: any;
}

export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  customClaims?: Record<string, any>;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: number;
  issuedAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  displayName?: string;
  acceptTerms: boolean;
}

export interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: AuthError | null;
  
  // Auth actions
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignupCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  
  // Password reset
  sendPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<void>;
  
  // Email verification
  sendEmailVerification: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  
  // Session management
  clearError: () => void;
  validateCurrentSession: () => Promise<boolean>;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: AuthError | null;
  initialized: boolean;
}

// Error message mappings for user-friendly display
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.NO_SESSION]: 'Please log in to continue',
  [AuthErrorCode.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
  [AuthErrorCode.SESSION_REVOKED]: 'Your session is no longer valid. Please log in again.',
  [AuthErrorCode.INVALID_CLAIMS]: 'Authentication error. Please log in again.',
  [AuthErrorCode.VERIFICATION_FAILED]: 'Unable to verify your session. Please try logging in again.',
  
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password. Please try again.',
  [AuthErrorCode.USER_NOT_FOUND]: 'No account found with this email address.',
  [AuthErrorCode.USER_DISABLED]: 'This account has been disabled. Please contact support.',
  [AuthErrorCode.TOO_MANY_REQUESTS]: 'Too many failed attempts. Please try again later.',
  
  [AuthErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
  [AuthErrorCode.SERVICE_UNAVAILABLE]: 'Authentication service is temporarily unavailable.',
  [AuthErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

// Firebase Auth error code mapping
export const FIREBASE_ERROR_MAP: Record<string, AuthErrorCode> = {
  'auth/user-not-found': AuthErrorCode.USER_NOT_FOUND,
  'auth/wrong-password': AuthErrorCode.INVALID_CREDENTIALS,
  'auth/invalid-email': AuthErrorCode.INVALID_CREDENTIALS,
  'auth/user-disabled': AuthErrorCode.USER_DISABLED,
  'auth/too-many-requests': AuthErrorCode.TOO_MANY_REQUESTS,
  'auth/network-request-failed': AuthErrorCode.NETWORK_ERROR,
  'auth/session-cookie-expired': AuthErrorCode.SESSION_EXPIRED,
  'auth/session-cookie-revoked': AuthErrorCode.SESSION_REVOKED,
  'auth/invalid-session-cookie-claims': AuthErrorCode.INVALID_CLAIMS
};