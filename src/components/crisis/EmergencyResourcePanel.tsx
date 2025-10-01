/**
 * ALCHM Emergency Resource Panel
 * 
 * LIFE-CRITICAL: Emergency resource delivery system that loads and displays
 * crisis resources in <3 seconds with offline fallback capabilities.
 * 
 * This component:
 * - Preloads critical resources for instant access
 * - Provides one-click emergency contact access
 * - Works offline with cached resources
 * - Adapts to user's cultural and language preferences
 * - Maintains accessibility during crisis states
 * 
 * Every second counts in a crisis situation.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Phone, MessageCircle, Globe, Heart, Shield, Users } from 'lucide-react';
import { globalCrisisResources, type CrisisResource, type UserContext } from '@/lib/global-crisis-resources';
import { crisisDetectionEngine } from '@/lib/crisis-detection-engine';
import { logger } from '@/lib/logging';

// Emergency resource categories
enum ResourceCategory {
  IMMEDIATE_CRISIS = 'immediate_crisis',
  MENTAL_HEALTH = 'mental_health',
  SPECIALIZED_SUPPORT = 'specialized_support',
  LOCAL_RESOURCES = 'local_resources',
  PEER_SUPPORT = 'peer_support',
  EMERGENCY_SERVICES = 'emergency_services'
}

// Resource delivery performance tracking
interface ResourcePerformanceMetrics {
  loadStartTime: number;
  resourcesLoaded: number;
  totalLoadTime: number;
  cacheHit: boolean;
  offlineMode: boolean;
}

// Component props
interface EmergencyResourcePanelProps {
  userId: string;
  userContext: UserContext;
  crisisSeverity: 'low' | 'medium' | 'high' | 'critical';
  isVisible: boolean;
  onResourceAccessed: (resource: CrisisResource) => void;
  onPanelDismiss?: () => void;
  compactMode?: boolean;
  className?: string;
}

// Resource display modes
type DisplayMode = 'full' | 'compact' | 'emergency_only';

/**
 * Emergency Resource Panel Component
 * 
 * Provides immediate access to crisis resources with <3 second load time
 */
