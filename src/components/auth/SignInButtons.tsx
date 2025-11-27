"use client";

/*
 * TRAUMA-INFORMED MOBILE OPTIMIZATION
 * This component has been optimized for users in emotional distress:
 * - Touch targets minimum 60px for trembling hands
 * - Gentle loading feedback ("Connecting safely...")  
 * - Prevents accidental touches with proper spacing
 * - Touch manipulation optimized for mobile devices
 */

import { getFirebaseAuth } from "../../lib/firebase";
import {
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signInAnonymously,
  Auth
} from "firebase/auth";
import { ReliableAuthSystem } from "@/lib/auth/ReliableAuthSystem";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
// Dynamic imports to prevent SSR issues
const monitorAuthFlow = () => ({ recordTokenFetch: () => {}, recordSessionCreation: () => {}, recordComplete: () => {} });

// Lazy load AccountLinker to reduce initial bundle size
const AccountLinker = dynamic(() => import("./AccountLinker").then(mod => ({ default: mod.AccountLinker })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-12 bg-white/20 rounded-full" />
});

// Lazy load OfflineAuthFallback
const OfflineAuthFallback = dynamic(() => import("./OfflineAuthFallback").then(mod => ({ default: mod.OfflineAuthFallback })), {
  ssr: false,
  loading: () => null
});

// Lazy load EmergencyBypassAuth
const EmergencyBypassAuth = dynamic(() => import("./EmergencyBypassAuth").then(mod => ({ default: mod.EmergencyBypassAuth })), {
  ssr: false,
  loading: () => null
});

// Lazy load KheperaErrorRecovery
const KheperaErrorRecovery = dynamic(() => import("./KheperaErrorRecovery").then(mod => ({ default: mod.KheperaErrorRecovery })), {
  ssr: false,
  loading: () => null
});

// Memoize Safari detection to avoid repeated regex checks - only execute in browser
const isSafariOriOS = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (/Safari/.test(ua) && !/Chrome/.test(ua)) || /iPhone|iPad|iPod/.test(ua);
};

