'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBetaAccess } from '@/hooks/useBetaAccess';
import { AutoBugReporter } from './AutoBugReporter';
import { FeedbackWidget } from './FeedbackWidget';
import { BetaMessages } from './BetaMessages';
import { BetaOnboarding } from './BetaOnboarding';
import { BetaUser } from '@/types/beta';
import { betaUserService } from '@/lib/beta/betaUserService';

interface BetaContextType {
  isBetaUser: boolean;
  betaUser: BetaUser | null;
  isOnboarded: boolean;
  showOnboarding: boolean;
  completeOnboarding: () => void;
}

const BetaContext = createContext<BetaContextType>({
  isBetaUser: false,
  betaUser: null,
  isOnboarded: false,
  showOnboarding: false,
  completeOnboarding: () => {}
});

export function useBeta() {
  return useContext(BetaContext);
}

interface BetaProviderProps {
  children: React.ReactNode;
  enableAutoBugReporting?: boolean;
  enableFeedbackWidget?: boolean;
  enableBetaMessages?: boolean;
  feedbackWidgetPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  contextualTriggers?: {
    errorBoundary?: boolean;
    idleTime?: number;
    pageTime?: number;
    frustrationDetection?: boolean;
  };
}

export function BetaProvider({
  children,
  enableAutoBugReporting = true,
  enableFeedbackWidget = true,
  enableBetaMessages = true,
  feedbackWidgetPosition = 'bottom-right',
  contextualTriggers = {
    errorBoundary: true,
    idleTime: 30,
    pageTime: 60,
    frustrationDetection: true
  }
}: BetaProviderProps) {
  const { user } = useAuth();
  const { isBetaUser, betaUser, loading: betaLoading } = useBetaAccess();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (betaUser && !betaLoading) {
      // Check if user needs onboarding
      const needsOnboarding = betaUser.status === 'pending';
      setIsOnboarded(!needsOnboarding);
      setShowOnboarding(needsOnboarding);
    }
  }, [betaUser, betaLoading]);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setIsOnboarded(true);
    setOnboardingComplete(true);
  };

  const handleOnboardingComplete = async (completedBetaUser: BetaUser) => {
    completeOnboarding();
    
    // Send welcome message and create onboarding survey
    try {
      const { messagingService } = await import('@/lib/beta/messagingService');
      const { surveyService } = await import('@/lib/beta/surveyService');
      
      await messagingService.sendWelcomeMessage(
        completedBetaUser.uid,
        completedBetaUser.displayName
      );
      
      await surveyService.createOnboardingSurvey(completedBetaUser.uid);
    } catch (error) {
      console.error('Failed to complete onboarding setup:', error);
    }
  };

  const contextValue: BetaContextType = {
    isBetaUser,
    betaUser,
    isOnboarded,
    showOnboarding,
    completeOnboarding
  };

  return (
    <BetaContext.Provider value={contextValue}>
      {children}
      
      {/* Beta Testing Components */}
      {isBetaUser && isOnboarded && (
        <>
          {/* Auto Bug Reporter */}
          {enableAutoBugReporting && (
            <AutoBugReporter
              enableJSErrorCapture={true}
              enableUnhandledRejectionCapture={true}
              enablePerformanceMonitoring={true}
              enableNetworkErrorCapture={true}
              enableUserInteractionCapture={true}
            />
          )}
          
          {/* Feedback Widget */}
          {enableFeedbackWidget && (
            <FeedbackWidget
              trigger="floating"
              position={feedbackWidgetPosition}
              contextualTriggers={contextualTriggers}
            />
          )}
        </>
      )}
      
      {/* Beta Onboarding Modal */}
      {showOnboarding && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <BetaOnboarding onComplete={handleOnboardingComplete} />
          </div>
        </div>
      )}
      
      {/* Beta Messages Notification */}
      {enableBetaMessages && isBetaUser && isOnboarded && (
        <BetaMessagesNotification />
      )}
    </BetaContext.Provider>
  );
}

// Beta Messages Notification Component
function BetaMessagesNotification() {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const { betaUser } = useBeta();

  useEffect(() => {
    if (betaUser) {
      checkUnreadMessages();
      
      // Check for unread messages every 5 minutes
      const interval = setInterval(checkUnreadMessages, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [betaUser]);

  const checkUnreadMessages = async () => {
    if (!betaUser) return;
    
    try {
      const { messagingService } = await import('@/lib/beta/messagingService');
      const messages = await messagingService.getMessagesForUser(betaUser.uid, {
        unreadOnly: true,
        limit: 1
      });
      
      setHasUnreadMessages(messages.length > 0);
    } catch (error) {
      console.error('Failed to check unread messages:', error);
    }
  };

  if (!hasUnreadMessages) {
    return null;
  }

  return (
    <>
      {/* Unread Messages Indicator */}
      <div className="fixed top-4 right-20 z-40">
        <button
          onClick={() => setShowMessages(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">New Messages</span>
        </button>
      </div>

      {/* Messages Modal */}
      {showMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Beta Messages</h2>
              <button
                onClick={() => {
                  setShowMessages(false);
                  setHasUnreadMessages(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <BetaMessages showUnreadOnly={true} maxMessages={20} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Error Boundary for Beta Testing
export class BetaErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error, errorInfo: any) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Beta Error Boundary caught error:', error, errorInfo);
    
    // Report error to beta feedback system
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Auto-report critical errors
    this.reportErrorToBeta(error, errorInfo);
  }

  private async reportErrorToBeta(error: Error, errorInfo: any) {
    try {
      const { feedbackService } = await import('@/lib/beta/feedbackService');
      
      await feedbackService.submitFeedback({
        type: 'bug',
        title: `Critical Error: ${error.name}`,
        description: `**Error Message:** ${error.message}\n\n**Stack Trace:**\n\`\`\`\n${error.stack}\n\`\`\`\n\n**Component Stack:**\n\`\`\`\n${errorInfo.componentStack}\n\`\`\``,
        priority: 'critical',
        tags: ['auto-detected', 'error-boundary', 'critical'],
        userId: 'current-user', // This should come from auth context
        includeScreenshot: true,
        includeConsoleLog: true
      });
    } catch (reportError) {
      console.error('Failed to report error to beta system:', reportError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-red-500 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-lg font-medium text-gray-900">
                Something went wrong
              </h1>
            </div>
            
            <p className="text-gray-600 mb-4">
              We've automatically reported this error to help improve the beta experience.
            </p>
            
            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-sm text-gray-800 font-medium">
                Error: {this.state.error?.name}
              </p>
              <p className="text-sm text-gray-600">
                {this.state.error?.message}
              </p>
            </div>
            
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Beta Testing Feature Gate HOC
export function withBetaFeature<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureFlag: string,
  fallback?: React.ComponentType<P>
) {
  return function BetaFeatureGate(props: P) {
    const { isBetaUser } = useBeta();
    const { canAccessFeature } = useBetaAccess();

    if (!isBetaUser || !canAccessFeature(featureFlag)) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent {...props} />;
      }
      
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">
            Beta Feature
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            This feature is currently in beta testing. Join our beta program to access it.
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}