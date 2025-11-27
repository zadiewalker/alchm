'use client';

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-sanctuary-white/10 backdrop-blur-sm border-b border-sanctuary-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBackToDashboard}
                variant="ghost"
                size="default"
                className="gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Dashboard
              </Button>
              <h1 className="text-3xl font-light text-sanctuary-white">Your Journal Collection</h1>
            </div>
            
            <Button
              onClick={handleNewJournal}
              variant="secondary"
              size="default"
              className="gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Entry
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Journal Entries */}
        <div className="space-y-6">
          {loadingJournals ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 animate-gentle-pulse">📖</div>
              <p className="text-sanctuary-white text-lg font-light">Gathering your reflections...</p>
            </div>
          ) : journals.length > 0 ? (
            journals.map((journal) => (
              <Card
                key={journal.id}
                variant="sanctuary"
                interactive
                className="cursor-pointer group transition-all duration-400 hover:scale-[1.01] bg-sanctuary-white/95 backdrop-blur-xl"
                onClick={() => {
                  // In a real app, this would navigate to the specific journal entry
                  console.log('Open journal', journal.id);
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl animate-gentle-breathe">{journal.mood || '✍️'}</span>
                      <div>
                        <CardTitle level="h3" className="text-sanctuary-gray-800 mb-1">
                          {new Date(journal.createdAt).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardTitle>
                        <p className="text-sanctuary-gray-500 text-sm font-medium">
                          {journal.wordCount} words • {Math.ceil(journal.wordCount / 200)} min read
                        </p>
                      </div>
                    </div>
                    <span className="text-sanctuary-gray-400 text-sm">
                      {new Date(journal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sanctuary-gray-700 leading-relaxed mb-4">
                    {journal.preview}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sage-600 text-sm font-medium">
                      Click to continue reading
                    </div>
                    <div className="text-sage-400 group-hover:text-sage-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card variant="gentle" className="text-center py-16">
              <CardContent>
                <div className="text-6xl mb-6 animate-gentle-breathe">✍️</div>
                <CardTitle level="h2" className="text-sanctuary-gray-800 mb-4">
                  Your first entry awaits
                </CardTitle>
                <p className="text-sanctuary-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
                  Every healing journey begins with a single word. Share what's in your heart today.
                </p>
                <Button
                  onClick={handleNewJournal}
                  variant="primary"
                  size="lg"
                  className="gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write Your First Entry
                </Button>
              </CardContent>
            </Card>
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
          className="rounded-full w-12 h-12 p-0 shadow-sacred animate-crisis-attention"
          aria-label="Crisis support - Call 988"
        >
          <span className="text-2xl">🆘</span>
        </Button>
      </div>
    </div>
  );
}