'use client';

// src/lib/useJournals.ts
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  mood?: string | null;
  wordCount: number;
  userId: string;
};

export function useJournals() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const setupJournalSubscription = async () => {
      try {
        // Get Firebase database instance
        const db = await getFirebaseDb();
        
        // Real-time Firestore subscription
        const journalsQuery = query(
          collection(db, 'journals'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(journalsQuery, (snapshot) => {
          const journalEntries: JournalEntry[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            journalEntries.push({
              id: doc.id,
              title: data.title || 'Untitled Entry',
              content: data.content || '',
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
              mood: data.mood,
              wordCount: data.wordCount || 0,
              userId: data.userId
            });
          });

          setEntries(journalEntries);
          setLoading(false);
          setError(null);
        }, (error) => {
          console.error('Error fetching journals:', error);
          setError('Unable to load journal entries');
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up journal subscription:', error);
        setError('Failed to connect to journal database');
        setLoading(false);
        return null;
      }
    };

    let unsubscribe: (() => void) | null = null;
    
    setupJournalSubscription().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  return { entries, loading, error };
}
