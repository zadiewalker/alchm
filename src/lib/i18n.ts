// Internationalization Configuration and Utilities
import { createContext, useContext } from 'react';

// Supported languages and regions
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français', 
  de: 'Deutsch',
  pt: 'Português',
  ja: '日本語',
  zh: '中文',
  ar: 'العربية',
  hi: 'हिन्दी',
  ru: 'Русский'
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Cultural contexts for healing practices
export interface CulturalContext {
  language: SupportedLanguage;
  region: string;
  rtl: boolean; // Right-to-left text direction
  culturalValues: {
    collectivism: number; // 0-1, individualism vs collectivism
    spirituality: number; // 0-1, secular vs spiritual approach
    familyInvolvement: number; // 0-1, individual vs family-centered healing
    formalityLevel: number; // 0-1, casual vs formal communication style
  };
  healingTraditions: string[];
  crisisResources: {
    hotlines: Array<{
      name: string;
      number: string;
      availability: string;
      languages: SupportedLanguage[];
    }>;
    organizations: Array<{
      name: string;
      website: string;
      description: string;
      regions: string[];
    }>;
  };
}

// Cultural contexts for different regions
export const CULTURAL_CONTEXTS: Record<string, CulturalContext> = {
  'en-US': {
    language: 'en',
    region: 'US',
    rtl: false,
    culturalValues: {
      collectivism: 0.3,
      spirituality: 0.4,
      familyInvolvement: 0.3,
      formalityLevel: 0.2
    },
    healingTraditions: ['cognitive-behavioral', 'mindfulness', 'positive-psychology', 'trauma-informed'],
    crisisResources: {
      hotlines: [
        {
          name: 'National Suicide Prevention Lifeline',
          number: '988',
          availability: '24/7',
          languages: ['en', 'es']
        },
        {
          name: 'Crisis Text Line',
          number: 'Text HOME to 741741',
          availability: '24/7',
          languages: ['en', 'es']
        }
      ],
      organizations: [
        {
          name: 'National Alliance on Mental Illness (NAMI)',
          website: 'https://nami.org',
          description: 'Provides support, education and advocacy for mental health',
          regions: ['US']
        }
      ]
    }
  },
  'es-ES': {
    language: 'es',
    region: 'ES',
    rtl: false,
    culturalValues: {
      collectivism: 0.6,
      spirituality: 0.5,
      familyInvolvement: 0.7,
      formalityLevel: 0.6
    },
    healingTraditions: ['family-therapy', 'spirituality-integrated', 'community-based', 'narrative-therapy'],
    crisisResources: {
      hotlines: [
        {
          name: 'Teléfono de la Esperanza',
          number: '717 003 717',
          availability: '24/7',
          languages: ['es']
        }
      ],
      organizations: [
        {
          name: 'Confederación Salud Mental España',
          website: 'https://consaludmental.org',
          description: 'Red estatal de organizaciones de salud mental',
          regions: ['ES']
        }
      ]
    }
  },
  'ja-JP': {
    language: 'ja',
    region: 'JP',
    rtl: false,
    culturalValues: {
      collectivism: 0.8,
      spirituality: 0.6,
      familyInvolvement: 0.6,
      formalityLevel: 0.9
    },
    healingTraditions: ['mindfulness', 'zen-meditation', 'forest-bathing', 'group-harmony', 'ikigai'],
    crisisResources: {
      hotlines: [
        {
          name: 'いのちの電話',
          number: '0570-783-556',
          availability: '24/7',
          languages: ['ja']
        }
      ],
      organizations: [
        {
          name: '全国精神保健福祉会連合会',
          website: 'https://seishinhoken.jp',
          description: '精神保健福祉に関する支援とアドボカシー',
          regions: ['JP']
        }
      ]
    }
  },
  'ar-SA': {
    language: 'ar',
    region: 'SA',
    rtl: true,
    culturalValues: {
      collectivism: 0.8,
      spirituality: 0.9,
      familyInvolvement: 0.8,
      formalityLevel: 0.7
    },
    healingTraditions: ['islamic-psychology', 'family-support', 'community-healing', 'spiritual-guidance'],
    crisisResources: {
      hotlines: [
        {
          name: 'خط المساعدة النفسية',
          number: '920033360',
          availability: '24/7',
          languages: ['ar']
        }
      ],
      organizations: [
        {
          name: 'الجمعية السعودية للطب النفسي',
          website: 'https://saudisnp.org.sa',
          description: 'دعم الصحة النفسية والتوعية المجتمعية',
          regions: ['SA', 'AE', 'KW']
        }
      ]
    }
  }
};

