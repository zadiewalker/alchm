'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { observeAuthState } from '@/lib/auth/domain-aware-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JournalEntry {
  id: string;
  content: string;
  title?: string | null;
  mood?: string | null;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  preview: string;
  tags: string[];
}

export default function JournalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loadingJournals, setLoadingJournals] = useState(false);

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      if (user) {
        setUser(user);
        loadJournals(user);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadJournals = async (user: User) => {
    setLoadingJournals(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/journal/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': user.uid,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJournals(data.journals || []);
      } else {
        console.error('Failed to load journals');
        setJournals([]);
      }
    } catch (error) {
      console.error('Error loading journals:', error);
      setJournals([]);
    } finally {
      setLoadingJournals(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleNewJournal = () => {
    router.push('/journal');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-gentle-pulse">📚</div>
          <p className="text-sanctuary-white text-lg font-light">Loading your journal collection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600">
      {/* Sacred Sanctuary Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-sanctuary/5 via-transparent to-sanctuary/10 pointer-events-none animate-breathing"></div>
      
      {/* Sacred Header Sanctuary */}
      <header className="relative z-10">
        <div className="sanctuary-glass border-b border-sanctuary/20 backdrop-blur-xl shadow-floating">
          <div className="max-w-6xl mx-auto px-phi-lg sm:px-phi-xl lg:px-phi-2xl">
            <div className="flex justify-between items-center py-phi-lg">
              <div className="flex items-center gap-phi-md">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-phi-xs sanctuary-glass border border-sanctuary/30 rounded-2xl px-phi-sm py-phi-xs text-sanctuary hover:text-sanctuary/80 transition-all duration-400 hover:shadow-soft hover:scale-105 active:scale-95"
                >
                  <svg className="w-phi-sm h-phi-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-phi-sm font-light tracking-wide">Return to sanctuary</span>
                </button>
                <h1 className="text-phi-2xl font-extralight text-sanctuary tracking-wide animate-gentle-breathe">
                  Sacred Journal Library
                </h1>
              </div>
              
              <button
                onClick={handleNewJournal}
                className="bg-sage-400 text-sanctuary border border-sage-500 rounded-2xl px-phi-lg py-phi-sm hover:bg-sage-500 hover:shadow-soft transition-all duration-400 hover:scale-105 active:scale-95 flex items-center gap-phi-xs"
              >
                <svg className="w-phi-sm h-phi-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-phi-sm font-light tracking-wide">Sacred Entry</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sacred Journal Library */}
      <main className="max-w-6xl mx-auto px-phi-lg sm:px-phi-xl lg:px-phi-2xl py-phi-2xl">
        
        {/* Sacred Entries Collection */}
        <div className="space-y-phi-xl">
          {loadingJournals ? (
            <div className="text-center py-phi-4xl">
              <div className="text-8xl mb-phi-lg animate-gentle-breathe">📖</div>
              <p className="text-sanctuary text-phi-lg font-light tracking-wide">Gathering your sacred reflections...</p>
            </div>
          ) : journals.length > 0 ? (
            journals.map((journal) => (
              <div
                key={journal.id}
                className="organic-container sanctuary-glass border border-sanctuary/30 shadow-floating hover:shadow-sacred cursor-pointer group transition-all duration-600 hover:scale-102 active:scale-98 backdrop-blur-xl p-phi-xl"
                onClick={() => {
                  // In a real app, this would navigate to the specific journal entry
                  console.log('Open journal', journal.id);
                }}
              >
                <div className="flex justify-between items-start mb-phi-lg">
                  <div className="flex items-center space-x-phi-md">
                    <span className="text-phi-2xl animate-gentle-breathe group-hover:animate-heart-sparkle transition-all duration-400">{journal.mood || '✍️'}</span>
                    <div>
                      <h3 className="text-sage-800 mb-phi-xs text-phi-md font-light tracking-wide">
                        {new Date(journal.createdAt).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      <div className="sanctuary-glass border border-sanctuary/30 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl inline-block">
                        <p className="text-sage-600 text-phi-xs font-light tracking-wide">
                          {journal.wordCount} sacred words • {Math.ceil(journal.wordCount / 200)} min reflection
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="sanctuary-glass border border-sanctuary/30 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl">
                    <span className="text-sage-600/80 text-phi-xs font-light">
                      {new Date(journal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sage-700 leading-relaxed mb-phi-lg text-phi-base font-light tracking-wide">
                    {journal.preview}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="sanctuary-glass border border-sanctuary/30 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl">
                      <span className="text-sage-600 text-phi-xs font-light tracking-wide">
                        Continue sacred reading
                      </span>
                    </div>
                    <div className="text-sage-500 group-hover:text-sage-700 transition-all duration-400 group-hover:scale-110">
                      <svg className="w-phi-md h-phi-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Entry decoration */}
                <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">📖</div>
              </div>
            ))
          ) : (
            <div className="organic-container sanctuary-glass border border-sanctuary/30 shadow-floating backdrop-blur-xl text-center py-phi-4xl">
              <div className="text-8xl mb-phi-2xl animate-gentle-breathe">✍️</div>
              <h2 className="text-sage-800 mb-phi-lg text-phi-2xl font-extralight tracking-wide">
                Your first sacred entry awaits
              </h2>
              <p className="text-sage-700 leading-relaxed mb-phi-2xl max-w-md mx-auto text-phi-base font-light tracking-wide">
                Every healing journey begins with a single sacred word. What wisdom wants to emerge from your heart today?
              </p>
              <button
                onClick={handleNewJournal}
                className="bg-sage-400 text-sanctuary border border-sage-500 rounded-2xl px-phi-2xl py-phi-lg hover:bg-sage-500 hover:shadow-soft transition-all duration-400 hover:scale-105 active:scale-95 flex items-center gap-phi-sm mx-auto"
              >
                <svg className="w-phi-md h-phi-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-phi-base font-light tracking-wide">Begin Sacred Journey</span>
              </button>
            </div>
          )}
        </div>

        {/* Insights Section */}
        {journals.length > 0 && (
          <Card variant="sage" className="mt-12">
            <CardHeader>
              <CardTitle level="h2" className="text-white mb-6">
                ✨ Your Journey Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">{journals.length}</div>
                  <div className="text-sage-100 text-sm font-medium">Sacred Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">
                    {journals.reduce((total, journal) => total + journal.wordCount, 0).toLocaleString()}
                  </div>
                  <div className="text-sage-100 text-sm font-medium">Words of Wisdom</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-white mb-2">
                    {journals.length > 0 ? Math.ceil(journals.length / 7) : 0}
                  </div>
                  <div className="text-sage-100 text-sm font-medium">Weeks of Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Crisis Support Notice */}
        <Card variant="gentle" className="mt-8 border-2 border-red-200/50">
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">🆘</div>
            <CardTitle level="h3" className="text-sanctuary-gray-800 mb-4">
              Crisis Support Available 24/7
            </CardTitle>
            <div className="mb-6">
              <Button
                onClick={() => window.open('tel:988', '_self')}
                variant="destructive"
                size="lg"
                className="gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call 988 Now
              </Button>
            </div>
            <p className="text-sanctuary-gray-500 text-sm leading-relaxed max-w-md mx-auto">
              ALCHM is a journaling platform, not medical treatment or therapy. Ages 17+.
              <br />
              COPPA, GDPR & CCPA compliant. Your data is encrypted and protected.
            </p>
          </CardContent>
        </Card>
      </main>
      
      {/* Crisis Support Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="destructive"
          size="touch"
          onClick={() => window.open('tel:988', '_self')}
          className="rounded-full w-16 h-16 p-0 shadow-sacred animate-crisis-attention"
          aria-label="Crisis support - Call 988"
        >
          <span className="text-2xl">🆘</span>
        </Button>
      </div>
    </div>
  );
}