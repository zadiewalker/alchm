'use client';

/**
 * Crisis-Aware Chatbot Enhancement
 * 
 * This component extends the technical support chatbot with advanced
 * crisis detection and response capabilities, ensuring user safety
 * while maintaining the healing sanctuary aesthetic.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';

interface CrisisDetection {
  level: 'none' | 'mild' | 'moderate' | 'severe' | 'immediate';
  keywords: string[];
  confidence: number;
  timestamp: Date;
}

interface CrisisResponse {
  id: string;
  type: 'resource' | 'escalation' | 'immediate_help';
  content: string;
  actions: CrisisAction[];
}

interface CrisisAction {
  id: string;
  label: string;
  type: 'call' | 'text' | 'chat' | 'escalate';
  url?: string;
  phone?: string;
  urgent: boolean;
}

interface CrisisAwareChatbotProps {
  onCrisisDetected: (detection: CrisisDetection) => void;
  onEscalateToHuman: () => void;
  emergencyContacts?: Array<{
    name: string;
    phone: string;
    type: 'crisis' | 'medical' | 'family';
  }>;
}

export function CrisisAwareChatbot({
  onCrisisDetected,
  onEscalateToHuman,
  emergencyContacts = []
}: CrisisAwareChatbotProps) {
  const [currentDetection, setCurrentDetection] = useState<CrisisDetection | null>(null);
  const [crisisHistory, setCrisisHistory] = useState<CrisisDetection[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [responseGenerated, setResponseGenerated] = useState<CrisisResponse | null>(null);

  // Crisis keyword patterns with contextual awareness
  const crisisPatterns = {
    immediate: [
      /(?:going to|planning to|about to).{0,20}(hurt|harm|kill|end).{0,20}(myself|my life)/i,
      /have.{0,10}(pills|rope|gun|knife).{0,20}(ready|here|with me)/i,
      /(?:can't|cannot).{0,20}(go on|take it|handle|cope).{0,20}(anymore|much longer)/i,
      /(today|tonight|now).{0,20}(is|will be).{0,20}(the day|the end|my last)/i
    ],
    severe: [
      /(want to|going to).{0,20}(die|kill myself|end it|hurt myself)/i,
      /(suicide|suicidal|self.harm|cutting).{0,20}(thoughts|urges|plans)/i,
      /(?:no|don't).{0,20}(point|reason).{0,20}(living|going on|trying)/i,
      /(everyone|world).{0,20}(better|off).{0,20}without me/i
    ],
    moderate: [
      /(depressed|hopeless|worthless|empty).{0,20}(feeling|all the time)/i,
      /(can't|cannot).{0,20}(sleep|eat|function|think straight)/i,
      /(everything|life).{0,20}(is|feels).{0,20}(pointless|meaningless|hopeless)/i,
      /(isolat|alone|lonely).{0,20}(all the time|always|constantly)/i
    ],
    mild: [
      /(struggling|difficult|hard).{0,20}(time|period|situation)/i,
      /(overwhelmed|stressed|anxious).{0,20}(lately|recently|today)/i,
      /(not|don't).{0,20}(feel|seem).{0,20}(like myself|good|okay)/i,
      /(need|could use).{0,20}(help|support|someone to talk)/i
    ]
  };

  // Analyze message for crisis indicators
  const analyzeCrisisLevel = useCallback((message: string): CrisisDetection => {
    const detectedKeywords: string[] = [];
    let highestLevel: CrisisDetection['level'] = 'none';
    let confidence = 0;

    // Check patterns in order of severity
    const levels: Array<keyof typeof crisisPatterns> = ['immediate', 'severe', 'moderate', 'mild'];
    
    for (const level of levels) {
      const patterns = crisisPatterns[level];
      for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
          detectedKeywords.push(match[0]);
          if (highestLevel === 'none' || levels.indexOf(level) < levels.indexOf(highestLevel as any)) {
            highestLevel = level;
            confidence = Math.min(confidence + 0.3, 1.0);
          }
        }
      }
    }

    // Contextual analysis for false positives
    const contextualReducers = [
      /(?:movie|book|game|story|character|fictional)/i,
      /(?:yesterday|last week|before|used to|in the past)/i,
      /(?:friend|family member|someone else|they|them)/i
    ];

    const hasContextualReducer = contextualReducers.some(pattern => pattern.test(message));
    if (hasContextualReducer && confidence > 0) {
      confidence *= 0.6; // Reduce confidence for contextual content
    }

    // Additional confidence factors
    const messageLength = message.length;
    const emotionalWords = (message.match(/(feel|feeling|emotion|pain|hurt|sad|angry|scared)/gi) || []).length;
    const firstPerson = (message.match(/(I|my|me|myself)/gi) || []).length;

    if (emotionalWords > 0) confidence += 0.1;
    if (firstPerson >= 3) confidence += 0.2;
    if (messageLength > 100 && highestLevel !== 'none') confidence += 0.1;

    return {
      level: confidence > 0.4 ? highestLevel : 'none',
      keywords: detectedKeywords,
      confidence: Math.min(confidence, 1.0),
      timestamp: new Date()
    };
  }, []);

  // Generate appropriate crisis response
  const generateCrisisResponse = useCallback((detection: CrisisDetection): CrisisResponse => {
    const responses = {
      immediate: {
        content: "I'm really concerned about what you've shared. Your safety is the most important thing right now. Please reach out for immediate help - you don't have to go through this alone.",
        actions: [
          {
            id: 'call-988',
            label: 'Call 988 Crisis Lifeline',
            type: 'call' as const,
            phone: '988',
            urgent: true
          },
          {
            id: 'text-741741',
            label: 'Text Crisis Line',
            type: 'text' as const,
            phone: '741741',
            urgent: true
          },
          {
            id: 'emergency-911',
            label: 'Call Emergency Services',
            type: 'call' as const,
            phone: '911',
            urgent: true
          }
        ]
      },
      severe: {
        content: "Thank you for trusting me with how you're feeling. These thoughts and feelings are really serious, and I want to connect you with someone who can provide the support you need right now.",
        actions: [
          {
            id: 'call-988',
            label: 'Call 988 Crisis Lifeline',
            type: 'call' as const,
            phone: '988',
            urgent: true
          },
          {
            id: 'chat-crisis',
            label: 'Chat with Crisis Counselor',
            type: 'chat' as const,
            url: 'https://suicidepreventionlifeline.org/chat/',
            urgent: true
          },
          {
            id: 'escalate-human',
            label: 'Connect with Human Support',
            type: 'escalate' as const,
            urgent: false
          }
        ]
      },
      moderate: {
        content: "I hear that you're going through a really difficult time. These feelings are valid, and there are people who can help you work through them. You don't have to face this alone.",
        actions: [
          {
            id: 'call-988',
            label: '24/7 Crisis Support - 988',
            type: 'call' as const,
            phone: '988',
            urgent: false
          },
          {
            id: 'text-support',
            label: 'Text HOME to 741741',
            type: 'text' as const,
            phone: '741741',
            urgent: false
          },
          {
            id: 'find-therapist',
            label: 'Find Local Therapist',
            type: 'chat' as const,
            url: '/resources/therapy',
            urgent: false
          }
        ]
      },
      mild: {
        content: "It sounds like you're dealing with some challenging feelings. It's really positive that you're reaching out. There are resources available to help support you through this time.",
        actions: [
          {
            id: 'warmline',
            label: 'Non-Crisis Support Line',
            type: 'call' as const,
            phone: '1-855-845-7415',
            urgent: false
          },
          {
            id: 'self-care',
            label: 'Self-Care Resources',
            type: 'chat' as const,
            url: '/resources/self-care',
            urgent: false
          },
          {
            id: 'peer-support',
            label: 'Peer Support Groups',
            type: 'chat' as const,
            url: '/resources/peer-support',
            urgent: false
          }
        ]
      }
    };

    return {
      id: `crisis-${Date.now()}`,
      type: detection.level === 'immediate' ? 'immediate_help' : 
           detection.level === 'severe' ? 'escalation' : 'resource',
      ...responses[detection.level as keyof typeof responses]
    };
  }, []);

  // Handle crisis action
  const handleCrisisAction = useCallback((action: CrisisAction) => {
    // Haptic feedback for urgent actions
    if (action.urgent && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }

    switch (action.type) {
      case 'call':
        if (action.phone) {
          window.location.href = `tel:${action.phone}`;
        }
        break;
      case 'text':
        if (action.phone) {
          const message = action.phone === '741741' ? 'HOME' : 'HELP';
          window.location.href = `sms:${action.phone}&body=${message}`;
        }
        break;
      case 'chat':
        if (action.url) {
          window.open(action.url, '_blank');
        }
        break;
      case 'escalate':
        onEscalateToHuman();
        break;
    }
  }, [onEscalateToHuman]);

  // Monitor messages for crisis content
  const monitorMessage = useCallback((message: string) => {
    if (!isMonitoring) return;

    const detection = analyzeCrisisLevel(message);
    
    if (detection.level !== 'none') {
      setCurrentDetection(detection);
      setCrisisHistory(prev => [...prev, detection]);
      setResponseGenerated(generateCrisisResponse(detection));
      onCrisisDetected(detection);
    }
  }, [isMonitoring, analyzeCrisisLevel, generateCrisisResponse, onCrisisDetected]);

  // Crisis Response Component
  const CrisisResponseCard = ({ response }: { response: CrisisResponse }) => (
    <div className={`crisis-response-card ${response.type}`}>
      <div className="crisis-indicator">
        <span className="crisis-icon">
          {response.type === 'immediate_help' ? '🚨' : 
           response.type === 'escalation' ? '🤝' : '💝'}
        </span>
        <span className="crisis-label">
          {response.type === 'immediate_help' ? 'Immediate Support Available' :
           response.type === 'escalation' ? 'Professional Support Recommended' :
           'Resources Available'}
        </span>
      </div>
      
      <p className="crisis-message">{response.content}</p>
      
      <div className="crisis-actions">
        {response.actions.map(action => (
          <Button
            key={action.id}
            onClick={() => handleCrisisAction(action)}
            variant={action.urgent ? 'destructive' : 'primary'}
            size={action.urgent ? 'touch' : 'default'}
            className={`crisis-action-btn ${action.urgent ? 'urgent' : ''}`}
          >
            <span className="action-icon">
              {action.type === 'call' ? '📞' :
               action.type === 'text' ? '💬' :
               action.type === 'chat' ? '🗨️' : '🤝'}
            </span>
            {action.label}
          </Button>
        ))}
      </div>
      
      {/* Emergency Contacts */}
      {emergencyContacts.length > 0 && response.type === 'immediate_help' && (
        <div className="emergency-contacts">
          <h4 className="emergency-title">Your Emergency Contacts:</h4>
          <div className="contact-list">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => window.location.href = `tel:${contact.phone}`}
                className="emergency-contact-btn"
              >
                <span className="contact-name">{contact.name}</span>
                <span className="contact-type">({contact.type})</span>
                <span className="contact-phone">{contact.phone}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Reassurance Message */}
      <div className="crisis-reassurance">
        <p>
          <span className="reassurance-icon">💙</span>
          You are not alone. Help is available, and there are people who care about you.
        </p>
      </div>
    </div>
  );

  // Return both the monitoring function and crisis response UI
  return {
    monitorMessage,
    CrisisResponseCard: responseGenerated ? () => <CrisisResponseCard response={responseGenerated} /> : null,
    currentDetection,
    isMonitoring,
    setIsMonitoring
  };
}

