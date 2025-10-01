'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReturnContext {
  path: string;
  timestamp: number;
  scrollPosition?: number;
  context?: 'writing' | 'pathways' | 'badges' | 'settings' | 'crisis' | 'onboarding';
}

interface ContextualWelcomeProps {
  userName?: string;
}

export default function ContextualWelcome({ userName = 'Writer' }: ContextualWelcomeProps) {
  const [returnContext, setReturnContext] = useState<ReturnContext | null>(null);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [contextualAction, setContextualAction] = useState<{
    text: string;
    href: string;
    icon: string;
  } | null>(null);

  useEffect(() => {
    // Get return context from session storage
    try {
      const savedContext = sessionStorage.getItem('alchm_return_path');
      if (savedContext) {
        const context = JSON.parse(savedContext);
        setReturnContext(context);
        
        // Determine contextual action based on where they came from
        const action = getContextualAction(context);
        setContextualAction(action);
        
        // Clear the context after using it
        sessionStorage.removeItem('alchm_return_path');
      }
    } catch (error) {
      console.warn('Could not retrieve return context');
    }

    // Auto-hide welcome message after 4 seconds
    const timer = setTimeout(() => {
      setWelcomeVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const getContextualAction = (context: ReturnContext) => {
    switch (true) {
      case context.path.includes('/journal'):
      case context.path.includes('/write'):
        return {
          text: 'Continue writing',
          href: '/journal',
          icon: '✍️'
        };
        
      case context.path.includes('/pathways'):
        return {
          text: 'Continue your pathway',
          href: '/pathways',
          icon: '🛤️'
        };
        
      case context.path.includes('/badges'):
        return {
          text: 'View achievements',
          href: '/badges',
          icon: '🏆'
        };
        
      case context.path.includes('/settings'):
      case context.path.includes('/account'):
        return {
          text: 'Finish setup',
          href: '/settings',
          icon: '⚙️'
        };
        
      case context.path.includes('/crisis'):
        return {
          text: 'Access support resources',
          href: '/crisis-resources',
          icon: '❤️'
        };
        
      default:
        return {
          text: 'Start writing',
          href: '/journal',
          icon: '🌿'
        };
    }
  };

  const getWelcomeMessage = () => {
    if (!returnContext) {
      return `Welcome back, ${userName}`;
    }

    const timeSinceReturn = Date.now() - returnContext.timestamp;
    const hoursAgo = Math.floor(timeSinceReturn / (1000 * 60 * 60));
    
    if (hoursAgo < 1) {
      return `Welcome back, ${userName}`;
    } else if (hoursAgo < 24) {
      return `Good to see you again, ${userName}`;
    } else {
      return `We've missed you, ${userName}`;
    }
  };

  const getContextualSubtext = () => {
    if (!returnContext) {
      return 'Your sanctuary awaits';
    }

    switch (true) {
      case returnContext.path.includes('/journal'):
      case returnContext.path.includes('/write'):
        return 'Ready to continue your reflection?';
        
      case returnContext.path.includes('/pathways'):
        return 'Your journey continues where you left off';
        
      case returnContext.path.includes('/badges'):
        return 'Your growth is worth celebrating';
        
      case returnContext.path.includes('/settings'):
        return 'Your preferences have been saved';
        
      case returnContext.path.includes('/crisis'):
        return 'You\'re supported here';
        
      default:
        return 'Your sanctuary is ready for you';
    }
  };

  if (!welcomeVisible && !contextualAction) {
    return null;
  }

  return (
    <div style={{
      marginBottom: 'var(--space-sanctuary)',
      opacity: welcomeVisible ? 1 : 0,
      transform: welcomeVisible ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all 0.5s var(--ease-sanctuary)'
    }}>
      {/* Welcome Message */}
      {welcomeVisible && (
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-rest)'
        }}>
          <h1 className="heading-hero" style={{ 
            fontSize: 'var(--text-4xl)',
            marginBottom: 'var(--space-whisper)',
            color: 'var(--sanctuary-white)',
            fontWeight: 'var(--font-light)'
          }}>
            {getWelcomeMessage()}
          </h1>
          
          <p style={{ 
            color: 'rgba(254, 252, 251, 0.8)',
            fontSize: 'var(--text-lg)',
            letterSpacing: 'var(--tracking-wide)',
            fontWeight: 'var(--font-light)'
          }}>
            {getContextualSubtext()}
          </p>
        </div>
      )}

      {/* Contextual Action Button */}
      {contextualAction && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          animation: 'sanctuary-gentle-bounce 2s ease-in-out infinite'
        }}>
          <Link
            href={contextualAction.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-breath)',
              padding: 'var(--space-pause) var(--space-comfort)',
              background: 'linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
              color: 'var(--sanctuary-white)',
              borderRadius: '28px',
              textDecoration: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              letterSpacing: 'var(--tracking-wide)',
              border: '1px solid rgba(164, 183, 146, 0.3)',
              boxShadow: '0 4px 16px rgba(164, 183, 146, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s var(--ease-sanctuary)',
              minHeight: '56px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(164, 183, 146, 0.35), 0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(164, 183, 146, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <span style={{ 
              fontSize: '20px',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
            }}>
              {contextualAction.icon}
            </span>
            {contextualAction.text}
          </Link>
        </div>
      )}
    </div>
  );
}

// Gentle bounce animation for the action button
const bounceKeyframes = `
  @keyframes sanctuary-gentle-bounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'contextual-welcome-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = bounceKeyframes;
    document.head.appendChild(style);
  }
}