// Secure environment variable validation and management
import { validateEnvVar } from './security';

// Server-side environment variables (never expose to client)
export const getServerEnv = () => {
  return {
    firebaseProjectId: validateEnvVar('FIREBASE_PROJECT_ID', process.env.FIREBASE_PROJECT_ID),
    firebaseClientEmail: validateEnvVar('FIREBASE_CLIENT_EMAIL', process.env.FIREBASE_CLIENT_EMAIL),
    firebaseServiceAccountKey: validateEnvVar('FIREBASE_SERVICE_ACCOUNT_KEY', process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
    firebaseAppId: validateEnvVar('FIREBASE_APP_ID', process.env.FIREBASE_APP_ID),
    openaiApiKey: validateEnvVar('OPENAI_API_KEY', process.env.OPENAI_API_KEY),
    geminiApiKey: process.env.GEMINI_API_KEY, // Optional
    stripeSecretKey: validateEnvVar('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
  };
};

// Client-side environment variables (safe to expose)
export const getClientEnv = () => {
  return {
    firebaseApiKey: validateEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    firebaseAuthDomain: validateEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    firebaseProjectId: validateEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    firebaseStorageBucket: validateEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    firebaseMessagingSenderId: validateEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    firebaseMeasurementId: validateEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
    openaiProjectId: validateEnvVar('NEXT_PUBLIC_OPENAI_PROJECT_ID', process.env.NEXT_PUBLIC_OPENAI_PROJECT_ID),
    stripePublishableKey: validateEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  };
};

// Validate all environment variables on startup
export const validateEnvironment = () => {
  try {
    getServerEnv();
    getClientEnv();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    process.exit(1);
  }
};