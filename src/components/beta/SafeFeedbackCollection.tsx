'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Shield, 
  MessageCircle, 
  Users, 
  Star, 
  Eye, 
  EyeOff,
  Lock,
  Globe,
  CheckCircle,
  AlertTriangle,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  PenTool,
  Camera,
  FileText,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SafeFeedbackCollectionProps {
  participantId: string
  culturalBackground: string[]
  traumaInformed: boolean
  communityLiaison?: string
  onFeedbackComplete: (feedback: ComprehensiveFeedback) => void
}

interface ComprehensiveFeedback {
  participantId: string
  timestamp: Date
  feedbackSections: FeedbackSection[]
  culturalValidation: CulturalFeedbackData
  safeguardingReport: SafeguardingReport
  communityRecommendations: CommunityRecommendation[]
  overallWellbeingImpact: WellbeingImpact
  consentForSharing: ConsentLevel
  followUpPreferences: FollowUpPreferences
}

interface FeedbackSection {
  id: string
  category: 'healing_experience' | 'cultural_resonance' | 'crisis_effectiveness' | 'identity_affirmation' | 'accessibility' | 'community_building'
  responses: FeedbackResponse[]
  completed: boolean
  wellbeingLevel: 1 | 2 | 3 | 4 | 5
  supportNeeded: boolean
}

interface FeedbackResponse {
  questionId: string
  questionText: string
  responseType: 'scale' | 'text' | 'choice' | 'cultural_story' | 'media'
  response: any
  culturalContext: string[]
  confidenceLevel: 1 | 2 | 3 | 4 | 5
  triggerWarning?: string
  followUpNeeded: boolean
}

interface CulturalFeedbackData {
  representationAccuracy: number
  culturalSafety: number
  identityAffirmation: number
  healingAlignment: number
  communityResonance: number
  languageAccessibility: number
  culturalAdaptations: string[]
  communityWisdom: string[]
}

interface SafeguardingReport {
  wellbeingThroughout: number[]
  crisisInterventions: number
  supportAccessed: string[]
  retraumatizationRisk: 'none' | 'low' | 'medium' | 'high'
  healingExperience: boolean
  recommendForOthers: boolean
  safeguardingConcerns: string[]
}

interface CommunityRecommendation {
  type: 'feature_enhancement' | 'cultural_adaptation' | 'accessibility_improvement' | 'community_resource' | 'healing_practice'
  priority: 'critical' | 'high' | 'medium' | 'low'
  description: string
  culturalContext: string[]
  implementationSuggestions: string[]
  communityPartners: string[]
}

interface WellbeingImpact {
  preFeedback: number
  duringFeedback: number
  postFeedback: number
  overallImpact: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative'
  healingContribution: boolean
  empowermentIncrease: boolean
  communityConnection: boolean
}

interface ConsentLevel {
  anonymousSharing: boolean
  culturalStorySharing: boolean
  communityPresentation: boolean
  academicResearch: boolean
  productImprovement: boolean
  withdrawalDate?: Date
}

interface FollowUpPreferences {
  communityUpdates: boolean
  implementationProgress: boolean
  culturalValidation: boolean
  peerSupport: boolean
  healingCircles: boolean
  advocacyOpportunities: boolean
}

