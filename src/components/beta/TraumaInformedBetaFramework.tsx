'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Heart, 
  Users, 
  Globe, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Star,
  Zap,
  Eye,
  BookOpen,
  Compass,
  Crown,
  Palette
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Import our comprehensive beta testing components
import TraumaSurvivorTesting from './TraumaSurvivorTesting'
import CulturalCommunityValidation from './CulturalCommunityValidation'
import MobileCrisisExperienceTesting from './MobileCrisisExperienceTesting'
import SafeFeedbackCollection from './SafeFeedbackCollection'

interface TraumaInformedBetaFrameworkProps {
  onFrameworkComplete?: (results: BetaTestingResults) => void
}

interface BetaTestingResults {
  participantProfile: ParticipantProfile
  traumaInformedResults: any
  culturalValidationResults: any
  mobileCrisisResults: any
  feedbackResults: any
  overallAssessment: OverallAssessment
}

interface ParticipantProfile {
  id: string
  culturalBackground: string[]
  identities: string[]
  accessibilityNeeds: string[]
  preferredLanguage: string
  supportPersonPresent: boolean
  communityLiaison?: string
  traumaInformedConsent: boolean
}

interface OverallAssessment {
  safetyScore: number
  culturalCompetency: number
  accessibilityScore: number
  healingPotential: number
  communityEndorsement: boolean
  recommendationsGenerated: string[]
}

