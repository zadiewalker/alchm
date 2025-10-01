'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressiveOnboardingFlow from '../onboarding/ProgressiveOnboardingFlow';
import { SanctuaryNavigation, SanctuaryPageHeader, QuickNavigation } from '../nav/SanctuaryNavigation';
import { IntelligentPromptSystem, QuickPromptSuggestion } from '../prompts/IntelligentPromptSystem';
import { SupportiveWritingEnvironment, WritingModeSelector } from '../writing/SupportiveWritingEnvironment';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

// Comprehensive guided experience that orchestrates all components
// Following Jony Ive's principle: "Simplicity is about subtracting the obvious, and adding the meaningful"

interface UserJourneyState {
  hasCompletedOnboarding: boolean;
  currentMode: 'onboarding' | 'dashboard' | 'writing' | 'prompts';
  userPreferences: UserPreferences;
  currentSession?: WritingSession;
}

interface UserPreferences {
  pace: 'gentle' | 'steady' | 'flexible';
  style: 'writing' | 'prompts' | 'creative';
  support: 'gentle' | 'structured' | 'adaptive';
  culturalBackground?: string[];
  mood?: string;
  energy?: string;
  timeAvailable?: string;
}

interface WritingSession {
  id: string;
  startTime: Date;
  prompt?: string;
  content: string;
  wordCount: number;
  timeSpent: number;
}

const SAMPLE_PROMPTS = [
  {
    id: 'daily-check-in',
    type: 'gentle' as const,
    category: 'reflection' as const,
    text: "How are you feeling as you enter this sacred space today?",
    traumaInformed: true,
    difficultyLevel: 1 as const,
    estimatedTime: "3-5 minutes",
    tags: ['check-in', 'present-moment']
  }
];

export default function ComprehensiveGuidedExperience() {
  const [journeyState, setJourneyState] = useState<UserJourneyState>({
    hasCompletedOnboarding: false,
    currentMode: 'onboarding',
    userPreferences: {
      pace: 'gentle',
      style: 'writing',
      support: 'gentle'
    }
  });

  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('alchm_onboarding_complete');
    const pausedStep = localStorage.getItem('alchm_onboarding_paused_step');
    
    if (onboardingComplete === 'true') {
      setJourneyState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
        currentMode: 'dashboard'
      }));
      setShowWelcomeBack(true);
      
      // Load user preferences
      const savedPreferences = localStorage.getItem('alchm_onboarding_data');
      if (savedPreferences) {
        try {
          const preferences = JSON.parse(savedPreferences);
          setJourneyState(prev => ({
            ...prev,
            userPreferences: { ...prev.userPreferences, ...preferences }
          }));
        } catch (error) {
          console.warn('Could not parse saved preferences:', error);
        }
      }
    } else if (pausedStep) {
      // Resume paused onboarding
      setJourneyState(prev => ({
        ...prev,
        currentMode: 'onboarding'
      }));
    }
  }, []);

  const handleOnboardingComplete = () => {
    setJourneyState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      currentMode: 'dashboard'
    }));
  };

  const handleWritingModeSelect = (mode: 'guided' | 'freeform' | 'voice' | 'creative') => {
    if (mode === 'guided') {
      setJourneyState(prev => ({ ...prev, currentMode: 'prompts' }));
    } else {
      setJourneyState(prev => ({ 
        ...prev, 
        currentMode: 'writing',
        currentSession: {
          id: crypto.randomUUID(),
          startTime: new Date(),
          content: '',
          wordCount: 0,
          timeSpent: 0
        }
      }));
    }
  };

  const handlePromptSelect = (prompt: any) => {
    setJourneyState(prev => ({
      ...prev,
      currentMode: 'writing',
      currentSession: {
        id: crypto.randomUUID(),
        startTime: new Date(),
        prompt: prompt.text,
        content: '',
        wordCount: 0,
        timeSpent: 0
      }
    }));
  };

  const handleWritingSessionSave = (session: WritingSession) => {
    // Save to local storage or send to backend
    const savedSessions = JSON.parse(localStorage.getItem('alchm_writing_sessions') || '[]');
    savedSessions.push(session);
    localStorage.setItem('alchm_writing_sessions', JSON.stringify(savedSessions));
    
    // Return to dashboard
    setJourneyState(prev => ({
      ...prev,
      currentMode: 'dashboard',
      currentSession: undefined
    }));
  };

  const handleWritingExit = () => {
    setJourneyState(prev => ({
      ...prev,
      currentMode: 'dashboard',
      currentSession: undefined
    }));
  };

  // Show onboarding flow for new users
  if (!journeyState.hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-sanctuary-white">
        <ProgressiveOnboardingFlow />
      </div>
    );
  }

  // Show writing environment
  if (journeyState.currentMode === 'writing' && journeyState.currentSession) {
    return (
      <SupportiveWritingEnvironment
        initialContent={journeyState.currentSession.content}
        prompt={journeyState.currentSession.prompt}
        onSave={handleWritingSessionSave}
        onExit={handleWritingExit}
      />
    );
  }

  // Main dashboard experience
  return (
    <div className="min-h-screen bg-sanctuary-white">
      {/* Navigation */}
      <SanctuaryNavigation />
      
      {/* Welcome Back Message */}
      <AnimatePresence>
        {showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-sage-50 border-b border-sage-100 py-4"
          >
            <div className="sanctuary-container">
              <div className="flex items-center justify-between">
                <p className="text-sage-700">
                  Welcome back to your sanctuary. Ready to continue your journey?
                </p>
                <button
                  onClick={() => setShowWelcomeBack(false)}
                  className="text-sage-500 hover:text-sage-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <SanctuaryPageHeader
        title="Your Digital Sanctuary"
        subtitle="A safe space for healing, growth, and authentic self-expression"
        icon="🕊️"
      />

      <div className="sanctuary-container space-y-8 pb-16">
        {/* Quick Prompt Suggestion */}
        <QuickPromptSuggestion
          userState={{
            mood: journeyState.userPreferences.mood,
            energy: journeyState.userPreferences.energy,
            timeAvailable: journeyState.userPreferences.timeAvailable
          }}
          onPromptSelect={handlePromptSelect}
        />

        {/* Writing Mode Selection */}
        <Card variant="sanctuary" className="p-6">
          <h2 className="text-2xl font-light text-sanctuary-gray-800 mb-4">
            How would you like to express yourself today?
          </h2>
          <WritingModeSelector onModeSelect={handleWritingModeSelect} />
        </Card>

        {/* Prompt Selection */}
        {journeyState.currentMode === 'prompts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-sanctuary-gray-800">
                Gentle Prompts for Reflection
              </h2>
              <Button
                onClick={() => setJourneyState(prev => ({ ...prev, currentMode: 'dashboard' }))}
                variant="ghost"
              >
                ← Back to sanctuary
              </Button>
            </div>
            
            <IntelligentPromptSystem
              userState={{
                mood: journeyState.userPreferences.mood,
                energy: journeyState.userPreferences.energy,
                timeAvailable: journeyState.userPreferences.timeAvailable,
                culturalBackground: journeyState.userPreferences.culturalBackground,
                preferredStyle: journeyState.userPreferences.style
              }}
              onPromptSelect={handlePromptSelect}
            />
          </motion.div>
        )}

        {/* Recent Sessions Overview (placeholder) */}
        <Card variant="gentle" className="p-6">
          <h3 className="text-lg font-medium text-sanctuary-gray-800 mb-4">
            Your Recent Reflections
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-sanctuary-white rounded-lg border border-sanctuary-gray-100">
                <div>
                  <p className="text-sm font-medium text-sanctuary-gray-800">
                    Reflection from {i} day{i > 1 ? 's' : ''} ago
                  </p>
                  <p className="text-xs text-sanctuary-gray-500">
                    {150 + i * 50} words • {5 + i * 2} minutes
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Growth Insights (placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <h4 className="font-medium text-sanctuary-gray-800 mb-2">Growth Streak</h4>
            <p className="text-2xl font-light text-sage-600">7 days</p>
          </Card>
          
          <Card variant="elevated" className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
              <span className="text-xl">✍️</span>
            </div>
            <h4 className="font-medium text-sanctuary-gray-800 mb-2">Words Written</h4>
            <p className="text-2xl font-light text-sage-600">2,340</p>
          </Card>
          
          <Card variant="elevated" className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <h4 className="font-medium text-sanctuary-gray-800 mb-2">Insights Gained</h4>
            <p className="text-2xl font-light text-sage-600">12</p>
          </Card>
        </div>
      </div>

      {/* Quick Navigation FAB */}
      <QuickNavigation />
    </div>
  );
}

