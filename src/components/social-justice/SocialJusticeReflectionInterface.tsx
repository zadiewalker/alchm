'use client';

// ALCHM Social Justice Reflection Interface
// Trauma-informed interface for engaging with social justice activities
// Designed to build critical consciousness while maintaining safety and cultural responsiveness

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, HeartIcon, UsersIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { 
  SocialJusticeActivity, 
  SocialJusticeActivitySelector,
  CULTURAL_ADAPTATIONS,
  SOCIAL_JUSTICE_ETHICS
} from '@/lib/social-justice-activities';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';
import KheperaScarabIcon from '@/components/khepera/KheperaScarabIcons';

// ===== INTERFACE TYPES =====

interface SocialJusticeReflectionProps {
  userId: string;
  culturalContext?: string;
  gradeLevel?: 'elementary' | 'middle' | 'high_school' | 'all_ages';
  onReflectionSave?: (reflection: any) => void;
  className?: string;
}

interface ReflectionSession {
  activity: SocialJusticeActivity;
  responses: { [questionId: string]: string };
  startTime: Date;
  safetyAcknowledged: boolean;
  culturalAdaptation?: any;
}

// ===== MAIN COMPONENT =====

export default function SocialJusticeReflectionInterface({
  userId,
  culturalContext = 'universal',
  gradeLevel = 'high_school',
  onReflectionSave,
  className = ''
}: SocialJusticeReflectionProps) {
  
  const { getSacredPrompt, getSacredButton } = useSacredMicrocopy();
  
  // ===== STATE MANAGEMENT =====
  const [currentSession, setCurrentSession] = useState<ReflectionSession | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('15_minutes');
  const [showSafetyInfo, setShowSafetyInfo] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isReflecting, setIsReflecting] = useState(false);

  // ===== ACTIVITY SELECTION =====
  
  const focusAreas = [
    { id: 'personal_power', title: 'Personal Power', icon: SparklesIcon, description: 'Explore your strengths, identity, and agency' },
    { id: 'collective_strength', title: 'Collective Strength', icon: UsersIcon, description: 'Build community connections and solidarity' },
    { id: 'historical_awareness', title: 'Historical Awareness', icon: 'M12 14l9-5-9-5-9 5 9 5z', description: 'Understand systems and histories that shape today' },
    { id: 'future_visioning', title: 'Future Visioning', icon: HeartIcon, description: 'Dream and plan for liberation and justice' },
    { id: 'healing_justice', title: 'Healing Justice', icon: HeartIcon, description: 'Connect personal and community healing' },
    { id: 'cultural_wisdom', title: 'Cultural Wisdom', icon: SparklesIcon, description: 'Honor and reclaim cultural knowledge' }
  ];

  const startReflectionSession = () => {
    if (!selectedFocus) return;
    
    const activity = SocialJusticeActivitySelector.selectActivity(
      selectedFocus,
      gradeLevel,
      selectedTime,
      culturalContext
    );
    
    if (!activity) {
      console.warn('No suitable activity found for selection criteria');
      return;
    }

    const culturalAdaptation = culturalContext !== 'universal' 
      ? SocialJusticeActivitySelector.getCulturalAdaptation(activity, culturalContext)
      : null;

    setCurrentSession({
      activity: culturalAdaptation || activity,
      responses: {},
      startTime: new Date(),
      safetyAcknowledged: false,
      culturalAdaptation
    });
    setCurrentQuestionIndex(0);
    setIsReflecting(true);
  };

  const handleResponseChange = (questionId: string, response: string) => {
    if (!currentSession) return;
    
    setCurrentSession(prev => ({
      ...prev!,
      responses: {
        ...prev!.responses,
        [questionId]: response
      }
    }));
  };

  const saveReflection = async () => {
    if (!currentSession || !onReflectionSave) return;
    
    const reflectionData = {
      userId,
      activityId: currentSession.activity.id,
      activityTitle: currentSession.activity.title,
      category: currentSession.activity.category,
      focusArea: currentSession.activity.focusArea,
      culturalContext,
      responses: currentSession.responses,
      startTime: currentSession.startTime,
      completedTime: new Date(),
      safetyAcknowledged: currentSession.safetyAcknowledged
    };
    
    await onReflectionSave(reflectionData);
    setCurrentSession(null);
    setIsReflecting(false);
    setSelectedFocus(null);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // ===== SAFETY ACKNOWLEDGMENT =====
  
  const SafetyAcknowledgment = () => (
    <div className="bg-healing-whisper border border-healing-mist rounded-lg p-space-gentle mb-space-ritual">
      <div className="flex items-start gap-space-breath">
        <ShieldCheckIcon className="w-6 h-6 text-warm-terra mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-text-primary font-weight-presence mb-space-breath">
            Sacred Container for Justice Reflection
          </h3>
          <p className="text-text-secondary text-text-breath mb-space-gentle">
            This reflection space honors your lived experience and cultural wisdom. You have full agency over what you share and how deeply you engage.
          </p>
          
          <div className="space-y-space-whisper mb-space-gentle">
            <div className="flex items-start gap-space-whisper">
              <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-breath">You can stop, skip questions, or take breaks at any time</p>
            </div>
            <div className="flex items-start gap-space-whisper">
              <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-breath">Your reflections are private and controlled by you</p>
            </div>
            <div className="flex items-start gap-space-whisper">
              <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-breath">This is about building power, not processing trauma</p>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentSession(prev => prev ? { ...prev, safetyAcknowledged: true } : null)}
            className="sacred-button sacred-button-primary"
          >
            {getSacredButton('consent', 'I honor this sacred space')}
          </button>
        </div>
      </div>
    </div>
  );

  // ===== ACTIVITY SELECTION INTERFACE =====
  
  if (!currentSession) {
    return (
      <div className={`social-justice-reflection-interface ${className}`}>
        <div className="max-w-4xl mx-auto space-y-space-ritual">
          
          {/* Header */}
          <div className="text-center space-y-space-gentle">
            <div className="flex justify-center mb-space-breath">
              <KheperaScarabIcon size={64} mode="affirming" showAura={true} />
            </div>
            <h1 className="text-text-vibrant font-weight-ceremony text-text-ceremony">
              Justice Reflection Circle
            </h1>
            <p className="text-text-secondary text-text-presence max-w-2xl mx-auto">
              Sacred space for exploring identity, power, community, and liberation through culturally grounded reflection and critical consciousness building.
            </p>
          </div>

          {/* Ethics Framework */}
          <div className="bg-soft-blush-whisper border border-soft-blush-mist rounded-lg p-space-gentle">
            <button
              onClick={() => setShowSafetyInfo(!showSafetyInfo)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-text-primary font-weight-presence">Our Sacred Agreements</h3>
              {showSafetyInfo ? (
                <ChevronUpIcon className="w-5 h-5 text-warm-terra" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-warm-terra" />
              )}
            </button>
            
            {showSafetyInfo && (
              <div className="mt-space-gentle space-y-space-breath">
                <div>
                  <h4 className="font-weight-presence text-text-breath mb-space-whisper">Core Values:</h4>
                  <ul className="space-y-space-whisper text-text-breath">
                    {SOCIAL_JUSTICE_ETHICS.coreValues.map((value, index) => (
                      <li key={index} className="flex items-start gap-space-whisper">
                        <div className="w-1.5 h-1.5 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-weight-presence text-text-breath mb-space-whisper">Building Power Together:</h4>
                  <ul className="space-y-space-whisper text-text-breath">
                    {SOCIAL_JUSTICE_ETHICS.buildingPower.slice(0, 3).map((principle, index) => (
                      <li key={index} className="flex items-start gap-space-whisper">
                        <div className="w-1.5 h-1.5 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                        <span>{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-space-gentle">
            <h3 className="text-text-primary font-weight-presence">How much time do you have?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-breath">
              {[
                { id: '5_minutes', label: '5 minutes', description: 'Quick reflection' },
                { id: '15_minutes', label: '15 minutes', description: 'Deeper exploration' },
                { id: '30_minutes', label: '30 minutes', description: 'Full journey' },
                { id: 'ongoing', label: 'Ongoing', description: 'Extended practice' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedTime(option.id)}
                  className={`p-space-gentle rounded-lg border text-left transition-all timing-breath ${
                    selectedTime === option.id
                      ? 'border-primary bg-primary-whisper text-primary'
                      : 'border-healing-mist bg-surface-elevated hover:border-warm-terra'
                  }`}
                >
                  <div className="font-weight-presence text-text-breath">{option.label}</div>
                  <div className="text-text-whisper">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Area Selection */}
          <div className="space-y-space-gentle">
            <h3 className="text-text-primary font-weight-presence">What calls to your spirit today?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-breath">
              {focusAreas.map((area) => {
                const IconComponent = area.icon;
                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedFocus(area.id)}
                    className={`p-space-gentle rounded-lg border text-left transition-all timing-breath ${
                      selectedFocus === area.id
                        ? 'border-primary bg-primary-whisper text-primary'
                        : 'border-healing-mist bg-surface-elevated hover:border-warm-terra'
                    }`}
                  >
                    <div className="flex items-start gap-space-breath">
                      {typeof IconComponent === 'string' ? (
                        <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={IconComponent} />
                        </svg>
                      ) : (
                        <IconComponent className="w-6 h-6 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-weight-presence text-text-breath mb-space-whisper">{area.title}</h4>
                        <p className="text-text-whisper">{area.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          {selectedFocus && (
            <div className="text-center">
              <button
                onClick={startReflectionSession}
                className="sacred-button sacred-button-primary text-text-presence"
              >
                {getSacredButton('begin', 'Begin Sacred Reflection')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== REFLECTION SESSION INTERFACE =====
  
  return (
    <div className={`social-justice-reflection-interface ${className}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Safety Acknowledgment */}
        {!currentSession.safetyAcknowledged && <SafetyAcknowledgment />}
        
        {currentSession.safetyAcknowledged && (
          <div className="space-y-space-ritual">
            
            {/* Activity Header */}
            <div className="bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
              <div className="flex items-start justify-between mb-space-gentle">
                <div className="flex-1">
                  <div className="flex items-center gap-space-breath mb-space-breath">
                    <div className="w-3 h-3 bg-warm-terra rounded-full"></div>
                    <span className="text-text-secondary text-text-whisper uppercase tracking-wide">
                      {currentSession.activity.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-text-primary font-weight-presence text-text-vibrant mb-space-breath">
                    {currentSession.activity.title}
                  </h2>
                  {currentSession.activity.culturalWisdom && (
                    <p className="text-text-secondary text-text-breath italic border-l-2 border-warm-terra pl-space-gentle">
                      {currentSession.activity.culturalWisdom}
                    </p>
                  )}
                </div>
                <KheperaScarabIcon size={48} mode="present" culturalContext={culturalContext} />
              </div>
            </div>

            {/* Main Prompt */}
            <div className="bg-soft-blush-whisper border-l-4 border-warm-terra p-space-gentle rounded-r-lg">
              <h3 className="font-weight-presence text-text-primary mb-space-breath">Sacred Invitation</h3>
              <p className="text-text-presence text-text-breath leading-spacious">
                {currentSession.activity.prompt}
              </p>
            </div>

            {/* Guiding Questions */}
            <div className="space-y-space-gentle">
              <h3 className="text-text-primary font-weight-presence">Reflection Pathways</h3>
              
              {currentSession.activity.guidingQuestions.map((question, index) => (
                <div key={index} className="space-y-space-breath">
                  <div className="flex items-start gap-space-breath">
                    <div className="w-6 h-6 rounded-full bg-primary-whisper flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-text-whisper font-weight-presence">{index + 1}</span>
                    </div>
                    <p className="text-text-breath font-weight-breath">{question}</p>
                  </div>
                  
                  <textarea
                    value={currentSession.responses[`question_${index}`] || ''}
                    onChange={(e) => handleResponseChange(`question_${index}`, e.target.value)}
                    placeholder={getSacredPrompt('reflection', 'Let your thoughts flow...')}
                    className="w-full min-h-[120px] p-space-gentle border border-healing-mist rounded-lg bg-surface-elevated resize-none focus:border-primary focus:outline-none transition-colors timing-breath text-text-breath"
                  />
                </div>
              ))}
            </div>

            {/* Safety Considerations */}
            {currentSession.activity.safetyConsiderations.length > 0 && (
              <div className="bg-healing-whisper border border-healing-mist rounded-lg p-space-gentle">
                <button
                  onClick={() => toggleSection('safety')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h4 className="font-weight-presence text-text-primary">Sacred Boundaries</h4>
                  {expandedSections.has('safety') ? (
                    <ChevronUpIcon className="w-5 h-5 text-warm-terra" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-warm-terra" />
                  )}
                </button>
                
                {expandedSections.has('safety') && (
                  <ul className="mt-space-breath space-y-space-whisper">
                    {currentSession.activity.safetyConsiderations.map((consideration, index) => (
                      <li key={index} className="flex items-start gap-space-whisper">
                        <ShieldCheckIcon className="w-4 h-4 text-warm-terra mt-0.5 flex-shrink-0" />
                        <span className="text-text-breath">{consideration}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Follow-up Actions */}
            {currentSession.activity.followUpActions && (
              <div className="bg-primary-whisper border border-primary-mist rounded-lg p-space-gentle">
                <button
                  onClick={() => toggleSection('actions')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h4 className="font-weight-presence text-text-primary">Sacred Next Steps</h4>
                  {expandedSections.has('actions') ? (
                    <ChevronUpIcon className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-primary" />
                  )}
                </button>
                
                {expandedSections.has('actions') && (
                  <ul className="mt-space-breath space-y-space-whisper">
                    {currentSession.activity.followUpActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-space-whisper">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-text-breath">{action}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-space-breath pt-space-gentle border-t border-healing-mist">
              <button
                onClick={() => {
                  setCurrentSession(null);
                  setIsReflecting(false);
                }}
                className="sacred-button sacred-button-secondary flex-1"
              >
                {getSacredButton('pause', 'Pause and Return Later')}
              </button>
              
              <button
                onClick={saveReflection}
                disabled={Object.keys(currentSession.responses).length === 0}
                className="sacred-button sacred-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getSacredButton('complete', 'Complete Sacred Reflection')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}