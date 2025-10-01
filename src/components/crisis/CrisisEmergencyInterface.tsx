/**
 * ALCHM Crisis Emergency Interface
 * 
 * MISSION CRITICAL: Crisis-aware UI transformation system that immediately
 * reconfigures the entire interface during crisis situations to prioritize
 * safety and reduce cognitive load.
 * 
 * This component:
 * - Transforms UI based on crisis severity levels
 * - Removes potentially harmful elements (goals, streaks, comparisons)
 * - Simplifies navigation to reduce cognitive burden
 * - Provides prominent crisis resources
 * - Maintains accessibility and trauma-informed design
 * - Works offline with cached safety resources
 * 
 * During crisis: Safety > Business Metrics > Everything Else
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, 
  Heart, 
  Phone, 
  MessageCircle, 
  Home, 
  X, 
  Moon, 
  Sun,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { EmergencyResourcePanel } from './EmergencyResourcePanel';
import { crisisSafetyMiddleware, type CrisisOverrideState } from '@/middleware/crisis-safety-middleware';
import { businessMetricOverride } from '@/lib/crisis/business-metric-override';
import { realTimeCrisisMonitor } from '@/lib/crisis/real-time-crisis-monitor';
import { type UserContext, type CrisisResource } from '@/lib/global-crisis-resources';
import { logger } from '@/lib/logging';

// Crisis UI states
type CrisisUIState = 
  | 'normal'
  | 'gentle_support'
  | 'crisis_mode'
  | 'emergency_mode'
  | 'safety_lockdown';

// UI transformation configuration
interface CrisisUIConfig {
  state: CrisisUIState;
  hideBusinessMetrics: boolean;
  simplifyNavigation: boolean;
  prominentCrisisResources: boolean;
  reducedCognitiveBurden: boolean;
  emergencyExitButton: boolean;
  callingTheme: boolean;
  accessibilityEnhanced: boolean;
}

// Component props
interface CrisisEmergencyInterfaceProps {
  userId: string;
  userContext: UserContext;
  children: React.ReactNode;
  crisisOverrideState?: CrisisOverrideState;
  onEmergencyExit?: () => void;
  onSafetyConfirmed?: () => void;
  className?: string;
}

// Crisis UI themes
const crisisThemes = {
  normal: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    primaryColor: '#6366f1',
    textColor: '#111827',
    borderColor: '#e5e7eb'
  },
  gentle_support: {
    background: 'linear-gradient(135deg, #fef7e0 0%, #fef3c7 100%)',
    primaryColor: '#f59e0b',
    textColor: '#78350f',
    borderColor: '#fed7aa'
  },
  crisis_mode: {
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    primaryColor: '#ef4444',
    textColor: '#7f1d1d',
    borderColor: '#fecaca'
  },
  emergency_mode: {
    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    primaryColor: '#8b5cf6',
    textColor: '#4c1d95',
    borderColor: '#ddd6fe'
  },
  safety_lockdown: {
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    primaryColor: '#10b981',
    textColor: '#065f46',
    borderColor: '#a7f3d0'
  }
};

/**
 * Crisis Emergency Interface Component
 * 
 * Wraps the entire application and transforms UI during crisis events
 */
