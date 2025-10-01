'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  Heart,
  Globe,
  Star,
  Compass,
  BookOpen,
  Users,
  Shield,
  Lightbulb,
  Target,
  Flower2,
  Mountain,
  Sunrise,
  Infinity,
  Eye,
  Feather,
  Flame,
  TreePine,
  Lotus,
  Crown,
  Building,
  Map,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Settings,
  Filter,
  Download,
  Share,
  Plus,
  Calendar,
  AlertTriangle,
  Info,
  Zap,
  Layers,
  GitBranch,
  Brain,
  Puzzle
} from 'lucide-react';

// Import AI systems
import SpiritualPathwayIntelligence from '@/ai/spiritual-pathway-intelligence';
import MultiFaithHealingIntegration from '@/ai/multi-faith-healing-integration';
import MeaningMakingPatternRecognition from '@/ai/meaning-making-pattern-recognition';
import SacredModalitiesMatching from '@/ai/sacred-modalities-matching';
import SpiritualGrowthTracking from '@/ai/spiritual-growth-tracking';

// Core types
interface PersonalizedPathway {
  id: string;
  title: string;
  description: string;
  spiritualFrameworks: string[];
  secularAlternatives: string[];
  culturalAdaptations: string[];
  healingModalities: HealingModalityRecommendation[];
  meaningMakingApproaches: string[];
  growthTracking: GrowthTrackingConfig;
  traumaConsiderations: TraumaConsideration[];
  communitySupport: CommunitySupport;
  professionalGuidance: ProfessionalGuidance;
  progressiveLearning: ProgressiveStep[];
  expectedOutcomes: string[];
  timeCommitment: string;
  difficulty: 'foundation' | 'growth' | 'advanced' | 'integration';
  matchScore: number;
  reasoning: string[];
  icon: React.ElementType;
  gradient: string;
}

interface HealingModalityRecommendation {
  modalityId: string;
  name: string;
  tradition: string[];
  adaptations: string[];
  safetyNotes: string[];
  effectiveness: number;
  culturalProtocol: string[];
}

interface TraumaConsideration {
  type: string;
  warning: string;
  adaptation: string;
  alternative: string;
  supportRequired: boolean;
}

interface CommunitySupport {
  available: boolean;
  types: string[];
  culturallyAuthentic: boolean;
  peerMentors: boolean;
  safetyVerified: boolean;
}

interface ProfessionalGuidance {
  recommended: boolean;
  type: string[];
  specializations: string[];
  culturalCompetency: string[];
}

interface ProgressiveStep {
  phase: string;
  title: string;
  duration: string;
  activities: string[];
  milestones: string[];
  supportNeeds: string[];
}

interface GrowthTrackingConfig {
  dimensions: string[];
  metrics: string[];
  culturalFraming: string[];
  meaningMakingTracking: string[];
  frequency: string;
}

interface UserSpiritualProfile {
  spiritualOpenness: string;
  religiousTraditions: string[];
  culturalBackground: string[];
  meaningMakingStyle: string;
  traumaHistory: any;
  currentChallenges: string[];
  healingGoals: string[];
  preferences: any;
}

