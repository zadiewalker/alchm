'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Heart, 
  Lightbulb, 
  Laptop, 
  MessageCircle, 
  Crown, 
  DollarSign,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Progress,
  Activity
} from 'lucide-react';

// Import our educational transformation engines
import { 
  LearningAssessmentEngine, 
  PathwayRecommendationEngine,
  type LearnerProfile,
  type EducationalPathway 
} from '@/lib/educational-transformation/educational-pathways-engine';

import { 
  ALL_CORE_PATHWAYS,
  getPathwaysByCategory,
  getPathwayById
} from '@/lib/educational-transformation/core-pathways-library';

import {
  LearningAnalyticsEngine,
  type LearningAnalytics
} from '@/lib/educational-transformation/learning-analytics-engine';

import {
  MentorshipMatchingEngine,
  PeerLearningEngine,
  type MentorProfile
} from '@/lib/educational-transformation/mentorship-peer-learning-engine';

interface EducationalTransformationHubProps {
  userId: string;
  userProfile?: Partial<LearnerProfile>;
  onPathwayStart?: (pathwayId: string) => void;
  onAssessmentComplete?: (results: any) => void;
}

interface PathwayCardProps {
  pathway: EducationalPathway;
  isRecommended?: boolean;
  progress?: number;
  onStart: (pathwayId: string) => void;
}

