'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithGoogleCrisisSafe, 
  detectCrisisMobileCapabilities,
  EnhancedMobileDetection,
  CrisisMobileAuthResult
} from '@/lib/auth/mobile-auth-crisis-fixes';

interface MobileCrisisAuthButtonProps {
  redirectTo?: string;
  onAuthSuccess?: (result: CrisisMobileAuthResult) => void;
  onAuthError?: (error: string, crisisSupport?: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export function MobileCrisisAuthButton({
  redirectTo = '/en/sanctuary',
  onAuthSuccess,
  onAuthError,
  className,
  children
}: MobileCrisisAuthButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState<EnhancedMobileDetection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crisisSupport, setCrisisSupport] = useState<any>(null);

  // Detect mobile capabilities on component mount
  useEffect(() => {
    detectCrisisMobileCapabilities().then(setMobile);
  }, []);

  const handleAuthentication = async () => {
    if (!mobile) {
      setError('Device detection in progress, please wait...');
      return;
    }

    setLoading(true);
    setError(null);
    setCrisisSupport(null);
    
    // Provide immediate haptic feedback for touch interaction
    if (mobile.isTouch && navigator.vibrate) {
      navigator.vibrate(15); // Brief acknowledgment
    }

    try {
      console.log('🔐 Starting crisis-safe mobile authentication...', {
        browser: mobile.browserName,
        crisisContext: mobile.crisisContext,
        requiresRedirect: mobile.requiresRedirect,
        deviceStress: mobile.deviceStress
      });

      const result = await signInWithGoogleCrisisSafe();
      
      console.log('🔐 Authentication result:', {
        success: !!result.user,
        method: result.authMethod,
        crisisSupport: !!result.crisisSupport
      });

      if (result.user) {
        // Success haptic feedback
        if (mobile.isTouch && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]); // Success pattern
        }
        
        if (onAuthSuccess) {
          onAuthSuccess(result);
        } else {
          // Small delay for mobile browsers to process auth state
          if (mobile.isMobile) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          router.push(redirectTo);
        }
      } else if (result.error) {
        setError(result.error);
        setCrisisSupport(result.crisisSupport);
        
        if (onAuthError) {
          onAuthError(result.error, result.crisisSupport);
        }
      } else if (result.authMethod === 'redirect') {
        // Redirect in progress, don't show error
        console.log('🔐 Redirect authentication in progress...');
      } else if (result.authMethod === 'emergency-bypass') {
        // Emergency bypass activated
        setCrisisSupport(result.crisisSupport);
      }

    } catch (err: any) {
      console.error('🚨 Crisis-safe auth error:', err);
      
      const errorMessage = mobile.crisisContext
        ? "You're safe here. Let's try a different approach or access help directly."
        : "Authentication encountered an issue. Please try again when ready.";
      
      setError(errorMessage);
      
      if (onAuthError) {
        onAuthError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mobile detection is complete
  if (!mobile) {
    return (
      <div className="w-full flex justify-center items-center py-3 px-4 border border-sage-300/30 rounded-xl text-white bg-sage-500/20 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
        Preparing secure sign-in...
      </div>
    );
  }

  const baseClassName = `w-full flex justify-center items-center py-3 px-4 border border-sage-300/30 rounded-xl text-white bg-sage-500/20 backdrop-blur-sm hover:bg-sage-500/30 hover:border-sage-300/50 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe ${className}`;
  
  const mobileStyles = {
    minHeight: mobile.isMobile ? '60px' : '52px',
    fontSize: mobile.isMobile ? '18px' : '16px',
    touchAction: 'manipulation' as const,
    fontWeight: '500',
    padding: mobile.isMobile ? '20px 24px' : '12px 16px'
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAuthentication}
        disabled={loading}
        className={baseClassName}
        style={mobileStyles}
        aria-label="Sign in with Google - Crisis-safe authentication"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            {mobile.requiresRedirect ? 'Redirecting safely...' : 'Connecting safely...'}
          </>
        ) : (
          <>
            <span className="mr-3">🔐</span>
            {children || (mobile.requiresRedirect 
              ? 'Continue with Google (Safe Mode)' 
              : 'Continue with Google'
            )}
          </>
        )}
      </button>

