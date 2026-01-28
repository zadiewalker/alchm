/**
 * Locale Provider Component
 * 
 * Provides comprehensive internationalization context with cultural adaptation,
 * RTL support, and trauma-informed language preferences
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getCulturalTranslation,
  getTextDirection,
  formatNumber,
  formatCurrency,
  formatDate,
  formatTime,
  detectUserLocale,
  getAvailableLocales
} from '../../lib/globalization/i18n';
import { getLocaleConfig, type LocaleConfig } from '../../lib/globalization/index';
import { getCulturalAdaptation, type CulturalAdaptation } from '../../lib/globalization/culturalAdaptation';

interface UserCulturalPreferences {
  spiritualInclusivity: boolean;
  familyInvolvement: boolean;
  traditionalHealing: boolean;
  communicationTone: 'formal' | 'informal' | 'spiritual' | 'clinical';
  traumaSensitivity: 'gentle' | 'direct' | 'empowering';
  culturalBackground: string[];
}

interface LocaleContextType {
  // Current locale state
  locale: string;
  localeConfig: LocaleConfig;
  direction: 'ltr' | 'rtl';
  culturalAdaptation: CulturalAdaptation;
  userPreferences: UserCulturalPreferences;
  
  // Locale management
  setLocale: (locale: string) => void;
  setUserPreferences: (preferences: Partial<UserCulturalPreferences>) => void;
  availableLocales: string[];
  
  // Translation functions
  t: (key: string, options?: {
    culturalContext?: string;
    tone?: 'formal' | 'informal' | 'spiritual' | 'clinical';
    traumaSensitive?: 'gentle' | 'direct' | 'empowering';
    fallback?: string;
  }) => string;
  
  // Formatting functions
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (time: Date) => string;
  
  // Cultural helpers
  isRTL: boolean;
  requiresCloseIcon: boolean; // Some cultures prefer different close button styles
  prefersIndirectCommunication: boolean;
  emphasizesCommunity: boolean;
  integatesSpituality: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  defaultLocale?: string;
  initialPreferences?: Partial<UserCulturalPreferences>;
}

export function LocaleProvider({ 
  children, 
  defaultLocale,
  initialPreferences = {} 
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<string>(
    defaultLocale || detectUserLocale()
  );
  
  const [userPreferences, setUserPreferencesState] = useState<UserCulturalPreferences>({
    spiritualInclusivity: false,
    familyInvolvement: false,
    traditionalHealing: false,
    communicationTone: 'informal',
    traumaSensitivity: 'gentle',
    culturalBackground: [],
    ...initialPreferences
  });

  const localeConfig = getLocaleConfig(locale);
  const direction = getTextDirection(locale);
  const culturalAdaptation = getCulturalAdaptation(locale);
  const availableLocales = getAvailableLocales();

  // Persist locale and preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm_locale', locale);
      localStorage.setItem('alchm_cultural_preferences', JSON.stringify(userPreferences));
    }
  }, [locale, userPreferences]);

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('alchm_locale');
      const savedPreferences = localStorage.getItem('alchm_cultural_preferences');
      
      if (savedLocale && availableLocales.includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
      
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setUserPreferencesState(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.warn('Failed to parse saved cultural preferences');
        }
      }
    }
  }, [availableLocales]);

  // Apply RTL styling to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = locale.split('-')[0];
    }
  }, [direction, locale]);

  const setLocale = (newLocale: string) => {
    if (availableLocales.includes(newLocale)) {
      setLocaleState(newLocale);
    }
  };

  const setUserPreferences = (preferences: Partial<UserCulturalPreferences>) => {
    setUserPreferencesState(prev => ({ ...prev, ...preferences }));
  };

  const t = (key: string, options: {
    culturalContext?: string;
    tone?: 'formal' | 'informal' | 'spiritual' | 'clinical';
    traumaSensitive?: 'gentle' | 'direct' | 'empowering';
    fallback?: string;
  } = {}) => {
    // Determine cultural context from user preferences and locale
    let culturalContext = options.culturalContext;
    if (!culturalContext && userPreferences.familyInvolvement && 
        localeConfig.culturalContext.familyStructure === 'extended') {
      culturalContext = 'family_centered';
    }
    if (!culturalContext && userPreferences.spiritualInclusivity) {
      culturalContext = 'spiritual';
    }
    if (!culturalContext && localeConfig.culturalContext.culturalValues.collectivism > 60) {
      culturalContext = 'collectivist';
    }

    return getCulturalTranslation(key, locale, {
      culturalContext,
      tone: options.tone || userPreferences.communicationTone,
      traumaSensitive: options.traumaSensitive || userPreferences.traumaSensitivity,
      fallback: options.fallback
    });
  };

  // Cultural behavior helpers
  const isRTL = direction === 'rtl';
  const requiresCloseIcon = !['ar-SA', 'he-IL', 'fa-IR'].includes(locale); // Some cultures prefer different UI patterns
  const prefersIndirectCommunication = localeConfig.culturalContext.communicationStyle === 'indirect';
  const emphasizesCommunity = localeConfig.culturalContext.culturalValues.collectivism > 60;
  const integatesSpituality = userPreferences.spiritualInclusivity && 
                              localeConfig.culturalContext.spiritualConsiderations.length > 0;

  const contextValue: LocaleContextType = {
    // State
    locale,
    localeConfig,
    direction,
    culturalAdaptation,
    userPreferences,
    
    // Functions
    setLocale,
    setUserPreferences,
    availableLocales,
    
    // Translation
    t,
    
    // Formatting
    formatNumber: (number: number) => formatNumber(number, locale),
    formatCurrency: (amount: number) => formatCurrency(amount, locale),
    formatDate: (date: Date) => formatDate(date, locale),
    formatTime: (time: Date) => formatTime(time, locale),
    
    // Cultural helpers
    isRTL,
    requiresCloseIcon,
    prefersIndirectCommunication,
    emphasizesCommunity,
    integatesSpituality
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      <div 
        className={`locale-provider ${isRTL ? 'rtl' : 'ltr'}`}
        dir={direction}
        lang={locale}
        data-cultural-context={culturalAdaptation.familyInvolvementLevel}
        data-trauma-sensitivity={userPreferences.traumaSensitivity}
      >
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

/**
 * Hook to access locale context
 */
