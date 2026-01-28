import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let adminApp;
if (getApps().length === 0) {
  // For development, we'll use the default credentials
  // In production, you'd use a service account key
  adminApp = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    // Note: In production, you should use a service account key file
    // credential: cert({
    //   projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    //   clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    //   privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    // }),
  });
} else {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);