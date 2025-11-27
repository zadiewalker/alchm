'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Shield,
  Heart,
  Crown,
  Star,
  MessageCircle,
  Video,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  UserCheck,
  UserPlus,
  UserMinus,
  Settings,
  Bell,
  BellOff,
  Flag,
  CheckCircle,
  AlertTriangle,
  Info,
  Search,
  Filter,
  Plus,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Compass,
  Bridge,
  Layers,
  TreePine,
  Mountain,
  Waves,
  Sun,
  Moon,
  ArrowRight,
  Share,
  BookOpen,
  Target,
  Lightbulb,
  HandHeart,
  Peace,
  Feather,
  Flower2
} from 'lucide-react';

interface CommunityMember {
  id: string;
  displayName: string;
  avatar?: string;
  isAnonymous: boolean;
  role: 'peer' | 'mentor' | 'guide' | 'wisdom-keeper';
  joinedDate: string;
  specialties: string[];
  supportOffering: string[];
  preferredCommunication: ('text' | 'voice' | 'video')[];
  timeZone: string;
  status: 'online' | 'away' | 'offline';
  privacyLevel: 'open' | 'selective' | 'private';
  verificationStatus: 'verified' | 'pending' | 'unverified';
  connectionType?: 'connected' | 'pending-sent' | 'pending-received' | 'not-connected';
}

interface SupportCircle {
  id: string;
  name: string;
  description: string;
  type: 'open' | 'moderated' | 'private' | 'therapeutic';
  focus: string[];
  memberCount: number;
  maxMembers?: number;
  facilitator?: CommunityMember;
  meetingSchedule?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    day?: string;
    time?: string;
    timezone: string;
  };
  privacySettings: {
    requireApproval: boolean;
    shareProgressMetrics: boolean;
    allowAnonymous: boolean;
    contentModeration: 'strict' | 'moderate' | 'relaxed';
  };
  therapeuticAlignment: string[];
  culturalFocus?: string[];
  languages: string[];
  joinStatus: 'member' | 'pending' | 'invited' | 'not-member';
}

interface MentorshipMatch {
  id: string;
  mentor: CommunityMember;
  matchScore: number;
  compatibility: {
    experienceAlignment: number;
    communicationStyle: number;
    availability: number;
    therapeuticApproach: number;
  };
  sharedExperiences: string[];
  recommendationReasons: string[];
  privacyProtections: string[];
  status: 'suggested' | 'contacted' | 'matched' | 'completed';
}

interface WisdomShare {
  id: string;
  author: CommunityMember;
  title: string;
  category: 'insight' | 'breakthrough' | 'resource' | 'support-offer' | 'question';
  content: string;
  tags: string[];
  createdDate: string;
  responses: number;
  helpfulVotes: number;
  privacyLevel: 'anonymous' | 'semi-anonymous' | 'identified';
  therapeuticValue: 'high' | 'medium' | 'low';
  triggerWarnings?: string[];
}

