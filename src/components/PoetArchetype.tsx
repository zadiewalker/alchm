'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PenTool,
  Palette,
  Feather,
  BookOpen,
  Sparkles,
  Heart,
  Mountain,
  Waves,
  Sun,
  Moon,
  Star,
  Flower,
  Butterfly,
  Compass,
  Key,
  Crown,
  Shield,
  Bridge,
  Sunrise,
  TreePine,
  Flame,
  Rainbow,
  Crystal,
  Wind,
  Lightning,
  ChevronRight,
  Download,
  Share,
  RefreshCcw,
  Volume2,
  VolumeX,
  Copy,
  ArrowRight,
  Book,
  Lightbulb,
  Target,
  Archive
} from 'lucide-react';

interface MetaphoricalFramework {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  domains: string[];
  transformationalElements: string[];
  sampleMetaphors: string[];
}

interface PoetrySession {
  id: string;
  title: string;
  emotion: string;
  metaphor: string;
  transformation: string;
  poem: string;
  insights: string[];
  date: string;
  stage: 'recognition' | 'exploration' | 'transformation' | 'integration';
}

interface TransformativePrompt {
  id: string;
  category: 'pain-to-beauty' | 'wisdom-extraction' | 'meaning-making' | 'healing-narrative';
  prompt: string;
  metaphoricalFramework: string;
  guidanceNotes: string[];
}

