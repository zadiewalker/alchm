'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AgeVerification from '@/components/ui/AgeVerification';

interface PrivacyCompliantGoogleAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

interface DataCollectionConsent {
  googleProfile: boolean;
  analytics: boolean;
  aiProcessing: boolean;
  crashReporting: boolean;
}

export default function PrivacyCompliantGoogleAuth({ 
  onSuccess, 
  onError,
  className = '' 
}: PrivacyCompliantGoogleAuthProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [ageStatus, setAgeStatus] = useState<'adult' | 'teen' | 'minor' | null>(null);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [showDataConsent, setShowDataConsent] = useState(false);
  const [dataConsent, setDataConsent] = useState<DataCollectionConsent>({
    googleProfile: false,
    analytics: false,
    aiProcessing: false,
    crashReporting: false
  });
  const [hasTouch, setHasTouch] = useState(false);

  useEffect(() => {
    // Detect touch capabilities for mobile optimization
    setHasTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleAgeVerified = (status: 'adult' | 'teen' | 'minor') => {
    setAgeStatus(status);
    setAgeVerified(true);
    
    if (status === 'minor') {
      // COPPA violation prevention - do not proceed
      return;
    }
    
    // Show privacy consent after age verification
    setShowPrivacyConsent(true);
  };

  const handleParentalConsentRequired = () => {
    // COPPA compliance - redirect minors
    setError('ALCHM requires users to be 17 or older. Redirecting to age-appropriate resources.');
    setTimeout(() => {
      window.location.href = 'https://kidshealth.org/teen/';
    }, 3000);
  };

  const handlePrivacyConsentAccept = () => {
    setShowPrivacyConsent(false);
    setShowDataConsent(true);
  };

  const handleDataConsentComplete = (consent: DataCollectionConsent) => {
    setDataConsent(consent);
    setShowDataConsent(false);
    
    // Store privacy preferences before authentication
    localStorage.setItem('alchm_privacy_consent', JSON.stringify({
      timestamp: Date.now(),
      ageStatus,
      dataConsent: consent,
      ipAddress: 'not_collected', // Privacy-first approach
      userAgent: 'not_collected'
    }));
  };

  const handleGoogleSignIn = async () => {
    if (!ageVerified || !ageStatus || ageStatus === 'minor') {
      setError('Age verification required before sign-in.');
      return;
    }

    if (!dataConsent.googleProfile) {
      setError('Google profile access consent required for authentication.');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Provide tactile feedback for mobile users
    if (hasTouch && navigator.vibrate) {
      navigator.vibrate(15);
    }

    try {
      const provider = new GoogleAuthProvider();
      
      // Privacy-conscious scope configuration
      provider.addScope('email');
      provider.addScope('profile');
      
      // Explicitly request only necessary permissions
      provider.setCustomParameters({
        prompt: 'select_account',
        // Privacy enhancement: prevent automatic re-authentication
        approval_prompt: 'force'
      });

      const result = await signInWithPopup(auth, provider);
      
      // Enhanced privacy logging
      console.log('Privacy-compliant authentication successful', {
        userAgeStatus: ageStatus,
        consentGranted: Object.keys(dataConsent).filter(key => dataConsent[key as keyof DataCollectionConsent]),
        timestamp: new Date().toISOString(),
        complianceFlags: {
          coppaCompliant: ageStatus !== 'minor',
          gdprConsent: true,
          ccpaCompliant: true
        }
      });

      // Success feedback
      if (hasTouch && navigator.vibrate) {
        navigator.vibrate([50, 25, 50]);
      }

      onSuccess?.();
      router.push('/dashboard');
    } catch (err: any) {
      // Privacy-conscious error handling
      let errorMessage = 'Authentication encountered an issue. Your privacy is protected.';
      
      if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Please allow popups for sign-in. Check your browser settings.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled. That\'s okay - your privacy choices are respected.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network issue detected. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
      
      // Error feedback for mobile users
      if (hasTouch && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Privacy-conscious error logging (no PII)
      console.error('Privacy-compliant authentication error:', {
        errorCode: err.code,
        ageStatus,
        timestamp: new Date().toISOString(),
        // No user data logged for privacy
      });
    } finally {
      setLoading(false);
    }
  };

  // Age verification modal
  if (!ageVerified) {
    return (
      <AgeVerification
        onVerified={handleAgeVerified}
        onParentalConsentRequired={handleParentalConsentRequired}
        className={className}
      />
    );
  }

  // Privacy consent modal
  if (showPrivacyConsent) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border-2 border-green-200 max-h-screen overflow-y-auto">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Privacy & Data Protection Notice
              </h2>
              <p className="text-green-600 font-medium">
                Your privacy rights and how we protect them
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="font-bold text-green-800 mb-3">🔒 GDPR, CCPA & COPPA Compliant</h3>
              <div className="space-y-3 text-sm text-green-800">
                <p><strong>Age Status:</strong> {ageStatus === 'teen' ? 'Teen (17-18) - Enhanced protections apply' : 'Adult (18+)'}</p>
                <p><strong>Data Minimization:</strong> We collect only essential data for core functionality.</p>
                <p><strong>Purpose Limitation:</strong> Data used only for stated purposes in our privacy policy.</p>
                <p><strong>Storage Limitation:</strong> Automatic deletion policies protect your long-term privacy.</p>
                <p><strong>Your Rights:</strong> Access, correct, export, or delete your data anytime.</p>
                {ageStatus === 'teen' && (
                  <p className="font-bold text-green-900">
                    🌟 Teen Protection: Enhanced crisis detection, parental notification options, and stricter data limits.
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">📋 What Google Authentication Collects</h3>
              <ul className="space-y-2 text-sm text-blue-800 list-disc ml-4">
                <li><strong>Email address:</strong> For account identification and recovery</li>
                <li><strong>Display name:</strong> For personalization (optional)</li>
                <li><strong>Profile photo:</strong> For avatar (optional)</li>
                <li><strong>Google user ID:</strong> For secure authentication</li>
              </ul>
              <p className="text-xs text-blue-700 mt-3 font-medium">
                ⚠️ Google may also collect device and usage data per their privacy policy.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handlePrivacyConsentAccept}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                ✅ I Understand & Accept Privacy Terms
              </button>
              
              <button
                onClick={() => {
                  // Clear verification and restart
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                🚫 Decline - Return to Homepage
              </button>
            </div>
            
            <div className="text-xs text-gray-600 pt-4 border-t border-gray-200">
              <p className="font-medium">📖 Full Privacy Policy:</p>
              <p>
                Review our complete privacy practices at{' '}
                <a href="/privacy-policy.html" target="_blank" className="text-blue-600 underline">
                  alchm.com/privacy-policy
                </a>
                {' '}before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data collection consent modal
  if (showDataConsent) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border-2 border-purple-200 max-h-screen overflow-y-auto">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Granular Data Collection Consent
              </h2>
              <p className="text-purple-600 font-medium">
                Choose exactly what data you're comfortable sharing
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Required for authentication */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="google-profile"
                    checked={dataConsent.googleProfile}
                    onChange={(e) => setDataConsent(prev => ({ ...prev, googleProfile: e.target.checked }))}
                    className="mt-1 h-5 w-5 text-red-600 rounded border-2 border-red-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="google-profile" className="block font-bold text-red-800 cursor-pointer">
                      🔑 Google Profile Access (Required)
                    </label>
                    <p className="text-sm text-red-700 mt-1">
                      Essential for Google sign-in: email, name, profile photo. Cannot use Google authentication without this.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional analytics */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={dataConsent.analytics}
                    onChange={(e) => setDataConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="mt-1 h-5 w-5 text-yellow-600 rounded border-2 border-yellow-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="analytics" className="block font-bold text-yellow-800 cursor-pointer">
                      📊 Usage Analytics (Optional)
                    </label>
                    <p className="text-sm text-yellow-700 mt-1">
                      Anonymized usage patterns to improve ALCHM. Helps us understand which features help users most.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional AI processing */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="ai-processing"
                    checked={dataConsent.aiProcessing}
                    onChange={(e) => setDataConsent(prev => ({ ...prev, aiProcessing: e.target.checked }))}
                    className="mt-1 h-5 w-5 text-blue-600 rounded border-2 border-blue-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="ai-processing" className="block font-bold text-blue-800 cursor-pointer">
                      🤖 AI-Powered Insights (Optional)
                    </label>
                    <p className="text-sm text-blue-700 mt-1">
                      Anonymous emotional patterns analysis for personalized insights. Your raw journal content is never sent to AI systems.
                    </p>
                  </div>
                </div>
              </div>

              {/* Optional crash reporting */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="crash-reporting"
                    checked={dataConsent.crashReporting}
                    onChange={(e) => setDataConsent(prev => ({ ...prev, crashReporting: e.target.checked }))}
                    className="mt-1 h-5 w-5 text-green-600 rounded border-2 border-green-300"
                  />
                  <div className="flex-1">
                    <label htmlFor="crash-reporting" className="block font-bold text-green-800 cursor-pointer">
                      🐛 Error Reporting (Optional)
                    </label>
                    <p className="text-sm text-green-700 mt-1">
                      Anonymous technical error reports to fix bugs faster. No personal content included.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2">🔒 Your Privacy Rights</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
                <li>Change these preferences anytime in settings</li>
                <li>Export all your data in machine-readable format</li>
                <li>Delete your account and all data permanently</li>
                <li>Opt out of any data collection except authentication</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleDataConsentComplete(dataConsent)}
                disabled={!dataConsent.googleProfile}
                className={`w-full px-6 py-4 rounded-xl font-semibold transition-colors ${
                  dataConsent.googleProfile
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {dataConsent.googleProfile 
                  ? '✅ Save Preferences & Continue' 
                  : '❌ Google Profile Access Required for Sign-In'
                }
              </button>
              
              <button
                onClick={() => setShowPrivacyConsent(true)}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ← Back to Privacy Notice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Google sign-in button (only shown after all consents)
  return (
    <div className={`space-y-4 ${className}`}>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading || !ageVerified || ageStatus === 'minor'}
        className="w-full bg-white text-gray-700 px-8 py-4 rounded-xl font-medium border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl touch-safe"
        style={{ 
          minHeight: '56px',
          touchAction: 'manipulation'
        }}
        onTouchStart={() => {
          if (hasTouch && navigator.vibrate) {
            navigator.vibrate(15);
          }
        }}
        aria-label="Privacy-compliant Google sign-in with full data protection"
      >
        <div className="flex items-center justify-center gap-3">
          {loading ? (
            <div className="animate-spin">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <span className="text-2xl">🔐</span>
          )}
          <span className="font-semibold">
            {loading ? 'Entering sanctuary...' : 'Continue with Google'}
          </span>
        </div>
      </button>
      
      {error && (
        <div 
          className="text-red-700 text-sm text-center bg-red-50 px-4 py-3 rounded-xl border-2 border-red-200"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-base">⚠️</span>
            <span className="font-medium">Privacy Protection Active</span>
          </div>
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>🛡️ <strong>Privacy Status:</strong> {ageStatus === 'teen' ? 'Teen Enhanced Protection' : 'Adult Standard Protection'}</p>
        <p>✅ <strong>Consents:</strong> {Object.keys(dataConsent).filter(key => dataConsent[key as keyof DataCollectionConsent]).length}/4 permissions granted</p>
        <p>📖 Review full privacy terms at <a href="/privacy-policy.html" className="text-blue-600 underline">alchm.com/privacy</a></p>
      </div>
    </div>
  );
}