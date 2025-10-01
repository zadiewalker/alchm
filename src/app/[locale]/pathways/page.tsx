'use client';

import { useEffect, useState } from 'react';

export default function PathwaysPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple auth check using cookie
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('alchm_session='));
    
    if (sessionCookie) {
      const uid = sessionCookie.split('=')[1];
      setUser({ uid });
      console.log('✅ User session found:', uid);
    } else {
      console.log('❌ No session found, redirecting to login...');
      window.location.href = '/en/auth/login';
      return;
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)' }}>
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-xl">Loading pathways...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)' }}>
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔐</div>
          <p className="text-xl">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const pathways = [
    {
      id: 'trauma-healing',
      title: 'Trauma-Informed Healing',
      description: 'Gentle guidance for processing and healing from trauma experiences',
      icon: '🌱',
      duration: '4-6 weeks',
      steps: 8,
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'daily-resilience',
      title: 'Daily Resilience Building',
      description: 'Build emotional strength and coping skills for everyday challenges',
      icon: '💪',
      duration: '3-4 weeks',
      steps: 6,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'self-compassion',
      title: 'Self-Compassion Practice',
      description: 'Learn to treat yourself with kindness and understanding',
      icon: '💝',
      duration: '2-3 weeks',
      steps: 5,
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'mindful-awareness',
      title: 'Mindful Awareness',
      description: 'Develop present-moment awareness and mindfulness practices',
      icon: '🧘',
      duration: '3-5 weeks',
      steps: 7,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'relationship-healing',
      title: 'Relationship Healing',
      description: 'Heal and strengthen connections with others and yourself',
      icon: '🤝',
      duration: '5-7 weeks',
      steps: 9,
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'creative-expression',
      title: 'Creative Expression',
      description: 'Use creativity as a pathway to healing and self-discovery',
      icon: '🎨',
      duration: '4-6 weeks',
      steps: 8,
      color: 'from-yellow-400 to-yellow-600'
    }
  ];

  const startPathway = (pathwayId: string) => {
    // For now, just show an alert - in full version this would navigate to the pathway
    alert(`Starting pathway: ${pathways.find(p => p.id === pathwayId)?.title}\n\nThis would begin your guided healing journey with trauma-informed prompts and gentle guidance.`);
  };

  return (
    <div className="min-h-screen" 
         style={{ background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)' }}>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button 
                onClick={() => window.location.href = '/en/dashboard'}
                className="text-white/80 hover:text-white mr-4"
              >
                ← Back
              </button>
              <span className="text-2xl mr-3">🗺️</span>
              <h1 className="text-2xl font-light text-white">Pathways</h1>
            </div>
            <button 
              onClick={() => {
                document.cookie = 'alchm_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
                window.location.href = '/en/auth/login';
              }}
              className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-white mb-4">Guided Healing Pathways</h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Choose from trauma-informed journeys designed to support your healing process. Each pathway offers gentle guidance, structured prompts, and compassionate support at your own pace.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathways.map((pathway) => (
            <div key={pathway.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
              <div className="text-5xl mb-4">{pathway.icon}</div>
              <h3 className="text-xl font-medium text-white mb-3">{pathway.title}</h3>
              <p className="text-white/70 mb-6 leading-relaxed">{pathway.description}</p>
              
              <div className="flex justify-between text-sm text-white/60 mb-6">
                <span>{pathway.duration}</span>
                <span>{pathway.steps} steps</span>
              </div>
              
              <button 
                onClick={() => startPathway(pathway.id)}
                className="w-full text-white bg-white/20 hover:bg-white/30 py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] font-medium"
              >
                Begin Journey
              </button>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-white mb-4">Need Support?</h3>
            <p className="text-white/70 mb-6">
              These pathways are designed to complement, not replace, professional therapy. If you're experiencing a crisis or need immediate support:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = 'tel:988'}
                className="text-white bg-red-500/20 hover:bg-red-500/30 px-6 py-3 rounded-lg transition-colors"
              >
                📞 Crisis Line: 988
              </button>
              <button 
                onClick={() => window.location.href = 'sms:741741&body=HOME'}
                className="text-white bg-blue-500/20 hover:bg-blue-500/30 px-6 py-3 rounded-lg transition-colors"
              >
                💬 Text HOME to 741741
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/60">
              Pathways are trauma-informed guides, not medical treatment. Ages 17+.
            </p>
            <p className="text-white/60 text-sm mt-2">
              Take your time, go at your pace. You're safe here.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}