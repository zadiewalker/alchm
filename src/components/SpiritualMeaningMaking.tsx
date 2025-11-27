'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Compass,
  BookOpen,
  Mountain,
  Star,
  Heart,
  Globe,
  Sunrise,
  Moon,
  Lotus,
  TreePine,
  Flame,
  Infinity,
  Shield,
  Crown,
  Cross,
  YinYang,
  Eye,
  Feather,
  Anchor,
  Diamond,
  Waves,
  Sun,
  Flower2,
  Lightbulb,
  Target,
  Map,
  Building,
  Users,
  Peace,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Download,
  Share,
  RefreshCcw,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';

interface SpiritualTradition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  coreValues: string[];
  meaningMakingApproaches: string[];
  wisdomTexts: string[];
  practices: string[];
  culturalNotes: string[];
}

interface MeaningMakingExercise {
  id: string;
  title: string;
  tradition: string;
  category: 'purpose' | 'values' | 'suffering' | 'connection' | 'transcendence';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  steps: string[];
  reflectionPrompts: string[];
  adaptations: string[];
}

interface SacredNarrative {
  id: string;
  title: string;
  tradition: string;
  lifeArea: string;
  narrative: string;
  insights: string[];
  integratedWisdom: string[];
  date: string;
  stage: 'exploring' | 'developing' | 'integrating' | 'living';
}

interface ValuesAlignment {
  value: string;
  importance: number;
  currentAlignment: number;
  tradition: string;
  actionSteps: string[];
  barriers: string[];
  support: string[];
}

