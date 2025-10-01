'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import dynamicImport from 'next/dynamic';

// EMERGENCY: Ultra-lightweight dynamic imports for crisis performance
const MoodSelector = dynamicImport(() => import('@/components/MoodSelector').then(mod => ({ default: mod.MoodSelector })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-100 rounded-lg h-12 w-48"></div>
});

const VoiceJournal = dynamicImport(() => import('@/components/wellness/VoiceJournal'), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-600">Loading voice journal...</div>
});

const MedicalDisclaimer = dynamicImport(() => import('@/components/ui/MedicalDisclaimer'), {
  ssr: false,
  loading: () => null // Skip loading state for non-critical component
});

// CRISIS: Emergency fallback journal for ultra-fast loading
const EmergencyJournal = dynamicImport(() => import('@/components/journal/EmergencyJournal'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-4xl mb-4">🌿</div>
        <p className="text-lg text-gray-700">Loading your safe space...</p>
      </div>
    </div>
  )
});

// CRISIS: Lazy load crisis detection with emergency fallback
const loadCrisisDetection = () => {
  return import('@/lib/multi-language-crisis-detection').catch(() => {
    // Emergency fallback crisis detection
    return {
      detectCrisisMultiLanguage: (text: string) => {
        const crisisWords = /\b(suicide|kill myself|end it all|hurt myself|hopeless|worthless)\b/i;
        return {
          detected: crisisWords.test(text),
          confidence: crisisWords.test(text) ? 0.8 : 0,
          severity: crisisWords.test(text) ? 'critical' : 'none',
          language: 'en'
        };
      }
    };
  });
};

const EnhancedCrisisIntervention = dynamicImport(() => import('@/components/crisis/EnhancedCrisisIntervention'), {
  ssr: false,
  loading: () => null
});

// EMERGENCY: Crisis support component that loads immediately
const CrisisEmergencyPage = dynamicImport(() => import('@/components/crisis/CrisisEmergencyPage'), {
  ssr: true,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-red-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">🆘</div>
        <p className="text-xl text-gray-800">Emergency support loading...</p>
        <a href="tel:988" className="mt-4 inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold">
          Call 988 Now
        </a>
      </div>
    </div>
  )
});

// Import mobile performance optimization
import { useMobileOptimization } from '@/lib/mobile-performance-optimizer-v2';

