'use client';

import React from 'react';
import { SacredCard, SacredText, SacredButton } from '@/components/SacredUIFoundation';

// ===== NAVIGATION GUIDANCE TYPES =====

export type NavigationSituation = 
  | 'connection_pause'
  | 'path_exploration' 
  | 'preparation_needed'
  | 'sanctuary_refresh'
  | 'offline_reflection';

export type GuidanceStyle = 'gentle' | 'direct' | 'mystical' | 'supportive';

export interface NavigationGuidanceProps {
  situation: NavigationSituation;
  style?: GuidanceStyle;
  onRetry?: () => void;
  onExploreAlternative?: () => void;
  className?: string;
  showActions?: boolean;
}

// ===== STRENGTH-BASED GUIDANCE MESSAGES =====

const guidanceMessages = {
  connection_pause: {
    gentle: {
      title: "Taking a Mindful Pause",
      message: "Your sacred space is refreshing its connection. This is a perfect moment for a mindful breath.",
      action: "Let's reconnect when you're ready"
    },
    direct: {
      title: "Connection Refreshing", 
      message: "We're strengthening your connection to ensure the best experience.",
      action: "Continue when ready"
    },
    mystical: {
      title: "Sacred Recalibration",
      message: "The digital realm is aligning energies to better serve your journey.",
      action: "Enter when the stars align"
    },
    supportive: {
      title: "Connection Support",
      message: "We're working to restore your connection. Your patience is appreciated.",
      action: "Try connecting again"
    }
  },
  
  path_exploration: {
    gentle: {
      title: "Exploring New Pathways",
      message: "This path seems to be taking a rest. Let's explore another beautiful route together.",
      action: "Discover alternative paths"
    },
    direct: {
      title: "Alternative Route Needed",
      message: "This page isn't available right now. Let's find another way to your destination.",
      action: "Explore other options"
    },
    mystical: {
      title: "The Path Transforms",
      message: "This passage has shifted into the mists. The universe guides us toward another doorway.",
      action: "Follow the new pathway"
    },
    supportive: {
      title: "Navigation Support",
      message: "This area isn't accessible right now, but there are many other ways to continue your journey.",
      action: "Find another route"
    }
  },
  
  preparation_needed: {
    gentle: {
      title: "Sacred Preparation Invited",
      message: "This area of your sanctuary invites deeper preparation before entering.",
      action: "Prepare for this experience"
    },
    direct: {
      title: "Access Preparation Required",
      message: "Additional steps are needed before accessing this content.",
      action: "Complete preparation"
    },
    mystical: {
      title: "Threshold Guardian",
      message: "The guardian of this realm asks for proper preparation before passage is granted.",
      action: "Gather your tools"
    },
    supportive: {
      title: "Gentle Preparation",
      message: "This feature requires a bit more setup to ensure your best experience.",
      action: "Let's prepare together"
    }
  },
  
  sanctuary_refresh: {
    gentle: {
      title: "Sanctuary Renewal",
      message: "Your digital sanctuary is renewing itself to better serve your sacred work.",
      action: "Enter your refreshed space"
    },
    direct: {
      title: "System Refresh",
      message: "Your experience is being optimized for better performance.",
      action: "Return to your space"
    },
    mystical: {
      title: "Cosmic Realignment", 
      message: "The cosmic forces are realigning your digital sanctuary for enhanced harmony.",
      action: "Step into the renewed realm"
    },
    supportive: {
      title: "Experience Enhancement",
      message: "We're updating your experience to make it even more supportive and responsive.",
      action: "Continue your journey"
    }
  },
  
  offline_reflection: {
    gentle: {
      title: "Offline Sacred Space",
      message: "Your sanctuary is preparing for offline reflection. Your thoughts and insights remain safe.",
      action: "Continue in reflection mode"
    },
    direct: {
      title: "Offline Mode Active",
      message: "You're now in offline mode. Your entries will sync when connection is restored.",
      action: "Continue journaling"
    },
    mystical: {
      title: "Inner Realm Activated",
      message: "The connection to the outer realm has quieted. Your inner sanctuary remains fully alive.",
      action: "Journey within"
    },
    supportive: {
      title: "Offline Support Available",
      message: "Even without connection, your journaling space remains available and secure.",
      action: "Continue your practice"
    }
  }
};

// ===== NAVIGATION GUIDANCE COMPONENT =====

export function NavigationGuidance({
  situation,
  style = 'gentle',
  onRetry,
  onExploreAlternative,
  className = '',
  showActions = true
}: NavigationGuidanceProps) {
  
  const guidance = guidanceMessages[situation][style];
  
  const getIcon = (situation: NavigationSituation): string => {
    const icons = {
      connection_pause: '🔄',
      path_exploration: '🗺️',
      preparation_needed: '🌟',
      sanctuary_refresh: '✨',
      offline_reflection: '🌙'
    };
    return icons[situation];
  };
  
  return (
    <SacredCard 
      variant="gentle" 
      className={`navigation-guidance ${className}`}
    >
      <div className="text-center space-y-ritual">
        <div className="text-4xl">{getIcon(situation)}</div>
        
        <div className="space-y-breath">
          <SacredText variant="title" as="h3">
            {guidance.title}
          </SacredText>
          
          <SacredText variant="body">
            {guidance.message}
          </SacredText>
        </div>
        
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-breath justify-center">
            {onRetry && (
              <SacredButton
                intention="primary"
                size="comfortable"
                onClick={onRetry}
              >
                {guidance.action}
              </SacredButton>
            )}
            
            {onExploreAlternative && (
              <SacredButton
                intention="gentle"
                size="comfortable"
                onClick={onExploreAlternative}
              >
                Explore Alternatives
              </SacredButton>
            )}
            
            {!onRetry && !onExploreAlternative && (
              <SacredButton
                intention="gentle"
                size="comfortable"
                onClick={() => window.history.back()}
              >
                Return to Previous Space
              </SacredButton>
            )}
          </div>
        )}
      </div>
    </SacredCard>
  );
}

