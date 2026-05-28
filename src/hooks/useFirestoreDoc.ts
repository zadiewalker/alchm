// src/hooks/useFirestoreDoc.ts

import { useEffect, useState } from 'react';
import { subscribeToDocument } from '@/services/firebase/firebaseService';
import type { DocumentReference } from '@/services/firebase/firebaseService';

export function useFirestoreDoc<T>(
  ref: DocumentReference | null,
  transform?: (data: unknown) => T
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    let active = true; // The guard

    const unsubscribe = subscribeToDocument<T>(
      ref,
      (next) => {
        if (!active) return;
        setData(next);
        setLoading(false);
      },
      (err) => {
        if (!active) return; // Error after unmount — ignore
        setError(err);
        setLoading(false);
      },
      transform
    );

    return () => {
      active = false;    // Guard: all future listener callbacks become no-ops
      unsubscribe();     // Unsubscribe from Firestore
    };
  }, [ref?.path]); // Re-subscribe only if the document path changes

  return { data, loading, error };
}
