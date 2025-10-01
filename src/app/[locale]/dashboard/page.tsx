'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
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
          <div className="text-6xl mb-4">🌿</div>
          <p className="text-xl">Loading your sanctuary...</p>
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

  return (
    <div className="min-h-screen" 
         style={{ background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)' }}>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🌿</span>
              <h1 className="text-2xl font-light text-white">ALCHM</h1>
            </div>
            <button 
              onClick={() => {
                // Simple sign out
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
          <h2 className="text-4xl font-light text-white mb-4">Welcome to Your Sanctuary</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Your trauma-informed digital space for healing, reflection, and growth. Take your time, you're safe here.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Journal Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-medium text-white mb-2">Journal</h3>
            <p className="text-white/70 mb-4">Write freely in your private space</p>
            <button 
              onClick={() => window.location.href = '/en/journal'}
              className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Start Writing
            </button>
          </div>

          {/* Journals Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-white mb-2">My Journals</h3>
            <p className="text-white/70 mb-4">Review your healing journey</p>
            <button 
              onClick={() => window.location.href = '/en/journals'}
              className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>

          {/* Pathways Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-medium text-white mb-2">Pathways</h3>
            <p className="text-white/70 mb-4">Guided healing journeys</p>
            <button 
              onClick={() => window.location.href = '/en/pathways'}
              className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Explore
            </button>
          </div>

          {/* Crisis Support Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
            <div className="text-4xl mb-4">🆘</div>
            <h3 className="text-xl font-medium text-white mb-2">Crisis Support</h3>
            <p className="text-white/70 mb-4">24/7 support when you need it</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => window.location.href = 'tel:988'}
                className="text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors"
              >
                📞 Call 988
              </button>
              <button 
                onClick={() => window.location.href = 'sms:741741&body=HOME'}
                className="text-white bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg transition-colors"
              >
                💬 Text HOME
              </button>
            </div>
          </div>

        </div>

        {/* Session Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
            <p className="text-white/60 text-sm">
              Session ID: {user.uid?.substring(0, 8)}... • You're signed in and secure
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/60">
              ALCHM is a journaling platform, not medical treatment or therapy. Ages 17+.
            </p>
            <p className="text-white/60 text-sm mt-2">
              COPPA, GDPR & CCPA compliant. Your data is encrypted and protected.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}