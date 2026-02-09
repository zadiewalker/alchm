'use client';

import Link from 'next/link';

const pathways = [
  {
    id: 'foundation',
    title: 'Foundation',
    subtitle: 'Reconnecting with your body',
    description: 'Our bodies hold wisdom. This pathway helps you listen to what yours has been trying to tell you.',
    available: true,
    isFree: true,
    color: '#A8B09E', // Sacred sage for grounding
    colorRgb: '168, 176, 158', // For rgba usage
  },
  {
    id: 'calm-the-storm',
    title: 'Finding Stillness',
    subtitle: 'Working with overwhelming emotions',
    description: 'When feelings seem too big, there are gentle ways to find ground again.',
    available: true,
    isFree: true,
    color: '#7BB3D4', // Calming ocean blue for peace
    colorRgb: '123, 179, 212',
  },
  {
    id: 'honoring-loss',
    title: 'Honoring Loss',
    subtitle: 'Making space for grief',
    description: 'Grief doesn\'t follow rules. This pathway offers companionship for the journey.',
    available: true,
    isFree: false,
    color: '#A8B09E', // Sacred sage for grief's tenderness
    colorRgb: '168, 176, 158',
  },
  {
    id: 'enough-as-you-are',
    title: 'Enough as You Are',
    subtitle: 'Reconnecting with your worth',
    description: 'Beneath the critical voices is someone who has always been worthy.',
    available: true,
    isFree: false,
    color: '#B395D4', // Gentle lavender for self-compassion
    colorRgb: '179, 149, 212',
  },
  {
    id: 'shadow-work',
    title: 'Shadow Work',
    subtitle: 'Embracing all of who you are',
    description: 'The parts of ourselves we hide often hold unexpected gifts.',
    available: true,
    isFree: false,
    color: '#95A7D4', // Deep twilight blue for shadow integration
    colorRgb: '149, 167, 212',
  },
];

export default function PathwaysPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-6">
        <Link href="/dashboard/" className="text-white/60 text-base mb-4 inline-block hover:text-white/80 transition-all duration-200 ease-out active:scale-[0.98]">
          ← Back
        </Link>
        <h1 className="text-white text-3xl font-light">Pathways</h1>
        <p className="text-white/50 text-base mt-2 leading-relaxed">
          Guided journeys for when you're ready to go deeper
        </p>
      </header>

      {/* Pathways List */}
      <div className="flex-1 px-6 overflow-y-auto">
        <div className="space-y-4">
          {pathways.map((pathway) =>
            pathway.available ? (
              <Link
                key={pathway.id}
                href={`/pathways/${pathway.id}/`}
                className="block backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 ease-out active:scale-[0.98] group"
                style={{
                  background: `linear-gradient(135deg, rgba(${pathway.colorRgb}, 0.12) 0%, rgba(${pathway.colorRgb}, 0.06) 100%)`,
                  border: `1px solid rgba(${pathway.colorRgb}, 0.15)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, rgba(${pathway.colorRgb}, 0.20) 0%, rgba(${pathway.colorRgb}, 0.10) 100%)`;
                  e.currentTarget.style.border = `1px solid rgba(${pathway.colorRgb}, 0.25)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, rgba(${pathway.colorRgb}, 0.12) 0%, rgba(${pathway.colorRgb}, 0.06) 100%)`;
                  e.currentTarget.style.border = `1px solid rgba(${pathway.colorRgb}, 0.15)`;
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{
                          backgroundColor: pathway.color,
                          boxShadow: `0 0 8px rgba(${pathway.colorRgb}, 0.4)`
                        }} 
                      />
                      <h2 className="text-white text-xl font-light">{pathway.title}</h2>
                    </div>
                    <p className="text-white/50 text-sm">{pathway.subtitle}</p>
                  </div>
                  {!pathway.isFree && (
                    <span className="text-white/40 text-xs px-2 py-1 rounded-full bg-white/10">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mt-3">
                  {pathway.description}
                </p>
              </Link>
            ) : (
              <div
                key={pathway.id}
                className="block bg-white/6 backdrop-blur-sm rounded-2xl p-5 border border-white/5 opacity-60"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full opacity-50"
                        style={{backgroundColor: pathway.color}} 
                      />
                      <h2 className="text-white/60 text-xl font-light">{pathway.title}</h2>
                    </div>
                    <p className="text-white/40 text-sm">{pathway.subtitle}</p>
                  </div>
                  <span className="text-white/30 text-xs px-2 py-1 rounded-full bg-white/5">
                    Coming Soon
                  </span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed mt-3">
                  {pathway.description}
                </p>
              </div>
            )
          )}
        </div>

        {/* Upgrade Section */}
        <div className="mt-8">
          <Link 
            href="/pricing/"
            className="block bg-gradient-to-br from-[#E8C56D]/8 to-[#E8C56D]/3 backdrop-blur-sm rounded-2xl p-4 border border-[#E8C56D]/15 hover:border-[#E8C56D]/25 hover:bg-gradient-to-br hover:from-[#E8C56D]/12 hover:to-[#E8C56D]/6 transition-all duration-200 ease-out active:scale-[0.98] text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8C56D]/60" />
              <span className="text-white/80 text-sm font-light">Unlock All Pathways</span>
            </div>
          </Link>
        </div>
        
        {/* Gentle note */}
        <p className="text-white/30 text-xs text-center mt-6 leading-relaxed">
          Take your time. These paths will be here whenever you're ready.
        </p>
        
        {/* Crisis Support Footer */}
        <div className="mt-8 pb-8 pt-6">
          <p className="text-white/30 text-xs text-center tracking-wide">
            Crisis support available · 988
          </p>
        </div>

      </div>

    </div>
  );
}