export default function JournalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showVoiceJournal, setShowVoiceJournal] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastKeystroke, setLastKeystroke] = useState(Date.now());
  const [showCrisisIntervention, setShowCrisisIntervention] = useState(false);
  const [crisisDetectedText, setCrisisDetectedText] = useState('');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [crisisSeverity, setCrisisSeverity] = useState<'immediate' | 'urgent' | 'support'>('support');
  
  // Mobile performance optimization
  const { metrics, isOffline, storeOffline, syncOfflineData, optimizeText } = useMobileOptimization();
  const [mobileOptimized, setMobileOptimized] = useState(false);
  const [batteryOptimized, setBatteryOptimized] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const promptTimeoutRef = useRef<NodeJS.Timeout>();

  // Sacred writing prompts that rotate gently
  const writingPrompts = [
    "What does your heart need to express today?",
    "If this moment had a color, what would it be and why?",
    "What small thing brought you peace today?",
    "What would you tell your younger self right now?",
    "What are you learning about yourself?",
    "How has your perspective shifted recently?",
    "What deserves gratitude in this moment?",
    "What does your intuition whisper to you?",
    "What would love do here?",
    "What story does your soul want to tell?",
    "What boundaries are you honoring today?",
    "What dreams are stirring within you?",
    "How are you growing through this experience?",
    "What wisdom has emerged from your struggles?",
    "What brings you back to yourself?"
  ];

  // Auto-save functionality with mobile optimization and offline support
  const triggerAutoSave = useCallback(async () => {
    if (!user || !journalText.trim() || !autoSaveEnabled) return;
    
    const entryData = {
      id: `entry_${user.uid}_${Date.now()}`,
      content: journalText,
      userId: user.uid,
      mood: selectedMood,
      wordCount: wordCount,
      timestamp: Date.now(),
      synced: false
    };
    
    try {
      // Mobile optimization: Check if text should be chunked for performance
      if (optimizeText) {
        const optimization = optimizeText(journalText);
        if (optimization.memoryOptimization === 'aggressive') {
          console.log('📱 Aggressive memory optimization applied for mobile device');
        }
      }
      
      if (isOffline) {
        // Store offline when no internet connection
        console.log('📱 Storing journal entry offline');
        const offlineSuccess = await storeOffline(entryData);
        if (offlineSuccess) {
          setLastSaved(new Date());
          console.log('📱 Journal entry cached offline successfully');
        }
        return;
      }
      
      // Online save attempt
      const response = await fetch('/api/khepera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          journalEntry: journalText,
          userId: user.uid,
          mood: selectedMood,
          wordCount: wordCount,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
        console.log('📱 Journal entry saved online successfully');
      } else {
        // Fallback to offline storage if online save fails
        await storeOffline(entryData);
        console.log('📱 Online save failed, stored offline as fallback');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Always try offline storage as ultimate fallback
      try {
        await storeOffline(entryData);
        setLastSaved(new Date());
        console.log('📱 Emergency offline storage successful');
      } catch (offlineError) {
        console.error('📱 Offline storage also failed:', offlineError);
      }
    }
  }, [user, journalText, selectedMood, wordCount, autoSaveEnabled, isOffline, storeOffline, optimizeText]);

  // Manual save function
  const saveJournal = async () => {
    if (!user || !journalText.trim()) return;

    setSaving(true);
    try {
      await triggerAutoSave();
    } finally {
      setSaving(false);
    }
  };

  // Handle text changes with auto-save debouncing
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJournalText(newText);
    setLastKeystroke(Date.now());
    
    // Update word count
    const words = newText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Auto-save debouncing
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      triggerAutoSave();
    }, 2000); // Auto-save 2 seconds after last keystroke
    
    // Enhanced multi-language crisis detection (non-blocking, lazy loaded)
    if (newText.length > 50) {
      loadCrisisDetection().then(({ detectCrisisMultiLanguage }) => {
        try {
          const userLanguage = navigator.language?.split('-')[0] || 'en';
          const crisisResult = detectCrisisMultiLanguage(newText, userLanguage);
          
          if (crisisResult.detected && crisisResult.confidence > 0.6) {
            console.log(`🆘 Crisis detected (${crisisResult.language}): ${(crisisResult.confidence * 100).toFixed(1)}% confidence`);
            setCrisisDetectedText(newText);
            
            // Determine crisis severity and response
            if (crisisResult.severity === 'critical' && crisisResult.confidence > 0.8) {
              setCrisisSeverity('immediate');
              setEmergencyMode(true); // Switch to emergency mode immediately
            } else if (crisisResult.confidence > 0.7) {
              setCrisisSeverity('urgent');
              setShowCrisisIntervention(true);
            } else {
              setCrisisSeverity('support');
              setShowCrisisIntervention(true);
            }
            
            // Show gentle support for all crisis levels
            showGentleCrisisSupport();
          }
        } catch (error) {
          console.warn('Multi-language crisis detection error (non-blocking):', error);
        }
      }).catch(error => {
        console.warn('Crisis detection module failed to load:', error);
      });
    }
  };

  // Focus management
  const handleTextareaFocus = () => {
    setShowWordCount(true);
    // Hide prompt after focusing
    if (promptTimeoutRef.current) {
      clearTimeout(promptTimeoutRef.current);
    }
    setCurrentPrompt('');
  };

  const handleTextareaBlur = () => {
    setShowWordCount(false);
    // Show a gentle prompt after a delay when not focused
    if (journalText.length === 0) {
      promptTimeoutRef.current = setTimeout(() => {
        const randomPrompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
        setCurrentPrompt(randomPrompt);
      }, 3000);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveJournal();
      }
      
      // Escape to toggle fullscreen
      if (e.key === 'Escape') {
        setIsFullscreen(prev => !prev);
      }
      
      // Cmd/Ctrl + M to open mood selector
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        setShowMoodSelector(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize auth and load saved content
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const auth = await getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
            // Load any saved draft
            const savedDraft = localStorage.getItem(`journal_draft_${user.uid}`);
            if (savedDraft) {
              setJournalText(savedDraft);
              const words = savedDraft.trim().split(/\s+/).filter(word => word.length > 0);
              setWordCount(words.length);
            }
            
            // Sync offline data when user is authenticated and online
            if (!isOffline) {
              console.log('📱 Syncing offline data on authentication');
              syncOfflineData().catch(error => 
                console.warn('📱 Offline sync failed:', error)
              );
            }
          } else {
            router.push('/auth/login');
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Auth initialization failed:', error);
        router.push('/auth/login');
        setLoading(false);
        return null;
      }
    };

    let unsubscribe: (() => void) | null = null;
    
    initializeAuth().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router, isOffline, syncOfflineData]);

  // Save draft to localStorage on text change
  useEffect(() => {
    if (user && journalText) {
      localStorage.setItem(`journal_draft_${user.uid}`, journalText);
    }
  }, [user, journalText]);

  // Show initial prompt
  useEffect(() => {
    if (!loading && journalText.length === 0) {
      promptTimeoutRef.current = setTimeout(() => {
        const randomPrompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
        setCurrentPrompt(randomPrompt);
      }, 2000);
    }
    
    return () => {
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
    };
  }, [loading, journalText.length]);

  // Mobile performance optimization event listeners
  useEffect(() => {
    const handleMemoryPressure = () => {
      console.log('📱 Memory pressure detected - optimizing journal');
      setMobileOptimized(true);
      // Reduce UI complexity under memory pressure
      if (isFullscreen) {
        setCurrentPrompt(''); // Clear prompts to save memory
      }
    };

    const handleBatteryLow = (event: any) => {
      console.log('📱 Low battery detected - enabling power saving');
      setBatteryOptimized(true);
      setAutoSaveEnabled(false); // Reduce network calls to save battery
    };

    const handleSlowConnection = () => {
      console.log('📱 Slow connection detected - optimizing for bandwidth');
      setMobileOptimized(true);
    };

    const handleOfflineMode = () => {
      console.log('📱 Offline mode activated');
      // UI already handles offline state via isOffline
    };

    // Listen to mobile optimization events
    window.addEventListener('alchm-memory-pressure', handleMemoryPressure);
    window.addEventListener('alchm-battery-low', handleBatteryLow);
    window.addEventListener('alchm-slow-connection', handleSlowConnection);
    window.addEventListener('alchm-offline-mode', handleOfflineMode);

    return () => {
      window.removeEventListener('alchm-memory-pressure', handleMemoryPressure);
      window.removeEventListener('alchm-battery-low', handleBatteryLow);
      window.removeEventListener('alchm-slow-connection', handleSlowConnection);
      window.removeEventListener('alchm-offline-mode', handleOfflineMode);
    };
  }, [isFullscreen]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
    };
  }, []);

  const showGentleCrisisSupport = () => {
    // Non-intrusive crisis support notice
    const existingNotice = document.getElementById('gentle-crisis-notice');
    if (existingNotice) return; // Don't show multiple notices

    const notice = document.createElement('div');
    notice.id = 'gentle-crisis-notice';
    notice.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      background: rgba(220, 38, 38, 0.95);
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      max-width: 280px;
      z-index: 999997;
      box-shadow: 0 8px 32px rgba(220, 38, 38, 0.3);
      animation: gentle-slide-in 0.3s ease;
    `;
    
    notice.innerHTML = `
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">
        💙 We care about you
      </div>
      <div style="font-size: 13px; margin-bottom: 12px; line-height: 1.4;">
        If you're struggling, support is available right now. Keep writing if it helps.
      </div>
      <button onclick="window.open('tel:988', '_self')" style="
        background: white;
        color: #dc2626;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        margin-bottom: 8px;
      ">Call 988 for Support</button>
      <button onclick="this.parentElement.remove()" style="
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.5);
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 11px;
        cursor: pointer;
        width: 100%;
      ">Continue Writing</button>
    `;
    
    // Add animation styles if not exist
    if (!document.getElementById('gentle-crisis-animation')) {
      const style = document.createElement('style');
      style.id = 'gentle-crisis-animation';
      style.textContent = `
        @keyframes gentle-slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notice);
    
    // Auto-remove after 15 seconds to not interrupt writing flow
    setTimeout(() => {
      if (notice.parentElement) {
        notice.remove();
      }
    }, 15000);
  };

  if (loading) {
    return (
      <div className="min-h-screen min-h-dvh flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">🌿</div>
          <h1 className="text-2xl font-light mb-4 text-gray-800">Preparing your safe space...</h1>
          <div className="w-2 h-2 mx-auto bg-green-600 rounded-full animate-pulse"></div>
          {/* Emergency access link */}
          <div className="mt-8">
            <button
              onClick={() => setEmergencyMode(true)}
              className="text-red-600 hover:text-red-700 underline text-sm"
            >
              🆘 Emergency Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMERGENCY MODE: Ultra-lightweight crisis access
  if (emergencyMode) {
    return (
      <CrisisEmergencyPage
        severity={crisisSeverity}
        onContinueToJournal={() => setEmergencyMode(false)}
      />
    );
  }

  return (
    <div className={`
      min-h-screen min-h-dvh transition-all duration-600 ease-out relative overflow-hidden
      ${isFullscreen 
        ? 'bg-gradient-to-br from-sage-light via-sanctuary to-sage-muted' 
        : 'bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600'
      }
    `}>
      {/* Sacred Sanctuary Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-sanctuary/5 via-transparent to-sanctuary/10 pointer-events-none animate-breathing"></div>
      
      {/* Floating sacred elements for inspiration */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-sanctuary/20 rounded-full animate-sanctuary-float animation-delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-sanctuary/30 rounded-full animate-sanctuary-float animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-sanctuary/25 rounded-full animate-sanctuary-float animation-delay-3000"></div>
      
      {/* Sacred Floating Header - Invisible Interface */}
      {!isFullscreen && (
        <header className="fixed top-0 left-0 right-0 z-40 sanctuary-glass border-b border-sanctuary/20 backdrop-blur-xl shadow-floating animate-sanctuary-float">
          <div className="flex justify-between items-center px-phi-lg py-phi-md">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-phi-xs text-sanctuary hover:text-sanctuary/80 transition-all duration-400 text-small font-light tracking-wide sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs hover:shadow-soft hover:scale-105 active:scale-95"
            >
              <svg className="w-phi-sm h-phi-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to sanctuary
            </button>
            
            <div className="flex items-center gap-phi-lg">
              {/* Sacred Auto-Save Indicator with Mobile Status */}
              <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs">
                <div className="text-sanctuary/80 text-phi-xs font-light">
                  {saving ? (
                    <span className="flex items-center gap-phi-xs">
                      <div className="w-2 h-2 bg-sanctuary rounded-full animate-gentle-pulse"></div>
                      Sacred thoughts preserved
                    </span>
                  ) : isOffline ? (
                    <span className="flex items-center gap-phi-xs">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-gentle-pulse"></div>
                      📱 Offline sanctuary active
                    </span>
                  ) : lastSaved ? (
                    <span className="opacity-70">Saved {formatTimeAgo(lastSaved)}</span>
                  ) : autoSaveEnabled ? (
                    <span className="opacity-60">Auto-sanctuary enabled</span>
                  ) : batteryOptimized ? (
                    <span className="flex items-center gap-phi-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-gentle-pulse"></div>
                      🔋 Battery saving mode
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Mobile Performance Status */}
              {(mobileOptimized || batteryOptimized || metrics?.memoryUsage) && (
                <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs">
                  <div className="text-sanctuary/60 text-phi-xs font-light flex items-center gap-phi-xs">
                    📱
                    {mobileOptimized && "Optimized"}
                    {batteryOptimized && "Power Save"}
                    {metrics?.memoryUsage && `${metrics.memoryUsage}MB`}
                  </div>
                </div>
              )}
              
              {/* Sacred Mode Toggles */}
              <div className="flex items-center gap-phi-sm">
                <button
                  onClick={() => setShowMoodSelector(!showMoodSelector)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-400 hover:scale-110 active:scale-95 ${
                    selectedMood 
                      ? 'bg-sage-400 text-sanctuary shadow-soft animate-gentle-pulse' 
                      : 'sanctuary-glass border border-sanctuary/30 text-sanctuary hover:shadow-soft'
                  }`}
                  title="Set your current mood (⌘M)"
                >
                  <span className="text-phi-sm">{selectedMood ? '🎭' : '😊'}</span>
                </button>
                
                <button
                  onClick={() => setShowVoiceJournal(!showVoiceJournal)}
                  className="w-10 h-10 rounded-2xl sanctuary-glass border border-sanctuary/30 text-sanctuary hover:shadow-soft flex items-center justify-center transition-all duration-400 hover:scale-110 active:scale-95"
                  title="Voice journaling"
                >
                  <span className="text-phi-sm">🎤</span>
                </button>
                
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="w-10 h-10 rounded-2xl sanctuary-glass border border-sanctuary/30 text-sanctuary hover:shadow-soft flex items-center justify-center transition-all duration-400 hover:scale-110 active:scale-95"
                  title="Enter fullscreen sanctuary (Esc)"
                >
                  <span className="text-phi-sm">⚡</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Sacred Mood Sanctuary Modal */}
      {showMoodSelector && (
        <div className="fixed inset-0 z-50 sanctuary-backdrop backdrop-blur-xl flex items-center justify-center p-phi-lg animate-fade-in">
          <div className="organic-container sanctuary-glass border border-sanctuary/30 shadow-floating p-phi-xl max-w-md w-full animate-slide-in-up">
            <div className="flex justify-between items-center mb-phi-lg">
              <h3 className="text-large font-light text-sage-700 tracking-normal">How is your heart today?</h3>
              <button
                onClick={() => setShowMoodSelector(false)}
                className="w-10 h-10 rounded-2xl sanctuary-glass border border-sanctuary/30 text-sage-600 hover:text-sage-700 hover:shadow-soft flex items-center justify-center transition-all duration-400 hover:scale-110 active:scale-95"
              >
                <span className="text-phi-sm">✕</span>
              </button>
            </div>
            <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-md">
              <MoodSelector
                selectedMood={selectedMood}
                onMoodSelect={(mood) => {
                  setSelectedMood(mood);
                  setShowMoodSelector(false);
                }}
                variant="grid"
                size="md"
              />
            </div>
            
            {/* Modal decoration */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">💭</div>
          </div>
        </div>
      )}

      {/* Sacred Voice Sanctuary Modal */}
      {showVoiceJournal && (
        <div className="fixed inset-0 z-50 sanctuary-backdrop backdrop-blur-xl flex items-center justify-center p-phi-lg animate-fade-in">
          <div className="organic-container sanctuary-glass border border-sanctuary/30 shadow-floating p-phi-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex justify-between items-center mb-phi-lg">
              <h3 className="text-large font-light text-sage-700 tracking-normal">Sacred Voice Portal</h3>
              <button
                onClick={() => setShowVoiceJournal(false)}
                className="w-10 h-10 rounded-2xl sanctuary-glass border border-sanctuary/30 text-sage-600 hover:text-sage-700 hover:shadow-soft flex items-center justify-center transition-all duration-400 hover:scale-110 active:scale-95"
              >
                <span className="text-phi-sm">✕</span>
              </button>
            </div>
            <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-md">
              <VoiceJournal
                onEntryComplete={(entry) => {
                  // Add voice entry to journal text
                  setJournalText(prev => 
                    prev + (prev ? '\n\n' : '') + 
                    `[Sacred Voice - ${entry.timestamp.toLocaleString()}]\n${entry.transcript}\n`
                  );
                  setShowVoiceJournal(false);
                }}
              />
            </div>
            
            {/* Voice modal decoration */}
            <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">🎙️</div>
          </div>
        </div>
      )}

      {/* Sacred Writing Canvas */}
      <div className={`
        transition-all duration-600 ease-out sacred-writing-canvas relative
        ${isFullscreen 
          ? 'pt-0' 
          : 'pt-24'
        }
      `}>
        <div className={`
          mx-auto transition-all duration-600 ease-out
          ${isFullscreen 
            ? 'max-w-4xl px-phi-xl py-phi-2xl' 
            : 'max-w-5xl px-phi-lg py-phi-xl'
          }
        `}>
          
          {/* Sacred Writing Sanctuary */}
          <div className={`
            relative transition-all duration-600 ease-out organic-container
            ${isFullscreen 
              ? 'bg-transparent' 
              : 'sanctuary-glass border border-sanctuary/30 shadow-floating backdrop-blur-xl animate-sanctuary-float'
            }
          `}>
            
            {/* Writing Area */}
            <div className={`
              ${isFullscreen ? 'p-0' : 'p-8'}
            `}>
              
              {/* Sacred Fullscreen Controls */}
              {isFullscreen && (
                <div className="flex justify-between items-center mb-phi-xl">
                  <div className="flex items-center gap-phi-md">
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="w-12 h-12 rounded-2xl sanctuary-glass border border-sanctuary/30 text-sage-600 hover:text-sage-700 hover:shadow-soft flex items-center justify-center transition-all duration-400 backdrop-blur-xl hover:scale-110 active:scale-95"
                      title="Exit fullscreen (Esc)"
                    >
                      <span className="text-phi-md">↙</span>
                    </button>
                    
                    {selectedMood && (
                      <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-md py-phi-sm backdrop-blur-xl animate-gentle-pulse">
                        <span className="text-sage-600 text-phi-sm font-light tracking-wide">
                          Feeling {selectedMood}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-phi-md">
                    {showWordCount && wordCount > 0 && (
                      <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl">
                        <span className="text-sage-600/80 text-phi-xs font-light">
                          {wordCount} sacred words
                        </span>
                      </div>
                    )}
                    
                    <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl">
                      <div className="text-sage-600/80 text-phi-xs font-light">
                        {saving ? (
                          <span className="flex items-center gap-phi-xs">
                            <div className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-gentle-pulse"></div>
                            Preserving sacred thoughts...
                          </span>
                        ) : lastSaved ? (
                          <span>Saved {formatTimeAgo(lastSaved)}</span>
                        ) : (
                          <span>Every word is sacred</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Sacred Textarea Sanctuary */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={journalText}
                  onChange={handleTextChange}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                  placeholder={isFullscreen 
                    ? "Let your sacred thoughts flow like water finding its way to the sea..." 
                    : "What wisdom wants to emerge from your heart today?"
                  }
                  className={`
                    w-full bg-transparent border-none outline-none resize-none
                    text-sage-700 placeholder:text-sage-500/60 placeholder:italic placeholder:font-light
                    transition-all duration-400 ease-out
                    ${isFullscreen 
                      ? 'text-large leading-relaxed h-[70vh] font-light tracking-normal' 
                      : 'text-base leading-relaxed h-96 font-light tracking-normal'
                    }
                    focus:text-sage-800 selection:bg-sage-200/50
                  `}
                  style={{ 
                    fontFamily: 'var(--font-system)',
                    lineHeight: 'var(--line-height-relaxed)',
                    caretColor: '#a4b792'
                  }}
                />
                
                {/* Sacred Floating Prompt */}
                {currentPrompt && journalText.length === 0 && (
                  <div className={`
                    absolute transition-all duration-600 ease-out pointer-events-none writing-prompt
                    text-sage-600/70 italic font-light
                    ${isFullscreen 
                      ? 'top-phi-2xl left-0 text-phi-md tracking-wide' 
                      : 'top-phi-xl left-0 text-phi-base tracking-wide'
                    }
                  `}>
                    {currentPrompt}
                    <div className="inline-block ml-phi-xs opacity-60 animate-gentle-sparkle">✨</div>
                  </div>
                )}
                
                {/* Sacred Word Count */}
                {!isFullscreen && showWordCount && wordCount > 0 && (
                  <div className="absolute bottom-phi-md right-phi-md sanctuary-glass border border-sanctuary/20 backdrop-blur-xl px-phi-sm py-phi-xs rounded-2xl word-count-display">
                    <span className="text-sage-600/80 text-phi-xs font-light">
                      {wordCount} sacred words
                    </span>
                  </div>
                )}
                
                {/* Sacred Encouragement */}
                {!isFullscreen && journalText.length > 100 && (
                  <div className="absolute bottom-phi-md left-phi-md sanctuary-glass border border-sanctuary/20 backdrop-blur-xl px-phi-sm py-phi-xs rounded-2xl animate-gentle-breathe">
                    <div className="flex items-center gap-phi-xs text-sage-600/80 text-phi-xs font-light">
                      <span className="animate-gentle-sparkle">✨</span>
                      Sacred thoughts flowing beautifully
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sacred Action Sanctuary - Non-fullscreen only */}
              {!isFullscreen && (
                <div className="flex justify-between items-center mt-phi-xl pt-phi-lg border-t border-sanctuary/20">
                  <div className="flex items-center gap-phi-md">
                    <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl">
                      <span className="text-sage-600/80 text-phi-xs font-light">
                        {wordCount > 0 ? `${wordCount} sacred words` : 'Begin when your heart is ready'}
                      </span>
                    </div>
                    
                    {selectedMood && (
                      <div className="sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl animate-gentle-pulse">
                        <div className="flex items-center gap-phi-xs text-sage-600 text-phi-xs font-light">
                          <span>🎭</span>
                          <span className="capitalize tracking-wide">{selectedMood}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-phi-sm">
                    <button
                      onClick={saveJournal}
                      disabled={saving || !journalText.trim()}
                      className={`
                        px-phi-lg py-phi-sm rounded-2xl font-light text-phi-sm transition-all duration-400 tracking-wide
                        ${journalText.trim() 
                          ? 'bg-sage-400 text-sanctuary hover:bg-sage-500 shadow-soft hover:shadow-floating hover:scale-105 active:scale-95' 
                          : 'sanctuary-glass border border-sanctuary/30 text-sage-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {saving ? (
                        <span className="flex items-center gap-phi-xs">
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Preserving sacred thoughts...
                        </span>
                      ) : (
                        'Preserve Sacred Entry'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Crisis Guardian - Always Present */}
      <div className="fixed bottom-phi-lg right-phi-lg z-50">
        <div
          onClick={() => window.open('tel:988', '_self')}
          className="organic-container w-16 h-16 bg-gradient-to-br from-crisis-red to-red-600 border-4 border-sanctuary/30 shadow-sacred animate-crisis-attention cursor-pointer group transition-all duration-400 hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Sacred crisis support - Call 988"
          aria-label="Sacred crisis support - Call 988"
        >
          <span className="text-phi-lg text-sanctuary animate-gentle-pulse group-hover:animate-heart-sparkle">🆘</span>
          
          {/* Crisis pulse rings */}
          <div className="absolute inset-0 rounded-3xl border-2 border-crisis-red/40 animate-crisis-attention"></div>
          <div className="absolute inset-0 rounded-3xl border border-sanctuary/40 animate-gentle-pulse"></div>
        </div>
      </div>

      {/* Sacred Keyboard Shortcuts Sanctuary */}
      {isFullscreen && (
        <div className="fixed bottom-phi-lg left-phi-lg z-40 sanctuary-glass border border-sanctuary/20 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl animate-gentle-breathe">
          <div className="text-sage-600/70 text-phi-xs font-light tracking-wide">
            Press Esc to exit sanctuary • ⌘S to preserve
          </div>
        </div>
      )}

      {/* Enhanced Crisis Intervention Modal */}
      {showCrisisIntervention && (
        <EnhancedCrisisIntervention
          detectedText={crisisDetectedText}
          language={navigator.language?.split('-')[0] || 'en'}
          onDismiss={() => {
            setShowCrisisIntervention(false);
            setCrisisDetectedText('');
          }}
          onEscalate={(level) => {
            console.log(`Crisis escalated to level: ${level}`);
            // Additional escalation logic could go here
          }}
        />
      )}
      
      {/* Medical Disclaimer - Important for user safety */}
      <div className="mt-8">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
}