'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type EphemeralCommunityIdentity } from '@/lib/community/privacy-engine';

interface CollectiveHealingChallengesProps {
  ephemeralIdentity: EphemeralCommunityIdentity;
}

interface HealingChallenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  type: 'self-compassion' | 'mindfulness' | 'gratitude' | 'movement' | 'connection' | 'creativity' | 'purpose';
  difficulty: 'gentle' | 'moderate' | 'intensive';
  culturalAdaptations?: string[];
  dailyPrompts: string[];
  collectiveGoal?: {
    target: number;
    current: number;
    unit: string;
  };
  participants: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  emoji: string;
  color: string;
  benefits: string[];
}

interface ParticipantProgress {
  ephemeralId: string;
  challengeId: string;
  dayNumber: number;
  completedDays: number[];
  reflections: { [day: number]: string };
  joinedAt: Date;
  lastActivity: Date;
  isAnonymous: boolean;
}

const ACTIVE_CHALLENGES: HealingChallenge[] = [
  {
    id: 'self-compassion-30',
    title: '30 Days of Self-Compassion',
    description: 'Transform your inner voice from critic to caring friend through daily practices of self-kindness.',
    duration: 30,
    type: 'self-compassion',
    difficulty: 'gentle',
    culturalAdaptations: ['ubuntu', 'buddhist', 'christian', 'secular'],
    dailyPrompts: [
      'Write yourself a letter of forgiveness for a past mistake',
      'Practice the loving-kindness meditation for yourself',
      'Identify three things you admire about how you handled a difficult situation',
      'Create a comfort ritual for when you\'re struggling',
      'Write down what you would tell a dear friend going through your situation',
      'Practice mindful self-touch when feeling stressed',
      'List five ways you\'ve grown stronger through challenges'
    ],
    collectiveGoal: {
      target: 100000,
      current: 73429,
      unit: 'acts of self-compassion'
    },
    participants: 2847,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    isActive: true,
    emoji: '💝',
    color: 'from-pink-400 to-rose-500',
    benefits: [
      'Reduced self-criticism',
      'Increased emotional resilience', 
      'Better stress management',
      'Improved self-worth'
    ]
  },
  {
    id: 'mindful-moments-21',
    title: '21 Days of Mindful Moments',
    description: 'Cultivate presence and peace through micro-meditations woven into daily life.',
    duration: 21,
    type: 'mindfulness',
    difficulty: 'gentle',
    culturalAdaptations: ['zen', 'vipassana', 'sufi', 'secular'],
    dailyPrompts: [
      'Take three conscious breaths before meals',
      'Practice mindful walking for 5 minutes',
      'Notice five sounds around you right now',
      'Feel your feet on the ground for 30 seconds',
      'Observe your emotions without judgment for 2 minutes',
      'Practice loving awareness of your body',
      'Create a mindful transition between activities'
    ],
    collectiveGoal: {
      target: 500000,
      current: 387652,
      unit: 'mindful moments'
    },
    participants: 4129,
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-02-05'),
    isActive: true,
    emoji: '🧘',
    color: 'from-blue-400 to-cyan-500',
    benefits: [
      'Reduced anxiety',
      'Increased focus',
      'Better emotional regulation',
      'Enhanced present-moment awareness'
    ]
  },
  {
    id: 'creative-healing-14',
    title: '14 Days of Creative Healing',
    description: 'Express and process emotions through creative activities that honor your unique voice.',
    duration: 14,
    type: 'creativity',
    difficulty: 'moderate',
    culturalAdaptations: ['art-therapy', 'indigenous', 'expressive-arts', 'secular'],
    dailyPrompts: [
      'Create art representing your current emotional landscape',
      'Write a poem about something you\'re healing from',
      'Dance or move to express how you feel today',
      'Create a collage of your hopes and dreams',
      'Write a song or humming tune that captures your mood',
      'Draw your safe place - real or imagined',
      'Create something beautiful from something broken'
    ],
    collectiveGoal: {
      target: 25000,
      current: 18763,
      unit: 'creative expressions'
    },
    participants: 1892,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-14'),
    isActive: true,
    emoji: '🎨',
    color: 'from-purple-400 to-indigo-500',
    benefits: [
      'Emotional expression',
      'Trauma processing',
      'Increased self-awareness',
      'Joy and play'
    ]
  },
  {
    id: 'gratitude-shift-7',
    title: '7 Days of Gratitude Shift',
    description: 'Rewire your brain for positivity through intentional appreciation practices.',
    duration: 7,
    type: 'gratitude',
    difficulty: 'gentle',
    culturalAdaptations: ['spiritual', 'secular', 'indigenous', 'buddhist'],
    dailyPrompts: [
      'Find three unexpected things to appreciate today',
      'Write a thank you note to someone who supported you',
      'Appreciate something difficult that taught you resilience',
      'Notice beauty in an ordinary moment',
      'Feel gratitude for your body and what it does for you',
      'Appreciate a challenge that helped you grow',
      'Celebrate how far you\'ve come on your healing journey'
    ],
    participants: 5647,
    startDate: new Date('2025-02-10'),
    endDate: new Date('2025-02-16'),
    isActive: true,
    emoji: '🙏',
    color: 'from-amber-400 to-orange-500',
    benefits: [
      'Improved mood',
      'Better sleep',
      'Increased optimism',
      'Stronger relationships'
    ]
  }
];

