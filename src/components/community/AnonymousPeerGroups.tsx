'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Shield, 
  MessageCircle, 
  Heart, 
  Clock, 
  Star,
  Eye,
  EyeOff,
  Lock,
  UserCheck,
  Compass,
  Leaf,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  Globe,
  ChevronRight,
  Award
} from 'lucide-react';

interface UserProgress {
  totalPathwaysStarted: number;
  totalPathwaysCompleted: number;
  currentlyActive: number;
  weeklyProgress: number;
  healingMomentum: 'emerging' | 'growing' | 'blooming' | 'flourishing';
  communityContributions: number;
  peerConnectionsCount: number;
  storiesShared: number;
  milestonesAchieved: number;
  healingStreak: number;
  milestones: Array<{
    id: string;
    title: string;
    achievedAt: Date;
    category: string;
    communityRecognition?: number;
  }>;
}

interface PeerGroup {
  id: string;
  name: string;
  description: string;
  pathwayFocus: string;
  category: string;
  icon: string;
  gradient: string;
  memberCount: number;
  activeNow: number;
  weeklyActivity: number;
  supportLevel: 'gentle' | 'moderate' | 'intensive';
  privacyLevel: 'anonymous' | 'semi-anonymous' | 'identified';
  meetingStyle: 'asynchronous' | 'scheduled' | 'flexible';
  traumaInformed: boolean;
  professionalModerated: boolean;
  languageSupport: string[];
  culturalFocus?: string[];
  ageGroup: 'all' | 'teens' | 'young-adults' | 'adults' | 'seniors';
  timeZone: string;
  nextSession?: Date;
  recentActivity: {
    supportMessages: number;
    milestonesShared: number;
    storiesShared: number;
    encouragements: number;
  };
  safetyFeatures: string[];
  joinCriteria: string[];
  currentTopics: string[];
}

interface AnonymousPeerGroupsProps {
  userProgress: UserProgress | null;
}

