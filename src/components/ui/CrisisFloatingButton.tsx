'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

function CrisisFloatingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);
  const [showDismissalConfirm, setShowDismissalConfirm] = useState(false);
  const [dismissalAttempts, setDismissalAttempts] = useState(0);

  useEffect(() => {
    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check if we're on an auth page
    const checkAuthPage = () => {
      const path = window.location.pathname;
      const authPage = path.includes('/auth') || path.includes('/login');
      setIsAuthPage(authPage);
      
      // Crisis support always visible - adjust positioning only on auth pages
      setIsVisible(true);
      
      // Close expanded panel on auth pages to prevent blocking sign-in
      if (authPage) {
        setIsExpanded(false);
      }
    };
    
    checkAuthPage();
    window.addEventListener('popstate', checkAuthPage);
    
    // Gentle pulse every 30 seconds to remind users help is available
    const pulseInterval = setInterval(() => {
      if (!isAuthPage) {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 1000);
      }
    }, 30000);

    return () => {
      clearInterval(pulseInterval);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('popstate', checkAuthPage);
    };
  }, [isAuthPage]);

  const handleCrisisCall = useCallback((number: string) => {
    // Haptic feedback for crisis action
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    // Direct phone call on mobile
    if (isMobile) {
      window.location.href = `tel:${number}`;
    } else {
      // Show number on desktop
      navigator.clipboard.writeText(number);
      alert(`Crisis line copied to clipboard: ${number}`);
    }
  }, [isMobile]);

  // Don't render if explicitly hidden
  if (!isVisible) return null;

  return (
    <>
      {/* Mobile-First Crisis Support Button - 60px minimum for emergency situations */}
      <div className={`fixed z-30 ${isAuthPage ? 'bottom-24 right-4' : 'bottom-6 right-6'}`}>
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            // Immediate haptic feedback for crisis interaction
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          }}
          onTouchStart={() => {
            // Additional haptic on touch for mobile reassurance
            if (navigator.vibrate) navigator.vibrate(15);
          }}
          className={`touch-target-large crisis-accessible ${pulseAnimation ? 'animate-sacred-pulse' : ''}`}
          style={{
            width: '84px', // Luxury proportions - golden ratio derived
            height: '84px',
            background: 'linear-gradient(135deg, #a4b792 0%, #8fa37c 35%, #7a8c6a 100%)',
            border: '2px solid rgba(255, 255, 255, 0.9)', // Premium clarity
            borderRadius: '50%',
            boxShadow: '0 12px 40px rgba(164, 183, 146, 0.35), 0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(24px) saturate(120%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 30,
            touchAction: 'manipulation',
            // Luxury hover preparation
            transformStyle: 'preserve-3d'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
            e.currentTarget.style.boxShadow = '0 20px 56px rgba(164, 183, 146, 0.45), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #8fa37c 0%, #7a8c6a 35%, #677358 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(164, 183, 146, 0.35), 0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #a4b792 0%, #8fa37c 35%, #7a8c6a 100%)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(164, 183, 146, 0.4), 0 0 0 4px rgba(164, 183, 146, 0.6)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(164, 183, 146, 0.4), 0 2px 8px rgba(0, 0, 0, 0.15)';
          }}
          aria-label="Emergency crisis support - tap for immediate help"
        >
          <span style={{
            fontSize: '28px', // Larger for crisis visibility
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
          }}>❤️</span>
        </button>
        
        {/* Mobile-First Crisis Support Panel - Thumb-optimized one-tap access */}
        {isExpanded && (
          <div style={{
            position: 'absolute',
            bottom: '75px',
            right: '0',
            width: isMobile ? '90vw' : '380px', // Optimized for one-handed mobile use
            maxWidth: '95vw',
            background: 'rgba(255, 255, 255, 0.98)', // Higher opacity for crisis readability
            backdropFilter: 'blur(40px)',
            border: '2px solid rgba(164, 183, 146, 0.4)', // Stronger border for crisis visibility
            borderRadius: isMobile ? '24px' : '20px', // Larger radius on mobile
            boxShadow: '0 24px 80px rgba(164, 183, 146, 0.25), 0 12px 48px rgba(0, 0, 0, 0.15)',
            padding: isMobile ? '24px' : '20px', // Extra padding on mobile
            animation: 'crisis-panel-enter 0.3s ease forwards',
            zIndex: 29,
            // Prevent scrolling behind panel
            touchAction: 'manipulation'
          }}>
            {/* Header with Sage Green Accent */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-rest)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto var(--space-breath)',
                background: 'linear-gradient(145deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
                border: '1px solid rgba(164, 183, 146, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(164, 183, 146, 0.2)'
              }}>
                <span style={{ 
                  fontSize: '20px',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}>❤️</span>
              </div>
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-primary-dark)',
                marginBottom: 'var(--space-whisper)',
                letterSpacing: 'var(--tracking-wide)'
              }}>
                You Matter
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)'
              }}>
                If you're in crisis, help is available right now
              </p>
            </div>
            
            {/* One-Tap Crisis Hotlines - Mobile-First Design */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? '16px' : '12px', // Extra spacing on mobile for thumb safety
              marginBottom: '24px' 
            }}>
              <button
                onClick={() => handleCrisisCall('988')}
                onTouchStart={() => {
                  // Immediate haptic feedback for crisis action
                  if (navigator.vibrate) navigator.vibrate([50, 25, 50]);
                }}
                className="touch-target crisis-accessible"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '20px' : '16px', // Larger padding on mobile
                  minHeight: '72px', // Increased from 60px for crisis accessibility
                  background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)', // Red tint for emergency
                  border: '2px solid #dc2626',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  width: '100%',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.25) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(220, 38, 38, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '700', // Bolder for crisis visibility
                    color: '#dc2626',
                    fontSize: isMobile ? '20px' : '18px', // Larger on mobile
                    marginBottom: '4px'
                  }}>
                    988 Crisis Lifeline
                  </div>
                  <div style={{
                    fontSize: isMobile ? '16px' : '14px',
                    color: '#991b1b',
                    fontWeight: '500'
                  }}>
                    Tap to call • Available 24/7
                  </div>
                </div>
                <div style={{ 
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}>📞</div>
              </button>
              
              <button
                onClick={() => {
                  if (isMobile) {
                    window.location.href = 'sms:741741&body=HOME';
                  } else {
                    navigator.clipboard.writeText('741741');
                    alert('Crisis Text Line number copied: 741741\nText HOME to start');
                  }
                  if (navigator.vibrate) navigator.vibrate([50, 25, 50]);
                }}
                onTouchStart={() => {
                  if (navigator.vibrate) navigator.vibrate([30, 15, 30]);
                }}
                className="touch-target"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '20px' : '16px',
                  minHeight: '72px', // Crisis-safe touch target
                  background: 'linear-gradient(145deg, rgba(164, 183, 146, 0.1) 0%, rgba(164, 183, 146, 0.15) 100%)',
                  border: '2px solid #a4b792',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  width: '100%',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(164, 183, 146, 0.2) 0%, rgba(164, 183, 146, 0.25) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(164, 183, 146, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(164, 183, 146, 0.1) 0%, rgba(164, 183, 146, 0.15) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '700',
                    color: '#6b7556',
                    fontSize: isMobile ? '20px' : '18px',
                    marginBottom: '4px'
                  }}>
                    Crisis Text Line
                  </div>
                  <div style={{
                    fontSize: isMobile ? '16px' : '14px',
                    color: '#a4b792',
                    fontWeight: '500'
                  }}>
                    Tap to text • Text HOME to 741741
                  </div>
                </div>
                <div style={{ 
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}>💬</div>
              </button>
            </div>
            
            {/* Additional Resources */}
            <div style={{ 
              borderTop: '1px solid rgba(164, 183, 146, 0.15)', 
              paddingTop: 'var(--space-breath)' 
            }}>
              <Link
                href="/crisis-resources"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: 'var(--space-breath)',
                  textAlign: 'center',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  transition: 'all 0.2s var(--ease-sanctuary)',
                  fontWeight: 'var(--font-medium)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(164, 183, 146, 0.1)';
                  e.currentTarget.style.color = 'var(--color-primary-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                More Resources & Local Support
              </Link>
            </div>
            
            {/* CRISIS SAFETY: Intentional Close Button with Protection */}
            <button
              onClick={() => {
                // CRISIS SAFETY: Require confirmation before dismissing crisis resources
                const newAttempts = dismissalAttempts + 1;
                setDismissalAttempts(newAttempts);
                
                if (newAttempts === 1) {
                  // First attempt: Show warning
                  setShowDismissalConfirm(true);
                  setTimeout(() => setShowDismissalConfirm(false), 5000); // Auto-hide after 5s
                } else if (newAttempts >= 2) {
                  // Second attempt: Allow dismissal but with delay
                  setTimeout(() => {
                    setIsExpanded(false);
                    setDismissalAttempts(0);
                    setShowDismissalConfirm(false);
                  }, 1000); // 1 second delay to prevent accidental rapid clicking
                }
              }}
              style={{
                position: 'absolute',
                top: 'var(--space-breath)',
                right: 'var(--space-breath)',
                width: '32px',
                height: '32px',
                background: dismissalAttempts > 0 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(164, 183, 146, 0.1)',
                border: `1px solid ${dismissalAttempts > 0 ? 'rgba(220, 38, 38, 0.3)' : 'rgba(164, 183, 146, 0.2)'}`,
                borderRadius: '50%',
                color: dismissalAttempts > 0 ? '#dc2626' : 'var(--color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.3s var(--ease-sanctuary)',
                transform: dismissalAttempts > 0 ? 'scale(1.1)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (dismissalAttempts === 0) {
                  e.currentTarget.style.background = 'rgba(164, 183, 146, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (dismissalAttempts === 0) {
                  e.currentTarget.style.background = 'rgba(164, 183, 146, 0.1)';
                }
              }}
              aria-label={dismissalAttempts === 0 ? "Close crisis support" : dismissalAttempts === 1 ? "Confirm close crisis support" : "Closing crisis support..."}
            >
              {dismissalAttempts === 0 ? '✕' : dismissalAttempts === 1 ? '⚠️' : '⏳'}
            </button>
            
            {/* Crisis Dismissal Warning */}
            {showDismissalConfirm && (
              <div style={{
                position: 'absolute',
                top: '-80px',
                right: '0',
                width: isMobile ? '280px' : '320px',
                padding: '16px',
                background: 'rgba(220, 38, 38, 0.95)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
                zIndex: 35,
                animation: 'crisis-alert-enter 0.3s ease forwards'
              }}>
                <div style={{ marginBottom: '8px', fontWeight: '600' }}>
                  ⚠️ Crisis resources are important
                </div>
                <div style={{ marginBottom: '8px', fontSize: '13px', opacity: 0.9 }}>
                  These resources are here for your safety. Are you sure you want to close them?
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Click close again to confirm, or wait 5 seconds to cancel.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile-First Crisis Backdrop - Prevents accidental dismissal */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 z-28"
          style={{
            backdropFilter: 'blur(8px)',
            touchAction: 'manipulation'
          }}
          onClick={(e) => {
            // CRISIS SAFETY: Prevent accidental dismissal
            e.preventDefault();
            e.stopPropagation();
            // Require intentional close button click only
          }}
          onTouchStart={(e) => {
            // CRISIS SAFETY: Prevent any accidental touch dismissal
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      )}
    </>
  );
}

export { CrisisFloatingButton };
export default CrisisFloatingButton;