'use client';

// CRISIS-CRITICAL: Ultra-lightweight auth for emergency access
// Target: <5KB bundle size for immediate crisis access
// Minimal dependencies, maximum speed

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EmergencyAuthProps {
  onSuccess?: () => void;
  onSkip?: () => void;
  allowSkip?: boolean;
  crisisMode?: boolean;
}

// Simplified auth state management for emergency situations
export default function EmergencyAuth({ 
  onSuccess, 
  onSkip, 
  allowSkip = true,
  crisisMode = false 
}: EmergencyAuthProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Crisis mode skips complex auth flows
  useEffect(() => {
    if (crisisMode && allowSkip) {
      // In crisis mode, provide immediate access
      const timer = setTimeout(() => {
        handleSkipAuth();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [crisisMode, allowSkip]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simplified Google auth for emergency access
      window.location.href = '/api/auth/google';
    } catch (err) {
      setError('Unable to connect. You can continue without signing in.');
      setLoading(false);
    }
  };

  const handleSkipAuth = () => {
    // Emergency guest access
    if (onSkip) {
      onSkip();
    } else {
      router.push('/journal?guest=true');
    }
  };

  if (crisisMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🆘</div>
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Crisis Support Access
          </h1>
          <p className="text-gray-700 mb-6">
            You can access support immediately without creating an account.
          </p>
          
          <button
            onClick={handleSkipAuth}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg font-bold text-lg mb-4 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            Get Immediate Support
          </button>
          
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Sign In to Save Progress'}
          </button>
          
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🌿</div>
          <h1 className="text-xl font-bold text-gray-800">Welcome to ALCHM</h1>
          <p className="text-gray-600 text-sm mt-2">
            Your safe space for healing and growth
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>🔑</span>
                Sign in with Google
              </>
            )}
          </button>
          
          {allowSkip && (
            <button
              onClick={handleSkipAuth}
              className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 p-3 rounded-lg font-medium transition-colors"
            >
              Continue as Guest
            </button>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Ages 18+ • Private & Secure • Free Forever
          </p>
        </div>
      </div>
    </div>
  );
}