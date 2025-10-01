'use client';

import { useState } from 'react';

interface CrisisAssessment {
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis';
  riskScore: number;
  confidence: number;
  interventionType: 'none' | 'gentle_check' | 'urgent_support' | 'emergency_protocol';
}

interface SupportResource {
  type: 'hotline' | 'therapist' | 'community' | 'app' | 'technique' | 'emergency';
  name: string;
  contact?: string;
  description: string;
  available24h?: boolean;
}

interface InterventionPlan {
  interventionType: string;
  immediateActions: string[];
  followUpActions: string[];
  timelineHours: number;
  supportActivation: boolean;
}

interface CrisisInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  riskAssessment: CrisisAssessment;
  copingStrategies: string[];
  supportResources: SupportResource[];
  interventionPlan: InterventionPlan;
  warningPatterns: string[];
}

export default function CrisisInterventionModal({
  isOpen,
  onClose,
  riskAssessment,
  copingStrategies,
  supportResources,
  interventionPlan,
  warningPatterns
}: CrisisInterventionModalProps) {
  const [showAllResources, setShowAllResources] = useState(false);
  const [copingAttempted, setCopingAttempted] = useState<string[]>([]);

  if (!isOpen) return null;

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'crisis': return '#c33';
      case 'high': return '#d4756b';
      case 'moderate': return '#cb997e';
      default: return '#8ea876';
    }
  };

  const getRiskLevelMessage = (level: string) => {
    switch (level) {
      case 'crisis':
        return {
          title: '🚨 Crisis Support Needed',
          message: 'You are going through an extremely difficult time right now. Please know that you are not alone, and immediate support is available.',
          urgency: 'Please contact emergency support immediately.'
        };
      case 'high':
        return {
          title: '⚠️ High Risk Detected',
          message: 'You\'re experiencing significant distress. It\'s important to reach out for professional support right away.',
          urgency: 'Consider contacting a mental health professional today.'
        };
      case 'moderate':
        return {
          title: '💙 Support Available',
          message: 'You might be going through a challenging time. There are resources and people who can help.',
          urgency: 'Consider reaching out to someone you trust or a support service.'
        };
      default:
        return {
          title: '🤗 We\'re Here for You',
          message: 'Thank you for sharing your thoughts. Here are some resources that might help.',
          urgency: null
        };
    }
  };

  const riskMessage = getRiskLevelMessage(riskAssessment.riskLevel);

  const markCopingAttempted = (strategy: string) => {
    if (!copingAttempted.includes(strategy)) {
      setCopingAttempted([...copingAttempted, strategy]);
    }
  };

  const emergencyResources = supportResources.filter(resource => 
    resource.type === 'emergency' || resource.type === 'hotline'
  );

  const otherResources = supportResources.filter(resource => 
    resource.type !== 'emergency' && resource.type !== 'hotline'
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: getRiskLevelColor(riskAssessment.riskLevel),
          color: 'white',
          padding: '1.5rem',
          borderRadius: '16px 16px 0 0',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {riskMessage.title}
          </h2>
          <p style={{ 
            margin: 0,
            fontSize: '1rem',
            opacity: 0.9
          }}>
            {riskMessage.message}
          </p>
          {riskMessage.urgency && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginTop: '1rem',
              fontWeight: '600'
            }}>
              {riskMessage.urgency}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Emergency Resources (High Priority) */}
          {(riskAssessment.riskLevel === 'crisis' || riskAssessment.riskLevel === 'high') && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                color: '#c33',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.2rem'
              }}>
                <span>🆘</span> Immediate Support
              </h3>
              
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {emergencyResources.map((resource, index) => (
                  <div key={index} style={{
                    border: '2px solid #c33',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fff5f5'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <h4 style={{ 
                        margin: 0,
                        color: '#c33',
                        fontWeight: 'bold'
                      }}>
                        {resource.name}
                      </h4>
                      {resource.available24h && (
                        <span style={{
                          backgroundColor: '#c33',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          24/7
                        </span>
                      )}
                    </div>
                    
                    {resource.contact && (
                      <div style={{
                        backgroundColor: '#c33',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {resource.contact}
                      </div>
                    )}
                    
                    <p style={{ 
                      margin: 0,
                      color: '#2e2e2e',
                      fontSize: '0.9rem'
                    }}>
                      {resource.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Coping Strategies */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#8ea876',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.1rem'
            }}>
              <span>🧘</span> Immediate Coping Strategies
            </h3>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {copingStrategies.slice(0, 4).map((strategy, index) => (
                <div key={index} style={{
                  border: `2px solid ${copingAttempted.includes(strategy) ? '#8ea876' : '#e5e5e5'}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: copingAttempted.includes(strategy) ? '#f0f7ff' : 'white',
                  position: 'relative'
                }}>
                  <p style={{ 
                    margin: '0 0 0.75rem 0',
                    color: '#2e2e2e',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {strategy}
                  </p>
                  
                  <button
                    onClick={() => markCopingAttempted(strategy)}
                    disabled={copingAttempted.includes(strategy)}
                    style={{
                      background: copingAttempted.includes(strategy) ? '#8ea876' : '#cb997e',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: copingAttempted.includes(strategy) ? 'default' : 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {copingAttempted.includes(strategy) ? '✓ Tried this' : 'Try this'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                color: '#cb997e',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.1rem'
              }}>
                <span>🤝</span> Additional Support Resources
              </h3>
              
              {otherResources.length > 3 && (
                <button
                  onClick={() => setShowAllResources(!showAllResources)}
                  style={{
                    background: 'transparent',
                    color: '#cb997e',
                    border: '1px solid #cb997e',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {showAllResources ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>
            
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {(showAllResources ? otherResources : otherResources.slice(0, 3)).map((resource, index) => (
                <div key={index} style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.25rem'
                  }}>
                    <h4 style={{ 
                      margin: 0,
                      color: '#2e2e2e',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {resource.name}
                    </h4>
                    {resource.available24h && (
                      <span style={{
                        backgroundColor: '#8ea876',
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: '0.6rem'
                      }}>
                        24/7
                      </span>
                    )}
                  </div>
                  
                  <p style={{ 
                    margin: '0 0 0.25rem 0',
                    color: '#666',
                    fontSize: '0.8rem'
                  }}>
                    {resource.description}
                  </p>
                  
                  {resource.contact && (
                    <div style={{
                      color: '#8ea876',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {resource.contact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Information */}
          {interventionPlan.supportActivation && (
            <div style={{
              backgroundColor: '#f0f7ff',
              border: '2px solid #8ea876',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{
                color: '#8ea876',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>📅</span> Follow-up Care
              </h4>
              <p style={{ 
                color: '#2e2e2e',
                fontSize: '0.9rem',
                margin: 0
              }}>
                We'll check in with you within {interventionPlan.timelineHours} hours to see how you're doing. 
                You're not alone in this journey.
              </p>
            </div>
          )}

          {/* Safety Reminder */}
          <div style={{
            backgroundColor: '#fff5f5',
            border: '2px solid #d4756b',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💙</div>
            <p style={{ 
              color: '#2e2e2e', 
              fontSize: '0.9rem',
              margin: '0 0 0.5rem 0',
              fontWeight: '600'
            }}>
              If you are in immediate danger, please call 911 or go to your nearest emergency room.
            </p>
            <p style={{ 
              color: '#666', 
              fontSize: '0.8rem',
              margin: 0
            }}>
              Your safety and well-being are the most important things right now.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => window.open('tel:988', '_self')}
              style={{
                background: '#c33',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📞 Call 988 Now
            </button>
            
            <button
              onClick={() => window.open('sms:741741?body=HOME', '_self')}
              style={{
                background: '#8ea876',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              💬 Text Crisis Line
            </button>
            
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#666',
                border: '2px solid #e5e5e5',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}