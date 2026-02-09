'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setUser(null);
        setLoading(false);
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    error,
  };
}