export function AnonymousPeerGroups({ userProgress }: AnonymousPeerGroupsProps) {
  const [peerGroups, setPeerGroups] = useState<PeerGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<PeerGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedGroups, setJoinedGroups] = useState<string[]>(['mindful-healers', 'trauma-survivors']);

  const categories = [
    { id: 'all', name: 'All Groups', icon: Globe },
    { id: 'mindfulness', name: 'Mindfulness & Awareness', icon: Leaf },
    { id: 'emotional-regulation', name: 'Emotional Healing', icon: Heart },
    { id: 'trauma-recovery', name: 'Trauma Recovery', icon: Shield },
    { id: 'relationships', name: 'Connection & Relationships', icon: Users },
    { id: 'purpose', name: 'Purpose & Meaning', icon: Compass }
  ];

  useEffect(() => {
    // Simulate loading peer groups data
    setTimeout(() => {
      const mockGroups: PeerGroup[] = [
        {
          id: 'mindful-healers',
          name: 'Mindful Healers Circle',
          description: 'A supportive space for those exploring mindfulness as a healing practice. Share insights, challenges, and victories in present-moment awareness.',
          pathwayFocus: 'Mindful Awareness',
          category: 'mindfulness',
          icon: '🧘‍♀️',
          gradient: 'from-green-400/20 to-emerald-600/20',
          memberCount: 234,
          activeNow: 12,
          weeklyActivity: 87,
          supportLevel: 'gentle',
          privacyLevel: 'anonymous',
          meetingStyle: 'asynchronous',
          traumaInformed: true,
          professionalModerated: false,
          languageSupport: ['English', 'Spanish', 'French'],
          ageGroup: 'all',
          timeZone: 'Multiple',
          recentActivity: {
            supportMessages: 45,
            milestonesShared: 8,
            storiesShared: 12,
            encouragements: 156
          },
          safetyFeatures: [
            'Anonymous identity protection',
            'Content moderation by community',
            'Crisis detection and support routing',
            'Trauma-informed communication guidelines',
            'Safe space principles enforced'
          ],
          joinCriteria: [
            'Currently practicing or learning mindfulness',
            'Commitment to supportive communication',
            'Respect for anonymous sharing',
            'Agreement to community guidelines'
          ],
          currentTopics: [
            'Mindful breathing techniques',
            'Dealing with racing thoughts',
            'Creating daily practice rituals',
            'Mindfulness in difficult emotions'
          ]
        },
        {
          id: 'emotional-balance',
          name: 'Emotional Balance Builders',
          description: 'Peer support for developing emotional regulation skills. Share techniques, setbacks, and breakthroughs in managing emotional intensity.',
          pathwayFocus: 'Emotional Regulation',
          category: 'emotional-regulation',
          icon: '🌊',
          gradient: 'from-blue-400/20 to-teal-600/20',
          memberCount: 189,
          activeNow: 8,
          weeklyActivity: 92,
          supportLevel: 'moderate',
          privacyLevel: 'anonymous',
          meetingStyle: 'flexible',
          traumaInformed: true,
          professionalModerated: true,
          languageSupport: ['English', 'Spanish'],
          ageGroup: 'adults',
          timeZone: 'EST/PST',
          nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          recentActivity: {
            supportMessages: 67,
            milestonesShared: 15,
            storiesShared: 9,
            encouragements: 203
          },
          safetyFeatures: [
            'Professional moderation available',
            'Emotional safety protocols',
            'Crisis intervention procedures',
            'Graduated sharing levels',
            'Peer accountability system'
          ],
          joinCriteria: [
            'Working on emotional regulation',
            'Willingness to share experiences',
            'Commitment to peer support',
            'Understanding of emotional triggers'
          ],
          currentTopics: [
            'Managing anger safely',
            'Anxiety regulation techniques',
            'Emotional boundaries in relationships',
            'Self-compassion practices'
          ]
        },
        {
          id: 'trauma-survivors',
          name: 'Gentle Trauma Healing',
          description: 'A carefully moderated space for trauma survivors. Professional guidance available. Focus on safety, hope, and post-traumatic growth.',
          pathwayFocus: 'Trauma Recovery',
          category: 'trauma-recovery',
          icon: '🌸',
          gradient: 'from-amber-400/20 to-orange-600/20',
          memberCount: 156,
          activeNow: 6,
          weeklyActivity: 78,
          supportLevel: 'intensive',
          privacyLevel: 'anonymous',
          meetingStyle: 'scheduled',
          traumaInformed: true,
          professionalModerated: true,
          languageSupport: ['English'],
          culturalFocus: ['Inclusive', 'LGBTQ+ affirming', 'Culturally diverse'],
          ageGroup: 'adults',
          timeZone: 'Multiple',
          nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          recentActivity: {
            supportMessages: 89,
            milestonesShared: 23,
            storiesShared: 7,
            encouragements: 267
          },
          safetyFeatures: [
            'Licensed professional moderation',
            'Comprehensive safety protocols',
            'Crisis intervention immediate response',
            'Trauma-informed sharing guidelines',
            'Safe word systems for boundaries',
            'Resource library for support'
          ],
          joinCriteria: [
            'Experience with trauma recovery',
            'Stable enough for peer support',
            'Commitment to safety guidelines',
            'Professional support recommended'
          ],
          currentTopics: [
            'Building safety in the body',
            'Navigating triggering situations',
            'Finding meaning after trauma',
            'Supporting others without depleting yourself'
          ]
        },
        {
          id: 'connection-seekers',
          name: 'Connection & Empathy Circle',
          description: 'Build deeper, more authentic relationships. Practice vulnerability, empathy, and healthy communication in a supportive environment.',
          pathwayFocus: 'Empathy & Connection',
          category: 'relationships',
          icon: '🤝',
          gradient: 'from-purple-400/20 to-indigo-600/20',
          memberCount: 201,
          activeNow: 14,
          weeklyActivity: 95,
          supportLevel: 'moderate',
          privacyLevel: 'semi-anonymous',
          meetingStyle: 'flexible',
          traumaInformed: true,
          professionalModerated: false,
          languageSupport: ['English', 'Spanish', 'Mandarin'],
          ageGroup: 'all',
          timeZone: 'Global',
          recentActivity: {
            supportMessages: 123,
            milestonesShared: 19,
            storiesShared: 31,
            encouragements: 412
          },
          safetyFeatures: [
            'Community-moderated discussions',
            'Boundary-respecting culture',
            'Authentic sharing encouraged',
            'Vulnerability protection protocols',
            'Anti-harassment measures'
          ],
          joinCriteria: [
            'Desire to improve relationships',
            'Openness to vulnerability',
            'Commitment to empathetic listening',
            'Respect for diverse perspectives'
          ],
          currentTopics: [
            'Practicing active listening',
            'Setting healthy boundaries',
            'Expressing needs clearly',
            'Building trust over time'
          ]
        },
        {
          id: 'purpose-seekers',
          name: 'Purpose & Meaning Makers',
          description: 'Explore life purpose, values alignment, and meaningful action. Support each other in living authentically and making a positive impact.',
          pathwayFocus: 'Life Purpose Discovery',
          category: 'purpose',
          icon: '🌟',
          gradient: 'from-yellow-400/20 to-gold-600/20',
          memberCount: 178,
          activeNow: 9,
          weeklyActivity: 84,
          supportLevel: 'gentle',
          privacyLevel: 'anonymous',
          meetingStyle: 'asynchronous',
          traumaInformed: true,
          professionalModerated: false,
          languageSupport: ['English', 'Spanish', 'German'],
          ageGroup: 'all',
          timeZone: 'Multiple',
          recentActivity: {
            supportMessages: 56,
            milestonesShared: 14,
            storiesShared: 18,
            encouragements: 189
          },
          safetyFeatures: [
            'Supportive goal-setting environment',
            'Non-judgmental exploration space',
            'Values-based sharing',
            'Encouragement-focused culture',
            'Privacy-respecting discussions'
          ],
          joinCriteria: [
            'Exploring life purpose or meaning',
            'Open to value-based living',
            'Supportive of others\' journeys',
            'Committed to authentic sharing'
          ],
          currentTopics: [
            'Identifying core values',
            'Aligning actions with purpose',
            'Overcoming purpose anxiety',
            'Making meaningful career changes'
          ]
        }
      ];

      setPeerGroups(mockGroups);
      setFilteredGroups(mockGroups);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredGroups(peerGroups);
    } else {
      setFilteredGroups(peerGroups.filter(group => group.category === selectedCategory));
    }
  }, [selectedCategory, peerGroups]);

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'gentle': return 'text-green-400';
      case 'moderate': return 'text-blue-400';
      case 'intensive': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'anonymous': return <EyeOff className="w-4 h-4" />;
      case 'semi-anonymous': return <Eye className="w-4 h-4" />;
      case 'identified': return <UserCheck className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const handleJoinGroup = (groupId: string) => {
    setSelectedGroup(groupId);
    setShowJoinModal(true);
  };

  const confirmJoinGroup = () => {
    if (selectedGroup && !joinedGroups.includes(selectedGroup)) {
      setJoinedGroups([...joinedGroups, selectedGroup]);
    }
    setShowJoinModal(false);
    setSelectedGroup(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-sm border-white/20 border">
          <div className="p-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 text-white">
                <Users className="w-6 h-6 animate-pulse" />
                <span className="text-lg font-light">Loading peer support groups...</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4 flex items-center justify-center gap-3">
          <Shield className="w-8 h-8" />
          Anonymous Peer Support Groups
        </h2>
        <p className="text-white/80 max-w-3xl mx-auto leading-relaxed">
          Connect with others walking similar healing paths. All groups maintain complete anonymity 
          while providing authentic peer support and community wisdom.
        </p>
      </div>

      {/* Privacy Guarantee */}
      <Card className="bg-green-500/10 backdrop-blur-sm border-green-300/30 border max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-300" />
            <h3 className="text-xl font-medium text-green-100">Your Privacy is Protected</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-100/90">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Zero personal information required</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">Anonymous identity maintained</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">End-to-end encrypted communications</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Trauma-informed moderation</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(({ id, name, icon: Icon }) => (
          <Button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === id
                ? 'bg-white/20 text-white backdrop-blur-sm border-white/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            } border border-white/20`}
          >
            <Icon className="w-4 h-4" />
            {name}
          </Button>
        ))}
      </div>

      {/* Your Groups Status */}
      {joinedGroups.length > 0 && (
        <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-300/30 border max-w-4xl mx-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-300" />
              <h3 className="text-xl font-medium text-blue-100">Your Active Groups</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {joinedGroups.map(groupId => {
                const group = peerGroups.find(g => g.id === groupId);
                if (!group) return null;
                return (
                  <div key={groupId} className="flex items-center gap-2 px-3 py-1 bg-blue-400/20 rounded-full text-blue-100 text-sm">
                    <span>{group.icon}</span>
                    <span>{group.name}</span>
                    <Award className="w-3 h-3" />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Peer Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGroups.map((group, index) => {
          const isJoined = joinedGroups.includes(group.id);
          
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className={`bg-gradient-to-br ${group.gradient} backdrop-blur-sm border-white/20 border-2 hover:border-white/40 transition-all duration-300 relative overflow-hidden ${
                  isJoined ? 'ring-2 ring-green-400/50' : ''
                }`}
              >
                {/* Group Status Badges */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
                  {group.traumaInformed && (
                    <div className="px-2 py-1 rounded-full bg-green-500/20 backdrop-blur-sm text-xs text-green-300 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Trauma-Informed
                    </div>
                  )}
                  {group.professionalModerated && (
                    <div className="px-2 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm text-xs text-purple-300 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Professional Moderated
                    </div>
                  )}
                  {isJoined && (
                    <div className="px-2 py-1 rounded-full bg-green-500/30 backdrop-blur-sm text-xs text-green-200 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Joined
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Group Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{group.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-white mb-2">
                        {group.name}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mb-3">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {group.memberCount} members
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          {group.activeNow} active now
                        </span>
                      </div>
                      <div className="text-white/80 text-sm font-medium">
                        Focus: {group.pathwayFocus}
                      </div>
                    </div>
                  </div>

                  {/* Group Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-pink-300" />
                        <span className="text-pink-300 text-sm">Weekly Activity</span>
                      </div>
                      <div className="text-white text-lg font-light">{group.weeklyActivity}%</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="w-4 h-4 text-blue-300" />
                        <span className="text-blue-300 text-sm">Support Level</span>
                      </div>
                      <div className={`text-lg font-light capitalize ${getSupportLevelColor(group.supportLevel)}`}>
                        {group.supportLevel}
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Meeting Info */}
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <div className="flex items-center gap-1">
                      {getPrivacyIcon(group.privacyLevel)}
                      <span className="capitalize">{group.privacyLevel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="capitalize">{group.meetingStyle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{group.timeZone}</span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-black/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                    <h4 className="text-white/90 text-sm font-medium mb-3">This Week's Activity</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/70">Support Messages</span>
                        <span className="text-white">{group.recentActivity.supportMessages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Milestones</span>
                        <span className="text-yellow-400">{group.recentActivity.milestonesShared}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Stories</span>
                        <span className="text-pink-400">{group.recentActivity.storiesShared}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Encouragements</span>
                        <span className="text-green-400">{group.recentActivity.encouragements}</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Topics */}
                  <div className="mb-4">
                    <h4 className="text-white/90 text-sm font-medium mb-2">Current Discussion Topics</h4>
                    <div className="flex flex-wrap gap-1">
                      {group.currentTopics.slice(0, 2).map((topic, idx) => (
                        <div key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                          {topic}
                        </div>
                      ))}
                      {group.currentTopics.length > 2 && (
                        <div className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                          +{group.currentTopics.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Session */}
                  {group.nextSession && (
                    <div className="bg-blue-500/20 rounded-lg p-3 mb-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Next session: {group.nextSession.toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className={`w-full transition-all duration-300 group/btn ${
                      isJoined
                        ? 'bg-green-600/20 hover:bg-green-600/30 text-green-200 border border-green-400/30'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                    }`}
                    onClick={() => isJoined ? console.log(`Enter group: ${group.id}`) : handleJoinGroup(group.id)}
                  >
                    <span>{isJoined ? 'Enter Group' : 'Join Group'}</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Join Group Modal */}
      <AnimatePresence>
        {showJoinModal && selectedGroup && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const group = peerGroups.find(g => g.id === selectedGroup);
                if (!group) return null;
                
                return (
                  <div className="p-8 text-white">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl">{group.icon}</div>
                      <div>
                        <h2 className="text-3xl font-light mb-2">{group.name}</h2>
                        <p className="text-white/70">Join this anonymous peer support group</p>
                      </div>
                    </div>

                    {/* Safety Features */}
                    <Card className="bg-green-500/20 backdrop-blur-sm border-green-300/30 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-green-100 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Safety & Privacy Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {group.safetyFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-green-100/90 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Join Criteria */}
                    <Card className="bg-white/5 backdrop-blur-sm border-white/20 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                          <UserCheck className="w-5 h-5" />
                          What We Ask From Members
                        </h3>
                        <div className="space-y-2">
                          {group.joinCriteria.map((criteria, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-white/80 text-sm">{criteria}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {/* Privacy Commitment */}
                    <Card className="bg-purple-500/20 backdrop-blur-sm border-purple-300/30 mb-6">
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-purple-100 mb-4 flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Our Privacy Commitment
                        </h3>
                        <div className="space-y-2 text-purple-100/90 text-sm">
                          <p>• Your identity remains completely anonymous</p>
                          <p>• No personal information is collected or stored</p>
                          <p>• All communications are encrypted</p>
                          <p>• You can leave at any time without explanation</p>
                          <p>• Community guidelines protect all members</p>
                        </div>
                      </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setShowJoinModal(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={confirmJoinGroup}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Join Anonymous Group
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}