'use client';
import { useEffect, useState } from 'react';
import { onAuthChanged, logout } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.push('/');
      } else {
        // Check if user has completed onboarding
        const hasSeenWelcome = localStorage.getItem(`alchm-welcome-${user.uid}`);
        if (!hasSeenWelcome) {
          router.push('/welcome');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0]">
      {/* Header */}
      <header className="px-6 pt-4 pb-2">
        <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div>
            <h1 className="text-2xl text-white font-light mb-1">
              Welcome to Your Sanctuary
            </h1>
            <p className="text-white/70 text-sm">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="group relative px-4 py-2"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
            <span className="relative text-white text-sm">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/journal')}
            className="group relative p-8 text-center"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 group-active:bg-white/25 rounded-xl backdrop-blur-sm transition-all duration-300" />
            <div className="relative">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl text-white font-light mb-2">
                Journal
              </h3>
              <p className="text-white/70 text-sm">
                Express your thoughts and feelings
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push('/insights')}
            className="group relative p-8 text-center"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 group-active:bg-white/25 rounded-xl backdrop-blur-sm transition-all duration-300" />
            <div className="relative">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl text-white font-light mb-2">
                Your Insights
              </h3>
              <p className="text-white/70 text-sm">
                Track your healing journey and growth
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push('/pathways')}
            className="group relative p-8 text-center"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 group-active:bg-white/25 rounded-xl backdrop-blur-sm transition-all duration-300" />
            <div className="relative">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl text-white font-light mb-2">
                Pathways
              </h3>
              <p className="text-white/70 text-sm">
                Discover healing practices
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push('/community')}
            className="group relative p-8 text-center"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 group-active:bg-white/25 rounded-xl backdrop-blur-sm transition-all duration-300" />
            <div className="relative">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl text-white font-light mb-2">
                Community
              </h3>
              <p className="text-white/70 text-sm">
                Connect with others on their journey
              </p>
            </div>
          </button>
        </div>

        {/* Crisis Support */}
        <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-sm max-w-md mx-auto">
          <h3 className="text-lg text-white font-light mb-4">
            Need Support?
          </h3>
          <button
            onClick={() => router.push('/emergency')}
            className="group relative px-6 py-3"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 group-active:bg-white/35 rounded-full transition-all duration-300" />
            <span className="relative text-white font-medium">
              📞 Crisis Support: 988
            </span>
          </button>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/50 text-sm text-center">Your sanctuary awaits</p>
      </div>
    </div>
  );
}
