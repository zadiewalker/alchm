'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { type EphemeralCommunityIdentity } from '@/lib/community/privacy-engine';

interface CulturalHealingCirclesProps {
  ephemeralIdentity: EphemeralCommunityIdentity;
}

interface CulturalTradition {
  id: string;
  name: string;
  culture: string;
  description: string;
  philosophy: string;
  practices: string[];
  emoji: string;
  color: string;
  activeCircles: number;
  totalMembers: number;
  languages: string[];
}

interface HealingCircle {
  id: string;
  traditionId: string;
  name: string;
  description: string;
  facilitatorEphemeralId: string;
  maxMembers: number;
  currentMembers: number;
  language: string;
  sessionType: 'ongoing' | 'focused' | 'ceremonial';
  schedule: string;
  culturalGuidelines: string[];
  isActive: boolean;
  nextSession?: Date;
}

interface CircleMember {
  ephemeralId: string;
  tradition: string;
  role: 'participant' | 'facilitator' | 'elder';
  culturalBackground?: string;
  joinedAt: Date;
}

const CULTURAL_TRADITIONS: CulturalTradition[] = [
  {
    id: 'ubuntu-philosophy',
    name: 'Ubuntu Healing Circles',
    culture: 'Southern African',
    description: 'Healing through the understanding that "I am because we are" - collective humanity and interconnectedness',
    philosophy: 'Ubuntu emphasizes that individual healing happens through community connection and mutual support.',
    practices: [
      'Circle sharing with speaking stick',
      'Collective problem-solving',
      'Ubuntu affirmations',
      'Community accountability',
      'Ancestor honoring',
      'Storytelling traditions'
    ],
    emoji: '🌍',
    color: 'from-orange-400 to-red-500',
    activeCircles: 12,
    totalMembers: 347,
    languages: ['English', 'Zulu', 'Xhosa', 'Swahili']
  },
  {
    id: 'indigenous-circle',
    name: 'Indigenous Medicine Wheel',
    culture: 'Native American',
    description: 'Healing through the sacred directions, seasonal cycles, and connection to all relations',
    philosophy: 'Balance and harmony through understanding our place in the web of life and honoring natural cycles.',
    practices: [
      'Medicine wheel teachings',
      'Seasonal ceremonies',
      'Connection with nature',
      'Elder wisdom sharing',
      'Smudging and cleansing',
      'Vision seeking guidance'
    ],
    emoji: '🏹',
    color: 'from-green-400 to-blue-500',
    activeCircles: 8,
    totalMembers: 234,
    languages: ['English', 'Lakota', 'Cherokee', 'Navajo']
  },
  {
    id: 'buddhist-sangha',
    name: 'Buddhist Sangha Circles',
    culture: 'Buddhist',
    description: 'Healing through mindfulness, compassion, and the understanding of interdependence',
    philosophy: 'Suffering arises from attachment; healing comes through mindful awareness and loving-kindness.',
    practices: [
      'Mindfulness meditation',
      'Loving-kindness practice',
      'Dharma study circles',
      'Noble silence',
      'Walking meditation',
      'Compassion cultivation'
    ],
    emoji: '☸️',
    color: 'from-purple-400 to-indigo-500',
    activeCircles: 15,
    totalMembers: 456,
    languages: ['English', 'Tibetan', 'Thai', 'Japanese']
  },
  {
    id: 'sufi-heart',
    name: 'Sufi Heart Circles',
    culture: 'Islamic Mystical',
    description: 'Healing through divine love, spiritual poetry, and the remembrance of the Divine',
    philosophy: 'The heart is the seat of divine knowledge; healing comes through purifying and opening the heart.',
    practices: [
      'Dhikr (remembrance)',
      'Sufi poetry sharing',
      'Whirling meditation',
      'Heart-centered breathing',
      'Sacred music',
      'Spiritual companionship'
    ],
    emoji: '🌙',
    color: 'from-teal-400 to-cyan-500',
    activeCircles: 6,
    totalMembers: 189,
    languages: ['English', 'Arabic', 'Persian', 'Turkish']
  },
  {
    id: 'ancestral-latina',
    name: 'Curandera Healing Circles',
    culture: 'Latina/Hispanic',
    description: 'Healing through ancestral wisdom, herbal knowledge, and community solidarity',
    philosophy: 'Healing is holistic - body, mind, spirit, and community must all be tended for true wellness.',
    practices: [
      'Limpias (spiritual cleansings)',
      'Herbal remedy sharing',
      'Sobadoras (healing massage)',
      'Dichos (wisdom sayings)',
      'Altar building',
      'Day of the Dead rituals'
    ],
    emoji: '🌺',
    color: 'from-pink-400 to-rose-500',
    activeCircles: 9,
    totalMembers: 312,
    languages: ['Spanish', 'English', 'Portuguese']
  },
  {
    id: 'jewish-tikkun',
    name: 'Tikkun Olam Circles',
    culture: 'Jewish',
    description: 'Healing through repairing the world and finding meaning in suffering',
    philosophy: 'Individual healing contributes to healing the world; we are partners with the Divine in repair.',
    practices: [
      'Talmudic study',
      'Ethical discussions',
      'Shabbat reflections',
      'Tzedakah (justice) actions',
      'Mourning rituals',
      'Torah wisdom sharing'
    ],
    emoji: '✡️',
    color: 'from-blue-400 to-purple-500',
    activeCircles: 7,
    totalMembers: 201,
    languages: ['English', 'Hebrew', 'Yiddish']
  },
  {
    id: 'celtic-spiral',
    name: 'Celtic Spiral Circles',
    culture: 'Celtic/Irish',
    description: 'Healing through connection to the land, seasonal wisdom, and ancient Celtic spirituality',
    philosophy: 'Life moves in spirals; healing comes through honoring cycles and connecting with ancestral wisdom.',
    practices: [
      'Celtic seasonal rituals',
      'Ogham wisdom',
      'Sacred grove meditations',
      'Celtic knot meditations',
      'Storytelling traditions',
      'Ancestor veneration'
    ],
    emoji: '🍀',
    color: 'from-emerald-400 to-green-500',
    activeCircles: 5,
    totalMembers: 167,
    languages: ['English', 'Gaelic', 'Welsh']
  },
  {
    id: 'universal-secular',
    name: 'Universal Healing Circles',
    culture: 'Secular/Universal',
    description: 'Healing through human connection, evidence-based practices, and universal wisdom',
    philosophy: 'Healing is possible for everyone regardless of faith; we find common ground in shared humanity.',
    practices: [
      'Mindfulness practices',
      'Emotional regulation',
      'Trauma-informed support',
      'Rational discussions',
      'Secular meditation',
      'Humanistic values'
    ],
    emoji: '🌟',
    color: 'from-yellow-400 to-amber-500',
    activeCircles: 18,
    totalMembers: 567,
    languages: ['English', 'Multi-language support']
  }
];