export default function PoetArchetype() {
  const [activeMode, setActiveMode] = useState<'create' | 'explore' | 'library' | 'guided'>('create');
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [generatedPoetry, setGeneratedPoetry] = useState<PoetrySession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [poetryLibrary, setPoetrySessions] = useState<PoetrySession[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const metaphoricalFrameworks: MetaphoricalFramework[] = [
    {
      id: 'natural-cycles',
      name: 'Natural Cycles',
      description: 'Transform pain through seasons, weather, and natural rhythms',
      icon: Sunrise,
      domains: ['grief', 'transition', 'growth', 'healing'],
      transformationalElements: ['seasons changing', 'storms passing', 'seeds sprouting', 'rivers flowing'],
      sampleMetaphors: [
        'Your grief is winter preparing the soil for spring',
        'This anger is thunder announcing the cleansing rain',
        'Your healing unfolds like a flower opening to dawn'
      ]
    },
    {
      id: 'alchemical-transformation',
      name: 'Alchemical Transformation',
      description: 'Turn emotional lead into gold through ancient transformation symbols',
      icon: Crystal,
      domains: ['trauma', 'shadow work', 'integration', 'wisdom'],
      transformationalElements: ['fire refining', 'pressure creating diamonds', 'coal becoming pearls', 'base metals into gold'],
      sampleMetaphors: [
        'Your pain is coal under pressure, becoming diamond',
        'This trauma is ore in the furnace of transformation',
        'Your tears are the solvent dissolving old wounds into wisdom'
      ]
    },
    {
      id: 'hero-journey',
      name: 'Hero\'s Journey',
      description: 'Frame challenges as heroic quests with meaning and purpose',
      icon: Shield,
      domains: ['courage', 'purpose', 'calling', 'resilience'],
      transformationalElements: ['crossing thresholds', 'meeting allies', 'facing dragons', 'returning with gifts'],
      sampleMetaphors: [
        'You are the hero who chose this difficult quest',
        'This challenge is your dragon guarding hidden treasure',
        'Your scars are medals of honor from battles fought with grace'
      ]
    },
    {
      id: 'ocean-depths',
      name: 'Ocean Depths',
      description: 'Explore emotional depths and surface with pearls of wisdom',
      icon: Waves,
      domains: ['deep emotions', 'unconscious wisdom', 'flow states', 'surrender'],
      transformationalElements: ['diving deep', 'surfacing with treasures', 'riding waves', 'finding pearls'],
      sampleMetaphors: [
        'Your emotions are ocean depths holding ancient pearls',
        'You are learning to swim in the waters of your own heart',
        'Each tear is a drop returning to the vast ocean of being'
      ]
    },
    {
      id: 'light-shadow',
      name: 'Light & Shadow',
      description: 'Integrate all parts of self through light and darkness metaphors',
      icon: Moon,
      domains: ['shadow integration', 'wholeness', 'acceptance', 'balance'],
      transformationalElements: ['embracing shadows', 'becoming light', 'dancing between', 'whole eclipses'],
      sampleMetaphors: [
        'Your shadow holds the seeds of your brightest light',
        'You are learning to dance with both sun and moon within',
        'This darkness is the womb where your new self is being born'
      ]
    },
    {
      id: 'bridge-building',
      name: 'Bridge Building',
      description: 'Connect different aspects of experience through architectural metaphors',
      icon: Bridge,
      domains: ['integration', 'connection', 'relationships', 'communication'],
      transformationalElements: ['building bridges', 'creating foundations', 'designing spaces', 'opening doorways'],
      sampleMetaphors: [
        'You are an architect of connection, building bridges across chasms',
        'Your words are stones carefully placed to span difficult waters',
        'This relationship is a bridge you build together, step by step'
      ]
    }
  ];

  const transformativePrompts: TransformativePrompt[] = [
    {
      id: 'pain-beauty-1',
      category: 'pain-to-beauty',
      prompt: 'What if your deepest wound became your most beautiful gift to the world?',
      metaphoricalFramework: 'alchemical-transformation',
      guidanceNotes: [
        'Allow the pain to speak first - what does it want to say?',
        'Look for the wisdom hidden within the difficulty',
        'Find the unique gift only this experience could have given you',
        'Transform the narrative from victim to alchemist'
      ]
    },
    {
      id: 'wisdom-extraction-1',
      category: 'wisdom-extraction',
      prompt: 'If this difficult experience were your greatest teacher, what lesson is it trying to give you?',
      metaphoricalFramework: 'hero-journey',
      guidanceNotes: [
        'See yourself as the student, not the victim',
        'What skills did you develop through this challenge?',
        'How has this experience prepared you for your life\'s purpose?',
        'What would you tell someone facing a similar challenge?'
      ]
    },
    {
      id: 'meaning-making-1',
      category: 'meaning-making',
      prompt: 'How might your story become a lantern for others walking similar paths?',
      metaphoricalFramework: 'light-shadow',
      guidanceNotes: [
        'Your experience has created unique insight and empathy',
        'Consider how your healing could inspire others',
        'What light have you discovered in your darkest moments?',
        'How can your story serve something greater than yourself?'
      ]
    },
    {
      id: 'healing-narrative-1',
      category: 'healing-narrative',
      prompt: 'If your healing journey were a sacred story, what would be its most beautiful chapter?',
      metaphoricalFramework: 'natural-cycles',
      guidanceNotes: [
        'Focus on moments of breakthrough and growth',
        'Celebrate the courage it took to keep going',
        'Honor the support and love that helped you heal',
        'Recognize your own resilience and strength'
      ]
    }
  ];

  const samplePoetrySessions: PoetrySession[] = [
    {
      id: '1',
      title: 'Phoenix Rising from Heartbreak',
      emotion: 'Deep sadness from relationship ending',
      metaphor: 'Phoenix transforming through fire',
      transformation: 'Destruction as preparation for rebirth',
      poem: `In the ashes of what we were,
I find the seeds of who I'm becoming.
This fire that burns so bright and fierce
Is not destroying—it's illuminating.

Every flame that licks these memories
Reveals the gold that lay hidden beneath,
And from this sacred burning ground
I rise, reborn, renewed, released.

The phoenix doesn't mourn the nest
That housed her smaller, former self.
She spreads her wings, now bright with wisdom,
And soars toward her truest wealth.`,
      insights: [
        'Endings contain the seeds of new beginnings',
        'Pain can be a refining fire rather than pure destruction',
        'Your capacity for love hasn\'t diminished—it\'s been purified',
        'This experience is teaching you about your own resilience'
      ],
      date: '2024-03-15',
      stage: 'transformation'
    },
    {
      id: '2',
      title: 'Ocean of Overwhelm',
      emotion: 'Feeling overwhelmed by life responsibilities',
      metaphor: 'Learning to swim in vast emotional waters',
      transformation: 'From drowning to floating to swimming with grace',
      poem: `I thought I was drowning in this ocean
Of endless tasks and urgent needs,
But slowly I'm learning that water
Supports those who trust its depths.

My breath becomes my anchor,
My heartbeat, my steady stroke.
These waters that seemed so threatening
Are teaching me how to float.

I am not separate from this ocean—
I am made of the same sacred stuff.
When I stop fighting the current,
I discover I am enough.`,
      insights: [
        'Overwhelm often signals a need to trust rather than control',
        'Your breath is always available as an anchor',
        'You are more resilient than you know',
        'Sometimes the solution is to stop struggling and start flowing'
      ],
      date: '2024-03-10',
      stage: 'integration'
    }
  ];

  useEffect(() => {
    setPoetrySessions(samplePoetrySessions);
  }, []);

  const generateTransformativePoetry = async (emotion: string, framework: string) => {
    setIsGenerating(true);
    
    // Simulate AI poetry generation with therapeutic metaphors
    setTimeout(() => {
      const selectedFrameworkData = metaphoricalFrameworks.find(f => f.id === framework);
      
      const newSession: PoetrySession = {
        id: Date.now().toString(),
        title: `Transformation of ${emotion}`,
        emotion: emotion,
        metaphor: selectedFrameworkData?.sampleMetaphors[0] || 'Your pain is becoming wisdom',
        transformation: 'From suffering to sacred insight',
        poem: `[Generated poem would appear here - 
        a beautiful, therapeutic transformation 
        of the input emotion using the selected
        metaphorical framework]`,
        insights: [
          'This experience is teaching you resilience',
          'Your sensitivity is a gift, not a weakness',
          'Growth often feels uncomfortable before it feels empowering',
          'You are becoming who you are meant to be'
        ],
        date: new Date().toISOString().split('T')[0],
        stage: 'transformation'
      };
      
      setGeneratedPoetry(newSession);
      setPoetrySessions(prev => [newSession, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const renderCreativeStudio = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-pink-100 rounded-full">
            <PenTool className="h-12 w-12 text-pink-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Poet's Creative Studio</h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform your pain into beauty through the alchemy of metaphor and verse
        </p>
      </div>

      {/* Emotion Input */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">What are you feeling right now?</h2>
        <div className="space-y-4">
          <textarea
            value={currentEmotion}
            onChange={(e) => setCurrentEmotion(e.target.value)}
            placeholder="Describe your emotions, experiences, or challenges. Be as raw and honest as you need to be. The Poet will help transform this into something beautiful..."
            className="w-full p-4 border rounded-lg min-h-32 resize-y"
          />
          
          <div className="text-sm text-gray-600">
            <p className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              Your emotions are safe here. The Poet specializes in finding beauty within pain.
            </p>
          </div>
        </div>
      </Card>

      {/* Framework Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Choose Your Metaphorical Framework</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metaphoricalFrameworks.map((framework) => {
            const IconComponent = framework.icon;
            return (
              <button
                key={framework.id}
                onClick={() => setSelectedFramework(framework.id)}
                className={`text-left p-4 rounded-lg border transition-all ${
                  selectedFramework === framework.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className="h-6 w-6 text-pink-600" />
                  <h3 className="font-semibold">{framework.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Sample Metaphor:</div>
                    <div className="text-xs italic text-pink-700">
                      "{framework.sampleMetaphors[0]}"
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={() => generateTransformativePoetry(currentEmotion, selectedFramework)}
          disabled={!currentEmotion.trim() || !selectedFramework || isGenerating}
          size="lg"
          className="px-8"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-5 w-5 mr-2 animate-spin" />
              Weaving your transformation...
            </>
          ) : (
            <>
              <Palette className="h-5 w-5 mr-2" />
              Create Transformative Poetry
            </>
          )}
        </Button>
      </div>

      {/* Generated Poetry Display */}
      {generatedPoetry && (
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{generatedPoetry.title}</h2>
            <Badge>{generatedPoetry.stage}</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Your Transformative Poem</h3>
              <div className="bg-white p-6 rounded-lg italic text-gray-700 leading-relaxed whitespace-pre-line">
                {generatedPoetry.poem}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
                  {audioEnabled ? (
                    <VolumeX className="h-4 w-4 mr-2" />
                  ) : (
                    <Volume2 className="h-4 w-4 mr-2" />
                  )}
                  Audio
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Transformational Insights</h3>
                <ul className="space-y-2">
                  {generatedPoetry.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Metaphorical Framework</h3>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Core Metaphor:</p>
                  <p className="italic text-pink-700">"{generatedPoetry.metaphor}"</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Integration Guidance</h3>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm">
                    Read this poem when you need to remember that your pain has purpose 
                    and your struggle is creating something beautiful. Consider journaling 
                    about which lines resonate most deeply with your experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderGuidedPrompts = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-purple-100 rounded-full">
            <Compass className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Guided Transformation Prompts</h1>
        <p className="text-xl text-gray-600">
          Structured pathways for extracting wisdom and beauty from difficult experiences
        </p>
      </div>

      <div className="grid gap-6">
        {transformativePrompts.map((prompt) => {
          const framework = metaphoricalFrameworks.find(f => f.id === prompt.metaphoricalFramework);
          const FrameworkIcon = framework?.icon || Star;
          
          return (
            <Card key={prompt.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FrameworkIcon className="h-6 w-6 text-purple-600" />
                  <Badge variant="outline" className="capitalize">
                    {prompt.category.replace('-', ' ')}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Start Journey
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <h3 className="text-lg font-semibold mb-3">{prompt.prompt}</h3>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-600 mb-2">
                  Framework: {framework?.name}
                </div>
                <div className="text-sm text-gray-600">
                  {framework?.description}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Guidance Notes:</div>
                <ul className="space-y-1">
                  {prompt.guidanceNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPoetryLibrary = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Poetry Library</h1>
        <p className="text-xl text-gray-600">
          A collection of your transformative poems and healing insights
        </p>
      </div>

      <div className="grid gap-6">
        {poetryLibrary.map((session) => (
          <Card key={session.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{session.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>{session.date}</span>
                  <Badge variant="outline">{session.stage}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Book className="h-4 w-4 mr-2" />
                  Read
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Original Emotion</div>
                <div className="text-sm bg-gray-50 p-3 rounded">
                  {session.emotion}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Core Metaphor</div>
                <div className="text-sm bg-gray-50 p-3 rounded italic">
                  "{session.metaphor}"
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Transformation</div>
                <div className="text-sm bg-gray-50 p-3 rounded">
                  {session.transformation}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Key Insights: {session.insights.slice(0, 2).join(' • ')}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Complete Library
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeMode === 'create' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveMode('create')}
        >
          <PenTool className="h-4 w-4 mr-2" />
          Creative Studio
        </Button>
        <Button
          variant={activeMode === 'guided' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveMode('guided')}
        >
          <Compass className="h-4 w-4 mr-2" />
          Guided Prompts
        </Button>
        <Button
          variant={activeMode === 'explore' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveMode('explore')}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Explore Frameworks
        </Button>
        <Button
          variant={activeMode === 'library' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveMode('library')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Poetry Library
        </Button>
      </div>

      {/* Content */}
      {activeMode === 'create' && renderCreativeStudio()}
      {activeMode === 'guided' && renderGuidedPrompts()}
      {activeMode === 'library' && renderPoetryLibrary()}
      {activeMode === 'explore' && (
        <div className="grid md:grid-cols-2 gap-6">
          {metaphoricalFrameworks.map((framework) => {
            const IconComponent = framework.icon;
            return (
              <Card key={framework.id} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className="h-8 w-8 text-purple-600" />
                  <h2 className="text-xl font-semibold">{framework.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{framework.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Best for:</h3>
                    <div className="flex flex-wrap gap-1">
                      {framework.domains.map((domain) => (
                        <Badge key={domain} variant="outline" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Sample Metaphors:</h3>
                    <ul className="space-y-1">
                      {framework.sampleMetaphors.slice(0, 2).map((metaphor, index) => (
                        <li key={index} className="text-sm italic text-gray-700">
                          "{metaphor}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Use This Framework
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}