// ===== LOADING GUIDANCE COMPONENT =====

export interface LoadingGuidanceProps {
  activity: 'content' | 'ai_response' | 'data_sync' | 'sanctuary_prep';
  style?: GuidanceStyle;
  className?: string;
}

export function LoadingGuidance({
  activity,
  style = 'gentle',
  className = ''
}: LoadingGuidanceProps) {
  
  const loadingMessages = {
    content: {
      gentle: "Preparing your personalized experience with care",
      direct: "Loading your content",
      mystical: "Weaving your digital tapestry",
      supportive: "Gathering your sacred materials"
    },
    ai_response: {
      gentle: "KHEPERA is gathering wisdom to share with you",
      direct: "Generating AI response",
      mystical: "Consulting the oracle of ancient wisdom",
      supportive: "Your AI companion is preparing thoughtful insights"
    },
    data_sync: {
      gentle: "Synchronizing your sacred memories across realms",
      direct: "Syncing your data",
      mystical: "Harmonizing your digital essence",
      supportive: "Ensuring your thoughts are safely preserved"
    },
    sanctuary_prep: {
      gentle: "Preparing your sanctuary with loving attention",
      direct: "Setting up your workspace",
      mystical: "Consecrating your digital temple",
      supportive: "Creating your perfect reflection space"
    }
  };
  
  return (
    <SacredCard variant="gentle" className={`loading-guidance ${className}`}>
      <div className="text-center space-y-breath">
        <div className="animate-pulse">
          <div className="w-8 h-8 mx-auto rounded-full bg-grounding-earth opacity-75" />
        </div>
        
        <SacredText variant="body" className="text-subtle">
          {loadingMessages[activity][style]}
        </SacredText>
      </div>
    </SacredCard>
  );
}

// ===== ERROR NAVIGATION COMPONENT =====

export interface ErrorNavigationProps {
  errorType: 'network' | 'permission' | 'resource' | 'unexpected';
  userFriendlyMessage?: string;
  onRetry?: () => void;
  onReportIssue?: () => void;
  className?: string;
}

export function ErrorNavigation({
  errorType,
  userFriendlyMessage,
  onRetry,
  onReportIssue,
  className = ''
}: ErrorNavigationProps) {
  
  const errorGuidance = {
    network: {
      title: "Connection Exploration",
      message: userFriendlyMessage || "We're exploring alternative pathways to reconnect you to your sacred space.",
      icon: "🌐"
    },
    permission: {
      title: "Sacred Boundary",
      message: userFriendlyMessage || "This area requires special permission to enter. Let's find another way to support your journey.",
      icon: "🔐"
    },
    resource: {
      title: "Resource Gathering",
      message: userFriendlyMessage || "The resource you're seeking is currently being renewed. Let's explore what else is available.",
      icon: "📦"
    },
    unexpected: {
      title: "Unexpected Discovery",
      message: userFriendlyMessage || "We've discovered something unexpected. Let's navigate this together with patience and curiosity.",
      icon: "🧭"
    }
  };
  
  const guidance = errorGuidance[errorType];
  
  return (
    <SacredCard variant="warm" className={`error-navigation ${className}`}>
      <div className="text-center space-y-ritual">
        <div className="text-4xl">{guidance.icon}</div>
        
        <div className="space-y-breath">
          <SacredText variant="title" as="h3">
            {guidance.title}
          </SacredText>
          
          <SacredText variant="body">
            {guidance.message}
          </SacredText>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-breath justify-center">
          {onRetry && (
            <SacredButton
              intention="primary"
              size="comfortable"
              onClick={onRetry}
            >
              Explore Another Path
            </SacredButton>
          )}
          
          <SacredButton
            intention="gentle"
            size="comfortable"
            onClick={() => window.history.back()}
          >
            Return to Safety
          </SacredButton>
          
          {onReportIssue && (
            <SacredButton
              intention="release"
              size="comfortable"
              onClick={onReportIssue}
            >
              Share This Discovery
            </SacredButton>
          )}
        </div>
      </div>
    </SacredCard>
  );
}

// ===== UTILITY FUNCTIONS =====

export function getNavigationGuidanceMessage(
  situation: NavigationSituation,
  style: GuidanceStyle = 'gentle'
): string {
  return guidanceMessages[situation][style].message;
}

export function createStrengthBasedErrorMessage(
  technicalError: string,
  context: 'user' | 'developer' = 'user'
): string {
  if (context === 'developer') {
    return technicalError; // Keep technical details for developers
  }
  
  // Transform technical errors into strength-based guidance for users
  const transformations: Record<string, string> = {
    '404': 'This pathway is currently exploring new destinations',
    '500': 'Our systems are taking a moment to recalibrate',
    '403': 'This area invites special preparation before entry',
    'network error': 'Connection is seeking the best pathway to reach you',
    'timeout': 'The request took a mindful pause - let\'s try again',
    'not found': 'This resource is on a journey of its own',
    'unauthorized': 'Additional preparation is needed for this sacred space'
  };
  
  for (const [technical, friendly] of Object.entries(transformations)) {
    if (technicalError.toLowerCase().includes(technical)) {
      return friendly;
    }
  }
  
  return 'We\'re navigating this situation together with patience and curiosity';
}

// ===== EXPORT ALL COMPONENTS =====

export {
  NavigationGuidance as default,
  LoadingGuidance,
  ErrorNavigation,
  getNavigationGuidanceMessage,
  createStrengthBasedErrorMessage
};