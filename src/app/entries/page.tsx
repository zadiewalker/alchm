'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';

const COLORS = {
  sage: '#a4b792',
  terracotta: '#cb997e',
  charcoal: '#2e2e2e',
  offWhite: '#f7f7f2',
};

interface Entry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  wordCount?: number;
  createdAt: Date;
}

export default function PastEntriesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadEntries();
    }
  }, [loading, user, router]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      const entriesRef = collection(db, 'users', user.uid, 'entries');
      const q = query(entriesRef, orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      const loadedEntries: Entry[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Untitled',
          content: data.content || '',
          mood: data.mood,
          wordCount: data.wordCount,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate() 
            : new Date(data.createdAt || Date.now()),
        };
      });

      setEntries(loadedEntries);
    } catch (err) {
      console.error('Error loading entries:', err);
      setError('Failed to load entries');
    }
    setLoadingEntries(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getMoodEmoji = (mood?: string) => {
    const moods: Record<string, string> = {
      good: '😊',
      okay: '😐',
      low: '😔',
      anxious: '😰',
      frustrated: '😤',
      reflective: '🤔',
    };
    return mood ? moods[mood] || '' : '';
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  if (loading || loadingEntries) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.offWhite }}>
        <div className="text-center">
          <div className="text-4xl mb-4">📖</div>
          <p className="text-lg" style={{ color: COLORS.charcoal }}>Loading your entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.offWhite }}>
      {/* Header */}
      <header className="border-b bg-white px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
          </div>
          <h1 className="text-xl font-medium" style={{ color: COLORS.charcoal }}>Your Journey</h1>
          <div className="text-sm text-gray-500">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      </header>

      {/* Entries List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-medium mb-2" style={{ color: COLORS.charcoal }}>
              No entries yet
            </h2>
            <p className="text-gray-600 mb-6">
              Your journal entries will appear here
            </p>
            <button
              onClick={() => router.push('/journal/new')}
              className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: COLORS.sage }}
            >
              Write First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => router.push(`/entry/${entry.id}`)}
                className="w-full bg-white rounded-xl p-6 shadow-sm text-left hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {entry.mood && (
                      <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    )}
                    <div>
                      <h3 className="font-medium text-lg" style={{ color: COLORS.charcoal }}>
                        {entry.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(entry.createdAt)}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-gray-700 leading-relaxed">
                    {truncateContent(entry.content)}
                  </p>
                </div>
                {entry.wordCount && (
                  <div className="text-sm text-gray-500">
                    {entry.wordCount} words
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => router.push('/journal/new')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all hover:scale-110"
        style={{ backgroundColor: COLORS.sage }}
      >
        +
      </button>

      {/* Crisis Support */}
      <div className="fixed bottom-6 left-6">
        <a 
          href="tel:988" 
          className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Crisis support - Call 988"
        >
          📞
        </a>
      </div>
    </div>
  );
}