export default function CommunityConnections() {
  const [activeSection, setActiveSection] = useState<'overview' | 'circles' | 'mentorship' | 'wisdom' | 'privacy'>('overview');
  const [supportCircles, setSupportCircles] = useState<SupportCircle[]>([]);
  const [mentorshipMatches, setMentorshipMatches] = useState<MentorshipMatch[]>([]);
  const [wisdomShares, setWisdomShares] = useState<WisdomShare[]>([]);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'selective' as 'open' | 'selective' | 'private',
    progressSharing: false,
    anonymousMode: true,
    mentorshipAvailability: true,
    communicationPreferences: ['text'] as ('text' | 'voice' | 'video')[],
    culturalBackground: [] as string[],
    therapeuticGoals: [] as string[]
  });

  useEffect(() => {
    // Initialize sample data
    setSupportCircles([
      {
        id: '1',
        name: 'Phoenix Rising Circle',
        description: 'For those transforming trauma into wisdom and strength',
        type: 'moderated',
        focus: ['Trauma recovery', 'Post-traumatic growth', 'Resilience building'],
        memberCount: 12,
        maxMembers: 15,
        facilitator: {
          id: 'f1',
          displayName: 'Dr. Maya',
          isAnonymous: false,
          role: 'guide',
          joinedDate: '2023-01-15',
          specialties: ['Trauma therapy', 'Group facilitation'],
          supportOffering: ['Professional guidance', 'Crisis support'],
          preferredCommunication: ['text', 'video'],
          timeZone: 'PST',
          status: 'online',
          privacyLevel: 'selective',
          verificationStatus: 'verified'
        },
        meetingSchedule: {
          frequency: 'weekly',
          day: 'Tuesday',
          time: '7:00 PM',
          timezone: 'PST'
        },
        privacySettings: {
          requireApproval: true,
          shareProgressMetrics: false,
          allowAnonymous: true,
          contentModeration: 'strict'
        },
        therapeuticAlignment: ['Trauma-informed care', 'Group therapy principles'],
        languages: ['English', 'Spanish'],
        joinStatus: 'member'
      },
      {
        id: '2',
        name: 'Mindful Warriors',
        description: 'Building emotional intelligence through mindfulness and compassion',
        type: 'open',
        focus: ['Mindfulness', 'Emotional regulation', 'Self-compassion'],
        memberCount: 24,
        meetingSchedule: {
          frequency: 'biweekly',
          day: 'Saturday',
          time: '10:00 AM',
          timezone: 'EST'
        },
        privacySettings: {
          requireApproval: false,
          shareProgressMetrics: true,
          allowAnonymous: true,
          contentModeration: 'moderate'
        },
        therapeuticAlignment: ['Mindfulness-based therapy', 'DBT skills'],
        culturalFocus: ['Secular Buddhist practices', 'Western mindfulness'],
        languages: ['English', 'French', 'Mandarin'],
        joinStatus: 'pending'
      },
      {
        id: '3',
        name: 'Sacred Stories Sanctuary',
        description: 'Sharing and witnessing each other\'s spiritual journeys with reverence',
        type: 'private',
        focus: ['Spiritual exploration', 'Meaning-making', 'Sacred narratives'],
        memberCount: 8,
        maxMembers: 10,
        privacySettings: {
          requireApproval: true,
          shareProgressMetrics: false,
          allowAnonymous: true,
          contentModeration: 'relaxed'
        },
        therapeuticAlignment: ['Spiritual integration', 'Narrative therapy'],
        culturalFocus: ['Interfaith dialogue', 'Indigenous wisdom'],
        languages: ['English'],
        joinStatus: 'invited'
      }
    ]);

    setMentorshipMatches([
      {
        id: '1',
        mentor: {
          id: 'm1',
          displayName: 'Journey Walker',
          isAnonymous: true,
          role: 'wisdom-keeper',
          joinedDate: '2022-06-10',
          specialties: ['Spiritual mentoring', 'Crisis navigation', 'Life transitions'],
          supportOffering: ['Wisdom sharing', 'Spiritual guidance', 'Crisis support'],
          preferredCommunication: ['text', 'voice'],
          timeZone: 'CST',
          status: 'online',
          privacyLevel: 'selective',
          verificationStatus: 'verified'
        },
        matchScore: 92,
        compatibility: {
          experienceAlignment: 90,
          communicationStyle: 88,
          availability: 95,
          therapeuticApproach: 94
        },
        sharedExperiences: [
          'Religious trauma recovery',
          'Career transition challenges',
          'Building healthy boundaries',
          'Developing spiritual practice'
        ],
        recommendationReasons: [
          'Similar spiritual questioning journey',
          'Strong background in boundary-setting',
          'Experience with religious trauma healing',
          'Excellent communication and empathy skills'
        ],
        privacyProtections: [
          'All conversations are confidential',
          'Mentor committed to ethical guidelines',
          'Professional crisis intervention training',
          'Regular supervision and support'
        ],
        status: 'suggested'
      },
      {
        id: '2',
        mentor: {
          id: 'm2',
          displayName: 'Resilient Heart',
          isAnonymous: true,
          role: 'peer',
          joinedDate: '2023-02-20',
          specialties: ['Emotional regulation', 'Anxiety management', 'Self-advocacy'],
          supportOffering: ['Peer support', 'Skill sharing', 'Encouragement'],
          preferredCommunication: ['text'],
          timeZone: 'EST',
          status: 'away',
          privacyLevel: 'selective',
          verificationStatus: 'verified'
        },
        matchScore: 87,
        compatibility: {
          experienceAlignment: 85,
          communicationStyle: 92,
          availability: 80,
          therapeuticApproach: 89
        },
        sharedExperiences: [
          'Anxiety and panic management',
          'Building emotional intelligence',
          'Professional boundary challenges',
          'Self-compassion development'
        ],
        recommendationReasons: [
          'Similar anxiety management journey',
          'Strong emotional intelligence skills',
          'Excellent peer support experience',
          'Commitment to mutual growth'
        ],
        privacyProtections: [
          'Peer agreement signed',
          'Mutual consent for all sharing',
          'Clear boundaries established',
          'Support circle oversight'
        ],
        status: 'suggested'
      }
    ]);

    setWisdomShares([
      {
        id: '1',
        author: {
          id: 'a1',
          displayName: 'Phoenix Rising',
          isAnonymous: true,
          role: 'peer',
          joinedDate: '2023-05-15',
          specialties: [],
          supportOffering: [],
          preferredCommunication: ['text'],
          timeZone: 'PST',
          status: 'offline',
          privacyLevel: 'private',
          verificationStatus: 'verified'
        },
        title: 'How I Learned to Dance with My Anxiety Instead of Fighting It',
        category: 'breakthrough',
        content: 'After years of seeing my anxiety as an enemy to defeat, I discovered something beautiful: my anxiety was actually my nervous system trying to protect me. Learning to listen to it with compassion instead of judgment changed everything...',
        tags: ['anxiety', 'self-compassion', 'breakthrough', 'nervous-system'],
        createdDate: '2024-03-10',
        responses: 8,
        helpfulVotes: 15,
        privacyLevel: 'anonymous',
        therapeuticValue: 'high'
      },
      {
        id: '2',
        author: {
          id: 'a2',
          displayName: 'Wisdom Seeker',
          isAnonymous: true,
          role: 'mentor',
          joinedDate: '2022-11-08',
          specialties: [],
          supportOffering: [],
          preferredCommunication: ['text'],
          timeZone: 'EST',
          status: 'online',
          privacyLevel: 'selective',
          verificationStatus: 'verified'
        },
        title: 'A Sacred Ritual for Releasing What No Longer Serves',
        category: 'resource',
        content: 'This gentle ceremony has helped me let go of old patterns and beliefs that were keeping me stuck. It honors both the gratitude for what these patterns once provided and the readiness to embrace new growth...',
        tags: ['ritual', 'letting-go', 'spiritual-practice', 'transformation'],
        createdDate: '2024-03-08',
        responses: 12,
        helpfulVotes: 23,
        privacyLevel: 'semi-anonymous',
        therapeuticValue: 'high',
        triggerWarnings: ['Discussion of past trauma']
      }
    ]);
  }, []);

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-purple-100 rounded-full">
            <Users className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Community Connections</h1>
        <p className="text-xl text-gray-600">
          Safe, supportive spaces for healing, growth, and wisdom sharing
        </p>
      </div>

      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-2xl font-medium text-blue-600">3</div>
          <div className="text-sm text-gray-600">Support Circles</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <Crown className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-2xl font-medium text-purple-600">2</div>
          <div className="text-sm text-gray-600">Mentor Matches</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-2xl font-medium text-red-600">15</div>
          <div className="text-sm text-gray-600">Wisdom Shares</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-2xl font-medium text-green-600">100%</div>
          <div className="text-sm text-gray-600">Privacy Protected</div>
        </Card>
      </div>

      {/* Privacy First Banner */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <Shield className="h-8 w-8 text-blue-600 mt-1" />
          <div>
            <h2 className="text-xl font-medium mb-2">Privacy-First Community</h2>
            <p className="text-gray-700 mb-4">
              Every connection is designed with your safety and privacy as the top priority. 
              You control exactly what you share, with whom, and how you're identified.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Anonymous Options</Badge>
              <Badge variant="outline">Encrypted Communication</Badge>
              <Badge variant="outline">Professional Moderation</Badge>
              <Badge variant="outline">Trauma-Informed Design</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="font-medium mb-2">Join Support Circle</h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect with others on similar healing journeys in safe, moderated spaces
          </p>
          <Button onClick={() => setActiveSection('circles')}>
            Explore Circles
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h3 className="font-medium mb-2">Find Mentor</h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect with experienced guides who've walked similar paths
          </p>
          <Button onClick={() => setActiveSection('mentorship')}>
            View Matches
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Lightbulb className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="font-medium mb-2">Share Wisdom</h3>
          <p className="text-sm text-gray-600 mb-4">
            Offer insights and breakthroughs to help others on their journey
          </p>
          <Button onClick={() => setActiveSection('wisdom')}>
            Share & Explore
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderSupportCircles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Support Circles</h1>
          <p className="text-gray-600">Healing communities organized around shared experiences and goals</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Circle
        </Button>
      </div>

      <div className="grid gap-6">
        {supportCircles.map((circle) => (
          <Card key={circle.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-medium">{circle.name}</h2>
                  <Badge variant={
                    circle.type === 'open' ? 'default' :
                    circle.type === 'moderated' ? 'secondary' :
                    circle.type === 'private' ? 'outline' : 'destructive'
                  }>
                    {circle.type}
                  </Badge>
                  <Badge variant={
                    circle.joinStatus === 'member' ? 'default' :
                    circle.joinStatus === 'pending' ? 'secondary' :
                    circle.joinStatus === 'invited' ? 'outline' : 'secondary'
                  }>
                    {circle.joinStatus}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-3">{circle.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {circle.memberCount}{circle.maxMembers ? `/${circle.maxMembers}` : ''} members
                  </span>
                  {circle.meetingSchedule && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {circle.meetingSchedule.frequency} {circle.meetingSchedule.day}s
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {circle.languages.join(', ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {circle.focus.map((focus) => (
                    <Badge key={focus} variant="outline" className="text-xs">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {circle.joinStatus === 'member' ? (
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enter Circle
                  </Button>
                ) : circle.joinStatus === 'pending' ? (
                  <Button variant="secondary" disabled>
                    <Clock className="h-4 w-4 mr-2" />
                    Pending Approval
                  </Button>
                ) : circle.joinStatus === 'invited' ? (
                  <div className="flex gap-2">
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button variant="outline">
                      Decline
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Request to Join
                  </Button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <h3 className="font-medium mb-2">Privacy & Safety</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {circle.privacySettings.requireApproval ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    )}
                    <span>{circle.privacySettings.requireApproval ? 'Approval required' : 'Open join'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {circle.privacySettings.allowAnonymous ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    )}
                    <span>{circle.privacySettings.allowAnonymous ? 'Anonymous participation' : 'Identity required'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span>{circle.privacySettings.contentModeration} moderation</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Therapeutic Alignment</h3>
                <div className="flex flex-wrap gap-1">
                  {circle.therapeuticAlignment.map((alignment) => (
                    <Badge key={alignment} variant="outline" className="text-xs">
                      {alignment}
                    </Badge>
                  ))}
                </div>
                {circle.facilitator && (
                  <div className="mt-2 text-sm text-gray-600">
                    Facilitated by: {circle.facilitator.displayName}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Mentorship Connections</h1>
          <p className="text-gray-600">Carefully matched guidance relationships based on shared experiences</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Find Mentors
        </Button>
      </div>

      <div className="grid gap-6">
        {mentorshipMatches.map((match) => (
          <Card key={match.id} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-medium">{match.mentor.displayName}</h2>
                  <Badge variant="outline" className="capitalize">
                    {match.mentor.role}
                  </Badge>
                  <Badge variant="default">
                    {match.matchScore}% match
                  </Badge>
                  {match.mentor.isAnonymous && (
                    <Badge variant="secondary">
                      <Eye className="h-3 w-3 mr-1" />
                      Anonymous
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>Joined: {match.mentor.joinedDate}</span>
                  <span>{match.mentor.timeZone}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      match.mentor.status === 'online' ? 'bg-green-500' :
                      match.mentor.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <span className="capitalize">{match.mentor.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline">
                  <Info className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>

            {/* Compatibility Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-medium text-purple-600">
                  {match.compatibility.experienceAlignment}%
                </div>
                <div className="text-xs text-gray-600">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-blue-600">
                  {match.compatibility.communicationStyle}%
                </div>
                <div className="text-xs text-gray-600">Communication</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-green-600">
                  {match.compatibility.availability}%
                </div>
                <div className="text-xs text-gray-600">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-yellow-600">
                  {match.compatibility.therapeuticApproach}%
                </div>
                <div className="text-xs text-gray-600">Approach</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Shared Experiences</h3>
                <ul className="space-y-2">
                  {match.sharedExperiences.map((experience, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{experience}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3">Why This Match</h3>
                <ul className="space-y-2">
                  {match.recommendationReasons.slice(0, 3).map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Privacy & Safety Protections
              </h4>
              <div className="text-sm text-gray-700">
                {match.privacyProtections.join(' • ')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-lg font-medium mb-4">Become a Mentor</h2>
        <p className="text-gray-700 mb-4">
          Ready to share your wisdom and support others on their healing journey? 
          Our mentor program provides training, support, and community.
        </p>
        <Button>
          <HandHeart className="h-4 w-4 mr-2" />
          Apply to Mentor
        </Button>
      </Card>
    </div>
  );

  const renderWisdomSharing = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Wisdom Sharing</h1>
          <p className="text-gray-600">Anonymous insights, breakthroughs, and resources from the community</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Share Wisdom
        </Button>
      </div>

      <div className="grid gap-6">
        {wisdomShares.map((share) => (
          <Card key={share.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-medium">{share.title}</h2>
                  <Badge variant="outline" className="capitalize">
                    {share.category}
                  </Badge>
                  <Badge variant={
                    share.therapeuticValue === 'high' ? 'default' :
                    share.therapeuticValue === 'medium' ? 'secondary' : 'outline'
                  }>
                    {share.therapeuticValue} value
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    {share.author.displayName}
                  </span>
                  <span>{share.createdDate}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {share.privacyLevel.replace('-', ' ')}
                  </Badge>
                </div>

                {share.triggerWarnings && share.triggerWarnings.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Content Warning: {share.triggerWarnings.join(', ')}
                    </span>
                  </div>
                )}
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
              <p className="text-gray-700 leading-relaxed">
                {share.content}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {share.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {share.helpfulVotes} helpful
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {share.responses} responses
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-2">Privacy & Safety Settings</h1>
        <p className="text-gray-600">
          Control how you connect with the community while maintaining your safety and comfort
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Profile Visibility</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Profile Visibility</div>
                <div className="text-sm text-gray-600">Who can see your profile information</div>
              </div>
              <select 
                value={privacySettings.profileVisibility}
                onChange={(e) => setPrivacySettings(prev => ({
                  ...prev,
                  profileVisibility: e.target.value as any
                }))}
                className="px-3 py-1 border rounded"
              >
                <option value="open">Open (Anyone)</option>
                <option value="selective">Selective (Connections only)</option>
                <option value="private">Private (No one)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Anonymous Mode</div>
                <div className="text-sm text-gray-600">Participate anonymously in all interactions</div>
              </div>
              <button
                onClick={() => setPrivacySettings(prev => ({
                  ...prev,
                  anonymousMode: !prev.anonymousMode
                }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.anonymousMode ? 'bg-blue-600' : 'bg-gray-300'
                } relative`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  privacySettings.anonymousMode ? 'translate-x-6' : 'translate-x-0.5'
                } absolute top-0.5`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Progress Sharing</div>
                <div className="text-sm text-gray-600">Allow sharing of progress metrics with circles</div>
              </div>
              <button
                onClick={() => setPrivacySettings(prev => ({
                  ...prev,
                  progressSharing: !prev.progressSharing
                }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.progressSharing ? 'bg-blue-600' : 'bg-gray-300'
                } relative`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  privacySettings.progressSharing ? 'translate-x-6' : 'translate-x-0.5'
                } absolute top-0.5`} />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Communication Preferences</h2>
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">Preferred Communication Methods</div>
              <div className="flex gap-2">
                {(['text', 'voice', 'video'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      const newPrefs = privacySettings.communicationPreferences.includes(method)
                        ? privacySettings.communicationPreferences.filter(p => p !== method)
                        : [...privacySettings.communicationPreferences, method];
                      setPrivacySettings(prev => ({
                        ...prev,
                        communicationPreferences: newPrefs
                      }));
                    }}
                    className={`px-3 py-2 rounded border capitalize ${
                      privacySettings.communicationPreferences.includes(method)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Available for Mentorship</div>
                <div className="text-sm text-gray-600">Allow others to request mentorship connections</div>
              </div>
              <button
                onClick={() => setPrivacySettings(prev => ({
                  ...prev,
                  mentorshipAvailability: !prev.mentorshipAvailability
                }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.mentorshipAvailability ? 'bg-blue-600' : 'bg-gray-300'
                } relative`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  privacySettings.mentorshipAvailability ? 'translate-x-6' : 'translate-x-0.5'
                } absolute top-0.5`} />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-medium text-green-900 mb-2">Your Safety is Our Priority</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• All community interactions are monitored by trained professionals</li>
                <li>• Anonymous reporting system for any safety concerns</li>
                <li>• 24/7 crisis support escalation available</li>
                <li>• Zero tolerance for harassment or inappropriate behavior</li>
                <li>• Your real identity is never shared without explicit consent</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeSection === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('overview')}
        >
          <Users className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeSection === 'circles' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('circles')}
        >
          <Heart className="h-4 w-4 mr-2" />
          Support Circles
        </Button>
        <Button
          variant={activeSection === 'mentorship' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('mentorship')}
        >
          <Crown className="h-4 w-4 mr-2" />
          Mentorship
        </Button>
        <Button
          variant={activeSection === 'wisdom' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('wisdom')}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Wisdom Sharing
        </Button>
        <Button
          variant={activeSection === 'privacy' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('privacy')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Privacy & Safety
        </Button>
      </div>

      {/* Content */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'circles' && renderSupportCircles()}
      {activeSection === 'mentorship' && renderMentorship()}
      {activeSection === 'wisdom' && renderWisdomSharing()}
      {activeSection === 'privacy' && renderPrivacySettings()}
    </div>
  );
}