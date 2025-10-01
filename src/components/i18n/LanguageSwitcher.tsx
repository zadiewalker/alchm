'use client';

import { useState, useEffect } from 'react';
import { SupportedLanguage, getTranslation } from '@/lib/i18n/translations';

const LANGUAGES = [
  { code: 'en' as const, name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar' as const, name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh' as const, name: '中文', flag: '🇨🇳', dir: 'ltr' },
];

interface LanguageSwitcherProps {
  onLanguageChange?: (language: SupportedLanguage) => void;
  className?: string;
}

export default function LanguageSwitcher({ onLanguageChange, className = '' }: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get saved language or detect browser language
    const savedLanguage = localStorage.getItem('alchm-language') as SupportedLanguage;
    if (savedLanguage && LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
      const supportedBrowserLang = LANGUAGES.find(lang => lang.code === browserLang);
      if (supportedBrowserLang) {
        setCurrentLanguage(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    // Update document direction and language
    const selectedLang = LANGUAGES.find(lang => lang.code === currentLanguage);
    if (selectedLang) {
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = selectedLang.dir;
    }
  }, [currentLanguage]);

  const handleLanguageChange = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('alchm-language', language);
    setIsOpen(false);
    
    // Update document direction
    const selectedLang = LANGUAGES.find(lang => lang.code === language);
    if (selectedLang) {
      document.documentElement.dir = selectedLang.dir;
    }
    
    onLanguageChange?.(language);
  };

  const currentLangInfo = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLangInfo?.flag}</span>
        <span className="text-white/90 text-sm hidden sm:inline">{currentLangInfo?.name}</span>
        <svg 
          className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#2D2D30] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                  currentLanguage === language.code ? 'bg-[#5E8E7F]/20 text-[#5E8E7F]' : 'text-white/90'
                }`}
                dir={language.dir}
              >
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium">{language.name}</div>
                  {language.code !== 'en' && (
                    <div className="text-xs text-white/60 mt-0.5">
                      {language.code === 'es' && 'Spanish'}
                      {language.code === 'ar' && 'Arabic'}
                      {language.code === 'zh' && 'Chinese (Simplified)'}
                    </div>
                  )}
                </div>
                {currentLanguage === language.code && (
                  <svg className="w-4 h-4 ml-auto text-[#5E8E7F]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Hook for using translations in components
export function useTranslations() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('alchm-language') as SupportedLanguage;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'alchm-language' && e.newValue) {
        setLanguage(e.newValue as SupportedLanguage);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const t = getTranslation(language);
  
  return { t, language, setLanguage };
}

// Cultural adaptation helpers
export const CULTURAL_ADAPTATIONS = {
  en: {
    colors: {
      primary: '#5E8E7F', // Teal - universal healing
      secondary: '#6B7280', // Gray - neutral
    },
    imagery: 'nature, growth, transformation',
    symbols: '🌱 🌟 💜 🔮',
  },
  es: {
    colors: {
      primary: '#D97706', // Warm orange - vibrant Latin culture
      secondary: '#7C3AED', // Purple - spiritual
    },
    imagery: 'familia, corazón, luz, esperanza',
    symbols: '🌻 ❤️ 🙏 ✨',
  },
  ar: {
    colors: {
      primary: '#059669', // Green - Islamic tradition
      secondary: '#DC2626', // Red - passion
    },
    imagery: 'geometric patterns, desert, stars, peace',
    symbols: '🌙 ⭐ 🕊️ 🤲',
  },
  zh: {
    colors: {
      primary: '#DC2626', // Red - fortune and joy
      secondary: '#F59E0B', // Gold - prosperity
    },
    imagery: 'harmony, balance, wisdom, growth',
    symbols: '🐲 🌸 ☯️ 🎋',
  },
};

// RTL Layout Support Component
export function RTLProvider({ children, language }: { children: React.ReactNode; language: SupportedLanguage }) {
  const isRTL = language === 'ar';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : ''}>
      {children}
    </div>
  );
}