// CSS-in-JS styles for crisis components
const crisisStyles = `
  .crisis-response-card {
    background: linear-gradient(135deg, rgba(254, 252, 251, 0.98) 0%, rgba(254, 252, 251, 0.95) 100%);
    border: 2px solid rgba(164, 183, 146, 0.4);
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 1rem 0;
    box-shadow: 0 8px 32px rgba(164, 183, 146, 0.2);
    backdrop-filter: blur(20px);
  }

  .crisis-response-card.immediate_help {
    border-color: rgba(220, 38, 38, 0.4);
    background: linear-gradient(135deg, rgba(254, 252, 251, 0.98) 0%, rgba(254, 242, 242, 0.95) 100%);
  }

  .crisis-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem 0.75rem;
    background: rgba(164, 183, 146, 0.1);
    border-radius: 0.75rem;
    border: 1px solid rgba(164, 183, 146, 0.2);
  }

  .crisis-response-card.immediate_help .crisis-indicator {
    background: rgba(220, 38, 38, 0.1);
    border-color: rgba(220, 38, 38, 0.2);
  }

  .crisis-icon {
    font-size: 1.25rem;
  }

  .crisis-label {
    font-weight: 600;
    color: var(--sage-active);
    font-size: 0.875rem;
  }

  .crisis-response-card.immediate_help .crisis-label {
    color: rgb(153, 27, 27);
  }

  .crisis-message {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--sanctuary-gray-800);
    margin-bottom: 1.5rem;
    letter-spacing: 0.01em;
  }

  .crisis-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .crisis-action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: flex-start;
    min-height: 3rem;
    font-weight: 500;
  }

  .crisis-action-btn.urgent {
    min-height: 3.5rem;
    font-size: 1.125rem;
    animation: gentle-pulse 2s ease-in-out infinite;
  }

  .action-icon {
    font-size: 1.25rem;
  }

  .emergency-contacts {
    background: rgba(164, 183, 146, 0.05);
    border: 1px solid rgba(164, 183, 146, 0.15);
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .emergency-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--sage-active);
    margin-bottom: 0.75rem;
  }

  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .emergency-contact-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: white;
    border: 1px solid rgba(164, 183, 146, 0.2);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .emergency-contact-btn:hover {
    background: rgba(164, 183, 146, 0.05);
    border-color: rgba(164, 183, 146, 0.3);
  }

  .contact-name {
    font-weight: 500;
    color: var(--sanctuary-gray-800);
  }

  .contact-type {
    font-size: 0.75rem;
    color: var(--sanctuary-gray-600);
    text-transform: capitalize;
  }

  .contact-phone {
    font-family: monospace;
    font-size: 0.875rem;
    color: var(--sage-active);
  }

  .crisis-reassurance {
    border-top: 1px solid rgba(164, 183, 146, 0.15);
    padding-top: 1rem;
    text-align: center;
  }

  .crisis-reassurance p {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--sanctuary-gray-700);
    font-style: italic;
    margin: 0;
  }

  .reassurance-icon {
    font-size: 1rem;
  }

  @keyframes gentle-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
    }
    50% {
      box-shadow: 0 0 0 0.5rem rgba(220, 38, 38, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .crisis-action-btn.urgent {
      animation: none;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = crisisStyles;
  document.head.appendChild(styleElement);
}

export default CrisisAwareChatbot;