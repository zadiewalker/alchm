import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { SUPPORTED_LOCALES, type SupportedLocale, loadTranslations, getTextDirection, isRTL } from '@/lib/i18n';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: SupportedLocale };
}

// Generate metadata for each locale
export async function generateMetadata({ params }: { params: { locale: SupportedLocale } }): Promise<Metadata> {
  const translations = await loadTranslations(params.locale);
  
  return {
    title: {
      template: `%s | ALCHM - ${translations.common?.welcome || 'Welcome home'}`,
      default: `ALCHM - ${translations.common?.welcome || 'Welcome home'}`,
    },
    description: translations.onboarding?.subtitle || 'A trauma-informed space for healing, reflection, and growth',
    openGraph: {
      title: `ALCHM - ${translations.common?.welcome || 'Welcome home'}`,
      description: translations.onboarding?.subtitle || 'A trauma-informed space for healing, reflection, and growth',
      locale: params.locale,
    },
  };
}

// Generate static paths for all supported locales
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale: locale,
  }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  // Validate locale parameter
  if (!SUPPORTED_LOCALES.includes(params.locale)) {
    notFound();
  }

  // Get locale from headers (set by middleware)
  const headersList = headers();
  const currentLocale = headersList.get('x-alchm-locale') || params.locale;
  
  // Load translations for this locale
  const translations = await loadTranslations(params.locale);
  
  // Determine text direction
  const textDirection = getTextDirection(params.locale);
  const isRightToLeft = isRTL(params.locale);

  return (
    <html lang={params.locale} dir={textDirection} className={isRightToLeft ? 'rtl' : 'ltr'}>
      <body className={`${inter.className} antialiased`}>
        {/* Locale Context Provider */}
        <div data-locale={params.locale} data-direction={textDirection}>
          {/* Cultural styling based on locale */}
          <style jsx global>{`
            :root {
              --locale: '${params.locale}';
              --text-direction: ${textDirection};
            }
            
            ${isRightToLeft ? `
              .rtl {
                direction: rtl;
                text-align: right;
              }
              .rtl .rtl-flip {
                transform: scaleX(-1);
              }
            ` : ''}
          `}</style>
          
          {children}
        </div>

        {/* Locale-aware scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__ALCHM_LOCALE__ = '${params.locale}';
              window.__ALCHM_TRANSLATIONS__ = ${JSON.stringify(translations)};
              window.__ALCHM_RTL__ = ${isRightToLeft};
            `,
          }}
        />
      </body>
    </html>
  );
}