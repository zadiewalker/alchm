/**
 * Crisis-Safe Authentication Flow
 * 
 * Trauma-informed authentication component that:
 * - Detects crisis keywords in real-time
 * - Provides immediate emergency access bypass
 * - Displays crisis resources without forcing use
 * - Maintains user agency while ensuring safety
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { emergencyAuthBypass, EmergencyBypassSession } from '@/lib/crisis/emergency-authentication-bypass';
import { CrisisFloatingButton } from '@/components/ui/CrisisFloatingButtonNew';
import { useRouter } from 'next/navigation';

interface CrisisSafeAuthProps {
  onAuthSuccess: (session: any) => void;
  onEmergencyBypass: (guestSession: EmergencyBypassSession) => void;
  className?: string;
}

export function CrisisSafeAuthenticationFlow({ 
  onAuthSuccess, 
  onEmergencyBypass, 
  className = '' 
}: CrisisSafeAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<'mild' | 'moderate' | 'severe' | 'critical'>('mild');
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false);
  const [emergencySession, setEmergencySession] = useState<EmergencyBypassSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const router = useRouter();

  // Mobile detection for touch-optimized UI
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Real-time crisis keyword detection
  const handleTextChange = useCallback((text: string, field: 'email' | 'password') => {
    if (field === 'email') setEmail(text);
    if (field === 'password') setPassword(text);

    // Check for crisis keywords in any text input
    const crisisAnalysis = emergencyAuthBypass.detectCrisisKeywords(text);
    
    if (crisisAnalysis.hasCrisisContent) {
      setCrisisDetected(true);
      setCrisisLevel(crisisAnalysis.crisisLevel);
      
      // Show emergency options immediately for severe/critical cases
      if (crisisAnalysis.immediateIntervention) {
        setShowEmergencyOptions(true);
        
        // Gentle haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    }
  }, []);

  // Create emergency guest session
  const handleEmergencyAccess = async () => {
    setLoading(true);
    
    try {
      const crisisDetection = emergencyAuthBypass.detectCrisisKeywords(`${email} ${password}`);
      
      const guestSession = await emergencyAuthBypass.createEmergencyGuestSession({
        crisisDetection,
        ipAddress: await getUserIP(),
        userAgent: navigator.userAgent,
        triggerSource: 'manual_trigger'
      });

      setEmergencySession(guestSession);
      onEmergencyBypass(guestSession);
      
      // Success haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
      
    } catch (error) {
      console.error('Emergency access creation failed:', error);
      // Fallback: redirect to crisis resources directly
      window.location.href = 'tel:988';
    } finally {
      setLoading(false);
    }
  };

  // Handle standard authentication with crisis detection
  const handleStandardAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      // Check for crisis content before authentication
      const combinedText = `${email} ${password}`;
      const crisisAnalysis = emergencyAuthBypass.detectCrisisKeywords(combinedText);
      
      if (crisisAnalysis.hasCrisisContent && crisisAnalysis.immediateIntervention) {
        // Auto-create emergency session for critical cases
        await handleEmergencyAccess();
        return;
      }

      // Attempt standard authentication (this would call your auth service)
      // For now, simulating auth failure to demonstrate crisis handling
      const authResult = await simulateAuthentication(email, password);
      
      if (authResult.success) {
        onAuthSuccess(authResult.session);
      } else {
        // Generate crisis-safe error message
        const errorResponse = emergencyAuthBypass.generateCrisisSafeErrorMessage(
          !email || !email.includes('@'),
          !password || password.length < 6,
          crisisAnalysis.hasCrisisContent
        );
        
        setAuthError(errorResponse.message);
        
        if (errorResponse.showEmergencyBypass) {
          setShowEmergencyOptions(true);
        }
      }
      
    } catch (error) {
      const errorMessage = crisisDetected 
        ? "We care about your safety. You can access support without signing in."
        : "Something gentle went wrong. Take a breath - you're safe here.";
      
      setAuthError(errorMessage);
      
      if (crisisDetected) {
        setShowEmergencyOptions(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get crisis resources for current user context
  const getCrisisResources = () => {
    if (!emergencySession) return [];
    
    return emergencyAuthBypass.getCrisisResources(emergencySession, {
      // User context would be determined from available info
    });
  };

  // Track resource access
  const handleResourceAccess = async (resourceName: string) => {
    if (emergencySession) {
      await emergencyAuthBypass.trackResourceAccess(emergencySession.sessionToken, resourceName);
    }
  };

  const panicSafeNavigation = emergencyAuthBypass.getPanicSafeNavigation();

  return (
    <div className={`crisis-safe-auth-flow ${className}`}>
      {/* Crisis Alert Banner */}
      {crisisDetected && (
        <div className="mb-6 p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-400/20 rounded-2xl backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-400/30 rounded-full flex items-center justify-center mt-1">
              <span className="text-red-200 text-sm">!</span>
            </div>
            <div className="flex-1">
              <p className="text-red-100 text-sm leading-relaxed mb-3">
                We care about you and want you to be safe. If you're having thoughts of self-harm, 
                you don't need to sign in to get help right now.
              </p>
              
              {!showEmergencyOptions ? (
                <button
                  onClick={() => setShowEmergencyOptions(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                  style={{
                    minHeight: isMobile ? '48px' : '40px',
                    fontSize: isMobile ? '16px' : '14px',
                    touchAction: 'manipulation'
                  }}
                >
                  I need help right now
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-2">
                    {panicSafeNavigation
                      .filter(nav => nav.safetyLevel === 'immediate')
                      .map((nav, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (nav.action.startsWith('tel:') || nav.action.startsWith('sms:')) {
                              window.location.href = nav.action;
                              handleResourceAccess(nav.label);
                            } else if (nav.action === 'guest_journal') {
                              handleEmergencyAccess();
                            }
                          }}
                          className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-3"
                          style={{
                            minHeight: isMobile ? '56px' : '48px',
                            fontSize: isMobile ? '16px' : '14px',
                            touchAction: 'manipulation'
                          }}
                        >
                          <span className="text-xl">{nav.icon}</span>
                          <span>{nav.label}</span>
                        </button>
                      ))}
                  </div>
                  
                  <button
                    onClick={() => setShowEmergencyOptions(false)}
                    className="text-sm text-red-200/80 hover:text-red-100 underline"
                  >
                    Hide emergency options
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standard Auth Form */}
      <form onSubmit={handleStandardAuth} className="space-y-6">
        {/* Error Display with Crisis Support */}
        {authError && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-200 text-sm text-center mb-2">{authError}</p>
            {!crisisDetected && (
              <div className="text-center">
                <p className="text-white/60 text-xs mb-2">If you need immediate support:</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = 'tel:988';
                      handleResourceAccess('988 Crisis Line');
                    }}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    style={{
                      minHeight: '40px',
                      touchAction: 'manipulation'
                    }}
                  >
                    📞 Call 988
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = 'sms:741741&body=HOME';
                      handleResourceAccess('Crisis Text Line');
                    }}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                    style={{
                      minHeight: '40px',
                      touchAction: 'manipulation'
                    }}
                  >
                    💬 Text HOME
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="crisis-safe-email" className="sr-only">Email address</label>
            <input
              id="crisis-safe-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => handleTextChange(e.target.value, 'email')}
              className="w-full px-4 py-3 border border-white/20 placeholder-white/60 text-white bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              style={{
                minHeight: isMobile ? '60px' : '52px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Email address"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="crisis-safe-password" className="sr-only">Password</label>
            <input
              id="crisis-safe-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => handleTextChange(e.target.value, 'password')}
              className="w-full px-4 py-3 border border-white/20 placeholder-white/60 text-white bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              style={{
                minHeight: isMobile ? '60px' : '52px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Password"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-sage-400 hover:bg-sage-500 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50"
          style={{
            minHeight: isMobile ? '56px' : '52px',
            fontSize: isMobile ? '18px' : '16px',
            touchAction: 'manipulation'
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              {crisisDetected ? 'Creating safe access...' : 'Signing in...'}
            </div>
          ) : (
            'Sign In Safely'
          )}
        </button>
      </form>

      {/* Emergency Support Options */}
      {showEmergencyOptions && !crisisDetected && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-white font-medium mb-3 text-center">Need immediate support?</h3>
          <div className="grid gap-2">
            {panicSafeNavigation
              .filter(nav => nav.safetyLevel === 'supportive')
              .map((nav, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (nav.action === 'guest_journal') {
                      handleEmergencyAccess();
                    } else if (nav.action === 'breathing_exercises') {
                      router.push('/emergency/breathing');
                    }
                  }}
                  className="w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 flex items-center gap-3"
                  style={{
                    minHeight: '48px',
                    touchAction: 'manipulation'
                  }}
                >
                  <span className="text-lg">{nav.icon}</span>
                  <span>{nav.label}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Persistent Crisis Support Button */}
      <CrisisFloatingButton 
        position="bottom-right"
        size={isMobile ? 'large' : 'default'}
      />
    </div>
  );
}

// Helper functions
async function getUserIP(): Promise<string | undefined> {
  try {
    // This would use your IP detection service
    return undefined;
  } catch {
    return undefined;
  }
}

async function simulateAuthentication(email: string, password: string): Promise<{
  success: boolean;
  session?: any;
  error?: string;
}> {
  // Simulate auth delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate auth logic (replace with actual auth service)
  if (email === 'demo@alchm.app' && password === 'demo123') {
    return { success: true, session: { userId: 'demo_user' } };
  }
  
  return { success: false, error: 'Invalid credentials' };
}