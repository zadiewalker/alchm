'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Heart, 
  Users, 
  Star, 
  MessageCircle, 
  Shield, 
  Crown,
  Palette,
  BookOpen,
  Compass,
  Eye,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CulturalValidationProps {
  validatorProfile: CulturalValidator
  validationScenario: ValidationScenario
  onComplete: (validation: CulturalValidationResult) => void
}

interface CulturalValidator {
  id: string
  name: string
  culturalBackground: string[]
  identities: string[]
  communityRole: 'elder' | 'healer' | 'advocate' | 'peer_leader' | 'cultural_keeper'
  expertise: string[]
  preferredLanguage: string
  accessibilityNeeds: string[]
}

interface ValidationScenario {
  id: string
  name: string
  description: string
  culturalElements: CulturalElement[]
  validationCriteria: ValidationCriterion[]
  communityContext: string[]
}

interface CulturalElement {
  type: 'imagery' | 'language' | 'healing_practice' | 'resource' | 'ritual' | 'symbol'
  content: string
  culturalOrigin: string[]
  sacredness: 'sacred' | 'ceremonial' | 'cultural' | 'secular'
  permissions: string[]
}

interface ValidationCriterion {
  id: string
  category: 'representation' | 'respect' | 'accuracy' | 'accessibility' | 'safety' | 'empowerment'
  question: string
  weight: number
  culturalSpecific: boolean
}

interface CulturalValidationResult {
  validatorId: string
  scenarioId: string
  timestamp: Date
  criteriaScores: Record<string, CriterionScore>
  overallScore: number
  culturalResonance: 1 | 2 | 3 | 4 | 5
  recommendations: Recommendation[]
  concernsRaised: Concern[]
  approved: boolean
  communityEndorsement: boolean
}

interface CriterionScore {
  score: 1 | 2 | 3 | 4 | 5
  feedback: string
  examples: string[]
  culturalNotes: string[]
}

interface Recommendation {
  type: 'enhancement' | 'correction' | 'addition' | 'removal'
  priority: 'critical' | 'high' | 'medium' | 'low'
  description: string
  culturalContext: string
  communityResource?: string
}

interface Concern {
  type: 'appropriation' | 'misrepresentation' | 'stereotyping' | 'exclusion' | 'harm'
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  impact: string
  resolution: string[]
}

