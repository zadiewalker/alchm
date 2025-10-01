'use client';

import { useEffect, useState, memo, useCallback, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import dynamic from 'next/dynamic';
import { observeAuthState } from '@/lib/auth/domain-aware-auth';
import { useMobileOptimization } from '@/lib/mobile-performance-optimizer';

// CRITICAL: Lazy load non-essential components for TTI optimization (25.6s -> <5s target)
const MobilePerformanceMonitor = dynamic(() => import('@/components/mobile/MobilePerformanceMonitor'), {
  loading: () => null,
  ssr: false
});

// CRITICAL: Memoized word counter to prevent expensive recalculations
const WordCounter = memo(function WordCounter({ text }: { text: string }) {
  const wordCount = text.split(' ').filter(word => word.length > 0).length;
  
  return (
    <div className="mt-4 text-center">
      <span className="text-white/60 text-sm">
        {wordCount} words
      </span>
    </div>
  );
});

// CRITICAL: Memoized reflection prompts component to prevent re-renders
const ReflectionPrompts = memo(function ReflectionPrompts({ 
  setJournalText 
}: {
  setJournalText: (updater: (prev: string) => string) => void;
}) {
  const addPrompt = useCallback((prompt: string) => {
    setJournalText(prev => prev + `\n\n${prompt}\n`);
  }, [setJournalText]);

  const prompts = [
    { emoji: '💝', text: 'What am I grateful for today?', label: 'Add gratitude prompt to journal' },
    { emoji: '🧘', text: 'How am I feeling right now?', label: 'Add feeling check-in prompt to journal' },
    { emoji: '🌱', text: 'What challenged me today, and how did I grow?', label: 'Add growth reflection prompt to journal' },
    { emoji: '🤗', text: 'What do I need to feel supported right now?', label: 'Add support needs prompt to journal' }
  ];

  return (
    <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <h3 className="text-lg font-medium text-white mb-4">Reflection Prompts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => addPrompt(prompt.text)}
            className="text-left p-4 bg-white/10 rounded-xl text-white/80 hover:bg-white/20 transition-colors touch-safe min-h-[60px] w-full"
            style={{ 
              touchAction: 'manipulation', 
              WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.2)',
              willChange: 'background-color' // Optimize hover states
            }}
            aria-label={prompt.label}
          >
            {prompt.emoji} {prompt.text}
          </button>
        ))}
      </div>
    </div>
  );
});

