'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { sacredMicrocopy, culturalAdaptations, type SacredMicrocopy, type CulturalMicrocopy } from '@/lib/sacred-microcopy';

// ===== SACRED MICROCOPY CONTEXT =====

export interface SacredMicrocopyContextType {
  copy: SacredMicrocopy;
  culturalContext: string;
  setCulturalContext: (context: string) => void;
  emotionalTone: 'grounding' | 'boundary' | 'vulnerability';
  setEmotionalTone: (tone: 'grounding' | 'boundary' | 'vulnerability') => void;
  getUserCopy: (path: string, fallback?: string) => string;
  getContextualCopy: (
    path: string, 
    context?: {
      culturalFramework?: string;
      emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
      timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
      userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
    },
    fallback?: string
  ) => string;
}

const SacredMicrocopyContext = createContext<SacredMicrocopyContextType | null>(null);

// ===== SACRED MICROCOPY PROVIDER =====

export interface SacredMicrocopyProviderProps {
  children: React.ReactNode;
  defaultCulturalContext?: string;
  defaultEmotionalTone?: 'grounding' | 'boundary' | 'vulnerability';
  userPreferences?: {
    culturalBackground?: string;
    traumaInformed?: boolean;
    languagePreference?: string;
    accessibilityNeeds?: string[];
  };
}

export function SacredMicrocopyProvider({
  children,
  defaultCulturalContext = 'universal',
  defaultEmotionalTone = 'grounding',
  userPreferences
}: SacredMicrocopyProviderProps) {
  const [culturalContext, setCulturalContext] = useState(defaultCulturalContext);
  const [emotionalTone, setEmotionalTone] = useState(defaultEmotionalTone);
  const [adaptedCopy, setAdaptedCopy] = useState<SacredMicrocopy>(sacredMicrocopy);

  // Update adapted copy when cultural context changes
  useEffect(() => {
    if (culturalContext && culturalAdaptations[culturalContext]) {
      setAdaptedCopy(mergeCulturalAdaptations(sacredMicrocopy, culturalAdaptations[culturalContext]));
    } else {
      setAdaptedCopy(sacredMicrocopy);
    }
  }, [culturalContext]);

  // Initialize cultural context from user preferences
  useEffect(() => {
    if (userPreferences?.culturalBackground) {
      setCulturalContext(userPreferences.culturalBackground);
    }
  }, [userPreferences]);

  const getUserCopy = (path: string, fallback: string = ''): string => {
    return getNestedProperty(adaptedCopy, path) || fallback;
  };

  const getContextualCopy = (
    path: string,
    context?: {
      culturalFramework?: string;
      emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
      timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
      userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
    },
    fallback: string = ''
  ): string => {
    let baseCopy = getNestedProperty(adaptedCopy, path) || fallback;
    
    // Apply contextual adaptations
    if (context) {
      baseCopy = applyContextualAdaptations(baseCopy, context);
    }
    
    return baseCopy;
  };

  const contextValue: SacredMicrocopyContextType = {
    copy: adaptedCopy,
    culturalContext,
    setCulturalContext,
    emotionalTone,
    setEmotionalTone,
    getUserCopy,
    getContextualCopy
  };

  return (
    <SacredMicrocopyContext.Provider value={contextValue}>
      {children}
    </SacredMicrocopyContext.Provider>
  );
}

// ===== SACRED MICROCOPY HOOKS =====

export function useSacredMicrocopy() {
  const context = useContext(SacredMicrocopyContext);
  if (!context) {
    throw new Error('useSacredMicrocopy must be used within a SacredMicrocopyProvider');
  }
  return context;
}

// Specialized hooks for specific UI patterns
export function useSacredButtons() {
  const { copy } = useSacredMicrocopy();
  return copy.buttons;
}

export function useSacredJournaling() {
  const { copy } = useSacredMicrocopy();
  return copy.journaling;
}

export function useSacredErrors() {
  const { copy } = useSacredMicrocopy();
  return copy.errors;
}

export function useSacredConfirmations() {
  const { copy } = useSacredMicrocopy();
  return copy.confirmations;
}

export function useSacredPrompts() {
  const { copy } = useSacredMicrocopy();
  return copy.prompts;
}

// ===== COMPONENT-LEVEL MICROCOPY HOOKS =====

export function useSacredButton(
  action: 'primary' | 'secondary' | 'vulnerable' | 'supportive',
  specificAction: string,
  context?: {
    culturalFramework?: string;
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
    userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
  }
) {
  const { getContextualCopy } = useSacredMicrocopy();
  
  const actionMap = {
    primary: 'primary_actions',
    secondary: 'secondary_actions',
    vulnerable: 'vulnerable_actions',
    supportive: 'supportive_actions'
  };
  
  const path = `buttons.${actionMap[action]}.${specificAction}`;
  return getContextualCopy(path, context, specificAction);
}

export function useSacredModal(
  modalType: 'headers' | 'body_text' | 'closing',
  specificModal: string,
  context?: {
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
    culturalFramework?: string;
  }
) {
  const { getContextualCopy } = useSacredMicrocopy();
  
  const path = `modals.${modalType}.${specificModal}`;
  return getContextualCopy(path, context, specificModal);
}

export function useSacredError(
  errorType: 'technical_blocks' | 'user_gentle_guidance' | 'emotional_support' | 'recovery_invitations',
  specificError: string,
  context?: {
    userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
  }
) {
  const { getContextualCopy } = useSacredMicrocopy();
  
  const path = `errors.${errorType}.${specificError}`;
  return getContextualCopy(path, context, 'Something unexpected happened. Let\'s try again.');
}

