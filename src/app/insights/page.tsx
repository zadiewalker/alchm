'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InsightsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to analytics page
    router.replace('/analytics');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <div className="text-2xl">📊</div>
        </div>
        <p className="text-lg text-sage-600">Redirecting to your insights...</p>
      </div>
    </div>
  );
}