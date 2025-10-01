/**
 * ALCHM Crisis Resource Page Component
 * 
 * MISSION CRITICAL: Crisis resource pages with calming sage green tints.
 * Designed to provide immediate support while maintaining emotional regulation.
 * 
 * Design Features:
 * - Calming sage green color palette that soothes rather than agitates
 * - Breathing space layouts with off-white backgrounds
 * - Clear information hierarchy during crisis states
 * - Accessible emergency contact patterns
 * - Offline-friendly resource caching
 * - Cultural competency considerations
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Globe, 
  Heart, 
  Shield, 
  Clock, 
  MapPin,
  Users,
  Headphones,
  ExternalLink,
  ChevronRight,
  Info,
  AlertTriangle
} from 'lucide-react';
import { CrisisEmergencyButton } from './CrisisEmergencyButton';

export interface CrisisResource {
  id: string;
  name: string;
  description: string;
  type: 'hotline' | 'text' | 'chat' | 'website' | 'local' | 'specialized';
  contact: {
    phone?: string;
    text?: string;
    website?: string;
    hours?: string;
  };
  availability: '24/7' | 'business-hours' | 'limited';
  languages: string[];
  specialties: string[];
  location?: string;
  trusted: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface CrisisResourcePageProps {
  resources: CrisisResource[];
  userLocation?: string;
  userLanguage?: string;
  emergencyMode?: boolean;
  className?: string;
  onResourceAccessed?: (resource: CrisisResource) => void;
}

/**
 * Crisis Resource Page Component
 * 
 * Displays crisis resources with calming sage green design
 */
