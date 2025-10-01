'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function JournalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const saveJournal = async () => {
    if (!user || !journalText.trim()) return;

    setSaving(true);
    try {
      // Here you would save to Firestore
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)'
      }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🌿</div>
          <p className="text-white text-lg">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
    }}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="text-white/80 hover:text-white mr-4 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7"/>
                  <path d="M19 12H5"/>
                </svg>
              </button>
              <h1 className="text-2xl font-light text-white">Journal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastSaved && (
                <span className="text-white/60 text-sm">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={saveJournal}
                disabled={saving || !journalText.trim()}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Date Header */}
        <div className="mb-6">
          <h2 className="text-xl text-white font-light">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>

        {/* Journal Writing Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="What's on your mind today? This is your safe space to explore your thoughts and feelings..."
            className="w-full h-96 bg-transparent text-white placeholder-white/60 border-none outline-none resize-none text-lg leading-relaxed"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Helpful Prompts */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-medium text-white mb-4">Reflection Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setJournalText(prev => prev + "\n\nWhat am I grateful for today?\n")}
              className="text-left p-3 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              💝 What am I grateful for today?
            </button>
            <button
              onClick={() => setJournalText(prev => prev + "\n\nHow am I feeling right now?\n")}
              className="text-left p-3 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              🧘 How am I feeling right now?
            </button>
            <button
              onClick={() => setJournalText(prev => prev + "\n\nWhat challenged me today, and how did I grow?\n")}
              className="text-left p-3 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              🌱 What challenged me today, and how did I grow?
            </button>
            <button
              onClick={() => setJournalText(prev => prev + "\n\nWhat do I need to feel supported right now?\n")}
              className="text-left p-3 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              🤗 What do I need to feel supported right now?
            </button>
          </div>
        </div>

        {/* Word Count */}
        <div className="mt-4 text-center">
          <span className="text-white/60 text-sm">
            {journalText.split(' ').filter(word => word.length > 0).length} words
          </span>
        </div>

        {/* Crisis Support Notice */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
          <p className="text-white font-medium text-sm mb-4">
            Crisis Support Available 24/7
          </p>
          <div className="mb-4">
            <a 
              href="tel:988" 
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 border border-white/20 hover:border-white/30 inline-block"
            >
              Call 988 Now
            </a>
          </div>
          <p className="text-white/60 text-xs leading-relaxed">
            ALCHM is a journaling platform, not medical treatment or therapy. Ages 17+.
            <br />
            COPPA, GDPR & CCPA compliant. Your data is encrypted and protected.
          </p>
        </div>
      </main>
    </div>
  );
}