      {/* Crisis Support Display */}
      {crisisSupport && (
        <div className="mt-6 p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-400/20 rounded-2xl backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-400/30 rounded-full flex items-center justify-center mt-1">
              <span className="text-red-200 text-sm">!</span>
            </div>
            <div className="flex-1">
              <p className="text-red-100 text-sm leading-relaxed mb-3">
                We care about your safety. Help is available right now without needing to sign in.
              </p>
              
              <div className="space-y-2">
                {crisisSupport.emergencyOptions
                  .filter((option: any) => option.priority === 'crisis')
                  .map((option: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (option.action.startsWith('tel:') || option.action.startsWith('sms:')) {
                        window.location.href = option.action;
                      } else {
                        router.push(option.action);
                      }
                    }}
                    className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-3"
                    style={{
                      minHeight: mobile.isMobile ? '56px' : '48px',
                      fontSize: mobile.isMobile ? '16px' : '14px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <span className="text-xl">
                      {option.action.startsWith('tel:988') ? '🆘' : 
                       option.action.startsWith('sms:') ? '💬' : 
                       option.action.startsWith('tel:911') ? '🚨' : '🏠'}
                    </span>
                    <span>{option.label}</span>
                  </button>
                ))}
                
                {crisisSupport.emergencyOptions
                  .filter((option: any) => option.priority !== 'crisis')
                  .slice(0, 2)
                  .map((option: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (option.action.startsWith('/')) {
                        router.push(option.action);
                      } else {
                        window.location.href = option.action;
                      }
                    }}
                    className="w-full p-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium transition-all duration-200 flex items-center gap-3"
                    style={{
                      minHeight: mobile.isMobile ? '48px' : '40px',
                      fontSize: mobile.isMobile ? '16px' : '14px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <span className="text-xl">🏠</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Display */}
      {error && !crisisSupport && (
        <div className="mt-4 p-4 bg-orange-500/10 border-orange-500/20 rounded-lg touch-safe">
          <p className="text-orange-200 text-sm text-center mb-3">{error}</p>
          
          {mobile.crisisContext && (
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = 'tel:988'}
                className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                style={{
                  minHeight: mobile.isMobile ? '48px' : '40px',
                  touchAction: 'manipulation'
                }}
              >
                🆘 Call 988 Crisis Line
              </button>
              <button
                onClick={() => router.push('/guest/journal')}
                className="w-full p-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium transition-all duration-200"
                style={{
                  minHeight: mobile.isMobile ? '48px' : '40px',
                  touchAction: 'manipulation'
                }}
              >
                🏠 Access Safe Journaling Space
              </button>
            </div>
          )}
          
          {!mobile.crisisContext && (
            <p className="text-white/60 text-xs text-center">
              Need help? {' '}
              <button 
                onClick={() => window.location.href = 'tel:988'}
                className="text-sage-200 underline hover:text-white hover:scale-105 touch-safe transition-all duration-300 ease-out"
                style={{ minHeight: '32px', padding: '4px 8px', touchAction: 'manipulation' }}
              >
                988 Crisis Line
              </button>
            </p>
          )}
        </div>
      )}

      {/* Mobile Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-300">
          <summary className="cursor-pointer">Mobile Debug Info</summary>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify({
              browser: mobile.browserName,
              requiresRedirect: mobile.requiresRedirect,
              supportsPopups: mobile.supportsPopups,
              crisisContext: mobile.crisisContext,
              deviceStress: mobile.deviceStress,
              batteryLevel: mobile.batteryLevel,
              isPrivateBrowsing: mobile.isPrivateBrowsing
            }, null, 2)}
          </pre>
        </details>
      )}
    </>
  );
}