export default function CulturalHealingCircles({ ephemeralIdentity }: CulturalHealingCirclesProps) {
  const [currentView, setCurrentView] = useState<'browse' | 'tradition-detail' | 'circle-detail' | 'joined-circles'>('browse');
  const [selectedTradition, setSelectedTradition] = useState<CulturalTradition | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<HealingCircle | null>(null);
  const [joinedCircles, setJoinedCircles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTraditions = CULTURAL_TRADITIONS.filter(tradition =>
    !searchQuery || 
    tradition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tradition.culture.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tradition.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCircle = (circleId: string) => {
    setJoinedCircles(prev => [...prev, circleId]);
    // In production, save to Firebase
    console.log('Joined circle:', circleId);
  };

  const renderBrowse = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 flex items-center justify-center">
          <span className="text-2xl">🌍</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Cultural Healing Circles</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          Honor your cultural heritage while connecting with others who share similar healing traditions. 
          Find circles that resonate with your spiritual and cultural background.
        </p>
      </div>

      {/* Search */}
      <Card className="bg-white/5 border-white/10 p-4">
        <input
          type="text"
          placeholder="Search by culture, tradition, or practice..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:border-[#5E8E7F] focus:outline-none"
        />
      </Card>

      {/* Cultural Traditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTraditions.map((tradition) => (
          <Card key={tradition.id} className="bg-white/5 border-white/10 p-6 hover:bg-white/8 transition-colors cursor-pointer">
            <div onClick={() => {
              setSelectedTradition(tradition);
              setCurrentView('tradition-detail');
            }}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tradition.color} flex items-center justify-center text-xl`}>
                  {tradition.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg">{tradition.name}</h3>
                  <p className="text-white/60 text-sm">{tradition.culture}</p>
                </div>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                {tradition.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div>
                  <div className="text-[#5E8E7F] font-medium">{tradition.activeCircles}</div>
                  <div className="text-white/60">Active Circles</div>
                </div>
                <div>
                  <div className="text-[#5E8E7F] font-medium">{tradition.totalMembers}</div>
                  <div className="text-white/60">Community Members</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {tradition.languages.slice(0, 3).map((lang, index) => (
                  <span key={index} className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                    {lang}
                  </span>
                ))}
                {tradition.languages.length > 3 && (
                  <span className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                    +{tradition.languages.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Inclusivity Statement */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-6">
        <h3 className="text-purple-200 font-medium mb-4">Cultural Healing Inclusivity</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-purple-200/90 font-medium mb-2">All Backgrounds Welcome</h4>
            <ul className="text-purple-200/80 text-xs space-y-1">
              <li>• Cultural healing circles welcome all who resonate with the tradition</li>
              <li>• You don't need to be born into a culture to find wisdom there</li>
              <li>• Respectful participation and cultural humility are required</li>
              <li>• Each circle maintains its own guidelines and boundaries</li>
            </ul>
          </div>
          <div>
            <h4 className="text-purple-200/90 font-medium mb-2">Sacred Anonymity</h4>
            <ul className="text-purple-200/80 text-xs space-y-1">
              <li>• Complete privacy protection across all cultural circles</li>
              <li>• Cultural context is honored without revealing identity</li>
              <li>• Safe space to explore different healing traditions</li>
              <li>• Crisis support integrated with cultural sensitivity</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTraditionDetail = () => {
    if (!selectedTradition) return null;

    // Mock circle data for each tradition
    const mockCircles: HealingCircle[] = [
      {
        id: `${selectedTradition.id}-circle-1`,
        traditionId: selectedTradition.id,
        name: `${selectedTradition.name} - Beginners Circle`,
        description: `Introduction to ${selectedTradition.culture} healing practices with gentle guidance`,
        facilitatorEphemeralId: 'facilitator-123',
        maxMembers: 12,
        currentMembers: 8,
        language: selectedTradition.languages[0],
        sessionType: 'ongoing',
        schedule: 'Wednesdays 7PM EST',
        culturalGuidelines: [
          'Approach with respect and humility',
          'Honor the wisdom of elders',
          'Maintain sacred confidentiality',
          'Practice cultural sensitivity'
        ],
        isActive: true,
        nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: `${selectedTradition.id}-circle-2`,
        traditionId: selectedTradition.id,
        name: `${selectedTradition.name} - Deep Healing Circle`,
        description: `Intensive healing work for those familiar with ${selectedTradition.culture} practices`,
        facilitatorEphemeralId: 'facilitator-456',
        maxMembers: 8,
        currentMembers: 6,
        language: selectedTradition.languages[0],
        sessionType: 'focused',
        schedule: 'Saturdays 6PM EST',
        culturalGuidelines: [
          'Previous experience recommended',
          'Commitment to full circle duration',
          'Deep sharing and vulnerability expected',
          'Honor ceremonial protocols'
        ],
        isActive: true,
        nextSession: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${selectedTradition.color} flex items-center justify-center text-2xl`}>
            {selectedTradition.emoji}
          </div>
          <h1 className="text-2xl font-light text-white mb-2">{selectedTradition.name}</h1>
          <p className="text-white/80 text-sm">{selectedTradition.culture} Healing Tradition</p>
        </div>

        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-white/90 font-medium mb-3">Philosophy & Approach</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">{selectedTradition.description}</p>
          <p className="text-white/70 text-sm leading-relaxed italic">{selectedTradition.philosophy}</p>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-white/90 font-medium mb-3">Traditional Practices</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {selectedTradition.practices.map((practice, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5E8E7F]"></span>
                <span className="text-white/80 text-sm">{practice}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-light text-white text-center">Active Healing Circles</h2>
          {mockCircles.map((circle) => (
            <Card key={circle.id} className="bg-white/5 border-white/10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg mb-2">{circle.name}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-3">{circle.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span className="px-2 py-1 rounded-full bg-white/10">{circle.sessionType}</span>
                    <span>{circle.schedule}</span>
                    <span>{circle.language}</span>
                    <span>{circle.currentMembers}/{circle.maxMembers} members</span>
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    onClick={() => handleJoinCircle(circle.id)}
                    disabled={joinedCircles.includes(circle.id) || circle.currentMembers >= circle.maxMembers}
                    className="bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50 text-sm"
                  >
                    {joinedCircles.includes(circle.id) ? 'Joined' : circle.currentMembers >= circle.maxMembers ? 'Full' : 'Join Circle'}
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-white/70 text-sm font-medium mb-2">Cultural Guidelines</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {circle.culturalGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/40"></span>
                      <span className="text-white/60 text-xs">{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>

              {circle.nextSession && (
                <div className="border-t border-white/10 pt-3 mt-3">
                  <p className="text-white/70 text-xs">
                    Next Session: {circle.nextSession.toLocaleDateString()} at {circle.schedule.split(' ').slice(-2).join(' ')}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Button
          onClick={() => setCurrentView('browse')}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          Back to All Traditions
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {currentView === 'browse' && renderBrowse()}
      {currentView === 'tradition-detail' && renderTraditionDetail()}
    </div>
  );
}