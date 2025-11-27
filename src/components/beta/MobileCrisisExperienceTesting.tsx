'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  Battery, 
  Wifi, 
  WifiOff, 
  Accessibility, 
  Timer, 
  AlertTriangle,
  Heart,
  Shield,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MobileCrisisTestingProps {
  participantId: string
  accessibilityProfile: AccessibilityProfile
  deviceProfile: DeviceProfile
  onTestComplete: (results: CrisisTestingResults) => void
}

interface AccessibilityProfile {
  motorImpairment: boolean
  visualImpairment: boolean
  cognitiveSupport: boolean
  tremors: boolean
  oneHandedUse: boolean
  voiceControl: boolean
  screenReader: boolean
  reducedMotion: boolean
}

interface DeviceProfile {
  deviceType: 'phone' | 'tablet'
  screenSize: 'small' | 'medium' | 'large'
  networkSpeed: 'slow' | 'medium' | 'fast'
  batteryOptimization: boolean
  operatingSystem: 'ios' | 'android'
  assistiveTech: string[]
}

interface CrisisScenario {
  id: string
  name: string
  description: string
  stressLevel: 'low' | 'medium' | 'high' | 'extreme'
  conditions: TestingCondition[]
  successCriteria: SuccessCriterion[]
  accessibilityRequirements: string[]
  timeLimit: number // seconds
}

interface TestingCondition {
  type: 'battery' | 'network' | 'tremors' | 'distraction' | 'stress' | 'cognitive_load'
  severity: 'mild' | 'moderate' | 'severe'
  description: string
  implementation: () => void
  restoration: () => void
}

interface SuccessCriterion {
  id: string
  description: string
  metric: 'time' | 'accuracy' | 'completion' | 'accessibility' | 'usability'
  target: number | boolean
  weight: number
}

interface CrisisTestingResults {
  scenarioId: string
  participantId: string
  timestamp: Date
  completed: boolean
  timeToCompletion: number
  successRate: number
  accessibilityScore: number
  usabilityScore: number
  stressImpact: number
  criticalFailures: CriticalFailure[]
  recommendations: string[]
  participantFeedback: string
}

interface CriticalFailure {
  type: 'navigation' | 'accessibility' | 'performance' | 'crisis_access' | 'safety'
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  context: string
  timestamp: Date
}

