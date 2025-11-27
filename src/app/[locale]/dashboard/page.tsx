'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { SanctuaryDashboard } from '@/components/dashboard/SanctuaryDashboard';
import { InlineAgeVerification } from '@/components/auth/InlineAgeVerification';
import { ScarabIcon } from '../../../components/icons/AlchmIcons';
import dynamic from 'next/dynamic';

// Dynamic import for enhanced Khepera chat
const KheperaChat = dynamic(
  () => import('@/components/khepera/KheperaChat'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check URL parameters for different access modes
  const isGuestMode = searchParams.get('guest') === 'true';
  const isInstantMode = searchParams.get('instant') === 'true';
  const [guestMode, setGuestMode] = useState(isGuestMode || isInstantMode);
  const [ageVerified, setAgeVerified] = useState(false);
  const [needsAgeVerification, setNeedsAgeVerification] = useState(false);

  useEffect(() => {
    // Check age verification status first
    const verified = sessionStorage.getItem('alchm_age_verified_session');
    setAgeVerified(!!verified);
    
    if (!loading) {
      // For instant mode, create anonymous session automatically after age verification
      if (isInstantMode && !user && verified) {
        createInstantSession();
      } else if (isInstantMode && !user && !verified) {
        // Need age verification for instant access
        setNeedsAgeVerification(true);
      } else if (!user && !guestMode) {
        // No user and not guest mode - redirect to landing page for guest-first experience
        router.push('/');
      }
    }
  }, [user, loading, guestMode, router, isInstantMode]);

  // Auto-create anonymous session for instant access
  const createInstantSession = async () => {
    try {
      const { signInAsGuest } = await import('@/lib/auth/domain-aware-auth');
      await signInAsGuest();
      // Session will be created and page will update via useAuth
    } catch (error) {
      console.warn('Instant session creation failed:', error);
      // Fallback to guest mode without Firebase auth
      setGuestMode(true);
    }
  };

  // Handle age verification completion
  const handleAgeVerified = () => {
    setAgeVerified(true);
    setNeedsAgeVerification(false);
    
    // If this was instant mode, create the session now
    if (isInstantMode && !user) {
      createInstantSession();
    }
  };

  // Handle age verification declined
  const handleAgeDeclined = () => {
    // Redirect to safe landing page for under-18 users
    router.push('/');
  };

  // Jony Ive Loading State - Absolute Luxury
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-300/60 via-sage-400/70 to-sage-500/80 flex items-center justify-center px-8 relative overflow-hidden">
        {/* Ambient background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(164,183,146,0.15)_0%,_transparent_50%),_radial-gradient(circle_at_80%_80%,_rgba(164,183,146,0.10)_0%,_transparent_50%)]"></div>
        
        <div className="text-center relative z-10">
          {/* Icon Container - Enhanced Luxury */}
          <div className="w-28 h-28 bg-sanctuary-glass backdrop-blur-xl rounded-temple flex items-center justify-center mx-auto mb-12 shadow-divine border border-white/25 animate-sacred-breathing">
            <ScarabIcon size={36} color="charcoal" />
          </div>
          
          {/* Message Container - Mathematical Precision */}
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-temple px-16 py-12 shadow-transcendent border border-white/30 max-w-lg">
            <h3 className="text-title2 font-breath text-charcoal-800 mb-6 tracking-tight leading-tight">
              Preparing sanctuary
            </h3>
            <p className="text-callout font-presence text-charcoal-600 leading-relaxed opacity-95 tracking-wide">
              Khepera is setting up your healing space...
            </p>
            
            {/* Progress Indicator - Luxury Animation */}
            <div className="mt-12 w-48 h-1.5 bg-sage-400/15 rounded-full mx-auto overflow-hidden relative">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-sage-400 to-sage-500 rounded-full animate-sacred-pulse origin-left"
                style={{
                  width: '40%',
                  transition: 'width 2000ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              ></div>
              <div className="absolute inset-0 bg-white/20 rounded-full animate-sacred-breathing"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show age verification if needed (App Store compliance)
  if (needsAgeVerification) {
    return (
      <>
        <SanctuaryDashboard user={null} isGuest={true} />
        <InlineAgeVerification 
          onVerified={handleAgeVerified}
          onDeclined={handleAgeDeclined}
        />
        <KheperaChat userId={user?.uid} />
      </>
    );
  }

  // Guest mode or authenticated user - show the dashboard
  return (
    <>
      <SanctuaryDashboard 
        user={user} 
        isGuest={guestMode || !user} 
      />
      <KheperaChat userId={user?.uid} />
    </>
  );
}