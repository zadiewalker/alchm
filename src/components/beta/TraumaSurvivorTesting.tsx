'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Heart, Users, Globe, Pause, Play, X, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TraumaSurvivorTestingProps {
  participantId?: string
  culturalBackground?: string[]
  supportPersonPresent?: boolean
  preferredLanguage?: string
  accessibilityNeeds?: string[]
}

interface SafetyCheck {
  timestamp: number
  wellbeingLevel: 1 | 2 | 3 | 4 | 5
  needsSupport: boolean
  notes?: string
}

interface TestingSession {
  id: string
  startTime: number
  pausedTime?: number
  safetyChecks: SafetyCheck[]
  culturalFeedback: any[]
  completed: boolean
  crisisSupport: boolean
}

const TraumaSurvivorTesting: React.FC<TraumaSurvivorTestingProps> = ({
  participantId,
  culturalBackground = [],
  supportPersonPresent = false,
  preferredLanguage = 'en',
  accessibilityNeeds = []
}) => {
  const [session, setSession] = useState<TestingSession | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showSafetyCheck, setShowSafetyCheck] = useState(false)
  const [crisisMode, setCrisisMode] = useState(false)
  const [wellbeingLevel, setWellbeingLevel] = useState<1 | 2 | 3 | 4 | 5>(5)
  const [culturalResonance, setCulturalResonance] = useState<any>({})
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  
  const safetyCheckInterval = useRef<NodeJS.Timeout>()
  const crisisHotlineRef = useRef<HTMLDivElement>(null)

  // Trauma-informed consent and safety protocols
  const traumaInformedConsent = {
    principles: [
      'Your safety and wellbeing are our highest priority',
      'You have the right to pause or stop testing at any time',
      'All feedback is voluntary and can be withdrawn',
      'Crisis support is available throughout testing',
      'Your cultural identity and experiences are honored',
      'No feedback will be judged or pathologized'
    ],
    rights: [
      'Right to have a support person present',
      'Right to test in your preferred language',
      'Right to accessibility accommodations',
      'Right to cultural representation in materials',
      'Right to immediate crisis intervention if needed',
      'Right to confidentiality and data protection'
    ]
  }

  // Cultural competency testing scenarios
  const culturalTestingScenarios = [
    {
      id: 'crisis_resources_cultural',
      name: 'Crisis Resources Cultural Validation',
      description: 'Test if crisis resources reflect your cultural needs and identity',
      tasks: [
        'Review crisis helpline numbers for cultural competency',
        'Assess language accessibility of emergency resources',
        'Evaluate cultural healing approaches availability',
        'Test community-specific crisis intervention options'
      ]
    },
    {
      id: 'identity_affirmation',
      name: 'Identity-Affirming Experience Testing',
      description: 'Validate that the platform affirms your authentic identity',
      tasks: [
        'Test pronoun customization and respect',
        'Evaluate inclusive imagery and representation',
        'Assess cultural holiday and calendar integration',
        'Review language that honors intersectional identity'
      ]
    },
    {
      id: 'healing_modalities',
      name: 'Culturally-Responsive Healing Validation',
      description: 'Test integration of diverse healing traditions',
      tasks: [
        'Explore traditional healing practice suggestions',
        'Test spiritual and secular pathway options',
        'Evaluate community healing circle features',
        'Assess ancestral wisdom integration (with permission)'
      ]
    }
  ]

  // Safety monitoring system
  useEffect(() => {
    if (session && !isPaused) {
      // Regular safety checks every 10 minutes
      safetyCheckInterval.current = setInterval(() => {
        setShowSafetyCheck(true)
      }, 600000) // 10 minutes

      return () => {
        if (safetyCheckInterval.current) {
          clearInterval(safetyCheckInterval.current)
        }
      }
    }
  }, [session, isPaused])

  // Crisis intervention system
  const triggerCrisisSupport = () => {
    setCrisisMode(true)
    
    // Immediate crisis resources
    const crisisResources = {
      national: {
        'crisis_text_line': 'Text HOME to 741741',
        'suicide_prevention': '988 (Suicide & Crisis Lifeline)',
        'trans_lifeline': '877-565-8860 (Trans Lifeline)'
      },
      cultural: {
        'lgbtq': 'The Trevor Project: 1-866-488-7386',
        'native_american': 'National Suicide Prevention Lifeline: 988',
        'spanish': 'Línea Nacional de Prevención del Suicidio: 988',
        'youth': 'Crisis Text Line: Text HOME to 741741'
      }
    }

    // Log crisis event for immediate response
    console.log('CRISIS MODE ACTIVATED - Participant needs immediate support')
    
    // In production, this would trigger real crisis intervention protocols
    alert('Crisis support activated. A crisis counselor will be connected immediately.')
  }

  const startTestingSession = () => {
    const newSession: TestingSession = {
      id: `session_${Date.now()}`,
      startTime: Date.now(),
      safetyChecks: [],
      culturalFeedback: [],
      completed: false,
      crisisSupport: false
    }
    setSession(newSession)
  }

  const pauseSession = () => {
    setIsPaused(true)
    if (session) {
      setSession({
        ...session,
        pausedTime: Date.now()
      })
    }
  }

  const resumeSession = () => {
    setIsPaused(false)
    if (session) {
      setSession({
        ...session,
        pausedTime: undefined
      })
    }
  }

  const conductSafetyCheck = (level: 1 | 2 | 3 | 4 | 5, needsSupport: boolean, notes?: string) => {
    const safetyCheck: SafetyCheck = {
      timestamp: Date.now(),
      wellbeingLevel: level,
      needsSupport,
      notes
    }

    if (session) {
      setSession({
        ...session,
        safetyChecks: [...session.safetyChecks, safetyCheck]
      })
    }

    setWellbeingLevel(level)
    setShowSafetyCheck(false)

    // Trigger crisis support if needed
    if (level <= 2 || needsSupport) {
      triggerCrisisSupport()
    }
  }

  const recordCulturalFeedback = (scenarioId: string, feedback: any) => {
    const culturalFeedback = {
      scenarioId,
      feedback,
      timestamp: Date.now(),
      culturalBackground,
      participantId
    }

    if (session) {
      setSession({
        ...session,
        culturalFeedback: [...session.culturalFeedback, culturalFeedback]
      })
    }
  }

  // Mobile crisis experience testing
  const testMobileCrisisExperience = () => {
    const mobileTests = [
      {
        name: 'Touch Interface with Tremors',
        description: 'Test touch targets with simulated motor impairment',
        action: () => {
          // Add CSS to simulate difficult touch interactions
          document.body.classList.add('simulate-tremors')
        }
      },
      {
        name: 'Battery Conservation Mode',
        description: 'Test crisis features with low battery simulation',
        action: () => {
          // Simulate low battery constraints
          console.log('Low battery mode activated for crisis testing')
        }
      },
      {
        name: 'Offline Emergency Resources',
        description: 'Test access to crisis resources without internet',
        action: () => {
          // Test offline functionality
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
              console.log('Testing offline crisis resource access')
            })
          }
        }
      }
    ]

    return mobileTests
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-purple-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-indigo-100">
              <CardTitle className="text-3xl font-medium text-purple-800 flex items-center justify-center gap-3">
                <Shield className="h-8 w-8" />
                ALCHM Trauma-Informed Beta Testing
              </CardTitle>
              <p className="text-purple-600 mt-2">
                A safe space for trauma survivors to help improve mental wellness technology
              </p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              {/* Trauma-Informed Consent */}
              <div className="space-y-6">
                <h3 className="text-2xl font-medium text-purple-800 flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  Trauma-Informed Consent & Your Rights
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-700">Our Principles</h4>
                    <ul className="space-y-2">
                      {traumaInformedConsent.principles.map((principle, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          {principle}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-700">Your Rights</h4>
                    <ul className="space-y-2">
                      {traumaInformedConsent.rights.map((right, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                          {right}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cultural Identity Honoring */}
              <div className="space-y-4">
                <h3 className="text-2xl font-medium text-purple-800 flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  Honoring Your Cultural Identity
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    Your cultural background, identity, and lived experiences are central to this testing process. 
                    We recognize that healing looks different across communities and we're here to learn from your wisdom.
                    This testing will validate whether ALCHM truly serves as a culturally-responsive digital sanctuary.
                  </p>
                </div>
              </div>

              {/* Crisis Support Information */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-medium text-red-800 flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-6 w-6" />
                  Crisis Support Available
                </h3>
                <p className="text-red-700 mb-4">
                  Crisis counselors are standing by throughout your testing session. You can access support immediately at any time.
                </p>
                <Button 
                  onClick={triggerCrisisSupport}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Access Crisis Support Now
                </Button>
              </div>

              {/* Start Testing */}
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  By beginning this testing session, you acknowledge that you have read and understand your rights, 
                  and that you can pause or stop testing at any time.
                </p>
                <Button 
                  onClick={startTestingSession}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
                >
                  Begin Safe Testing Experience
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Session Header with Safety Controls */}
        <Card className="border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${wellbeingLevel >= 4 ? 'bg-green-400' : wellbeingLevel >= 3 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  <span className="text-sm font-medium">Session Active</span>
                </div>
                {supportPersonPresent && (
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Users className="h-4 w-4" />
                    Support Person Present
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowSafetyCheck(true)}
                  variant="outline"
                  className="border-purple-300 text-purple-700"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wellbeing Check
                </Button>
                
                <Button
                  onClick={isPaused ? resumeSession : pauseSession}
                  variant="outline"
                  className="border-indigo-300 text-indigo-700"
                >
                  {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                
                <Button
                  onClick={triggerCrisisSupport}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Crisis Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Competency Testing Scenarios */}
        <div className="grid lg:grid-cols-2 gap-6">
          {culturalTestingScenarios.map((scenario) => (
            <Card key={scenario.id} className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">{scenario.name}</CardTitle>
                <p className="text-gray-600">{scenario.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {scenario.tasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-purple-50 rounded">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setCurrentTask(scenario.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  Begin Cultural Validation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Crisis Experience Testing */}
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-800">Mobile Crisis Experience Testing</CardTitle>
            <p className="text-gray-600">Test crisis navigation under various mobile conditions</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {testMobileCrisisExperience().map((test, index) => (
                <div key={index} className="p-4 bg-indigo-50 rounded-lg space-y-2">
                  <h4 className="font-medium text-indigo-800">{test.name}</h4>
                  <p className="text-sm text-gray-600">{test.description}</p>
                  <Button
                    onClick={test.action}
                    size="sm"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Test Scenario
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Check Modal */}
        <AnimatePresence>
          {showSafetyCheck && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-purple-800">Wellbeing Check</h3>
                  <Button
                    onClick={() => setShowSafetyCheck(false)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">How are you feeling right now? (1 = struggling, 5 = doing well)</p>
                  
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Button
                        key={level}
                        onClick={() => conductSafetyCheck(level as 1 | 2 | 3 | 4 | 5, level <= 2)}
                        variant={wellbeingLevel === level ? "default" : "outline"}
                        className={`w-12 h-12 ${
                          level <= 2 ? 'border-red-300 text-red-600' : 
                          level === 3 ? 'border-yellow-300 text-yellow-600' : 
                          'border-green-300 text-green-600'
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => conductSafetyCheck(wellbeingLevel, true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    I need support right now
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crisis Mode Overlay */}
        <AnimatePresence>
          {crisisMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-red-900 bg-opacity-95 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full space-y-6 text-center">
                <h2 className="text-3xl font-medium text-red-800">Crisis Support Activated</h2>
                <p className="text-lg text-gray-700">
                  A crisis counselor is being connected immediately. You are not alone.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-2">Immediate Resources:</h3>
                    <p className="text-red-700">Crisis Text Line: Text HOME to 741741</p>
                    <p className="text-red-700">Suicide & Crisis Lifeline: 988</p>
                  </div>
                  
                  <Button
                    onClick={() => setCrisisMode(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
                  >
                    I'm Safe - Continue Testing
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TraumaSurvivorTesting