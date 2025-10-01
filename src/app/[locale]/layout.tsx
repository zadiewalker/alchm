import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// ALCHM Supported Locales - synchronized with middleware.ts and i18n.ts
const SUPPORTED_LOCALES = [
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

type SupportedLocale = typeof SUPPORTED_LOCALES[number];

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

// Locale-specific metadata generation
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const locale = params.locale as SupportedLocale;
  
  // Validate locale
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return {};
  }

  // Base metadata structure
  const baseMetadata = {
    title: 'ALCHM - Your Safe Space for Healing & Growth',
    description: 'Trauma-informed AI support that honors all healing traditions & identities. Free forever, culturally responsive, private. Ages 18+.',
    keywords: 'trauma-informed, cultural healing, mental health equity, AI, community healing, resilience, BIPOC mental health, LGBTQ+ support, immigrant mental health, Indigenous healing, collective healing, crisis support, economic justice',
  };

  // Locale-specific metadata overrides - App Store Launch Locales
  const localeMetadata: Record<SupportedLocale, Partial<typeof baseMetadata>> = {
    en: baseMetadata,
    es: {
      title: 'ALCHM - Tu Espacio Seguro para Sanación y Crecimiento',
      description: 'Apoyo de IA consciente del trauma que honra todas las tradiciones de sanación e identidades. Gratis para siempre, culturalmente receptivo, privado. Mayores de 18 años.',
    },
    pt: {
      title: 'ALCHM - Seu Espaço Seguro para Cura e Crescimento',
      description: 'Suporte de IA sensível ao trauma que honra todas as tradições de cura e identidades. Grátis para sempre, culturalmente responsivo, privado. Maiores de 18 anos.',
    },
    hi: {
      title: 'ALCHM - उपचार और विकास के लिए आपका सुरक्षित स्थान',
      description: 'आघात-सूचित AI सहायता जो सभी उपचार परंपराओं और पहचानों का सम्मान करती है। हमेशा के लिए मुफ्त, सांस्कृतिक रूप से उत्तरदायी, निजी। 18+ वर्ष।',
    },
    ko: {
      title: 'ALCHM - 치유와 성장을 위한 안전한 공간',
      description: '모든 치유 전통과 정체성을 존중하는 트라우마 인지 AI 지원. 영원히 무료, 문화적 반응성, 개인정보 보호. 18세 이상.',
    },
    de: {
      title: 'ALCHM - Ihr sicherer Raum für Heilung und Wachstum',
      description: 'Trauma-bewusste KI-Unterstützung, die alle Heilungstraditionen und Identitäten ehrt. Für immer kostenlos, kulturell responsiv, privat. Ab 18 Jahren.',
    },
  };

  return {
    ...baseMetadata,
    ...localeMetadata[locale],
    alternates: {
      languages: {
        'en': '/en',
        'es': '/es',
        'pt': '/pt',
        'hi': '/hi',
        'ko': '/ko',
        'de': '/de',
      },
      canonical: `/${locale}`,
    },
    openGraph: {
      title: localeMetadata[locale]?.title || baseMetadata.title,
      description: localeMetadata[locale]?.description || baseMetadata.description,
      url: `https://alchmapp.web.app/${locale}`,
      siteName: 'ALCHM',
      locale: locale === 'en' ? 'en_US' : 
              locale === 'es' ? 'es_ES' :
              locale === 'pt' ? 'pt_BR' :
              locale === 'de' ? 'de_DE' :
              locale === 'ko' ? 'ko_KR' :
              locale === 'hi' ? 'hi_IN' :
              `${locale}_${locale.toUpperCase()}`,
      type: 'website',
    },
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale as SupportedLocale;
  
  // Validate locale - if invalid, trigger 404
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <>
      {/* Locale context provider wrapper - NO nested html/body tags to prevent hydration errors */}
      <div data-locale={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
        {children}
      </div>
    </>
  );
}

// Static generation for supported locales
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }));
}