export function useSacredPrompt(
  promptType: 'daily_invitations' | 'emotional_check_ins' | 'reflection_starters' | 'cultural_prompts',
  specificPrompt: string,
  context?: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    culturalFramework?: string;
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
  }
) {
  const { getContextualCopy } = useSacredMicrocopy();
  
  const path = `prompts.${promptType}.${specificPrompt}`;
  return getContextualCopy(path, context, 'What wants to be witnessed today?');
}

// ===== TIME-AWARE MICROCOPY HOOK =====

export function useSacredTimeAware() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { copy } = useSacredMicrocopy();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const getContextualPrompt = (
    promptType: 'daily_invitations' | 'emotional_check_ins',
    fallback?: string
  ): string => {
    const timeOfDay = getTimeOfDay();
    const path = `prompts.${promptType}.${timeOfDay}`;
    return getNestedProperty(copy, path) || fallback || 'What wants to be witnessed right now?';
  };

  return {
    timeOfDay: getTimeOfDay(),
    getContextualPrompt,
    sacredTime: copy.time
  };
}

// ===== HELPER FUNCTIONS =====

function getNestedProperty(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function mergeCulturalAdaptations(
  baseCopy: SacredMicrocopy, 
  culturalOverrides: Partial<SacredMicrocopy>
): SacredMicrocopy {
  const merged = { ...baseCopy };
  
  Object.keys(culturalOverrides).forEach(key => {
    const baseSection = merged[key as keyof SacredMicrocopy];
    const overrideSection = culturalOverrides[key as keyof SacredMicrocopy];
    
    if (baseSection && overrideSection && typeof baseSection === 'object') {
      merged[key as keyof SacredMicrocopy] = {
        ...baseSection,
        ...overrideSection
      } as any;
    }
  });
  
  return merged;
}

function applyContextualAdaptations(
  baseCopy: string,
  context: {
    culturalFramework?: string;
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
  }
): string {
  let adaptedCopy = baseCopy;

  // Emotional state adaptations
  if (context.emotionalState === 'struggling') {
    // Add more gentle, supportive language
    adaptedCopy = adaptedCopy.replace(/\bTry\b/gi, 'Gently try');
    adaptedCopy = adaptedCopy.replace(/\bDo\b/gi, 'Softly do');
  } else if (context.emotionalState === 'celebrating') {
    // Add more joyful, expansive language
    adaptedCopy = adaptedCopy.replace(/\bcomplete\b/gi, 'celebrate');
    adaptedCopy = adaptedCopy.replace(/\bfinish\b/gi, 'honor');
  }

  // User journey stage adaptations
  if (context.userJourneyStage === 'newcomer') {
    // Add more guidance and reassurance
    if (!adaptedCopy.includes('first time') && !adaptedCopy.includes('beginning')) {
      adaptedCopy = adaptedCopy + ' (You\'re doing beautifully)';
    }
  }

  // Time-based adaptations
  if (context.timeOfDay === 'night') {
    adaptedCopy = adaptedCopy.replace(/\bbegin\b/gi, 'rest into');
    adaptedCopy = adaptedCopy.replace(/\bstart\b/gi, 'settle into');
  }

  return adaptedCopy;
}

// ===== SPECIALIZED COMPONENTS =====

export interface SacredButtonProps {
  action: 'primary' | 'secondary' | 'vulnerable' | 'supportive';
  specificAction: string;
  context?: {
    culturalFramework?: string;
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
    userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
  };
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SacredButton({
  action,
  specificAction,
  context,
  children,
  onClick,
  className = '',
  disabled = false
}: SacredButtonProps) {
  const buttonText = useSacredButton(action, specificAction, context);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`sacred-button intention-${action === 'primary' ? 'sacred' : action === 'vulnerable' ? 'grounding' : 'gentle'} ${className}`}
    >
      {children || buttonText}
    </button>
  );
}

export interface SacredErrorMessageProps {
  errorType: 'technical_blocks' | 'user_gentle_guidance' | 'emotional_support' | 'recovery_invitations';
  specificError: string;
  context?: {
    userJourneyStage?: 'newcomer' | 'regular' | 'deep_practitioner';
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
  };
  className?: string;
}

export function SacredErrorMessage({
  errorType,
  specificError,
  context,
  className = ''
}: SacredErrorMessageProps) {
  const errorText = useSacredError(errorType, specificError, context);

  return (
    <div className={`sacred-error-message state-interrupted ${className}`}>
      <div className="flex items-start gap-gentle">
        <span className="text-lg mt-whisper">🌿</span>
        <div>
          <p className="text-sm">{errorText}</p>
        </div>
      </div>
    </div>
  );
}

export interface SacredPromptDisplayProps {
  promptType: 'daily_invitations' | 'emotional_check_ins' | 'reflection_starters' | 'cultural_prompts';
  specificPrompt: string;
  context?: {
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    culturalFramework?: string;
    emotionalState?: 'reflecting' | 'celebrating' | 'struggling' | 'growing';
  };
  className?: string;
}

export function SacredPromptDisplay({
  promptType,
  specificPrompt,
  context,
  className = ''
}: SacredPromptDisplayProps) {
  const promptText = useSacredPrompt(promptType, specificPrompt, context);

  return (
    <div className={`sacred-prompt-display state-reflecting ${className}`}>
      <div className="text-center space-y-breath">
        <div className="text-2xl">💫</div>
        <p className="text-grounding font-presence leading-spacious">
          {promptText}
        </p>
      </div>
    </div>
  );
}