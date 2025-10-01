import { NextRequest } from 'next/server';

// ALCHM Supported Locales Configuration - App Store Launch
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

// Regional mappings for enhanced locale detection
const REGIONAL_MAPPINGS: Record<string, SupportedLocale> = {
  // English variants
  'en-us': 'en',
  'en-gb': 'en',
  'en-ca': 'en',
  'en-au': 'en',
  
  // Spanish variants
  'es-es': 'es',
  'es-mx': 'es',
  'es-ar': 'es',
  'es-co': 'es',
  'es-cl': 'es',
  
  // Portuguese variants
  'pt-br': 'pt',
  'pt-pt': 'pt',
  
  // Chinese variants (future support)
  // 'zh-cn': 'zh',
  // 'zh-tw': 'zh',
  // 'zh-sg': 'zh',
  
  // French variants (future support)
  // 'fr-fr': 'fr',
  // 'fr-ca': 'fr',
  // 'fr-be': 'fr',
  
  // German variants
  'de-de': 'de',
  'de-at': 'de',
  'de-ch': 'de',
  
  // Korean variants
  'ko-kr': 'ko',
  
  // Hindi variants
  'hi-in': 'hi',
  
  // Arabic variants (future support)
  // 'ar-sa': 'ar',
  // 'ar-ae': 'ar',
  // 'ar-eg': 'ar',
};

// Geographic IP to locale mapping (simplified)
const GEO_LOCALE_MAPPING: Record<string, SupportedLocale> = {
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en',
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'CO': 'es',
  'CL': 'es',
  'BR': 'pt',
  'PT': 'pt',
  // 'CN': 'zh', // Future support
  // 'TW': 'zh', // Future support  
  // 'SG': 'zh', // Future support
  // 'FR': 'fr', // Future support
  // 'BE': 'fr', // Future support
  'DE': 'de',
  'AT': 'de',
  'CH': 'de',
  'KR': 'ko',
  'IN': 'hi',
  // 'SA': 'ar', // Future support
  // 'AE': 'ar', // Future support
  // 'EG': 'ar', // Future support
  // 'NG': 'yo', // Nigeria - Yoruba (future support)
  // 'KE': 'sw', // Kenya - Swahili (future support)
  // 'TZ': 'sw', // Tanzania - Swahili (future support)
  // 'UG': 'sw', // Uganda - Swahili (future support)
};

// Crisis-aware locale detection - prioritizes understandable languages in emergencies
export function detectCrisisLocale(request: NextRequest): SupportedLocale {
  // In crisis situations, prioritize widely understood languages
  const crisisLanguages: SupportedLocale[] = ['en', 'es', 'hi', 'de', 'ko', 'pt'];
  
  const detectedLocale = detectLocale(request);
  
  // If detected locale is crisis-friendly, use it
  if (crisisLanguages.includes(detectedLocale)) {
    return detectedLocale;
  }
  
  // Otherwise, fall back to English for maximum accessibility
  return 'en';
}

// Enhanced locale detection with multiple fallback strategies
export function detectLocale(request: NextRequest): SupportedLocale {
  // Strategy 1: Check for existing locale cookie
  const localeCookie = request.cookies.get('alchm_locale')?.value;
  if (localeCookie && SUPPORTED_LOCALES.includes(localeCookie as SupportedLocale)) {
    return localeCookie as SupportedLocale;
  }
  
  // Strategy 2: Parse Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  if (acceptLanguage) {
    const preferredLocale = parseAcceptLanguage(acceptLanguage);
    if (preferredLocale) {
      return preferredLocale;
    }
  }
  
  // Strategy 3: Geographic IP detection (simplified)
  const country = request.headers.get('cf-ipcountry') || 
                 request.headers.get('x-vercel-ip-country') ||
                 request.headers.get('x-country-code');
  
  if (country && GEO_LOCALE_MAPPING[country.toUpperCase()]) {
    return GEO_LOCALE_MAPPING[country.toUpperCase()];
  }
  
  // Strategy 4: User-Agent analysis for mobile apps
  const userAgent = request.headers.get('user-agent') || '';
  const mobileLocale = detectMobileLocale(userAgent);
  if (mobileLocale) {
    return mobileLocale;
  }
  
  // Fallback to default
  return DEFAULT_LOCALE;
}

