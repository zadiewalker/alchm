'use client';

/**
 * Crisis-Safe Mobile Authentication Component
 * Trauma-Informed Mobile OAuth Implementation
 * 
 * This component ensures authentication works flawlessly for users in crisis
 * who need immediate access to support features on their mobile devices.
 * 
 * CRISIS DESIGN PRINCIPLES:
 * - Large touch targets for trembling hands (60px+ minimum)
 * - Clear visual feedback for every interaction
 * - Gentle error messages that don't increase distress
 * - Works on low-end devices and slow connections
 * - Accessible during panic attacks and dissociation
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogleMobile, 
  detectMobileCapabilities, 
  type MobileDetection,
  type MobileAuthResult 
} from '@/lib/auth/mobile-auth-optimizer';

interface CrisisSafeMobileAuthProps {
  onAuthSuccess: (user: User, method: string) => void;
  onAuthError: (error: string) => void;
  redirectTo?: string;
  disabled?: boolean;
}

export function CrisisSafeMobileAuth({
  onAuthSuccess,
  onAuthError,
  redirectTo = '/dashboard',
  disabled = false
}: CrisisSafeMobileAuthProps) {
  const [loading, setLoading] = useState(false);
  const [mobileCapabilities, setMobileCapabilities] = useState<MobileDetection | null>(null);
  const [authMethod, setAuthMethod] = useState<'popup' | 'redirect' | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'slow'>('online');

  useEffect(() => {
    const capabilities = detectMobileCapabilities();
    setMobileCapabilities(capabilities);
    
    // Monitor connection quality for crisis users
    const updateConnection = () => {
      if (typeof window !== 'undefined') {
        if (!navigator.onLine) {
          setConnectionStatus('offline');
        } else if ('connection' in navigator && (navigator as any).connection?.effectiveType === '2g') {
          setConnectionStatus('slow');
        } else {
          setConnectionStatus('online');
        }
      }
    };

    updateConnection();
    typeof window !== 'undefined' && window.addEventListener('online', updateConnection);
    typeof window !== 'undefined' && window.addEventListener('offline', updateConnection);
    
    return () => {
      typeof window !== 'undefined' && window.removeEventListener('online', updateConnection);
      typeof window !== 'undefined' && window.removeEventListener('offline', updateConnection);
    };
  }, []);

  const handleMobileAuth = async () => {
    if (!mobileCapabilities) return;

    setLoading(true);
    
    // Crisis-safe haptic feedback
    if (mobileCapabilities.isTouch && typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15); // Gentle confirmation vibration
    }

    try {
      console.log('🔐 Crisis-safe mobile auth starting...', {
        capabilities: mobileCapabilities,
        connection: connectionStatus,
        timestamp: new Date().toISOString()
      });

      const result: MobileAuthResult = await signInWithGoogleMobile();

      console.log('🔐 Crisis-safe auth result:', {
        success: !!result.user,
        method: result.authMethod,
        error: result.error,
        requiresAgeVerification: result.requiresAgeVerification
      });

      if (result.error) {
        onAuthError(result.error);
      } else if (result.user) {
        setAuthMethod(result.authMethod);
        
        // Success haptic pattern for reassurance
        if (mobileCapabilities.isTouch && typeof window !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]); // Success pattern
        }
        
        onAuthSuccess(result.user, result.authMethod);
      } else {
        onAuthError('Authentication is processing. Please wait a moment and try again if needed.');
      }

    } catch (error: any) {
      console.error('🚨 Crisis-safe mobile auth error:', error);
      
      // Trauma-informed error handling
      const traumaInformedError = getTraumaInformedError(error, mobileCapabilities, connectionStatus);
      onAuthError(traumaInformedError);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not mobile
  if (!mobileCapabilities?.isMobile) {
    return null;
  }

  const buttonText = getButtonText(loading, authMethod, mobileCapabilities, connectionStatus);
  const buttonStyle = getCrisisButtonStyle(mobileCapabilities, connectionStatus, disabled);

  return (
    <div className="crisis-safe-mobile-auth">
      {/* Connection Status Indicator */}
      {connectionStatus !== 'online' && (
        <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-200 text-sm text-center">
            {connectionStatus === 'offline' 
              ? '📶 Offline - Authentication will work when connection returns'
              : '🐌 Slow connection detected - Authentication may take extra time'
            }
          </p>
        </div>
      )}

      {/* Crisis-Accessible Google Auth Button */}
      <button
        type="button"
        onClick={handleMobileAuth}
        disabled={loading || disabled || connectionStatus === 'offline'}
        className="crisis-auth-button w-full flex justify-center items-center border border-sage-300/30 rounded-xl text-white bg-sage-500/20 backdrop-blur-sm hover:bg-sage-500/30 hover:border-sage-300/50 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe"
        style={buttonStyle}
        aria-label="Sign in with Google - Crisis-safe mobile authentication"
        aria-describedby="auth-help-text"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            <span className="loading-text">{getLoadingText(authMethod, connectionStatus)}</span>
          </>
        ) : (
          <>
            <span className="mr-3 text-xl">🔐</span>
            <span className="button-text">{buttonText}</span>
          </>
        )}
      </button>

      {/* Helpful Context for Crisis Users */}
      <div id="auth-help-text" className="mt-3 text-center">
        <p className="text-white/70 text-sm">
          {mobileCapabilities.supportsPopups 
            ? 'Secure sign-in will open briefly'
            : 'Secure sign-in will redirect temporarily'
          }
        </p>
        {connectionStatus === 'slow' && (
          <p className="text-blue-200 text-xs mt-1">
            Extra time needed for your safety on slow connection
          </p>
        )}
      </div>

      {/* Browser-Specific Guidance */}
      {mobileCapabilities.browserName === 'ios-safari' && (
        <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-yellow-200 text-xs text-center">
            📱 Safari users: If sign-in doesn't work, try enabling "Allow Pop-ups" in Settings
          </p>
        </div>
      )}
      
      {mobileCapabilities.browserName === 'android-chrome' && (
        <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-green-200 text-xs text-center">
            🤖 Chrome will redirect safely for sign-in
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Get trauma-informed error message based on context
 */
function getTraumaInformedError(
  error: any, 
  capabilities: MobileDetection, 
  connection: string
): string {
  // Connection-related errors
  if (connection === 'offline') {
    return 'Connection lost. Your data is safe. Try again when back online.';
  }
  
  if (connection === 'slow' && error.code === 'auth/network-request-failed') {
    return 'Slow connection detected. Taking extra time for your safety - please wait.';
  }

  // iOS-specific errors
  if (capabilities.isIOS) {
    if (error.code === 'auth/popup-blocked') {
      return 'Safari blocked the sign-in window. Please enable popups in Safari settings and try again.';
    }
    if (error.code === 'auth/cancelled-popup-request') {
      return 'Sign-in was interrupted. No worries - take your time when you\'re ready.';
    }
  }

  // Android-specific errors
  if (capabilities.isAndroid) {
    if (error.code === 'auth/popup-blocked') {
      return 'Chrome blocked the sign-in popup. Please allow popups for this site and try again.';
    }
  }

  // General trauma-informed errors
  if (error.code === 'auth/popup-closed-by-user') {
    return 'Sign-in was cancelled. That\'s okay - we\'ll be here when you\'re ready to try again.';
  }
  
  if (error.code === 'auth/network-request-failed') {
    return 'Connection hiccup detected. Your safety is preserved - please try again when ready.';
  }
  
  if (error.code === 'auth/unauthorized-domain') {
    return 'Please use alchmapp.web.app or alchm-digital-sanctuary.web.app for secure access.';
  }

  // Default trauma-informed message
  return 'Authentication encountered a gentle pause. You\'re safe here - please try again when you feel ready.';
}

/**
 * Get appropriate button text based on state
 */
function getButtonText(
  loading: boolean, 
  method: 'popup' | 'redirect' | null,
  capabilities: MobileDetection,
  connection: string
): string {
  if (loading) return '';
  
  if (connection === 'offline') return 'Offline - Will work when connected';
  if (connection === 'slow') return 'Continue with Google (Slow Connection)';
  
  if (capabilities.supportsPopups) {
    return 'Continue with Google';
  } else {
    return 'Continue with Google (Mobile)';
  }
}

/**
 * Get loading text based on auth method and connection
 */
function getLoadingText(method: 'popup' | 'redirect' | null, connection: string): string {
  if (connection === 'slow') return 'Connecting safely on slow network...';
  if (method === 'redirect') return 'Redirecting securely...';
  if (method === 'popup') return 'Opening secure sign-in...';
  return 'Connecting safely...';
}

/**
 * Get crisis-optimized button styling
 */
function getCrisisButtonStyle(
  capabilities: MobileDetection,
  connection: string,
  disabled: boolean
): React.CSSProperties {
  const baseHeight = capabilities.isMobile ? 60 : 52; // Larger for mobile
  const extraHeight = connection === 'slow' ? 8 : 0; // Extra height for slow connections
  
  return {
    minHeight: `${baseHeight + extraHeight}px`,
    fontSize: capabilities.isMobile ? '18px' : '16px',
    padding: capabilities.isMobile ? '20px 24px' : '12px 16px',
    touchAction: 'manipulation',
    fontWeight: '500',
    letterSpacing: '0.025em',
    lineHeight: 1.4,
    // Enhanced visual feedback during crisis
    boxShadow: disabled ? 'none' : '0 4px 20px rgba(164, 183, 146, 0.15)',
    border: connection === 'slow' ? '2px solid rgba(59, 130, 246, 0.3)' : undefined
  };
}

export default CrisisSafeMobileAuth;