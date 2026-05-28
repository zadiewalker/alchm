'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type UserCulturalPreferences = {
  spiritualInclusivity: boolean;
  familyInvolvement: boolean;
  traditionalHealing: boolean;
  communicationTone: 'formal' | 'informal' | 'spiritual' | 'clinical';
  traumaSensitivity: 'gentle' | 'direct' | 'empowering';
  culturalBackground: string[];
};

type LocaleContextType = {
  locale: string;
  localeConfig: { code: string };
  direction: 'ltr' | 'rtl';
  culturalAdaptation: { familyInvolvementLevel: 'low' | 'moderate' };
  userPreferences: UserCulturalPreferences;
  setLocale: (locale: string) => void;
  setUserPreferences: (preferences: Partial<UserCulturalPreferences>) => void;
  availableLocales: string[];
  t: (key: string, options?: { fallback?: string }) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (time: Date) => string;
  isRTL: boolean;
  requiresCloseIcon: boolean;
  prefersIndirectCommunication: boolean;
  emphasizesCommunity: boolean;
  integatesSpituality: boolean;
};

const DEFAULT_PREFERENCES: UserCulturalPreferences = {
  spiritualInclusivity: false,
  familyInvolvement: false,
  traditionalHealing: false,
  communicationTone: 'informal',
  traumaSensitivity: 'gentle',
  culturalBackground: [],
};

const AVAILABLE_LOCALES = ['en-US'];

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale?: string;
  initialPreferences?: Partial<UserCulturalPreferences>;
}

export function LocaleProvider({
  children,
  defaultLocale = 'en-US',
  initialPreferences = {},
}: LocaleProviderProps) {
  const [locale, setLocale] = useState(defaultLocale);
  const [userPreferences, setUserPreferencesState] = useState<UserCulturalPreferences>({
    ...DEFAULT_PREFERENCES,
    ...initialPreferences,
  });

  const value = useMemo<LocaleContextType>(() => ({
    locale,
    localeConfig: { code: locale },
    direction: 'ltr',
    culturalAdaptation: { familyInvolvementLevel: 'low' },
    userPreferences,
    setLocale,
    setUserPreferences: (preferences) => {
      setUserPreferencesState((current) => ({ ...current, ...preferences }));
    },
    availableLocales: AVAILABLE_LOCALES,
    t: (key, options) => options?.fallback ?? key,
    formatNumber: (number) => new Intl.NumberFormat(locale).format(number),
    formatCurrency: (amount) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount),
    formatDate: (date) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date),
    formatTime: (date) => new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(date),
    isRTL: false,
    requiresCloseIcon: true,
    prefersIndirectCommunication: true,
    emphasizesCommunity: false,
    integatesSpituality: userPreferences.spiritualInclusivity,
  }), [locale, userPreferences]);

  return (
    <LocaleContext.Provider value={value}>
      <div dir={value.direction} lang={locale}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export default LocaleProvider;
