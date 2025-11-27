'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './firebase';

interface User {
  uid: string;
  email: string | null;
  preferences?: {
    onboardingCompleted?: boolean;
    kheperaArchetype?: string;
    theme?: string;
    traumaInformed?: boolean;
    language?: string;
  };
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        console.log('🔐 useAuth: Initializing Firebase Auth...');
        const auth = await getFirebaseAuth();
        const db = await getFirebaseDb();
        setAuthInitialized(true);

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            try {
              console.log('🔐 useAuth: User authenticated:', firebaseUser.uid);
              // Get user profile from Firestore
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              const userData = userDoc.exists() ? userDoc.data() : {};

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userData,
              });
            } catch (error) {
              console.error('Error fetching user profile:', error);
              // Still set user with basic info if Firestore fails
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
              });
            }
          } else {
            console.log('🔐 useAuth: No authenticated user');
            setUser(null);
          }
          
          setLoading(false);
        });
      } catch (error) {
        console.error('🚨 useAuth: Firebase initialization failed:', error);
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { user, loading, authInitialized };
}