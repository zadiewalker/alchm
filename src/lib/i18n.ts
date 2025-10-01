// ALCHM Internationalization Configuration
// Universal Language Support for Digital Sanctuary

export const SUPPORTED_LOCALES = [
  'en', // English (default)
  'es', // Spanish
  'pt', // Portuguese 
  'ko', // Korean
  'hi', // Hindi
  'de', // German
  // Advanced locales (planned for future release)
  // 'sw', // Swahili
  // 'ar', // Arabic
  // 'zh', // Chinese (Simplified)
  // 'fr', // French
  // 'yo', // Yoruba
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

// Locale configurations with cultural context
export const LOCALE_CONFIG = {
  en: {
    name: 'English',
    nativeName: 'English',
    region: 'Global',
    rtl: false,
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    currency: 'USD',
    culturalContext: 'individualistic'
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Americas, Spain',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'EUR',
    culturalContext: 'family_oriented'
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Brazil, Portugal',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'BRL',
    culturalContext: 'community_focused'
  },
  sw: {
    name: 'Swahili',
    nativeName: 'Kiswahili',
    region: 'East Africa',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'KES',
    culturalContext: 'ubuntu_philosophy'
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Middle East, North Africa',
    rtl: true,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'SAR',
    culturalContext: 'honor_respect'
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'India',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'INR',
    culturalContext: 'dharmic_values'
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    region: 'China',
    rtl: false,
    dateFormat: 'yyyy/MM/dd',
    timeFormat: '24h',
    currency: 'CNY',
    culturalContext: 'harmony_balance'
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    region: 'France, Francophone Africa',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'EUR',
    culturalContext: 'intellectual_discourse'
  },
  yo: {
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    region: 'Nigeria, West Africa',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    currency: 'NGN',
    culturalContext: 'ancestral_wisdom'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    region: 'Korea',
    rtl: false,
    dateFormat: 'yyyy.MM.dd',
    timeFormat: '24h',
    currency: 'KRW',
    culturalContext: 'hierarchical_respect'
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany, Austria, Switzerland',
    rtl: false,
    dateFormat: 'dd.MM.yyyy',
    timeFormat: '24h',
    currency: 'EUR',
    culturalContext: 'precision_directness'
  }
} as const;

// Translation loading utilities with error handling
export async function loadTranslations(locale: SupportedLocale) {
  try {
    // For initial launch, use English as base
    if (locale === 'en') {
      return {
        common: {
          welcome: 'Welcome to ALCHM',
          loading: 'Loading...',
          error: 'Something went wrong',
          retry: 'Try again'
        },
        navigation: {
          home: 'Home',
          journal: 'Journal',
          dashboard: 'Dashboard',
          pricing: 'Pricing'
        }
      };
    }
    
    // For other locales, return basic fallback
    return {
      common: {
        welcome: 'Welcome to ALCHM',
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Try again'
      },
      navigation: {
        home: 'Home',
        journal: 'Journal', 
        dashboard: 'Dashboard',
        pricing: 'Pricing'
      }
    };
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}, using fallback`);
    return {
      common: {
        welcome: 'Welcome to ALCHM',
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Try again'
      },
      navigation: {
        home: 'Home',
        journal: 'Journal',
        dashboard: 'Dashboard', 
        pricing: 'Pricing'
      }
    };
  }
}

// Locale detection from headers
export function detectLocaleFromHeader(acceptLanguage: string): SupportedLocale {
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())
    .map(lang => lang.split('-')[0]);

  for (const preferred of preferredLanguages) {
    if (SUPPORTED_LOCALES.includes(preferred as SupportedLocale)) {
      return preferred as SupportedLocale;
    }
  }

  return DEFAULT_LOCALE;
}

// URL locale utilities
export function getLocaleFromPath(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/');
  const possibleLocale = segments[1];
  
  if (SUPPORTED_LOCALES.includes(possibleLocale as SupportedLocale)) {
    return possibleLocale as SupportedLocale;
  }
  
  return null;
}

export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (locale) {
    return pathname.replace(`/${locale}`, '') || '/';
  }
  return pathname;
}

export function addLocaleToPath(pathname: string, locale: SupportedLocale): string {
  // Remove existing locale if present
  const cleanPath = removeLocaleFromPath(pathname);
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

// Cultural adaptation helpers
export function getCulturalGreeting(locale: SupportedLocale): string {
  const greetings = {
    en: 'Welcome home',
    es: 'Bienvenido a casa',
    pt: 'Bem-vindo ao lar',
    sw: 'Karibu nyumbani',
    ar: 'أهلاً وسهلاً بك في البيت',
    hi: 'घर में आपका स्वागत है',
    zh: '欢迎回家',
    fr: 'Bienvenue à la maison',
    yo: 'Káàbọ̀ sí ilé',
    ko: '집에 오신 것을 환영합니다',
    de: 'Willkommen zu Hause'
  };
  
  return greetings[locale] || greetings[DEFAULT_LOCALE];
}

export function getCulturalColorScheme(locale: SupportedLocale) {
  const colorSchemes = {
    en: { primary: '#6366f1', secondary: '#8b5cf6' }, // Indigo/Purple
    es: { primary: '#f59e0b', secondary: '#ef4444' }, // Amber/Red - warm, vibrant
    pt: { primary: '#10b981', secondary: '#059669' }, // Emerald - nature, growth
    sw: { primary: '#dc2626', secondary: '#b91c1c' }, // Red - earth, strength
    ar: { primary: '#7c3aed', secondary: '#6d28d9' }, // Violet - spiritual, royal
    hi: { primary: '#f97316', secondary: '#ea580c' }, // Orange - sacred, spiritual
    zh: { primary: '#dc2626', secondary: '#fbbf24' }, // Red/Gold - prosperity, luck
    fr: { primary: '#3b82f6', secondary: '#1d4ed8' }, // Blue - elegance, sophistication
    yo: { primary: '#84cc16', secondary: '#65a30d' }, // Green - nature, life
    ko: { primary: '#8b5cf6', secondary: '#7c3aed' }, // Purple - dignity, respect
    de: { primary: '#374151', secondary: '#4b5563' }, // Gray - precision, reliability
  };
  
  return colorSchemes[locale] || colorSchemes[DEFAULT_LOCALE];
}

// RTL support
export function isRTL(locale: SupportedLocale): boolean {
  return LOCALE_CONFIG[locale].rtl;
}

export function getTextDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}