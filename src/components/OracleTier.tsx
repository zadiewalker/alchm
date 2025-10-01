'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown,
  Brain,
  Heart,
  Sparkles,
  Users,
  Shield,
  FileText,
  TrendingUp,
  Compass,
  Star,
  BookOpen,
  MessageCircle,
  PenTool,
  Lightbulb,
  Target,
  Award,
  Globe,
  Lock,
  ChevronRight,
  Activity,
  Palette,
  Layers,
  Infinity
} from 'lucide-react';

interface OracleTierProps {
  userId: string;
  onFeatureAccess: (feature: string) => void;
}

interface ArchetypeAccess {
  sage: boolean;
  coach: boolean;
  poet: boolean;
}

interface TransformationProgress {
  emotionalIntelligence: number;
  spiritualGrowth: number;
  meaningMaking: number;
  communityConnection: number;
  personalTransformation: number;
}

interface CommunityConnection {
  id: string;
  type: 'mentor' | 'peer' | 'circle';
  name: string;
  description: string;
  privacy: 'anonymous' | 'semi-anonymous' | 'identified';
  status: 'available' | 'connected' | 'pending';
}

export default function OracleTier({ userId, onFeatureAccess }: OracleTierProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [archetypeAccess] = useState<ArchetypeAccess>({
    sage: true,
    coach: true,
    poet: true
  });
  
  const [transformationProgress] = useState<TransformationProgress>({
    emotionalIntelligence: 85,
    spiritualGrowth: 78,
    meaningMaking: 92,
    communityConnection: 67,
    personalTransformation: 81
  });

  const [communityConnections] = useState<CommunityConnection[]>([
    {
      id: '1',
      type: 'mentor',
      name: 'Wisdom Keeper Circle',
      description: 'Connect with experienced guides for deep transformation work',
      privacy: 'anonymous',
      status: 'available'
    },
    {
      id: '2',
      type: 'peer',
      name: 'Phoenix Rising Group',
      description: 'Peer support for those transforming trauma into wisdom',
      privacy: 'semi-anonymous',
      status: 'connected'
    },
    {
      id: '3',
      type: 'circle',
      name: 'Sacred Meaning Makers',
      description: 'Explore purpose and meaning across spiritual traditions',
      privacy: 'identified',
      status: 'pending'
    }
  ]);

  const oracleFeatures = [
    {
      category: 'Sophisticated Mentorship',
      icon: Crown,
      items: [
        {
          name: 'AI Personality Adaptation',
          description: 'Khepera learns and adapts to your unique communication style',
          icon: Brain,
          action: 'personality-adaptation'
        },
        {
          name: 'Complex Emotional Pattern Analysis',
          description: 'Deep insights into your emotional patterns with actionable guidance',
          icon: TrendingUp,
          action: 'pattern-analysis'
        },
        {
          name: 'Crisis Prevention System',
          description: 'Early warning pattern recognition with proactive interventions',
          icon: Shield,
          action: 'crisis-prevention'
        },
        {
          name: 'Support Network Integration',
          description: 'Privacy-controlled progress sharing with family/support network',
          icon: Users,
          action: 'network-integration'
        }
      ]
    },
    {
      category: 'Professional-Grade Development',
      icon: Award,
      items: [
        {
          name: 'EI Assessment & Growth',
          description: 'Comprehensive emotional intelligence testing with personalized recommendations',
          icon: Heart,
          action: 'ei-assessment'
        },
        {
          name: 'Therapeutic Goal Frameworks',
          description: 'Advanced goal-setting aligned with therapeutic best practices',
          icon: Target,
          action: 'goal-frameworks'
        },
        {
          name: 'Progress Documentation',
          description: 'Comprehensive tracking suitable for therapy sessions',
          icon: FileText,
          action: 'progress-docs'
        },
        {
          name: 'Community Connection Hub',
          description: 'Sophisticated peer support and mentorship connections',
          icon: MessageCircle,
          action: 'community-hub'
        }
      ]
    },
    {
      category: 'Premium Support Integration',
      icon: Star,
      items: [
        {
          name: 'Priority Crisis Support',
          description: 'Priority access to crisis support escalation and immediate help',
          icon: Activity,
          action: 'priority-support'
        },
        {
          name: 'Mental Health Service Integration',
          description: 'Advanced integration with external mental health providers',
          icon: Globe,
          action: 'service-integration'
        },
        {
          name: 'Professional Consultation',
          description: 'Facilitated requests for professional therapeutic consultation',
          icon: Lightbulb,
          action: 'consultation-requests'
        },
        {
          name: 'Enhanced Data Portability',
          description: 'Export data for therapy, education, and personal records',
          icon: Lock,
          action: 'data-portability'
        }
      ]
    },
    {
      category: 'Spiritual & Meaning-Making',
      icon: Sparkles,
      items: [
        {
          name: 'Poet Archetype Access',
          description: 'Transform pain into beauty through metaphorical guidance',
          icon: PenTool,
          action: 'poet-archetype'
        },
        {
          name: 'Advanced Meaning-Making',
          description: 'Sophisticated frameworks for existential exploration',
          icon: Compass,
          action: 'meaning-making'
        },
        {
          name: 'Spiritual Tradition Integration',
          description: 'Honor diverse spiritual and philosophical traditions',
          icon: BookOpen,
          action: 'spiritual-integration'
        },
        {
          name: 'Sacred Narrative Development',
          description: 'Develop and integrate your life story with meaning',
          icon: Palette,
          action: 'narrative-development'
        },
        {
          name: 'Values & Purpose Alignment',
          description: 'Deep tools for clarifying values and aligning with purpose',
          icon: Infinity,
          action: 'values-alignment'
        }
      ]
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
              Oracle Tier - $9.99/month
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">Comprehensive Transformation Ecosystem</h1>
          <p className="text-xl text-purple-100 mb-6">
            Professional-grade emotional intelligence development with spiritual depth and community support
          </p>
          
          {/* Archetype Access */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Lightbulb className="h-5 w-5 text-blue-300" />
              <span className="text-sm font-medium">Sage Wisdom</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Target className="h-5 w-5 text-green-300" />
              <span className="text-sm font-medium">Coach Guidance</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <PenTool className="h-5 w-5 text-pink-300" />
              <span className="text-sm font-medium">Poet Transformation</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{transformationProgress.emotionalIntelligence}%</div>
              <div className="text-sm text-purple-200">Emotional Intelligence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{transformationProgress.spiritualGrowth}%</div>
              <div className="text-sm text-purple-200">Spiritual Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{transformationProgress.meaningMaking}%</div>
              <div className="text-sm text-purple-200">Meaning Making</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">{transformationProgress.communityConnection}%</div>
              <div className="text-sm text-purple-200">Community Connection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {oracleFeatures.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.category} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold">{category.category}</h3>
              </div>
              <div className="space-y-3">
                {category.items.slice(0, 2).map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                         onClick={() => onFeatureAccess(item.action)}>
                      <ItemIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">{item.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setActiveSection(category.category.toLowerCase().replace(/[^a-z]/g, '-'))}
              >
                View All {category.category} Features
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderCommunityHub = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Community Connection Hub</h2>
      </div>

      <div className="grid gap-6">
        {communityConnections.map((connection) => (
          <Card key={connection.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  connection.type === 'mentor' ? 'bg-purple-100 text-purple-600' :
                  connection.type === 'peer' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {connection.type === 'mentor' && <Crown className="h-5 w-5" />}
                  {connection.type === 'peer' && <Users className="h-5 w-5" />}
                  {connection.type === 'circle' && <Layers className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold">{connection.name}</h3>
                  <p className="text-sm text-gray-600">{connection.description}</p>
                </div>
              </div>
              <Badge variant={
                connection.status === 'connected' ? 'default' :
                connection.status === 'pending' ? 'secondary' :
                'outline'
              }>
                {connection.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                <span>{connection.privacy} privacy</span>
              </div>
              <Button 
                variant={connection.status === 'connected' ? 'secondary' : 'default'}
                size="sm"
                onClick={() => onFeatureAccess(`community-${connection.id}`)}
              >
                {connection.status === 'connected' ? 'Enter Circle' : 
                 connection.status === 'pending' ? 'View Request' : 'Join'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="font-semibold mb-2">Privacy-First Community</h3>
        <p className="text-sm text-gray-600 mb-4">
          All community connections respect your privacy preferences and therapeutic boundaries. 
          Share only what feels safe and meaningful to your healing journey.
        </p>
        <Button variant="outline" onClick={() => onFeatureAccess('community-settings')}>
          Manage Privacy Settings
        </Button>
      </Card>
    </div>
  );

  const renderFeatureDetails = (categorySlug: string) => {
    const category = oracleFeatures.find(cat => 
      cat.category.toLowerCase().replace(/[^a-z]/g, '-') === categorySlug
    );
    
    if (!category) return <div>Category not found</div>;

    const IconComponent = category.icon;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <IconComponent className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">{category.category}</h2>
        </div>

        <div className="grid gap-4">
          {category.items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Card key={item.name} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onFeatureAccess(item.action)}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <ItemIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Button variant="outline" size="sm">
                      Access Feature
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeSection === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeSection === 'community-hub' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('community-hub')}
        >
          Community Hub
        </Button>
        {oracleFeatures.map((category) => {
          const slug = category.category.toLowerCase().replace(/[^a-z]/g, '-');
          return (
            <Button
              key={slug}
              variant={activeSection === slug ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection(slug)}
            >
              {category.category}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'community-hub' && renderCommunityHub()}
      {activeSection !== 'overview' && activeSection !== 'community-hub' && renderFeatureDetails(activeSection)}
    </div>
  );
}