const PathwayCard: React.FC<PathwayCardProps> = ({ 
  pathway, 
  isRecommended = false, 
  progress = 0, 
  onStart 
}) => {
  const getPathwayIcon = (category: string) => {
    switch (category) {
      case 'cognitive': return <Brain className="h-5 w-5" />;
      case 'emotional': return <Heart className="h-5 w-5" />;
      case 'creative': return <Lightbulb className="h-5 w-5" />;
      case 'social': return <MessageCircle className="h-5 w-5" />;
      case 'leadership': return <Crown className="h-5 w-5" />;
      case 'practical': return <DollarSign className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isRecommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
    }`}>
      {isRecommended && (
        <div className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-t-lg">
          <Star className="inline h-4 w-4 mr-1" />
          Recommended for You
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-blue-600">
              {getPathwayIcon(pathway.category)}
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-gray-900">
                {pathway.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getDifficultyColor(pathway.difficulty)}>
                  {pathway.difficulty}
                </Badge>
                <span className="text-sm text-gray-500">
                  {pathway.estimatedDuration}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {pathway.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Learning Objectives</span>
            <span className="text-sm text-gray-500">
              {pathway.learningObjectives.length} objectives
            </span>
          </div>
          <div className="space-y-1">
            {pathway.learningObjectives.slice(0, 2).map((objective, index) => (
              <div key={objective.id} className="text-sm text-gray-600">
                • {objective.description}
              </div>
            ))}
            {pathway.learningObjectives.length > 2 && (
              <div className="text-sm text-gray-500">
                +{pathway.learningObjectives.length - 2} more objectives
              </div>
            )}
          </div>
        </div>

        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Trauma-Informed Features:
          </div>
          <div className="flex flex-wrap gap-1">
            {pathway.traumaInformedAdaptations.slice(0, 2).map((adaptation, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {adaptation.split(' ').slice(0, 3).join(' ')}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onStart(pathway.id)}
          className="w-full"
          variant={progress > 0 ? "outline" : "default"}
        >
          {progress > 0 ? 'Continue Learning' : 'Start Pathway'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

interface LearningAnalyticsDashboardProps {
  analytics: LearningAnalytics | null;
  isLoading: boolean;
}

const LearningAnalyticsDashboard: React.FC<LearningAnalyticsDashboardProps> = ({
  analytics,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Learning Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Learning Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Complete your first learning session to see your analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium text-gray-900">
            {analytics.overallProgress.pathwaysCompleted}/
            {analytics.overallProgress.pathwaysStarted}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Pathways Completed
          </p>
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Study Time</span>
              <span>{Math.round(analytics.overallProgress.totalTimeSpent / 60)}h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Engagement Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium text-gray-900">
            {Math.round(analytics.overallProgress.averageEngagement)}%
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Average Engagement
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${analytics.overallProgress.averageEngagement}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Wellness Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stress Level</span>
              <Badge variant="secondary" className="text-xs">
                {analytics.wellnessIntegration.burnoutRisk.level}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Emotional Safety</span>
              <span className="text-sm font-medium">
                {analytics.wellnessIntegration.emotionalSafety.length > 0 ? '✓' : '○'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MentorshipSectionProps {
  userId: string;
  mentors: MentorProfile[];
  onConnectMentor: (mentorId: string) => void;
}

const MentorshipSection: React.FC<MentorshipSectionProps> = ({
  userId,
  mentors,
  onConnectMentor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Mentorship Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mentors.length === 0 ? (
          <div className="text-center py-6">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              No mentors found yet. Complete your learning assessment to get matched with mentors.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mentors.slice(0, 3).map((mentor, index) => (
              <div key={mentor.userId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Expert in {mentor.expertise[0]?.domain || 'General Learning'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {mentor.experience.yearsExperience} years experience • {mentor.mentorshipStyle.approach} style
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {mentor.successMetrics.averageRating}/5.0 rating
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onConnectMentor(mentor.userId)}
                  className="ml-4"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const EducationalTransformationHub: React.FC<EducationalTransformationHubProps> = ({
  userId,
  userProfile,
  onPathwayStart,
  onAssessmentComplete
}) => {
  const [activeTab, setActiveTab] = useState<'pathways' | 'analytics' | 'mentorship' | 'assessment'>('pathways');
  const [recommendedPathways, setRecommendedPathways] = useState<EducationalPathway[]>([]);
  const [allPathways, setAllPathways] = useState<EducationalPathway[]>(ALL_CORE_PATHWAYS);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Initialize engines
  const [assessmentEngine] = useState(() => new LearningAssessmentEngine());
  const [recommendationEngine] = useState(() => new PathwayRecommendationEngine());
  const [analyticsEngine] = useState(() => new LearningAnalyticsEngine());
  const [mentorshipEngine] = useState(() => new MentorshipMatchingEngine());

  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      setHasProfile(true);
      loadRecommendations();
      loadAnalytics();
    }
  }, [userProfile]);

  const loadRecommendations = async () => {
    if (!userProfile) return;

    try {
      setIsLoading(true);
      const recommendations = await recommendationEngine.getPersonalizedRecommendations(
        userId,
        [], // goals
        undefined, // time constraints
        'beginner' // current skill level
      );
      setRecommendedPathways(recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await analyticsEngine.generateLearningAnalytics(userId);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const startAssessment = async () => {
    try {
      setIsLoading(true);
      const profile = await assessmentEngine.assessLearner(userId, userProfile);
      setHasProfile(true);
      onAssessmentComplete?.(profile);
      await loadRecommendations();
    } catch (error) {
      console.error('Error starting assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePathwayStart = (pathwayId: string) => {
    onPathwayStart?.(pathwayId);
  };

  const handleConnectMentor = async (mentorId: string) => {
    try {
      // This would integrate with the mentorship matching system
      console.log('Connecting with mentor:', mentorId);
    } catch (error) {
      console.error('Error connecting with mentor:', error);
    }
  };

  const tabs = [
    { id: 'pathways', label: 'Learning Pathways', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'analytics', label: 'Progress Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'mentorship', label: 'Mentorship', icon: <Users className="h-4 w-4" /> },
    { id: 'assessment', label: 'Learning Assessment', icon: <Target className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Zap className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-medium text-gray-900">
                Educational Transformation Hub
              </h1>
              <p className="text-gray-600 mt-1">
                Revolutionary pathways that transform how you learn, grow, and develop
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Trauma-Informed & Neuroscience-Based Learning
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'pathways' && (
          <div className="space-y-8">
            {/* Recommended Pathways */}
            {hasProfile && recommendedPathways.length > 0 && (
              <div>
                <div className="flex items-center mb-6">
                  <Star className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-medium text-gray-900">
                    Recommended for You
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedPathways.map((pathway) => (
                    <PathwayCard
                      key={pathway.id}
                      pathway={pathway}
                      isRecommended={true}
                      onStart={handlePathwayStart}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Pathways */}
            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                All Learning Pathways
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPathways.map((pathway) => (
                  <PathwayCard
                    key={pathway.id}
                    pathway={pathway}
                    onStart={handlePathwayStart}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <LearningAnalyticsDashboard 
              analytics={analytics}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'mentorship' && (
          <div className="space-y-6">
            <MentorshipSection
              userId={userId}
              mentors={mentors}
              onConnectMentor={handleConnectMentor}
            />
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-6 w-6" />
                  Learning Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!hasProfile ? (
                  <div className="text-center py-8">
                    <Target className="mx-auto h-16 w-16 text-blue-600 mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Discover Your Optimal Learning Path
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Take our comprehensive assessment to understand your unique learning style, 
                      cognitive preferences, and receive personalized pathway recommendations.
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Brain className="h-4 w-4 mr-2 text-blue-600" />
                        Neuroscience-based cognitive assessment
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Heart className="h-4 w-4 mr-2 text-blue-600" />
                        Emotional intelligence evaluation
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="h-4 w-4 mr-2 text-blue-600" />
                        Trauma-informed safety considerations
                      </div>
                    </div>
                    <Button 
                      onClick={startAssessment}
                      disabled={isLoading}
                      className="px-8 py-3"
                    >
                      {isLoading ? 'Starting Assessment...' : 'Begin Assessment'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="mx-auto h-16 w-16 text-green-600 mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Assessment Complete!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your personalized learning profile has been created. Check out your 
                      recommended pathways and start your transformation journey.
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <Button 
                        onClick={() => setActiveTab('pathways')}
                        variant="outline"
                      >
                        View Pathways
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('analytics')}
                      >
                        View Analytics
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalTransformationHub;