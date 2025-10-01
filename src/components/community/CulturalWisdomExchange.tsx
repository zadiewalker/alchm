'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { 
  EphemeralIdentity,
  PrivacyContentFilter,
  type EphemeralCommunityIdentity
} from '@/lib/community/privacy-engine';
import { LOCALE_CONFIG, getCulturalGreeting } from '@/lib/i18n';
import CrisisKeywordDetector from '@/components/ui/CrisisKeywordDetector';

interface CulturalWisdomExchangeProps {
  preferredLanguage?: string;
  culturalContext?: string;
}

const CULTURAL_TRADITIONS = {
  ubuntu: {
    name: 'Ubuntu/Hunhu',
    origin: 'Southern African',
    emoji: '🌍',
    philosophy: 'I am because we are',
    description: 'Ubuntu emphasizes our interconnectedness and collective humanity',
    practices: ['Community circles', 'Collective decision-making', 'Restorative justice', 'Shared storytelling'],
    healingWisdom: 'Healing happens in community - our wounds and our wisdom are shared'
  },
  ikigai: {
    name: 'Ikigai',
    origin: 'Japanese',
    emoji: '🌸',
    philosophy: 'Reason for being',
    description: 'Finding purpose through the intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for',
    practices: ['Daily reflection', 'Forest bathing (Shinrin-yoku)', 'Mindful movement', 'Purpose meditation'],
    healingWisdom: 'Purpose emerges not from grand gestures but from small, daily acts of meaning'
  },
  saudade: {
    name: 'Saudade',
    origin: 'Portuguese/Brazilian',
    emoji: '🌊',
    philosophy: 'Bittersweet longing transformed into beauty',
    description: 'The melancholic feeling of longing for something absent, transformed into appreciation for what was or hope for what could be',
    practices: ['Music and poetry', 'Memory honoring', 'Emotional expression', 'Hope cultivation'],
    healingWisdom: 'Our deepest longings point us toward what matters most - love, connection, belonging'
  },
  wabi_sabi: {
    name: 'Wabi-Sabi',
    origin: 'Japanese',
    emoji: '🍂',
    philosophy: 'Beauty in imperfection',
    description: 'Finding beauty in the imperfect, impermanent, and incomplete aspects of life',
    practices: ['Mindful observation', 'Acceptance meditation', 'Natural aesthetics', 'Imperfection appreciation'],
    healingWisdom: 'Our scars, struggles, and imperfections are not flaws to hide but beauty to honor'
  },
  ubuntu_botho: {
    name: 'Ubuntu/Botho',
    origin: 'Pan-African',
    emoji: '🪘',
    philosophy: 'Humanness through community',
    description: 'A person becomes human through other people - our humanity is affirmed through relationships',
    practices: ['Circle gatherings', 'Call and response', 'Ancestral honoring', 'Community healing'],
    healingWisdom: 'We heal ourselves by healing each other - individual wellness is inseparable from collective wellness'
  },
  dharmic_wisdom: {
    name: 'Dharmic Traditions',
    origin: 'Hindu/Buddhist',
    emoji: '🪷',
    philosophy: 'Righteous path and liberation',
    description: 'Living in alignment with cosmic order and natural law for the liberation of all beings',
    practices: ['Yoga and meditation', 'Compassion cultivation', 'Mindfulness', 'Service (Seva)'],
    healingWisdom: 'Suffering is the path to compassion - our pain teaches us to reduce the pain of others'
  },
  indigenous_wisdom: {
    name: 'Seven Generations',
    origin: 'Indigenous American',
    emoji: '🌿',
    philosophy: 'Decisions affect seven generations',
    description: 'Consider the impact of today\'s choices on seven generations into the future',
    practices: ['Medicine wheel', 'Smudging ceremonies', 'Vision quests', 'Earth connection'],
    healingWisdom: 'Healing is not just for us but for our ancestors behind us and the children ahead of us'
  },
  ancestral_wisdom: {
    name: 'Ancestral Wisdom',
    origin: 'Global Indigenous',
    emoji: '🌟',
    philosophy: 'Wisdom of the ancestors guides us',
    description: 'Drawing strength and guidance from the accumulated wisdom of those who came before',
    practices: ['Ancestor veneration', 'Ritual connection', 'Story keeping', 'Traditional medicine'],
    healingWisdom: 'We are never alone - we carry the strength of all who came before us in our DNA and spirit'
  }
};

