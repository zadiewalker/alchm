'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Brain,
  Heart,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Shield,
  Star,
  ChevronRight,
  ChevronLeft,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  Download,
  Share,
  Calendar,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  category: 'self-awareness' | 'self-regulation' | 'empathy' | 'social-skills' | 'motivation';
  question: string;
  type: 'scale' | 'scenario' | 'reflection';
  options?: string[];
  scenarios?: {
    situation: string;
    responses: { text: string; score: number; reasoning: string }[];
  };
}

interface AssessmentResult {
  category: string;
  score: number;
  maxScore: number;
  level: 'developing' | 'competent' | 'advanced' | 'mastery';
  insights: string[];
  growthRecommendations: string[];
  therapeuticAreas: string[];
}

interface GrowthPlan {
  area: string;
  currentLevel: number;
  targetLevel: number;
  timeframe: string;
  activities: string[];
  milestones: string[];
  resources: string[];
}

export default function EmotionalIntelligenceAssessment() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'assessment' | 'results' | 'growth-plan'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: 'sa1',
      category: 'self-awareness',
      question: 'How well do you recognize your emotional triggers throughout the day?',
      type: 'scale'
    },
    {
      id: 'sa2',
      category: 'self-awareness',
      question: 'You notice feeling irritated during a conversation, but you\'re not sure why. What do you do?',
      type: 'scenario',
      scenarios: {
        situation: 'During a team meeting, you find yourself becoming increasingly irritated, but the topic seems routine and you can\'t identify why you\'re reacting this way.',
        responses: [
          {
            text: 'Continue the meeting but make a mental note to reflect on this feeling later',
            score: 3,
            reasoning: 'Shows awareness of the emotion and commitment to self-reflection'
          },
          {
            text: 'Take a brief moment to scan your body and thoughts to understand the source',
            score: 5,
            reasoning: 'Demonstrates real-time emotional awareness and self-investigation skills'
          },
          {
            text: 'Push through the feeling and focus on the meeting content',
            score: 1,
            reasoning: 'Avoids emotional awareness and misses learning opportunity'
          },
          {
            text: 'Ask for a brief break to collect yourself',
            score: 4,
            reasoning: 'Shows self-awareness and self-care, though could be more specific'
          }
        ]
      }
    },
    {
      id: 'sr1',
      category: 'self-regulation',
      question: 'When facing intense emotions, how effectively can you choose your response rather than react impulsively?',
      type: 'scale'
    },
    {
      id: 'sr2',
      category: 'self-regulation',
      question: 'You receive harsh criticism about work you\'re proud of. Your initial reaction is anger and defensiveness.',
      type: 'scenario',
      scenarios: {
        situation: 'Your supervisor provides harsh feedback on a project you spent weeks perfecting. You immediately feel angry and want to defend your work.',
        responses: [
          {
            text: 'Take a deep breath and ask clarifying questions about the feedback',
            score: 5,
            reasoning: 'Excellent emotional regulation and constructive response'
          },
          {
            text: 'Thank them for the feedback and ask for time to process it before responding',
            score: 4,
            reasoning: 'Good self-regulation, creates space for thoughtful response'
          },
          {
            text: 'Immediately explain your reasoning and defend your choices',
            score: 2,
            reasoning: 'Reactive response, though understandable'
          },
          {
            text: 'Accept the criticism without question, even though you disagree',
            score: 1,
            reasoning: 'Avoids conflict but doesn\'t practice healthy self-advocacy'
          }
        ]
      }
    },
    {
      id: 'emp1',
      category: 'empathy',
      question: 'How accurately can you read the emotional states of others, even when they try to hide them?',
      type: 'scale'
    },
    {
      id: 'emp2',
      category: 'empathy',
      question: 'A colleague seems withdrawn and quiet during a usually energetic team meeting.',
      type: 'scenario',
      scenarios: {
        situation: 'Your normally talkative colleague is unusually quiet and withdrawn during the team meeting. Their body language suggests something might be wrong.',
        responses: [
          {
            text: 'Check in with them privately after the meeting to see if they\'re okay',
            score: 5,
            reasoning: 'Excellent empathy with appropriate timing and respect for privacy'
          },
          {
            text: 'Ask them directly in the meeting if everything is alright',
            score: 2,
            reasoning: 'Shows concern but lacks consideration for their comfort and privacy'
          },
          {
            text: 'Make a mental note but don\'t act, assuming they\'ll reach out if needed',
            score: 3,
            reasoning: 'Respects boundaries but misses opportunity to offer support'
          },
          {
            text: 'Send them a supportive message letting them know you\'re available to talk',
            score: 4,
            reasoning: 'Good empathy with low-pressure support offering'
          }
        ]
      }
    },
    {
      id: 'ss1',
      category: 'social-skills',
      question: 'How comfortable are you navigating difficult conversations while maintaining relationships?',
      type: 'scale'
    },
    {
      id: 'mot1',
      category: 'motivation',
      question: 'How well do you maintain emotional resilience during challenging periods?',
      type: 'scale'
    }
  ];

  const processAssessmentResults = () => {
    setIsProcessing(true);
    
    // Simulate assessment processing
    setTimeout(() => {
      const results: AssessmentResult[] = [
        {
          category: 'Self-Awareness',
          score: 42,
          maxScore: 50,
          level: 'advanced',
          insights: [
            'You demonstrate strong ability to recognize your emotional states in real-time',
            'Your self-reflection practices are well-developed and consistent',
            'You show awareness of emotional triggers and their impact on behavior'
          ],
          growthRecommendations: [
            'Practice body-scan meditation to deepen somatic awareness',
            'Keep an emotion-trigger journal for pattern recognition',
            'Explore the connection between values and emotional responses'
          ],
          therapeuticAreas: [
            'Mindfulness-based self-awareness',
            'Somatic experiencing practices',
            'Values clarification work'
          ]
        },
        {
          category: 'Self-Regulation',
          score: 35,
          maxScore: 50,
          level: 'competent',
          insights: [
            'You have good foundational skills for managing intense emotions',
            'Response-choice awareness is developing but inconsistent under stress',
            'You show strength in creating space between trigger and response'
          ],
          growthRecommendations: [
            'Develop personalized coping strategies for high-stress situations',
            'Practice the STOP technique (Stop, Take a breath, Observe, Proceed)',
            'Build a toolkit of regulation strategies for different emotional intensities'
          ],
          therapeuticAreas: [
            'Cognitive-behavioral regulation techniques',
            'Distress tolerance skills',
            'Emotional surfing practices'
          ]
        },
        {
          category: 'Empathy',
          score: 46,
          maxScore: 50,
          level: 'advanced',
          insights: [
            'Exceptional ability to attune to others\' emotional states',
            'Strong perspective-taking skills with appropriate boundaries',
            'Natural sensitivity to nonverbal emotional cues'
          ],
          growthRecommendations: [
            'Practice empathic boundaries to prevent emotional overwhelm',
            'Develop skills for supporting others without taking on their emotions',
            'Learn cultural competency in emotional expression and reading'
          ],
          therapeuticAreas: [
            'Boundary setting and maintenance',
            'Cultural empathy development',
            'Compassion fatigue prevention'
          ]
        },
        {
          category: 'Social Skills',
          score: 38,
          maxScore: 50,
          level: 'competent',
          insights: [
            'Good foundation in interpersonal communication',
            'Comfortable with routine social interactions',
            'Room for growth in conflict navigation and difficult conversations'
          ],
          growthRecommendations: [
            'Practice nonviolent communication techniques',
            'Develop skills for giving and receiving feedback',
            'Learn strategies for managing interpersonal anxiety'
          ],
          therapeuticAreas: [
            'Communication skills training',
            'Conflict resolution strategies',
            'Assertiveness training'
          ]
        },
        {
          category: 'Motivation',
          score: 40,
          maxScore: 50,
          level: 'competent',
          insights: [
            'Strong internal motivation and goal-directed behavior',
            'Good resilience in face of setbacks',
            'Clear sense of personal values and purpose'
          ],
          growthRecommendations: [
            'Develop strategies for maintaining motivation during difficult periods',
            'Practice self-compassion to sustain long-term growth',
            'Create accountability systems for personal development goals'
          ],
          therapeuticAreas: [
            'Resilience building practices',
            'Self-compassion cultivation',
            'Goal-setting and achievement strategies'
          ]
        }
      ];

      setAssessmentResults(results);
      
      // Generate growth plan
      const plan: GrowthPlan[] = [
        {
          area: 'Self-Regulation Enhancement',
          currentLevel: 70,
          targetLevel: 85,
          timeframe: '3 months',
          activities: [
            'Daily mindfulness practice (10-15 minutes)',
            'Weekly stress response journaling',
            'Monthly check-ins with support system'
          ],
          milestones: [
            'Week 2: Establish consistent meditation practice',
            'Month 1: Identify top 3 stress triggers',
            'Month 2: Implement personalized coping strategies',
            'Month 3: Achieve 85% confidence in emotional regulation'
          ],
          resources: [
            'Guided meditation apps',
            'Emotion regulation workbooks',
            'Professional therapy or coaching support'
          ]
        },
        {
          area: 'Social Skills Development',
          currentLevel: 76,
          targetLevel: 90,
          timeframe: '4 months',
          activities: [
            'Practice difficult conversation scenarios',
            'Join communication skills workshop or group',
            'Seek feedback from trusted relationships'
          ],
          milestones: [
            'Month 1: Complete nonviolent communication training',
            'Month 2: Practice with 3 difficult conversations',
            'Month 3: Implement feedback systems',
            'Month 4: Achieve comfort with challenging interpersonal situations'
          ],
          resources: [
            'Communication skills courses',
            'Role-playing practice groups',
            'Relationship therapy or coaching'
          ]
        }
      ];

      setGrowthPlan(plan);
      setIsProcessing(false);
      setCurrentStep('results');
    }, 3000);
  };

  const handleScaleResponse = (questionId: string, value: number[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value[0]
    }));
  };

  const handleScenarioResponse = (questionId: string, responseIndex: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: responseIndex
    }));
  };

  const renderIntro = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-purple-100 rounded-full">
            <Brain className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Advanced Emotional Intelligence Assessment</h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional-grade evaluation designed for deep self-understanding and therapeutic alignment
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-medium">What You'll Discover</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Detailed analysis across 5 core EI domains</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Personalized growth recommendations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Therapeutic integration guidance</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Professional development roadmap</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-medium">Assessment Details</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>15-20 minutes to complete</span>
            </li>
            <li className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>Mix of scenarios and self-reflection</span>
            </li>
            <li className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>Evidence-based psychological frameworks</span>
            </li>
            <li className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>Results suitable for therapy sessions</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-medium mb-2">Professional-Grade Assessment</h3>
            <p className="text-sm text-gray-600 mb-4">
              This assessment is designed to therapeutic standards and can be shared with mental health 
              professionals to support your treatment goals. Your responses are private and secure.
            </p>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button 
          onClick={() => setCurrentStep('assessment')}
          size="lg"
          className="px-8"
        >
          Begin Assessment
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderAssessment = () => {
    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-8">
          <span>Question {currentQuestionIndex + 1} of {assessmentQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <Badge className="mb-4 capitalize">
              {currentQuestion.category.replace('-', ' ')}
            </Badge>
            <h2 className="text-xl font-medium mb-4">{currentQuestion.question}</h2>
          </div>

          {currentQuestion.type === 'scale' && (
            <div className="space-y-6">
              <div className="px-4">
                <Slider
                  value={[responses[currentQuestion.id] || 5]}
                  onValueChange={(value) => handleScaleResponse(currentQuestion.id, value)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 px-2">
                <span>Rarely/Never</span>
                <span>Sometimes</span>
                <span>Usually/Always</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-purple-600">
                  {responses[currentQuestion.id] || 5}/10
                </div>
              </div>
            </div>
          )}

          {currentQuestion.type === 'scenario' && currentQuestion.scenarios && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Scenario:</h3>
                <p className="text-gray-700">{currentQuestion.scenarios.situation}</p>
              </div>
              
              <div className="space-y-3">
                {currentQuestion.scenarios.responses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleScenarioResponse(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      responses[currentQuestion.id] === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {response.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestionIndex === assessmentQuestions.length - 1 ? (
            <Button
              onClick={processAssessmentResults}
              disabled={!responses[currentQuestion.id]}
            >
              Complete Assessment
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={!responses[currentQuestion.id]}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="flex justify-center">
        <div className="p-4 bg-purple-100 rounded-full">
          <Sparkles className="h-12 w-12 text-purple-600 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-medium">Analyzing Your Responses</h2>
      <p className="text-gray-600">
        Our advanced algorithms are processing your assessment responses and generating 
        personalized insights and recommendations...
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-purple-600 h-2 rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 rounded-full">
            <Award className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Your Emotional Intelligence Profile</h1>
        <p className="text-xl text-gray-600">
          Comprehensive analysis with therapeutic-grade insights and recommendations
        </p>
      </div>

      {/* Overall Score */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium mb-2">Overall EI Score</h2>
            <p className="text-gray-600">Across all five core domains</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-medium text-purple-600">
              {Math.round(assessmentResults.reduce((sum, result) => sum + result.score, 0) / assessmentResults.length)}
            </div>
            <div className="text-sm text-gray-600">out of 50</div>
            <Badge className="mt-2">Advanced Level</Badge>
          </div>
        </div>
      </Card>

      {/* Domain Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {assessmentResults.map((result) => (
          <Card key={result.category} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{result.category}</h3>
              <Badge variant={
                result.level === 'mastery' ? 'default' :
                result.level === 'advanced' ? 'secondary' :
                result.level === 'competent' ? 'outline' : 'destructive'
              }>
                {result.level}
              </Badge>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Score</span>
                <span>{result.score}/{result.maxScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-2">Key Insights</h4>
                <ul className="text-xs space-y-1">
                  {result.insights.slice(0, 2).map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                View Detailed Analysis
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => setCurrentStep('growth-plan')}>
          <Target className="h-4 w-4 mr-2" />
          Create Growth Plan
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <Button variant="outline">
          <Share className="h-4 w-4 mr-2" />
          Share with Therapist
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Check-in
        </Button>
      </div>
    </div>
  );

  const renderGrowthPlan = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Target className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Your Personalized Growth Plan</h1>
        <p className="text-xl text-gray-600">
          Evidence-based roadmap for emotional intelligence development
        </p>
      </div>

      {growthPlan.map((plan, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">{plan.area}</h2>
            <Badge>{plan.timeframe}</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-3">Progress Tracking</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Level</span>
                    <span>{plan.currentLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${plan.currentLevel}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Target Level</span>
                    <span>{plan.targetLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${plan.targetLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Key Milestones</h3>
              <ul className="space-y-2">
                {plan.milestones.slice(0, 3).map((milestone, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Recommended Activities</h3>
              <ul className="space-y-2">
                {plan.activities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Resources & Support</h3>
              <ul className="space-y-2">
                {plan.resources.map((resource, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ))}

      <div className="text-center">
        <Button onClick={() => setCurrentStep('intro')}>
          <ArrowRight className="h-4 w-4 mr-2" />
          Start New Assessment
        </Button>
      </div>
    </div>
  );

  if (isProcessing) {
    return renderProcessing();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'assessment' && renderAssessment()}
      {currentStep === 'results' && renderResults()}
      {currentStep === 'growth-plan' && renderGrowthPlan()}
    </div>
  );
}