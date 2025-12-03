'use client';

// For static export, we can't pre-generate user-specific entries
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';

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

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const entryId = params.id as string;
  
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loadingEntry, setLoadingEntry] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && entryId) {
      loadEntry();
    }
  }, [loading, user, entryId, router]);

  const loadEntry = async () => {
    if (!user || !entryId) {
      router.push('/entries');
      return;
    }

    try {
      const entryDoc = await getDoc(
        doc(db, 'users', user.uid, 'entries', entryId)
      );

      if (!entryDoc.exists()) {
        router.push('/entries');
        return;
      }

      const data = entryDoc.data();
      setEntry({
        id: entryDoc.id,
        title: data.title || 'Untitled',
        content: data.content || '',
        mood: data.mood,
        wordCount: data.wordCount,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date(data.createdAt || Date.now()),
      });
    } catch (err) {
      console.error('Error loading entry:', err);
      router.push('/entries');
    }
    setLoadingEntry(false);
  };

  const handleDelete = async () => {
    if (!user || !entryId) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'entries', entryId));
      router.push('/entries');
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry. Please try again.');
    }
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

  if (loading || loadingEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.offWhite }}>
        <div className="text-center">
          <div className="text-4xl mb-4">📖</div>
          <p className="text-lg" style={{ color: COLORS.charcoal }}>Loading entry...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.offWhite }}>
      {/* Header */}
      <header className="border-b bg-white px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/entries')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-500 hover:text-red-700 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </header>

      {/* Entry Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Date & Mood */}
        <div className="flex items-center gap-3 mb-6 text-gray-600">
          {entry.mood && (
            <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
          )}
          <time className="text-lg">
            {entry.createdAt.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-medium mb-8" style={{ color: COLORS.charcoal }}>
          {entry.title}
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {entry.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Word Count */}
        {entry.wordCount && (
          <div className="mt-8 text-sm text-gray-500">
            {entry.wordCount} words
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.charcoal }}>
              Delete this entry?
            </h3>
            <p className="text-gray-600 mb-6">
              This cannot be undone. Your words will be gone forever.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Keep It
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Support */}
      <div className="fixed bottom-6 right-6">
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