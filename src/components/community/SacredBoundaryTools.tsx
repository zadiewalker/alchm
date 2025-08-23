'use client';

import React, { useState, useEffect } from 'react';
import { useSacredMicrocopy, useSacredButton } from '@/components/SacredMicrocopyProvider';

// ===== SACRED BOUNDARY TYPES =====

export interface BoundaryPreferences {
  id: string;
  userId: string;
  communicationBoundaries: {
    responseTime: 'immediate' | 'same_day' | 'contemplative' | 'seasonal';
    availabilityHours: {
      start: string; // 24hr format like "09:00"
      end: string;   // 24hr format like "18:00"
      timezone: string;
    };
    preferredDays: string[]; // Days of week they're available
    communicationMethods: {
      text: boolean;
      voice: boolean;
      video: boolean;
      inPerson: boolean;
    };
    energyProtection: {
      maxConnectionsPerDay: number;
      restDaysBetweenDeep: number; // Days between intensive interactions
      energyCheckInRequired: boolean; // Ask permission before deep conversations
    };
  };
  contentBoundaries: {
    comfortableTopics: string[];
    sensitiveTopics: string[]; // Topics they can discuss but need gentleness
    offLimitsTopics: string[]; // Topics they prefer to avoid completely
    triggerWarningsNeeded: string[]; // Content that needs warnings
    culturalConsiderations: string[]; // Cultural contexts requiring sensitivity
  };
  emotionalBoundaries: {
    supportCapacity: 'witness_only' | 'gentle_guidance' | 'active_support' | 'crisis_ready';
    sharingComfort: 'surface_level' | 'moderate_depth' | 'deep_sharing' | 'soul_level';
    feedbackPreference: 'affirmation_only' | 'gentle_perspective' | 'honest_reflection' | 'challenge_welcomed';
    conflictStyle: 'avoid_conflict' | 'gentle_dialogue' | 'direct_communication' | 'mediated_resolution';
  };
  spiritualBoundaries: {
    practiceSharing: 'private' | 'selective_sharing' | 'open_exploration' | 'teaching_offering';
    religiousComfort: string[]; // Religious/spiritual contexts they're comfortable with
    sacredTopics: string[]; // Topics they consider sacred and need special care
    ritualParticipation: 'observer_only' | 'familiar_traditions' | 'open_exploration' | 'co_creation';
  };
  safetyProtocols: {
    escalationContacts: {
      emergencyContact: string;
      trustedFriend: string;
      therapeuticSupport?: string;
    };
    safeWords: {
      pause: string; // Word to pause conversation
      boundary: string; // Word to indicate boundary crossed
      support: string; // Word to request additional support
    };
    reportingComfort: 'anonymous_only' | 'facilitated_reporting' | 'direct_communication';
  };
  lastUpdated: Date;
}

export interface BoundaryViolation {
  id: string;
  reporterId: string;
  violationType: 'communication' | 'content' | 'emotional' | 'spiritual' | 'safety';
  description: string;
  involvedParties: string[];
  timestamp: Date;
  severity: 'minor' | 'moderate' | 'serious' | 'urgent';
  status: 'reported' | 'acknowledged' | 'addressing' | 'resolved';
  supportRequested: boolean;
  followUpNeeded: boolean;
}

export interface BoundaryReminder {
  id: string;
  userId: string;
  reminderType: 'energy_check' | 'topic_sensitivity' | 'time_boundary' | 'capacity_limit';
  message: string;
  triggeredBy: string; // What caused this reminder
  acknowledgedAt?: Date;
  isActive: boolean;
}

export interface ConsentRequest {
  id: string;
  requesterId: string;
  targetUserId: string;
  requestType: 'deep_conversation' | 'feedback_sharing' | 'cultural_topic' | 'spiritual_sharing' | 'crisis_support';
  context: string;
  requestMessage: string;
  status: 'pending' | 'granted' | 'declined' | 'expired';
  expiresAt: Date;
  grantedAt?: Date;
  conditions?: string[]; // Any conditions the person set for consent
}

