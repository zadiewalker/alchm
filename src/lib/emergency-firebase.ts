// EMERGENCY: Ultra-minimal Firebase client for crisis response <8KB
// Only the absolute essentials for authentication during emergency

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';

// Emergency config validation
function getEmergencyConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  if (!config.apiKey || !config.authDomain || !config.projectId) {
    throw new Error('Emergency Firebase config incomplete');
  }

  return config;
}

// Global instances for emergency use
let emergencyApp: FirebaseApp | null = null;
let emergencyAuth: Auth | null = null;

// CRISIS-CRITICAL: Emergency Firebase initialization
export async function getEmergencyFirebaseAuth(): Promise<Auth> {
  if (emergencyAuth) return emergencyAuth;
  
  try {
    const { initializeApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    
    const config = getEmergencyConfig();
    emergencyApp = initializeApp(config, 'emergency');
    emergencyAuth = getAuth(emergencyApp);
    
    return emergencyAuth;
  } catch (error) {
    throw new Error(`Emergency Firebase init failed: ${error}`);
  }
}

// Emergency session storage
export function createEmergencySession(uid: string, email: string) {
  const sessionData = {
    uid,
    email,
    type: 'emergency',
    createdAt: Date.now(),
    expiresAt: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
  };
  
  try {
    sessionStorage.setItem('alchm-emergency-session', JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.warn('Emergency session storage failed:', error);
    return false;
  }
}

export function getEmergencySession() {
  try {
    const session = sessionStorage.getItem('alchm-emergency-session');
    if (!session) return null;
    
    const data = JSON.parse(session);
    if (data.expiresAt < Date.now()) {
      sessionStorage.removeItem('alchm-emergency-session');
      return null;
    }
    
    return data;
  } catch (error) {
    return null;
  }
}

export function clearEmergencySession() {
  try {
    sessionStorage.removeItem('alchm-emergency-session');
  } catch (error) {
    console.warn('Emergency session clear failed:', error);
  }
}