'use client';
import Link from 'next/link';

export default function PathwaysPage() {

  const pathways = [
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      emoji: '🧘‍♀️',
      description: 'Cultivate present-moment awareness and inner peace'
    },
    {
      id: 'breathwork',
      title: 'Breathwork',
      emoji: '🌬️',
      description: 'Harness the power of conscious breathing'
    },
    {
      id: 'movement',
      title: 'Movement',
      emoji: '💃',
      description: 'Heal through gentle movement and embodiment'
    },
    {
      id: 'creativity',
      title: 'Creative Expression',
      emoji: '🎨',
      description: 'Express your inner world through art and creativity'
    },
    {
      id: 'nature',
      title: 'Nature Connection',
      emoji: '🌿',
      description: 'Find healing in your connection with the natural world'
    },
    {
      id: 'community',
      title: 'Community',
      emoji: '🤝',
      description: 'Build meaningful connections and support networks'
    }
  ];

  return (
    <div className="page-container">
      {/* 
        ═══════════════════════════════════════════════════════════
        Fixed Header
        Gentle navigation that honors the journey back
        ═══════════════════════════════════════════════════════════ 
      */}
      <header className="px-6 pt-4 pb-2 flex items-center">
        <Link 
          href="/dashboard" 
          className="group relative touch-target"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-slow" />
          <span className="relative text-white/60 text-lg font-light">← Back</span>
        </Link>
        <h1 className="text-white text-xl font-extralight tracking-wide ml-4">Healing Pathways</h1>
      </header>

      {/* 
        ═══════════════════════════════════════════════════════════
        Scrollable Content
        Sacred pathways await your exploration
        ═══════════════════════════════════════════════════════════ 
      */}
      <div className="scrollable px-6 pb-24">
        <p className="text-white/60 text-center mb-8 max-w-md mx-auto font-light leading-relaxed">
          Explore different approaches to healing and growth. Choose what resonates with your journey.
        </p>

        {/* 
          ═══════════════════════════════════════════════════════════
          Pathways Grid
          Each pathway is an invitation to transformation
          ═══════════════════════════════════════════════════════════ 
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {pathways.map((pathway) => (
            <button
              key={pathway.id}
              onClick={() => {
                // TODO: Navigate to specific pathway detail
                console.log('Selected pathway:', pathway.id);
              }}
              className="group relative p-8 text-left touch-target"
            >
              <div className="glass-card absolute inset-0 group-hover:bg-white/15 group-active:bg-white/20 transition-slow" />
              <div className="relative">
                <div className="text-3xl mb-4 opacity-90">{pathway.emoji}</div>
                <h3 className="text-lg text-white font-extralight tracking-wide mb-3">
                  {pathway.title}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed">
                  {pathway.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 
        ═══════════════════════════════════════════════════════════
        Fixed Footer
        Gentle encouragement for the journey ahead
        ═══════════════════════════════════════════════════════════ 
      */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-6 fade-bottom">
        <p className="text-white/40 text-sm text-center font-light tracking-wide">
          Choose your path to healing
        </p>
      </div>
    </div>
  );
}