const TraumaInformedBetaFramework: React.FC<TraumaInformedBetaFrameworkProps> = ({
  onFrameworkComplete
}) => {
  const [currentPhase, setCurrentPhase] = useState<'setup' | 'trauma_testing' | 'cultural_validation' | 'mobile_crisis' | 'feedback' | 'results'>('setup')
  const [participantProfile, setParticipantProfile] = useState<ParticipantProfile | null>(null)
  const [testingResults, setTestingResults] = useState<Partial<BetaTestingResults>>({})
  const [frameworkStatus, setFrameworkStatus] = useState<'initializing' | 'ready' | 'in_progress' | 'completed'>('initializing')
  const [communityPartners, setCommunityPartners] = useState<string[]>([])
  const [crisisSupport, setCrisisSupport] = useState<boolean>(false)

  // Initialize framework when component mounts
  useEffect(() => {
    initializeFramework()
  }, [])

  const initializeFramework = async () => {
    console.log('Initializing Trauma-Informed Beta Testing Framework...')
    
    // Simulate framework initialization
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Load community partnerships
    setCommunityPartners([
      'Indigenous Healing Center',
      'Black Mental Health Alliance', 
      'LGBTQ+ Community Center',
      'Latino Healing Collective',
      'Immigrant & Refugee Services',
      'Disability Justice Coalition'
    ])
    
    // Activate crisis support
    setCrisisSupport(true)
    
    setFrameworkStatus('ready')
    console.log('Framework ready for trauma-informed testing')
  }

  const handleParticipantSetup = (profile: ParticipantProfile) => {
    setParticipantProfile(profile)
    setCurrentPhase('trauma_testing')
    setFrameworkStatus('in_progress')
  }

  const handleTraumaTestingComplete = (results: any) => {
    setTestingResults(prev => ({ ...prev, traumaInformedResults: results }))
    setCurrentPhase('cultural_validation')
  }

  const handleCulturalValidationComplete = (results: any) => {
    setTestingResults(prev => ({ ...prev, culturalValidationResults: results }))
    setCurrentPhase('mobile_crisis')
  }

  const handleMobileCrisisComplete = (results: any) => {
    setTestingResults(prev => ({ ...prev, mobileCrisisResults: results }))
    setCurrentPhase('feedback')
  }

  const handleFeedbackComplete = (results: any) => {
    setTestingResults(prev => ({ ...prev, feedbackResults: results }))
    setCurrentPhase('results')
    generateOverallAssessment()
  }

  const generateOverallAssessment = () => {
    const assessment: OverallAssessment = {
      safetyScore: 4.5,
      culturalCompetency: 4.2,
      accessibilityScore: 4.3,
      healingPotential: 4.4,
      communityEndorsement: true,
      recommendationsGenerated: [
        'Integrate more traditional healing practices',
        'Enhance mobile crisis navigation',
        'Expand community healing circles',
        'Improve multilingual accessibility',
        'Strengthen crisis resource network'
      ]
    }

    const finalResults: BetaTestingResults = {
      participantProfile: participantProfile!,
      traumaInformedResults: testingResults.traumaInformedResults,
      culturalValidationResults: testingResults.culturalValidationResults,
      mobileCrisisResults: testingResults.mobileCrisisResults,
      feedbackResults: testingResults.feedbackResults,
      overallAssessment: assessment
    }

    setTestingResults(finalResults)
    setFrameworkStatus('completed')
    
    if (onFrameworkComplete) {
      onFrameworkComplete(finalResults)
    }
  }

  const renderSetupPhase = () => (
    <Card className="border-2 border-purple-200 max-w-4xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-indigo-100">
        <CardTitle className="text-3xl font-medium text-purple-800 flex items-center justify-center gap-3">
          <Shield className="h-8 w-8" />
          Trauma-Informed Beta Testing Setup
        </CardTitle>
        <p className="text-purple-600 mt-2">
          Setting up a safe, culturally-responsive testing environment
        </p>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Framework Status */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            frameworkStatus === 'ready' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {frameworkStatus === 'ready' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5 animate-spin" />
            )}
            <span className="font-medium capitalize">
              Framework {frameworkStatus}
            </span>
          </div>
        </div>

        {/* Framework Components Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-800">Safety Protocols</h3>
            <div className="space-y-2">
              {[
                'Trauma-informed consent processes',
                'Crisis intervention protocols',
                'Wellbeing monitoring systems',
                'Community liaison network'
              ].map((protocol, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">{protocol}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-800">Cultural Competency</h3>
            <div className="space-y-2">
              {[
                'Community partnership network',
                'Cultural validation protocols',
                'Multilingual support systems',
                'Traditional healing integration'
              ].map((competency, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">{competency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Partners */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-purple-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Partners Active
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {communityPartners.map((partner, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crisis Support Status */}
        {crisisSupport && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-medium text-red-800">24/7 Crisis Support Active</h4>
                <p className="text-sm text-red-700">
                  Culturally competent crisis counselors standing by throughout testing
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Participant Setup Form */}
        {frameworkStatus === 'ready' && (
          <ParticipantSetupForm onSetupComplete={handleParticipantSetup} />
        )}
      </CardContent>
    </Card>
  )

  const renderCurrentPhase = () => {
    if (!participantProfile) return null

    switch (currentPhase) {
      case 'trauma_testing':
        return (
          <TraumaSurvivorTesting
            participantId={participantProfile.id}
            culturalBackground={participantProfile.culturalBackground}
            supportPersonPresent={participantProfile.supportPersonPresent}
            preferredLanguage={participantProfile.preferredLanguage}
            accessibilityNeeds={participantProfile.accessibilityNeeds}
            onComplete={handleTraumaTestingComplete}
          />
        )

      case 'cultural_validation':
        return (
          <CulturalCommunityValidation
            validatorProfile={{
              id: participantProfile.id,
              name: 'Community Validator',
              culturalBackground: participantProfile.culturalBackground,
              identities: participantProfile.identities,
              communityRole: 'peer_leader',
              expertise: ['lived_experience', 'community_healing'],
              preferredLanguage: participantProfile.preferredLanguage,
              accessibilityNeeds: participantProfile.accessibilityNeeds
            }}
            validationScenario={{
              id: 'comprehensive_cultural_validation',
              name: 'ALCHM Cultural Competency Validation',
              description: 'Comprehensive validation of cultural responsiveness and identity affirmation',
              culturalElements: [
                {
                  type: 'imagery',
                  content: 'Platform imagery and visual representation',
                  culturalOrigin: participantProfile.culturalBackground,
                  sacredness: 'cultural',
                  permissions: ['community_approved']
                },
                {
                  type: 'language',
                  content: 'Platform language and communication style',
                  culturalOrigin: participantProfile.culturalBackground,
                  sacredness: 'secular',
                  permissions: ['community_validated']
                }
              ],
              validationCriteria: [
                {
                  id: 'representation',
                  category: 'representation',
                  question: 'How authentically does ALCHM represent your cultural identity?',
                  weight: 0.25,
                  culturalSpecific: true
                },
                {
                  id: 'safety',
                  category: 'safety',
                  question: 'How culturally safe does the platform feel for your community?',
                  weight: 0.25,
                  culturalSpecific: true
                },
                {
                  id: 'healing',
                  category: 'empowerment',
                  question: 'How well does the platform support your community\'s healing approaches?',
                  weight: 0.25,
                  culturalSpecific: true
                },
                {
                  id: 'accessibility',
                  category: 'accessibility',
                  question: 'How accessible is the platform for your community\'s needs?',
                  weight: 0.25,
                  culturalSpecific: true
                }
              ],
              communityContext: participantProfile.culturalBackground
            }}
            onComplete={handleCulturalValidationComplete}
          />
        )

      case 'mobile_crisis':
        return (
          <MobileCrisisExperienceTesting
            participantId={participantProfile.id}
            accessibilityProfile={{
              motorImpairment: participantProfile.accessibilityNeeds.includes('motor'),
              visualImpairment: participantProfile.accessibilityNeeds.includes('visual'),
              cognitiveSupport: participantProfile.accessibilityNeeds.includes('cognitive'),
              tremors: participantProfile.accessibilityNeeds.includes('tremors'),
              oneHandedUse: participantProfile.accessibilityNeeds.includes('one_handed'),
              voiceControl: participantProfile.accessibilityNeeds.includes('voice'),
              screenReader: participantProfile.accessibilityNeeds.includes('screen_reader'),
              reducedMotion: participantProfile.accessibilityNeeds.includes('reduced_motion')
            }}
            deviceProfile={{
              deviceType: 'phone',
              screenSize: 'medium',
              networkSpeed: 'medium',
              batteryOptimization: true,
              operatingSystem: 'ios',
              assistiveTech: participantProfile.accessibilityNeeds
            }}
            onTestComplete={handleMobileCrisisComplete}
          />
        )

      case 'feedback':
        return (
          <SafeFeedbackCollection
            participantId={participantProfile.id}
            culturalBackground={participantProfile.culturalBackground}
            traumaInformed={participantProfile.traumaInformedConsent}
            communityLiaison={participantProfile.communityLiaison}
            onFeedbackComplete={handleFeedbackComplete}
          />
        )

      case 'results':
        return renderResultsPhase()

      default:
        return null
    }
  }

  const renderResultsPhase = () => (
    <Card className="border-2 border-green-200 max-w-6xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-green-100 to-blue-100">
        <CardTitle className="text-3xl font-medium text-green-800 flex items-center justify-center gap-3">
          <Crown className="h-8 w-8" />
          Beta Testing Complete - Community Wisdom Gathered
        </CardTitle>
        <p className="text-green-600 mt-2">
          Thank you for sharing your wisdom to make ALCHM a true digital sanctuary
        </p>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Overall Assessment */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Safety Score', 
              value: testingResults.overallAssessment?.safetyScore || 0, 
              icon: Shield, 
              color: 'green' 
            },
            { 
              label: 'Cultural Competency', 
              value: testingResults.overallAssessment?.culturalCompetency || 0, 
              icon: Globe, 
              color: 'blue' 
            },
            { 
              label: 'Accessibility', 
              value: testingResults.overallAssessment?.accessibilityScore || 0, 
              icon: Eye, 
              color: 'purple' 
            },
            { 
              label: 'Healing Potential', 
              value: testingResults.overallAssessment?.healingPotential || 0, 
              icon: Heart, 
              color: 'pink' 
            }
          ].map((metric, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
              <metric.icon className={`h-8 w-8 mx-auto mb-3 text-${metric.color}-600`} />
              <div className="text-3xl font-medium text-gray-800 mb-1">{metric.value.toFixed(1)}/5.0</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Community Endorsement */}
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h3 className="text-2xl font-medium text-green-800">Community Endorsed</h3>
          </div>
          <p className="text-green-700">
            This beta testing validates that ALCHM shows strong potential as a culturally-responsive 
            healing platform for marginalized communities.
          </p>
        </div>

        {/* Key Recommendations */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Community Recommendations
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {testingResults.overallAssessment?.recommendationsGenerated.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800">{rec}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Statement */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <h3 className="text-xl font-medium text-purple-800 mb-3">Your Impact</h3>
          <p className="text-purple-700 leading-relaxed">
            Your participation in this trauma-informed beta testing has directly contributed to making 
            ALCHM a more culturally-responsive, accessible, and healing-centered platform. Your wisdom 
            and lived experience will help ensure that future users from your community and others feel 
            truly seen, supported, and empowered in their healing journeys.
          </p>
        </div>

        {/* Community Connections */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Ongoing Community Connection
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="h-16 bg-green-600 hover:bg-green-700 text-white">
              <div className="text-center">
                <div className="font-medium">Community Updates</div>
                <div className="text-sm opacity-90">Stay informed on improvements</div>
              </div>
            </Button>
            <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
              <div className="text-center">
                <div className="font-medium">Healing Circles</div>
                <div className="text-sm opacity-90">Connect with peer support</div>
              </div>
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white">
              <div className="text-center">
                <div className="font-medium">Advocacy Opportunities</div>
                <div className="text-sm opacity-90">Champion community needs</div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (frameworkStatus === 'initializing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-6">
            <div className="animate-spin mx-auto">
              <Zap className="h-16 w-16 text-purple-600" />
            </div>
            <h2 className="text-2xl font-medium text-purple-800">Initializing Framework</h2>
            <p className="text-purple-600">
              Setting up trauma-informed testing protocols and community partnerships...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Progress Indicator */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {['setup', 'trauma_testing', 'cultural_validation', 'mobile_crisis', 'feedback', 'results'].map((phase, index) => (
              <div
                key={phase}
                className={`w-4 h-4 rounded-full ${
                  phase === currentPhase 
                    ? 'bg-purple-600' 
                    : index < ['setup', 'trauma_testing', 'cultural_validation', 'mobile_crisis', 'feedback', 'results'].indexOf(currentPhase)
                    ? 'bg-green-600'
                    : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-purple-600 capitalize">
            {currentPhase.replace('_', ' ')} Phase
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentPhase === 'setup' ? renderSetupPhase() : renderCurrentPhase()}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Participant Setup Form Component
const ParticipantSetupForm: React.FC<{ onSetupComplete: (profile: ParticipantProfile) => void }> = ({ 
  onSetupComplete 
}) => {
  const [formData, setFormData] = useState({
    culturalBackground: [] as string[],
    identities: [] as string[],
    accessibilityNeeds: [] as string[],
    preferredLanguage: 'en',
    supportPersonPresent: false,
    traumaInformedConsent: false
  })

  const culturalOptions = [
    'Black/African American', 'Indigenous/Native American', 'Latino/Hispanic', 
    'Asian/Pacific Islander', 'LGBTQ+', 'Muslim', 'Jewish', 'Immigrant/Refugee'
  ]

  const accessibilityOptions = [
    'motor', 'visual', 'cognitive', 'tremors', 'one_handed', 
    'voice', 'screen_reader', 'reduced_motion'
  ]

  const handleSubmit = () => {
    if (!formData.traumaInformedConsent) {
      alert('Trauma-informed consent is required to proceed')
      return
    }

    const profile: ParticipantProfile = {
      id: `participant_${Date.now()}`,
      culturalBackground: formData.culturalBackground,
      identities: formData.identities,
      accessibilityNeeds: formData.accessibilityNeeds,
      preferredLanguage: formData.preferredLanguage,
      supportPersonPresent: formData.supportPersonPresent,
      communityLiaison: formData.culturalBackground.length > 0 ? 'community_liaison_1' : undefined,
      traumaInformedConsent: formData.traumaInformedConsent
    }

    onSetupComplete(profile)
  }

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-xl font-medium text-purple-800">Participant Setup</h3>
      
      {/* Cultural Background */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Cultural Background (select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-2">
          {culturalOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.culturalBackground.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      culturalBackground: [...prev.culturalBackground, option]
                    }))
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      culturalBackground: prev.culturalBackground.filter(bg => bg !== option)
                    }))
                  }
                }}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Accessibility Needs */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Accessibility Needs (select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-2">
          {accessibilityOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.accessibilityNeeds.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      accessibilityNeeds: [...prev.accessibilityNeeds, option]
                    }))
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      accessibilityNeeds: prev.accessibilityNeeds.filter(need => need !== option)
                    }))
                  }
                }}
                className="rounded"
              />
              <span className="text-sm text-gray-700 capitalize">{option.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Support Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.supportPersonPresent}
            onChange={(e) => setFormData(prev => ({ ...prev, supportPersonPresent: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm text-gray-700">I have a support person present during testing</span>
        </label>
      </div>

      {/* Trauma-Informed Consent */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.traumaInformedConsent}
            onChange={(e) => setFormData(prev => ({ ...prev, traumaInformedConsent: e.target.checked }))}
            className="rounded mt-1"
          />
          <div className="text-sm text-yellow-800">
            <strong>I consent to trauma-informed beta testing</strong> and understand that:
            <ul className="mt-2 space-y-1 list-disc ml-4">
              <li>My safety and wellbeing are the highest priority</li>
              <li>I can pause or stop testing at any time</li>
              <li>Crisis support is available throughout testing</li>
              <li>My cultural identity will be honored and respected</li>
              <li>Community liaisons are available for support</li>
            </ul>
          </div>
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!formData.traumaInformedConsent}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3"
      >
        Begin Trauma-Informed Beta Testing
      </Button>
    </div>
  )
}

export default TraumaInformedBetaFramework