// Parse Accept-Language header with quality scoring
function parseAcceptLanguage(acceptLanguage: string): SupportedLocale | null {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const locale = parts[0].toLowerCase();
      const quality = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1.0;
      return { locale, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { locale } of languages) {
    // Check exact match
    if (SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
      return locale as SupportedLocale;
    }
    
    // Check regional mapping
    if (REGIONAL_MAPPINGS[locale]) {
      return REGIONAL_MAPPINGS[locale];
    }
    
    // Check primary language code
    const primaryLang = locale.split('-')[0];
    if (SUPPORTED_LOCALES.includes(primaryLang as SupportedLocale)) {
      return primaryLang as SupportedLocale;
    }
  }
  
  return null;
}

// Detect locale from mobile User-Agent
function detectMobileLocale(userAgent: string): SupportedLocale | null {
  const ua = userAgent.toLowerCase();
  
  // iOS locale detection
  if (ua.includes('iphone') || ua.includes('ipad')) {
    if (ua.includes('es_')) return 'es';
    if (ua.includes('pt_')) return 'pt';
    // if (ua.includes('fr_')) return 'fr'; // Future support
    if (ua.includes('de_')) return 'de';
    // if (ua.includes('zh_')) return 'zh'; // Future support
    if (ua.includes('ko_')) return 'ko';
    // if (ua.includes('ar_')) return 'ar'; // Future support
    if (ua.includes('hi_')) return 'hi';
  }
  
  // Android locale detection
  if (ua.includes('android')) {
    if (ua.includes('es-')) return 'es';
    if (ua.includes('pt-')) return 'pt';
    // if (ua.includes('fr-')) return 'fr'; // Future support
    if (ua.includes('de-')) return 'de';
    // if (ua.includes('zh-')) return 'zh'; // Future support
    if (ua.includes('ko-')) return 'ko';
    // if (ua.includes('ar-')) return 'ar'; // Future support
    if (ua.includes('hi-')) return 'hi';
  }
  
  return null;
}

// Check if pathname is missing locale prefix
export function isLocaleMissing(pathname: string): boolean {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  return !SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale);
}

// Validate locale
export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

// Get locale from pathname
export function getLocaleFromPathname(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  if (isValidLocale(firstSegment)) {
    return firstSegment;
  }
  
  return null;
}

// Remove locale from pathname
export function removeLocaleFromPathname(pathname: string, locale: SupportedLocale): string {
  return pathname.replace(`/${locale}`, '') || '/';
}

// Add locale to pathname
export function addLocaleToPathname(pathname: string, locale: SupportedLocale): string {
  // Don't add locale if it's already there
  if (pathname.startsWith(`/${locale}`)) {
    return pathname;
  }
  
  // Handle root path
  if (pathname === '/') {
    return `/${locale}`;
  }
  
  // Add locale prefix
  return `/${locale}${pathname}`;
}

// Get locale-specific URL
export function getLocalizedUrl(url: string, locale: SupportedLocale): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Remove existing locale if present
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '') || '/';
    
    // Add new locale
    urlObj.pathname = addLocaleToPathname(pathWithoutLocale, locale);
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

// Locale performance metrics
export interface LocaleMetrics {
  detectionTime: number;
  source: 'cookie' | 'header' | 'geo' | 'mobile' | 'default';
  locale: SupportedLocale;
  fallback: boolean;
}

export function measureLocaleDetection(request: NextRequest): LocaleMetrics {
  const startTime = performance.now();
  
  // Try cookie first
  const localeCookie = request.cookies.get('alchm_locale')?.value;
  if (localeCookie && isValidLocale(localeCookie)) {
    return {
      detectionTime: performance.now() - startTime,
      source: 'cookie',
      locale: localeCookie,
      fallback: false
    };
  }
  
  // Try header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const headerLocale = parseAcceptLanguage(acceptLanguage);
    if (headerLocale) {
      return {
        detectionTime: performance.now() - startTime,
        source: 'header',
        locale: headerLocale,
        fallback: false
      };
    }
  }
  
  // Try geo
  const country = request.headers.get('cf-ipcountry') || 
                 request.headers.get('x-vercel-ip-country');
  if (country && GEO_LOCALE_MAPPING[country.toUpperCase()]) {
    return {
      detectionTime: performance.now() - startTime,
      source: 'geo',
      locale: GEO_LOCALE_MAPPING[country.toUpperCase()],
      fallback: false
    };
  }
  
  // Fallback to default
  return {
    detectionTime: performance.now() - startTime,
    source: 'default',
    locale: DEFAULT_LOCALE,
    fallback: true
  };
}