export function SignInButtons() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccountLinker, setShowAccountLinker] = useState(false);
  const [linkingData, setLinkingData] = useState<{ email: string; pendingCredential: any } | null>(null);
  const [showOfflineFallback, setShowOfflineFallback] = useState(false);
  const [showEmergencyBypass, setShowEmergencyBypass] = useState(false);
  const [showKheperaRecovery, setShowKheperaRecovery] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [isInCrisis, setIsInCrisis] = useState(false);
  const router = useRouter();
  
  // Enhanced performance state with network detection
  const [performanceState, setPerformanceState] = useState({
    tier: { name: 'medium' },
    deviceCapabilities: { batteryLevel: 1, isCharging: true, networkType: 'unknown', memoryGB: 4 },
    shouldUseAnimations: true,
    transitionDuration: 200,
    networkQuality: 'unknown',
    connectionSpeed: 'unknown'
  });
  
  // Network quality detection for timeout optimization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const detectNetworkQuality = async () => {
      try {
        // Method 1: Network Information API
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          const effectiveType = connection?.effectiveType;
          const downlink = connection?.downlink;
          
          setPerformanceState(prev => ({
            ...prev,
            networkQuality: effectiveType || 'unknown',
            connectionSpeed: downlink ? `${downlink}mbps` : 'unknown'
          }));
          
          console.log(`[Network] Detected connection: ${effectiveType}, speed: ${downlink}mbps`);
        }
        
        // Method 2: Simple ping test for connection quality
        const startTime = Date.now();
        try {
          await fetch('/api/health/ping', { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          const pingTime = Date.now() - startTime;
          
          let quality = 'good';
          if (pingTime > 2000) quality = 'poor';
          else if (pingTime > 1000) quality = 'fair';
          
          setPerformanceState(prev => ({
            ...prev,
            networkQuality: quality,
            connectionSpeed: `${pingTime}ms ping`
          }));
          
          console.log(`[Network] Ping test: ${pingTime}ms (${quality})`);
        } catch (pingError) {
          console.warn('[Network] Ping test failed:', pingError);
          setPerformanceState(prev => ({
            ...prev,
            networkQuality: 'poor',
            connectionSpeed: 'offline'
          }));
        }
      } catch (error) {
        console.warn('[Network] Quality detection failed:', error);
      }
    };
    
    detectNetworkQuality();
    
    // Re-check network quality every 30 seconds during auth flow
    const networkCheckInterval = setInterval(detectNetworkQuality, 30000);
    
    return () => clearInterval(networkCheckInterval);
  }, []);
  
  // Crisis mode state
  const enableCrisisMode = () => {
    setPerformanceState(prev => ({
      ...prev,
      shouldUseAnimations: false,
      tier: { name: 'ultra-low' }
    }));
  };

  // Initialize Firebase Auth on component mount
  useEffect(() => {
    let mounted = true;
    
    getFirebaseAuth()
      .then((authInstance) => {
        if (mounted) {
          setAuth(authInstance);
        }
      })
      .catch((error) => {
        console.error('Failed to initialize Firebase Auth:', error);
        if (mounted) {
          setError('Authentication service unavailable. Please refresh the page.');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Simplified crisis detection for SSR compatibility
  useEffect(() => {
    // Only run crisis detection in browser
    if (typeof window === 'undefined') return;
    
    const detectCrisisConditions = () => {
      // Simple battery check if available
      if ('getBattery' in navigator) {
        navigator.getBattery?.().then((battery: any) => {
          const criticalBattery = battery.level < 0.15 && !battery.charging;
          if (criticalBattery && !isInCrisis) {
            setIsInCrisis(true);
            enableCrisisMode();
            console.log('[Auth] Crisis mode activated - low battery detected');
          }
        }).catch(() => {
          // Battery API not supported or failed
        });
      }
    };

    detectCrisisConditions();
    
    // Check crisis conditions every 30 seconds during auth
    const crisisCheckInterval = setInterval(detectCrisisConditions, 30000);
    
    return () => clearInterval(crisisCheckInterval);
  }, [isInCrisis]);

  // Optimize auth state handler with useCallback
  const handleAuthUser = useCallback(async (user: any) => {
    if (user) {
      const authPerformance = monitorAuthFlow();
      
      try {
        // Lazy load user bootstrap and analytics
        const [{ upsertUser }, { trackLogin, trackSignUp }] = await Promise.all([
          import("../../lib/user-bootstrap"),
          import("../../lib/analytics")
        ]);
        
        const [userResult, idToken] = await Promise.all([
          upsertUser(user),
          user.getIdToken()
        ]);
        
        authPerformance.recordTokenFetch();
        
        const isNewUser = userResult?.isNew || false;
        const provider = user.providerData[0]?.providerId;
        const providerType = provider === "apple.com" ? "apple" : "email_link";
        
        // Parallel execution of session creation and analytics
        await Promise.all([
          fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid, user }),
          }),
          isNewUser ? trackSignUp(providerType as "apple" | "email_link") 
                    : trackLogin(providerType as "apple" | "email_link")
        ]);
        
        authPerformance.recordSessionCreation();
        
        // Enhanced session persistence for high-stress scenarios
        const userData = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          timestamp: Date.now()
        };
        
        // Multiple persistence strategies for reliability
        try {
          if (typeof window !== 'undefined') {
            // Strategy 1: localStorage (primary)
            localStorage.setItem('alchm_auth_token', idToken);
            localStorage.setItem('alchm_user', JSON.stringify(userData));
            
            // Strategy 2: sessionStorage (backup)
            sessionStorage.setItem('alchm_auth_token_backup', idToken);
            sessionStorage.setItem('alchm_user_backup', JSON.stringify(userData));
            
            // Strategy 3: IndexedDB for persistent storage across sessions
            if ('indexedDB' in window) {
              const request = indexedDB.open('alchm_auth', 1);
              request.onupgradeneeded = (e) => {
                const db = (e.target as any).result;
                if (!db.objectStoreNames.contains('auth')) {
                  db.createObjectStore('auth', { keyPath: 'id' });
                }
              };
              request.onsuccess = (e) => {
                const db = (e.target as any).result;
                const transaction = db.transaction(['auth'], 'readwrite');
                const store = transaction.objectStore('auth');
                store.put({ id: 'session', token: idToken, user: userData });
              };
            }
            
            // Strategy 4: BroadcastChannel for cross-tab persistence
            if ('BroadcastChannel' in window) {
              const channel = new BroadcastChannel('alchm_auth_sync');
              channel.postMessage({ type: 'AUTH_SUCCESS', token: idToken, user: userData });
            }
          }
        } catch (persistenceError) {
          // If storage fails, log but don't block authentication
          console.warn('Session persistence failed, but authentication succeeded:', persistenceError);
        }
        
        authPerformance.recordComplete();
        
        // Crisis-safe post-authentication navigation
        const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "/en/sanctuary";
        
        // Show gentle transition message before navigation
        const transitionMessage = document.createElement('div');
        transitionMessage.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(164, 183, 146, 0.95), rgba(164, 183, 146, 0.98));
            backdrop-filter: blur(20px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="text-align: center; max-width: 320px; padding: 0 20px;">
              <div style="font-size: 32px; margin-bottom: 16px;">🌿</div>
              <h2 style="font-size: 20px; font-weight: 400; margin-bottom: 12px; line-height: 1.4;">
                Welcome to your sanctuary
              </h2>
              <p style="font-size: 14px; opacity: 0.9; line-height: 1.5; margin-bottom: 24px;">
                ${isInCrisis ? 'Crisis support is ready. ' : ''}Taking you to your safe space...
              </p>
              <div style="
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
              "></div>
            </div>
          </div>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        `;
        
        document.body.appendChild(transitionMessage);
        
        // Add a gentle delay to prevent jarring transitions, especially in crisis mode
        const navigationDelay = isInCrisis ? 2000 : 1500;
        
        setTimeout(() => {
          // Preload the destination page for faster loading
          if (redirectUrl.startsWith('/')) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = redirectUrl;
            document.head.appendChild(link);
          }
          
          // Navigate with a smooth transition
          if (typeof window !== 'undefined' && window.history?.pushState) {
            // Use pushState for smoother navigation when possible
            window.history.pushState({}, '', redirectUrl);
            window.location.href = redirectUrl;
          } else {
            window.location.href = redirectUrl;
          }
        }, navigationDelay);
      } catch (e) {
        console.error("Session creation error:", e);
        setBusy(false);
        setError("Authentication failed. Please try again.");
      }
    } else {
      setBusy(false);
    }
  }, []);

  // Enhanced session recovery and redirect handling
  useEffect(() => {
    if (!auth) return;

    // Enhanced session recovery for iOS Safari and high-stress scenarios
    const recoverAuthSession = async () => {
      try {
        // Check for pending redirect result first
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          return; // Redirect authentication succeeded
        }
        
        // Recovery Strategy 1: Check sessionStorage for auth attempt
        if (typeof window !== 'undefined') {
          const authAttempt = sessionStorage.getItem('alchm_auth_attempt');
          if (authAttempt) {
            const attempt = JSON.parse(authAttempt);
            const timeSinceAttempt = Date.now() - attempt.timestamp;
            
            // If recent attempt (within 5 minutes), try to recover
            if (timeSinceAttempt < 300000) {
              console.log('[Auth Recovery] Attempting to recover session from recent auth attempt');
              
              // Try to get redirect result again with patience
              setTimeout(async () => {
                try {
                  const retryResult = await getRedirectResult(auth);
                  if (retryResult?.user) {
                    sessionStorage.removeItem('alchm_auth_attempt');
                  }
                } catch (recoveryError) {
                  console.warn('[Auth Recovery] Session recovery failed:', recoveryError);
                }
              }, 2000);
            }
          }
          
          // Recovery Strategy 2: Check for backup session data
          const backupToken = sessionStorage.getItem('alchm_auth_token_backup');
          const backupUser = sessionStorage.getItem('alchm_user_backup');
          
          if (backupToken && backupUser && !localStorage.getItem('alchm_auth_token')) {
            try {
              // Restore from backup
              localStorage.setItem('alchm_auth_token', backupToken);
              localStorage.setItem('alchm_user', backupUser);
              console.log('[Auth Recovery] Restored session from backup storage');
            } catch (restoreError) {
              console.warn('[Auth Recovery] Failed to restore from backup:', restoreError);
            }
          }
          
          // Recovery Strategy 3: IndexedDB recovery
          if ('indexedDB' in window) {
            try {
              const request = indexedDB.open('alchm_auth', 1);
              request.onsuccess = (e) => {
                const db = (e.target as any).result;
                if (db.objectStoreNames.contains('auth')) {
                  const transaction = db.transaction(['auth'], 'readonly');
                  const store = transaction.objectStore('auth');
                  const getRequest = store.get('session');
                  
                  getRequest.onsuccess = () => {
                    const result = getRequest.result;
                    if (result && !localStorage.getItem('alchm_auth_token')) {
                      try {
                        localStorage.setItem('alchm_auth_token', result.token);
                        localStorage.setItem('alchm_user', JSON.stringify(result.user));
                        console.log('[Auth Recovery] Restored session from IndexedDB');
                      } catch (idbRestoreError) {
                        console.warn('[Auth Recovery] IndexedDB restore failed:', idbRestoreError);
                      }
                    }
                  };
                }
              };
            } catch (idbError) {
              console.warn('[Auth Recovery] IndexedDB recovery failed:', idbError);
            }
          }
        }
      } catch (recoveryError) {
        console.warn('[Auth Recovery] Session recovery process failed:', recoveryError);
      }
    };

    // Run recovery first, then set up auth listener
    recoverAuthSession();

    // Listen for auth state changes with optimized handler
    const unsubscribe = onAuthStateChanged(auth, handleAuthUser);
    return () => unsubscribe();
  }, [auth, handleAuthUser]);

  const retryAuth = useCallback(() => {
    setShowOfflineFallback(false);
    setShowEmergencyBypass(false);
    setShowKheperaRecovery(false);
    setError(null);
    setBusy(false);
    
    // Clear error timeout if exists
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      setErrorTimeout(null);
    }
  }, [errorTimeout]);

  // Crisis-safe error timeout - triggers emergency access after 5 seconds
  useEffect(() => {
    if (error && !showEmergencyBypass && !showKheperaRecovery) {
      const timeout = setTimeout(() => {
        setShowEmergencyBypass(true);
      }, 5000); // 5 seconds
      
      setErrorTimeout(timeout);
      
      return () => clearTimeout(timeout);
    }
  }, [error, showEmergencyBypass, showKheperaRecovery]);

  const signInAsGuest = useCallback(async () => {
    if (!auth) {
      setError('Authentication service not ready. Please wait a moment and try again.');
      return;
    }

    setBusy(true);
    setError(null);
    
    try {
      const result = await signInAnonymously(auth);
      
      if (result.user) {
        // Handle successful anonymous auth same as regular auth
        const authPerformance = monitorAuthFlow();
        
        try {
          // Create anonymous session
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: result.user.uid, isAnonymous: true }),
          });
          
          authPerformance.recordComplete();
          
          // Navigate to dashboard with guest indication
          const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "/en/sanctuary";
          
          // Show gentle guest access message
          const transitionMessage = document.createElement('div');
          transitionMessage.innerHTML = `
            <div style="
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, rgba(164, 183, 146, 0.95), rgba(164, 183, 146, 0.98));
              backdrop-filter: blur(20px);
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-family: system-ui, -apple-system, sans-serif;
            ">
              <div style="text-align: center; max-width: 320px; padding: 0 20px;">
                <div style="font-size: 32px; margin-bottom: 16px;">🌿</div>
                <h2 style="font-size: 20px; font-weight: 400; margin-bottom: 12px; line-height: 1.4;">
                  Welcome to your sanctuary
                </h2>
                <p style="font-size: 14px; opacity: 0.9; line-height: 1.5; margin-bottom: 24px;">
                  You're entering as a guest. Your privacy is protected.
                </p>
                <div style="
                  width: 40px;
                  height: 40px;
                  border: 3px solid rgba(255,255,255,0.3);
                  border-top-color: white;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin: 0 auto;
                "></div>
              </div>
            </div>
            <style>
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          `;
          
          document.body.appendChild(transitionMessage);
          
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 2000);
        } catch (e) {
          console.error("Guest session creation error:", e);
          setBusy(false);
          setError("Guest access failed. Please try again.");
        }
      }
    } catch (e: any) {
      setBusy(false);
      setError("Guest access encountered an issue. Please try email or Apple sign-in instead.");
    }
  }, [auth]);

  const doPopupOrRedirect = useCallback(async (provider: OAuthProvider) => {
    if (!auth) {
      setError('Authentication service not ready. Please wait a moment and try again.');
      return;
    }

    setBusy(true);
    setError(null);
    
    try {
      // Enhanced iOS Safari handling with fallback strategies
      if (isSafariOriOS()) {
        // Store auth attempt for session recovery
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('alchm_auth_attempt', JSON.stringify({
            provider: 'apple',
            timestamp: Date.now(),
            userAgent: navigator.userAgent
          }));
        }
        
        // Use redirect on Safari/iOS to avoid popup blocking
        await signInWithRedirect(auth, provider);
      } else {
        // Adaptive timeout based on network quality
        const getAdaptiveTimeout = () => {
          const networkQuality = performanceState.networkQuality;
          const isSlowConnection = ['slow-2g', '2g', '3g'].includes(networkQuality) || 
                                 networkQuality === 'poor' || 
                                 networkQuality === 'fair';
          
          if (isSlowConnection || isInCrisis) {
            return 180000; // 3 minutes for slow connections or crisis mode
          } else if (networkQuality === '4g' || networkQuality === 'good') {
            return 30000; // 30 seconds for good connections
          } else {
            return 90000; // 90 seconds default
          }
        };
        
        const timeoutMs = getAdaptiveTimeout();
        console.log(`[Auth] Using adaptive timeout: ${timeoutMs/1000}s (network: ${performanceState.networkQuality})`);
        
        // Enhanced popup handling with adaptive timeout
        const popupPromise = signInWithPopup(auth, provider);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('auth/timeout')), timeoutMs);
        });
        
        await Promise.race([popupPromise, timeoutPromise]);
      }
    } catch (e: any) {
      setBusy(false);
      
      // Handle specific error cases with trauma-informed responses
      switch (e?.code) {
        case "auth/account-exists-with-different-credential":
          setLinkingData({
            email: e.customData?.email || "",
            pendingCredential: e.credential
          });
          setShowAccountLinker(true);
          break;
        case "auth/popup-closed-by-user":
          // User intentionally closed - no error, show gentle recovery
          setError(null);
          setShowKheperaRecovery(true);
          break;
        case "auth/popup-blocked":
          // Browser blocked popup - show alternative paths
          setError("Something gentle blocked the path. Let's try another way that feels safer for you.");
          break;
        case "auth/network-request-failed":
          // Network issues - prioritize offline access
          setShowOfflineFallback(true);
          setError(null);
          break;
        case "auth/too-many-requests":
          // Rate limiting - trigger Khepera breathing guidance
          setShowKheperaRecovery(true);
          setError(null);
          break;
        case "auth/unauthorized-domain":
          setError("For your safety and protection, please stay in the authentic ALCHM sanctuary space.");
          break;
        case "auth/timeout":
          // Enhanced timeout handling with retry guidance
          setError("Your connection is taking its time, and that's perfectly okay. You're safe here while we wait for the path to open.");
          // Auto-retry with longer timeout after a brief pause
          setTimeout(() => {
            console.log('[Auth] Auto-retrying after timeout with extended patience');
            setBusy(true);
            setError("Trying again with extra patience for your connection...");
            
            // Retry with even longer timeout (2 minutes)
            const retryPopupPromise = signInWithPopup(auth, provider);
            const extendedTimeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('auth/extended-timeout')), 120000); // 2 minutes
            });
            
            Promise.race([retryPopupPromise, extendedTimeoutPromise])
              .then(() => {
                // Success handled by auth state change listener
              })
              .catch((retryError) => {
                setBusy(false);
                if (retryError.message === 'auth/extended-timeout') {
                  setError("Your connection needs extra care today. Let's try an alternative path that works better with slower connections.");
                  // Suggest redirect mode for slow connections
                  setTimeout(() => {
                    setError("Switching to a connection-friendly mode...");
                    signInWithRedirect(auth, provider).catch(() => {
                      setError("Let's try the emergency access - your sanctuary is always available.");
                      setShowEmergencyBypass(true);
                    });
                  }, 2000);
                } else {
                  setError("That path didn't open as expected, but you're exactly where you need to be. When you feel ready, we'll try another gentle approach.");
                }
              });
          }, 3000); // Wait 3 seconds before auto-retry
          break;
        default:
          setError("That path didn't open as expected, but you're exactly where you need to be. When you feel ready, we'll try another gentle approach.");
      }
    }
  }, [auth]);

  // Memoize provider configurations
  const providers = useMemo(() => {
    const appleProvider = new OAuthProvider("apple.com");
    appleProvider.addScope("email");
    appleProvider.addScope("name");

    return { appleProvider };
  }, []);

  const isAppleEnabled = process.env.NEXT_PUBLIC_ENABLE_APPLE_AUTH === "true";
  
  // Trauma-informed error messaging with Sacred UX language
  const getTraumaInformedErrorMessage = (errorMessage: string): string => {
    const traumaInformedMessages = {
      'Authentication service unavailable. Please refresh the page.': 
        "Connection feels unstable. You're still safe here. Take a breath - we'll find another path together.",
      'Authentication service not ready. Please wait a moment and try again.':
        "Your sanctuary is still being lovingly prepared. Rest here while we create your safe space.",
      "Couldn't sign in. Please try again.":
        "That path didn't open as expected, but you're exactly where you need to be. When you feel ready, we'll try another gentle approach.",
      'This domain is not authorized for authentication.':
        "Something on our end needs gentle attention. This isn't your doing - breathe easy while we care for it.",
      'Unable to reach sign-in servers. You can still browse ALCHM offline.':
        "Your connection is resting right now. You can still write privately in your sanctuary while we reconnect.",
      'default':
        "Something unexpected happened, but you remain completely safe in this space. Let's breathe and find your pathway to support."
    };
    
    return traumaInformedMessages[errorMessage as keyof typeof traumaInformedMessages] || 
           traumaInformedMessages.default;
  };
  
  // Show loading state if auth is not initialized
  const isAuthLoading = !auth;

  // Enhanced loading states with trauma-informed progress indication
  const [authProgress, setAuthProgress] = useState<'initializing' | 'connecting' | 'securing' | 'completing'>('initializing');
  
  useEffect(() => {
    if (busy) {
      let progressTimer: NodeJS.Timeout;
      
      // Simulate authentic auth progress stages for user reassurance
      const progressStages = [
        { stage: 'connecting' as const, delay: 500 },
        { stage: 'securing' as const, delay: 1200 },
        { stage: 'completing' as const, delay: 2000 }
      ];
      
      progressStages.forEach(({ stage, delay }) => {
        progressTimer = setTimeout(() => {
          setAuthProgress(stage);
        }, delay);
      });
      
      return () => clearTimeout(progressTimer);
    } else {
      setAuthProgress('initializing');
    }
  }, [busy]);

  // Trauma-informed loading messages that provide comfort and security
  const getLoadingMessage = (stage: typeof authProgress) => {
    const messages = {
      initializing: 'Preparing your sanctuary...',
      connecting: 'Creating secure connection...',
      securing: 'Protecting your privacy...',
      completing: 'Almost there...'
    };
    return messages[stage];
  };

  // Performance-optimized button styling based on device capabilities
  const getButtonStyles = () => {
    const baseClasses = `min-h-[${isInCrisis ? '64px' : '60px'}] min-w-[120px] px-8 py-4 my-2 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sanctuary-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sage-400`;
    
    const performanceClasses = performanceState.shouldUseAnimations 
      ? `transition-all duration-200 ease-out` 
      : 'transition-none';
    
    const backgroundClasses = 'bg-sanctuary-white/10 backdrop-blur-sm text-sanctuary-white border border-sanctuary-white/20 hover:bg-sanctuary-white/20 hover:border-sanctuary-white/40';
      
    const crisisClasses = isInCrisis 
      ? 'ring-2 ring-yellow-400/40 shadow-elevated' 
      : 'shadow-subtle';
    
    return `${baseClasses} ${performanceClasses} ${backgroundClasses} ${crisisClasses}`;
  };

  // Apple button component
  const AppleButton = () => (
    <button
      onClick={() => doPopupOrRedirect(providers.appleProvider)}
      disabled={busy || isAuthLoading}
      className={getButtonStyles()}
      style={{
        touchAction: 'manipulation', // Prevents double-tap zoom for mobile
        WebkitTapHighlightColor: 'transparent', // Remove default highlight
        minHeight: isInCrisis ? '64px' : '60px', // Extra height in crisis mode
        margin: '8px 0' // Prevents accidental touches
      }}
      aria-label={`Continue with Apple - ${isInCrisis ? 'Crisis-optimized for' : 'Optimized for'} mobile accessibility`}
      aria-busy={busy || isAuthLoading}
      aria-describedby={busy ? "auth-status-apple" : undefined}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
      </svg>
      {isAuthLoading ? (
        <span className="flex items-center gap-2" role="status" aria-live="polite">
          <div className="animate-pulse w-4 h-4 bg-white/60 rounded-full" aria-hidden="true" />
          <span>Preparing sanctuary...</span>
        </span>
      ) : busy ? (
        <span className="flex items-center gap-2" role="status" aria-live="polite" id="auth-status-apple">
          <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" aria-hidden="true" />
          <span>{getLoadingMessage(authProgress)}</span>
        </span>
      ) : "Continue with Apple"}
    </button>
  );


  return (
    <div className="flex flex-col gap-0 w-full max-w-[320px] mx-auto">
      {/* Crisis mode indicator */}
      {isInCrisis && (
        <div className="bg-sanctuary-white/10 backdrop-blur-sm border border-sanctuary-white/20 rounded-xl p-4 text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-sanctuary-white">
            <span className="text-sm" aria-hidden="true">⚡</span>
            <span className="text-sm font-medium">Crisis mode enabled</span>
          </div>
          <p className="text-xs text-sanctuary-white/70 mt-2 leading-relaxed">
            Simplified access to your sanctuary
          </p>
        </div>
      )}

      {/* Network quality indicator for slow connections */}
      {(performanceState.networkQuality === 'poor' || performanceState.networkQuality === 'fair' || 
        ['slow-2g', '2g', '3g'].includes(performanceState.networkQuality)) && (
        <div className="bg-sanctuary-white/5 backdrop-blur-sm border border-sanctuary-white/10 rounded-xl p-4 text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-sanctuary-white">
            <span className="text-sm" aria-hidden="true">🌐</span>
            <span className="text-sm font-medium">Patient connection mode</span>
          </div>
          <p className="text-xs text-sanctuary-white/70 mt-2 leading-relaxed">
            Taking extra care with your {performanceState.connectionSpeed} connection
          </p>
        </div>
      )}

      {/* Authentication progress indicator */}
      {busy && (
        <div className="bg-sanctuary-white/5 backdrop-blur-sm rounded-xl p-6 border border-sanctuary-white/10 mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={performanceState.shouldUseAnimations ? "animate-spin w-4 h-4 border-2 border-sanctuary-white/30 border-t-sanctuary-white rounded-full" : "w-4 h-4 border-2 border-sanctuary-white/50 rounded-full"} aria-hidden="true" />
            <span className="text-sanctuary-white font-light text-sm">
              {getLoadingMessage(authProgress)}
            </span>
          </div>
          
          {/* Simplified progress indicator */}
          <div className="flex justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${authProgress === 'connecting' ? 'bg-sanctuary-white' : 'bg-sanctuary-white/30'} ${performanceState.shouldUseAnimations ? 'transition-all duration-200' : ''}`} />
            <div className={`w-2 h-2 rounded-full ${authProgress === 'securing' ? 'bg-sanctuary-white' : 'bg-sanctuary-white/30'} ${performanceState.shouldUseAnimations ? 'transition-all duration-200' : ''}`} />
            <div className={`w-2 h-2 rounded-full ${authProgress === 'completing' ? 'bg-sanctuary-white' : 'bg-sanctuary-white/30'} ${performanceState.shouldUseAnimations ? 'transition-all duration-200' : ''}`} />
          </div>
        </div>
      )}
      
      {showAccountLinker && linkingData && (
        <AccountLinker
          email={linkingData.email}
          pendingCredential={linkingData.pendingCredential}
          onSuccess={() => {
            setShowAccountLinker(false);
            setLinkingData(null);
          }}
          onCancel={() => {
            setShowAccountLinker(false);
            setLinkingData(null);
            setError(null);
          }}
        />
      )}
      
      {/* Show Apple authentication */}
      {isAppleEnabled && <AppleButton />}
      
      {/* Email Authentication Button */}
      <button
        onClick={() => router.push('/') }
        disabled={busy || isAuthLoading}
        className={getButtonStyles()}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          minHeight: isInCrisis ? '64px' : '60px',
          margin: '8px 0',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.20)'
        }}
        aria-label={`Continue with Email - ${isInCrisis ? 'Crisis-optimized for' : 'Optimized for'} email authentication`}
        aria-busy={busy || isAuthLoading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        {isAuthLoading ? (
          <span className="flex items-center gap-2" role="status" aria-live="polite">
            <div className="animate-pulse w-4 h-4 bg-white/60 rounded-full" aria-hidden="true" />
            <span>Preparing sanctuary...</span>
          </span>
        ) : busy ? (
          <span className="flex items-center gap-2" role="status" aria-live="polite">
            <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" aria-hidden="true" />
            <span>Connecting safely...</span>
          </span>
        ) : "Continue with Email"}
      </button>
      
      {/* Guest Access Button */}
      <button
        onClick={signInAsGuest}
        disabled={busy || isAuthLoading}
        className={getButtonStyles()}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          minHeight: isInCrisis ? '64px' : '60px',
          margin: '8px 0',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
        aria-label={`Continue as Guest - ${isInCrisis ? 'Crisis-optimized for' : 'Optimized for'} privacy`}
        aria-busy={busy || isAuthLoading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4L13.5 7H9L7.5 4L1.5 7V9H3V20C3 21.1 3.9 22 5 22H10V18H14V22H19C20.1 22 21 21.1 21 20V9H21ZM7 8H11V10H7V8Z"/>
        </svg>
        {isAuthLoading ? (
          <span className="flex items-center gap-2" role="status" aria-live="polite">
            <div className="animate-pulse w-4 h-4 bg-white/60 rounded-full" aria-hidden="true" />
            <span>Preparing sanctuary...</span>
          </span>
        ) : busy ? (
          <span className="flex items-center gap-2" role="status" aria-live="polite">
            <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" aria-hidden="true" />
            <span>Creating private space...</span>
          </span>
        ) : "Continue as Guest"}
      </button>
      
      {/* Email link authentication as fallback */}
      {!isAppleEnabled && (
        <div className="text-center text-sanctuary-white/70 text-sm">
          Apple authentication is currently unavailable. Emergency access available below.
        </div>
      )}

      {error && !showKheperaRecovery && !showEmergencyBypass && (
        <div 
          className="rounded-xl p-6 text-center mt-4 border-2" 
          role="alert"
          aria-live="polite"
          style={{
            background: 'rgba(247, 247, 242, 0.95)', // Off-White
            borderColor: 'rgba(164, 183, 146, 0.3)', // Sage Green border
            backdropFilter: 'blur(20px)',
            transition: 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: '0 4px 20px rgba(164, 183, 146, 0.1)',
            animation: 'gentle-breathe 4s ease-in-out infinite'
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(164, 183, 146, 0.15)', // Sage Green background
                transition: 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <span className="text-lg" aria-hidden="true">🌿</span>
            </div>
            <h3 
              className="text-base font-medium"
              style={{
                color: '#7a8c6a', // Sage Active
                letterSpacing: '-0.01em'
              }}
            >
              Let's find another gentle path
            </h3>
          </div>
          <p 
            className="text-sm leading-relaxed mb-5"
            style={{
              color: '#8b6f47', // Darker terracotta for readability
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}
          >
            {getTraumaInformedErrorMessage(error)}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError(null);
                setBusy(false);
              }}
              className="flex-1 px-4 py-3 text-sm rounded-xl font-medium transition-all duration-300"
              style={{
                background: 'rgba(164, 183, 146, 0.9)', // Sage Green
                color: '#ffffff',
                border: '1px solid rgba(164, 183, 146, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(164, 183, 146, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(164, 183, 146, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(164, 183, 146, 0.2)';
              }}
            >
              🌱 Try Again Gently
            </button>
            
            <button
              onClick={() => setShowKheperaRecovery(true)}
              className="flex-1 px-4 py-3 text-sm rounded-xl font-medium transition-all duration-300"
              style={{
                background: 'rgba(203, 153, 126, 0.2)', // Terracotta background
                color: '#8b6f47', // Darker terracotta text
                border: '1px solid rgba(203, 153, 126, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(203, 153, 126, 0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(203, 153, 126, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🧘‍♀️ Breathe with Khepera
            </button>
          </div>
          
          {/* Emergency access notice */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(164, 183, 146, 0.2)' }}>
            <p 
              className="text-xs font-medium"
              style={{ color: '#8b6f47' }}
            >
              Emergency access will be available in {errorTimeout ? '5' : '0'} seconds if needed
            </p>
          </div>
        </div>
      )}

      {/* Offline fallback for network issues */}
      <OfflineAuthFallback
        visible={showOfflineFallback}
        onRetry={retryAuth}
      />

      {/* Emergency Bypass Authentication */}
      <EmergencyBypassAuth
        visible={showEmergencyBypass}
        triggerReason={error ? 'error_timeout' : 'user_request'}
        onSuccess={(emergencySession) => {
          console.log('Emergency session created:', emergencySession.sessionId);
          setShowEmergencyBypass(false);
          // The component handles navigation internally
        }}
        onCancel={() => {
          setShowEmergencyBypass(false);
          retryAuth();
        }}
      />

      {/* Khepera-Guided Error Recovery */}
      <KheperaErrorRecovery
        visible={showKheperaRecovery}
        errorType={error || 'unknown'}
        errorMessage={getTraumaInformedErrorMessage(error || '')}
        onRetry={async () => {
          setShowKheperaRecovery(false);
          retryAuth();
          // Retry the last authentication attempt
          if (providers) {
            try {
              setBusy(true);
              await doPopupOrRedirect(providers.appleProvider);
            } catch (retryError) {
              console.log('Retry after Khepera guidance failed:', retryError);
            }
          }
        }}
        onAlternativePath={(path) => {
          setShowKheperaRecovery(false);
          if (path === 'emergency') {
            setShowEmergencyBypass(true);
          } else {
            retryAuth();
          }
        }}
        onComplete={() => {
          setShowKheperaRecovery(false);
          retryAuth();
        }}
        userContext={{
          attemptCount: error ? 3 : 1, // Approximate based on error presence
          timeOfDay: new Date().getHours() < 12 ? 'morning' : 
                    new Date().getHours() < 17 ? 'afternoon' : 
                    new Date().getHours() < 21 ? 'evening' : 'night',
          isFirstTime: !localStorage.getItem('alchm_user')
        }}
      />

      <p className="text-xs text-center text-sanctuary-white/50 mt-6 leading-relaxed">
        By continuing, you agree to our{" "}
        <a className="underline hover:text-sanctuary-white/80 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-sanctuary-white/30 rounded px-1" href="/about/terms">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="underline hover:text-sanctuary-white/80 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-sanctuary-white/30 rounded px-1" href="/about/privacy">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}