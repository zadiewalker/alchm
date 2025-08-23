import { SupportedLocale, loadTranslations, getCulturalColorScheme } from '@/lib/i18n';
import { ReflectionInterface } from '@/components/ReflectionInterface';
import { KheperaIntegration } from '@/components/KheperaIntegration';
import { Metadata } from 'next';

interface ReflectionPageProps {
  params: { locale: SupportedLocale };
}

export async function generateMetadata({ params }: { params: { locale: SupportedLocale } }): Promise<Metadata> {
  const translations = await loadTranslations(params.locale);
  
  return {
    title: translations.reflection?.title || 'Sacred Reflection',
    description: translations.reflection?.prompt || "What's present in your heart today?",
  };
}

export default async function ReflectionPage({ params }: ReflectionPageProps) {
  const translations = await loadTranslations(params.locale);
  const colorScheme = getCulturalColorScheme(params.locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {translations.reflection?.title || 'Sacred Reflection'}
              </h1>
              <p className="text-gray-600 mt-1">
                {translations.reflection?.prompt || "What's present in your heart today?"}
              </p>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <a
                href={`/${params.locale}/journals`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {translations.navigation?.journals || 'Journals'}
              </a>
              <a
                href={`/${params.locale}/dashboard`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {translations.navigation?.home || 'Home'}
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Writing Interface */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  {translations.reflection?.title || 'Your Reflection Space'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {translations.reflection?.placeholder || 'Let your thoughts flow freely here...'}
                </p>
              </div>
              
              {/* Writing Area */}
              <div className="p-6">
                <textarea
                  placeholder={translations.reflection?.placeholder || 'Let your thoughts flow freely here...'}
                  className="w-full h-96 resize-none border-0 focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent text-lg leading-relaxed"
                  style={{ outline: 'none' }}
                />
                
                {/* Writing Tools */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {translations.reflection?.wordCount?.replace('{count}', '0') || '0 words'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {translations.reflection?.saving || 'Auto-saving...'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {translations.common?.save || 'Save'}
                    </button>
                    <button
                      className="px-6 py-2 rounded-lg text-sm font-medium text-white shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                      style={{
                        background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
                      }}
                    >
                      {translations.reflection?.askKhepera || 'Ask KHEPERA'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KHEPERA Integration Sidebar */}
          <div className="space-y-6">
            {/* KHEPERA Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)` }}
                  >
                    <span className="text-white text-sm font-bold">🔮</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {translations.khepera?.title || 'KHEPERA'}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {translations.khepera?.subtitle || 'Your AI Companion'}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {translations.reflection?.kheperaPrompt || "Would you like KHEPERA's perspective?"}
                </p>
                
                {/* Archetype Selection */}
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Choose Voice
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'mirror', icon: '🪞' },
                      { key: 'inner_child', icon: '🌟' },
                      { key: 'future_you', icon: '🚀' },
                      { key: 'poet_mentor', icon: '🎭' },
                      { key: 'older_sibling', icon: '🤝' },
                      { key: 'spark', icon: '⚡' },
                      { key: 'ancestor', icon: '🌳' },
                    ].map((archetype) => (
                      <label
                        key={archetype.key}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="archetype"
                          value={archetype.key}
                          className="w-4 h-4"
                          style={{ accentColor: colorScheme.primary }}
                        />
                        <span className="text-sm">{archetype.icon}</span>
                        <span className="text-sm text-gray-700">
                          {translations.khepera?.archetypes?.[archetype.key] || archetype.key}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {translations.dashboard?.recentJournals || 'Recent Reflections'}
                </h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    {translations.journals?.noEntries || 'Your journey begins with the first word'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cultural Context */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-xs text-gray-600">
                  Reflecting in {params.locale.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Culturally attuned responses
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}