const CHALLENGE_TYPES = {
  'self-compassion': { emoji: '💝', color: 'pink' },
  'mindfulness': { emoji: '🧘', color: 'blue' },
  'gratitude': { emoji: '🙏', color: 'amber' },
  'movement': { emoji: '💃', color: 'green' },
  'connection': { emoji: '🤝', color: 'purple' },
  'creativity': { emoji: '🎨', color: 'indigo' },
  'purpose': { emoji: '🌟', color: 'yellow' }
};

export default function CollectiveHealingChallenges({ ephemeralIdentity }: CollectiveHealingChallengesProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<HealingChallenge | null>(null);
  const [myProgress, setMyProgress] = useState<ParticipantProgress | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'challenge-detail' | 'my-progress'>('overview');
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);

  const handleJoinChallenge = (challenge: HealingChallenge) => {
    const progress: ParticipantProgress = {
      ephemeralId: ephemeralIdentity.ephemeralId,
      challengeId: challenge.id,
      dayNumber: 1,
      completedDays: [],
      reflections: {},
      joinedAt: new Date(),
      lastActivity: new Date(),
      isAnonymous: true
    };

    setMyProgress(progress);
    setJoinedChallenges(prev => [...prev, challenge.id]);
    setCurrentView('my-progress');
    
    // In production, save to Firebase
    console.log('Joining challenge:', challenge.id, progress);
  };

  const handleCompleteDay = (dayNumber: number, reflection?: string) => {
    if (!myProgress) return;

    const updatedProgress = {
      ...myProgress,
      completedDays: [...myProgress.completedDays, dayNumber],
      reflections: reflection ? { ...myProgress.reflections, [dayNumber]: reflection } : myProgress.reflections,
      lastActivity: new Date()
    };

    setMyProgress(updatedProgress);
    
    // In production, update Firebase
    console.log('Completed day:', dayNumber, updatedProgress);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">🎯</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Collective Healing Challenges</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Join thousands of anonymous community members in structured healing activities. Grow together without competition.
        </p>
      </div>

      {/* Community Impact */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 p-6">
        <div className="text-center mb-6">
          <h3 className="text-emerald-200 font-medium text-lg mb-2">Community Healing Impact</h3>
          <p className="text-emerald-200/80 text-sm">Together, we've created positive change through collective action</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-emerald-300 mb-1">896,844</div>
            <div className="text-emerald-200/70 text-xs">Healing Actions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-emerald-300 mb-1">14,615</div>
            <div className="text-emerald-200/70 text-xs">Active Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-emerald-300 mb-1">127</div>
            <div className="text-emerald-200/70 text-xs">Completed Challenges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-emerald-300 mb-1">93%</div>
            <div className="text-emerald-200/70 text-xs">Report Feeling Better</div>
          </div>
        </div>
      </Card>

      {/* Active Challenges */}
      <div className="space-y-6">
        <h2 className="text-2xl font-light text-white text-center">Active Healing Challenges</h2>
        
        <div className="grid gap-6">
          {ACTIVE_CHALLENGES.map((challenge) => (
            <Card key={challenge.id} className="bg-white/5 border-white/10 p-6 hover:bg-white/8 transition-colors">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${challenge.color} flex items-center justify-center text-xl`}>
                      {challenge.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg mb-1">{challenge.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed mb-2">{challenge.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span className="px-2 py-1 rounded-full bg-white/10 text-white/70">
                          {challenge.duration} days
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/10 text-white/70">
                          {challenge.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/10 text-white/70">
                          {challenge.participants.toLocaleString()} participants
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Collective Goal */}
                  {challenge.collectiveGoal && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/60 mb-2">
                        <span>Collective Goal Progress</span>
                        <span>{challenge.collectiveGoal.current.toLocaleString()} / {challenge.collectiveGoal.target.toLocaleString()} {challenge.collectiveGoal.unit}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 bg-gradient-to-r ${challenge.color} rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min((challenge.collectiveGoal.current / challenge.collectiveGoal.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {challenge.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-white/70">
                        <span className="w-1 h-1 rounded-full bg-green-400"></span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      setSelectedChallenge(challenge);
                      setCurrentView('challenge-detail');
                    }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
                  >
                    View Details
                  </Button>
                  
                  {joinedChallenges.includes(challenge.id) ? (
                    <Button
                      onClick={() => {
                        setSelectedChallenge(challenge);
                        setCurrentView('my-progress');
                      }}
                      className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 whitespace-nowrap"
                    >
                      Continue Challenge
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinChallenge(challenge)}
                      className="bg-[#5E8E7F] hover:bg-[#4A6B5E] whitespace-nowrap"
                    >
                      Join Challenge
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-6">
        <h3 className="text-blue-200 font-medium mb-4">Challenge Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-blue-200/90 font-medium mb-2">Non-Competitive Healing</h4>
            <ul className="text-blue-200/80 text-xs space-y-1">
              <li>• Focus on personal growth, not comparison</li>
              <li>• Celebrate collective progress, not individual performance</li>
              <li>• Missing days doesn't mean failure - it means you're human</li>
              <li>• Adapt activities to your needs and cultural background</li>
            </ul>
          </div>
          <div>
            <h4 className="text-blue-200/90 font-medium mb-2">Anonymous Support</h4>
            <ul className="text-blue-200/80 text-xs space-y-1">
              <li>• Share encouragement without revealing identity</li>
              <li>• All progress tracking is completely private</li>
              <li>• Only aggregate community data is shown</li>
              <li>• Crisis support is always available</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderChallengeDetail = () => {
    if (!selectedChallenge) return null;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${selectedChallenge.color} flex items-center justify-center text-2xl`}>
            {selectedChallenge.emoji}
          </div>
          <h1 className="text-2xl font-light text-white mb-2">{selectedChallenge.title}</h1>
          <p className="text-white/80 text-sm max-w-md mx-auto">{selectedChallenge.description}</p>
        </div>

        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-white/90 font-medium mb-4">Daily Practices Preview</h3>
          <div className="space-y-3">
            {selectedChallenge.dailyPrompts.slice(0, 7).map((prompt, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-6 h-6 rounded-full bg-[#5E8E7F]/20 flex items-center justify-center text-xs text-[#5E8E7F] font-medium">
                  {index + 1}
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{prompt}</p>
              </div>
            ))}
            {selectedChallenge.dailyPrompts.length > 7 && (
              <p className="text-white/60 text-xs text-center">
                + {selectedChallenge.dailyPrompts.length - 7} more personalized practices
              </p>
            )}
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-white/90 font-medium mb-4">Expected Benefits</h3>
          <div className="grid grid-cols-2 gap-3">
            {selectedChallenge.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="text-white/80 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-white/90 font-medium mb-4">Cultural Adaptations Available</h3>
          <div className="flex flex-wrap gap-2">
            {selectedChallenge.culturalAdaptations?.map((adaptation, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                {adaptation}
              </span>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => setCurrentView('overview')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Back to Challenges
          </Button>
          <Button
            onClick={() => handleJoinChallenge(selectedChallenge)}
            className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E]"
          >
            Join This Challenge
          </Button>
        </div>
      </div>
    );
  };

  const renderMyProgress = () => {
    if (!myProgress || !selectedChallenge) return null;

    const today = Math.floor((Date.now() - myProgress.joinedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const completionRate = (myProgress.completedDays.length / Math.min(today, selectedChallenge.duration)) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${selectedChallenge.color} flex items-center justify-center text-2xl`}>
            {selectedChallenge.emoji}
          </div>
          <h1 className="text-2xl font-light text-white mb-2">Your Progress</h1>
          <h2 className="text-lg text-white/80">{selectedChallenge.title}</h2>
        </div>

        <Card className="bg-green-500/10 border-green-500/20 p-6">
          <div className="text-center">
            <div className="text-3xl font-medium text-green-300 mb-2">
              {myProgress.completedDays.length} / {selectedChallenge.duration}
            </div>
            <div className="text-green-200/80 text-sm mb-4">Days Completed</div>
            <div className="w-full bg-green-500/20 rounded-full h-3 mb-2">
              <div 
                className="h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(myProgress.completedDays.length / selectedChallenge.duration) * 100}%` }}
              ></div>
            </div>
            <p className="text-green-200/70 text-xs">
              {completionRate.toFixed(0)}% completion rate
            </p>
          </div>
        </Card>

        {today <= selectedChallenge.duration && (
          <Card className="bg-blue-500/10 border-blue-500/20 p-6">
            <h3 className="text-blue-200 font-medium mb-3">Day {today} Practice</h3>
            <p className="text-blue-200/80 text-sm mb-4 leading-relaxed">
              {selectedChallenge.dailyPrompts[today - 1] || selectedChallenge.dailyPrompts[0]}
            </p>
            <Button
              onClick={() => handleCompleteDay(today)}
              disabled={myProgress.completedDays.includes(today)}
              className="w-full bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
            >
              {myProgress.completedDays.includes(today) ? '✓ Completed Today' : 'Mark as Complete'}
            </Button>
          </Card>
        )}

        <Button
          onClick={() => setCurrentView('overview')}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          Back to All Challenges
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {currentView === 'overview' && renderOverview()}
      {currentView === 'challenge-detail' && renderChallengeDetail()}
      {currentView === 'my-progress' && renderMyProgress()}
    </div>
  );
}