/**
 * ALCHM Crisis Quick Access Component
 * 
 * MISSION CRITICAL: Quick access patterns for crisis resources.
 * Designed for immediate access during emergency situations.
 * 
 * Design Principles:
 * - Always visible and easily accessible during crisis
 * - Large touch targets for trembling hands or motor difficulties
 * - High contrast and clear visual hierarchy
 * - Multiple activation methods (touch, keyboard, voice)
 * - Persistent across navigation states
 * - Offline-capable with cached emergency numbers
 * - Cultural competency for diverse user needs
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  Headphones,
  Globe,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  AlertCircle,
  Users
} from 'lucide-react';
import { CrisisEmergencyButton } from './CrisisEmergencyButton';

export interface QuickAccessResource {
  id: string;
  name: string;
  shortName: string;
  contact: {
    phone?: string;
    text?: string;
    website?: string;
  };
  type: 'emergency' | 'crisis' | 'support' | 'specialized';
  priority: number;
  available24_7: boolean;
  languages: string[];
  description: string;
  icon?: React.ReactNode;
}

export type QuickAccessPosition = 
  | 'bottom'        // Fixed to bottom of screen
  | 'top'           // Fixed to top of screen
  | 'side'          // Fixed to side of screen
  | 'floating'      // Floating in corner
  | 'modal';        // Modal overlay

export type QuickAccessSize = 
  | 'compact'       // Minimal space usage
  | 'standard'      // Standard size
  | 'large'         // Larger for accessibility
  | 'full';         // Full width/height

interface CrisisQuickAccessProps {
  resources: QuickAccessResource[];
  position?: QuickAccessPosition;
  size?: QuickAccessSize;
  isVisible?: boolean;
  isExpanded?: boolean;
  persistAcrossNavigation?: boolean;
  enableVoiceActivation?: boolean;
  className?: string;
  onResourceAccessed?: (resource: QuickAccessResource) => void;
  onToggleExpanded?: (expanded: boolean) => void;
  onDismiss?: () => void;
  emergencyMode?: boolean;
  userLanguage?: string;
  enableSound?: boolean;
}

/**
 * Crisis Quick Access Component
 * 
 * Provides persistent, easily accessible crisis resources
 */
