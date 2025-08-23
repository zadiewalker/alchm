// ALCHM IKIGAI Digital Bootcamp - Multi-Session Progression System
// Trauma-informed life purpose discovery with cultural adaptations

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  IKIGAIBootcamp,
  IKIGAISession,
  IKIGAISessionProps,
  TraumaInformedNote,
  IKIGAIProgressMetrics,
  UserPreferences
} from '@/types/ikigai-schema';
import { CulturalContext } from '@/types/pathways-schema';
import IKIGAIQuadrant from './IKIGAIQuadrant';
import { IKIGAIMap } from './IKIGAIMap';

interface IKIGAIBootcampProps {
  bootcamp: IKIGAIBootcamp;
  userPreferences: UserPreferences;
  culturalContext: CulturalContext;
  onBootcampUpdate: (bootcamp: IKIGAIBootcamp) => void;
  onBootcampComplete: (bootcamp: IKIGAIBootcamp) => void;
  onSessionSave: (session: IKIGAISession) => Promise<void>;
}

export const IKIGAIBootcampComponent: React.FC<IKIGAIBootcampProps> = ({
  bootcamp,
  userPreferences,
  culturalContext,
  onBootcampUpdate,
  onBootcampComplete,
  onSessionSave
}) => {
  const [currentSessionIndex, setCurrentSessionIndex] = useState(() => {
    const activeIndex = bootcamp.sessions.findIndex(s => s.isActive);
    return activeIndex >= 0 ? activeIndex : 0;
  });
  
  const [isSessionTransition, setIsSessionTransition] = useState(false);
  const [traumaInformedNotes, setTraumaInformedNotes] = useState<TraumaInformedNote[]>([]);
  const [showProgressSummary, setShowProgressSummary] = useState(false);

  const currentSession = bootcamp.sessions[currentSessionIndex];
  
  // Session type configurations
  const getSessionConfig = (sessionType: IKIGAISession['sessionType']) => {
    const configs = {
      discovery: {
        title: 'Discovery Session',
        subtitle: 'Explore your core elements',
        icon: '🌟',
        color: '#3498db',
        description: 'Begin your journey by discovering your passions, skills, values, and opportunities.',
        estimatedTime: '30-45 minutes',
        phases: ['passions', 'skills', 'values', 'opportunities']
      },
      deep_dive: {
        title: 'Deep Dive Session',
        subtitle: 'Deepen your understanding',
        icon: '🔍',
        color: '#9b59b6',
        description: 'Explore the deeper meaning and connections within each area.',
        estimatedTime: '45-60 minutes',
        phases: ['passion_details', 'skill_mastery', 'value_alignment', 'opportunity_analysis']
      },
      synthesis: {
        title: 'Synthesis Session',
        subtitle: 'Find your intersections',
        icon: '🎯',
        color: '#e74c3c',
        description: 'Discover where your elements intersect to reveal your life purpose.',
        estimatedTime: '60-75 minutes',
        phases: ['intersection_mapping', 'ai_analysis', 'purpose_crystallization']
      },
      action_planning: {
        title: 'Action Planning Session',
        subtitle: 'Create your roadmap',
        icon: '🚀',
        color: '#2ecc71',
        description: 'Develop concrete steps to live your purpose.',
        estimatedTime: '45-60 minutes',
        phases: ['goal_setting', 'resource_planning', 'milestone_creation', 'support_mapping']
      },
      reflection_review: {
        title: 'Reflection & Review',
        subtitle: 'Integrate and plan forward',
        icon: '💭',
        color: '#f39c12',
        description: 'Reflect on your journey and plan your continued growth.',
        estimatedTime: '30-45 minutes',
        phases: ['journey_reflection', 'growth_assessment', 'future_visioning']
      }
    };
    
    return configs[sessionType];
  };

  const sessionConfig = getSessionConfig(currentSession.sessionType);

  // Progress calculation
  const calculateOverallProgress = useCallback(() => {
    const totalSessions = bootcamp.sessions.length;
    const completedSessions = bootcamp.sessions.filter(s => s.completedAt).length;
    const currentSessionProgress = currentSession.progressMetrics.sessionProgress;
    
    return (completedSessions + currentSessionProgress) / totalSessions;
  }, [bootcamp.sessions, currentSession]);

  // Session navigation
  const canProgressToNext = useCallback(() => {
    return currentSession.progressMetrics.sessionProgress >= 0.8 && 
           currentSession.progressMetrics.confidenceIncrease >= 0.6;
  }, [currentSession]);

  const handleNextSession = useCallback(async () => {
    if (!canProgressToNext()) return;
    
    setIsSessionTransition(true);
    
    try {
      // Complete current session
      const updatedCurrentSession: IKIGAISession = {
        ...currentSession,
        completedAt: new Date(),
        isActive: false,
        progressMetrics: {
          ...currentSession.progressMetrics,
          sessionProgress: 1.0
        }
      };
      
      // Save current session
      await onSessionSave(updatedCurrentSession);
      
      // Move to next session if available
      const nextIndex = currentSessionIndex + 1;
      if (nextIndex < bootcamp.sessions.length) {
        const nextSession: IKIGAISession = {
          ...bootcamp.sessions[nextIndex],
          isActive: true,
          updatedAt: new Date()
        };
        
        const updatedBootcamp: IKIGAIBootcamp = {
          ...bootcamp,
          sessions: bootcamp.sessions.map((session, index) => {
            if (index === currentSessionIndex) return updatedCurrentSession;
            if (index === nextIndex) return nextSession;
            return session;
          }),
          overallProgress: calculateOverallProgress()
        };
        
        onBootcampUpdate(updatedBootcamp);
        setCurrentSessionIndex(nextIndex);
      } else {
        // Bootcamp complete
        const completedBootcamp: IKIGAIBootcamp = {
          ...bootcamp,
          actualCompletionDate: new Date(),
          isActive: false,
          overallProgress: 1.0,
          sessions: bootcamp.sessions.map((session, index) => 
            index === currentSessionIndex ? updatedCurrentSession : session
          )
        };
        
        onBootcampComplete(completedBootcamp);
      }
    } catch (error) {
      console.error('Error transitioning to next session:', error);
      // Add trauma-informed note about technical difficulty
      setTraumaInformedNotes(prev => [...prev, {
        type: 'safety_check',
        content: 'We encountered a technical issue. Your progress is safe and we can continue when ready.',
        severity: 'info',
        actionRequired: false,
        culturalConsiderations: [],
        supportResources: ['Technical support available'],
        followUpRequired: false
      }]);
    } finally {
      setIsSessionTransition(false);
    }
  }, [currentSession, currentSessionIndex, bootcamp, canProgressToNext, onSessionSave, onBootcampUpdate, onBootcampComplete, calculateOverallProgress]);

  const handlePreviousSession = useCallback(() => {
    if (currentSessionIndex > 0) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    }
  }, [currentSessionIndex]);

  // Trauma-informed safety checks
  useEffect(() => {
    const performSafetyCheck = () => {
      const notes: TraumaInformedNote[] = [];
      
      // Check session duration
      const sessionStartTime = currentSession.createdAt;
      const currentTime = new Date();
      const sessionDuration = (currentTime.getTime() - sessionStartTime.getTime()) / (1000 * 60); // minutes
      
      if (sessionDuration > 60) {
        notes.push({
          type: 'safety_check',
          content: 'You\'ve been in this session for over an hour. Consider taking a break to process your insights.',
          severity: 'caution',
          actionRequired: false,
          culturalConsiderations: userPreferences.culturalAdaptation === 'automatic' ? 
            ['Rest and reflection are culturally valued practices'] : [],
          supportResources: ['Take a 10-15 minute break', 'Return when you feel refreshed'],
          followUpRequired: false
        });
      }
      
      // Check confidence levels
      if (currentSession.progressMetrics.confidenceIncrease < 0.3) {
        notes.push({
          type: 'strength_focus',
          content: 'Remember, there are no wrong answers. Your insights are valuable and uniquely yours.',
          severity: 'info',
          actionRequired: false,
          culturalConsiderations: [],
          supportResources: ['AI assistance is available', 'Cultural prompts can help guide reflection'],
          followUpRequired: false
        });
      }
      
      setTraumaInformedNotes(notes);
    };
    
    // Check every 5 minutes
    const interval = setInterval(performSafetyCheck, 5 * 60 * 1000);
    performSafetyCheck(); // Initial check
    
    return () => clearInterval(interval);
  }, [currentSession, userPreferences]);

  // Cultural adaptation for session pacing
  const getCulturalPacingMessage = () => {
    const culturalMessages = {
      'collectivist': 'Take time to consider how your insights connect to your community and relationships.',
      'individualist': 'Focus on what feels most authentic and personally meaningful to you.',
      'family_centered': 'Reflect on how these insights honor your family values and traditions.',
      'contemplative': 'Allow yourself space for deep reflection and inner wisdom to emerge.'
    };
    
    const valueSystem = culturalContext.valueSystem[0];
    return culturalMessages[valueSystem] || culturalMessages.contemplative;
  };

  return (
    <div className="ikigai-bootcamp-container">
      {/* Header */}
      <div className="bootcamp-header" style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `3px solid ${sessionConfig.color}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px' }}>{sessionConfig.icon}</span>
          <div>
            <h1 style={{ 
              color: sessionConfig.color, 
              fontSize: '28px', 
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '4px'
            }}>
              {sessionConfig.title}
            </h1>
            <p style={{ 
              color: '#666', 
              fontSize: '16px', 
              margin: 0,
              marginBottom: '8px'
            }}>
              {sessionConfig.subtitle}
            </p>
            <p style={{ 
              color: '#888', 
              fontSize: '14px', 
              margin: 0
            }}>
              {sessionConfig.description}
            </p>
          </div>
        </div>
        
        {/* Progress indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Session progress */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Session Progress</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {Math.round(currentSession.progressMetrics.sessionProgress * 100)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${currentSession.progressMetrics.sessionProgress * 100}%`,
                height: '100%',
                backgroundColor: sessionConfig.color,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          {/* Overall bootcamp progress */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Bootcamp Progress</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {Math.round(calculateOverallProgress() * 100)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${calculateOverallProgress() * 100}%`,
                height: '100%',
                backgroundColor: '#27ae60',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Session {currentSessionIndex + 1} of {bootcamp.sessions.length}
            </span>
            <button
              onClick={() => setShowProgressSummary(!showProgressSummary)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📊 Details
            </button>
          </div>
        </div>
      </div>

      {/* Progress Summary Modal */}
      {showProgressSummary && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: sessionConfig.color }}>📊 Progress Summary</h3>
              <button
                onClick={() => setShowProgressSummary(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Session timeline */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '12px' }}>Session Timeline</h4>
              {bootcamp.sessions.map((session, index) => (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: index === currentSessionIndex ? 
                      `${sessionConfig.color}10` : 'transparent',
                    border: index === currentSessionIndex ? 
                      `1px solid ${sessionConfig.color}30` : '1px solid transparent'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: session.completedAt ? '#27ae60' : 
                                   session.isActive ? sessionConfig.color : '#ddd',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {session.completedAt ? '✓' : index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      {getSessionConfig(session.sessionType).title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {session.completedAt ? 
                        `Completed ${session.completedAt.toLocaleDateString()}` :
                        session.isActive ? 'In Progress' : 'Pending'
                      }
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {Math.round(session.progressMetrics.sessionProgress * 100)}%
                  </div>
                </div>
              ))}
            </div>
            
            {/* Current metrics */}
            <div>
              <h4 style={{ marginBottom: '12px' }}>Current Session Metrics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>Engagement Score</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: sessionConfig.color }}>
                    {Math.round(currentSession.progressMetrics.engagementScore * 100)}%
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>Clarity Increase</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: sessionConfig.color }}>
                    +{Math.round(currentSession.progressMetrics.clarityIncrease * 100)}%
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>Time Spent</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: sessionConfig.color }}>
                    {Math.round(currentSession.progressMetrics.timeSpent)} min
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>Cultural Resonance</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: sessionConfig.color }}>
                    {Math.round(currentSession.progressMetrics.culturalResonance * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trauma-informed notes */}
      {traumaInformedNotes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {traumaInformedNotes.map((note, index) => (
            <div
              key={index}
              style={{
                backgroundColor: note.severity === 'critical' ? '#ffebee' :
                                note.severity === 'important' ? '#fff3e0' :
                                note.severity === 'caution' ? '#f3e5f5' : '#f8f9fa',
                border: `1px solid ${
                  note.severity === 'critical' ? '#f44336' :
                  note.severity === 'important' ? '#ff9800' :
                  note.severity === 'caution' ? '#9c27b0' : '#dee2e6'
                }`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span>💚</span>
                <strong style={{ fontSize: '14px' }}>
                  {note.type.replace('_', ' ').toUpperCase()}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.4 }}>
                {note.content}
              </p>
              {note.supportResources.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                  💡 {note.supportResources.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cultural pacing message */}
      <div style={{
        backgroundColor: `${sessionConfig.color}05`,
        border: `1px solid ${sessionConfig.color}20`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span>🌍</span>
          <strong style={{ fontSize: '14px', color: sessionConfig.color }}>
            Cultural Guidance
          </strong>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: 1.4 }}>
          {getCulturalPacingMessage()}
        </p>
      </div>

      {/* Main session content */}
      <div className="session-content">
        <IKIGAISessionComponent
          session={currentSession}
          bootcamp={bootcamp}
          onSessionUpdate={(updatedSession) => {
            const updatedBootcamp: IKIGAIBootcamp = {
              ...bootcamp,
              sessions: bootcamp.sessions.map(s => 
                s.id === updatedSession.id ? updatedSession : s
              )
            };
            onBootcampUpdate(updatedBootcamp);
          }}
          onSessionComplete={handleNextSession}
          culturalContext={culturalContext}
          userPreferences={userPreferences}
        />
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '32px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={handlePreviousSession}
          disabled={currentSessionIndex === 0}
          style={{
            backgroundColor: currentSessionIndex === 0 ? '#f5f5f5' : 'transparent',
            color: currentSessionIndex === 0 ? '#999' : sessionConfig.color,
            border: `2px solid ${currentSessionIndex === 0 ? '#ddd' : sessionConfig.color}`,
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: currentSessionIndex === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Previous Session
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          fontSize: '14px',
          color: '#666'
        }}>
          <span>Estimated time: {sessionConfig.estimatedTime}</span>
          {isSessionTransition && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: `2px solid ${sessionConfig.color}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span>Transitioning...</span>
            </div>
          )}
        </div>

        <button
          onClick={handleNextSession}
          disabled={!canProgressToNext() || isSessionTransition}
          style={{
            backgroundColor: canProgressToNext() && !isSessionTransition ? sessionConfig.color : '#f5f5f5',
            color: canProgressToNext() && !isSessionTransition ? 'white' : '#999',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: canProgressToNext() && !isSessionTransition ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {currentSessionIndex === bootcamp.sessions.length - 1 ? 
            'Complete Bootcamp 🎓' : 'Next Session →'}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Individual session component
const IKIGAISessionComponent: React.FC<IKIGAISessionProps> = ({
  session,
  bootcamp,
  onSessionUpdate,
  onSessionComplete,
  culturalContext,
  userPreferences
}) => {
  const renderSessionContent = () => {
    switch (session.sessionType) {
      case 'discovery':
        return <DiscoverySession 
          session={session} 
          onSessionUpdate={onSessionUpdate}
          culturalContext={culturalContext}
          userPreferences={userPreferences}
        />;
      case 'deep_dive':
        return <DeepDiveSession 
          session={session} 
          onSessionUpdate={onSessionUpdate}
          culturalContext={culturalContext}
          userPreferences={userPreferences}
        />;
      case 'synthesis':
        return <SynthesisSession 
          session={session} 
          onSessionUpdate={onSessionUpdate}
          culturalContext={culturalContext}
          userPreferences={userPreferences}
        />;
      case 'action_planning':
        return <ActionPlanningSession 
          session={session} 
          onSessionUpdate={onSessionUpdate}
          culturalContext={culturalContext}
          userPreferences={userPreferences}
        />;
      case 'reflection_review':
        return <ReflectionReviewSession 
          session={session} 
          onSessionUpdate={onSessionUpdate}
          culturalContext={culturalContext}
          userPreferences={userPreferences}
        />;
      default:
        return <div>Unknown session type</div>;
    }
  };

  return (
    <div className="ikigai-session-content">
      {renderSessionContent()}
    </div>
  );
};

// Discovery Session Component
const DiscoverySession: React.FC<{
  session: IKIGAISession;
  onSessionUpdate: (session: IKIGAISession) => void;
  culturalContext: CulturalContext;
  userPreferences: UserPreferences;
}> = ({ session, onSessionUpdate, culturalContext, userPreferences }) => {
  const [activeQuadrant, setActiveQuadrant] = useState<string>('passions');
  
  const quadrants = [
    { type: 'passions', responses: session.responses.passions },
    { type: 'skills', responses: session.responses.skills },
    { type: 'values', responses: session.responses.values },
    { type: 'opportunities', responses: session.responses.opportunities }
  ];

  const handleResponseUpdate = useCallback((quadrantType: string, responses: any[]) => {
    const updatedSession: IKIGAISession = {
      ...session,
      responses: {
        ...session.responses,
        [quadrantType]: responses
      },
      updatedAt: new Date()
    };
    
    // Update progress metrics
    const totalResponses = Object.values(updatedSession.responses).flat().length;
    const progressUpdate = Math.min(totalResponses / 16, 1.0); // Assuming 4 per quadrant target
    
    updatedSession.progressMetrics = {
      ...updatedSession.progressMetrics,
      sessionProgress: progressUpdate,
      clarityIncrease: progressUpdate * 0.7, // Discovery clarity grows with responses
      engagementScore: Math.min(updatedSession.progressMetrics.engagementScore + 0.1, 1.0)
    };
    
    onSessionUpdate(updatedSession);
  }, [session, onSessionUpdate]);

  return (
    <div className="discovery-session">
      {/* Quadrant selector */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {quadrants.map(({ type, responses }) => (
          <button
            key={type}
            onClick={() => setActiveQuadrant(type)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '16px',
              borderRadius: '8px',
              border: `2px solid ${activeQuadrant === type ? '#3498db' : '#ddd'}`,
              backgroundColor: activeQuadrant === type ? '#3498db10' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px', textTransform: 'capitalize' }}>
              {type}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {responses.length} items
            </div>
          </button>
        ))}
      </div>

      {/* Active quadrant */}
      <div style={{ marginBottom: '24px' }}>
        <IKIGAIQuadrant
          quadrantType={activeQuadrant as any}
          responses={quadrants.find(q => q.type === activeQuadrant)?.responses || []}
          onResponseUpdate={(responses) => handleResponseUpdate(activeQuadrant, responses)}
          culturalContext={culturalContext}
          traumaInformedMode={userPreferences.traumaInformedMode}
          aiAssistanceEnabled={userPreferences.aiAssistanceLevel !== 'minimal'}
          isCompleted={false}
        />
      </div>
    </div>
  );
};

// Placeholder components for other session types
const DeepDiveSession: React.FC<any> = () => <div>Deep Dive Session - Coming Soon</div>;
const SynthesisSession: React.FC<any> = () => <div>Synthesis Session - Coming Soon</div>;
const ActionPlanningSession: React.FC<any> = () => <div>Action Planning Session - Coming Soon</div>;
const ReflectionReviewSession: React.FC<any> = () => <div>Reflection Review Session - Coming Soon</div>;

export default IKIGAIBootcampComponent;