export default function PersonalizedHealingPathways() {
  const [pathways, setPathways] = useState<PersonalizedPathway[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<PersonalizedPathway | null>(null);
  const [userProfile, setUserProfile] = useState<UserSpiritualProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'customization' | 'tracking'>('overview');
  const [filters, setFilters] = useState({
    spiritualOpenness: 'all',
    tradition: 'all',
    difficulty: 'all',
    timeCommitment: 'all'
  });

  // AI system instances
  const [spiritualAI] = useState(() => SpiritualPathwayIntelligence.getInstance());
  const [healingIntegration] = useState(() => MultiFaithHealingIntegration.getInstance());
  const [meaningMakingAI] = useState(() => MeaningMakingPatternRecognition.getInstance());
  const [modalitiesMatching] = useState(() => SacredModalitiesMatching.getInstance());
  const [growthTracking] = useState(() => SpiritualGrowthTracking.getInstance());

  useEffect(() => {
    initializePersonalizedPathways();
  }, []);

  const initializePersonalizedPathways = async () => {
    try {
      setIsLoading(true);

      // Mock user ID - in real app would come from auth
      const userId = 'user123';

      // Build user spiritual profile
      const profile = await buildUserSpiritualProfile(userId);
      setUserProfile(profile);

      // Generate personalized pathways
      const personalizedPathways = await generatePersonalizedPathways(userId, profile);
      setPathways(personalizedPathways);

    } catch (error) {
      console.error('Error initializing personalized pathways:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildUserSpiritualProfile = async (userId: string): Promise<UserSpiritualProfile> => {
    // In real implementation, this would gather data from multiple sources
    return {
      spiritualOpenness: 'spiritual-not-religious',
      religiousTraditions: ['Buddhism', 'Christianity'],
      culturalBackground: ['Western', 'Asian-American'],
      meaningMakingStyle: 'narrative-experiential',
      traumaHistory: {
        religiousTrauma: false,
        generalTrauma: true,
        healingStage: 'integration'
      },
      currentChallenges: ['anxiety', 'life-transition', 'meaning-seeking'],
      healingGoals: ['inner-peace', 'community-connection', 'purpose-clarity'],
      preferences: {
        evidenceBased: true,
        communityOriented: true,
        creativelySatisfying: true,
        movementOriented: false
      }
    };
  };

  const generatePersonalizedPathways = async (
    userId: string, 
    profile: UserSpiritualProfile
  ): Promise<PersonalizedPathway[]> => {
    // Generate AI-driven pathway recommendations
    const mockPathways: PersonalizedPathway[] = [
      {
        id: 'integrative-meaning-making',
        title: 'Integrative Meaning-Making Journey',
        description: 'A personalized pathway combining Buddhist mindfulness, Christian contemplation, and secular psychology to create coherent life meaning',
        spiritualFrameworks: ['Buddhist mindfulness', 'Christian contemplative tradition', 'Humanistic psychology'],
        secularAlternatives: ['Narrative therapy', 'Positive psychology', 'Existential therapy'],
        culturalAdaptations: [
          'Honors both Asian Buddhist and Western Christian influences',
          'Includes bicultural identity exploration',
          'Adapts practices for Western individualistic context'
        ],
        healingModalities: [
          {
            modalityId: 'loving-kindness-meditation',
            name: 'Loving-Kindness Meditation',
            tradition: ['Buddhism'],
            adaptations: ['Secular language options', 'Christian prayer integration'],
            safetyNotes: ['Start with self-compassion focus'],
            effectiveness: 90,
            culturalProtocol: ['Acknowledge Buddhist origins', 'Learn basic Buddhist concepts']
          },
          {
            modalityId: 'lectio-divina-adapted',
            name: 'Sacred Reading Practice',
            tradition: ['Christian contemplative'],
            adaptations: ['Include Buddhist texts', 'Philosophical literature options'],
            safetyNotes: ['Choose personally meaningful texts'],
            effectiveness: 85,
            culturalProtocol: ['Honor Christian contemplative tradition', 'Respect sacred texts']
          },
          {
            modalityId: 'narrative-integration',
            name: 'Sacred Story Integration',
            tradition: ['Universal'],
            adaptations: ['Multi-cultural narrative frameworks', 'Interfaith wisdom integration'],
            safetyNotes: ['Trauma-informed storytelling approach'],
            effectiveness: 88,
            culturalProtocol: ['Respect all wisdom traditions involved']
          }
        ],
        meaningMakingApproaches: [
          'Narrative coherence development',
          'Cross-cultural wisdom integration',
          'Value-based living alignment',
          'Community meaning exploration'
        ],
        growthTracking: {
          dimensions: ['Meaning clarity', 'Spiritual integration', 'Cultural harmony', 'Community connection'],
          metrics: ['Narrative coherence score', 'Wisdom integration level', 'Cultural comfort index'],
          culturalFraming: ['Buddhist progress markers', 'Christian growth stages', 'Psychological development'],
          meaningMakingTracking: ['Story evolution', 'Value alignment', 'Purpose clarity'],
          frequency: 'Weekly reflection with monthly assessment'
        },
        traumaConsiderations: [
          {
            type: 'General trauma sensitivity',
            warning: 'Deep spiritual work may trigger unprocessed trauma',
            adaptation: 'Gentle pacing with trauma-informed support',
            alternative: 'Stabilization-focused approach first',
            supportRequired: true
          }
        ],
        communitySupport: {
          available: true,
          types: ['Interfaith dialogue groups', 'Buddhist-Christian study circles', 'Secular mindfulness communities'],
          culturallyAuthentic: true,
          peerMentors: true,
          safetyVerified: true
        },
        professionalGuidance: {
          recommended: true,
          type: ['Spiritual director', 'Interfaith counselor'],
          specializations: ['Religious diversity', 'Cultural integration', 'Trauma-informed spirituality'],
          culturalCompetency: ['Buddhist understanding', 'Christian contemplative knowledge', 'Multicultural competency']
        },
        progressiveLearning: [
          {
            phase: 'Foundation',
            title: 'Spiritual Framework Exploration',
            duration: '4-6 weeks',
            activities: [
              'Introduction to Buddhist mindfulness',
              'Christian contemplative prayer basics',
              'Secular meaning-making tools',
              'Cultural background exploration'
            ],
            milestones: [
              'Comfortable with basic practices',
              'Understanding of each tradition',
              'Personal adaptation preferences identified'
            ],
            supportNeeds: ['Educational resources', 'Practice guidance', 'Cultural context learning']
          },
          {
            phase: 'Integration',
            title: 'Personal Practice Development',
            duration: '8-12 weeks',
            activities: [
              'Daily contemplative practice',
              'Weekly sacred reading',
              'Bi-weekly meaning-making reflection',
              'Community engagement exploration'
            ],
            milestones: [
              'Established daily practice',
              'Integrated personal approach',
              'Community connections made'
            ],
            supportNeeds: ['Ongoing guidance', 'Peer support', 'Practice troubleshooting']
          },
          {
            phase: 'Living Integration',
            title: 'Wisdom in Daily Life',
            duration: 'Ongoing',
            activities: [
              'Life application of integrated wisdom',
              'Sharing insights with others',
              'Continued learning and growth',
              'Community leadership opportunities'
            ],
            milestones: [
              'Consistent wise living',
              'Mentoring others',
              'Cultural bridge-building',
              'Ongoing spiritual maturation'
            ],
            supportNeeds: ['Advanced mentorship', 'Leadership development', 'Ongoing community']
          }
        ],
        expectedOutcomes: [
          'Clear sense of life meaning and purpose',
          'Integrated spiritual identity honoring multiple traditions',
          'Enhanced emotional resilience and peace',
          'Strong community connections across cultures',
          'Capacity to guide others in similar integration',
          'Healed relationship with cultural diversity'
        ],
        timeCommitment: '30-60 minutes daily practice, 2 hours weekly community',
        difficulty: 'growth',
        matchScore: 94,
        reasoning: [
          'Perfect alignment with your multi-traditional background',
          'Addresses your meaning-seeking and community goals',
          'Integrates evidence-based and spiritual approaches',
          'Honors both Buddhist and Christian influences',
          'Supports bicultural identity integration',
          'Provides trauma-informed spiritual growth'
        ],
        icon: Infinity,
        gradient: 'from-purple-400/20 to-blue-600/20'
      },
      {
        id: 'contemplative-healing-circle',
        title: 'Contemplative Healing Circle',
        description: 'Community-centered healing pathway combining group contemplative practices with individual spiritual direction',
        spiritualFrameworks: ['Interfaith contemplative tradition', 'Community healing wisdom'],
        secularAlternatives: ['Group therapy integration', 'Secular meditation communities'],
        culturalAdaptations: [
          'Multicultural contemplative practices',
          'Indigenous circle wisdom integration',
          'Cultural healing approaches'
        ],
        healingModalities: [
          {
            modalityId: 'group-contemplation',
            name: 'Interfaith Contemplative Practice',
            tradition: ['Multiple traditions'],
            adaptations: ['Rotating cultural leadership', 'Universal contemplative forms'],
            safetyNotes: ['Culturally safe environment', 'Trauma-informed group guidelines'],
            effectiveness: 92,
            culturalProtocol: ['Honor all traditions equally', 'Cultural education component']
          }
        ],
        meaningMakingApproaches: [
          'Community wisdom integration',
          'Collective healing participation',
          'Cultural wisdom sharing',
          'Contemplative dialogue'
        ],
        growthTracking: {
          dimensions: ['Community connection', 'Contemplative depth', 'Cultural appreciation', 'Healing progress'],
          metrics: ['Group participation quality', 'Contemplative skill development', 'Cultural bridge-building'],
          culturalFraming: ['Community healing traditions', 'Contemplative progress markers'],
          meaningMakingTracking: ['Community meaning exploration', 'Shared wisdom integration'],
          frequency: 'Weekly group reflection, monthly individual assessment'
        },
        traumaConsiderations: [
          {
            type: 'Group trauma sensitivity',
            warning: 'Group spiritual practice may trigger interpersonal trauma',
            adaptation: 'Careful group screening and trauma-informed facilitation',
            alternative: 'Individual preparation before group participation',
            supportRequired: true
          }
        ],
        communitySupport: {
          available: true,
          types: ['Interfaith contemplative circles', 'Cultural healing communities', 'Trauma-informed spiritual groups'],
          culturallyAuthentic: true,
          peerMentors: true,
          safetyVerified: true
        },
        professionalGuidance: {
          recommended: true,
          type: ['Group spiritual director', 'Cultural healing facilitator'],
          specializations: ['Group spiritual direction', 'Interfaith facilitation', 'Trauma-informed community healing'],
          culturalCompetency: ['Multiple tradition knowledge', 'Cultural sensitivity training', 'Community healing wisdom']
        },
        progressiveLearning: [
          {
            phase: 'Preparation',
            title: 'Individual Contemplative Foundation',
            duration: '2-4 weeks',
            activities: [
              'Individual contemplative practice development',
              'Cultural self-exploration',
              'Group readiness assessment',
              'Trauma safety planning'
            ],
            milestones: [
              'Stable individual practice',
              'Cultural self-awareness',
              'Group participation readiness'
            ],
            supportNeeds: ['Individual spiritual direction', 'Cultural education', 'Trauma assessment']
          },
          {
            phase: 'Group Integration',
            title: 'Contemplative Community Participation',
            duration: '12-16 weeks',
            activities: [
              'Weekly group contemplative practice',
              'Cultural wisdom sharing',
              'Community healing activities',
              'Interfaith dialogue participation'
            ],
            milestones: [
              'Comfortable group participation',
              'Cultural bridge-building skills',
              'Community healing contribution'
            ],
            supportNeeds: ['Group facilitation', 'Cultural mentorship', 'Ongoing individual support']
          }
        ],
        expectedOutcomes: [
          'Deep sense of spiritual community',
          'Enhanced cultural appreciation and competency',
          'Developed contemplative practice in community',
          'Healing through community connection',
          'Leadership skills in interfaith cooperation',
          'Cultural bridge-building capacity'
        ],
        timeCommitment: '2-3 hours weekly group, 20-30 minutes daily individual practice',
        difficulty: 'growth',
        matchScore: 87,
        reasoning: [
          'Matches your community-oriented preferences',
          'Integrates multiple spiritual traditions safely',
          'Provides strong peer support system',
          'Honors cultural diversity in healing',
          'Addresses isolation and connection needs',
          'Builds interfaith competency'
        ],
        icon: Users,
        gradient: 'from-green-400/20 to-teal-600/20'
      },
      {
        id: 'creative-spiritual-expression',
        title: 'Creative Spiritual Expression Path',
        description: 'Healing through creative expression informed by diverse spiritual and cultural traditions',
        spiritualFrameworks: ['Sacred arts traditions', 'Creative spirituality', 'Cultural artistic expression'],
        secularAlternatives: ['Art therapy', 'Creative writing therapy', 'Expressive arts therapy'],
        culturalAdaptations: [
          'Multiple cultural artistic traditions',
          'Personal cultural expression exploration',
          'Cross-cultural creative dialogue'
        ],
        healingModalities: [
          {
            modalityId: 'sacred-art-creation',
            name: 'Sacred Art and Symbol Work',
            tradition: ['Multiple cultural traditions'],
            adaptations: ['Personal symbol system development', 'Cultural art form exploration'],
            safetyNotes: ['Trauma-informed creative expression', 'Cultural appropriation awareness'],
            effectiveness: 89,
            culturalProtocol: ['Honor artistic traditions', 'Cultural education in art forms']
          },
          {
            modalityId: 'contemplative-writing',
            name: 'Contemplative Writing Practice',
            tradition: ['Universal'],
            adaptations: ['Multiple language options', 'Cultural storytelling integration'],
            safetyNotes: ['Gentle trauma processing through writing'],
            effectiveness: 86,
            culturalProtocol: ['Respect storytelling traditions', 'Cultural narrative honoring']
          }
        ],
        meaningMakingApproaches: [
          'Creative meaning expression',
          'Cultural identity through art',
          'Symbolic meaning exploration',
          'Community creative sharing'
        ],
        growthTracking: {
          dimensions: ['Creative expression', 'Cultural identity', 'Spiritual symbolism', 'Community sharing'],
          metrics: ['Creative output quality', 'Cultural exploration depth', 'Symbolic meaning integration'],
          culturalFraming: ['Artistic tradition progress', 'Cultural expression development'],
          meaningMakingTracking: ['Creative meaning evolution', 'Symbol system development'],
          frequency: 'Weekly creative reflection, monthly meaning integration'
        },
        traumaConsiderations: [
          {
            type: 'Creative trauma processing',
            warning: 'Creative expression may access deep emotional material',
            adaptation: 'Trauma-informed creative guidance with safety planning',
            alternative: 'Stabilization-focused creative work first',
            supportRequired: true
          }
        ],
        communitySupport: {
          available: true,
          types: ['Sacred arts communities', 'Cultural creative groups', 'Interfaith artist circles'],
          culturallyAuthentic: true,
          peerMentors: true,
          safetyVerified: true
        },
        professionalGuidance: {
          recommended: true,
          type: ['Art therapist with spiritual training', 'Cultural arts mentor'],
          specializations: ['Sacred arts', 'Cultural artistic traditions', 'Trauma-informed creative therapy'],
          culturalCompetency: ['Multiple artistic traditions', 'Cultural sensitivity', 'Spiritual arts understanding']
        },
        progressiveLearning: [
          {
            phase: 'Creative Foundation',
            title: 'Sacred Arts Exploration',
            duration: '4-6 weeks',
            activities: [
              'Multiple cultural art form exploration',
              'Personal symbol system development',
              'Sacred art history learning',
              'Basic creative practice establishment'
            ],
            milestones: [
              'Chosen primary art form',
              'Basic symbol vocabulary',
              'Cultural appreciation developed'
            ],
            supportNeeds: ['Art instruction', 'Cultural education', 'Creative guidance']
          },
          {
            phase: 'Integration',
            title: 'Personal Creative Practice',
            duration: '8-12 weeks',
            activities: [
              'Regular creative spiritual practice',
              'Cultural art form deepening',
              'Community creative sharing',
              'Meaning-making through art'
            ],
            milestones: [
              'Established creative practice',
              'Cultural competency in chosen form',
              'Community creative participation'
            ],
            supportNeeds: ['Ongoing artistic mentorship', 'Cultural guidance', 'Creative community']
          }
        ],
        expectedOutcomes: [
          'Developed creative spiritual practice',
          'Enhanced cultural identity expression',
          'Healing through creative processing',
          'Community connection through shared creativity',
          'Cultural bridge-building through arts',
          'Personal symbol system for meaning-making'
        ],
        timeCommitment: '45-90 minutes daily creative practice, 2 hours weekly community',
        difficulty: 'growth',
        matchScore: 83,
        reasoning: [
          'Matches your creativity preference strongly',
          'Integrates cultural identity exploration',
          'Provides trauma-safe healing approach',
          'Builds community through shared creativity',
          'Honors multiple cultural artistic traditions',
          'Supports meaning-making through expression'
        ],
        icon: Flower2,
        gradient: 'from-pink-400/20 to-purple-600/20'
      }
    ];

    return mockPathways;
  };

  const renderOverviewSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
            <Sparkles className="h-16 w-16 text-purple-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Your Personalized Healing Pathways
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          AI-crafted spiritual and meaning-making journeys that honor your cultural background, 
          respect your beliefs, and support your unique healing path.
        </p>
      </div>

      {/* User Profile Summary */}
      {userProfile && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-blue-800">Your Spiritual Profile</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Spiritual Openness</h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {userProfile.spiritualOpenness.replace('-', ' ')}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Cultural Background</h3>
              <div className="flex flex-wrap gap-1">
                {userProfile.culturalBackground.map((culture, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-100 text-purple-800 text-xs">
                    {culture}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Healing Goals</h3>
              <div className="flex flex-wrap gap-1">
                {userProfile.healingGoals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="bg-green-100 text-green-800 text-xs">
                    {goal.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Pathway Recommendations */}
      <div className="grid gap-8">
        {pathways.map((pathway, index) => {
          const IconComponent = pathway.icon;
          
          return (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`p-8 bg-gradient-to-br ${pathway.gradient} border-2 hover:border-purple-300 transition-all duration-300 cursor-pointer group`}
                    onClick={() => setSelectedPathway(pathway)}>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/80 rounded-xl">
                      <IconComponent className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                        {pathway.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {pathway.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pathway.timeCommitment.split(',')[0]}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          {pathway.matchScore}% match
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-purple-600 text-white">
                      Recommended
                    </Badge>
                    {pathway.traumaConsiderations.length > 0 && (
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Trauma-Informed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  {pathway.description}
                </p>

                {/* Spiritual Frameworks */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Spiritual Frameworks & Alternatives
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 mr-2">Spiritual:</span>
                      <div className="inline-flex flex-wrap gap-1">
                        {pathway.spiritualFrameworks.map((framework, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            {framework}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 mr-2">Secular:</span>
                      <div className="inline-flex flex-wrap gap-1">
                        {pathway.secularAlternatives.map((alternative, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-gray-50 text-gray-700">
                            {alternative}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cultural Adaptations */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Cultural Adaptations
                  </h3>
                  <ul className="space-y-1">
                    {pathway.culturalAdaptations.slice(0, 2).map((adaptation, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {adaptation}
                      </li>
                    ))}
                    {pathway.culturalAdaptations.length > 2 && (
                      <li className="text-xs text-gray-500">
                        +{pathway.culturalAdaptations.length - 2} more adaptations
                      </li>
                    )}
                  </ul>
                </div>

                {/* Top Healing Modalities */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Healing Modalities
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {pathway.healingModalities.slice(0, 2).map((modality, idx) => (
                      <div key={idx} className="bg-white/60 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-800">{modality.name}</span>
                          <span className="text-xs text-green-600 font-medium">
                            {modality.effectiveness}% effective
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {modality.tradition.map((tradition, tidx) => (
                            <Badge key={tidx} variant="outline" className="text-xs bg-orange-50 text-orange-700">
                              {tradition}
                            </Badge>
                          ))}
                        </div>
                        {modality.adaptations.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            Includes {modality.adaptations.length} personal adaptation(s)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why This Pathway */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Why This Pathway?
                  </h3>
                  <div className="space-y-1">
                    {pathway.reasoning.slice(0, 3).map((reason, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Outcomes */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Expected Outcomes
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {pathway.expectedOutcomes.slice(0, 4).map((outcome, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <Zap className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progressive Learning */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Progressive Learning Path
                  </h3>
                  <div className="flex items-center gap-2">
                    {pathway.progressiveLearning.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-600">{idx + 1}</span>
                          </div>
                          <span className="text-xs text-gray-600 mt-1 text-center max-w-20">
                            {step.title}
                          </span>
                        </div>
                        {idx < pathway.progressiveLearning.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Safety & Support */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {pathway.communitySupport.available && (
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-500" />
                        Community Support
                      </span>
                    )}
                    {pathway.professionalGuidance.recommended && (
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-blue-500" />
                        Professional Guidance
                      </span>
                    )}
                    {pathway.traumaConsiderations.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        Trauma-Informed
                      </span>
                    )}
                  </div>
                  
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderDetailedView = () => {
    if (!selectedPathway) return null;

    const IconComponent = selectedPathway.icon;

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedPathway(null)}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Pathways
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <IconComponent className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{selectedPathway.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Badge className="bg-purple-600 text-white">
                    {selectedPathway.matchScore}% Match
                  </Badge>
                  <span>{selectedPathway.difficulty} Level</span>
                  <span>{selectedPathway.timeCommitment}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Plan
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Start Pathway
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Pathway Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {selectedPathway.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Spiritual Frameworks</h3>
                  <div className="space-y-2">
                    {selectedPathway.spiritualFrameworks.map((framework, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">{framework}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Secular Alternatives</h3>
                  <div className="space-y-2">
                    {selectedPathway.secularAlternatives.map((alternative, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{alternative}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Healing Modalities */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Healing Modalities
              </h2>
              <div className="space-y-4">
                {selectedPathway.healingModalities.map((modality, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">{modality.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">
                          {modality.effectiveness}% effective
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {modality.tradition.join(', ')}
                        </Badge>
                      </div>
                    </div>
                    
                    {modality.adaptations.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Personal Adaptations</h4>
                        <ul className="space-y-1">
                          {modality.adaptations.map((adaptation, aidx) => (
                            <li key={aidx} className="text-sm text-gray-600 flex items-start gap-2">
                              <Settings className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                              {adaptation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {modality.culturalProtocol.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Cultural Protocol</h4>
                        <ul className="space-y-1">
                          {modality.culturalProtocol.map((protocol, pidx) => (
                            <li key={pidx} className="text-sm text-gray-600 flex items-start gap-2">
                              <Globe className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              {protocol}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Progressive Learning Path */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Map className="h-5 w-5" />
                Progressive Learning Path
              </h2>
              <div className="space-y-6">
                {selectedPathway.progressiveLearning.map((step, idx) => (
                  <div key={idx} className="relative">
                    {idx < selectedPathway.progressiveLearning.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-purple-600">{idx + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-800">{step.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {step.duration}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
                            <ul className="space-y-1">
                              {step.activities.map((activity, aidx) => (
                                <li key={aidx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <Puzzle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
                            <ul className="space-y-1">
                              {step.milestones.map((milestone, midx) => (
                                <li key={midx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {milestone}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Support & Tracking */}
          <div className="space-y-6">
            {/* Match Reasoning */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Why This Pathway?
              </h3>
              <div className="space-y-3">
                {selectedPathway.reasoning.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Safety Considerations */}
            {selectedPathway.traumaConsiderations.length > 0 && (
              <Card className="p-6 border-amber-200 bg-amber-50">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-800">
                  <Shield className="h-5 w-5" />
                  Safety Considerations
                </h3>
                <div className="space-y-4">
                  {selectedPathway.traumaConsiderations.map((consideration, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800">{consideration.type}</h4>
                          <p className="text-sm text-amber-700">{consideration.warning}</p>
                        </div>
                      </div>
                      <div className="ml-6">
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Adaptation:</span> {consideration.adaptation}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Alternative:</span> {consideration.alternative}
                        </p>
                        {consideration.supportRequired && (
                          <Badge className="mt-2 bg-blue-600 text-white text-xs">
                            Professional Support Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Community Support */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Support
              </h3>
              <div className="space-y-3">
                {selectedPathway.communitySupport.types.map((type, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{type}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Culturally Authentic</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      {selectedPathway.communitySupport.culturallyAuthentic ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Safety Verified</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      {selectedPathway.communitySupport.safetyVerified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Expected Outcomes */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Expected Outcomes
              </h3>
              <div className="space-y-2">
                {selectedPathway.expectedOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Growth Tracking */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth Tracking
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dimensions Tracked</h4>
                  <div className="space-y-1">
                    {selectedPathway.growthTracking.dimensions.map((dimension, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Layers className="h-3 w-3 text-purple-500" />
                        <span className="text-sm text-gray-700">{dimension}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Assessment Frequency</h4>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    {selectedPathway.growthTracking.frequency}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Introduction Session
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Connect with Community
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Find Professional Guidance
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 text-purple-600">
              <Brain className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-light">
                AI is crafting your personalized spiritual healing pathways...
              </span>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-600">
            <p>Analyzing your spiritual profile, cultural background, and healing goals</p>
            <p className="text-sm mt-2">This may take a moment as we ensure cultural sensitivity and trauma safety</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeView === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('overview')}
        >
          <Compass className="h-4 w-4 mr-2" />
          Pathway Overview
        </Button>
        <Button
          variant={activeView === 'detailed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('detailed')}
          disabled={!selectedPathway}
        >
          <Eye className="h-4 w-4 mr-2" />
          Detailed View
        </Button>
        <Button
          variant={activeView === 'customization' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('customization')}
          disabled={!selectedPathway}
        >
          <Settings className="h-4 w-4 mr-2" />
          Customization
        </Button>
        <Button
          variant={activeView === 'tracking' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('tracking')}
          disabled={!selectedPathway}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Growth Tracking
        </Button>
      </div>

      {/* Content */}
      {activeView === 'overview' && renderOverviewSection()}
      {activeView === 'detailed' && renderDetailedView()}
      {activeView === 'customization' && (
        <div className="text-center py-16">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pathway Customization</h2>
          <p className="text-gray-600 mb-8">
            Advanced customization tools for adapting your selected pathway to your specific needs
          </p>
          <Button disabled>
            <Sparkles className="h-5 w-5 mr-2" />
            Coming Soon
          </Button>
        </div>
      )}
      {activeView === 'tracking' && (
        <div className="text-center py-16">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Spiritual Growth Tracking</h2>
          <p className="text-gray-600 mb-8">
            Comprehensive tracking dashboard for your spiritual and existential development
          </p>
          <Button disabled>
            <Sparkles className="h-5 w-5 mr-2" />
            Coming Soon
          </Button>
        </div>
      )}
    </div>
  );
}