export const CrisisQuickAccess: React.FC<CrisisQuickAccessProps> = ({
  resources = [],
  position = 'bottom',
  size = 'standard',
  isVisible = true,
  isExpanded: controlledExpanded,
  persistAcrossNavigation = true,
  enableVoiceActivation = false,
  className = '',
  onResourceAccessed,
  onToggleExpanded,
  onDismiss,
  emergencyMode = false,
  userLanguage = 'en',
  enableSound = false
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLAudioElement>(null);

  // Controlled vs uncontrolled expanded state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  // Sort resources by priority and availability
  const sortedResources = React.useMemo(() => {
    return [...resources]
      .filter(resource => resource.languages.includes(userLanguage) || resource.languages.includes('en'))
      .sort((a, b) => {
        // Emergency resources first
        if (a.type === 'emergency' && b.type !== 'emergency') return -1;
        if (b.type === 'emergency' && a.type !== 'emergency') return 1;
        
        // Then by priority
        if (a.priority !== b.priority) return a.priority - b.priority;
        
        // Then by 24/7 availability
        if (a.available24_7 !== b.available24_7) return a.available24_7 ? -1 : 1;
        
        return 0;
      });
  }, [resources, userLanguage]);

  // Handle expand/collapse
  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded;
    
    if (onToggleExpanded) {
      onToggleExpanded(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }

    // Play sound feedback if enabled
    if (soundEnabled && soundRef.current) {
      soundRef.current.play().catch(() => {
        // Ignore sound errors
      });
    }
  };

  // Handle resource access
  const handleResourceAccess = (resource: QuickAccessResource, contactType: 'phone' | 'text' | 'website') => {
    if (onResourceAccessed) {
      onResourceAccessed(resource);
    }

    // Handle contact based on type
    switch (contactType) {
      case 'phone':
        if (resource.contact.phone) {
          window.location.href = `tel:${resource.contact.phone}`;
        }
        break;
      case 'text':
        if (resource.contact.text) {
          window.location.href = `sms:${resource.contact.text}`;
        }
        break;
      case 'website':
        if (resource.contact.website) {
          window.open(resource.contact.website, '_blank', 'noopener,noreferrer');
        }
        break;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + C = Toggle Crisis Quick Access
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        handleToggleExpanded();
      }
      
      // Escape = Collapse if expanded
      if (event.key === 'Escape' && isExpanded) {
        if (onToggleExpanded) {
          onToggleExpanded(false);
        } else {
          setInternalExpanded(false);
        }
      }
    };

    if (persistAcrossNavigation) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded, persistAcrossNavigation, onToggleExpanded]);

  // Voice activation setup
  useEffect(() => {
    if (!enableVoiceActivation || !('webkitSpeechRecognition' in window)) return;

    // Voice activation implementation would go here
    // For security and privacy, this is left as a placeholder
  }, [enableVoiceActivation]);

  // Don't render if not visible
  if (!isVisible) return null;

  // Get position-specific styles
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'crisis-quick-access--top';
      case 'side':
        return 'crisis-quick-access--side';
      case 'floating':
        return 'crisis-quick-access--floating';
      case 'modal':
        return 'crisis-quick-access--modal';
      default:
        return 'crisis-quick-access--bottom';
    }
  };

  const classes = [
    'crisis-quick-access',
    getPositionClasses(),
    `crisis-quick-access--${size}`,
    isExpanded && 'crisis-quick-access--expanded',
    isMinimized && 'crisis-quick-access--minimized',
    emergencyMode && 'crisis-quick-access--emergency',
    isDragging && 'crisis-quick-access--dragging',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <div 
        ref={containerRef}
        className={classes}
        role="complementary"
        aria-label="Crisis support quick access"
        aria-expanded={isExpanded}
      >
        {/* Toggle Handle */}
        <div 
          ref={dragRef}
          className="crisis-quick-access__handle"
          onClick={handleToggleExpanded}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleExpanded();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={isExpanded ? 'Collapse crisis resources' : 'Expand crisis resources'}
        >
          <div className="handle-content">
            <Shield size={20} />
            <span className="handle-text">
              {emergencyMode ? 'Emergency Help' : 'Crisis Support'}
            </span>
            <div className="handle-icon">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>
          </div>
          
          {emergencyMode && (
            <div className="emergency-indicator">
              <AlertCircle size={16} />
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="crisis-quick-access__content">
            {/* Quick Actions Header */}
            <div className="quick-actions-header">
              <h3 className="header-title">
                {emergencyMode ? 'Emergency Resources' : 'Crisis Support'}
              </h3>
              
              <div className="header-controls">
                {/* Sound Toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="control-button"
                  aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                
                {/* Minimize Toggle */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="control-button"
                  aria-label={isMinimized ? 'Expand content' : 'Minimize content'}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                
                {/* Close Button */}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="control-button close-button"
                    aria-label="Close crisis support panel"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Critical Emergency Actions */}
            {!isMinimized && emergencyMode && (
              <div className="critical-actions">
                <h4 className="critical-title">Immediate Help</h4>
                <div className="critical-buttons">
                  <CrisisEmergencyButton
                    variant="call"
                    size="compact"
                    href="tel:988"
                    className="critical-button"
                    pulseAnimation={true}
                  >
                    988
                  </CrisisEmergencyButton>
                  
                  <CrisisEmergencyButton
                    variant="text"
                    size="compact"
                    href="sms:741741"
                    className="critical-button"
                  >
                    Text
                  </CrisisEmergencyButton>
                  
                  <CrisisEmergencyButton
                    variant="call"
                    size="compact"
                    href="tel:911"
                    className="critical-button emergency-911"
                  >
                    911
                  </CrisisEmergencyButton>
                </div>
              </div>
            )}

            {/* Resource List */}
            {!isMinimized && (
              <div className="resource-list">
                {sortedResources.slice(0, 6).map(resource => (
                  <div key={resource.id} className="resource-item">
                    <div className="resource-header">
                      <div className="resource-icon">
                        {resource.icon || <Heart size={16} />}
                      </div>
                      <div className="resource-info">
                        <span className="resource-name">{resource.shortName}</span>
                        {resource.available24_7 && (
                          <span className="availability-badge">24/7</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="resource-actions">
                      {resource.contact.phone && (
                        <button
                          onClick={() => handleResourceAccess(resource, 'phone')}
                          className="resource-action-button phone"
                          aria-label={`Call ${resource.name}`}
                        >
                          <Phone size={14} />
                        </button>
                      )}
                      
                      {resource.contact.text && (
                        <button
                          onClick={() => handleResourceAccess(resource, 'text')}
                          className="resource-action-button text"
                          aria-label={`Text ${resource.name}`}
                        >
                          <MessageCircle size={14} />
                        </button>
                      )}
                      
                      {resource.contact.website && (
                        <button
                          onClick={() => handleResourceAccess(resource, 'website')}
                          className="resource-action-button website"
                          aria-label={`Visit ${resource.name} website`}
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {sortedResources.length === 0 && (
                  <div className="no-resources">
                    <Users size={24} />
                    <span>No resources available</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Info */}
            {!isMinimized && (
              <div className="quick-access-footer">
                <span className="footer-text">
                  Press Ctrl+Shift+C to toggle • Free & confidential
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sound Element */}
      {soundEnabled && (
        <audio
          ref={soundRef}
          preload="auto"
          style={{ display: 'none' }}
        >
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmccDjaU3/XEcSAFM4nL4seaNiMNW7TZ2n4wAy2BQRC+YjR8UEh" type="audio/wav" />
        </audio>
      )}

      <style jsx>{`
        .crisis-quick-access {
          position: fixed;
          z-index: 10000;
          background: var(--crisis-sanctuary, #fefefe);
          border: 2px solid var(--crisis-sage-primary, #8ba675);
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 20px rgba(139, 166, 117, 0.2);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          user-select: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Position Variants */
        .crisis-quick-access--bottom {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 600px;
        }

        .crisis-quick-access--top {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 600px;
          border-radius: 0 0 16px 16px;
          box-shadow: 0 4px 20px rgba(139, 166, 117, 0.2);
        }

        .crisis-quick-access--side {
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          max-height: 80vh;
          border-radius: 16px 0 0 16px;
        }

        .crisis-quick-access--floating {
          bottom: 20px;
          right: 20px;
          width: 320px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 166, 117, 0.25);
        }

        .crisis-quick-access--modal {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: 500px;
          max-height: 80vh;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        /* Size Variants */
        .crisis-quick-access--compact {
          --handle-height: 48px;
          --content-padding: 1rem;
        }

        .crisis-quick-access--standard {
          --handle-height: 56px;
          --content-padding: 1.5rem;
        }

        .crisis-quick-access--large {
          --handle-height: 64px;
          --content-padding: 2rem;
        }

        .crisis-quick-access--full {
          width: 100vw !important;
          max-width: none !important;
          --handle-height: 64px;
          --content-padding: 2rem;
        }

        /* Emergency Mode */
        .crisis-quick-access--emergency {
          border-color: var(--crisis-emergency-red, #b87d7d);
          box-shadow: 0 -4px 20px rgba(184, 125, 125, 0.3);
        }

        .crisis-quick-access--emergency .crisis-quick-access__handle {
          background: linear-gradient(
            135deg,
            var(--crisis-emergency-red-bg, #f5f0f0) 0%,
            var(--crisis-sanctuary, #fefefe) 100%
          );
          border-bottom: 2px solid var(--crisis-emergency-red, #b87d7d);
        }

        /* Handle */
        .crisis-quick-access__handle {
          height: var(--handle-height, 56px);
          background: var(--crisis-sage-light, #f7f9f6);
          border-bottom: 1px solid var(--crisis-sage-muted, #e8ede4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          outline: none;
          transition: all 0.2s ease;
        }

        .crisis-quick-access__handle:hover {
          background: var(--crisis-sage-muted, #e8ede4);
        }

        .crisis-quick-access__handle:focus {
          outline: 3px solid var(--crisis-sage-primary, #8ba675);
          outline-offset: -3px;
        }

        .handle-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--crisis-sage-deep, #6b8559);
          font-weight: 600;
        }

        .handle-text {
          font-size: 1rem;
        }

        .handle-icon {
          transition: transform 0.2s ease;
        }

        .crisis-quick-access--expanded .handle-icon {
          transform: rotate(180deg);
        }

        .emergency-indicator {
          position: absolute;
          right: 1rem;
          color: var(--crisis-emergency-red, #b87d7d);
          animation: crisis-pulse 2s ease-in-out infinite;
        }

        @keyframes crisis-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Content */
        .crisis-quick-access__content {
          padding: var(--content-padding, 1.5rem);
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--crisis-sage-primary, #8ba675) transparent;
        }

        .crisis-quick-access__content::-webkit-scrollbar {
          width: 6px;
        }

        .crisis-quick-access__content::-webkit-scrollbar-track {
          background: transparent;
        }

        .crisis-quick-access__content::-webkit-scrollbar-thumb {
          background: var(--crisis-sage-primary, #8ba675);
          border-radius: 3px;
        }

        /* Header */
        .quick-actions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--crisis-sage-muted, #e8ede4);
        }

        .header-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--crisis-sage-deep, #6b8559);
          margin: 0;
        }

        .header-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid var(--crisis-sage-muted, #e8ede4);
          border-radius: 6px;
          color: var(--crisis-sage-deep, #6b8559);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-button:hover {
          background: var(--crisis-sage-light, #f7f9f6);
          border-color: var(--crisis-sage-primary, #8ba675);
        }

        .close-button {
          background: var(--crisis-emergency-red-bg, #f5f0f0);
          border-color: var(--crisis-emergency-red, #b87d7d);
          color: var(--crisis-emergency-red, #b87d7d);
          font-size: 1.25rem;
          font-weight: bold;
        }

        .close-button:hover {
          background: var(--crisis-emergency-red, #b87d7d);
          color: white;
        }

        /* Critical Actions */
        .critical-actions {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--crisis-emergency-red-bg, #f5f0f0);
          border: 1px solid var(--crisis-emergency-red, #b87d7d);
          border-radius: 12px;
        }

        .critical-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--crisis-emergency-red, #b87d7d);
          margin: 0 0 0.75rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .critical-buttons {
          display: flex;
          gap: 0.5rem;
          justify-content: space-between;
        }

        .critical-button {
          flex: 1;
          min-width: 0;
        }

        .emergency-911 {
          background: #dc2626 !important;
          border-color: #dc2626 !important;
        }

        .emergency-911:hover {
          background: #b91c1c !important;
          border-color: #b91c1c !important;
        }

        /* Resource List */
        .resource-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .resource-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--crisis-sage-light, #f7f9f6);
          border: 1px solid var(--crisis-sage-muted, #e8ede4);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .resource-item:hover {
          background: white;
          border-color: var(--crisis-sage-primary, #8ba675);
        }

        .resource-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .resource-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 6px;
          color: var(--crisis-sage-deep, #6b8559);
        }

        .resource-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .resource-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--crisis-sage-deep, #6b8559);
        }

        .availability-badge {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--crisis-validation-success, #7bb87d);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .resource-actions {
          display: flex;
          gap: 0.5rem;
        }

        .resource-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: white;
          border: 1px solid var(--crisis-sage-muted, #e8ede4);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .resource-action-button.phone {
          color: var(--crisis-emergency-red, #b87d7d);
        }

        .resource-action-button.phone:hover {
          background: var(--crisis-emergency-red, #b87d7d);
          color: white;
          border-color: var(--crisis-emergency-red, #b87d7d);
        }

        .resource-action-button.text {
          color: var(--crisis-support-blue, #7da3b8);
        }

        .resource-action-button.text:hover {
          background: var(--crisis-support-blue, #7da3b8);
          color: white;
          border-color: var(--crisis-support-blue, #7da3b8);
        }

        .resource-action-button.website {
          color: var(--crisis-sage-deep, #6b8559);
        }

        .resource-action-button.website:hover {
          background: var(--crisis-sage-deep, #6b8559);
          color: white;
          border-color: var(--crisis-sage-deep, #6b8559);
        }

        .no-resources {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
          color: var(--crisis-neutral-500, #adb5bd);
          text-align: center;
        }

        /* Footer */
        .quick-access-footer {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--crisis-sage-muted, #e8ede4);
          text-align: center;
        }

        .footer-text {
          font-size: 0.75rem;
          color: var(--crisis-neutral-600, #6c757d);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .crisis-quick-access--bottom,
          .crisis-quick-access--top {
            width: 100vw;
            max-width: none;
            border-radius: 0;
            left: 0;
            transform: none;
          }

          .crisis-quick-access--floating {
            bottom: 10px;
            right: 10px;
            left: 10px;
            width: auto;
          }

          .crisis-quick-access--side {
            width: 280px;
            right: 10px;
          }

          .critical-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }

          .resource-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .resource-actions {
            width: 100%;
            justify-content: space-around;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .crisis-quick-access {
            border-width: 3px;
          }

          .resource-item,
          .critical-actions {
            border-width: 2px;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .crisis-quick-access,
          .crisis-quick-access__handle,
          .handle-icon,
          .resource-item,
          .resource-action-button,
          .control-button {
            transition: none;
          }

          .emergency-indicator {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

// Default emergency resources
export const defaultQuickAccessResources: QuickAccessResource[] = [
  {
    id: 'crisis-lifeline',
    name: '988 Suicide & Crisis Lifeline',
    shortName: '988 Crisis Line',
    contact: { phone: '988' },
    type: 'emergency',
    priority: 1,
    available24_7: true,
    languages: ['en', 'es'],
    description: 'Free and confidential emotional support for people in suicidal crisis or emotional distress.',
    icon: <Phone size={16} />
  },
  {
    id: 'crisis-text',
    name: 'Crisis Text Line',
    shortName: 'Crisis Text',
    contact: { text: '741741' },
    type: 'emergency',
    priority: 2,
    available24_7: true,
    languages: ['en'],
    description: 'Free, 24/7 support for those in crisis. Text HOME to 741741.',
    icon: <MessageCircle size={16} />
  },
  {
    id: 'emergency-services',
    name: 'Emergency Services',
    shortName: '911',
    contact: { phone: '911' },
    type: 'emergency',
    priority: 0,
    available24_7: true,
    languages: ['en', 'es'],
    description: 'Emergency medical, fire, and police services.',
    icon: <AlertCircle size={16} />
  }
];

export default CrisisQuickAccess;