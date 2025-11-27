'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { CommunityHealingHub } from '@/components/community/CommunityHealingHub';

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userThemes, setUserThemes] = useState<string[]>([]);
  const [culturalContext, setCulturalContext] = useState<string[]>([]);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const initAuth = async () => {
      try {
        const auth = await getFirebaseAuth();
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUser(user);
            // In a real app, would load user's themes and cultural context from their profile/journals
            setUserThemes(['personal-growth', 'healing', 'emotional-wellness']);
            setCulturalContext(['western', 'diverse']);
          } else {
            router.push('/auth/login');
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
        router.push('/auth/login');
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen min-h-dvh flex items-center justify-center bg-gradient-to-br from-sage-primary via-sage-hover to-sage-active">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-gentle-breathe">🌍</div>
          <h1 className="text-3xl font-light mb-4 text-sanctuary tracking-wide">Connecting to healing community...</h1>
          <div className="w-2 h-2 mx-auto bg-sanctuary/70 rounded-full animate-gentle-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600">
      {/* Sacred Sanctuary Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-sanctuary/5 via-transparent to-sanctuary/10 pointer-events-none animate-breathing"></div>
      
      {/* Floating sacred elements for inspiration */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-sanctuary/20 rounded-full animate-sanctuary-float animation-delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-sanctuary/30 rounded-full animate-sanctuary-float animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-sanctuary/25 rounded-full animate-sanctuary-float animation-delay-3000"></div>
      
      {/* Sacred Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 sanctuary-glass border-b border-sanctuary/20 backdrop-blur-xl shadow-floating animate-sanctuary-float">
        <div className="flex justify-between items-center px-phi-lg py-phi-md">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-phi-xs text-sanctuary hover:text-sanctuary/80 transition-all duration-400 text-phi-sm font-light tracking-wide sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs hover:shadow-soft hover:scale-105 active:scale-95"
          >
            <svg className="w-phi-sm h-phi-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to sanctuary
          </button>
          
          <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs">
            <div className="text-sanctuary/80 text-phi-xs font-light">
              {user?.email?.split('@')[0] || 'Anonymous Healer'}
            </div>
          </div>
        </div>
      </header>

      {/* Community Healing Content */}
      <div className="pt-24 pb-phi-2xl">
        <div className="max-w-6xl mx-auto px-phi-lg">
          {user && (
            <CommunityHealingHub
              userId={user.uid}
              userThemes={userThemes}
              culturalContext={culturalContext}
              className="animate-slide-in-up"
            />
          )}
        </div>
      </div>

      {/* Sacred Crisis Guardian - Always Present */}
      <div className="fixed bottom-phi-lg right-phi-lg z-50">
        <div
          onClick={() => window.open('tel:988', '_self')}
          className="organic-container w-12 h-12 bg-gradient-to-br from-crisis-red to-red-600 border-4 border-sanctuary/30 shadow-sacred animate-crisis-attention cursor-pointer group transition-all duration-400 hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Sacred crisis support - Call 988"
          aria-label="Sacred crisis support - Call 988"
        >
          <span className="text-phi-lg text-sanctuary animate-gentle-pulse group-hover:animate-heart-sparkle">🆘</span>
          
          {/* Crisis pulse rings */}
          <div className="absolute inset-0 rounded-3xl border-2 border-crisis-red/40 animate-crisis-attention"></div>
          <div className="absolute inset-0 rounded-3xl border border-sanctuary/40 animate-gentle-pulse"></div>
        </div>
      </div>
    </div>
  );
}