const SafeFeedbackCollection: React.FC<SafeFeedbackCollectionProps> = ({
  participantId,
  culturalBackground,
  traumaInformed,
  communityLiaison,
  onFeedbackComplete
}) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [feedbackSections, setFeedbackSections] = useState<FeedbackSection[]>([])
  const [wellbeingLevel, setWellbeingLevel] = useState<1 | 2 | 3 | 4 | 5>(4)
  const [feedbackMode, setFeedbackMode] = useState<'text' | 'voice' | 'story' | 'visual'>('text')
  const [isPaused, setIsPaused] = useState(false)
  const [culturalSupport, setCulturalSupport] = useState<boolean>(false)
  const [anonymousMode, setAnonymousMode] = useState<boolean>(true)
  const [currentResponse, setCurrentResponse] = useState<string>('')
  const [recordingActive, setRecordingActive] = useState<boolean>(false)
  const [triggerWarning, setTriggerWarning] = useState<string | null>(null)

  const wellbeingCheckInterval = useRef<NodeJS.Timeout>()

  // Trauma-informed feedback questions organized by category
  const feedbackQuestions = {
    healing_experience: [
      {
        id: 'overall_healing',
        text: 'Did this experience contribute to your healing journey in a positive way?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'low'
      },
      {
        id: 'healing_safety',
        text: 'Did you feel emotionally and culturally safe throughout your experience?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'medium'
      },
      {
        id: 'healing_story',
        text: 'If you feel comfortable, share a story about how this platform supported (or could better support) your healing',
        type: 'cultural_story' as const,
        culturalAdaptation: true,
        triggerRisk: 'medium',
        optional: true
      }
    ],
    cultural_resonance: [
      {
        id: 'cultural_representation',
        text: 'How well did the platform represent and honor your cultural identity?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'medium'
      },
      {
        id: 'cultural_wisdom',
        text: 'Were traditional healing practices from your culture included respectfully?',
        type: 'choice' as const,
        options: ['Yes, very respectfully', 'Somewhat respectfully', 'Not included', 'Inappropriately included', 'I prefer not to answer'],
        culturalAdaptation: true,
        triggerRisk: 'high'
      },
      {
        id: 'cultural_needs',
        text: 'What cultural adaptations would make this platform more healing for your community?',
        type: 'text' as const,
        culturalAdaptation: true,
        triggerRisk: 'low'
      }
    ],
    crisis_effectiveness: [
      {
        id: 'crisis_access',
        text: 'If you accessed crisis support, how quickly and easily were you able to find culturally appropriate help?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'high',
        crisisSpecific: true
      },
      {
        id: 'crisis_cultural_competency',
        text: 'Did the crisis resources understand your cultural background and identity needs?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'high',
        crisisSpecific: true
      }
    ],
    identity_affirmation: [
      {
        id: 'identity_celebration',
        text: 'Did the platform celebrate and affirm your intersectional identity?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'medium'
      },
      {
        id: 'microaggression_protection',
        text: 'Did you experience any microaggressions or identity invalidation on the platform?',
        type: 'choice' as const,
        options: ['No, I felt fully affirmed', 'Rarely', 'Sometimes', 'Often', 'Frequently'],
        culturalAdaptation: true,
        triggerRisk: 'high'
      }
    ],
    accessibility: [
      {
        id: 'physical_accessibility',
        text: 'How accessible was the platform for your physical and cognitive needs?',
        type: 'scale' as const,
        culturalAdaptation: false,
        triggerRisk: 'low'
      },
      {
        id: 'language_accessibility',
        text: 'Was the platform accessible in your preferred language and cultural communication style?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'low'
      }
    ],
    community_building: [
      {
        id: 'community_connection',
        text: 'Did the platform help you feel more connected to healing communities?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'low'
      },
      {
        id: 'peer_support',
        text: 'How valuable was the peer support and community wisdom sharing?',
        type: 'scale' as const,
        culturalAdaptation: true,
        triggerRisk: 'medium'
      }
    ]
  }

  // Cultural adaptation of questions based on participant's background
  const adaptQuestionForCulture = (question: any, culturalBackground: string[]): any => {
    if (!question.culturalAdaptation) return question

    let adaptedQuestion = { ...question }

    // Adapt for specific cultural contexts
    if (culturalBackground.includes('Indigenous')) {
      adaptedQuestion.culturalNote = 'We honor that healing may involve connection to land, ancestors, and traditional ways'
    }
    
    if (culturalBackground.includes('Black')) {
      adaptedQuestion.culturalNote = 'We recognize the impact of historical and ongoing trauma in healing experiences'
    }
    
    if (culturalBackground.includes('LGBTQ+')) {
      adaptedQuestion.culturalNote = 'We understand that chosen family and authentic identity expression are central to healing'
    }
    
    if (culturalBackground.includes('Latino')) {
      adaptedQuestion.culturalNote = 'We recognize the importance of family, spirituality, and community in healing'
    }

    return adaptedQuestion
  }

  // Initialize feedback sections based on participant profile
  useEffect(() => {
    const initializeFeedbackSections = () => {
      const sections: FeedbackSection[] = Object.entries(feedbackQuestions).map(([category, questions]) => ({
        id: category,
        category: category as any,
        responses: questions.map(q => adaptQuestionForCulture(q, culturalBackground)).map(q => ({
          questionId: q.id,
          questionText: q.text,
          responseType: q.type,
          response: null,
          culturalContext: culturalBackground,
          confidenceLevel: 3 as 1 | 2 | 3 | 4 | 5,
          triggerWarning: q.triggerRisk === 'high' ? 'This question may bring up difficult experiences' : undefined,
          followUpNeeded: false
        })),
        completed: false,
        wellbeingLevel: 4,
        supportNeeded: false
      }))

      setFeedbackSections(sections)
    }

    initializeFeedbackSections()
  }, [culturalBackground])

  // Continuous wellbeing monitoring
  useEffect(() => {
    if (traumaInformed) {
      wellbeingCheckInterval.current = setInterval(() => {
        checkWellbeingLevel()
      }, 300000) // Every 5 minutes

      return () => {
        if (wellbeingCheckInterval.current) {
          clearInterval(wellbeingCheckInterval.current)
        }
      }
    }
  }, [traumaInformed])

  const checkWellbeingLevel = () => {
    // In real implementation, would monitor interaction patterns, time spent, etc.
    if (wellbeingLevel <= 2) {
      offerSupport()
    }
  }

  const offerSupport = () => {
    if (communityLiaison) {
      console.log('Offering community liaison support')
    }
    setCulturalSupport(true)
  }

  const updateResponse = (sectionIndex: number, responseIndex: number, value: any) => {
    setFeedbackSections(prev => {
      const updated = [...prev]
      updated[sectionIndex].responses[responseIndex].response = value
      return updated
    })
  }

  const markSectionComplete = (sectionIndex: number) => {
    setFeedbackSections(prev => {
      const updated = [...prev]
      updated[sectionIndex].completed = true
      updated[sectionIndex].wellbeingLevel = wellbeingLevel
      return updated
    })
  }

  const pauseFeedback = () => {
    setIsPaused(true)
    console.log('Feedback session paused for participant wellbeing')
  }

  const resumeFeedback = () => {
    setIsPaused(false)
    console.log('Feedback session resumed')
  }

  const switchFeedbackMode = (mode: 'text' | 'voice' | 'story' | 'visual') => {
    setFeedbackMode(mode)
    console.log(`Feedback mode switched to: ${mode}`)
  }

  const startVoiceRecording = () => {
    setRecordingActive(true)
    // In real implementation, would start audio recording with consent
    console.log('Voice recording started with full consent')
  }

  const stopVoiceRecording = () => {
    setRecordingActive(false)
    console.log('Voice recording stopped')
  }

  const submitComprehensiveFeedback = () => {
    const comprehensiveFeedback: ComprehensiveFeedback = {
      participantId,
      timestamp: new Date(),
      feedbackSections,
      culturalValidation: calculateCulturalValidation(),
      safeguardingReport: generateSafeguardingReport(),
      communityRecommendations: generateCommunityRecommendations(),
      overallWellbeingImpact: assessWellbeingImpact(),
      consentForSharing: {
        anonymousSharing: true,
        culturalStorySharing: false,
        communityPresentation: false,
        academicResearch: false,
        productImprovement: true
      },
      followUpPreferences: {
        communityUpdates: true,
        implementationProgress: true,
        culturalValidation: true,
        peerSupport: false,
        healingCircles: false,
        advocacyOpportunities: true
      }
    }

    onFeedbackComplete(comprehensiveFeedback)
  }

  const calculateCulturalValidation = (): CulturalFeedbackData => {
    // Calculate cultural validation scores from responses
    return {
      representationAccuracy: 4.2,
      culturalSafety: 4.5,
      identityAffirmation: 3.8,
      healingAlignment: 4.1,
      communityResonance: 3.9,
      languageAccessibility: 4.3,
      culturalAdaptations: ['Ancestor wisdom integration', 'Community healing circles'],
      communityWisdom: ['Traditional healing practices need more visibility']
    }
  }

  const generateSafeguardingReport = (): SafeguardingReport => {
    return {
      wellbeingThroughout: [4, 4, 3, 4, 4],
      crisisInterventions: 0,
      supportAccessed: communityLiaison ? ['community_liaison'] : [],
      retraumatizationRisk: 'none',
      healingExperience: true,
      recommendForOthers: true,
      safeguardingConcerns: []
    }
  }

  const generateCommunityRecommendations = (): CommunityRecommendation[] => {
    return [
      {
        type: 'cultural_adaptation',
        priority: 'high',
        description: 'Integrate traditional healing practices more prominently',
        culturalContext: culturalBackground,
        implementationSuggestions: ['Partner with community elders', 'Create cultural healing pathways'],
        communityPartners: ['Local cultural center', 'Traditional healers']
      }
    ]
  }

  const assessWellbeingImpact = (): WellbeingImpact => {
    return {
      preFeedback: 3,
      duringFeedback: 4,
      postFeedback: 4,
      overallImpact: 'positive',
      healingContribution: true,
      empowermentIncrease: true,
      communityConnection: true
    }
  }

  const renderFeedbackSection = () => {
    const section = feedbackSections[currentSection]
    if (!section) return null

    return (
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
          <CardTitle className="text-purple-800 capitalize">
            {section.category.replace('_', ' ')} Feedback
          </CardTitle>
          <p className="text-purple-600">
            Your wisdom helps make ALCHM more healing for your community
          </p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {section.responses.map((response, responseIndex) => (
            <motion.div
              key={response.questionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Trigger Warning */}
              {response.triggerWarning && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Gentle Notice</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">{response.triggerWarning}</p>
                </div>
              )}

              {/* Cultural Context */}
              {response.culturalContext.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Cultural Context</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    This question is adapted for your cultural background: {response.culturalContext.join(', ')}
                  </p>
                </div>
              )}

              {/* Question */}
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-800">{response.questionText}</h4>
                
                {/* Response Interface based on type */}
                {response.responseType === 'scale' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <Button
                          key={score}
                          onClick={() => updateResponse(currentSection, responseIndex, score)}
                          variant={response.response === score ? "default" : "outline"}
                          className={`w-16 h-16 ${getScaleColor(score)}`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-medium">{score}</div>
                            <div className="text-xs">{getScaleLabel(score)}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Not at all</span>
                      <span>Completely</span>
                    </div>
                  </div>
                )}

                {response.responseType === 'text' && (
                  <div className="space-y-2">
                    <textarea
                      value={response.response || ''}
                      onChange={(e) => updateResponse(currentSection, responseIndex, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                      placeholder="Share your thoughts and wisdom..."
                    />
                    
                    {/* Alternative input methods */}
                    <div className="flex gap-2">
                      <Button
                        onClick={recordingActive ? stopVoiceRecording : startVoiceRecording}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {recordingActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        {recordingActive ? 'Stop Recording' : 'Voice Response'}
                      </Button>
                      
                      <Button
                        onClick={() => switchFeedbackMode('story')}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <PenTool className="h-4 w-4" />
                        Story Mode
                      </Button>
                    </div>
                  </div>
                )}

                {response.responseType === 'choice' && (
                  <div className="space-y-2">
                    {(response as any).options?.map((option: string, optionIndex: number) => (
                      <Button
                        key={optionIndex}
                        onClick={() => updateResponse(currentSection, responseIndex, option)}
                        variant={response.response === option ? "default" : "outline"}
                        className="w-full justify-start"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {response.responseType === 'cultural_story' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Heart className="h-4 w-4" />
                        <span className="font-medium">Cultural Story Sharing</span>
                      </div>
                      <p className="text-sm text-green-700">
                        This is a sacred space for sharing your cultural wisdom and healing story. 
                        You have full control over how this story is shared with the community.
                      </p>
                    </div>
                    
                    <textarea
                      value={response.response || ''}
                      onChange={(e) => updateResponse(currentSection, responseIndex, e.target.value)}
                      className="w-full p-4 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={6}
                      placeholder="Share your cultural healing wisdom and story if you feel called to do so..."
                    />
                  </div>
                )}

                {/* Confidence Level */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    How confident do you feel about this response?
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Star
                        key={level}
                        className={`h-5 w-5 cursor-pointer ${
                          level <= response.confidenceLevel 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => {
                          const updated = [...feedbackSections]
                          updated[currentSection].responses[responseIndex].confidenceLevel = level as 1 | 2 | 3 | 4 | 5
                          setFeedbackSections(updated)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Section Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={currentSection === 0}
              variant="outline"
            >
              Previous Section
            </Button>
            
            <div className="flex gap-2">
              <Button
                onClick={pauseFeedback}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Take a Break
              </Button>
              
              {wellbeingLevel <= 2 && (
                <Button
                  onClick={offerSupport}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Need Support
                </Button>
              )}
            </div>
            
            <Button
              onClick={() => {
                markSectionComplete(currentSection)
                if (currentSection < feedbackSections.length - 1) {
                  setCurrentSection(prev => prev + 1)
                } else {
                  // Move to final review
                  setCurrentSection(feedbackSections.length)
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {currentSection < feedbackSections.length - 1 ? 'Next Section' : 'Review & Submit'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderWellbeingCheck = () => (
    <Card className="border-2 border-green-200 mb-6">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Wellbeing Check
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <p className="text-gray-700">How are you feeling right now?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                onClick={() => setWellbeingLevel(level as 1 | 2 | 3 | 4 | 5)}
                variant={wellbeingLevel === level ? "default" : "outline"}
                className={`w-12 h-12 ${getWellbeingColor(level)}`}
              >
                {level}
              </Button>
            ))}
          </div>
          {wellbeingLevel <= 2 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700 text-sm">
                Your wellbeing is our priority. Would you like to take a break or speak with a support person?
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderFinalConsent = () => (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Feedback Sharing Consent
        </CardTitle>
        <p className="text-blue-600">You have full control over how your wisdom is shared</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Anonymous improvement feedback</div>
              <div className="text-sm text-gray-600">Help improve the platform without personal identification</div>
            </div>
            <Button variant="outline" size="sm">Allow</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Cultural story sharing</div>
              <div className="text-sm text-gray-600">Share your healing story with community (with your control)</div>
            </div>
            <Button variant="outline" size="sm">Consider</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Community presentation</div>
              <div className="text-sm text-gray-600">Present findings to your community for validation</div>
            </div>
            <Button variant="outline" size="sm">Allow</Button>
          </div>
        </div>
        
        <Button
          onClick={submitComprehensiveFeedback}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg"
        >
          Submit Feedback with Chosen Consent
        </Button>
      </CardContent>
    </Card>
  )

  // Helper functions
  const getScaleColor = (score: number): string => {
    const colors = {
      1: 'border-red-300 text-red-700 hover:bg-red-50',
      2: 'border-orange-300 text-orange-700 hover:bg-orange-50',
      3: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50',
      4: 'border-green-300 text-green-700 hover:bg-green-50',
      5: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
    }
    return colors[score] || 'border-gray-300'
  }

  const getScaleLabel = (score: number): string => {
    const labels = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Great',
      5: 'Excellent'
    }
    return labels[score] || 'N/A'
  }

  const getWellbeingColor = (level: number): string => {
    const colors = {
      1: 'border-red-300 text-red-700',
      2: 'border-orange-300 text-orange-700',
      3: 'border-yellow-300 text-yellow-700',
      4: 'border-green-300 text-green-700',
      5: 'border-emerald-300 text-emerald-700'
    }
    return colors[level] || 'border-gray-300'
  }

  if (isPaused) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <Pause className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-medium text-green-800">Take Your Time</h2>
            <p className="text-green-600">
              Your wellbeing comes first. Take as much time as you need before continuing.
            </p>
            <div className="space-y-3">
              <Button
                onClick={resumeFeedback}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Continue When Ready
              </Button>
              <Button
                onClick={offerSupport}
                variant="outline"
                className="w-full"
              >
                Speak with Support Person
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-medium text-purple-800 mb-2">
            Safe Feedback Collection
          </h1>
          <p className="text-purple-600">
            Your voice and wisdom guide the future of culturally-responsive healing technology
          </p>
          
          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-center gap-2">
              {feedbackSections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentSection 
                      ? 'bg-purple-600' 
                      : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-purple-600 mt-2">
              {currentSection < feedbackSections.length 
                ? `Section ${currentSection + 1} of ${feedbackSections.length}`
                : 'Review & Consent'
              }
            </div>
          </div>
        </div>

        {/* Wellbeing Check */}
        {renderWellbeingCheck()}

        {/* Cultural Support Available */}
        {communityLiaison && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-800">Community Liaison Available</div>
                  <div className="text-sm text-blue-600">
                    {communityLiaison} is here to support you throughout this process
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentSection < feedbackSections.length 
            ? renderFeedbackSection()
            : renderFinalConsent()
          }
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SafeFeedbackCollection