export const CrisisEmergencyInterface: React.FC<CrisisEmergencyInterfaceProps> = ({
  userId,
  userContext,
  children,
  crisisOverrideState = 'normal_operation',
  onEmergencyExit,
  onSafetyConfirmed,
  className = ''
}) => {
  // State management
  const [uiState, setUiState] = useState<CrisisUIState>('normal');
  const [config, setConfig] = useState<CrisisUIConfig>({
    state: 'normal',
    hideBusinessMetrics: false,
    simplifyNavigation: false,
    prominentCrisisResources: false,
    reducedCognitiveBurden: false,
    emergencyExitButton: false,
    callingTheme: false,
    accessibilityEnhanced: false
  });
  
  const [emergencyPanelVisible, setEmergencyPanelVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs for accessibility and performance
  const emergencyButtonRef = useRef<HTMLButtonElement>(null);
  const safetyConfirmRef = useRef<HTMLButtonElement>(null);
  const transformationTimeRef = useRef<number>(0);

  /**
   * Map crisis override state to UI state
   */
  const mapOverrideToUIState = useCallback((overrideState: CrisisOverrideState): CrisisUIState => {
    switch (overrideState) {
      case 'normal_operation':
        return 'normal';
      case 'business_metrics_suspended':
        return 'gentle_support';
      case 'emergency_mode':
        return 'crisis_mode';
      case 'professional_escalation':
        return 'emergency_mode';
      case 'system_lockdown':
        return 'safety_lockdown';
      default:
        return 'normal';
    }
  }, []);

  /**
   * Generate UI configuration based on crisis state
   */
  const generateUIConfig = useCallback((state: CrisisUIState): CrisisUIConfig => {
    const baseConfig: CrisisUIConfig = {
      state,
      hideBusinessMetrics: false,
      simplifyNavigation: false,
      prominentCrisisResources: false,
      reducedCognitiveBurden: false,
      emergencyExitButton: false,
      callingTheme: false,
      accessibilityEnhanced: false
    };

    switch (state) {
      case 'gentle_support':
        return {
          ...baseConfig,
          hideBusinessMetrics: true,
          prominentCrisisResources: true,
          emergencyExitButton: true
        };

      case 'crisis_mode':
        return {
          ...baseConfig,
          hideBusinessMetrics: true,
          simplifyNavigation: true,
          prominentCrisisResources: true,
          reducedCognitiveBurden: true,
          emergencyExitButton: true,
          callingTheme: true,
          accessibilityEnhanced: true
        };

      case 'emergency_mode':
        return {
          ...baseConfig,
          hideBusinessMetrics: true,
          simplifyNavigation: true,
          prominentCrisisResources: true,
          reducedCognitiveBurden: true,
          emergencyExitButton: true,
          callingTheme: true,
          accessibilityEnhanced: true
        };

      case 'safety_lockdown':
        return {
          ...baseConfig,
          hideBusinessMetrics: true,
          simplifyNavigation: true,
          prominentCrisisResources: true,
          reducedCognitiveBurden: true,
          emergencyExitButton: true,
          accessibilityEnhanced: true
        };

      default:
        return baseConfig;
    }
  }, []);

  /**
   * Handle UI state transformation
   */
  const transformUIState = useCallback(async (newState: CrisisUIState) => {
    transformationTimeRef.current = Date.now();
    setIsTransitioning(true);

    try {
      // Generate new configuration
      const newConfig = generateUIConfig(newState);
      
      // Apply smooth transition
      await new Promise(resolve => setTimeout(resolve, 150));
      
      setUiState(newState);
      setConfig(newConfig);

      // Auto-show emergency panel for crisis states
      if (['crisis_mode', 'emergency_mode', 'safety_lockdown'].includes(newState)) {
        setEmergencyPanelVisible(true);
      }

      // Focus emergency button for accessibility
      if (newConfig.emergencyExitButton && emergencyButtonRef.current) {
        emergencyButtonRef.current.focus();
      }

      // Log transformation
      const transformTime = Date.now() - transformationTimeRef.current;
      logger.info('Crisis UI transformation completed', {
        userId,
        fromState: uiState,
        toState: newState,
        transformationTime: transformTime,
        configApplied: newConfig
      });

    } catch (error) {
      logger.error('Crisis UI transformation failed', error);
    } finally {
      setIsTransitioning(false);
    }
  }, [userId, uiState, generateUIConfig]);

  /**
   * Handle emergency exit
   */
  const handleEmergencyExit = useCallback(() => {
    try {
      if (onEmergencyExit) {
        onEmergencyExit();
      }

      // Redirect to emergency resources
      window.location.href = '/emergency-safe';
      
    } catch (error) {
      // Fallback to external crisis line
      window.location.href = 'tel:988';
    }
  }, [onEmergencyExit]);

  /**
   * Handle safety confirmation
   */
  const handleSafetyConfirmation = useCallback(async () => {
    try {
      // Clear crisis overrides
      crisisSafetyMiddleware.clearCrisisOverride(userId);
      
      // Resume business metrics if professional review not required
      const suspensionState = businessMetricOverride.getSuspensionState(userId);
      if (suspensionState && !suspensionState.professionalReviewRequired) {
        await businessMetricOverride.resumeBusinessMetrics(userId, 'user_safety_confirmation');
      }

      // Clear monitoring
      realTimeCrisisMonitor.clearUserMonitoring(userId);

      // Callback
      if (onSafetyConfirmed) {
        onSafetyConfirmed();
      }

      // Return to normal state
      await transformUIState('normal');

      logger.info('User confirmed safety - crisis mode deactivated', { userId });

    } catch (error) {
      logger.error('Safety confirmation handling failed', error);
    }
  }, [userId, onSafetyConfirmed, transformUIState]);

  /**
   * Handle resource access
   */
  const handleResourceAccess = useCallback((resource: CrisisResource) => {
    logger.info('Crisis resource accessed from emergency interface', {
      userId,
      resourceType: resource.type,
      resourceName: resource.name,
      uiState
    });
  }, [userId, uiState]);

  /**
   * Toggle emergency panel
   */
  const toggleEmergencyPanel = useCallback(() => {
    setEmergencyPanelVisible(prev => !prev);
  }, []);

  /**
   * Watch for crisis override state changes
   */
  useEffect(() => {
    const newUIState = mapOverrideToUIState(crisisOverrideState);
    if (newUIState !== uiState) {
      transformUIState(newUIState);
    }
  }, [crisisOverrideState, uiState, mapOverrideToUIState, transformUIState]);

  /**
   * Set up keyboard shortcuts for emergency actions
   */
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + H = Emergency Help
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        setEmergencyPanelVisible(true);
      }
      
      // Escape = Close emergency panel (if not in lockdown)
      if (event.key === 'Escape' && uiState !== 'safety_lockdown') {
        setEmergencyPanelVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [uiState]);

  /**
   * Apply theme based on UI state
   */
  const currentTheme = crisisThemes[uiState];

  return (
    <div 
      className={`crisis-emergency-interface ${uiState} ${className}`}
      style={{
        background: currentTheme.background,
        color: currentTheme.textColor,
        minHeight: '100vh',
        transition: isTransitioning ? 'all 0.3s ease-in-out' : 'none'
      }}
      data-crisis-state={uiState}
      role="main"
    >
      {/* Crisis Header Bar */}
      {config.emergencyExitButton && (
        <div className="crisis-header-bar" role="banner">
          <div className="crisis-header-content">
            <div className="crisis-status">
              <Shield size={20} />
              <span>Crisis Support Active</span>
            </div>

            <div className="crisis-controls">
              {/* Emergency Panel Toggle */}
              <button
                ref={emergencyButtonRef}
                onClick={toggleEmergencyPanel}
                className="emergency-toggle"
                aria-label={emergencyPanelVisible ? 'Hide emergency resources' : 'Show emergency resources'}
              >
                <Heart size={18} />
                {!isMinimized && 'Resources'}
              </button>

              {/* Quick Actions */}
              <button
                onClick={() => window.location.href = 'tel:988'}
                className="quick-call"
                aria-label="Call 988 Crisis Lifeline"
              >
                <Phone size={18} />
                {!isMinimized && '988'}
              </button>

              <button
                onClick={() => window.location.href = 'sms:741741'}
                className="quick-text"
                aria-label="Text Crisis Line"
              >
                <MessageCircle size={18} />
                {!isMinimized && 'Text'}
              </button>

              {/* UI Controls */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="minimize-button"
                aria-label={isMinimized ? 'Expand crisis bar' : 'Minimize crisis bar'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>

              {/* Emergency Exit */}
              {uiState === 'safety_lockdown' && (
                <button
                  onClick={handleEmergencyExit}
                  className="emergency-exit"
                  aria-label="Emergency exit to crisis resources"
                >
                  <X size={18} />
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`main-content ${config.reducedCognitiveBurden ? 'simplified' : ''}`}>
        {/* Emergency Resource Panel */}
        {emergencyPanelVisible && (
          <div className="emergency-panel-overlay">
            <EmergencyResourcePanel
              userId={userId}
              userContext={userContext}
              crisisSeverity={uiState === 'safety_lockdown' ? 'critical' : 'high'}
              isVisible={emergencyPanelVisible}
              onResourceAccessed={handleResourceAccess}
              onPanelDismiss={uiState !== 'safety_lockdown' ? () => setEmergencyPanelVisible(false) : undefined}
              compactMode={isMinimized}
              className="emergency-panel"
            />
          </div>
        )}

        {/* Safety Lockdown Mode */}
        {uiState === 'safety_lockdown' && (
          <div className="safety-lockdown-overlay" role="dialog" aria-modal="true">
            <div className="safety-lockdown-content">
              <Shield size={48} />
              <h1>Safety Check</h1>
              <p>
                We want to make sure you're safe. Take a moment to breathe and know that help is available.
              </p>
              
              <div className="safety-actions">
                <button
                  ref={safetyConfirmRef}
                  onClick={handleSafetyConfirmation}
                  className="safety-confirm"
                >
                  <Heart size={20} />
                  I'm Safe - Continue
                </button>
                
                <button
                  onClick={handleEmergencyExit}
                  className="emergency-help"
                >
                  <Phone size={20} />
                  I Need Help Now
                </button>
              </div>

              <div className="safety-resources">
                <p>Available 24/7:</p>
                <div className="quick-contacts">
                  <button onClick={() => window.location.href = 'tel:988'}>
                    📞 988 Crisis Line
                  </button>
                  <button onClick={() => window.location.href = 'sms:741741'}>
                    💬 Text HOME to 741741
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modified Content */}
        <div className={`content-wrapper ${config.hideBusinessMetrics ? 'metrics-hidden' : ''}`}>
          {children}
        </div>
      </div>

      <style jsx>{`
        .crisis-emergency-interface {
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .crisis-header-bar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid ${currentTheme.borderColor};
          padding: 0.75rem 1rem;
        }

        .crisis-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .crisis-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: ${currentTheme.primaryColor};
        }

        .crisis-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .emergency-toggle,
        .quick-call,
        .quick-text,
        .minimize-button,
        .emergency-exit {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid ${currentTheme.borderColor};
          border-radius: 6px;
          background: white;
          color: ${currentTheme.textColor};
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .emergency-toggle:hover,
        .quick-call:hover,
        .quick-text:hover,
        .minimize-button:hover {
          background: ${currentTheme.primaryColor};
          color: white;
          transform: translateY(-1px);
        }

        .emergency-exit {
          background: #dc2626;
          color: white;
          border-color: #dc2626;
        }

        .emergency-exit:hover {
          background: #b91c1c;
        }

        .main-content {
          position: relative;
        }

        .main-content.simplified {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }

        .emergency-panel-overlay {
          position: fixed;
          top: ${config.emergencyExitButton ? '80px' : '20px'};
          right: 20px;
          z-index: 999;
          max-width: 400px;
          width: calc(100vw - 40px);
        }

        .safety-lockdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .safety-lockdown-content {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          text-align: center;
          max-width: 500px;
          width: calc(100vw - 40px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .safety-lockdown-content h1 {
          margin: 1rem 0;
          font-size: 2rem;
          color: ${currentTheme.primaryColor};
        }

        .safety-lockdown-content p {
          margin: 1.5rem 0;
          font-size: 1.125rem;
          line-height: 1.6;
          color: #374151;
        }

        .safety-actions {
          display: flex;
          gap: 1rem;
          margin: 2rem 0;
          justify-content: center;
          flex-wrap: wrap;
        }

        .safety-confirm,
        .emergency-help {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .safety-confirm {
          background: ${currentTheme.primaryColor};
          color: white;
        }

        .safety-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .emergency-help {
          background: #dc2626;
          color: white;
        }

        .emergency-help:hover {
          background: #b91c1c;
        }

        .safety-resources {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .quick-contacts {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .quick-contacts button {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .quick-contacts button:hover {
          background: #f9fafb;
          border-color: ${currentTheme.primaryColor};
        }

        .content-wrapper.metrics-hidden {
          /* Hide business metrics when in crisis mode */
        }

        .content-wrapper.metrics-hidden [data-metric="streak"],
        .content-wrapper.metrics-hidden [data-metric="goal"],
        .content-wrapper.metrics-hidden [data-metric="comparison"],
        .content-wrapper.metrics-hidden [data-metric="analytics"] {
          display: none !important;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .crisis-header-content {
            flex-direction: column;
            gap: 0.75rem;
          }

          .crisis-controls {
            width: 100%;
            justify-content: space-between;
          }

          .emergency-toggle,
          .quick-call,
          .quick-text {
            flex: 1;
            justify-content: center;
          }

          .emergency-panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100vw;
            max-width: none;
          }

          .safety-lockdown-content {
            padding: 2rem;
          }

          .safety-actions {
            flex-direction: column;
            align-items: center;
          }

          .safety-confirm,
          .emergency-help {
            width: 100%;
            max-width: 300px;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .crisis-header-bar {
            border-bottom-width: 3px;
          }

          .emergency-toggle,
          .quick-call,
          .quick-text,
          .minimize-button {
            border-width: 2px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .crisis-emergency-interface,
          .emergency-toggle,
          .quick-call,
          .quick-text,
          .safety-confirm,
          .emergency-help {
            transition: none;
          }

          .emergency-toggle:hover,
          .quick-call:hover,
          .quick-text:hover,
          .safety-confirm:hover {
            transform: none;
          }
        }

        /* Focus styles for accessibility */
        .emergency-toggle:focus,
        .quick-call:focus,
        .quick-text:focus,
        .minimize-button:focus,
        .emergency-exit:focus,
        .safety-confirm:focus,
        .emergency-help:focus {
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default CrisisEmergencyInterface;