const CulturalCommunityValidation: React.FC<CulturalValidationProps> = ({
  validatorProfile,
  validationScenario,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [criteriaScores, setCriteriaScores] = useState<Record<string, CriterionScore>>({})
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [concerns, setConcerns] = useState<Concern[]>([])
  const [culturalResonance, setCulturalResonance] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [validationNotes, setValidationNotes] = useState<string>('')
  const [communityEndorsement, setCommunityEndorsement] = useState<boolean>(false)

  // Cultural validation framework
  const culturalValidationFramework = {
    representationValidation: {
      authenticity: 'Are cultural identities represented authentically without stereotyping?',
      diversity: 'Is diversity within cultural communities acknowledged and celebrated?',
      leadership: 'Are community members shown in leadership and healing roles?',
      intersectionality: 'Are intersectional identities (race, gender, sexuality, class) honored?'
    },
    respectValidation: {
      sacred: 'Are sacred elements treated with appropriate reverence and permission?',
      language: 'Is culturally appropriate and respectful language used throughout?',
      protocols: 'Are cultural protocols and boundaries honored?',
      consent: 'Is there clear consent from knowledge keepers for cultural elements used?'
    },
    accuracyValidation: {
      cultural: 'Are cultural practices and beliefs accurately represented?',
      historical: 'Is historical context provided without trauma exploitation?',
      healing: 'Are traditional healing approaches accurately described?',
      community: 'Are community structures and values accurately reflected?'
    },
    accessibilityValidation: {
      language: 'Are materials accessible in community languages?',
      literacy: 'Are materials accessible for varying literacy levels?',
      technology: 'Are technical barriers minimized for community access?',
      economic: 'Are economic barriers to access addressed?'
    },
    safetyValidation: {
      psychological: 'Do materials feel psychologically safe for community members?',
      cultural: 'Is cultural safety maintained throughout the experience?',
      identity: 'Are all identity expressions supported and protected?',
      crisis: 'Are culturally competent crisis resources available?'
    },
    empowermentValidation: {
      agency: 'Do materials support community agency and self-determination?',
      wisdom: 'Is community wisdom centered and celebrated?',
      healing: 'Do approaches support community healing and resilience?',
      advocacy: 'Do materials support community advocacy and justice?'
    }
  }

  // Community-specific validation considerations
  const getCommunityConsiderations = (culturalBackground: string[]) => {
    const considerations: Record<string, string[]> = {
      'Black/African American': [
        'Historical trauma acknowledgment',
        'Community healing traditions',
        'Resistance and resilience celebration',
        'Anti-racism framework integration'
      ],
      'Indigenous/Native American': [
        'Tribal sovereignty respect',
        'Traditional healing protocols',
        'Land and ancestor connection',
        'Ceremonial appropriation prevention'
      ],
      'Latino/Hispanic': [
        'Cultural diversity within community',
        'Immigration experience sensitivity',
        'Family and community centrality',
        'Spanish language accessibility'
      ],
      'Asian/Pacific Islander': [
        'Model minority myth rejection',
        'Cultural diversity acknowledgment',
        'Intergenerational trauma awareness',
        'Mental health stigma addressing'
      ],
      'LGBTQ+': [
        'Chosen family recognition',
        'Identity spectrum celebration',
        'Coming out process support',
        'Community safety prioritization'
      ],
      'Muslim': [
        'Islamophobia acknowledgment',
        'Prayer and ritual respect',
        'Hijab choice support',
        'Cultural practice integration'
      ],
      'Jewish': [
        'Antisemitism awareness',
        'Holiday and ritual respect',
        'Historical trauma sensitivity',
        'Community diversity celebration'
      ],
      'Immigrant/Refugee': [
        'Documentation sensitivity',
        'Language barrier addressing',
        'Cultural navigation support',
        'Trauma-informed approaches'
      ]
    }

    return culturalBackground.flatMap(bg => considerations[bg] || [])
  }

  // Scoring and validation logic
  const scoreValidationCriterion = (
    criterionId: string,
    score: 1 | 2 | 3 | 4 | 5,
    feedback: string,
    examples: string[] = [],
    culturalNotes: string[] = []
  ) => {
    const criterionScore: CriterionScore = {
      score,
      feedback,
      examples,
      culturalNotes
    }

    setCriteriaScores(prev => ({
      ...prev,
      [criterionId]: criterionScore
    }))
  }

  const addRecommendation = (recommendation: Recommendation) => {
    setRecommendations(prev => [...prev, recommendation])
  }

  const addConcern = (concern: Concern) => {
    setConcerns(prev => [...prev, concern])
  }

  const calculateOverallScore = (): number => {
    const scores = Object.values(criteriaScores).map(c => c.score)
    if (scores.length === 0) return 0
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  const determineApproval = (): boolean => {
    const overallScore = calculateOverallScore()
    const hasCriticalConcerns = concerns.some(c => c.severity === 'critical')
    const hasHighConcerns = concerns.filter(c => c.severity === 'high').length > 2
    
    return overallScore >= 4.0 && !hasCriticalConcerns && !hasHighConcerns && culturalResonance >= 4
  }

  const completeValidation = () => {
    const validationResult: CulturalValidationResult = {
      validatorId: validatorProfile.id,
      scenarioId: validationScenario.id,
      timestamp: new Date(),
      criteriaScores,
      overallScore: calculateOverallScore(),
      culturalResonance,
      recommendations,
      concernsRaised: concerns,
      approved: determineApproval(),
      communityEndorsement
    }

    onComplete(validationResult)
  }

  const renderValidationStep = () => {
    const criterion = validationScenario.validationCriteria[currentStep]
    if (!criterion) return null

    const communityConsiderations = getCommunityConsiderations(validatorProfile.culturalBackground)

    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              {getCriterionIcon(criterion.category)}
              {criterion.category.replace('_', ' ').toUpperCase()} Validation
            </CardTitle>
            <p className="text-purple-600">{criterion.question}</p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Community-Specific Considerations */}
            {communityConsiderations.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Cultural Considerations for Your Community:</h4>
                <ul className="space-y-1">
                  {communityConsiderations.map((consideration, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cultural Elements Being Validated */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Cultural Elements to Review:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {validationScenario.culturalElements
                  .filter(element => element.type === getCategoryElementType(criterion.category))
                  .map((element, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {element.type.replace('_', ' ')}
                        </span>
                        {element.sacredness !== 'secular' && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {element.sacredness}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{element.content}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Cultural Origin: {element.culturalOrigin.join(', ')}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Scoring Interface */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">How well does this meet your community's needs?</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <Button
                    key={score}
                    onClick={() => scoreValidationCriterion(
                      criterion.id,
                      score as 1 | 2 | 3 | 4 | 5,
                      validationNotes
                    )}
                    variant={criteriaScores[criterion.id]?.score === score ? "default" : "outline"}
                    className={`w-16 h-16 ${getScoreColor(score)}`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-medium">{score}</div>
                      <div className="text-xs">{getScoreLabel(score)}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Feedback Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Your cultural wisdom and feedback:
              </label>
              <textarea
                value={validationNotes}
                onChange={(e) => setValidationNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                placeholder="Share your insights on how this could better serve your community..."
              />
            </div>

            {/* Quick Actions for Common Issues */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => addConcern({
                  type: 'misrepresentation',
                  severity: 'high',
                  description: 'Cultural misrepresentation identified',
                  impact: 'Could perpetuate harmful stereotypes',
                  resolution: ['Consult community experts', 'Revise representation', 'Add cultural context']
                })}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Flag Cultural Concern
              </Button>
              
              <Button
                onClick={() => addRecommendation({
                  type: 'enhancement',
                  priority: 'high',
                  description: 'Community enhancement suggested',
                  culturalContext: validatorProfile.culturalBackground.join(', ')
                })}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Suggest Enhancement
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <Button
                onClick={() => {
                  if (currentStep < validationScenario.validationCriteria.length - 1) {
                    setCurrentStep(prev => prev + 1)
                  } else {
                    // Move to final review
                    setCurrentStep(validationScenario.validationCriteria.length)
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                {currentStep < validationScenario.validationCriteria.length - 1 ? 'Next' : 'Review & Submit'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderFinalReview = () => (
    <Card className="border-2 border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100">
        <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
          <CheckCircle className="h-8 w-8" />
          Cultural Validation Review
        </CardTitle>
        <p className="text-green-600">Review your validation before submitting to the community</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Overall Score Display */}
        <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <div className="text-4xl font-medium text-purple-800 mb-2">
            {calculateOverallScore().toFixed(1)}/5.0
          </div>
          <div className="text-lg text-purple-600">Overall Cultural Competency Score</div>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${
                  star <= culturalResonance 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-purple-600 mt-2">Cultural Resonance Rating</div>
        </div>

        {/* Community Endorsement */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Community Endorsement</h4>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setCommunityEndorsement(true)}
              variant={communityEndorsement ? "default" : "outline"}
              className="flex-1"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Endorse for Community
            </Button>
            <Button
              onClick={() => setCommunityEndorsement(false)}
              variant={!communityEndorsement ? "default" : "outline"}
              className="flex-1"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Needs More Work
            </Button>
          </div>
        </div>

        {/* Summary of Concerns and Recommendations */}
        {concerns.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-800">Cultural Concerns Raised:</h4>
            <div className="space-y-2">
              {concerns.map((concern, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800 capitalize">
                      {concern.type.replace('_', ' ')} - {concern.severity} Priority
                    </span>
                  </div>
                  <p className="text-sm text-red-700">{concern.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-green-800">Recommendations:</h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 capitalize">
                      {rec.type} - {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-green-700">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Approval Status */}
        <div className={`p-4 rounded-lg ${
          determineApproval() 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {determineApproval() ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className={`font-medium ${
              determineApproval() ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {determineApproval() 
                ? 'Approved for Community Use' 
                : 'Needs Improvement Before Community Release'}
            </span>
          </div>
          <p className={`text-sm ${
            determineApproval() ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {determineApproval()
              ? 'This validation indicates the platform adequately serves your community with cultural competency.'
              : 'This validation indicates the platform needs significant improvement to adequately serve your community.'}
          </p>
        </div>

        {/* Submit Validation */}
        <div className="text-center">
          <Button
            onClick={completeValidation}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
          >
            Submit Cultural Validation
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Helper functions
  const getCriterionIcon = (category: string) => {
    const icons = {
      representation: <Users className="h-5 w-5" />,
      respect: <Heart className="h-5 w-5" />,
      accuracy: <Eye className="h-5 w-5" />,
      accessibility: <Compass className="h-5 w-5" />,
      safety: <Shield className="h-5 w-5" />,
      empowerment: <Crown className="h-5 w-5" />
    }
    return icons[category] || <Globe className="h-5 w-5" />
  }

  const getCategoryElementType = (category: string): string => {
    const mappings = {
      representation: 'imagery',
      respect: 'ritual',
      accuracy: 'healing_practice',
      accessibility: 'language',
      safety: 'resource',
      empowerment: 'symbol'
    }
    return mappings[category] || 'language'
  }

  const getScoreColor = (score: number): string => {
    const colors = {
      1: 'border-red-300 text-red-700 hover:bg-red-50',
      2: 'border-orange-300 text-orange-700 hover:bg-orange-50',
      3: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50',
      4: 'border-green-300 text-green-700 hover:bg-green-50',
      5: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
    }
    return colors[score] || 'border-gray-300'
  }

  const getScoreLabel = (score: number): string => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Great',
      5: 'Excellent'
    }
    return labels[score] || 'N/A'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-purple-800 mb-2">
            Cultural Community Validation
          </h1>
          <p className="text-purple-600">
            Your cultural wisdom helps make ALCHM a true digital sanctuary for all communities
          </p>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-center gap-2">
              {validationScenario.validationCriteria.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep 
                      ? 'bg-purple-600' 
                      : 'bg-purple-200'
                  }`}
                />
              ))}
              <div
                className={`w-3 h-3 rounded-full ${
                  currentStep > validationScenario.validationCriteria.length - 1
                    ? 'bg-green-600' 
                    : 'bg-purple-200'
                }`}
              />
            </div>
            <div className="text-sm text-purple-600 mt-2">
              {currentStep < validationScenario.validationCriteria.length 
                ? `Step ${currentStep + 1} of ${validationScenario.validationCriteria.length}`
                : 'Review & Submit'
              }
            </div>
          </div>
        </div>

        {/* Validation Content */}
        <AnimatePresence mode="wait">
          {currentStep < validationScenario.validationCriteria.length 
            ? renderValidationStep()
            : renderFinalReview()
          }
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CulturalCommunityValidation