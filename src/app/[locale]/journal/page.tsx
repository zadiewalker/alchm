'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Heart, MessageCircle, Sprout, Users, Crown, Activity, Brain, PenTool, BookOpen, Shield } from 'lucide-react';
import { useSacredMetrics } from '@/hooks/useSacredMetrics';
import dynamic from 'next/dynamic';

// Dynamic import for enhanced Khepera chat - essential for emotional journaling
const KheperaChat = dynamic(
  () => import('@/components/khepera/KheperaChat'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function JournalPage() {
  const router = useRouter();
  const { completeFirstJournalEntry } = useSacredMetrics();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Khepera quietly welcomes the user
        
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const saveJournal = useCallback(async (isAutoSave = false) => {
    if (!user || !journalText.trim()) return;

    setSaving(true);
    
    
    try {
      // Here you would save to Firestore
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, isAutoSave ? 500 : 1000));
      setLastSaved(new Date());
      
      // Store in localStorage as backup for crisis situations
      localStorage.setItem(`alchm_journal_backup_${user.uid}`, JSON.stringify({
        content: journalText,
        timestamp: new Date().toISOString()
      }));
      
      // Track first journal entry completion (Sacred Metrics)
      const isFirstEntry = !localStorage.getItem('alchm_first_entry_completed');
      if (isFirstEntry && !isAutoSave && journalText.trim().length > 0) {
        completeFirstJournalEntry(journalText.trim().length);
        localStorage.setItem('alchm_first_entry_completed', 'true');
      }
      
      // Gentle celebration for completion
      if (!isAutoSave && journalText.length > 50) {
        setCelebrationMessage('Your thoughts have been safely captured. Thank you for sharing with yourself.');
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      
    } catch (error) {
      console.error('Save error:', error);
      // In crisis situations, still save to localStorage
      localStorage.setItem(`alchm_journal_backup_${user.uid}`, JSON.stringify({
        content: journalText,
        timestamp: new Date().toISOString(),
        error: true
      }));
    } finally {
      setSaving(false);
    }
  }, [user, journalText]);

  const handleBackToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJournalText(text);
    
    // Update word count
    const words = text.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Auto-resize textarea with gentle expansion
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(400, textareaRef.current.scrollHeight)}px`;
    }
    
    // Crisis-safe autosave: save every 30 seconds of inactivity
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (text.trim()) {
        saveJournal(true);
      }
    }, 30000);
  }, [saveJournal]);

  const insertPrompt = useCallback((promptText: string) => {
    const newText = journalText + (journalText ? '\n\n' : '') + promptText + '\n';
    setJournalText(newText);
    
    // Focus textarea and position cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
    }, 100);
  }, [journalText]);

  // Cleanup autosave timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-400 to-sage-500 flex items-center justify-center px-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-sanctuary-glass backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/20 animate-gentle-breathe">
            <PenTool className="w-10 h-10 text-white drop-shadow-sm" />
          </div>
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl px-12 py-8 shadow-2xl border border-white/20 max-w-md">
            <h3 className="text-2xl font-light text-charcoal-800 mb-3 tracking-tight">Preparing writing sanctuary</h3>
            <p className="text-base font-light text-charcoal-600 leading-relaxed opacity-90">
              Khepera is creating a sanctuary for your thoughts...
            </p>
            <div className="mt-8 w-40 h-1 bg-sage-400/20 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-sage-400 rounded-full animate-pulse w-1/3 transition-all duration-300 ease-out"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-100 via-sanctuary-100/80 to-sanctuary-200">
      {/* Sacred Header - Luxury glass morphism */}
      <header className="bg-sanctuary-glass backdrop-blur-xl border-b border-sage-400/20 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="text-charcoal-500 hover:text-sage-400 transition-all duration-breath p-3 rounded-caress hover:bg-sage-400/8 min-h-touch-sanctuary min-w-touch-sanctuary"
                aria-label="Return to dashboard"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-3xlarge font-breath text-charcoal-800 tracking-tight mb-1">Sacred Journal</h1>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-sage-400/10 rounded-full flex items-center justify-center">
                    <span className="text-sage-400 text-xs">🪲</span>
                  </div>
                  <p className="text-base text-charcoal-600 font-ground">Your thoughts are held in sacred trust</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {lastSaved && (
                <div className="flex items-center space-x-3 bg-sanctuary-glass rounded-caress px-4 py-2 border border-sage-400/20">
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-sacred-pulse" />
                  <span className="text-sm font-ground text-sage-600">
                    Safely preserved
                  </span>
                </div>
              )}
              <Button
                onClick={() => saveJournal(false)}
                disabled={saving || !journalText.trim()}
                className="bg-sage-400 hover:bg-sage-500 text-sanctuary-white px-6 py-3 rounded-embrace transition-all duration-breath shadow-gentle hover:shadow-blessing min-h-touch-sanctuary"
                aria-label={saving ? 'Khepera is preserving your thoughts' : 'Preserve your thoughts'}
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Preserving...' : 'Preserve'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sacred Writing Sanctuary */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        
        {/* Gentle Date Presence - Luxury elevated */}
        <div className="mb-20 text-center">
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl px-12 py-8 shadow-xl border border-sage-400/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="w-6 h-6 bg-sage-400/10 rounded-full flex items-center justify-center">
                <PenTool className="w-3 h-3 text-sage-400" />
              </div>
              <h2 className="text-xlarge text-charcoal-700 font-presence">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h2>
              <div className="w-6 h-6 bg-sage-400/10 rounded-full flex items-center justify-center">
                <PenTool className="w-3 h-3 text-sage-400" />
              </div>
            </div>
            <p className="text-base text-charcoal-600 font-ground leading-comfortable opacity-90">A sacred moment to breathe, reflect, and simply be with yourself</p>
          </div>
        </div>

        {/* Sacred Writing Sanctuary - Completely Reimagined */}
        <div className="relative mb-16">
          {/* Khepera's Gentle Presence - More Subtle */}
          <div className="absolute -top-3 left-8 z-10">
            <div className="bg-sanctuary-glass backdrop-blur-xl px-4 py-2 rounded-caress border border-sage-400/20 shadow-gentle">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-sage-400/10 rounded-full flex items-center justify-center">
                  <span className="text-sage-400 text-xs animate-gentle-pulse">🪲</span>
                </div>
                <span className="text-small text-charcoal-600 font-ground">Khepera holds space for your words</span>
              </div>
            </div>
          </div>
          
          {/* Sacred Writing Canvas - Luxury elevated design */}
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl border border-sage-400/20 shadow-2xl overflow-hidden">
            {/* Subtle Sacred Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage-400/2 via-transparent to-terracotta-400/1 pointer-events-none"></div>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={journalText}
                onChange={handleTextChange}
                placeholder="What's moving through your heart today? Write freely, without judgment—this space is entirely yours..."
                className="w-full min-h-[600px] bg-transparent text-charcoal-800 placeholder-charcoal-400/80 border-none outline-none resize-none text-large leading-relaxed p-12 font-contemplation focus:placeholder-charcoal-300 transition-all duration-breath"
                style={{ 
                  minHeight: '600px',
                  lineHeight: '1.75',
                  letterSpacing: '0.01em'
                }}
              />
              
              {/* Gentle word count in writing area */}
              {journalText.trim() && (
                <div className="absolute bottom-4 right-4 bg-sanctuary-glass backdrop-blur-xl rounded-caress px-3 py-1 border border-sage-400/20">
                  <span className="text-small text-charcoal-500 font-ground">
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Khepera's Gentle Writing Invitations - Luxury sacred cards */}
        <div className="mb-20">
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl border border-sage-400/20 shadow-xl overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage-400/3 via-transparent to-terracotta-400/2 pointer-events-none"></div>
            
            <div className="relative p-10">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-sage-400/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-sage-400" />
                  </div>
                  <h3 className="text-xlarge font-presence text-charcoal-800">Gentle Writing Invitations</h3>
                  <div className="w-8 h-8 bg-sage-400/10 rounded-full flex items-center justify-center">
                    <span className="text-sage-400 text-sm animate-gentle-pulse">🪲</span>
                  </div>
                </div>
                <p className="text-base text-charcoal-600 font-ground max-w-2xl mx-auto leading-comfortable">When words feel distant, these gentle prompts can help your thoughts begin to flow. Choose what resonates with your heart today.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => insertPrompt("What am I grateful for in this moment?")}
                  className="group bg-sanctuary-glass backdrop-blur-xl hover:backdrop-blur-2xl p-8 text-left rounded-3xl border border-sage-400/20 hover:border-sage-400/50 hover:shadow-xl transition-all duration-300 ease-out min-h-[64px] hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sage-400/10 group-hover:bg-sage-400/15 rounded-caress flex items-center justify-center flex-shrink-0 transition-all duration-breath">
                      <Heart className="w-5 h-5 text-sage-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-intention text-charcoal-800 mb-2 group-hover:text-sage-700 transition-colors duration-breath">Gratitude's Gentle Touch</h4>
                      <p className="text-sm text-charcoal-600 leading-comfortable font-ground opacity-80">What brings light to my heart today?</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => insertPrompt("How is my heart feeling right now?")}
                  className="group bg-sanctuary-glass backdrop-blur-xl hover:backdrop-blur-2xl p-8 text-left rounded-3xl border border-sage-400/20 hover:border-sage-400/50 hover:shadow-xl transition-all duration-300 ease-out min-h-[64px] hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-terracotta-400/10 group-hover:bg-terracotta-400/15 rounded-caress flex items-center justify-center flex-shrink-0 transition-all duration-breath">
                      <MessageCircle className="w-5 h-5 text-terracotta-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-intention text-charcoal-800 mb-2 group-hover:text-terracotta-600 transition-colors duration-breath">Heart's True Voice</h4>
                      <p className="text-sm text-charcoal-600 leading-comfortable font-ground opacity-80">What emotions are visiting me today?</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => insertPrompt("What challenged me today, and how did I grow?")}
                  className="group bg-sanctuary-glass backdrop-blur-xl hover:backdrop-blur-2xl p-8 text-left rounded-3xl border border-sage-400/20 hover:border-sage-400/50 hover:shadow-xl transition-all duration-300 ease-out min-h-[64px] hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sage-500/10 group-hover:bg-sage-500/15 rounded-caress flex items-center justify-center flex-shrink-0 transition-all duration-breath">
                      <Sprout className="w-5 h-5 text-sage-500" />
                    </div>
                    <div>
                      <h4 className="text-base font-intention text-charcoal-800 mb-2 group-hover:text-sage-700 transition-colors duration-breath">Growth Through Difficulty</h4>
                      <p className="text-sm text-charcoal-600 leading-comfortable font-ground opacity-80">How did I find strength today?</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => insertPrompt("What would comfort and support me right now?")}
                  className="group bg-sanctuary-glass backdrop-blur-xl hover:backdrop-blur-2xl p-8 text-left rounded-3xl border border-sage-400/20 hover:border-sage-400/50 hover:shadow-xl transition-all duration-300 ease-out min-h-[64px] hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blush-400/10 group-hover:bg-blush-400/15 rounded-caress flex items-center justify-center flex-shrink-0 transition-all duration-breath">
                      <Shield className="w-5 h-5 text-blush-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-intention text-charcoal-800 mb-2 group-hover:text-blush-500 transition-colors duration-breath">Self-Compassion</h4>
                      <p className="text-sm text-charcoal-600 leading-comfortable font-ground opacity-80">How can I offer myself kindness?</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Gentle Sacred Affirmation - When Writing */}
        {journalText.trim() && (
          <div className="flex justify-center mb-16">
            <div className="bg-sanctuary-glass backdrop-blur-xl rounded-caress px-6 py-4 border border-sage-400/20 shadow-gentle">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-sage-400 rounded-full animate-sacred-pulse" />
                  <span className="text-base text-charcoal-600 font-ground">
                    {wordCount} {wordCount === 1 ? 'word' : 'words'} held in sacred trust
                  </span>
                </div>
                <div className="w-px h-4 bg-sage-400/20"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-sage-400/10 rounded-full flex items-center justify-center">
                    <span className="text-sage-400 text-xs">🪲</span>
                  </div>
                  <span className="text-sm text-charcoal-600 font-ground opacity-80">Khepera honors your courage</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Khepera's Protective Sacred Promise */}
        <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl border border-sage-400/20 shadow-2xl overflow-hidden">
          {/* Gentle protective background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sage-400/5 via-transparent to-blush-300/3 pointer-events-none"></div>
          
          <div className="relative text-center py-16 px-10">
            <div className="w-20 h-20 bg-gradient-to-br from-sage-400/15 to-sage-400/25 rounded-infinite flex items-center justify-center mx-auto mb-8 shadow-gentle animate-gentle-breathe">
              <Shield className="w-8 h-8 text-sage-400" />
            </div>
            
            <h3 className="text-2xlarge font-breath text-charcoal-800 mb-6 leading-snug">
              Your Sacred Sanctuary Promise
            </h3>
            
            <p className="text-large text-charcoal-700 font-ground mb-10 max-w-2xl mx-auto leading-comfortable">
              Every word you write here is held in complete privacy and sacred trust. You are safe to express your deepest truths.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <button
                onClick={() => window.open('tel:988', '_self')}
                className="bg-sage-400 hover:bg-sage-500 text-sanctuary-white px-8 py-4 rounded-embrace text-base font-intention transition-all duration-breath shadow-blessing hover:shadow-temple min-h-touch-sanctuary flex items-center gap-3"
              >
                <Heart className="w-5 h-5" />
                Crisis Support: 988
              </button>
              
              <div className="text-charcoal-500 text-sm font-ground px-4">
                Available 24/7 • Free • Confidential
              </div>
            </div>
            
            <div className="bg-sanctuary-glass backdrop-blur-sm rounded-caress px-6 py-4 border border-sage-400/15 max-w-2xl mx-auto">
              <p className="text-charcoal-600 text-base leading-comfortable font-ground">
                ALCHM is a sacred space for personal reflection, not a substitute for professional mental health care. 
                <br className="hidden sm:block" />
                Ages 17+ • Your privacy is our highest priority
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Sacred Celebration Overlay - Enhanced */}
      {showCelebration && (
        <div className="fixed inset-0 bg-sanctuary-200/95 backdrop-blur-md flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-sacred-emergence">
            <div className="w-24 h-24 bg-gradient-to-br from-sage-400/20 to-sage-400/30 rounded-infinite flex items-center justify-center mx-auto mb-8 shadow-blessing animate-celebration-bloom">
              <PenTool className="w-10 h-10 text-sage-400 animate-gentle-pulse" />
            </div>
            <div className="bg-sanctuary-glass backdrop-blur-xl rounded-temple px-10 py-8 shadow-divine border border-sage-400/20 max-w-lg mx-auto">
              <p className="text-xlarge font-breath text-charcoal-800 leading-comfortable mb-3">
                {celebrationMessage}
              </p>
              <div className="flex items-center justify-center gap-2 opacity-75">
                <div className="w-4 h-4 bg-sage-400/10 rounded-full flex items-center justify-center">
                  <span className="text-sage-400 text-xs">🪲</span>
                </div>
                <span className="text-sm text-charcoal-600 font-ground">Khepera celebrates your courage</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Khepera Emotional Concierge */}
      <KheperaChat userId={user?.uid} />
    </div>
  );
}