'use client';

import { useEffect, useState } from 'react';

interface MobileLoadingStateProps {
  isLoading: boolean;
  message?: string;
  showProgress?: boolean;
}

export default function MobileLoadingState({ 
  isLoading, 
  message = "Preparing your sanctuary...",
  showProgress = false
}: MobileLoadingStateProps) {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    // Animate dots for visual feedback
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Simulate progress for user comfort during long loads
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Don't reach 100% until actually done
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => {
        clearInterval(dotsInterval);
        clearInterval(progressInterval);
      };
    }

    return () => clearInterval(dotsInterval);
  }, [isLoading, showProgress]);

  // Reset when loading completes
  useEffect(() => {
    if (!isLoading) {
      setDots('');
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div 
      className="mobile-loading-overlay"
      role="status" 
      aria-label="Loading content"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(164, 183, 146, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 'clamp(16px, 4vw, 24px)',
        padding: '20px'
      }}
    >
      {/* Loading Spinner */}
      <div 
        className="mobile-loading-spinner"
        style={{
          width: 'clamp(36px, 8vw, 48px)',
          height: 'clamp(36px, 8vw, 48px)',
          border: '3px solid rgba(254, 252, 251, 0.3)',
          borderTop: '3px solid rgba(254, 252, 251, 0.9)',
          borderRadius: '50%',
          animation: 'mobile-spin 1s linear infinite'
        }}
        aria-hidden="true"
      />

      {/* Loading Message */}
      <div 
        className="mobile-loading-text"
        style={{
          color: 'rgba(254, 252, 251, 0.9)',
          fontSize: 'clamp(16px, 4vw, 18px)',
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '280px',
          lineHeight: 1.5
        }}
      >
        {message}{dots}
      </div>

      {/* Progress Bar (optional) */}
      {showProgress && (
        <div 
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '4px',
            background: 'rgba(254, 252, 251, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
          aria-hidden="true"
        >
          <div 
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'rgba(254, 252, 251, 0.8)',
              borderRadius: '2px',
              transition: 'width 300ms ease'
            }}
          />
        </div>
      )}

      {/* Crisis Support Always Visible */}
      <div 
        style={{
          position: 'absolute',
          bottom: 'clamp(20px, 5vw, 40px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(220, 38, 38, 0.9)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          touchAction: 'manipulation',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
          zIndex: 10000
        }}
        onClick={() => {
          if (navigator.vibrate) navigator.vibrate(200);
          window.open('tel:988', '_self');
        }}
        role="button"
        tabIndex={0}
        aria-label="Emergency crisis support - Call 988 Lifeline"
      >
        <span aria-hidden="true">🆘</span>
        Crisis? Call 988
      </div>

      {/* Loading Tips for Emotional Support */}
      <div 
        style={{
          position: 'absolute',
          bottom: 'clamp(80px, 15vw, 120px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(254, 252, 251, 0.1)',
          border: '1px solid rgba(254, 252, 251, 0.2)',
          borderRadius: '16px',
          padding: '12px 16px',
          maxWidth: '280px',
          textAlign: 'center'
        }}
      >
        <p style={{
          color: 'rgba(254, 252, 251, 0.8)',
          fontSize: '12px',
          lineHeight: 1.4,
          margin: 0
        }}>
          💫 Take a deep breath. You're safe here. Your words matter.
        </p>
      </div>
    </div>
  );
}

// Loading state hook for easy integration
export function useMobileLoadingState(initialLoading = false) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [message, setMessage] = useState("Preparing your sanctuary...");

  const startLoading = (customMessage?: string) => {
    if (customMessage) setMessage(customMessage);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const updateMessage = (newMessage: string) => {
    setMessage(newMessage);
  };

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    updateMessage,
    LoadingComponent: (props: Partial<MobileLoadingStateProps>) => (
      <MobileLoadingState 
        isLoading={isLoading} 
        message={message}
        {...props} 
      />
    )
  };
}