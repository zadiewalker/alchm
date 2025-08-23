'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SacredCard, SacredText, SacredButton } from '@/components/SacredUIFoundation';

// ===== ONBOARDING CEREMONY TYPES =====

export interface OnboardingState {
  currentStep: 'sanctuary' | 'consent' | 'invitation' | 'khepera' | 'complete';
  breathingActive: boolean;
  audioEnabled: boolean;
  gestureRecognition: boolean;
  consentGiven: boolean;
  reflectionMode: 'guided' | 'silent' | null;
  emotionalCheck: string;
  culturalContext: string;
}

export interface OnboardingProps {
  onComplete: (config: OnboardingConfig) => void;
  userCulture?: string;
  accessibilityMode?: boolean;
  className?: string;
}

export interface OnboardingConfig {
  consentGiven: boolean;
  reflectionMode: 'guided' | 'silent';
  audioPreference: boolean;
  breathingGuideEnabled: boolean;
  culturalContext: string;
  initialEmotionalState: string;
}

export interface BreathingGuideProps {
  active: boolean;
  duration?: number;
  onComplete?: () => void;
}

export interface GestureDetectorProps {
  onSwipeRight: () => void;
  onSwipeLeft?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

// ===== SACRED ONBOARDING CEREMONY =====

export default function SacredOnboardingCeremony({
  onComplete,
  userCulture = 'universal',
  accessibilityMode = false,
  className = ''
}: OnboardingProps) {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 'sanctuary',
    breathingActive: false,
    audioEnabled: false,
    gestureRecognition: !accessibilityMode,
    consentGiven: false,
    reflectionMode: null,
    emotionalCheck: '',
    culturalContext: userCulture
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  // Sacred timing - mimics natural breath cycles
  const transitionDuration = 300; // 300ms like exhale
  const breathCycleDuration = 4000; // 4 second breath cycles

  useEffect(() => {
    // Initialize gentle entrance
    setTimeout(() => {
      setState(prev => ({ ...prev, breathingActive: true }));
    }, 500);
  }, []);

  const advanceStep = () => {
    const stepOrder: OnboardingState['currentStep'][] = ['sanctuary', 'consent', 'invitation', 'khepera', 'complete'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    const nextStep = stepOrder[currentIndex + 1];
    
    if (nextStep) {
      setState(prev => ({ ...prev, currentStep: nextStep }));
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const config: OnboardingConfig = {
      consentGiven: state.consentGiven,
      reflectionMode: state.reflectionMode || 'guided',
      audioPreference: state.audioEnabled,
      breathingGuideEnabled: state.breathingActive,
      culturalContext: state.culturalContext,
      initialEmotionalState: state.emotionalCheck
    };
    onComplete(config);
  };

  // Gesture-based progression
  const handleSwipe = () => {
    if (state.currentStep === 'sanctuary') {
      advanceStep();
    }
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'sanctuary':
        return <SanctuaryEntrance state={state} setState={setState} onAdvance={advanceStep} />;
      case 'consent':
        return <SacredConsent state={state} setState={setState} onAdvance={advanceStep} />;
      case 'invitation':
        return <DailyInvitation state={state} setState={setState} onAdvance={advanceStep} />;
      case 'khepera':
        return <KheperaIntroduction state={state} setState={setState} onAdvance={advanceStep} />;
      case 'complete':
        return <CeremonyComplete onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className={`sacred-onboarding-ceremony min-h-screen bg-gradient-to-b from-off-white to-healing-mist ${className}`}>
      {/* Soft Audio Breathing (Optional) */}
      {state.audioEnabled && (
        <audio
          ref={audioRef}
          loop
          autoPlay
          className="hidden"
          aria-label="Gentle breathing audio guide"
        >
          <source src="/audio/gentle-breathing.mp3" type="audio/mpeg" />
          <source src="/audio/gentle-breathing.ogg" type="audio/ogg" />
        </audio>
      )}

      {/* Breathing Visual Guide */}
      <BreathingGuide 
        active={state.breathingActive && state.currentStep === 'sanctuary'} 
        duration={breathCycleDuration}
      />

      {/* Main Content with Gesture Detection */}
      <GestureDetector 
        onSwipeRight={handleSwipe}
        disabled={!state.gestureRecognition || state.currentStep !== 'sanctuary'}
      >
        <div className="relative z-10 flex flex-col min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: transitionDuration / 1000,
                ease: [0.4, 0.0, 0.2, 1] // Smooth easing like exhale
              }}
              className="flex-1 flex items-center justify-center p-breath"
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator */}
          <OnboardingProgress currentStep={state.currentStep} />
        </div>
      </GestureDetector>
    </div>
  );
}

