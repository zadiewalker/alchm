'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getFirebaseAuth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const COLORS = {
  sage: '#a4b792',
  sageDark: '#8fa07d',
  terracotta: '#cb997e',
  charcoal: '#2e2e2e',
  offWhite: '#f7f7f2',
};

export default function NewJournalEntryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  // Auto-focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Update word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(content.trim() === '' ? 0 : words);
  }, [content]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (content.length > 0 && user) {
      const timer = setTimeout(() => {
        localStorage.setItem('alchm-draft', JSON.stringify({
          content,
          title,
          mood,
          savedAt: new Date().toISOString(),
        }));
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [content, title, mood, user]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('alchm-draft');
    if (draft) {
      try {
        const { content: draftContent, title: draftTitle, mood: draftMood } = JSON.parse(draft);
        if (draftContent) {
          setContent(draftContent);
          setTitle(draftTitle || '');
          setMood(draftMood || null);
        }
      } catch (e) {
        // Invalid draft, ignore
      }
    }
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  const handleSave = async () => {
    if (!user || content.trim().length === 0) return;

    setIsSaving(true);
    try {
      const entryData = {
        content: content.trim(),
        title: title.trim() || `Entry - ${new Date().toLocaleDateString()}`,
        mood,
        wordCount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      };

      await addDoc(
        collection(db, 'users', user.uid, 'entries'),
        entryData
      );

      // Clear draft
      localStorage.removeItem('alchm-draft');

      // Navigate to success or back to dashboard
      router.push('/dashboard?saved=true');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
    setIsSaving(false);
  };

  const handleDiscard = () => {
    if (content.length > 0) {
      if (confirm('Discard this entry? Your writing will be lost.')) {
        localStorage.removeItem('alchm-draft');
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  };

  const moods = [
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Low', value: 'low' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🤔', label: 'Reflective', value: 'reflective' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.offWhite }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🌿</div>
          <p className="text-lg" style={{ color: COLORS.charcoal }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.offWhite }}>
      {/* Header */}
      <header className="border-b bg-white px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={handleDiscard}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          
          <div className="text-sm text-gray-500">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </div>

          <button
            onClick={handleSave}
            disabled={content.trim().length === 0 || isSaving}
            className="py-2 px-4 rounded-lg font-medium text-white disabled:opacity-50 transition-all"
            style={{ backgroundColor: COLORS.sage }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mood Selector */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">How are you feeling?</div>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(mood === m.value ? null : m.value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap
                  transition-all
                  ${mood === m.value 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={{ 
                  backgroundColor: mood === m.value ? COLORS.sage : undefined 
                }}
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input (Optional) */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full px-0 py-3 text-lg font-medium text-gray-900 bg-transparent border-0 border-b border-gray-200 outline-none placeholder-gray-400 focus:border-gray-400"
        />

        {/* Main Writing Area */}
        <div className="mt-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Write freely—this is your safe space..."
            className="w-full h-96 resize-none outline-none text-gray-800 text-lg leading-relaxed placeholder-gray-400 bg-transparent"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Writing Prompts (if empty) */}
        {content.length === 0 && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-3">Need a prompt?</div>
            <div className="flex flex-wrap gap-2">
              {[
                "What am I grateful for today?",
                "What's weighing on my mind?",
                "How did today make me feel?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setContent(prompt + '\n\n')}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Crisis Support */}
      <div className="fixed bottom-6 right-6">
        <a 
          href="tel:988" 
          className="flex items-center justify-center w-14 h-14 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Crisis support - Call 988"
        >
          📞
        </a>
      </div>
    </div>
  );
}