export const CrisisResourcePage: React.FC<CrisisResourcePageProps> = ({
  resources,
  userLocation,
  userLanguage = 'en',
  emergencyMode = false,
  className = '',
  onResourceAccessed
}) => {
  const [filteredResources, setFilteredResources] = useState<CrisisResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const emergencyRef = useRef<HTMLDivElement>(null);

  // Filter and sort resources by priority and availability
  useEffect(() => {
    let filtered = [...resources];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedCategory);
    }

    // Sort by priority and availability
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const availabilityOrder = { '24/7': 0, 'business-hours': 1, 'limited': 2 };
      
      // Priority first
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then availability
      if (availabilityOrder[a.availability] !== availabilityOrder[b.availability]) {
        return availabilityOrder[a.availability] - availabilityOrder[b.availability];
      }
      
      // Finally, trusted resources first
      if (a.trusted !== b.trusted) {
        return a.trusted ? -1 : 1;
      }
      
      return 0;
    });

    setFilteredResources(filtered);
  }, [resources, selectedCategory]);

  // Focus emergency section in emergency mode
  useEffect(() => {
    if (emergencyMode && emergencyRef.current) {
      emergencyRef.current.focus();
      emergencyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [emergencyMode]);

  // Handle resource access
  const handleResourceAccess = (resource: CrisisResource, contactType: 'phone' | 'text' | 'website') => {
    if (onResourceAccessed) {
      onResourceAccessed(resource);
    }

    setIsLoading(true);
    
    // Simulate brief loading for user feedback
    setTimeout(() => {
      setIsLoading(false);
      
      // Handle different contact types
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
    }, 300);
  };

  // Get category icon
  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'hotline': return <Phone size={20} />;
      case 'text': return <MessageCircle size={20} />;
      case 'chat': return <Headphones size={20} />;
      case 'website': return <Globe size={20} />;
      case 'local': return <MapPin size={20} />;
      case 'specialized': return <Users size={20} />;
      default: return <Heart size={20} />;
    }
  };

  // Get availability badge color
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case '24/7': return 'var(--crisis-validation-success)';
      case 'business-hours': return 'var(--crisis-support-yellow)';
      case 'limited': return 'var(--crisis-neutral-500)';
      default: return 'var(--crisis-neutral-400)';
    }
  };

  const categories = [
    { id: 'all', label: 'All Resources', icon: <Heart size={16} /> },
    { id: 'hotline', label: 'Crisis Hotlines', icon: <Phone size={16} /> },
    { id: 'text', label: 'Text Support', icon: <MessageCircle size={16} /> },
    { id: 'chat', label: 'Online Chat', icon: <Headphones size={16} /> },
    { id: 'specialized', label: 'Specialized Support', icon: <Users size={16} /> },
    { id: 'local', label: 'Local Resources', icon: <MapPin size={16} /> }
  ];

  return (
    <div className={`crisis-resource-page ${emergencyMode ? 'emergency-mode' : ''} ${className}`}>
      {/* Emergency Header */}
      {emergencyMode && (
        <div ref={emergencyRef} className="crisis-emergency-header" tabIndex={-1}>
          <div className="emergency-alert">
            <AlertTriangle size={24} />
            <div>
              <h1 className="crisis-heading-primary">Immediate Crisis Support</h1>
              <p className="crisis-body-text">
                You're not alone. Help is available right now.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="crisis-resource-header">
        <div className="header-content">
          <Shield size={32} />
          <div>
            <h1 className="crisis-heading-primary">
              {emergencyMode ? 'Emergency Support Resources' : 'Crisis Support Resources'}
            </h1>
            <p className="crisis-body-text">
              24/7 professional support available. All resources are free and confidential.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Emergency Resources */}
      <div className="crisis-critical-section">
        <h2 className="crisis-heading-secondary">Immediate Help - Available Now</h2>
        <div className="critical-resources-grid">
          <CrisisEmergencyButton
            variant="call"
            size="large"
            href="tel:988"
            className="critical-resource-button"
            aria-label="Call 988 Suicide & Crisis Lifeline"
            pulseAnimation={emergencyMode}
          >
            988 Crisis Lifeline
          </CrisisEmergencyButton>
          
          <CrisisEmergencyButton
            variant="text"
            size="large"
            href="sms:741741"
            className="critical-resource-button"
            aria-label="Text HOME to 741741 Crisis Text Line"
          >
            Text HOME to 741741
          </CrisisEmergencyButton>
          
          <CrisisEmergencyButton
            variant="chat"
            size="large"
            href="https://suicidepreventionlifeline.org/chat/"
            className="critical-resource-button"
            aria-label="Online crisis chat"
          >
            Online Crisis Chat
          </CrisisEmergencyButton>
        </div>
        
        <div className="critical-info">
          <Info size={16} />
          <span>All services are free, confidential, and available 24/7</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        <h3 className="crisis-heading-tertiary">Find the Right Support</h3>
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
              aria-pressed={selectedCategory === category.id}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource List */}
      <div className="resource-list">
        {filteredResources.length === 0 ? (
          <div className="no-resources">
            <Heart size={48} />
            <h3 className="crisis-heading-tertiary">No resources found</h3>
            <p className="crisis-body-text">
              Try selecting a different category or contact our general crisis support.
            </p>
          </div>
        ) : (
          <div className="resource-grid">
            {filteredResources.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon">
                    {getCategoryIcon(resource.type)}
                  </div>
                  <div className="resource-meta">
                    <h4 className="resource-title">{resource.name}</h4>
                    <div className="resource-badges">
                      <span 
                        className="availability-badge"
                        style={{ backgroundColor: getAvailabilityColor(resource.availability) }}
                      >
                        <Clock size={12} />
                        {resource.availability}
                      </span>
                      {resource.trusted && (
                        <span className="trusted-badge">
                          <Shield size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="resource-description">{resource.description}</p>

                {resource.specialties.length > 0 && (
                  <div className="resource-specialties">
                    <strong>Specializes in:</strong> {resource.specialties.join(', ')}
                  </div>
                )}

                {resource.languages.length > 1 && (
                  <div className="resource-languages">
                    <strong>Languages:</strong> {resource.languages.join(', ')}
                  </div>
                )}

                <div className="resource-actions">
                  {resource.contact.phone && (
                    <CrisisEmergencyButton
                      variant="call"
                      size="compact"
                      onClick={() => handleResourceAccess(resource, 'phone')}
                      disabled={isLoading}
                      aria-label={`Call ${resource.name}`}
                    >
                      Call
                    </CrisisEmergencyButton>
                  )}
                  
                  {resource.contact.text && (
                    <CrisisEmergencyButton
                      variant="text"
                      size="compact"
                      onClick={() => handleResourceAccess(resource, 'text')}
                      disabled={isLoading}
                      aria-label={`Text ${resource.name}`}
                    >
                      Text
                    </CrisisEmergencyButton>
                  )}
                  
                  {resource.contact.website && (
                    <CrisisEmergencyButton
                      variant="resource"
                      size="compact"
                      onClick={() => handleResourceAccess(resource, 'website')}
                      disabled={isLoading}
                      aria-label={`Visit ${resource.name} website`}
                      icon={<ExternalLink size={16} />}
                    >
                      Visit
                    </CrisisEmergencyButton>
                  )}
                </div>

                {resource.contact.hours && (
                  <div className="resource-hours">
                    <Clock size={14} />
                    <span>{resource.contact.hours}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Footer */}
      <div className="crisis-safety-footer">
        <div className="safety-reminder">
          <Heart size={20} />
          <div>
            <h3 className="crisis-heading-tertiary">You Matter</h3>
            <p className="crisis-body-text">
              If you're having thoughts of suicide or self-harm, please reach out immediately. 
              You deserve support and there are people who want to help.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .crisis-resource-page {
          background: var(--crisis-sanctuary-warm, #fefcfb);
          min-height: 100vh;
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .crisis-resource-page.emergency-mode {
          background: linear-gradient(
            135deg,
            var(--crisis-emergency-red-bg, #f5f0f0) 0%,
            var(--crisis-sanctuary-warm, #fefcfb) 100%
          );
        }

        .crisis-emergency-header {
          margin-bottom: 2rem;
          outline: none;
        }

        .emergency-alert {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--crisis-emergency-red-bg, #f5f0f0);
          border: 2px solid var(--crisis-emergency-red, #b87d7d);
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .emergency-alert svg {
          color: var(--crisis-emergency-red, #b87d7d);
          flex-shrink: 0;
        }

        .crisis-resource-header {
          max-width: 800px;
          margin: 0 auto 3rem;
          padding: 3rem 2rem;
          background: var(--crisis-sanctuary, #fefefe);
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .crisis-resource-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--crisis-sage-tint, rgba(139, 166, 117, 0.1));
          pointer-events: none;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          z-index: 2;
        }

        .header-content svg {
          color: var(--crisis-sage-deep, #6b8559);
          flex-shrink: 0;
        }

        .crisis-critical-section {
          max-width: 800px;
          margin: 0 auto 4rem;
          padding: 2rem;
          background: linear-gradient(
            135deg,
            var(--crisis-sage-light, #f7f9f6) 0%,
            var(--crisis-sanctuary-warm, #fefcfb) 100%
          );
          border: 1px solid var(--crisis-sage-muted, #e8ede4);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .crisis-critical-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--crisis-sage-tint, rgba(139, 166, 117, 0.1));
          pointer-events: none;
        }

        .crisis-critical-section > * {
          position: relative;
          z-index: 2;
        }

        .critical-resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .critical-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          color: var(--crisis-sage-deep, #6b8559);
          font-size: 0.875rem;
        }

        .category-filters {
          max-width: 800px;
          margin: 0 auto 3rem;
          padding: 2rem;
          background: var(--crisis-sanctuary, #fefefe);
          border-radius: 16px;
          border: 1px solid var(--crisis-sage-muted, #e8ede4);
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--crisis-sanctuary, #fefefe);
          border: 2px solid var(--crisis-sage-muted, #e8ede4);
          border-radius: 12px;
          color: var(--crisis-sage-deep, #6b8559);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-button:hover {
          background: var(--crisis-sage-light, #f7f9f6);
          border-color: var(--crisis-sage-primary, #8ba675);
        }

        .filter-button.active {
          background: var(--crisis-sage-primary, #8ba675);
          border-color: var(--crisis-sage-primary, #8ba675);
          color: white;
        }

        .resource-list {
          max-width: 1000px;
          margin: 0 auto;
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .resource-card {
          background: var(--crisis-sanctuary, #fefefe);
          border: 2px solid var(--crisis-sage-muted, #e8ede4);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .resource-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--crisis-sage-tint, rgba(139, 166, 117, 0.05));
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .resource-card:hover::before {
          opacity: 1;
        }

        .resource-card:hover {
          border-color: var(--crisis-sage-primary, #8ba675);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(139, 166, 117, 0.15);
        }

        .resource-card > * {
          position: relative;
          z-index: 2;
        }

        .resource-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .resource-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--crisis-sage-light, #f7f9f6);
          border-radius: 12px;
          color: var(--crisis-sage-deep, #6b8559);
          flex-shrink: 0;
        }

        .resource-meta {
          flex: 1;
        }

        .resource-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--crisis-sage-deep, #6b8559);
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .resource-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .availability-badge,
        .trusted-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
        }

        .trusted-badge {
          background: var(--crisis-sage-primary, #8ba675);
        }

        .resource-description {
          color: var(--crisis-neutral-700, #495057);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .resource-specialties,
        .resource-languages {
          font-size: 0.875rem;
          color: var(--crisis-neutral-600, #6c757d);
          margin-bottom: 0.75rem;
        }

        .resource-actions {
          display: flex;
          gap: 0.75rem;
          margin: 1.5rem 0 1rem;
          flex-wrap: wrap;
        }

        .resource-hours {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--crisis-neutral-600, #6c757d);
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--crisis-sage-muted, #e8ede4);
        }

        .no-resources {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--crisis-neutral-600, #6c757d);
        }

        .no-resources svg {
          color: var(--crisis-sage-primary, #8ba675);
          margin-bottom: 1rem;
        }

        .crisis-safety-footer {
          max-width: 800px;
          margin: 4rem auto 0;
          padding: 2rem;
          background: var(--crisis-sage-light, #f7f9f6);
          border-radius: 16px;
          border: 1px solid var(--crisis-sage-muted, #e8ede4);
        }

        .safety-reminder {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .safety-reminder svg {
          color: var(--crisis-sage-deep, #6b8559);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .crisis-resource-page {
            padding: 1rem;
          }

          .crisis-resource-header {
            padding: 2rem 1.5rem;
            margin-bottom: 2rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .critical-resources-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .category-filters {
            padding: 1.5rem;
          }

          .filter-buttons {
            justify-content: center;
          }

          .resource-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .resource-card {
            padding: 1.25rem;
          }

          .resource-actions {
            justify-content: center;
          }

          .safety-reminder {
            flex-direction: column;
            text-align: center;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .resource-card {
            border-width: 3px;
          }

          .filter-button {
            border-width: 3px;
          }

          .crisis-critical-section {
            border-width: 3px;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .resource-card,
          .filter-button {
            transition: none;
          }

          .resource-card:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CrisisResourcePage;