export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

/**
 * Hook for quick translation access
 */
export function useTranslation() {
  const { t } = useLocale();
  return { t };
}

/**
 * Hook for cultural adaptation helpers
 */
export function useCulturalAdaptation() {
  const { 
    culturalAdaptation, 
    prefersIndirectCommunication, 
    emphasizesCommunity, 
    integatesSpituality,
    userPreferences,
    localeConfig
  } = useLocale();
  
  return {
    culturalAdaptation,
    prefersIndirectCommunication,
    emphasizesCommunity,
    integatesSpituality,
    userPreferences,
    culturalContext: localeConfig.culturalContext,
    
    // Helper functions for cultural adaptations
    getPromptStyle: () => {
      if (prefersIndirectCommunication) return 'gentle_inquiry';
      if (emphasizesCommunity) return 'community_focused';
      if (integatesSpituality) return 'spiritually_aware';
      return 'direct_supportive';
    },
    
    shouldIncludeFamily: () => {
      return userPreferences.familyInvolvement || 
             culturalAdaptation.familyInvolvementLevel !== 'individual';
    },
    
    getHealingMetaphors: () => culturalAdaptation.healingMetaphors,
    
    getTimeFramework: () => culturalAdaptation.timeFramework,
    
    getPreferredTherapeuticApproaches: () => culturalAdaptation.therapeuticApproaches
  };
}

/**
 * Component for easy cultural translation
 */
interface TCProps {
  k: string; // key
  culturalContext?: string;
  tone?: 'formal' | 'informal' | 'spiritual' | 'clinical';
  traumaSensitive?: 'gentle' | 'direct' | 'empowering';
  fallback?: string;
  children?: never;
}

export function TC({ k, culturalContext, tone, traumaSensitive, fallback }: TCProps) {
  const { t } = useTranslation();
  return <>{t(k, { culturalContext, tone, traumaSensitive, fallback })}</>;
}

export default LocaleProvider;