// CRITICAL: Memoized AI Insight display to prevent unnecessary re-renders
const AIInsightDisplay = memo(function AIInsightDisplay({ 
  aiInsight, 
  showInsight, 
  onClose 
}: {
  aiInsight: any;
  showInsight: boolean;
  onClose: () => void;
}) {
  if (!showInsight || !aiInsight) return null;

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-white">✨ Khepera's Reflection</h3>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white text-sm"
          aria-label="Close insight"
        >
          ✕
        </button>
      </div>
      
      <div className="text-white/90 leading-relaxed space-y-3">
        {aiInsight.insight && (
          <p className="italic">{aiInsight.insight}</p>
        )}
        
        {aiInsight.encouragement && (
          <p className="font-medium text-white/95">{aiInsight.encouragement}</p>
        )}
      </div>

      {aiInsight.responseType === 'crisis_support' && aiInsight.resources && (
        <div className="mt-6 p-4 bg-red-500/20 rounded-lg border border-red-400/30">
          <h4 className="font-semibold text-white mb-3">Crisis Support Resources:</h4>
          <div className="space-y-2">
            {aiInsight.resources.map((resource: string, index: number) => (
              <div key={index} className="text-white/90 text-sm">
                {resource}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// CRITICAL: Memoized journal page for performance optimization
export default memo(function JournalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [offlineSupport, setOfflineSupport] = useState({ 
    isOffline: false, 
    hasOfflineResources: false, 
    getEmergencyContacts: null 
  });

  // Mobile performance optimization hooks
  const { capabilities, config, isStruggling, startCrisisDetectionTiming, endCrisisDetectionTiming } = useMobileOptimization();
  
  // Load offline support after initial render for better TTI
  useEffect(() => {
    let mounted = true;
    startTransition(() => {
      if (mounted && typeof window !== 'undefined') {
        import('@/lib/mobile-crisis-offline-manager').then(module => {
          if (mounted) {
            const support = module.useOfflineCrisisSupport();
            setOfflineSupport(support);
          }
        }).catch(() => {
          // Fallback if offline support fails to load
        });
      }
    });
    return () => { mounted = false; };
  }, []);
  
  const { isOffline, hasOfflineResources, getEmergencyContacts } = offlineSupport;

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Auto-save functionality
  useEffect(() => {
    if (user && journalText.trim().length > 10) { // Only auto-save if there's substantial content
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Set new timeout for auto-save after 5 seconds of inactivity
      const timeout = setTimeout(() => {
        if (!saving) { // Don't auto-save if already saving
          saveJournal();
        }
      }, 5000);

      setAutoSaveTimeout(timeout);
    }

    // Cleanup timeout on unmount
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [journalText, user, saving]);

  const saveJournal = useCallback(async () => {
    if (!user || !journalText.trim()) return;

    setSaving(true);
    try {
      // Get the user's auth token
      const token = await user.getIdToken();
      
      // Save journal entry to Firestore via API
      const response = await fetch('/api/journal/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': user.uid,
        },
        body: JSON.stringify({
          content: journalText,
          title: null, // Could be derived from first line or user input
          mood: null, // Could be captured from user
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save journal entry');
      }

      const result = await response.json();
      setLastSaved(new Date());
      
      // Show AI insight if available
      if (result.aiInsight) {
        setAiInsight(result.aiInsight);
        setShowInsight(true);
      }
      
      // Optional: Show success feedback to user
      console.log('Journal saved successfully:', result.id);
      
    } catch (error) {
      console.error('Save error:', error);
      // In a production app, you'd show a user-friendly error message
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [user, journalText]);

  const handleBackToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const handleCloseInsight = useCallback(() => {
    setShowInsight(false);
  }, []);

  // CRITICAL: Optimized loading state to prevent LCP issues
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)',
        willChange: 'auto' // Prevent GPU layer
      }}>
        <div className="text-center">
          <div className="text-6xl mb-4" role="img" aria-label="Loading">🌿</div>
          <p className="text-white text-lg">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to login
  }

  // Memoize style objects to prevent re-calculations
  const containerStyle = {
    background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
  };

  const textareaStyle = { 
    minHeight: '400px', 
    fontSize: '17px', /* iOS optimized */
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    willChange: 'contents' // Optimize for frequent updates
  };

  return (
    <div 
      className={`min-h-screen ${capabilities?.isVeryLowEnd ? 'very-low-end-device' : ''} ${capabilities?.isLowEnd ? 'low-end-device' : ''} ${isOffline ? 'offline-mode' : ''}`}
      style={containerStyle}
    >
      {/* Mobile Performance Monitor (only in dev) */}
      {process.env.NODE_ENV === 'development' && (
        <MobilePerformanceMonitor showDebugInfo={true} />
      )}

      {/* Crisis Emergency Notification for Mobile */}
      {(capabilities?.isInCrisisMode || isStruggling) && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 text-center">
          <div className="flex items-center justify-center space-x-4">
            <span>🆘 Crisis support available</span>
            <a 
              href="tel:988" 
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold min-h-[44px] min-w-[100px] flex items-center justify-center"
              style={{ touchAction: 'manipulation' }}
            >
              Call 988
            </a>
          </div>
        </div>
      )}

      {/* Offline Mode Notification */}
      {isOffline && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-orange-600 text-white p-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span>📱 Offline Mode</span>
            {hasOfflineResources && <span>✅ Crisis resources available</span>}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="text-white/80 hover:text-white mr-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 touch-safe min-h-[52px] min-w-[52px] flex items-center justify-center"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.2)' }}
                aria-label="Back to dashboard"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/40 px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium touch-safe min-h-[52px] min-w-[100px]"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.2)' }}
                aria-label={saving ? 'Saving journal entry' : 'Save journal entry'}
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

        {/* Journal Writing Area - Performance Optimized */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <textarea
            value={journalText}
            onChange={useCallback((e) => setJournalText(e.target.value), [])}
            placeholder="What's on your mind today? This is your safe space to explore your thoughts and feelings..."
            className="w-full h-96 bg-transparent text-white placeholder-white/60 border-none outline-none resize-none text-lg leading-relaxed textarea-journal"
            style={textareaStyle}
            aria-label="Journal writing area"
            spellCheck="false" // Reduce processing overhead
          />
        </div>

        {/* Helpful Prompts - Memoized for performance */}
        <ReflectionPrompts setJournalText={setJournalText} />

        {/* Word Count - Memoized to prevent recalculation */}
        <WordCounter text={journalText} />

        {/* AI Insight Display - Memoized */}
        <AIInsightDisplay 
          aiInsight={aiInsight}
          showInsight={showInsight}
          onClose={handleCloseInsight}
        />

        {/* Crisis Support Notice - MOBILE EMERGENCY OPTIMIZATION */}
        <div className="mt-12 bg-white/15 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/40 text-center crisis-emergency-isolation" style={{ marginBottom: '32px' }}>
          <p className="text-white font-semibold text-base mb-6 crisis-support-text">
            Crisis Support Available 24/7
          </p>
          <div className="mb-6">
            <a 
              href="tel:988" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 text-xl rounded-2xl font-medium transition-all duration-300 border-3 border-red-500 hover:border-red-400 inline-flex items-center justify-center touch-crisis crisis-button-mobile"
              style={{ 
                touchAction: 'manipulation', 
                WebkitTapHighlightColor: 'rgba(220, 38, 38, 0.3)',
                minHeight: '84px',
                minWidth: '260px',
                fontSize: '20px',
                fontWeight: '800',
                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
                textDecoration: 'none'
              }}
              aria-label="Call 988 Crisis Lifeline now for immediate support"
            >
              📞 Call 988 Now
            </a>
          </div>
          <p className="text-white/70 text-sm leading-relaxed crisis-disclaimer-text">
            ALCHM is a journaling platform, not medical treatment or therapy. Ages 17+.
            <br />
            COPPA, GDPR & CCPA compliant. Your data is encrypted and protected.
          </p>
        </div>
      </main>
    </div>
  );
});