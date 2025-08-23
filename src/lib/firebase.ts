// src/lib/firebase.ts
// Client-side Firebase app + Firestore (usable in Node 20 too).
// Used by routes/components that import { db } from "@/lib/firebase".

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

export const app = getApps().length ? getApp() : initializeApp(config);
export const db = getFirestore(app);
