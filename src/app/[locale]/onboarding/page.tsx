import { SupportedLocale, loadTranslations, getCulturalGreeting, getCulturalColorScheme } from '@/lib/i18n';
import { headers } from 'next/headers';
import { OnboardingFlow } from '@/components/OnboardingFlow';

interface OnboardingPageProps {
  params: { locale: SupportedLocale };
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const translations = await loadTranslations(params.locale);
  const culturalGreeting = getCulturalGreeting(params.locale);
  const colorScheme = getCulturalColorScheme(params.locale);

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      style={{
        background: `linear-gradient(135deg, ${colorScheme.primary}10 0%, #ffffff 50%, ${colorScheme.secondary}10 100%)`,
      }}
    >
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Cultural Welcome */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {translations.onboarding?.title || 'Welcome to Your Digital Sanctuary'}
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            {translations.onboarding?.subtitle || 'A trauma-informed space for healing, reflection, and growth'}
          </p>
          <p 
            className="text-lg font-medium"
            style={{ color: colorScheme.primary }}
          >
            {culturalGreeting}
          </p>
        </div>

        {/* Locale Information Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span>🌍</span>
            <span>Language: {params.locale.toUpperCase()}</span>
            <span>•</span>
            <span>Region: Global</span>
          </div>
        </div>

        {/* Onboarding Steps Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {translations.onboarding?.step1?.title || 'Choose Your Language'}
            </h3>
            <p className="text-sm text-gray-600">
              {translations.onboarding?.step1?.description || 'ALCHM speaks your language, honors your culture'}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {translations.onboarding?.step2?.title || 'Set Your Intention'}
            </h3>
            <p className="text-sm text-gray-600">
              {translations.onboarding?.step2?.description || 'What brings you to this sacred space?'}
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {translations.onboarding?.step3?.title || 'Meet KHEPERA'}
            </h3>
            <p className="text-sm text-gray-600">
              {translations.onboarding?.step3?.description || 'Your AI companion for emotional intelligence and growth'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-8">
          <button
            className="w-full bg-gradient-to-r text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
            }}
          >
            {translations.onboarding?.getStarted || 'Begin Your Journey'}
          </button>

          <div className="flex justify-center space-x-6 text-sm">
            <a href={`/${params.locale}/auth`} className="text-gray-600 hover:text-gray-900 transition-colors">
              {translations.auth?.signIn || 'Sign In'}
            </a>
            <span className="text-gray-400">•</span>
            <a href={`/${params.locale}/about`} className="text-gray-600 hover:text-gray-900 transition-colors">
              Learn More
            </a>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Switch Language:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { code: 'en', name: 'English' },
              { code: 'es', name: 'Español' },
              { code: 'pt', name: 'Português' },
              { code: 'sw', name: 'Kiswahili' },
              { code: 'ar', name: 'العربية' },
              { code: 'hi', name: 'हिन्दी' },
              { code: 'zh', name: '中文' },
              { code: 'fr', name: 'Français' },
              { code: 'yo', name: 'Yorùbá' },
              { code: 'ko', name: '한국어' },
              { code: 'de', name: 'Deutsch' },
            ].map((lang) => (
              <a
                key={lang.code}
                href={`/${lang.code}/onboarding`}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  params.locale === lang.code
                    ? 'bg-indigo-100 text-indigo-800 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {lang.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}