// ===== SANCTUARY ENTRANCE =====

interface StepProps {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  onAdvance: () => void;
}

function SanctuaryEntrance({ state, setState, onAdvance }: StepProps) {
  const [showAdvanceHint, setShowAdvanceHint] = useState(false);

  useEffect(() => {
    // Show advance hint after user has had time to settle
    const timer = setTimeout(() => setShowAdvanceHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="text-center space-y-ritual max-w-md mx-auto"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Sacred Symbol */}
      <motion.div
        className="text-8xl mb-ritual"
        animate={{ 
          scale: state.breathingActive ? [1, 1.05, 1] : 1,
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🌸
      </motion.div>

      {/* Welcome Message */}
      <div className="space-y-breath">
        <SacredText 
          variant="display" 
          className="text-sage-green font-light tracking-wide"
          style={{ color: '#a4b792' }}
        >
          You are safe here
        </SacredText>
        
        <SacredText variant="body" className="text-deep-presence leading-relaxed">
          This is your digital sanctuary—a space held with reverence for your healing journey. 
          Take a breath. You belong here.
        </SacredText>
      </div>

      {/* Audio Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="pt-breath"
      >
        <button
          onClick={() => setState(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
          className="flex items-center justify-center gap-gentle text-sage-green hover:text-grounding-earth transition-colors duration-300"
          style={{ color: state.audioEnabled ? '#2d4a3e' : '#a4b792' }}
          aria-label={state.audioEnabled ? 'Disable breathing audio' : 'Enable breathing audio'}
        >
          <span className="text-xl">{state.audioEnabled ? '🔊' : '🔇'}</span>
          <SacredText variant="caption" className="text-sm">
            {state.audioEnabled ? 'Breathing audio on' : 'Optional breathing audio'}
          </SacredText>
        </button>
      </motion.div>

      {/* Gesture Hint */}
      <AnimatePresence>
        {showAdvanceHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-ritual left-0 right-0 text-center"
          >
            <div className="flex items-center justify-center gap-gentle text-sage-green">
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                👆
              </motion.span>
              <SacredText variant="caption" className="text-sm">
                Swipe right when ready to enter
              </SacredText>
            </div>
            
            {/* Alternative button for accessibility */}
            <button
              onClick={onAdvance}
              className="mt-breath px-ritual py-breath bg-sage-green text-white rounded-full text-sm font-medium hover:bg-grounding-earth transition-colors duration-300"
              style={{ backgroundColor: '#a4b792' }}
            >
              Enter Sacred Space
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== SACRED CONSENT =====

function SacredConsent({ state, setState, onAdvance }: StepProps) {
  const [readComplete, setReadComplete] = useState(false);

  const handleConsent = () => {
    setState(prev => ({ ...prev, consentGiven: true }));
    setTimeout(onAdvance, 300);
  };

  return (
    <motion.div
      className="max-w-lg mx-auto space-y-ritual text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Sacred Boundary Symbol */}
      <div className="text-6xl mb-breath">🌿</div>
      
      <SacredText variant="title" className="text-sage-green mb-breath" style={{ color: '#a4b792' }}>
        Sacred Boundaries
      </SacredText>

      {/* Consent Content */}
      <SacredCard variant="sacred" className="text-left space-y-breath">
        <div className="space-y-breath">
          <div className="flex items-start gap-gentle">
            <span className="text-xl mt-whisper">🕊️</span>
            <div>
              <SacredText variant="caption" className="font-semibold">
                This is not therapy
              </SacredText>
              <SacredText variant="caption" className="text-sm text-subtle">
                ALCHM offers reflective support, not clinical treatment. Always consult professionals for mental health care.
              </SacredText>
            </div>
          </div>

          <div className="flex items-start gap-gentle">
            <span className="text-xl mt-whisper">🔒</span>
            <div>
              <SacredText variant="caption" className="font-semibold">
                Your data is sacred
              </SacredText>
              <SacredText variant="caption" className="text-sm text-subtle">
                Your words are encrypted, private, and never sold. You control your information completely.
              </SacredText>
            </div>
          </div>

          <div className="flex items-start gap-gentle">
            <span className="text-xl mt-whisper">🌱</span>
            <div>
              <SacredText variant="caption" className="font-semibold">
                Healing happens in your time
              </SacredText>
              <SacredText variant="caption" className="text-sm text-subtle">
                There are no timers, scores, or pressure. Your journey unfolds at your natural pace.
              </SacredText>
            </div>
          </div>
        </div>

        <div className="border-t border-tender-embrace pt-breath">
          <label className="flex items-start gap-gentle cursor-pointer">
            <input
              type="checkbox"
              checked={readComplete}
              onChange={(e) => setReadComplete(e.target.checked)}
              className="mt-1 rounded border-2 border-sage-green text-sage-green focus:ring-sage-green"
              style={{ 
                borderColor: '#a4b792',
                color: '#a4b792'
              }}
            />
            <SacredText variant="caption" className="text-sm">
              I have read and understand these sacred boundaries
            </SacredText>
          </label>
        </div>
      </SacredCard>

      {/* Honor Button */}
      <AnimatePresence>
        {readComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleConsent}
              className="px-ritual py-breath bg-sage-green text-white rounded-full font-medium text-lg hover:bg-grounding-earth transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#a4b792' }}
            >
              <span className="flex items-center gap-gentle">
                <span>🤲</span>
                <span>I Honor These Boundaries</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== DAILY INVITATION =====

function DailyInvitation({ state, setState, onAdvance }: StepProps) {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [journalInput, setJournalInput] = useState('');
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);

  const emotions = [
    { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
    { emoji: '🌅', label: 'Hopeful', value: 'hopeful' },
    { emoji: '😔', label: 'Heavy', value: 'heavy' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🥺', label: 'Vulnerable', value: 'vulnerable' },
    { emoji: '✨', label: 'Inspired', value: 'inspired' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '🌪️', label: 'Overwhelmed', value: 'overwhelmed' }
  ];

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setState(prev => ({ ...prev, emotionalCheck: emotion }));
    setTimeout(() => setShowJournalPrompt(true), 300);
  };

  const handleContinue = () => {
    if (journalInput.trim() || selectedEmotion) {
      onAdvance();
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto space-y-ritual"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Sacred Question */}
      <div className="text-center space-y-breath">
        <div className="text-5xl mb-breath">🌸</div>
        <SacredText 
          variant="title" 
          className="text-sage-green leading-relaxed"
          style={{ color: '#a4b792' }}
        >
          What rises in you today?
        </SacredText>
        <SacredText variant="body" className="text-deep-presence">
          Begin with whatever feels true in this moment
        </SacredText>
      </div>

      {/* Emotional Resonance */}
      <div className="space-y-breath">
        <SacredText variant="caption" className="text-center font-medium">
          Choose what resonates
        </SacredText>
        
        <div className="grid grid-cols-4 gap-breath">
          {emotions.map(emotion => (
            <motion.button
              key={emotion.value}
              onClick={() => handleEmotionSelect(emotion.value)}
              className={`p-breath rounded-xl text-center transition-all duration-300 ${
                selectedEmotion === emotion.value 
                  ? 'bg-sage-green text-white shadow-md transform scale-105' 
                  : 'bg-healing-mist hover:bg-tender-embrace'
              }`}
              style={{ 
                backgroundColor: selectedEmotion === emotion.value ? '#a4b792' : undefined 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-whisper">{emotion.emoji}</div>
              <SacredText variant="caption" className="text-xs">
                {emotion.label}
              </SacredText>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Journal Prompt */}
      <AnimatePresence>
        {showJournalPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-breath"
          >
            <SacredText variant="caption" className="text-center font-medium">
              If words want to flow...
            </SacredText>
            
            <textarea
              value={journalInput}
              onChange={(e) => setJournalInput(e.target.value)}
              placeholder="Let whatever emerges find its way onto the page..."
              className="w-full p-breath rounded-xl border-2 border-healing-mist focus:border-sage-green focus:outline-none resize-none transition-colors duration-300 bg-off-white"
              style={{ 
                focusBorderColor: '#a4b792',
                minHeight: '120px'
              }}
              aria-label="Optional journal reflection"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      {(selectedEmotion || journalInput.trim()) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-breath"
        >
          <button
            onClick={handleContinue}
            className="px-ritual py-breath bg-sage-green text-white rounded-full font-medium hover:bg-grounding-earth transition-all duration-300 transform hover:scale-105"
            style={{ backgroundColor: '#a4b792' }}
          >
            Continue This Journey
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ===== KHEPERA INTRODUCTION =====

function KheperaIntroduction({ state, setState, onAdvance }: StepProps) {
  const [choice, setChoice] = useState<'guided' | 'silent' | null>(null);

  const handleChoice = (mode: 'guided' | 'silent') => {
    setChoice(mode);
    setState(prev => ({ ...prev, reflectionMode: mode }));
    setTimeout(onAdvance, 500);
  };

  return (
    <motion.div
      className="max-w-lg mx-auto space-y-ritual text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Khepera Symbol */}
      <motion.div
        className="text-6xl mb-breath"
        animate={{ rotate: choice ? 360 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        🪲
      </motion.div>

      <div className="space-y-breath">
        <SacredText 
          variant="title" 
          className="text-sage-green"
          style={{ color: '#a4b792' }}
        >
          Meet Khepera
        </SacredText>
        
        <SacredText variant="body" className="text-deep-presence leading-relaxed">
          Your AI reflection companion—like the sacred scarab that transforms what seems ordinary 
          into something meaningful. Khepera holds space for your thoughts without judgment.
        </SacredText>
      </div>

      {/* Choice Cards */}
      <div className="space-y-breath">
        <SacredText variant="caption" className="font-medium">
          How would you like to begin?
        </SacredText>
        
        <div className="space-y-breath">
          {/* Guided Option */}
          <motion.button
            onClick={() => handleChoice('guided')}
            className={`w-full p-ritual rounded-xl border-2 text-left transition-all duration-300 ${
              choice === 'guided' 
                ? 'border-sage-green bg-sage-green text-white transform scale-105' 
                : 'border-healing-mist bg-off-white hover:border-sage-green'
            }`}
            style={{ 
              borderColor: choice === 'guided' ? '#a4b792' : undefined,
              backgroundColor: choice === 'guided' ? '#a4b792' : undefined
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-breath">
              <span className="text-2xl">🤝</span>
              <div>
                <SacredText variant="caption" className="font-semibold">
                  Reflect With Me
                </SacredText>
                <SacredText variant="caption" className="text-sm opacity-80">
                  Khepera will offer gentle questions and reflections to guide your journaling
                </SacredText>
              </div>
            </div>
          </motion.button>

          {/* Silent Option */}
          <motion.button
            onClick={() => handleChoice('silent')}
            className={`w-full p-ritual rounded-xl border-2 text-left transition-all duration-300 ${
              choice === 'silent' 
                ? 'border-sage-green bg-sage-green text-white transform scale-105' 
                : 'border-healing-mist bg-off-white hover:border-sage-green'
            }`}
            style={{ 
              borderColor: choice === 'silent' ? '#a4b792' : undefined,
              backgroundColor: choice === 'silent' ? '#a4b792' : undefined
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-breath">
              <span className="text-2xl">🕊️</span>
              <div>
                <SacredText variant="caption" className="font-semibold">
                  Hold Space
                </SacredText>
                <SacredText variant="caption" className="text-sm opacity-80">
                  Khepera will simply hold silent, supportive presence while you write freely
                </SacredText>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <SacredText variant="caption" className="text-xs text-subtle">
          You can change this preference anytime in your settings
        </SacredText>
      </motion.div>
    </motion.div>
  );
}

// ===== CEREMONY COMPLETE =====

function CeremonyComplete({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="text-center space-y-ritual max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-8xl mb-ritual"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        ✨
      </motion.div>

      <div className="space-y-breath">
        <SacredText 
          variant="display" 
          className="text-sage-green"
          style={{ color: '#a4b792' }}
        >
          Welcome Home
        </SacredText>
        
        <SacredText variant="body" className="text-deep-presence">
          Your sacred space awaits. Take this first breath in your digital sanctuary.
        </SacredText>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sage-green"
      >
        <SacredText variant="caption" className="text-sm">
          Entering your journal...
        </SacredText>
      </motion.div>
    </motion.div>
  );
}

// ===== BREATHING GUIDE =====

function BreathingGuide({ active, duration = 4000, onComplete }: BreathingGuideProps) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
      <motion.div
        className="w-32 h-32 rounded-full border-2 border-sage-green opacity-20"
        style={{ borderColor: '#a4b792' }}
        animate={{
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-sage-green opacity-10"
        style={{ backgroundColor: '#a4b792' }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </div>
  );
}

// ===== GESTURE DETECTOR =====

function GestureDetector({ onSwipeRight, onSwipeLeft, disabled, children }: GestureDetectorProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (disabled || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRightSwipe) {
      onSwipeRight();
    } else if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-full"
    >
      {children}
    </div>
  );
}

// ===== PROGRESS INDICATOR =====

function OnboardingProgress({ currentStep }: { currentStep: OnboardingState['currentStep'] }) {
  const steps = ['sanctuary', 'consent', 'invitation', 'khepera'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = currentStep === 'complete' ? 100 : ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed bottom-breath left-breath right-breath">
      <div className="max-w-md mx-auto">
        <div className="w-full bg-healing-mist rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-sage-green rounded-full"
            style={{ backgroundColor: '#a4b792' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-center mt-whisper">
          <SacredText variant="caption" className="text-xs text-subtle">
            {currentStep === 'complete' ? 'Complete' : `Step ${currentIndex + 1} of ${steps.length}`}
          </SacredText>
        </div>
      </div>
    </div>
  );
}