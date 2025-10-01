'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Shield, 
  Eye, 
  EyeOff, 
  Star,
  Coffee,
  Moon,
  Sun,
  Leaf,
  Sparkles
} from 'lucide-react';
import { AnonymousPeerMatching } from './AnonymousPeerMatching';
import { WisdomSharing } from './WisdomSharing';
import { HealingCircles } from './HealingCircles';
import { SafeSpaceIndicator } from './SafeSpaceIndicator';

interface CommunityMember {
  id: string;
  anonymousName: string;
  healingJourney: string;
  preferredSupport: string[];
  availabilityWindow: string;
  lastActive: Date;
  trustScore: number;
  sharedWisdomCount: number;
}

interface SharedWisdom {
  id: string;
  authorName: string;
  category: 'breakthrough' | 'coping' | 'reflection' | 'gratitude';
  content: string;
  timestamp: Date;
  supportReactions: number;
  isAnonymous: boolean;
}

interface HealingCircle {
  id: string;
  name: string;
  theme: string;
  memberCount: number;
  isActive: boolean;
  nextMeeting: Date;
  supportLevel: 'gentle' | 'moderate' | 'deep';
}

export const CommunitySanctuary: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [sharedWisdom, setSharedWisdom] = useState<SharedWisdom[]>([]);
  const [healingCircles, setHealingCircles] = useState<HealingCircle[]>([]);
  const [userParticipation, setUserParticipation] = useState({
    anonymousMode: true,
    preferredSupport: ['emotional', 'practical'],
    availabilityWindow: 'evening'
  });

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    // Load community data with privacy protection
    const mockMembers: CommunityMember[] = [
      {
        id: '1',
        anonymousName: 'Gentle Phoenix',
        healingJourney: 'Recovery from anxiety, 8 months',
        preferredSupport: ['emotional', 'mindfulness'],
        availabilityWindow: 'evening',
        lastActive: new Date(),
        trustScore: 95,
        sharedWisdomCount: 12
      },
      {
        id: '2',
        anonymousName: 'Quiet Sage',
        healingJourney: 'Trauma healing, 2 years',
        preferredSupport: ['deep listening', 'practical'],
        availabilityWindow: 'morning',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        trustScore: 98,
        sharedWisdomCount: 25
      },
      {
        id: '3',
        anonymousName: 'Rising Oak',
        healingJourney: 'Depression recovery, 1 year',
        preferredSupport: ['emotional', 'encouragement'],
        availabilityWindow: 'afternoon',
        lastActive: new Date(Date.now() - 30 * 60 * 1000),
        trustScore: 92,
        sharedWisdomCount: 8
      }
    ];

    const mockWisdom: SharedWisdom[] = [
      {
        id: '1',
        authorName: 'Gentle Phoenix',
        category: 'breakthrough',
        content: 'Today I realized that healing isn\'t linear, and that\'s okay. Each setback taught me something new about my strength.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        supportReactions: 24,
        isAnonymous: true
      },
      {
        id: '2',
        authorName: 'Quiet Sage',
        category: 'coping',
        content: 'When overwhelm hits, I imagine roots growing from my feet into the earth. It grounds me every time.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        supportReactions: 31,
        isAnonymous: true
      },
      {
        id: '3',
        authorName: 'Rising Oak',
        category: 'gratitude',
        content: 'Grateful for this community. Knowing I\'m not alone in this journey changes everything.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        supportReactions: 18,
        isAnonymous: true
      }
    ];

    const mockCircles: HealingCircle[] = [
      {
        id: '1',
        name: 'Morning Mindfulness',
        theme: 'Daily grounding practices',
        memberCount: 12,
        isActive: true,
        nextMeeting: new Date(Date.now() + 24 * 60 * 60 * 1000),
        supportLevel: 'gentle'
      },
      {
        id: '2',
        name: 'Trauma Survivors Unite',
        theme: 'Shared healing from trauma',
        memberCount: 8,
        isActive: true,
        nextMeeting: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        supportLevel: 'deep'
      },
      {
        id: '3',
        name: 'Creative Expression Circle',
        theme: 'Art and healing',
        memberCount: 15,
        isActive: false,
        nextMeeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        supportLevel: 'moderate'
      }
    ];

    setCommunityMembers(mockMembers);
    setSharedWisdom(mockWisdom);
    setHealingCircles(mockCircles);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breakthrough': return <Sparkles className="text-yellow-500" size={16} />;
      case 'coping': return <Shield className="text-blue-500" size={16} />;
      case 'reflection': return <Moon className="text-purple-500" size={16} />;
      case 'gratitude': return <Heart className="text-pink-500" size={16} />;
      default: return <Star className="text-sage-500" size={16} />;
    }
  };

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'gentle': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-blue-600 bg-blue-100';
      case 'deep': return 'text-purple-600 bg-purple-100';
      default: return 'text-sage-600 bg-sage-100';
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: React.ComponentType<any> }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-300
        ${activeTab === id 
          ? 'bg-sage-100 text-sage-800 shadow-md' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-sage-700'
        }
      `}
    >
      <Icon size={20} />
      <span className="font-medium tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-sanctuary-background">
      {/* Community Header */}
      <div className="bg-gradient-to-r from-sage-600 to-sage-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-light tracking-wide">
              Community Sanctuary
            </h1>
            <p className="text-sage-100 text-lg tracking-wide max-w-2xl mx-auto">
              A safe space for anonymous healing, peer support, and shared wisdom. 
              Every interaction is trauma-informed and consent-based.
            </p>
            <div className="flex items-center justify-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Shield size={20} className="text-sage-200" />
                <span className="text-sm tracking-wide">Anonymous by Default</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart size={20} className="text-sage-200" />
                <span className="text-sm tracking-wide">Trauma-Informed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} className="text-sage-200" />
                <span className="text-sm tracking-wide">{communityMembers.length} Active Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-soft">
            <TabButton id="overview" label="Overview" icon={Eye} />
            <TabButton id="wisdom" label="Shared Wisdom" icon={Star} />
            <TabButton id="circles" label="Healing Circles" icon={Users} />
            <TabButton id="matching" label="Peer Matching" icon={Heart} />
          </div>
        </div>

        {/* Safe Space Indicator */}
        <SafeSpaceIndicator />

        {/* Content */}
        <div className="space-y-6 mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Community Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 border-sage-200 text-center">
                  <Users className="text-sage-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-light text-slate-800 mb-1">
                    {communityMembers.length}
                  </div>
                  <p className="text-sm text-slate-600 tracking-wide">Active Members</p>
                </Card>

                <Card className="p-4 border-blue-200 text-center">
                  <Star className="text-blue-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-light text-slate-800 mb-1">
                    {sharedWisdom.length}
                  </div>
                  <p className="text-sm text-slate-600 tracking-wide">Wisdom Shared</p>
                </Card>

                <Card className="p-4 border-purple-200 text-center">
                  <MessageCircle className="text-purple-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-light text-slate-800 mb-1">
                    {healingCircles.filter(c => c.isActive).length}
                  </div>
                  <p className="text-sm text-slate-600 tracking-wide">Active Circles</p>
                </Card>

                <Card className="p-4 border-pink-200 text-center">
                  <Heart className="text-pink-600 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-light text-slate-800 mb-1">94%</div>
                  <p className="text-sm text-slate-600 tracking-wide">Trust Score</p>
                </Card>
              </div>

              {/* Recent Wisdom */}
              <Card className="p-6 border-sage-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-800 tracking-wide">
                    Recent Shared Wisdom
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setActiveTab('wisdom')}
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {sharedWisdom.slice(0, 3).map(wisdom => (
                    <div key={wisdom.id} className="p-4 bg-sanctuary-background rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(wisdom.category)}
                          <span className="font-medium text-slate-700">
                            {wisdom.authorName}
                          </span>
                          <span className="text-xs text-slate-500 capitalize">
                            {wisdom.category}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {wisdom.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed tracking-wide mb-2">
                        {wisdom.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="text-pink-600 hover:text-pink-700">
                            <Heart size={14} className="mr-1" />
                            {wisdom.supportReactions}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Shield size={12} />
                          <span>Anonymous</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Healing Circles */}
              <Card className="p-6 border-sage-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-800 tracking-wide">
                    Active Healing Circles
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setActiveTab('circles')}
                  >
                    Browse All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healingCircles.filter(circle => circle.isActive).map(circle => (
                    <div key={circle.id} className="p-4 bg-sanctuary-background rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-800">{circle.name}</h4>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium tracking-wide
                          ${getSupportLevelColor(circle.supportLevel)}
                        `}>
                          {circle.supportLevel}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 tracking-wide">
                        {circle.theme}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Users size={14} />
                          <span>{circle.memberCount} members</span>
                        </div>
                        <span className="text-slate-500">
                          Next: {circle.nextMeeting.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'wisdom' && (
            <WisdomSharing 
              sharedWisdom={sharedWisdom} 
              onAddWisdom={(newWisdom) => setSharedWisdom([newWisdom, ...sharedWisdom])}
            />
          )}

          {activeTab === 'circles' && (
            <HealingCircles 
              circles={healingCircles}
              userParticipation={userParticipation}
            />
          )}

          {activeTab === 'matching' && (
            <AnonymousPeerMatching 
              members={communityMembers}
              userPreferences={userParticipation}
            />
          )}
        </div>

        {/* Privacy Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 tracking-wide mb-2">
            All community interactions are anonymous and encrypted. 
            Your privacy and safety are our highest priorities.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
            <span>Community Guidelines</span>
            <span>•</span>
            <span>Crisis Resources</span>
            <span>•</span>
            <span>Report Concern</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySanctuary;