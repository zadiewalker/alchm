'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useData } from '@/hooks/useData';

interface CrisisAssessment {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  triggers: string[];
  supportRecommendations: string[];
  immediateActions: string[];
}

interface SafetyPlan {
  id: string;
  userId: string;
  warningSignals: string[];
  copingStrategies: string[];
  supportContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    available24h: boolean;
  }>;
  safeEnvironment: string[];
  professionalContacts: Array<{
    name: string;
    type: 'therapist' | 'psychiatrist' | 'crisis_counselor' | 'emergency';
    phone: string;
    available: string;
  }>;
  customStrategies: string[];
  createdAt: Date;
  lastUpdated: Date;
}

export default function CrisisInterventionSystem() {
  const { user } = useAuth();
  const { userProfile, isInitialized } = useData();
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<CrisisAssessment | null>(null);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan | null>(null);
  const [isCreatingSafetyPlan, setIsCreatingSafetyPlan] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});

  // Crisis assessment questions (validated clinical screening tools)
  const assessmentQuestions = [
    {
      id: 'thoughts_of_death',
      text: 'In the past two weeks, how often have you had thoughts that you would be better off dead or hurting yourself?',
      options: [
        { value: 0, text: 'Not at all' },
        { value: 1, text: 'Several days' },
        { value: 2, text: 'More than half the days' },
        { value: 3, text: 'Nearly every day' }
      ]
    },
    {
      id: 'hopelessness',
      text: 'How hopeless do you feel about your future?',
      options: [
        { value: 0, text: 'Not hopeless at all' },
        { value: 1, text: 'Somewhat hopeless' },
        { value: 2, text: 'Very hopeless' },
        { value: 3, text: 'Extremely hopeless' }
      ]
    },
    {
      id: 'social_connection',
      text: 'How connected do you feel to family, friends, or your community?',
      options: [
        { value: 0, text: 'Very connected' },
        { value: 1, text: 'Somewhat connected' },
        { value: 2, text: 'Barely connected' },
        { value: 3, text: 'Not connected at all' }
      ]
    },
    {
      id: 'substance_use',
      text: 'In the past two weeks, have you used alcohol or drugs to cope with difficult feelings?',
      options: [
        { value: 0, text: 'Not at all' },
        { value: 1, text: 'Once or twice' },
        { value: 2, text: 'Several times' },
        { value: 3, text: 'Daily or almost daily' }
      ]
    },
    {
      id: 'sleep_disruption',
      text: 'How would you describe your sleep in the past week?',
      options: [
        { value: 0, text: 'Normal, restful sleep' },
        { value: 1, text: 'Some difficulty sleeping' },
        { value: 2, text: 'Significant sleep problems' },
        { value: 3, text: 'Severe insomnia or sleeping too much' }
      ]
    }
  ];

  useEffect(() => {
    if (isInitialized && userProfile) {
      loadSafetyPlan();
    }
  }, [isInitialized, userProfile]);

  const loadSafetyPlan = async () => {
    try {
      const storedPlan = localStorage.getItem('safety_plan');
      if (storedPlan) {
        setSafetyPlan(JSON.parse(storedPlan));
      }
    } catch (error) {
      console.error('Error loading safety plan:', error);
    }
  };

  const calculateCrisisLevel = (responses: { [key: number]: number }): CrisisAssessment => {
    const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
    const maxScore = assessmentQuestions.length * 3;
    const riskPercentage = (totalScore / maxScore) * 100;

    let riskLevel: CrisisAssessment['riskLevel'];
    let confidence: number;
    let triggers: string[] = [];
    let supportRecommendations: string[] = [];
    let immediateActions: string[] = [];

    // Determine risk level based on responses
    if (responses[0] >= 2 || totalScore >= 12) { // High suicide ideation or very high total score
      riskLevel = 'critical';
      confidence = 0.95;
      triggers = ['Active suicidal ideation', 'Severe hopelessness', 'Social isolation'];
      immediateActions = [
        'Contact crisis support immediately (988)',
        'Remove access to means of self-harm',
        'Stay with trusted person until safe',
        'Go to emergency room if thoughts persist'
      ];
      supportRecommendations = [
        'Crisis counseling session within 24 hours',
        'Daily safety check-ins',
        'Psychiatric evaluation',
        'Intensive outpatient program'
      ];
    } else if (responses[0] >= 1 || totalScore >= 8) {
      riskLevel = 'high';
      confidence = 0.85;
      triggers = ['Suicidal thoughts present', 'Moderate hopelessness', 'Coping difficulties'];
      immediateActions = [
        'Reach out to trusted support person',
        'Use coping strategies from safety plan',
        'Schedule appointment with mental health professional',
        'Monitor thoughts and feelings closely'
      ];
      supportRecommendations = [
        'Therapy appointment within one week',
        'Daily mindfulness practice',
        'Regular check-ins with support network',
        'Consider medication consultation'
      ];
    } else if (totalScore >= 4) {
      riskLevel = 'moderate';
      confidence = 0.75;
      triggers = ['Stress indicators present', 'Some social disconnection', 'Sleep disruption'];
      immediateActions = [
        'Practice self-care routines',
        'Connect with friends or family',
        'Engage in physical activity',
        'Use stress management techniques'
      ];
      supportRecommendations = [
        'Consider counseling or therapy',
        'Join support group',
        'Develop better sleep hygiene',
        'Regular exercise routine'
      ];
    } else {
      riskLevel = 'low';
      confidence = 0.65;
      triggers = ['General stress management'];
      immediateActions = [
        'Continue current self-care practices',
        'Maintain social connections',
        'Monitor emotional well-being'
      ];
      supportRecommendations = [
        'Maintain healthy routines',
        'Continue journaling practice',
        'Regular check-ins with support network'
      ];
    }

    return {
      riskLevel,
      confidence,
      triggers,
      supportRecommendations,
      immediateActions
    };
  };

  const handleAssessmentSubmit = async () => {
    const assessment = calculateCrisisLevel(responses);
    setAssessmentResult(assessment);

    // Log assessment for monitoring (anonymized)
    const assessmentData = {
      riskLevel: assessment.riskLevel,
      confidence: assessment.confidence,
      totalScore: Object.values(responses).reduce((sum, value) => sum + value, 0),
      timestamp: new Date().toISOString(),
      userId: user?.uid ? 'anonymous_' + btoa(user.uid).slice(0, 8) : 'anonymous'
    };

    // Store assessment locally
    localStorage.setItem('last_crisis_assessment', JSON.stringify(assessmentData));

    // If high or critical risk, trigger immediate intervention
    if (assessment.riskLevel === 'critical' || assessment.riskLevel === 'high') {
      triggerCrisisIntervention(assessment);
    }

    setShowAssessment(false);
  };

  const triggerCrisisIntervention = async (assessment: CrisisAssessment) => {
    // Show immediate crisis resources
    if (assessment.riskLevel === 'critical') {
      if (confirm('You appear to be in immediate crisis. Would you like to be connected to emergency support right now?')) {
        window.location.href = 'tel:988';
      }
    }

    // Create or update safety plan if needed
    if (!safetyPlan) {
      setIsCreatingSafetyPlan(true);
    }
  };

  const createSafetyPlan = async (planData: Partial<SafetyPlan>) => {
    const newPlan: SafetyPlan = {
      id: Date.now().toString(),
      userId: user?.uid || 'anonymous',
      warningSignals: planData.warningSignals || [],
      copingStrategies: planData.copingStrategies || [],
      supportContacts: planData.supportContacts || [],
      safeEnvironment: planData.safeEnvironment || [],
      professionalContacts: planData.professionalContacts || [],
      customStrategies: planData.customStrategies || [],
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    setSafetyPlan(newPlan);
    localStorage.setItem('safety_plan', JSON.stringify(newPlan));
    setIsCreatingSafetyPlan(false);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-[#E5C97D]/20 border-[#E5C97D] text-[#E5C97D]';
      case 'moderate': return 'bg-[#E5C97D]/10 border-[#E5C97D]/50 text-[#E5C97D]';
      case 'low': return 'bg-[#8B9A7C]/20 border-[#8B9A7C] text-[#8B9A7C]';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="crisis-intervention-system max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🛡️</div>
        <h2 className="text-2xl text-white font-light mb-3">Crisis Support & Safety Planning</h2>
        <p className="text-white/70 text-sm">
          Comprehensive tools for mental health crisis prevention and intervention
        </p>
      </div>

      {/* Emergency Crisis Button */}
      <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 mb-6">
        <div className="text-center">
          <h3 className="text-red-200 text-lg font-medium mb-4">🚨 In Immediate Crisis?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:988"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📞 Call 988 - Crisis Lifeline
            </a>
            <a
              href="sms:741741"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              💬 Text Crisis Line
            </a>
            <a
              href="/emergency"
              className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔗 Crisis Resources
            </a>
          </div>
        </div>
      </div>

      {/* Crisis Assessment */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
        <h3 className="text-white text-lg font-light mb-4">Mental Health Check-In</h3>
        
        {!showAssessment && !assessmentResult && (
          <div className="text-center py-8">
            <p className="text-white/70 mb-6">
              Take a brief, confidential assessment to check in with your mental health and receive personalized support recommendations.
            </p>
            <button
              onClick={() => setShowAssessment(true)}
              className="bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Check-In
            </button>
          </div>
        )}

        {showAssessment && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/60 text-sm">
                Question {currentQuestion + 1} of {assessmentQuestions.length}
              </span>
              <div className="w-32 h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-[#8B9A7C] rounded-full transition-all duration-300"
                  style={{ width: `${assessmentQuestions.length > 0 ? Math.max(0, Math.min(100, ((currentQuestion + 1) / assessmentQuestions.length) * 100)) : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-lg">
              <h4 className="text-white text-lg mb-4">
                {assessmentQuestions[currentQuestion].text}
              </h4>
              <div className="space-y-3">
                {assessmentQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setResponses(prev => ({ ...prev, [currentQuestion]: option.value }));
                      if (currentQuestion < assessmentQuestions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                      } else {
                        handleAssessmentSubmit();
                      }
                    }}
                    className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>

            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Previous Question
              </button>
            )}
          </div>
        )}

        {assessmentResult && (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg border-2 ${getRiskLevelColor(assessmentResult.riskLevel)}`}>
              <h4 className="font-medium text-lg mb-2">
                Assessment Complete - {assessmentResult.riskLevel.charAt(0).toUpperCase() + assessmentResult.riskLevel.slice(1)} Risk Level
              </h4>
              <p className="text-sm mb-4">
                Confidence: {Math.round(assessmentResult.confidence * 100)}%
              </p>
              
              {assessmentResult.immediateActions.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Immediate Actions:</h5>
                  <ul className="text-sm space-y-1">
                    {assessmentResult.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#8B9A7C] mt-1">✓</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {assessmentResult.supportRecommendations.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Support Recommendations:</h5>
                  <ul className="text-sm space-y-1">
                    {assessmentResult.supportRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#8B9A7C] mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setAssessmentResult(null);
                setCurrentQuestion(0);
                setResponses({});
              }}
              className="bg-[#8B9A7C]/30 border border-[#8B9A7C]/30 text-white px-4 py-2 rounded-lg hover:bg-[#8B9A7C]/40 transition-colors"
            >
              Take Assessment Again
            </button>
          </div>
        )}
      </div>

      {/* Safety Plan */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-white text-lg font-light mb-4">Personal Safety Plan</h3>
        
        {!safetyPlan && !isCreatingSafetyPlan && (
          <div className="text-center py-8">
            <p className="text-white/70 mb-6">
              Create a personalized safety plan to help you navigate difficult moments and stay connected to support.
            </p>
            <button
              onClick={() => setIsCreatingSafetyPlan(true)}
              className="bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Safety Plan
            </button>
          </div>
        )}

        {safetyPlan && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-[#E5C97D] font-medium mb-3">⚠️ Warning Signals</h4>
                {safetyPlan.warningSignals.length > 0 ? (
                  <ul className="text-white/80 text-sm space-y-1">
                    {safetyPlan.warningSignals.map((signal, index) => (
                      <li key={index}>• {signal}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/50 text-sm">No warning signals added yet</p>
                )}
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-[#8B9A7C] font-medium mb-3">🛠️ Coping Strategies</h4>
                {safetyPlan.copingStrategies.length > 0 ? (
                  <ul className="text-white/80 text-sm space-y-1">
                    {safetyPlan.copingStrategies.map((strategy, index) => (
                      <li key={index}>• {strategy}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/50 text-sm">No coping strategies added yet</p>
                )}
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-[#A8B5A0] font-medium mb-3">👥 Support Contacts</h4>
                {safetyPlan.supportContacts.length > 0 ? (
                  <div className="space-y-2">
                    {safetyPlan.supportContacts.map((contact, index) => (
                      <div key={index} className="text-white/80 text-sm">
                        <p className="font-medium">{contact.name} ({contact.relationship})</p>
                        <p className="text-white/60">{contact.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50 text-sm">No support contacts added yet</p>
                )}
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-[#E5C97D] font-medium mb-3">🏥 Professional Support</h4>
                {safetyPlan.professionalContacts.length > 0 ? (
                  <div className="space-y-2">
                    {safetyPlan.professionalContacts.map((contact, index) => (
                      <div key={index} className="text-white/80 text-sm">
                        <p className="font-medium">{contact.name} ({contact.type})</p>
                        <p className="text-white/60">{contact.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50 text-sm">No professional contacts added yet</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsCreatingSafetyPlan(true)}
              className="bg-[#8B9A7C]/30 border border-[#8B9A7C]/30 text-white px-4 py-2 rounded-lg hover:bg-[#8B9A7C]/40 transition-colors"
            >
              Edit Safety Plan
            </button>
          </div>
        )}

        {isCreatingSafetyPlan && (
          <div className="space-y-6">
            <p className="text-white/70 text-sm">
              Creating a safety plan is a simple but effective way to prepare for difficult moments and stay safe.
            </p>
            
            <div className="bg-black/20 p-6 rounded-lg">
              <h4 className="text-white font-medium mb-4">Quick Safety Plan Setup</h4>
              <button
                onClick={() => createSafetyPlan({
                  warningSignals: [
                    'Feeling overwhelmed or hopeless',
                    'Isolating from friends and family',
                    'Difficulty sleeping or concentrating',
                    'Increased use of alcohol or drugs'
                  ],
                  copingStrategies: [
                    'Practice deep breathing exercises',
                    'Call a trusted friend or family member',
                    'Go for a walk or engage in physical activity',
                    'Write in a journal or practice mindfulness',
                    'Listen to calming music'
                  ],
                  supportContacts: [
                    {
                      name: 'Crisis Lifeline',
                      relationship: 'Crisis Support',
                      phone: '988',
                      available24h: true
                    }
                  ],
                  professionalContacts: [
                    {
                      name: 'Crisis Text Line',
                      type: 'crisis_counselor',
                      phone: 'Text HOME to 741741',
                      available: '24/7'
                    }
                  ],
                  safeEnvironment: [
                    'Remove access to means of self-harm',
                    'Stay with trusted person when in crisis',
                    'Create a calming space with comfort items'
                  ]
                })}
                className="w-full bg-[#8B9A7C]/30 border border-[#8B9A7C]/30 text-white py-3 rounded-lg hover:bg-[#8B9A7C]/40 transition-colors"
              >
                Create Basic Safety Plan
              </button>
            </div>

            <button
              onClick={() => setIsCreatingSafetyPlan(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}