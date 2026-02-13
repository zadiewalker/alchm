import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: any;
let auth: any;
let db: any;
let functions: any;

if (typeof window !== 'undefined') {
  try {
    console.log('🔥 Initializing Firebase...');
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);

    auth.settings = {
      appVerificationDisabledForTesting: false,
    };

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    app = null;
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback: any) => {
        callback(null);
        return () => {};
      }
    };
    db = null;
    functions = null;
  }
} else {
  app = null;
  auth = null;
  db = null;
  functions = null;
}

export { auth, db, functions };
export default app;