// ===== SACRED BOUNDARY TOOLS COMPONENT =====

export interface SacredBoundaryToolsProps {
  userId: string;
  currentContext?: 'community' | 'witnessing' | 'kindred' | 'circles';
  className?: string;
}

export function SacredBoundaryTools({
  userId,
  currentContext = 'community',
  className = ''
}: SacredBoundaryToolsProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'preferences' | 'consent' | 'violations' | 'reminders'>('dashboard');
  const [boundaryPrefs, setBoundaryPrefs] = useState<BoundaryPreferences | null>(null);
  const [activeReminders, setActiveReminders] = useState<BoundaryReminder[]>([]);
  const [pendingConsents, setPendingConsents] = useState<ConsentRequest[]>([]);
  const [recentViolations, setRecentViolations] = useState<BoundaryViolation[]>([]);

  const { copy } = useSacredMicrocopy();

  // Initialize boundary system
  useEffect(() => {
    initializeBoundarySystem();
  }, [userId]);

  const initializeBoundarySystem = async () => {
    // Load or create user's boundary preferences
    const defaultPrefs: BoundaryPreferences = {
      id: `prefs-${userId}`,
      userId: userId,
      communicationBoundaries: {
        responseTime: 'contemplative',
        availabilityHours: {
          start: '09:00',
          end: '18:00',
          timezone: 'local'
        },
        preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        communicationMethods: {
          text: true,
          voice: false,
          video: false,
          inPerson: false
        },
        energyProtection: {
          maxConnectionsPerDay: 3,
          restDaysBetweenDeep: 1,
          energyCheckInRequired: true
        }
      },
      contentBoundaries: {
        comfortableTopics: ['healing', 'creativity', 'nature', 'mindfulness'],
        sensitiveTopics: ['family_relationships', 'financial_stress'],
        offLimitsTopics: [],
        triggerWarningsNeeded: ['trauma_detailed', 'self_harm', 'substance_abuse'],
        culturalConsiderations: ['religious_differences', 'cultural_appropriation']
      },
      emotionalBoundaries: {
        supportCapacity: 'gentle_guidance',
        sharingComfort: 'moderate_depth',
        feedbackPreference: 'gentle_perspective',
        conflictStyle: 'gentle_dialogue'
      },
      spiritualBoundaries: {
        practiceSharing: 'selective_sharing',
        religiousComfort: ['universal_spirituality', 'nature_based'],
        sacredTopics: ['personal_practice', 'ancestral_wisdom'],
        ritualParticipation: 'familiar_traditions'
      },
      safetyProtocols: {
        escalationContacts: {
          emergencyContact: '',
          trustedFriend: ''
        },
        safeWords: {
          pause: 'breathe',
          boundary: 'sacred_space',
          support: 'gentle_hold'
        },
        reportingComfort: 'facilitated_reporting'
      },
      lastUpdated: new Date()
    };

    setBoundaryPrefs(defaultPrefs);

    // Load sample active reminders
    setActiveReminders([
      {
        id: 'reminder-1',
        userId: userId,
        reminderType: 'energy_check',
        message: 'You\'ve had 2 deep conversations today. Would you like to take a gentle pause before your next connection?',
        triggeredBy: 'max_connections_approaching',
        isActive: true
      }
    ]);

    // Load sample consent requests
    setPendingConsents([
      {
        id: 'consent-1',
        requesterId: 'user-2',
        targetUserId: userId,
        requestType: 'deep_conversation',
        context: 'witnessing_space',
        requestMessage: 'I noticed we both are working with anxiety healing. Would you be open to a deeper conversation about our experiences?',
        status: 'pending',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    ]);
  };

  return (
    <div className={`sacred-boundary-tools ${className}`}>
      {/* Sacred Navigation */}
      <nav className="sacred-navigation surface-elevated-gentle p-gentle mb-ritual rounded-gentle">
        <div className="flex space-x-breath">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`sacred-nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🛡️</span>
            Boundary Dashboard
          </button>
          <button
            onClick={() => setCurrentView('preferences')}
            className={`sacred-nav-button ${currentView === 'preferences' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">⚙️</span>
            Preferences
          </button>
          <button
            onClick={() => setCurrentView('consent')}
            className={`sacred-nav-button ${currentView === 'consent' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🤝</span>
            Consent Requests
            {pendingConsents.length > 0 && (
              <span className="ml-whisper bg-primary text-white text-whisper px-whisper rounded-full">
                {pendingConsents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentView('reminders')}
            className={`sacred-nav-button ${currentView === 'reminders' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🔔</span>
            Active Reminders
            {activeReminders.length > 0 && (
              <span className="ml-whisper bg-warm-terra text-white text-whisper px-whisper rounded-full">
                {activeReminders.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="sacred-content-area">
        {currentView === 'dashboard' && (
          <BoundaryDashboard
            preferences={boundaryPrefs}
            activeReminders={activeReminders}
            pendingConsents={pendingConsents}
            recentViolations={recentViolations}
            currentContext={currentContext}
          />
        )}
        
        {currentView === 'preferences' && (
          <BoundaryPreferences
            preferences={boundaryPrefs}
            onUpdatePreferences={setBoundaryPrefs}
          />
        )}
        
        {currentView === 'consent' && (
          <ConsentManager
            pendingConsents={pendingConsents}
            onGrantConsent={(consent, conditions) => {
              setPendingConsents(prev => prev.map(c => 
                c.id === consent.id 
                  ? { ...c, status: 'granted', grantedAt: new Date(), conditions }
                  : c
              ));
            }}
            onDeclineConsent={(consent) => {
              setPendingConsents(prev => prev.map(c => 
                c.id === consent.id 
                  ? { ...c, status: 'declined' }
                  : c
              ));
            }}
          />
        )}
        
        {currentView === 'reminders' && (
          <BoundaryReminders
            reminders={activeReminders}
            onAcknowledgeReminder={(reminderId) => {
              setActiveReminders(prev => prev.map(r => 
                r.id === reminderId 
                  ? { ...r, acknowledgedAt: new Date(), isActive: false }
                  : r
              ));
            }}
          />
        )}
      </div>
    </div>
  );
}

// ===== BOUNDARY DASHBOARD COMPONENT =====

interface BoundaryDashboardProps {
  preferences: BoundaryPreferences | null;
  activeReminders: BoundaryReminder[];
  pendingConsents: ConsentRequest[];
  recentViolations: BoundaryViolation[];
  currentContext: string;
}

function BoundaryDashboard({ 
  preferences, 
  activeReminders, 
  pendingConsents, 
  recentViolations,
  currentContext 
}: BoundaryDashboardProps) {
  if (!preferences) return null;

  const getTodaysEnergyStatus = () => {
    const connectionsToday = 2; // Would be calculated from actual data
    const maxConnections = preferences.communicationBoundaries.energyProtection.maxConnectionsPerDay;
    const percentage = (connectionsToday / maxConnections) * 100;
    
    if (percentage < 50) return { status: 'fresh', color: 'text-primary', message: 'Energy feels fresh and available' };
    if (percentage < 80) return { status: 'moderate', color: 'text-warm-terra', message: 'Energy moderately used, mindful engagement recommended' };
    return { status: 'high', color: 'text-sacred-rust', message: 'Energy well-used today, consider gentle boundaries' };
  };

  const energyStatus = getTodaysEnergyStatus();

  return (
    <div className="boundary-dashboard">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Boundary Dashboard
        </h2>
        <p className="text-presence text-secondary">
          Your protective sanctuary for mindful community engagement.
        </p>
      </div>

      {/* Energy Status */}
      <div className="energy-status-card surface-card-gentle p-gentle rounded-gentle border border-healing-mist mb-gentle">
        <div className="flex items-center gap-breath mb-breath">
          <span className="text-xl">⚡</span>
          <h3 className="text-grounding font-presence text-primary">Today's Energy Status</h3>
        </div>
        <div className="flex items-center gap-gentle">
          <div className="flex-1">
            <div className="bg-healing-mist rounded-full h-2 mb-whisper">
              <div 
                className="bg-primary rounded-full h-2 transition-all timing-breath"
                style={{ width: `${Math.min((2/preferences.communicationBoundaries.energyProtection.maxConnectionsPerDay) * 100, 100)}%` }}
              ></div>
            </div>
            <p className={`text-breath ${energyStatus.color}`}>
              {energyStatus.message}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gentle mb-ritual">
        <div className="quick-action-card surface-elevated-gentle p-gentle rounded-gentle border border-healing-mist text-center">
          <span className="text-2xl mb-breath block">🛡️</span>
          <h4 className="text-grounding font-presence text-primary mb-whisper">Pause Requests</h4>
          <p className="text-breath text-secondary mb-gentle">Temporarily pause incoming connection requests</p>
          <button className="sacred-button intention-gentle w-full">
            Enable pause mode
          </button>
        </div>

        <div className="quick-action-card surface-elevated-gentle p-gentle rounded-gentle border border-healing-mist text-center">
          <span className="text-2xl mb-breath block">💨</span>
          <h4 className="text-grounding font-presence text-primary mb-whisper">Take Space</h4>
          <p className="text-breath text-secondary mb-gentle">Set away message for 24 hours</p>
          <button className="sacred-button intention-gentle w-full">
            Set away message
          </button>
        </div>

        <div className="quick-action-card surface-elevated-gentle p-gentle rounded-gentle border border-healing-mist text-center">
          <span className="text-2xl mb-breath block">🚨</span>
          <h4 className="text-grounding font-presence text-primary mb-whisper">Report Issue</h4>
          <p className="text-breath text-secondary mb-gentle">Report boundary violation or request support</p>
          <button className="sacred-button intention-gentle w-full">
            Report concern
          </button>
        </div>
      </div>

      {/* Active Alerts */}
      {(activeReminders.length > 0 || pendingConsents.length > 0) && (
        <div className="active-alerts mb-ritual">
          <h3 className="text-grounding font-presence text-primary mb-gentle">Active Alerts</h3>
          
          {activeReminders.map(reminder => (
            <div key={reminder.id} className="alert-card bg-warm-terra bg-opacity-10 border border-warm-terra p-gentle rounded-gentle mb-breath">
              <div className="flex items-start gap-breath">
                <span className="text-lg">🔔</span>
                <div className="flex-1">
                  <p className="text-breath text-primary">{reminder.message}</p>
                </div>
                <button className="text-whisper text-secondary hover:text-primary">
                  Acknowledge
                </button>
              </div>
            </div>
          ))}

          {pendingConsents.map(consent => (
            <div key={consent.id} className="alert-card bg-primary bg-opacity-10 border border-primary p-gentle rounded-gentle mb-breath">
              <div className="flex items-start gap-breath">
                <span className="text-lg">🤝</span>
                <div className="flex-1">
                  <p className="text-breath text-primary">New consent request for {consent.requestType.replace('_', ' ')}</p>
                  <p className="text-whisper text-secondary">"{consent.requestMessage}"</p>
                </div>
                <div className="flex gap-whisper">
                  <button className="sacred-button intention-gentle text-whisper">
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Context Guidance */}
      <div className="context-guidance surface-elevated-warm p-gentle rounded-gentle border border-tender-embrace">
        <h3 className="text-grounding font-presence text-primary mb-breath">
          Boundary Guidance for {currentContext.replace('_', ' ')} Context
        </h3>
        <ContextualGuidance context={currentContext} preferences={preferences} />
      </div>
    </div>
  );
}

// ===== CONTEXTUAL GUIDANCE COMPONENT =====

interface ContextualGuidanceProps {
  context: string;
  preferences: BoundaryPreferences;
}

function ContextualGuidance({ context, preferences }: ContextualGuidanceProps) {
  const getGuidanceForContext = (ctx: string) => {
    switch (ctx) {
      case 'witnessing':
        return {
          icon: '👁️',
          guidance: [
            'You prefer gentle perspective feedback - let others know this when sharing',
            'Your support capacity is set to gentle guidance - honor this limit',
            'Consider using trigger warnings for sensitive content you share'
          ]
        };
      case 'kindred':
        return {
          icon: '🤝',
          guidance: [
            'You prefer contemplative response times - let new connections know',
            'Your availability window is 9am-6pm - share this in your profile',
            'Remember to ask for consent before deep conversations'
          ]
        };
      case 'circles':
        return {
          icon: '🔮',
          guidance: [
            'Your sharing comfort is moderate depth - participate at this level',
            'Use your safe words if you need to pause or set a boundary',
            'Remember your energy protection settings for today'
          ]
        };
      default:
        return {
          icon: '🛡️',
          guidance: [
            'Your boundaries are your sacred containers - honor them always',
            'It\'s okay to change your mind about consent you\'ve given',
            'Trust your inner wisdom about what feels safe and supportive'
          ]
        };
    }
  };

  const contextGuidance = getGuidanceForContext(context);

  return (
    <div className="contextual-guidance">
      <div className="flex items-center gap-breath mb-gentle">
        <span className="text-lg">{contextGuidance.icon}</span>
        <p className="text-breath text-secondary">Based on your current preferences:</p>
      </div>
      <ul className="space-y-breath">
        {contextGuidance.guidance.map((guide, index) => (
          <li key={index} className="flex items-start gap-breath">
            <span className="text-primary mt-whisper">•</span>
            <p className="text-breath text-secondary">{guide}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===== BOUNDARY PREFERENCES COMPONENT =====

interface BoundaryPreferencesProps {
  preferences: BoundaryPreferences | null;
  onUpdatePreferences: (prefs: BoundaryPreferences) => void;
}

function BoundaryPreferences({ preferences, onUpdatePreferences }: BoundaryPreferencesProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  if (!preferences) return null;

  return (
    <div className="boundary-preferences">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Boundary Preferences
        </h2>
        <p className="text-presence text-secondary">
          Customize your protective boundaries for healthy community engagement.
        </p>
      </div>

      <div className="space-y-ritual">
        {/* Communication Boundaries */}
        <BoundarySection
          title="Communication Boundaries"
          icon="💬"
          description="How and when you're available for connection"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gentle">
            <div>
              <label className="block text-breath font-presence text-primary mb-whisper">Response Time Preference</label>
              <select 
                value={preferences.communicationBoundaries.responseTime}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
              >
                <option value="immediate">Immediate (within hours)</option>
                <option value="same_day">Same day response</option>
                <option value="contemplative">Contemplative (1-3 days)</option>
                <option value="seasonal">Seasonal response</option>
              </select>
            </div>
            <div>
              <label className="block text-breath font-presence text-primary mb-whisper">Max Connections Per Day</label>
              <input
                type="number"
                min="1"
                max="10"
                value={preferences.communicationBoundaries.energyProtection.maxConnectionsPerDay}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </BoundarySection>

        {/* Content Boundaries */}
        <BoundarySection
          title="Content Boundaries"
          icon="📝"
          description="Topics and content you're comfortable with"
        >
          <div className="space-y-gentle">
            <div>
              <label className="block text-breath font-presence text-primary mb-breath">Comfortable Topics</label>
              <div className="flex gap-whisper flex-wrap">
                {preferences.contentBoundaries.comfortableTopics.map(topic => (
                  <span key={topic} className="text-whisper bg-healing-mist px-breath py-whisper rounded-breath">
                    {topic.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-breath font-presence text-primary mb-breath">Topics Requiring Trigger Warnings</label>
              <div className="flex gap-whisper flex-wrap">
                {preferences.contentBoundaries.triggerWarningsNeeded.map(topic => (
                  <span key={topic} className="text-whisper bg-warm-terra bg-opacity-20 px-breath py-whisper rounded-breath">
                    {topic.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BoundarySection>

        {/* Emotional Boundaries */}
        <BoundarySection
          title="Emotional Boundaries"
          icon="💙"
          description="Your comfort levels for emotional support and sharing"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gentle">
            <div>
              <label className="block text-breath font-presence text-primary mb-whisper">Support Capacity</label>
              <select 
                value={preferences.emotionalBoundaries.supportCapacity}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
              >
                <option value="witness_only">Witness only</option>
                <option value="gentle_guidance">Gentle guidance</option>
                <option value="active_support">Active support</option>
                <option value="crisis_ready">Crisis ready</option>
              </select>
            </div>
            <div>
              <label className="block text-breath font-presence text-primary mb-whisper">Sharing Comfort Level</label>
              <select 
                value={preferences.emotionalBoundaries.sharingComfort}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
              >
                <option value="surface_level">Surface level</option>
                <option value="moderate_depth">Moderate depth</option>
                <option value="deep_sharing">Deep sharing</option>
                <option value="soul_level">Soul level</option>
              </select>
            </div>
          </div>
        </BoundarySection>

        {/* Safe Words */}
        <BoundarySection
          title="Sacred Safe Words"
          icon="🗣️"
          description="Words to pause, set boundaries, or request support"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gentle">
            <div>
              <label className="block text-breath font-presence text-primary mb-whisper">Pause Word</label>
              <input
                type="text"
                value={preferences.safetyProtocols.safeWords.pause}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
                placeholder="breathe"
              />
            </div>
            <div>
              <label className="block text-breath font-presence text-primary mb-whisper">Boundary Word</label>
              <input
                type="text"
                value={preferences.safetyProtocols.safeWords.boundary}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
                placeholder="sacred_space"
              />
            </div>
            <div>
              <label className="block text-breath font-presence text-primary mb-whisper">Support Word</label>
              <input
                type="text"
                value={preferences.safetyProtocols.safeWords.support}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
                placeholder="gentle_hold"
              />
            </div>
          </div>
        </BoundarySection>
      </div>

      <div className="flex justify-end gap-gentle mt-ritual pt-ritual border-t border-healing-mist">
        <button className="sacred-button intention-gentle">
          Reset to defaults
        </button>
        <button 
          onClick={() => onUpdatePreferences({ ...preferences, lastUpdated: new Date() })}
          className="sacred-button intention-sacred"
        >
          Save boundary preferences
        </button>
      </div>
    </div>
  );
}

// ===== BOUNDARY SECTION COMPONENT =====

interface BoundarySectionProps {
  title: string;
  icon: string;
  description: string;
  children: React.ReactNode;
}

function BoundarySection({ title, icon, description, children }: BoundarySectionProps) {
  return (
    <div className="boundary-section surface-card-gentle p-gentle rounded-gentle border border-healing-mist">
      <div className="flex items-center gap-breath mb-breath">
        <span className="text-xl">{icon}</span>
        <div>
          <h4 className="text-grounding font-presence text-primary">{title}</h4>
          <p className="text-breath text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ===== CONSENT MANAGER COMPONENT =====

interface ConsentManagerProps {
  pendingConsents: ConsentRequest[];
  onGrantConsent: (consent: ConsentRequest, conditions?: string[]) => void;
  onDeclineConsent: (consent: ConsentRequest) => void;
}

function ConsentManager({ pendingConsents, onGrantConsent, onDeclineConsent }: ConsentManagerProps) {
  const [selectedConsent, setSelectedConsent] = useState<ConsentRequest | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);

  if (pendingConsents.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">🤝</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          No Pending Consent Requests
        </h3>
        <p className="text-presence text-secondary">
          Consent requests for deeper conversations and sharing will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="consent-manager">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Consent Requests
        </h2>
        <p className="text-presence text-secondary">
          Review and respond to requests for deeper connection and sharing.
        </p>
      </div>

      <div className="space-y-gentle">
        {pendingConsents.map(consent => (
          <div key={consent.id} className="consent-card surface-card-gentle p-gentle rounded-gentle border border-healing-mist">
            <div className="flex items-start justify-between mb-gentle">
              <div>
                <h4 className="text-grounding font-presence text-primary capitalize">
                  {consent.requestType.replace('_', ' ')} Request
                </h4>
                <p className="text-breath text-secondary">
                  Expires {new Date(consent.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-lg">🤝</span>
            </div>

            <div className="consent-context bg-healing-mist p-breath rounded-breath mb-gentle">
              <p className="text-breath text-primary font-presence">Context: {consent.context}</p>
              <p className="text-breath text-secondary mt-whisper">"{consent.requestMessage}"</p>
            </div>

            <div className="flex gap-breath justify-end">
              <button
                onClick={() => onDeclineConsent(consent)}
                className="sacred-button intention-gentle"
              >
                Respectfully decline
              </button>
              <button
                onClick={() => setSelectedConsent(consent)}
                className="sacred-button intention-sacred"
              >
                Review & respond
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Consent Modal */}
      {selectedConsent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-gentle z-50">
          <div className="sacred-modal surface-sanctuary p-ritual rounded-gentle max-w-lg w-full">
            <h3 className="text-sacred font-grounding text-primary mb-gentle">
              Grant Consent with Sacred Boundaries
            </h3>
            
            <div className="mb-gentle">
              <p className="text-breath text-secondary mb-breath">
                <span className="font-presence">Request type:</span> {selectedConsent.requestType.replace('_', ' ')}
              </p>
              <div className="bg-healing-mist p-breath rounded-breath mb-gentle">
                <p className="text-breath text-primary">"{selectedConsent.requestMessage}"</p>
              </div>
            </div>

            <div className="mb-ritual">
              <label className="block text-presence font-presence text-primary mb-breath">
                Add conditions for this consent (optional)
              </label>
              <textarea
                placeholder="Any boundaries or conditions you'd like to set for this interaction..."
                className="w-full p-gentle border border-healing-mist rounded-breath resize-none h-20 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-gentle justify-end">
              <button
                onClick={() => setSelectedConsent(null)}
                className="sacred-button intention-gentle"
              >
                Cancel
              </button>
              <button
                onClick={() => onDeclineConsent(selectedConsent)}
                className="sacred-button intention-gentle"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  onGrantConsent(selectedConsent, conditions);
                  setSelectedConsent(null);
                  setConditions([]);
                }}
                className="sacred-button intention-sacred"
              >
                Grant consent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== BOUNDARY REMINDERS COMPONENT =====

interface BoundaryRemindersProps {
  reminders: BoundaryReminder[];
  onAcknowledgeReminder: (reminderId: string) => void;
}

function BoundaryReminders({ reminders, onAcknowledgeReminder }: BoundaryRemindersProps) {
  const activeReminders = reminders.filter(r => r.isActive);

  if (activeReminders.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">🔔</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          No Active Reminders
        </h3>
        <p className="text-presence text-secondary">
          Boundary reminders and energy check-ins will appear here when triggered.
        </p>
      </div>
    );
  }

  return (
    <div className="boundary-reminders">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Active Boundary Reminders
        </h2>
        <p className="text-presence text-secondary">
          Gentle prompts to help you maintain healthy boundaries.
        </p>
      </div>

      <div className="space-y-gentle">
        {activeReminders.map(reminder => (
          <div key={reminder.id} className="reminder-card surface-elevated-warm p-gentle rounded-gentle border border-warm-terra">
            <div className="flex items-start gap-breath">
              <span className="text-xl">
                {reminder.reminderType === 'energy_check' && '⚡'}
                {reminder.reminderType === 'topic_sensitivity' && '⚠️'}
                {reminder.reminderType === 'time_boundary' && '⏰'}
                {reminder.reminderType === 'capacity_limit' && '🛡️'}
              </span>
              <div className="flex-1">
                <h4 className="text-grounding font-presence text-primary mb-whisper capitalize">
                  {reminder.reminderType.replace('_', ' ')} Reminder
                </h4>
                <p className="text-breath text-secondary mb-breath">{reminder.message}</p>
                <p className="text-whisper text-tertiary">Triggered by: {reminder.triggeredBy}</p>
              </div>
              <button
                onClick={() => onAcknowledgeReminder(reminder.id)}
                className="sacred-button intention-gentle text-breath"
              >
                Acknowledge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SacredBoundaryTools;