// Translation interface
export interface Translations {
  // Navigation and UI
  navigation: {
    dashboard: string;
    journal: string;
    insights: string;
    pathways: string;
    transformation: string;
    community: string;
    settings: string;
  };
  
  // Common actions
  actions: {
    save: string;
    cancel: string;
    continue: string;
    start: string;
    complete: string;
    edit: string;
    delete: string;
    share: string;
    export: string;
  };
  
  // Mental health specific terms
  mentalHealth: {
    mood: string;
    anxiety: string;
    depression: string;
    stress: string;
    wellbeing: string;
    mindfulness: string;
    meditation: string;
    gratitude: string;
    selfCare: string;
    healing: string;
    growth: string;
    transformation: string;
    resilience: string;
    breakthrough: string;
  };
  
  // Crisis support
  crisis: {
    emergencyNotice: string;
    immediateHelp: string;
    hotlineNumbers: string;
    safetyPlan: string;
    crisisResources: string;
    emergencyContacts: string;
  };
  
  // Cultural adaptations
  cultural: {
    healingApproach: string;
    communitySupport: string;
    familyInvolvement: string;
    spiritualPractices: string;
    traditionalWisdom: string;
  };
}

// Localization context
interface LocalizationContextType {
  language: SupportedLanguage;
  culturalContext: CulturalContext;
  translations: Translations;
  setLanguage: (lang: SupportedLanguage) => void;
  formatDate: (date: Date) => string;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number, currency: string) => string;
  getDirection: () => 'ltr' | 'rtl';
  getLocalizedCrisisResources: () => CulturalContext['crisisResources'];
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

// Translation keys management
export class TranslationManager {
  private translations: Map<SupportedLanguage, Translations> = new Map();
  private fallbackLanguage: SupportedLanguage = 'en';

  constructor() {
    this.loadTranslations();
  }

  private async loadTranslations() {
    // Load translation files dynamically
    for (const language of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      try {
        const translations = await import(`../locales/${language}.json`);
        this.translations.set(language, translations.default);
      } catch (error) {
        console.warn(`Failed to load translations for ${language}:`, error);
      }
    }
  }

  getTranslations(language: SupportedLanguage): Translations {
    return this.translations.get(language) || this.translations.get(this.fallbackLanguage) || {} as Translations;
  }

  translate(key: string, language: SupportedLanguage, params?: Record<string, string>): string {
    const translations = this.getTranslations(language);
    const value = this.getNestedValue(translations, key);
    
    if (!value) {
      console.warn(`Translation key not found: ${key} for language: ${language}`);
      return key;
    }

    // Simple parameter substitution
    if (params) {
      return Object.entries(params).reduce(
        (text, [param, replacement]) => text.replace(`{{${param}}}`, replacement),
        value
      );
    }

    return value;
  }