// Utility component for smooth transitions between states
export function SanctuaryTransition({ 
  children, 
  isVisible = true 
}: { 
  children: React.ReactNode;
  isVisible?: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Crisis support integration
export function CrisisSafetyLayer({ children }: { children: React.ReactNode }) {
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  
  useEffect(() => {
    // Keywords that might indicate crisis
    const crisisKeywords = ['hurt myself', 'end it all', 'no point', 'give up', 'hopeless'];
    
    // Listen for potential crisis indicators
    const handleKeyDown = (e: KeyboardEvent) => {
      // Emergency shortcut: Shift + Alt + S for immediate support
      if (e.shiftKey && e.altKey && e.key === 'S') {
        setShowCrisisSupport(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {children}
      
      {/* Crisis support modal */}
      <AnimatePresence>
        {showCrisisSupport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-sanctuary-white rounded-2xl p-8 max-w-md mx-auto shadow-nurturing"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-amber/20 flex items-center justify-center">
                  <span className="text-2xl">🤗</span>
                </div>
                
                <h3 className="text-xl font-medium text-sanctuary-gray-800 mb-4">
                  You're not alone
                </h3>
                
                <p className="text-sanctuary-gray-600 mb-6 leading-relaxed">
                  If you're having thoughts of self-harm or suicide, please reach out for immediate support. 
                  Your life has value and help is available.
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => window.open('tel:988', '_self')}
                    className="w-full bg-warm-amber text-white hover:bg-warm-amber/90"
                  >
                    Call 988 - Suicide & Crisis Lifeline
                  </Button>
                  
                  <Button
                    onClick={() => window.open('sms:741741?body=HELLO', '_self')}
                    variant="secondary"
                    className="w-full"
                  >
                    Text HOME to 741741 - Crisis Text Line
                  </Button>
                  
                  <Button
                    onClick={() => setShowCrisisSupport(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    I'm okay right now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}