export const EmergencyResourcePanel: React.FC<EmergencyResourcePanelProps> = ({
  userId,
  userContext,
  crisisSeverity,
  isVisible,
  onResourceAccessed,
  onPanelDismiss,
  compactMode = false,
  className = ''
}) => {
  // State management
  const [resources, setResources] = useState<CrisisResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('full');
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  const [performanceMetrics, setPerformanceMetrics] = useState<ResourcePerformanceMetrics | null>(null);
  
  // Refs for performance tracking
  const loadStartTimeRef = useRef<number>(0);
  const resourceCacheRef = useRef<Map<string, CrisisResource[]>>(new Map());
  const emergencyContactsRef = useRef<HTMLDivElement>(null);

  // Emergency resource cache key
  const getCacheKey = useCallback(() => {
    return `${userContext.location.country}_${crisisSeverity}_${userContext.preferences.languages[0]}`;
  }, [userContext, crisisSeverity]);

  /**
   * CRITICAL: Load emergency resources with <3 second requirement
   */
  const loadEmergencyResources = useCallback(async () => {
    loadStartTimeRef.current = Date.now();
    setIsLoading(true);
    setLoadError(null);

    try {
      const cacheKey = getCacheKey();
      
      // Check cache first for instant loading
      if (resourceCacheRef.current.has(cacheKey)) {
        const cachedResources = resourceCacheRef.current.get(cacheKey)!;
        setResources(cachedResources);
        setIsLoading(false);
        
        const loadTime = Date.now() - loadStartTimeRef.current;
        setPerformanceMetrics({
          loadStartTime: loadStartTimeRef.current,
          resourcesLoaded: cachedResources.length,
          totalLoadTime: loadTime,
          cacheHit: true,
          offlineMode
        });
        
        logger.info('Emergency resources loaded from cache', {
          loadTime,
          resourceCount: cachedResources.length
        });
        return;
      }

      // Load resources with timeout for <3 second guarantee
      const loadPromise = offlineMode 
        ? globalCrisisResources.getOfflineResources(userContext.location.country)
        : globalCrisisResources.getCrisisResources(userContext, 12);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Resource load timeout')), 2500); // 2.5s timeout
      });

      const loadedResources = await Promise.race([loadPromise, timeoutPromise]) as CrisisResource[];

      // Filter and prioritize by severity
      const prioritizedResources = prioritizeResourcesBySeverity(loadedResources, crisisSeverity);
      
      // Cache for future instant access
      resourceCacheRef.current.set(cacheKey, prioritizedResources);
      
      setResources(prioritizedResources);
      setIsLoading(false);

      const loadTime = Date.now() - loadStartTimeRef.current;
      setPerformanceMetrics({
        loadStartTime: loadStartTimeRef.current,
        resourcesLoaded: prioritizedResources.length,
        totalLoadTime: loadTime,
        cacheHit: false,
        offlineMode
      });

      // Log performance warning if over 3 seconds
      if (loadTime > 3000) {
        logger.warn('Emergency resource load time exceeded 3 seconds', {
          loadTime,
          crisisSeverity,
          offlineMode,
          resourceCount: prioritizedResources.length
        });
      }

    } catch (error) {
      logger.error('Failed to load emergency resources', error);
      setLoadError('Unable to load resources. Using emergency fallback.');
      
      // Use emergency fallback resources
      const fallbackResources = getEmergencyFallbackResources();
      setResources(fallbackResources);
      setIsLoading(false);

      // Cache fallback for future use
      const cacheKey = getCacheKey();
      resourceCacheRef.current.set(cacheKey, fallbackResources);
    }
  }, [userContext, crisisSeverity, offlineMode, getCacheKey]);

  /**
   * Prioritize resources based on crisis severity
   */
  const prioritizeResourcesBySeverity = (
    resources: CrisisResource[],
    severity: string
  ): CrisisResource[] => {
    const prioritized = [...resources];

    // Sort by priority for severity level
    prioritized.sort((a, b) => {
      // Critical severity: prioritize hotlines and 24/7 services
      if (severity === 'critical') {
        if (a.type === 'hotline' && b.type !== 'hotline') return -1;
        if (b.type === 'hotline' && a.type !== 'hotline') return 1;
        if (a.available24h && !b.available24h) return -1;
        if (b.available24h && !a.available24h) return 1;
      }

      // General priority: 24/7 availability, cost-free, confidential
      const aPriority = (a.available24h ? 4 : 0) + (a.costFree ? 2 : 0) + (a.confidential ? 1 : 0);
      const bPriority = (b.available24h ? 4 : 0) + (b.costFree ? 2 : 0) + (b.confidential ? 1 : 0);
      
      return bPriority - aPriority;
    });

    // Return top resources based on severity
    const maxResources = severity === 'critical' ? 6 : (severity === 'high' ? 8 : 10);
    return prioritized.slice(0, maxResources);
  };

  /**
   * Emergency fallback resources when loading fails
   */
  const getEmergencyFallbackResources = (): CrisisResource[] => {
    return [
      {
        type: 'hotline',
        name: '988 Suicide & Crisis Lifeline',
        contact: '988',
        description: 'Free and confidential emotional support 24/7',
        available24h: true,
        languages: ['English', 'Spanish'],
        costFree: true,
        confidential: true,
        offlineAccessible: true
      },
      {
        type: 'text_line',
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        description: 'Free crisis support via text message',
        available24h: true,
        languages: ['English'],
        costFree: true,
        confidential: true,
        offlineAccessible: true
      },
      {
        type: 'hotline',
        name: 'Emergency Services',
        contact: '911',
        description: 'Emergency medical and crisis response',
        available24h: true,
        languages: ['English'],
        costFree: true,
        confidential: false,
        offlineAccessible: true
      }
    ];
  };

  /**
   * Handle resource access with tracking
   */
  const handleResourceAccess = useCallback(async (resource: CrisisResource) => {
    try {
      // Track resource access
      onResourceAccessed(resource);

      // Log access for analytics
      logger.info('Emergency resource accessed', {
        userId,
        resourceType: resource.type,
        resourceName: resource.name,
        crisisSeverity,
        accessTime: Date.now()
      });

      // Handle different resource types
      switch (resource.type) {
        case 'hotline':
          if (typeof window !== 'undefined') {
            window.location.href = `tel:${resource.contact}`;
          }
          break;
          
        case 'text_line':
          if (typeof window !== 'undefined') {
            window.location.href = `sms:${resource.contact.split(' ').pop()}`;
          }
          break;
          
        case 'website':
        case 'chat':
          if (typeof window !== 'undefined') {
            window.open(resource.contact, '_blank', 'noopener,noreferrer');
          }
          break;
          
        default:
          // Copy contact info to clipboard
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(resource.contact);
          }
      }

    } catch (error) {
      logger.error('Failed to access resource', error);
    }
  }, [userId, crisisSeverity, onResourceAccessed]);

  /**
   * Get appropriate icon for resource type
   */
  const getResourceIcon = (type: CrisisResource['type']) => {
    switch (type) {
      case 'hotline': return Phone;
      case 'text_line': return MessageCircle;
      case 'website': 
      case 'chat': return Globe;
      case 'app': return Shield;
      default: return Heart;
    }
  };

  /**
   * Format contact display
   */
  const formatContactDisplay = (resource: CrisisResource): string => {
    switch (resource.type) {
      case 'hotline':
        return `Call ${resource.contact}`;
      case 'text_line':
        return resource.contact;
      case 'website':
      case 'chat':
        return 'Visit Website';
      default:
        return resource.contact;
    }
  };

  /**
   * Set up online/offline detection
   */
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Load resources when component mounts or dependencies change
   */
  useEffect(() => {
    if (isVisible) {
      loadEmergencyResources();
    }
  }, [isVisible, loadEmergencyResources]);

  /**
   * Determine display mode based on severity and space
   */
  useEffect(() => {
    if (crisisSeverity === 'critical') {
      setDisplayMode('emergency_only');
    } else if (compactMode) {
      setDisplayMode('compact');
    } else {
      setDisplayMode('full');
    }
  }, [crisisSeverity, compactMode]);

  /**
   * Focus management for accessibility
   */
  useEffect(() => {
    if (isVisible && emergencyContactsRef.current) {
      // Focus first emergency contact for accessibility
      const firstButton = emergencyContactsRef.current.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    }
  }, [isVisible, resources]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`emergency-resource-panel ${className}`}
      role="dialog"
      aria-label="Emergency Crisis Resources"
      aria-live="polite"
    >
      {/* Panel Header */}
      <div className="panel-header">
        <div className="header-content">
          <Shield className="header-icon" size={24} />
          <h2 className="header-title">
            {crisisSeverity === 'critical' ? 'Immediate Help Available' : 'Crisis Support Resources'}
          </h2>
          {offlineMode && (
            <span className="offline-indicator" aria-label="Offline mode active">
              📵 Offline Mode
            </span>
          )}
        </div>
        
        {onPanelDismiss && crisisSeverity !== 'critical' && (
          <button
            onClick={onPanelDismiss}
            className="dismiss-button"
            aria-label="Close resource panel"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state" role="status" aria-label="Loading emergency resources">
          <div className="loading-spinner" />
          <span>Loading emergency resources...</span>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="error-state" role="alert">
          <p>{loadError}</p>
        </div>
      )}

      {/* Emergency Resources */}
      {!isLoading && resources.length > 0 && (
        <div className="resources-container" ref={emergencyContactsRef}>
          {displayMode === 'emergency_only' && (
            <div className="critical-notice" role="alert">
              <Heart className="critical-icon" size={20} />
              <p>You're not alone. Help is available right now.</p>
            </div>
          )}

          <div className={`resources-grid ${displayMode}`}>
            {resources.map((resource, index) => {
              const IconComponent = getResourceIcon(resource.type);
              
              return (
                <button
                  key={`${resource.name}-${index}`}
                  className={`resource-card ${resource.type} ${crisisSeverity}`}
                  onClick={() => handleResourceAccess(resource)}
                  aria-label={`Contact ${resource.name}: ${resource.description}`}
                >
                  <div className="resource-icon">
                    <IconComponent size={displayMode === 'compact' ? 18 : 24} />
                  </div>
                  
                  <div className="resource-content">
                    <h3 className="resource-name">{resource.name}</h3>
                    <p className="resource-contact">
                      {formatContactDisplay(resource)}
                    </p>
                    
                    {displayMode === 'full' && (
                      <p className="resource-description">{resource.description}</p>
                    )}
                    
                    <div className="resource-badges">
                      {resource.available24h && (
                        <span className="badge available-24h">24/7</span>
                      )}
                      {resource.costFree && (
                        <span className="badge cost-free">Free</span>
                      )}
                      {resource.confidential && (
                        <span className="badge confidential">Confidential</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Performance Debug Info (dev only) */}
          {process.env.NODE_ENV === 'development' && performanceMetrics && (
            <div className="performance-debug">
              <small>
                Load time: {performanceMetrics.totalLoadTime}ms | 
                Cache: {performanceMetrics.cacheHit ? 'HIT' : 'MISS'} |
                Resources: {performanceMetrics.resourcesLoaded}
              </small>
            </div>
          )}

          {/* Additional Support Message */}
          {displayMode !== 'emergency_only' && (
            <div className="support-message">
              <Users size={16} />
              <p>
                Remember: Reaching out for help is a sign of strength, not weakness. 
                You deserve support and care.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No Resources Fallback */}
      {!isLoading && resources.length === 0 && (
        <div className="no-resources-fallback" role="alert">
          <Heart size={24} />
          <p>If you're in immediate danger, please call your local emergency services.</p>
          <button
            onClick={() => window.location.href = 'tel:911'}
            className="emergency-call-button"
          >
            📞 Call Emergency Services
          </button>
        </div>
      )}

      <style jsx>{`
        .emergency-resource-panel {
          background: linear-gradient(135deg, #fef3e3 0%, #fff5e6 100%);
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
          max-width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-icon {
          color: #f59e0b;
        }

        .header-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #92400e;
        }

        .offline-indicator {
          background: #fecaca;
          color: #991b1b;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .dismiss-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
        }

        .dismiss-button:hover {
          background: rgba(107, 114, 128, 0.1);
        }

        .loading-state {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem;
          text-align: center;
          justify-content: center;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f59e0b;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state {
          background: #fecaca;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }

        .critical-notice {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .critical-icon {
          color: #dc2626;
        }

        .resources-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .resources-grid.full {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .resources-grid.compact {
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .resources-grid.emergency_only {
          grid-template-columns: 1fr;
        }

        .resource-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.25rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          width: 100%;
        }

        .resource-card:hover {
          border-color: #f59e0b;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
          transform: translateY(-1px);
        }

        .resource-card:focus {
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
        }

        .resource-card.critical {
          border-color: #dc2626;
        }

        .resource-card.critical:hover {
          border-color: #b91c1c;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
        }

        .resource-icon {
          background: #fef3e3;
          padding: 0.75rem;
          border-radius: 8px;
          color: #f59e0b;
          flex-shrink: 0;
        }

        .resource-card.critical .resource-icon {
          background: #fee2e2;
          color: #dc2626;
        }

        .resource-content {
          flex: 1;
          min-width: 0;
        }

        .resource-name {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          line-height: 1.2;
        }

        .resource-contact {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
        }

        .resource-description {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .resource-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge.available-24h {
          background: #dcfce7;
          color: #166534;
        }

        .badge.cost-free {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge.confidential {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .support-message {
          background: #f0f9ff;
          color: #0c4a6e;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .no-resources-fallback {
          text-align: center;
          padding: 2rem;
          color: #374151;
        }

        .emergency-call-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          font-size: 1rem;
        }

        .emergency-call-button:hover {
          background: #b91c1c;
        }

        .performance-debug {
          margin-top: 1rem;
          padding: 0.5rem;
          background: #f9fafb;
          border-radius: 4px;
          font-family: monospace;
          color: #6b7280;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .emergency-resource-panel {
            padding: 1rem;
          }

          .resources-grid.full,
          .resources-grid.compact {
            grid-template-columns: 1fr;
          }

          .resource-card {
            padding: 1rem;
          }

          .header-title {
            font-size: 1.125rem;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .emergency-resource-panel {
            border-width: 3px;
          }

          .resource-card {
            border-width: 2px;
          }

          .resource-card:focus {
            outline-width: 4px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .resource-card {
            transition: none;
          }

          .resource-card:hover {
            transform: none;
          }

          .loading-spinner {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EmergencyResourcePanel;