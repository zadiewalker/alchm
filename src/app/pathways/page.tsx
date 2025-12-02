'use client';

import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';

// CRISIS-CRITICAL: Lazy load PathwaysDashboard to reduce bundle size
const PathwaysDashboard = dynamicImport(() => import('@/components/Pathways/PathwaysDashboard').then(mod => ({ default: mod.PathwaysDashboard })), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/10 rounded-xl h-64 mb-4"></div>
          </div>
        ))}
      </div>
    </div>
  )
});

export default function PathwaysPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-sanctuary">
        <div className="text-center">
          <div className="w-8 h-8 bg-white/30 rounded-full animate-gentle-pulse mb-4 mx-auto" />
          <p className="text-white text-lg font-light">Loading your pathway constellation...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen gradient-sanctuary">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Back to Dashboard
        </Link>
      </nav>

      {/* Main Dashboard */}
      <PathwaysDashboard />
    </main>
  );
}