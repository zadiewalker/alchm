'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  getDocs 
} from 'firebase/firestore';
import {
  ScarabIcon,
  SeedlingIcon,
  CompassIcon,
  HeartIcon,
  CheckCircleIcon,
  LockIcon,
  ArrowRightIcon,
  colors
} from '@/components/icons';

// Design tokens following Jony Ive principles
const cardStyle = {
  background: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

const statCardStyle = {
  background: 'rgba(255,255,255,0.7)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center' as const,
};

interface PathwayData {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  status: 'available' | 'in-progress' | 'completed' | 'locked';
  iconType: 'seedling' | 'compass' | 'heart';
}

interface UserStats {
  activePaths: number;
  totalXP: number;
  currentStreak: number;
  pathwaysCompleted: number;
}

export default function PathwaysPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    activePaths: 0,
    totalXP: 0,
    currentStreak: 0,
    pathwaysCompleted: 0,
  });
  const [pathways, setPathways] = useState<PathwayData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user) {
      loadUserData();
    }
  }, [loading, user, router]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load user stats from Firebase - REAL DATA ONLY
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      // Load pathways progress
      const pathwaysRef = collection(db, 'users', user.uid, 'pathways');
      const pathwaysSnapshot = await getDocs(pathwaysRef);

      // Calculate real stats from actual data
      const pathwaysData: PathwayData[] = [];
      let activePaths = 0;
      let completedPaths = 0;

      // Define available pathways
      const availablePathways = [
        {
          id: 'resilience',
          title: 'Resilience Building',
          description: 'Develop strength through life\'s challenges',
          totalLessons: 7,
          iconType: 'seedling' as const,
        },
        {
          id: 'emotional-awareness',
          title: 'Emotional Awareness',
          description: 'Master the foundation of emotional intelligence',
          totalLessons: 7,
          iconType: 'compass' as const,
        },
        {
          id: 'relationship-patterns',
          title: 'Relationship Patterns',
          description: 'Understand your connections with others',
          totalLessons: 8,
          iconType: 'heart' as const,
        },
      ];

      // Check progress for each pathway
      availablePathways.forEach((pathway) => {
        const progressDoc = pathwaysSnapshot.docs.find(doc => doc.id === pathway.id);
        const progressData = progressDoc?.data();
        const completedLessons = progressData?.completedLessons?.length || 0;

        let status: PathwayData['status'] = 'available';
        if (completedLessons === pathway.totalLessons) {
          status = 'completed';
          completedPaths++;
        } else if (completedLessons > 0) {
          status = 'in-progress';
          activePaths++;
        }

        pathwaysData.push({
          ...pathway,
          completedLessons,
          status,
        });
      });

      // Only display real data
      setUserStats({
        activePaths,
        totalXP: userData?.gamification?.totalXP || 0,
        currentStreak: userData?.gamification?.streak?.current || 0,
        pathwaysCompleted: completedPaths,
      });

      setPathways(pathwaysData);
    } catch (error) {
      console.error('Error loading pathways data:', error);
    }

    setLoadingData(false);
  };

  const getPathwayIcon = (iconType: string, size: number = 24) => {
    switch (iconType) {
      case 'seedling': return <SeedlingIcon size={size} color={colors.sage} />;
      case 'compass': return <CompassIcon size={size} color={colors.sage} />;
      case 'heart': return <HeartIcon size={size} color={colors.terracotta} />;
      default: return <SeedlingIcon size={size} color={colors.sage} />;
    }
  };

  const handlePathwayClick = (pathway: PathwayData) => {
    if (pathway.status === 'locked') return;
    
    // Navigate to pathway content
    router.push(`/pathways/${pathway.id}`);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.offWhite }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <ScarabIcon size={32} color={colors.sage} />
          </div>
          <p className="text-lg" style={{ color: colors.charcoal }}>Loading your journeys...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Empty state - honest about having no data
  if (pathways.every(p => p.status === 'available')) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.offWhite }}>
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium" style={{ color: colors.charcoal }}>Your Journeys</h1>
            <div></div>
          </div>
        </header>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-16" style={cardStyle}>
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ScarabIcon size={40} color={colors.sage} />
            </div>
            <h2 className="text-2xl font-light mb-4" style={{ color: colors.charcoal }}>
              No journeys started yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Each pathway teaches specific emotional skills through interactive lessons.
            </p>
            <button
              onClick={() => handlePathwayClick(pathways[0])}
              className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: colors.sage }}
            >
              Explore Pathways
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.offWhite }}>
      {/* Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
            <div className="text-right text-sm text-gray-500">
              Level {Math.floor(userStats.totalXP / 100) + 1}
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-light mb-2" style={{ color: colors.charcoal }}>
              Your Journeys
            </h1>
            <p className="text-gray-600">
              Building emotional wisdom, one lesson at a time
            </p>
          </div>

          {/* Real Stats Only */}
          <div className="grid grid-cols-3 gap-4">
            <div style={statCardStyle}>
              <div className="text-2xl font-light mb-1" style={{ color: colors.charcoal }}>
                {userStats.activePaths}
              </div>
              <div className="text-sm text-gray-600">Active Paths</div>
            </div>
            
            {userStats.totalXP > 0 && (
              <div style={statCardStyle}>
                <div className="text-2xl font-light mb-1" style={{ color: colors.charcoal }}>
                  {userStats.totalXP}
                </div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
            )}
            
            {userStats.currentStreak > 0 && (
              <div style={statCardStyle}>
                <div className="text-2xl font-light mb-1" style={{ color: colors.charcoal }}>
                  {userStats.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Active Pathways */}
        {pathways.some(p => p.status === 'in-progress') && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ color: colors.charcoal }}>
              ACTIVE
            </h2>
            <div className="space-y-4">
              {pathways
                .filter(p => p.status === 'in-progress')
                .map(pathway => (
                  <button
                    key={pathway.id}
                    onClick={() => handlePathwayClick(pathway)}
                    className="w-full text-left transition-all hover:shadow-md"
                    style={cardStyle}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                        {getPathwayIcon(pathway.iconType, 24)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1" style={{ color: colors.charcoal }}>
                          {pathway.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {pathway.description}
                        </p>
                      </div>
                      <ArrowRightIcon size={20} color={colors.charcoal} />
                    </div>
                    
                    {/* Real Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {pathway.completedLessons}/{pathway.totalLessons} lessons
                        </span>
                        <span style={{ color: colors.sage }}>
                          {Math.round((pathway.completedLessons / pathway.totalLessons) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            backgroundColor: colors.sage,
                            width: `${(pathway.completedLessons / pathway.totalLessons) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div 
                        className="px-4 py-2 rounded-lg text-sm font-medium inline-block"
                        style={{ 
                          backgroundColor: colors.sage, 
                          color: 'white' 
                        }}
                      >
                        Continue
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Completed Pathways */}
        {pathways.some(p => p.status === 'completed') && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ color: colors.charcoal }}>
              COMPLETED
            </h2>
            <div className="space-y-4">
              {pathways
                .filter(p => p.status === 'completed')
                .map(pathway => (
                  <button
                    key={pathway.id}
                    onClick={() => handlePathwayClick(pathway)}
                    className="w-full text-left opacity-80 transition-all hover:opacity-100 hover:shadow-md"
                    style={cardStyle}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon size={24} color={colors.sage} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1" style={{ color: colors.charcoal }}>
                          {pathway.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {pathway.totalLessons} lessons completed
                        </p>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-lg text-sm"
                        style={{ 
                          backgroundColor: colors.sage + '20', 
                          color: colors.sage 
                        }}
                      >
                        Review
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Available Pathways */}
        {pathways.some(p => p.status === 'available') && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ color: colors.charcoal }}>
              AVAILABLE
            </h2>
            <div className="space-y-4">
              {pathways
                .filter(p => p.status === 'available')
                .map(pathway => (
                  <button
                    key={pathway.id}
                    onClick={() => handlePathwayClick(pathway)}
                    className="w-full text-left transition-all hover:shadow-md"
                    style={cardStyle}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                        {getPathwayIcon(pathway.iconType, 24)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1" style={{ color: colors.charcoal }}>
                          {pathway.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {pathway.description}
                        </p>
                      </div>
                      <ArrowRightIcon size={20} color={colors.charcoal} />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{pathway.totalLessons} lessons • Starts fresh</span>
                    </div>
                    
                    <div 
                      className="px-4 py-2 rounded-lg text-sm font-medium inline-block border transition-all hover:opacity-80"
                      style={{ 
                        backgroundColor: 'transparent',
                        borderColor: colors.sage,
                        color: colors.sage 
                      }}
                    >
                      Begin Journey
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Crisis Support */}
      <div className="fixed bottom-6 right-6">
        <a 
          href="tel:988" 
          className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Crisis support - Call 988"
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}