const CULTURAL_PRACTICES = [
  {
    name: 'Sobonfu Somé Circle Practice',
    culture: 'Dagara (West African)',
    description: 'Ritual for processing grief and trauma in community',
    practice: 'Creating sacred space where pain can be witnessed and held collectively',
    application: 'When experiencing loss, create a circle with trusted people to witness and hold your grief'
  },
  {
    name: 'Ho\'oponopono',
    culture: 'Hawaiian',
    description: 'Ancient practice of reconciliation and forgiveness',
    practice: 'Four phrases: I\'m sorry, Please forgive me, Thank you, I love you',
    application: 'Use for healing relationships with others and for self-forgiveness'
  },
  {
    name: 'Forest Bathing (Shinrin-yoku)',
    culture: 'Japanese',
    description: 'Mindful immersion in forest atmosphere',
    practice: 'Slow, mindful walking in nature, engaging all senses without agenda',
    application: 'When feeling disconnected or overwhelmed, spend time mindfully in natural settings'
  },
  {
    name: 'Temascal/Sweat Lodge',
    culture: 'Indigenous American',
    description: 'Purification ceremony using steam and sacred medicines',
    practice: 'Ritual cleansing of body, mind, and spirit in sacred heated structure',
    application: 'Symbolic rebirth and release of what no longer serves'
  },
  {
    name: 'Ubuntu Healing Circles',
    culture: 'Southern African',
    description: 'Community-centered approach to processing trauma',
    practice: 'Collective witnessing and support where healing happens in relationship',
    application: 'Share struggles in trusted community, receive wisdom and support collectively'
  },
  {
    name: 'Rumi\'s Sohbet',
    culture: 'Sufi/Islamic',
    description: 'Spiritual conversation and heart-centered gathering',
    practice: 'Deep listening and sharing from the heart about spiritual experiences',
    application: 'Create space for meaningful conversation about life\'s deeper questions'
  }
];

const WISDOM_PROMPTS_BY_TRADITION = {
  ubuntu: [
    "How has community healing supported your individual journey?",
    "What wisdom do you carry from your ancestors?",
    "How do you create belonging for others who feel disconnected?"
  ],
  ikigai: [
    "What small daily practice brings you closer to your purpose?",
    "How has difficulty helped clarify what truly matters to you?",
    "Where do your gifts meet the world's needs?"
  ],
  saudade: [
    "How have you transformed longing into appreciation or hope?",
    "What absent thing taught you to value what you have?",
    "How does remembering beauty help you through difficult times?"
  ],
  wabi_sabi: [
    "What imperfection in yourself have you learned to see as beautiful?",
    "How has accepting life's temporariness brought you peace?",
    "What 'broken' thing in your life became more beautiful for having been cracked?"
  ],
  dharmic: [
    "How has your suffering become a source of compassion for others?",
    "What practice helps you stay present with difficult emotions?",
    "How do you serve something larger than yourself?"
  ],
  indigenous: [
    "What decision are you making with seven generations in mind?",
    "How do you honor both your ancestors and the children to come?",
    "What wisdom does the natural world offer for your healing?"
  ]
};

