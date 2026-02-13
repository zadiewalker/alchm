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
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col">
      {/* Radial Overlay - LOCKDOWN SPEC */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
      {/* Header */}
      <header className="relative z-10 px-6 pt-14 pb-6">
        <Link href="/dashboard" className="text-white/60 text-base mb-4 inline-block hover:text-white/80 transition-all duration-200 ease-out active:scale-[0.98]">
          ← Back
        </Link>
        <h1 className="text-white text-3xl font-light">Pathways</h1>
        <p className="text-white/60 text-base mt-2 leading-relaxed">
          Guided journeys for when you're ready to go deeper
        </p>
      </header>

      {/* Pathways List */}
      <main className="relative z-10 flex-1 px-6 pb-32 overflow-y-auto">
        <div className="space-y-4">
          {pathways.map((pathway) =>
            pathway.available ? (
              <Link
                key={pathway.id}
                href={`/pathways/${pathway.id}/`}
                className="block bg-white/10 backdrop-blur-[12px] rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all 200ms ease active:scale-[0.98] group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-[#E5C97D]" />
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
                className="block bg-white/5 backdrop-blur-[12px] rounded-2xl p-6 border border-white/5 opacity-60"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-white/20 opacity-50" />
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
            className="block bg-[#E5C97D] rounded-full py-4 px-6 text-white font-medium hover:bg-[#F2D99D] transition-all 300ms ease-out active:scale-[0.98] text-center min-h-[44px] flex items-center justify-center"
          >
            <span className="text-sm">Unlock All Pathways</span>
          </Link>
        </div>
        
        {/* Gentle note */}
        <p className="text-white/30 text-xs text-center mt-6 leading-relaxed">
          Take your time. These paths will be here whenever you're ready.
        </p>
        
      </main>
      
      {/* Crisis Footer - LOCKDOWN SPEC */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/40 text-xs text-center tracking-wide">
          Crisis support available · 988
        </p>
      </div>

    </div>
  );
}
