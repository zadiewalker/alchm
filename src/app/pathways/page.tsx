'use client';

import { useRouter } from 'next/navigation';

export default function PathwaysPage() {
  const router = useRouter();

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
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0]">
      {/* Fixed Header */}
      <header className="px-6 pt-4 pb-2 flex items-center">
        <button onClick={() => router.back()} className="group relative">
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
          <span className="relative text-white/70 text-lg">← Back</span>
        </button>
        <h1 className="text-white text-xl font-light ml-4">Healing Pathways</h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        <p className="text-white/70 text-center mb-8 max-w-md mx-auto">
          Explore different approaches to healing and growth. Choose what resonates with your journey.
        </p>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {pathways.map((pathway) => (
            <button
              key={pathway.id}
              onClick={() => {
                // TODO: Navigate to specific pathway detail
                console.log('Selected pathway:', pathway.id);
              }}
              className="group relative p-6 text-left"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 group-active:bg-white/25 rounded-xl backdrop-blur-sm transition-all duration-300" />
              <div className="relative">
                <div className="text-3xl mb-3">{pathway.emoji}</div>
                <h3 className="text-lg text-white font-light mb-2">
                  {pathway.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {pathway.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/50 text-sm text-center">Choose your path to healing</p>
      </div>
    </div>
  );
}