export default function SpiritualMeaningMaking() {
  const [activeSection, setActiveSection] = useState<'explore' | 'exercises' | 'narrative' | 'values' | 'integration'>('explore');
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([]);
  const [currentExercise, setCurrentExercise] = useState<MeaningMakingExercise | null>(null);
  const [sacredNarratives, setSacredNarratives] = useState<SacredNarrative[]>([]);
  const [valuesAssessment, setValuesAssessment] = useState<ValuesAlignment[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const spiritualTraditions: SpiritualTradition[] = [
    {
      id: 'secular-humanism',
      name: 'Secular Humanism',
      description: 'Finding meaning through human dignity, rational thinking, and ethical living',
      icon: Lightbulb,
      coreValues: ['Human dignity', 'Reason', 'Compassion', 'Justice', 'Personal responsibility'],
      meaningMakingApproaches: [
        'Creating meaning through service to humanity',
        'Using reason and science to understand existence',
        'Building ethical frameworks based on human flourishing',
        'Finding purpose in contributing to human progress'
      ],
      wisdomTexts: ['Humanist Manifestos', 'Works of Carl Sagan', 'Ethical philosophy texts'],
      practices: ['Ethical reflection', 'Service to community', 'Critical thinking', 'Scientific inquiry'],
      culturalNotes: ['Emphasizes human agency and responsibility', 'Values evidence-based understanding']
    },
    {
      id: 'buddhism',
      name: 'Buddhism',
      description: 'Path of awakening through understanding suffering and cultivating compassion',
      icon: Lotus,
      coreValues: ['Compassion', 'Wisdom', 'Non-attachment', 'Mindfulness', 'Interconnectedness'],
      meaningMakingApproaches: [
        'Understanding the nature of suffering and its cessation',
        'Cultivating compassion for all beings',
        'Practicing mindfulness and present-moment awareness',
        'Recognizing the interdependence of all phenomena'
      ],
      wisdomTexts: ['Dhammapada', 'Heart Sutra', 'Teachings of Thich Nhat Hanh'],
      practices: ['Meditation', 'Mindfulness', 'Loving-kindness practice', 'Noble Eightfold Path'],
      culturalNotes: ['Multiple traditions (Theravada, Mahayana, Vajrayana)', 'Emphasis on direct experience']
    },
    {
      id: 'christianity',
      name: 'Christianity',
      description: 'Finding meaning through relationship with God and service to others',
      icon: Cross,
      coreValues: ['Love', 'Faith', 'Hope', 'Forgiveness', 'Service'],
      meaningMakingApproaches: [
        'Understanding life as sacred gift from God',
        'Finding purpose through serving others',
        'Experiencing healing through divine love and forgiveness',
        'Building community through shared faith'
      ],
      wisdomTexts: ['Bible', 'Works of mystics like Julian of Norwich', 'Contemporary theology'],
      practices: ['Prayer', 'Contemplation', 'Service', 'Community worship', 'Scripture study'],
      culturalNotes: ['Diverse denominations and interpretations', 'Emphasis on love and redemption']
    },
    {
      id: 'islam',
      name: 'Islam',
      description: 'Submission to Allah and finding peace through divine guidance',
      icon: Star,
      coreValues: ['Tawhid (Unity)', 'Justice', 'Compassion', 'Submission', 'Community'],
      meaningMakingApproaches: [
        'Understanding life as test and trust from Allah',
        'Finding peace through submission to divine will',
        'Building just and compassionate society',
        'Recognizing divine presence in daily life'
      ],
      wisdomTexts: ['Quran', 'Hadith', 'Works of Sufi masters like Rumi'],
      practices: ['Five daily prayers', 'Dhikr (remembrance)', 'Charity', 'Pilgrimage', 'Fasting'],
      culturalNotes: ['Rich tradition of mysticism (Sufism)', 'Emphasis on community and social justice']
    },
    {
      id: 'judaism',
      name: 'Judaism',
      description: 'Covenant relationship with God through Torah and ethical living',
      icon: Star,
      coreValues: ['Tikkun Olam (Repairing the world)', 'Learning', 'Justice', 'Remembrance', 'Community'],
      meaningMakingApproaches: [
        'Partnering with God in repairing the world',
        'Finding meaning through study and learning',
        'Honoring memory and continuing legacy',
        'Building just and caring communities'
      ],
      wisdomTexts: ['Torah', 'Talmud', 'Works of modern thinkers like Viktor Frankl'],
      practices: ['Torah study', 'Sabbath observance', 'Prayer', 'Acts of kindness', 'Remembrance rituals'],
      culturalNotes: ['Emphasis on questioning and learning', 'Rich tradition of social justice']
    },
    {
      id: 'hinduism',
      name: 'Hinduism',
      description: 'Multiple paths to understanding divine reality and one\'s true nature',
      icon: YinYang,
      coreValues: ['Dharma (Righteous duty)', 'Ahimsa (Non-violence)', 'Karma', 'Moksha (Liberation)', 'Unity in diversity'],
      meaningMakingApproaches: [
        'Understanding life stages and duties (ashramas)',
        'Recognizing divine presence in all beings',
        'Following one\'s dharma or life purpose',
        'Seeking liberation through various paths (yogas)'
      ],
      wisdomTexts: ['Bhagavad Gita', 'Upanishads', 'Ramayana', 'Modern teachers like Gandhi'],
      practices: ['Yoga', 'Meditation', 'Puja (worship)', 'Pilgrimage', 'Self-inquiry'],
      culturalNotes: ['Diverse traditions and practices', 'Emphasis on multiple valid paths']
    },
    {
      id: 'indigenous',
      name: 'Indigenous Wisdom',
      description: 'Connection to land, ancestors, and community through sacred reciprocity',
      icon: Feather,
      coreValues: ['Reciprocity', 'Connection to land', 'Ancestral wisdom', 'Community harmony', 'Sacred cycles'],
      meaningMakingApproaches: [
        'Understanding place in web of relationships',
        'Honoring ancestors and future generations',
        'Living in harmony with natural cycles',
        'Maintaining balance through sacred practices'
      ],
      wisdomTexts: ['Oral traditions', 'Creation stories', 'Contemporary Indigenous authors'],
      practices: ['Ceremony', 'Connection to land', 'Storytelling', 'Community rituals', 'Seasonal observances'],
      culturalNotes: ['Diverse cultures with unique traditions', 'Emphasis on relationship and reciprocity']
    },
    {
      id: 'existentialism',
      name: 'Existentialism',
      description: 'Creating authentic meaning through freedom, choice, and responsibility',
      icon: Target,
      coreValues: ['Authenticity', 'Freedom', 'Responsibility', 'Individual meaning', 'Confronting absurdity'],
      meaningMakingApproaches: [
        'Taking responsibility for creating personal meaning',
        'Living authentically despite uncertainty',
        'Embracing freedom and its accompanying anxiety',
        'Finding purpose through choices and actions'
      ],
      wisdomTexts: ['Works of Sartre, Camus, de Beauvoir', 'Man\'s Search for Meaning by Frankl'],
      practices: ['Self-reflection', 'Authentic choice-making', 'Taking responsibility', 'Confronting anxiety'],
      culturalNotes: ['Emphasis on individual responsibility', 'Acknowledges life\'s inherent challenges']
    }
  ];

  const meaningMakingExercises: MeaningMakingExercise[] = [
    {
      id: 'sacred-story',
      title: 'Sacred Story Integration',
      tradition: 'Multi-traditional',
      category: 'purpose',
      duration: '45-60 minutes',
      difficulty: 'intermediate',
      description: 'Weave your life experiences into a sacred narrative that reveals meaning and purpose',
      steps: [
        'Choose a significant life challenge or transition',
        'Identify the spiritual framework(s) that resonate with you',
        'Retell your story using sacred language and metaphors from your chosen tradition(s)',
        'Look for themes of growth, learning, and contribution',
        'Identify how this experience serves your larger life purpose'
      ],
      reflectionPrompts: [
        'What would this tradition say about your experience?',
        'How has this challenge contributed to your spiritual growth?',
        'What gifts have emerged from this difficulty?',
        'How might your story inspire or help others?'
      ],
      adaptations: [
        'Use multiple traditions to find the most resonant perspective',
        'Focus on one specific aspect if the full story feels overwhelming',
        'Create visual or artistic representations alongside written reflection'
      ]
    },
    {
      id: 'values-clarification',
      title: 'Sacred Values Clarification',
      tradition: 'Multi-traditional',
      category: 'values',
      duration: '30-45 minutes',
      difficulty: 'beginner',
      description: 'Identify and prioritize your core values using wisdom from spiritual traditions',
      steps: [
        'Review values lists from different spiritual traditions',
        'Identify 5-7 values that deeply resonate with you',
        'Rank them in order of importance to your life purpose',
        'Assess how well your current life aligns with these values',
        'Create action steps to increase alignment'
      ],
      reflectionPrompts: [
        'Which values feel most essential to who you are?',
        'Where do you see gaps between values and current living?',
        'What would living these values more fully look like?',
        'How do these values connect to your sense of meaning?'
      ],
      adaptations: [
        'Focus on one value at a time for deeper exploration',
        'Use specific tradition\'s language if that feels more authentic',
        'Include family or cultural values alongside spiritual ones'
      ]
    },
    {
      id: 'suffering-transformation',
      title: 'Sacred Suffering Transformation',
      tradition: 'Buddhism/Christianity/Islam',
      category: 'suffering',
      duration: '60-90 minutes',
      difficulty: 'advanced',
      description: 'Transform understanding of suffering using contemplative practices from wisdom traditions',
      steps: [
        'Identify a current or past experience of suffering',
        'Explore how different traditions understand the purpose of suffering',
        'Practice compassion meditation or prayer for yourself and others who suffer similarly',
        'Look for wisdom, growth, or service opportunities that have emerged',
        'Develop a sacred understanding of this experience'
      ],
      reflectionPrompts: [
        'How might this suffering serve a larger purpose?',
        'What wisdom have you gained that could help others?',
        'How has this experience deepened your compassion?',
        'What would perfect love/wisdom say about this situation?'
      ],
      adaptations: [
        'Start with smaller difficulties before addressing major trauma',
        'Work with qualified spiritual director or therapist for severe trauma',
        'Use body-based practices alongside cognitive reflection'
      ]
    }
  ];

  const sampleNarratives: SacredNarrative[] = [
    {
      id: '1',
      title: 'Job Loss as Spiritual Awakening',
      tradition: 'Buddhism/Secular Humanism',
      lifeArea: 'Career Transition',
      narrative: 'What felt like failure became an invitation to examine what truly matters. Through Buddhist teachings on impermanence and humanist values of personal growth, I discovered that my worth isn\'t tied to my job title. This period of uncertainty taught me to trust in my resilience and opened space for more authentic work aligned with my values.',
      insights: [
        'Security is an illusion; adaptability is real strength',
        'Suffering often precedes necessary growth',
        'My value as a human isn\'t determined by productivity',
        'Uncertainty can be a doorway to authenticity'
      ],
      integratedWisdom: [
        'Practice non-attachment to outcomes while working toward goals',
        'Regular reflection on what truly matters prevents future crises',
        'Build community support that transcends professional identity',
        'View setbacks as redirection rather than failure'
      ],
      date: '2024-02-15',
      stage: 'integrating'
    },
    {
      id: '2',
      title: 'Healing Ancestral Trauma',
      tradition: 'Indigenous Wisdom/Judaism',
      lifeArea: 'Family Healing',
      narrative: 'Through Indigenous teachings on ancestral connection and Jewish concepts of tikkun olam (repairing the world), I understood my family\'s patterns of trauma as invitations for healing that serves future generations. My personal therapy work became sacred medicine for the family line.',
      insights: [
        'Individual healing serves the collective',
        'Ancestors\' pain can become wisdom when properly honored',
        'Breaking cycles is sacred work',
        'Healing moves both backward and forward through time'
      ],
      integratedWisdom: [
        'Regular ancestral honoring practices',
        'Therapy as spiritual practice, not just psychology',
        'Creating new traditions that honor the past while serving the future',
        'Understanding personal struggles in larger context of generational healing'
      ],
      date: '2024-01-20',
      stage: 'living'
    }
  ];

  useEffect(() => {
    setSacredNarratives(sampleNarratives);
    
    // Sample values assessment
    setValuesAssessment([
      {
        value: 'Compassion',
        importance: 9,
        currentAlignment: 7,
        tradition: 'Buddhism',
        actionSteps: ['Daily loving-kindness practice', 'Volunteer at local shelter', 'Practice self-compassion'],
        barriers: ['Time constraints', 'Self-criticism', 'Overwhelming world suffering'],
        support: ['Meditation group', 'Therapy', 'Spiritual books']
      },
      {
        value: 'Justice',
        importance: 8,
        currentAlignment: 6,
        tradition: 'Judaism/Christianity',
        actionSteps: ['Support social justice organizations', 'Advocate in workplace', 'Learn about systemic issues'],
        barriers: ['Political polarization', 'Feeling overwhelmed', 'Limited resources'],
        support: ['Faith community', 'Social justice groups', 'Educational resources']
      }
    ]);
  }, []);

  const renderExploreSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-purple-100 rounded-full">
            <Globe className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Explore Spiritual Traditions</h1>
        <p className="text-xl text-gray-600">
          Discover meaning-making wisdom from diverse spiritual and philosophical traditions
        </p>
      </div>

      <div className="grid gap-6">
        {spiritualTraditions.map((tradition) => {
          const IconComponent = tradition.icon;
          const isSelected = selectedTraditions.includes(tradition.id);
          
          return (
            <Card key={tradition.id} className={`p-6 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'
            }`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTraditions(prev => prev.filter(id => id !== tradition.id));
                    } else {
                      setSelectedTraditions(prev => [...prev, tradition.id]);
                    }
                  }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-8 w-8 text-purple-600" />
                  <div>
                    <h2 className="text-xl font-medium">{tradition.name}</h2>
                    <p className="text-gray-600">{tradition.description}</p>
                  </div>
                </div>
                <Button variant={isSelected ? 'default' : 'outline'} size="sm">
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Core Values</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tradition.coreValues.map((value) => (
                      <Badge key={value} variant="outline" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="font-medium mb-2">Key Practices</h3>
                  <ul className="text-sm space-y-1">
                    {tradition.practices.slice(0, 3).map((practice, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Circle className="h-2 w-2 text-purple-600" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Meaning-Making Approaches</h3>
                  <ul className="text-sm space-y-1">
                    {tradition.meaningMakingApproaches.slice(0, 2).map((approach, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                        <span>{approach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {tradition.culturalNotes.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Cultural Notes</h4>
                  <p className="text-xs text-gray-600">{tradition.culturalNotes.join(' • ')}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selectedTraditions.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-lg font-medium mb-4">Your Selected Traditions</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTraditions.map((traditionId) => {
              const tradition = spiritualTraditions.find(t => t.id === traditionId);
              return tradition ? (
                <Badge key={traditionId} className="bg-purple-600">
                  {tradition.name}
                </Badge>
              ) : null;
            })}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These traditions will inform your personalized meaning-making exercises and sacred narrative development.
          </p>
          <Button onClick={() => setActiveSection('exercises')}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Start Meaning-Making Exercises
          </Button>
        </Card>
      )}
    </div>
  );

  const renderExercisesSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Target className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Meaning-Making Exercises</h1>
        <p className="text-xl text-gray-600">
          Guided practices for discovering purpose and integrating wisdom traditions
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory('all')}
        >
          All Categories
        </Button>
        {['purpose', 'values', 'suffering', 'connection', 'transcendence'].map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-6">
        {meaningMakingExercises
          .filter(exercise => filterCategory === 'all' || exercise.category === filterCategory)
          .map((exercise) => (
            <Card key={exercise.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-medium mb-2">{exercise.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {exercise.duration}
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {exercise.difficulty}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {exercise.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{exercise.description}</p>
                </div>
                <Button onClick={() => setCurrentExercise(exercise)}>
                  Begin Exercise
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Steps</h3>
                  <ol className="text-sm space-y-1">
                    {exercise.steps.slice(0, 3).map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                    {exercise.steps.length > 3 && (
                      <li className="text-gray-500 text-xs">+ {exercise.steps.length - 3} more steps</li>
                    )}
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Reflection Prompts</h3>
                  <ul className="text-sm space-y-1">
                    {exercise.reflectionPrompts.slice(0, 2).map((prompt, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                        <span>{prompt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Tradition(s):</span> {exercise.tradition}
              </div>
            </Card>
          ))}
      </div>
    </div>
  );

  const renderNarrativeSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 rounded-full">
            <BookOpen className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Sacred Narrative Development</h1>
        <p className="text-xl text-gray-600">
          Weave your life experiences into meaningful stories that reveal purpose and wisdom
        </p>
      </div>

      <div className="grid gap-6">
        {sacredNarratives.map((narrative) => (
          <Card key={narrative.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium mb-1">{narrative.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                  <span>{narrative.tradition}</span>
                  <span>•</span>
                  <span>{narrative.lifeArea}</span>
                  <span>•</span>
                  <span>{narrative.date}</span>
                  <Badge variant="outline">{narrative.stage}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Full
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 italic leading-relaxed">
                {narrative.narrative}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Key Insights</h3>
                <ul className="text-sm space-y-1">
                  {narrative.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Integrated Wisdom</h3>
                <ul className="text-sm space-y-1">
                  {narrative.integratedWisdom.slice(0, 3).map((wisdom, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-3 w-3 text-purple-500 mt-1 flex-shrink-0" />
                      <span>{wisdom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create New Sacred Narrative
        </Button>
      </div>
    </div>
  );

  const renderValuesSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <Heart className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Values & Purpose Alignment</h1>
        <p className="text-xl text-gray-600">
          Clarify your deepest values and align your life with your authentic purpose
        </p>
      </div>

      <div className="grid gap-6">
        {valuesAssessment.map((value, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium">{value.value}</h2>
                <div className="text-sm text-gray-600">From {value.tradition} tradition</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Importance: {value.importance}/10</div>
                <div className="text-sm text-gray-600">Current Alignment: {value.currentAlignment}/10</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Importance</span>
                    <span>{value.importance}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${value.importance * 10}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Alignment</span>
                    <span>{value.currentAlignment}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        value.currentAlignment >= 7 ? 'bg-green-600' :
                        value.currentAlignment >= 5 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${value.currentAlignment * 10}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Action Steps</h3>
                <ul className="text-sm space-y-1">
                  {value.actionSteps.slice(0, 2).map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium mb-2">Current Barriers</h3>
                <ul className="space-y-1">
                  {value.barriers.map((barrier, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                      <span>{barrier}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Support Systems</h3>
                <ul className="space-y-1">
                  {value.support.map((support, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Users className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                      <span>{support}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add New Value Assessment
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeSection === 'explore' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('explore')}
        >
          <Globe className="h-4 w-4 mr-2" />
          Explore Traditions
        </Button>
        <Button
          variant={activeSection === 'exercises' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('exercises')}
        >
          <Target className="h-4 w-4 mr-2" />
          Meaning-Making
        </Button>
        <Button
          variant={activeSection === 'narrative' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('narrative')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Sacred Narratives
        </Button>
        <Button
          variant={activeSection === 'values' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('values')}
        >
          <Heart className="h-4 w-4 mr-2" />
          Values & Purpose
        </Button>
        <Button
          variant={activeSection === 'integration' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('integration')}
        >
          <Infinity className="h-4 w-4 mr-2" />
          Integration
        </Button>
      </div>

      {/* Content */}
      {activeSection === 'explore' && renderExploreSection()}
      {activeSection === 'exercises' && renderExercisesSection()}
      {activeSection === 'narrative' && renderNarrativeSection()}
      {activeSection === 'values' && renderValuesSection()}
      {activeSection === 'integration' && (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-100 rounded-full">
              <Infinity className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-medium mb-4">Wisdom Integration Dashboard</h1>
          <p className="text-xl text-gray-600 mb-8">
            Coming Soon: Advanced tools for integrating insights across all meaning-making practices
          </p>
          <Button size="lg" disabled>
            <Sparkles className="h-5 w-5 mr-2" />
            Launch Integration Tools
          </Button>
        </div>
      )}

      {/* Exercise Modal */}
      {currentExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-medium">{currentExercise.title}</h1>
              <Button variant="outline" onClick={() => setCurrentExercise(null)}>
                Close
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-medium mb-4">Exercise Steps</h2>
                <ol className="space-y-3">
                  {currentExercise.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">Reflection Prompts</h2>
                <ul className="space-y-3">
                  {currentExercise.reflectionPrompts.map((prompt, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{prompt}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Adaptations</h3>
                  <ul className="space-y-1">
                    {currentExercise.adaptations.map((adaptation, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                        <Circle className="h-2 w-2 text-gray-400 mt-1.5 flex-shrink-0" />
                        <span>{adaptation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button size="lg">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Practice Session
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}