export default function CulturalWisdomExchange({ 
  preferredLanguage = 'en', 
  culturalContext = 'universal' 
}: CulturalWisdomExchangeProps) {
  const [ephemeralIdentity, setEphemeralIdentity] = useState<EphemeralCommunityIdentity | null>(null);
  const [selectedTradition, setSelectedTradition] = useState<string | null>(null);
  const [wisdomContent, setWisdomContent] = useState('');
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [crisisDetected, setCrisisDetected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTraditionDetail, setShowTraditionDetail] = useState(false);
  const [privacyScore, setPrivacyScore] = useState<number>(100);

  useEffect(() => {
    const identity = EphemeralIdentity.createEphemeralIdentity();
    setEphemeralIdentity(identity);
  }, []);

  // Real-time privacy analysis
  useEffect(() => {
    if (wisdomContent.trim().length > 0) {
      const sanitized = PrivacyContentFilter.sanitizeForSharing(wisdomContent);
      setPrivacyScore(sanitized.confidenceScore);
    }
  }, [wisdomContent]);

  const handleCrisisDetection = (keywords: string[]) => {
    setCrisisDetected(keywords);
  };

  const handleSelectTradition = (traditionKey: string) => {
    setSelectedTradition(traditionKey);
    setShowTraditionDetail(true);
  };

  const handleSelectPractice = (practice: any) => {
    setSelectedPractice(practice);
    setWisdomContent(`I'd like to share about the ${practice.name} practice from ${practice.culture} culture:\n\n`);
  };

  const handleSubmitWisdom = async () => {
    if (!ephemeralIdentity || !wisdomContent.trim() || crisisDetected.length > 0) return;

    setIsSubmitting(true);

    try {
      // Sanitize content for privacy
      const sanitized = PrivacyContentFilter.sanitizeForSharing(wisdomContent);
      
      // Create cultural wisdom share
      const wisdomShare = {
        ephemeralId: ephemeralIdentity.ephemeralId,
        sanitizedContent: sanitized.sanitizedContent,
        culturalTradition: selectedTradition,
        selectedPractice: selectedPractice?.name,
        culturalContext,
        language: preferredLanguage,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      };

      // In production, this would save to Firebase with proper security rules
      console.log('Submitting cultural wisdom share:', wisdomShare);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setWisdomContent('');
      setSelectedPractice(null);
      
      alert('Your cultural wisdom has been shared anonymously. Thank you for contributing to our collective healing traditions.');
      
    } catch (error) {
      console.error('Error sharing cultural wisdom:', error);
      alert('There was an issue sharing your wisdom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ephemeralIdentity) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E8E7F] mx-auto mb-4"></div>
            <p className="text-white/80">Creating your cultural sanctuary...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (showTraditionDetail && selectedTradition) {
    const tradition = CULTURAL_TRADITIONS[selectedTradition as keyof typeof CULTURAL_TRADITIONS];
    const prompts = WISDOM_PROMPTS_BY_TRADITION[selectedTradition as keyof typeof WISDOM_PROMPTS_BY_TRADITION] || [];

    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <Button
          onClick={() => setShowTraditionDetail(false)}
          variant="ghost"
          className="text-white/60 hover:text-white/80 mb-4"
        >
          ← Back to Traditions
        </Button>

        {/* Tradition Detail */}
        <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{tradition.emoji}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-light text-white mb-2">{tradition.name}</h1>
              <p className="text-orange-200 text-sm mb-2">{tradition.origin} • "{tradition.philosophy}"</p>
              <p className="text-white/90 text-lg leading-relaxed mb-4">{tradition.description}</p>
              
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Traditional Practices:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tradition.practices.map((practice, index) => (
                    <div key={index} className="bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-white/80 text-sm">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-white/5 border-white/10 p-4">
                <p className="text-orange-200 text-sm font-medium mb-2">Healing Wisdom:</p>
                <p className="text-white/90 italic">"{tradition.healingWisdom}"</p>
              </Card>
            </div>
          </div>
        </Card>

        {/* Cultural Practice Examples */}
        <div className="space-y-4">
          <h2 className="text-xl font-light text-white">Related Healing Practices</h2>
          {CULTURAL_PRACTICES
            .filter(practice => practice.culture.toLowerCase().includes(tradition.origin.toLowerCase().split(' ')[0] || '') || 
                             practice.name.toLowerCase().includes(selectedTradition || ''))
            .map((practice, index) => (
              <Card key={index} className="bg-white/5 border-white/10 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium">{practice.name}</h3>
                    <p className="text-white/60 text-sm">{practice.culture}</p>
                  </div>
                  <Button
                    onClick={() => handleSelectPractice(practice)}
                    className="bg-[#5E8E7F] hover:bg-[#4A6B5E] text-xs px-3 py-1"
                  >
                    Share Experience
                  </Button>
                </div>
                <p className="text-white/80 text-sm mb-2">{practice.description}</p>
                <p className="text-[#5E8E7F] text-sm italic">{practice.application}</p>
              </Card>
            ))}
        </div>

        {/* Wisdom Prompts */}
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-white/90 text-sm font-medium mb-3">💭 Reflection Prompts from {tradition.name}:</p>
          <div className="space-y-2">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setWisdomContent(`Reflecting on ${tradition.name}: ${prompt}\n\n`);
                  setShowTraditionDetail(false);
                }}
                className="w-full text-left p-3 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
              >
                <p className="text-white/80 text-sm italic">"{prompt}"</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400/20 to-yellow-400/20 flex items-center justify-center">
          <span className="text-2xl">🌍</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Cultural Wisdom Exchange</h1>
        <p className="text-white/80 text-sm max-w-2xl mx-auto">
          Share healing traditions, practices, and wisdom from cultures around the world. 
          Honor diverse paths to wholeness while maintaining complete anonymity.
        </p>
        <p className="text-orange-200 text-sm mt-2 italic">
          {getCulturalGreeting(preferredLanguage as any)}
        </p>
      </div>

      {/* Privacy and Cultural Sensitivity Notice */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-400 text-lg">🤝</span>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Cultural Respect & Privacy</p>
            <p className="text-blue-200/80 text-xs leading-relaxed">
              Share cultural practices with reverence and respect. Avoid appropriation by focusing on personal experience 
              and learning. Your identity remains completely anonymous while honoring the wisdom of diverse traditions.
            </p>
          </div>
        </div>
      </Card>

      {/* Cultural Traditions Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-light text-white text-center">Explore Healing Traditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(CULTURAL_TRADITIONS).map(([key, tradition]) => (
            <div 
              key={key} 
              className="rounded-2xl bg-sanctuary border border-sage-200/50 shadow-soft p-6 transition-all duration-300 ease-out backdrop-blur-sm bg-white/5 border-white/10 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-orange-500/30"
              onClick={() => handleSelectTradition(key)}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{tradition.emoji}</div>
                <h3 className="text-white font-medium mb-1">{tradition.name}</h3>
                <p className="text-white/60 text-xs mb-2">{tradition.origin}</p>
                <p className="text-orange-200 text-xs italic mb-3">"{tradition.philosophy}"</p>
                <p className="text-white/80 text-xs leading-relaxed">{tradition.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Community Shares */}
      <div className="space-y-4">
        <h2 className="text-xl font-light text-white text-center">Recent Cultural Wisdom</h2>
        
        {/* Mock cultural wisdom shares */}
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">🪷</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white/60 text-xs">Anonymous • 2 hours ago</span>
                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">Dharmic Wisdom</span>
              </div>
              <p className="text-white/90 text-sm italic leading-relaxed">
                "In my culture, we have a saying: 'The lotus blooms most beautifully from the deepest and thickest mud.' 
                My grandmother taught me this when I was struggling with depression. The practice of morning meditation 
                and seeing my pain as compost for compassion transformed everything. Now I volunteer with others who struggle, 
                and I see how my darkness became light for others."
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-white/60">
                <span>💜 34 hearts</span>
                <span>🌟 28 wisdom</span>
                <span>🙏 19 gratitude</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-2xl">🌍</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white/60 text-xs">Anonymous • 6 hours ago</span>
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">Ubuntu Philosophy</span>
              </div>
              <p className="text-white/90 text-sm italic leading-relaxed">
                "Ubuntu taught me that healing isn't something I do alone. When I was struggling with trauma from my childhood, 
                I thought I had to be strong by myself. But my community showed me: 'I am because we are.' 
                My healing happened when I allowed others to witness my pain and when I witnessed theirs. 
                We became whole together."
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-white/60">
                <span>💜 52 hearts</span>
                <span>🌟 41 wisdom</span>
                <span>🤝 37 solidarity</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Wisdom Sharing Form */}
      {wisdomContent && (
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Sharing Cultural Wisdom Anonymously</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">Anonymous</span>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  privacyScore >= 80 ? 'bg-green-500/20 text-green-300' : 
                  privacyScore >= 60 ? 'bg-yellow-500/20 text-yellow-300' : 
                  'bg-red-500/20 text-red-300'
                }`}>
                  Privacy: {privacyScore}%
                </div>
              </div>
            </div>
            
            <CrisisKeywordDetector 
              text={wisdomContent}
              onCrisisDetected={handleCrisisDetection}
            />
            
            <TextArea
              placeholder="Share your experience with cultural healing practices, wisdom traditions, or insights from your heritage. Honor the tradition while sharing your personal journey..."
              value={wisdomContent}
              onChange={(e) => setWisdomContent(e.target.value)}
              className="min-h-40 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className={`text-xs ${
                wisdomContent.length > 1000 ? 'text-red-400' : 'text-white/40'
              }`}>
                {wisdomContent.length}/1000 characters
              </span>
              {selectedPractice && (
                <span className="text-xs text-orange-300">
                  Sharing about: {selectedPractice.name}
                </span>
              )}
            </div>
            <Button
              onClick={handleSubmitWisdom}
              disabled={!wisdomContent.trim() || wisdomContent.length > 1000 || crisisDetected.length > 0 || isSubmitting}
              className="bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
            >
              {isSubmitting ? 'Sharing Wisdom...' : 'Share Cultural Wisdom'}
            </Button>
          </div>
        </Card>
      )}

      {/* Community Guidelines */}
      <Card className="bg-white/5 border-white/10 p-4">
        <p className="text-white/80 text-xs leading-relaxed">
          <span className="font-medium">Cultural Sharing Guidelines:</span> Share personal experiences with cultural practices respectfully. 
          Avoid claiming expertise in traditions not your own. Focus on how practices have helped you heal. 
          Honor the sacred nature of traditional wisdom. All sharing remains completely anonymous.
        </p>
      </Card>
    </div>
  );
}