/**
 * ALCHM Analytics Dashboard Page
 * 
 * Comprehensive analytics dashboard showing user's healing journey,
 * emotional intelligence growth, and writing evolution with full
 * privacy controls and trauma-informed presentation.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import SanctuaryAnalyticsDashboard from '@/components/dashboard/SanctuaryAnalyticsDashboard';
import EmotionalReportCard from '@/components/dashboard/EmotionalReportCard';
import { emotionalAnalytics } from '@/lib/privacy-preserving-emotional-analytics';

interface AnalyticsPageState {
  user: User | null;
  loading: boolean;
  selectedTimeframe: 'week' | 'month' | 'quarter';
  error: string | null;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [state, setState] = useState<AnalyticsPageState>({
    user: null,
    loading: true,
    selectedTimeframe: 'month',
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState(prev => ({ ...prev, user, loading: false }));
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleTimeframeChange = (timeframe: 'week' | 'month' | 'quarter') => {
    setState(prev => ({ ...prev, selectedTimeframe: timeframe }));
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-primary to-sage-hover flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-8 backdrop-blur-sm text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
            <div className="w-6 h-6 bg-sage-400 rounded-full animate-gentle-pulse opacity-60" />
          </div>
          <h2 className="text-sage-800 font-medium text-lg mb-2 tracking-tight">
            Preparing Your Sanctuary
          </h2>
          <p className="text-sage-600 text-sm tracking-wide">
            Creating a space for gentle reflection
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-primary to-sage-hover flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-8 backdrop-blur-sm text-center max-w-md">
          <div className="text-4xl mb-4 animate-gentle-breathe">🌿</div>
          <h2 className="text-sage-800 font-medium text-lg mb-2 tracking-tight">
            Taking a Gentle Pause
          </h2>
          <p className="text-sage-600 text-sm mb-6 leading-relaxed">
            {state.error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-sage-400 hover:bg-sage-500 text-white rounded-2xl px-6 py-3 font-medium transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { user, selectedTimeframe } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-primary to-sage-hover">
      {/* Header */}
      <header className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-white/10 rounded-xl"
              aria-label="Go back to dashboard"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-medium text-white tracking-tight">
                Your Healing Analytics
              </h1>
              <p className="text-white/70 text-sm">
                Compassionate insights from your journey
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-gentle-pulse" />
            <span className="text-white/80 text-sm font-medium">Privacy Protected</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 pt-8">
        {/* Timeframe selection integrated into the sanctuary dashboard */}
        <div className="mb-6">
          <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-sm rounded-xl max-w-fit">
            {(['week', 'month', 'quarter'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => handleTimeframeChange(timeframe)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedTimeframe === timeframe
                    ? 'bg-white text-sage-700 shadow-soft'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Compact emotional report card */}
        <div className="mb-8">
          {user && (
            <EmotionalReportCard 
              timeframe={selectedTimeframe} 
              showPrivacyIndicator={false}
            />
          )}
        </div>

        {/* Full sanctuary analytics dashboard */}
        <SanctuaryAnalyticsDashboard />
        
        {/* Helpful navigation */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-white/60 to-white/40 border border-sage-100/60 rounded-3xl shadow-soft p-8 backdrop-blur-sm">
            <div className="text-4xl mb-4 animate-gentle-sparkle">🌟</div>
            <h2 className="text-sage-800 font-medium text-xl mb-3 tracking-tight">
              Continue Your Journey
            </h2>
            <p className="text-sage-600 text-sm mb-6 leading-relaxed max-w-md mx-auto">
              Your insights are most meaningful when paired with regular reflection and self-care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push('/journal')}
                className="bg-sage-400 hover:bg-sage-500 text-white rounded-2xl px-6 py-3 font-medium transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5"
              >
                ✍️ Write New Entry
              </Button>
              
              <Button
                onClick={() => router.push('/journals')}
                variant="outline"
                className="border-sage-300 text-sage-700 hover:bg-sage-50 rounded-2xl px-6 py-3 font-medium transition-all duration-200"
              >
                📚 Review Past Entries
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Crisis Support - Always Available */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="destructive"
          size="lg"
          onClick={() => window.open('tel:988', '_self')}
          className="rounded-full w-16 h-16 p-0 shadow-elevated animate-crisis-attention"
          style={{ 
            touchAction: 'manipulation',
            minWidth: '64px',
            minHeight: '64px'
          }}
          aria-label="Emergency crisis support - Call 988 National Suicide Prevention Lifeline"
        >
          <span className="text-2xl" role="img" aria-label="Emergency SOS">🆘</span>
        </Button>
      </div>
    </div>
  );
}