const MobileCrisisExperienceTesting: React.FC<MobileCrisisTestingProps> = ({
  participantId,
  accessibilityProfile,
  deviceProfile,
  onTestComplete
}) => {
  const [currentScenario, setCurrentScenario] = useState<CrisisScenario | null>(null)
  const [testingActive, setTestingActive] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [currentConditions, setCurrentConditions] = useState<TestingCondition[]>([])
  const [criticalFailures, setCriticalFailures] = useState<CriticalFailure[]>([])
  const [participantStress, setParticipantStress] = useState<1 | 2 | 3 | 4 | 5>(2)
  const [testResults, setTestResults] = useState<Partial<CrisisTestingResults>>({})
  
  const timerRef = useRef<NodeJS.Timeout>()
  const stressMonitorRef = useRef<NodeJS.Timeout>()

  // Crisis testing scenarios designed for mobile environments
  const crisisTestingScenarios: CrisisScenario[] = [
    {
      id: 'panic_attack_low_battery',
      name: 'Panic Attack with Low Battery',
      description: 'Navigate crisis resources while phone battery is critically low (5%)',
      stressLevel: 'high',
      conditions: [
        {
          type: 'battery',
          severity: 'severe',
          description: 'Battery at 5% with power saving mode active',
          implementation: () => simulateLowBattery(),
          restoration: () => restoreFullBattery()
        },
        {
          type: 'stress',
          severity: 'severe',
          description: 'Simulated panic attack symptoms affecting interaction',
          implementation: () => simulatePanicSymptoms(),
          restoration: () => removePanicSimulation()
        }
      ],
      successCriteria: [
        {
          id: 'crisis_access_time',
          description: 'Access crisis resources within 30 seconds',
          metric: 'time',
          target: 30,
          weight: 0.4
        },
        {
          id: 'navigation_success',
          description: 'Successfully navigate to emergency contacts',
          metric: 'completion',
          target: true,
          weight: 0.3
        },
        {
          id: 'battery_conservation',
          description: 'Complete without draining additional battery',
          metric: 'completion',
          target: true,
          weight: 0.3
        }
      ],
      accessibilityRequirements: ['large_touch_targets', 'high_contrast', 'simple_navigation'],
      timeLimit: 120
    },
    {
      id: 'offline_crisis_support',
      name: 'Crisis Support Without Internet',
      description: 'Access crisis resources and support when completely offline',
      stressLevel: 'extreme',
      conditions: [
        {
          type: 'network',
          severity: 'severe',
          description: 'Complete network disconnection',
          implementation: () => simulateOfflineMode(),
          restoration: () => restoreNetworkConnection()
        },
        {
          type: 'stress',
          severity: 'moderate',
          description: 'Moderate anxiety affecting decision making',
          implementation: () => simulateAnxietySymptoms(),
          restoration: () => removeAnxietySimulation()
        }
      ],
      successCriteria: [
        {
          id: 'offline_resource_access',
          description: 'Access offline crisis resources successfully',
          metric: 'completion',
          target: true,
          weight: 0.5
        },
        {
          id: 'local_contact_access',
          description: 'Access emergency contacts stored locally',
          metric: 'completion',
          target: true,
          weight: 0.3
        },
        {
          id: 'self_care_tools',
          description: 'Access offline self-care tools',
          metric: 'completion',
          target: true,
          weight: 0.2
        }
      ],
      accessibilityRequirements: ['offline_functionality', 'cached_resources', 'local_storage'],
      timeLimit: 180
    },
    {
      id: 'tremor_crisis_navigation',
      name: 'Crisis Navigation with Motor Impairment',
      description: 'Navigate crisis features while experiencing hand tremors or motor difficulties',
      stressLevel: 'medium',
      conditions: [
        {
          type: 'tremors',
          severity: 'moderate',
          description: 'Simulated hand tremors affecting touch precision',
          implementation: () => simulateTremors(),
          restoration: () => removeTremorSimulation()
        },
        {
          type: 'cognitive_load',
          severity: 'mild',
          description: 'Mild cognitive pressure from crisis situation',
          implementation: () => simulateCognitiveLoad(),
          restoration: () => removeCognitiveLoad()
        }
      ],
      successCriteria: [
        {
          id: 'touch_accuracy',
          description: 'Successful touch interactions despite tremors',
          metric: 'accuracy',
          target: 0.8,
          weight: 0.4
        },
        {
          id: 'large_target_usage',
          description: 'Effectively use large touch targets',
          metric: 'completion',
          target: true,
          weight: 0.3
        },
        {
          id: 'alternative_input',
          description: 'Successfully use voice commands when available',
          metric: 'completion',
          target: true,
          weight: 0.3
        }
      ],
      accessibilityRequirements: ['large_touch_targets', 'voice_control', 'gesture_tolerance'],
      timeLimit: 150
    },
    {
      id: 'overwhelm_information_processing',
      name: 'Information Processing During Overwhelm',
      description: 'Process crisis information effectively while experiencing cognitive overwhelm',
      stressLevel: 'high',
      conditions: [
        {
          type: 'cognitive_load',
          severity: 'severe',
          description: 'High cognitive load affecting information processing',
          implementation: () => simulateOverwhelm(),
          restoration: () => removeOverwhelmSimulation()
        },
        {
          type: 'distraction',
          severity: 'moderate',
          description: 'Environmental distractions and interruptions',
          implementation: () => simulateDistractions(),
          restoration: () => removeDistractions()
        }
      ],
      successCriteria: [
        {
          id: 'information_comprehension',
          description: 'Understand crisis information despite overwhelm',
          metric: 'completion',
          target: true,
          weight: 0.4
        },
        {
          id: 'step_by_step_completion',
          description: 'Follow step-by-step crisis guidance',
          metric: 'completion',
          target: true,
          weight: 0.3
        },
        {
          id: 'reduced_cognitive_load',
          description: 'Interface reduces rather than increases cognitive burden',
          metric: 'usability',
          target: 4,
          weight: 0.3
        }
      ],
      accessibilityRequirements: ['simple_language', 'clear_hierarchy', 'minimal_choices'],
      timeLimit: 300
    }
  ]

  // Simulation functions for testing conditions
  const simulateLowBattery = () => {
    // Add CSS class to simulate low battery UI changes
    document.body.classList.add('low-battery-mode')
    // Reduce animation and visual effects
    document.body.style.setProperty('--animation-duration', '0s')
    console.log('Low battery mode activated - reduced performance simulation')
  }

  const restoreFullBattery = () => {
    document.body.classList.remove('low-battery-mode')
    document.body.style.removeProperty('--animation-duration')
    console.log('Full battery restored')
  }

  const simulateOfflineMode = () => {
    // Disable network requests (in real implementation, would use service worker)
    document.body.classList.add('offline-mode')
    window.dispatchEvent(new Event('offline'))
    console.log('Offline mode activated')
  }

  const restoreNetworkConnection = () => {
    document.body.classList.remove('offline-mode')
    window.dispatchEvent(new Event('online'))
    console.log('Network connection restored')
  }

  const simulateTremors = () => {
    // Add CSS animations to simulate hand tremors affecting touch
    document.body.classList.add('tremor-simulation')
    // Increase touch target sizes automatically
    document.body.classList.add('large-touch-targets')
    console.log('Tremor simulation activated')
  }

  const removeTremorSimulation = () => {
    document.body.classList.remove('tremor-simulation', 'large-touch-targets')
    console.log('Tremor simulation removed')
  }

  const simulatePanicSymptoms = () => {
    // Visual effects to simulate panic-related vision changes
    document.body.classList.add('panic-simulation')
    // Reduce visual complexity
    document.body.classList.add('reduced-motion', 'high-contrast')
    console.log('Panic symptoms simulation activated')
  }

  const removePanicSimulation = () => {
    document.body.classList.remove('panic-simulation', 'reduced-motion', 'high-contrast')
    console.log('Panic simulation removed')
  }

  const simulateAnxietySymptoms = () => {
    document.body.classList.add('anxiety-simulation')
    console.log('Anxiety symptoms simulation activated')
  }

  const removeAnxietySimulation = () => {
    document.body.classList.remove('anxiety-simulation')
    console.log('Anxiety simulation removed')
  }

  const simulateCognitiveLoad = () => {
    document.body.classList.add('cognitive-load-simulation')
    console.log('Cognitive load simulation activated')
  }

  const removeCognitiveLoad = () => {
    document.body.classList.remove('cognitive-load-simulation')
    console.log('Cognitive load simulation removed')
  }

  const simulateOverwhelm = () => {
    document.body.classList.add('overwhelm-simulation')
    document.body.classList.add('simplified-interface')
    console.log('Overwhelm simulation activated')
  }

  const removeOverwhelmSimulation = () => {
    document.body.classList.remove('overwhelm-simulation', 'simplified-interface')
    console.log('Overwhelm simulation removed')
  }

  const simulateDistractions = () => {
    document.body.classList.add('distraction-simulation')
    console.log('Distraction simulation activated')
  }

  const removeDistractions = () => {
    document.body.classList.remove('distraction-simulation')
    console.log('Distraction simulation removed')
  }

  // Testing lifecycle management
  const startCrisisTest = (scenario: CrisisScenario) => {
    setCurrentScenario(scenario)
    setTestingActive(true)
    setStartTime(new Date())
    setCriticalFailures([])
    
    // Apply testing conditions
    scenario.conditions.forEach(condition => {
      condition.implementation()
    })
    setCurrentConditions(scenario.conditions)
    
    // Start stress monitoring
    stressMonitorRef.current = setInterval(() => {
      monitorParticipantStress()
    }, 30000) // Every 30 seconds
    
    // Start timeout timer
    timerRef.current = setTimeout(() => {
      recordCriticalFailure({
        type: 'performance',
        description: 'Test timed out - exceeded maximum time limit',
        impact: 'high',
        context: `Scenario: ${scenario.name}`,
        timestamp: new Date()
      })
      endCrisisTest()
    }, scenario.timeLimit * 1000)
    
    console.log(`Crisis test started: ${scenario.name}`)
  }

  const endCrisisTest = () => {
    if (!currentScenario || !startTime) return
    
    const endTime = new Date()
    const timeToCompletion = (endTime.getTime() - startTime.getTime()) / 1000
    
    // Restore normal conditions
    currentConditions.forEach(condition => {
      condition.restoration()
    })
    
    // Clear timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (stressMonitorRef.current) clearInterval(stressMonitorRef.current)
    
    // Calculate results
    const results = calculateTestResults(currentScenario, timeToCompletion)
    
    setTestingActive(false)
    setCurrentScenario(null)
    setCurrentConditions([])
    
    onTestComplete(results)
  }

  const calculateTestResults = (scenario: CrisisScenario, completionTime: number): CrisisTestingResults => {
    const successRate = calculateSuccessRate(scenario, completionTime)
    const accessibilityScore = calculateAccessibilityScore(scenario)
    const usabilityScore = calculateUsabilityScore(scenario)
    const stressImpact = calculateStressImpact()
    
    return {
      scenarioId: scenario.id,
      participantId,
      timestamp: new Date(),
      completed: completionTime <= scenario.timeLimit,
      timeToCompletion: completionTime,
      successRate,
      accessibilityScore,
      usabilityScore,
      stressImpact,
      criticalFailures,
      recommendations: generateRecommendations(scenario, successRate, accessibilityScore),
      participantFeedback: ''
    }
  }

  const calculateSuccessRate = (scenario: CrisisScenario, completionTime: number): number => {
    let weightedScore = 0
    let totalWeight = 0
    
    scenario.successCriteria.forEach(criterion => {
      let met = false
      
      switch (criterion.metric) {
        case 'time':
          met = completionTime <= (criterion.target as number)
          break
        case 'completion':
          met = criterion.target as boolean // Would be dynamically determined in real implementation
          break
        case 'accuracy':
          met = Math.random() > 0.2 // Placeholder - would measure actual accuracy
          break
        default:
          met = true
      }
      
      if (met) {
        weightedScore += criterion.weight
      }
      totalWeight += criterion.weight
    })
    
    return totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0
  }

  const calculateAccessibilityScore = (scenario: CrisisScenario): number => {
    // Base score on how well accessibility requirements were met
    let score = 85 // Base score
    
    // Deduct for critical failures affecting accessibility
    const accessibilityFailures = criticalFailures.filter(f => f.type === 'accessibility')
    score -= accessibilityFailures.length * 15
    
    // Adjust based on participant's accessibility profile
    if (accessibilityProfile.motorImpairment && !scenario.accessibilityRequirements.includes('large_touch_targets')) {
      score -= 20
    }
    
    if (accessibilityProfile.visualImpairment && !scenario.accessibilityRequirements.includes('high_contrast')) {
      score -= 20
    }
    
    return Math.max(0, Math.min(100, score))
  }

  const calculateUsabilityScore = (scenario: CrisisScenario): number => {
    // Base usability score considering crisis context
    let score = 80
    
    // Deduct for navigation and usability failures
    const usabilityFailures = criticalFailures.filter(f => 
      f.type === 'navigation' || f.type === 'crisis_access'
    )
    score -= usabilityFailures.length * 10
    
    // Adjust for stress level impact
    if (scenario.stressLevel === 'extreme') {
      score = score * 0.9 // Higher difficulty in extreme stress
    }
    
    return Math.max(0, Math.min(100, score))
  }

  const calculateStressImpact = (): number => {
    // Return the average stress level during testing
    return participantStress
  }

  const generateRecommendations = (
    scenario: CrisisScenario, 
    successRate: number, 
    accessibilityScore: number
  ): string[] => {
    const recommendations: string[] = []
    
    if (successRate < 70) {
      recommendations.push('Simplify crisis navigation path - too complex for stress situations')
      recommendations.push('Increase touch target sizes for crisis scenarios')
      recommendations.push('Add clear visual hierarchy to guide users during crisis')
    }
    
    if (accessibilityScore < 80) {
      recommendations.push('Improve accessibility features for motor impairments')
      recommendations.push('Add more voice control options for crisis scenarios')
      recommendations.push('Enhance screen reader compatibility for crisis resources')
    }
    
    if (criticalFailures.some(f => f.type === 'crisis_access')) {
      recommendations.push('CRITICAL: Crisis resources must be accessible within 15 seconds')
      recommendations.push('CRITICAL: Add multiple pathways to access crisis support')
    }
    
    // Scenario-specific recommendations
    if (scenario.id === 'panic_attack_low_battery') {
      recommendations.push('Optimize battery usage during crisis scenarios')
      recommendations.push('Preload critical crisis resources to reduce battery drain')
    }
    
    if (scenario.id === 'offline_crisis_support') {
      recommendations.push('Expand offline crisis resource library')
      recommendations.push('Improve local caching of emergency contacts')
    }
    
    return recommendations
  }

  const recordCriticalFailure = (failure: CriticalFailure) => {
    setCriticalFailures(prev => [...prev, failure])
    console.warn('Critical failure recorded:', failure)
  }

  const monitorParticipantStress = () => {
    // In real implementation, would use heart rate, interaction patterns, etc.
    // For now, randomly vary stress level
    const currentStress = participantStress
    const variation = Math.random() * 2 - 1 // -1 to 1
    const newStress = Math.max(1, Math.min(5, currentStress + variation)) as 1 | 2 | 3 | 4 | 5
    setParticipantStress(newStress)
    
    // Trigger intervention if stress becomes too high
    if (newStress >= 4 && currentScenario) {
      console.log('High stress detected - considering test intervention')
    }
  }

  const pauseTest = () => {
    setTestingActive(false)
    currentConditions.forEach(condition => condition.restoration())
    if (timerRef.current) clearTimeout(timerRef.current)
    if (stressMonitorRef.current) clearInterval(stressMonitorRef.current)
  }

  const resumeTest = () => {
    if (!currentScenario) return
    setTestingActive(true)
    currentConditions.forEach(condition => condition.implementation())
    
    // Restart timers with remaining time
    const remainingTime = currentScenario.timeLimit - ((new Date().getTime() - (startTime?.getTime() || 0)) / 1000)
    if (remainingTime > 0) {
      timerRef.current = setTimeout(endCrisisTest, remainingTime * 1000)
    }
  }

  const getConditionStatusIcon = (condition: TestingCondition) => {
    const icons = {
      battery: <Battery className={`h-4 w-4 ${condition.severity === 'severe' ? 'text-red-500' : 'text-yellow-500'}`} />,
      network: condition.severity === 'severe' ? <WifiOff className="h-4 w-4 text-red-500" /> : <Wifi className="h-4 w-4 text-yellow-500" />,
      tremors: <Accessibility className="h-4 w-4 text-blue-500" />,
      stress: <AlertTriangle className={`h-4 w-4 ${condition.severity === 'severe' ? 'text-red-500' : 'text-orange-500'}`} />,
      cognitive_load: <Eye className="h-4 w-4 text-purple-500" />,
      distraction: <RotateCcw className="h-4 w-4 text-gray-500" />
    }
    return icons[condition.type] || <AlertTriangle className="h-4 w-4" />
  }

  const renderScenarioSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-medium text-purple-800 mb-2">
          Mobile Crisis Experience Testing
        </h2>
        <p className="text-purple-600">
          These tests simulate real crisis conditions to validate mobile accessibility and usability
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {crisisTestingScenarios.map((scenario) => (
          <Card key={scenario.id} className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Smartphone className="h-5 w-5" />
                {scenario.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  scenario.stressLevel === 'extreme' ? 'bg-red-100 text-red-800' :
                  scenario.stressLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                  scenario.stressLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {scenario.stressLevel.toUpperCase()} STRESS
                </span>
                <span className="text-xs text-gray-500">
                  <Timer className="h-3 w-3 inline mr-1" />
                  {scenario.timeLimit}s limit
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm">{scenario.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-800">Testing Conditions:</h4>
                <div className="flex flex-wrap gap-2">
                  {scenario.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                      {getConditionStatusIcon(condition)}
                      <span>{condition.type.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-800">Accessibility Requirements:</h4>
                <div className="flex flex-wrap gap-1">
                  {scenario.accessibilityRequirements.map((req, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {req.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => startCrisisTest(scenario)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                Start Crisis Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderActiveTest = () => {
    if (!currentScenario || !startTime) return null
    
    const elapsedTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
    const remainingTime = Math.max(0, currentScenario.timeLimit - elapsedTime)
    
    return (
      <div className="space-y-6">
        {/* Test Header */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium text-blue-800">{currentScenario.name}</h3>
                <p className="text-blue-600">Crisis scenario in progress</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-medium text-blue-800">{remainingTime}s</div>
                  <div className="text-xs text-blue-600">remaining</div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={testingActive ? pauseTest : resumeTest}
                    variant="outline"
                    size="sm"
                  >
                    {testingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    onClick={endCrisisTest}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700"
                  >
                    End Test
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Conditions */}
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Active Testing Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentConditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded">
                {getConditionStatusIcon(condition)}
                <div>
                  <div className="font-medium text-orange-800 capitalize">
                    {condition.type.replace('_', ' ')} - {condition.severity}
                  </div>
                  <div className="text-sm text-orange-600">{condition.description}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Stress Monitor */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Participant Wellbeing Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Current stress level:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      level <= participantStress
                        ? level <= 2 ? 'bg-green-500 text-white' :
                          level <= 3 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>
            
            {participantStress >= 4 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">High stress detected</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Consider pausing the test or providing additional support
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Crisis Navigation Test Interface */}
        <Card className="border-4 border-red-200 bg-red-50">
          <CardHeader className="bg-red-100">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Crisis Navigation Test
            </CardTitle>
            <p className="text-red-600">Navigate to crisis resources using the conditions above</p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="h-16 bg-red-600 hover:bg-red-700 text-white text-lg"
                onClick={() => console.log('Crisis hotline accessed')}
              >
                Emergency Crisis Line
              </Button>
              
              <Button 
                className="h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg"
                onClick={() => console.log('Crisis text accessed')}
              >
                Crisis Text Support
              </Button>
              
              <Button 
                className="h-16 bg-green-600 hover:bg-green-700 text-white text-lg"
                onClick={() => console.log('Local resources accessed')}
              >
                Local Crisis Resources
              </Button>
              
              <Button 
                className="h-16 bg-purple-600 hover:bg-purple-700 text-white text-lg"
                onClick={() => console.log('Self-care tools accessed')}
              >
                Immediate Self-Care
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => {
                  recordCriticalFailure({
                    type: 'crisis_access',
                    description: 'Successfully accessed crisis support',
                    impact: 'low',
                    context: 'Navigation test completion',
                    timestamp: new Date()
                  })
                  endCrisisTest()
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Crisis Navigation Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {currentScenario ? renderActiveTest() : renderScenarioSelection()}
      </div>
    </div>
  )
}

export default MobileCrisisExperienceTesting