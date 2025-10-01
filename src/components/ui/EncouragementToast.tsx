/**
 * Encouragement Toast Component
 * Provides gentle, contextual encouragement during writing
 * Appears and disappears like a caring whisper
 */

"use client";

import { useEffect, useState } from 'react';

interface EncouragementToastProps {
  message: string | null;
  isVisible: boolean;
  emotionalContext?: string;
  className?: string;
}

export function EncouragementToast({ 
  message, 
  isVisible, 
  emotionalContext = 'neutral',
  className = "" 
}: EncouragementToastProps) {
  const [showToast, setShowToast] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message && isVisible) {
      setCurrentMessage(message);
      setShowToast(true);
      
      // Auto-hide after 4 seconds
      const hideTimer = setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setCurrentMessage(null), 300); // Wait for fade out
      }, 4000);

      return () => clearTimeout(hideTimer);
    } else {
      setShowToast(false);
      setTimeout(() => setCurrentMessage(null), 300);
      return undefined;
    }
  }, [message, isVisible]);

  if (!currentMessage) return null;

  // Choose icon and styling based on emotional context
  const getContextualStyling = () => {
    switch (emotionalContext) {
      case 'vulnerability':
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ),
          gradient: 'from-rose-500/20 to-pink-400/10',
          borderColor: 'border-rose-300/30'
        };
      case 'strength':
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          gradient: 'from-emerald-500/20 to-green-400/10',
          borderColor: 'border-emerald-300/30'
        };
      case 'growth':
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.7 14.3c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4L9.6 11 7.3 8.7c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L11 9.6l2.3-2.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L12.4 11l2.3 2.3c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0L11 12.4l-2.3 2.3z" clipRule="evenodd" />
            </svg>
          ),
          gradient: 'from-blue-500/20 to-indigo-400/10',
          borderColor: 'border-blue-300/30'
        };
      case 'crisis':
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          gradient: 'from-amber-500/20 to-yellow-400/10',
          borderColor: 'border-amber-300/30'
        };
      default:
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          gradient: 'from-white/20 to-white/10',
          borderColor: 'border-white/30'
        };
    }
  };

  const styling = getContextualStyling();

  return (
    <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ease-out ${className} ${
      showToast 
        ? 'opacity-100 translate-x-0 scale-100' 
        : 'opacity-0 translate-x-8 scale-95 pointer-events-none'
    }`}>
      <div className={`max-w-sm p-4 bg-gradient-to-r ${styling.gradient} backdrop-blur-md border ${styling.borderColor} rounded-2xl shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white ${
            showToast ? 'animate-gentle-pulse' : ''
          }`}>
            {styling.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm leading-relaxed font-medium">
              {currentMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Breathing animation for long pauses
export function BreathingIndicator({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center animate-breathing">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Export the CSS animations
export const encouragementToastStyles = `
@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

@keyframes breathing {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.animate-gentle-pulse {
  animation: gentle-pulse 2s ease-in-out infinite;
}

.animate-breathing {
  animation: breathing 4s ease-in-out infinite;
}

@keyframes gentle-breathing {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1); 
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.05),
                0 0 20px rgba(139, 115, 85, 0.1); 
  }
}

.gentle-breathing {
  animation: gentle-breathing 4s ease-in-out infinite;
}

@keyframes warm-pulse {
  0%, 100% { 
    box-shadow: 0 4px 20px rgba(139, 115, 85, 0.15);
    transform: translateY(0);
  }
  50% { 
    box-shadow: 0 8px 25px rgba(139, 115, 85, 0.2),
                0 0 30px rgba(139, 115, 85, 0.1);
    transform: translateY(-1px);
  }
}

.warm-pulse {
  animation: warm-pulse 2s ease-in-out infinite;
}
`;

export default EncouragementToast;