  private getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Cultural adaptation utilities
export class CulturalAdaptation {
  static adaptHealingPractice(practice: any, context: CulturalContext): any {
    const adapted = { ...practice };

    // Adapt based on cultural values
    if (context.culturalValues.collectivism > 0.6) {
      // Emphasize community and family aspects
      adapted.emphasis = 'community-focused';
      adapted.instructions = adapted.instructions?.map((instruction: string) =>
        instruction.replace(/\byou\b/g, 'you and your community')
      );
    }

    if (context.culturalValues.spirituality > 0.6) {
      // Include spiritual elements
      adapted.spiritualComponent = true;
      adapted.additionalPractices = [
        ...adapted.additionalPractices || [],
        'spiritual reflection',
        'prayer or meditation'
      ];
    }

    if (context.culturalValues.formalityLevel > 0.6) {
      // Use more formal language
      adapted.tone = 'formal';
      adapted.title = this.formalizeTitleBasedOnCulture(adapted.title, context);
    }

    return adapted;
  }

  static adaptCommunicationStyle(content: string, context: CulturalContext): string {
    let adapted = content;

    // Adjust formality
    if (context.culturalValues.formalityLevel > 0.6) {
      adapted = this.makeMoreFormal(adapted, context.language);
    }

    // Adjust for collectivism vs individualism
    if (context.culturalValues.collectivism > 0.6) {
      adapted = adapted.replace(/\bI\b/g, 'we');
      adapted = adapted.replace(/your personal/g, 'our collective');
    }

    return adapted;
  }

  static getCulturallyAppropriateEmojis(context: CulturalContext): Record<string, string> {
    // Some cultures may prefer different emoji sets or avoid certain symbols
    const baseEmojis = {
      meditation: '🧘',
      growth: '🌱',
      peace: '☮️',
      wisdom: '🦉',
      strength: '💪',
      heart: '❤️'
    };

    if (context.region === 'JP') {
      return {
        ...baseEmojis,
        growth: '🌸', // Cherry blossom more culturally relevant
        wisdom: '🏮', // Lantern symbolism
        peace: '⛩️'   // Torii gate for spiritual peace
      };
    }

    return baseEmojis;
  }

  private static formalizeTitleBasedOnCulture(title: string, context: CulturalContext): string {
    // Add appropriate honorifics based on culture
    if (context.language === 'ja') {
      return `${title}さん`; // Add -san honorific
    }
    if (context.language === 'ar') {
      return `${title} الكريم`; // Add "honorable" suffix
    }
    return title;
  }

  private static makeMoreFormal(text: string, language: SupportedLanguage): string {
    // Language-specific formality adjustments
    switch (language) {
      case 'es':
        return text.replace(/\btú\b/g, 'usted'); // Use formal "you"
      case 'de':
        return text.replace(/\bdu\b/g, 'Sie'); // Use formal "you"
      case 'fr':
        return text.replace(/\btu\b/g, 'vous'); // Use formal "you"
      default:
        return text;
    }
  }
}

// Utility functions for date/time formatting
export function formatDateForLocale(date: Date, language: SupportedLanguage, region: string): string {
  const locale = `${language}-${region}`;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatTimeForLocale(date: Date, language: SupportedLanguage, region: string): string {
  const locale = `${language}-${region}`;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatNumberForLocale(number: number, language: SupportedLanguage, region: string): string {
  const locale = `${language}-${region}`;
  return new Intl.NumberFormat(locale).format(number);
}

export function formatCurrencyForLocale(amount: number, currency: string, language: SupportedLanguage, region: string): string {
  const locale = `${language}-${region}`;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

// Language detection utilities
export function detectUserLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage;
    if (Object.keys(SUPPORTED_LANGUAGES).includes(browserLanguage)) {
      return browserLanguage;
    }
  }
  return 'en'; // Default fallback
}

export function detectUserRegion(): string {
  if (typeof window !== 'undefined') {
    const locale = navigator.language;
    const region = locale.split('-')[1];
    return region || 'US'; // Default to US
  }
  return 'US';
}

// RTL language support
export function isRTLLanguage(language: SupportedLanguage): boolean {
  return ['ar'].includes(language);
}

export function getTextDirection(language: SupportedLanguage): 'ltr' | 'rtl' {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
}

// Export singleton instances
export const translationManager = new TranslationManager();