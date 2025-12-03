'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/useAuth';

interface Lesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  stage: string;
  type: string;
  minimumTimeMinutes: number;
  triggerWarning?: string;
  isCompleted?: boolean;
  completion?: any;
}

interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'gentle' | 'moderate' | 'intensive';
  estimatedDuration: string;
  totalXP: number;
  archetypeGuide: string;
  coreWound?: string;
  coreGift?: string;
  triggerWarnings?: string[];
  lessons: Lesson[];
  totalLessons: number;
  progress: {
    status: 'not-started' | 'in-progress' | 'completed';
    currentLessonOrder: number;
    completedLessons: number;
    percentComplete: number;
    xpEarned: number;
    startedAt?: Date;
    lastActivityAt?: Date;
    completedAt?: Date;
  };
  nextLesson?: {
    id: string;
    order: number;
    title: string;
    subtitle: string;
    stage: string;
    type: string;
    minimumTimeMinutes: number;
    triggerWarning?: string;
  };
  isCompleted: boolean;
  canContinue: boolean;
}

export default function PathwayDetailPage({ params }: { params: { pathwayId: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    loadPathway();
  }, [user, authLoading, params.pathwayId]);

  const loadPathway = async () => {
    try {
      setLoading(true);
      setError(null);

      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = await getFirebaseAuth();
      
      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }

      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/pathways/${params.pathwayId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load pathway');
      }

      const data = await response.json();
      setPathway(data);

    } catch (err: any) {
      console.error('Failed to load pathway:', err);
      setError(err.message || 'Failed to load pathway');
    } finally {
      setLoading(false);
    }
  };

  const startPathway = () => {
    if (pathway?.nextLesson) {
      router.push(`/pathways/${params.pathwayId}/lesson/${pathway.nextLesson.id}`);
    }
  };

  const resumePathway = () => {
    if (pathway?.nextLesson) {
      router.push(`/pathways/${params.pathwayId}/lesson/${pathway.nextLesson.id}`);
    }
  };

  const goToLesson = (lesson: Lesson) => {
    router.push(`/pathways/${params.pathwayId}/lesson/${lesson.id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
        <div className="text-sage-600">Loading pathway...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadPathway}
              className="px-4 py-2 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/pathways')}
              className="px-4 py-2 border border-sage-600 text-sage-600 rounded-xl hover:bg-sage-50 transition-colors"
            >
              Back to Pathways
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
        <div className="text-sage-600">Pathway not found</div>
      </div>
    );
  }

  const isStarted = pathway.progress.status !== 'not-started';
  const isCompleted = pathway.progress.status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/pathways')}
              className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              All Pathways
            </button>
          </div>
          
          {/* Pathway Header */}
          <div className="flex items-start gap-6 mb-8">
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: pathway.color + '20', color: pathway.color }}
            >
              {getPathwayIcon(pathway.icon)}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-light text-sage-900 mb-2">
                {pathway.title}
              </h1>
              <p className="text-xl text-sage-700 mb-4">
                {pathway.subtitle}
              </p>
              <p className="text-sage-600 leading-relaxed mb-4">
                {pathway.description}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center gap-6 text-sm text-sage-600">
                <span className={`px-3 py-1 rounded-full ${getDifficultyColor(pathway.difficulty)}`}>
                  {pathway.difficulty}
                </span>
                <span>{pathway.estimatedDuration}</span>
                <span>{pathway.totalXP} XP Total</span>
                <span>{pathway.totalLessons} Lessons</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          {isStarted && (
            <div className="bg-white/60 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-sage-900">Your Progress</h3>
                <span className="text-sm text-sage-600">
                  {pathway.progress.completedLessons} of {pathway.totalLessons} lessons completed
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${pathway.progress.percentComplete}%`,
                    backgroundColor: pathway.color 
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-sage-600">
                <span>{pathway.progress.percentComplete}% Complete</span>
                <span>{pathway.progress.xpEarned} XP Earned</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!isStarted ? (
              <button
                onClick={startPathway}
                className="px-8 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors font-medium"
              >
                Begin Pathway
              </button>
            ) : isCompleted ? (
              <button
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium"
                disabled
              >
                ✓ Completed
              </button>
            ) : (
              <button
                onClick={resumePathway}
                className="px-8 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors font-medium"
              >
                Continue Pathway
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pathway Details */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-light text-sage-900 mb-6">Lessons</h2>
            
            <div className="space-y-4">
              {pathway.lessons.map((lesson) => {
                const isAccessible = lesson.order <= pathway.progress.currentLessonOrder;
                const isNext = lesson.order === pathway.progress.currentLessonOrder;
                
                return (
                  <LessonCard 
                    key={lesson.id}
                    lesson={lesson}
                    isAccessible={isAccessible}
                    isNext={isNext}
                    pathwayColor={pathway.color}
                    onClick={() => isAccessible && goToLesson(lesson)}
                  />
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Archetype Guide */}
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-sage-900 mb-3">Your Guide</h3>
              <p className="text-sage-700 italic">{pathway.archetypeGuide}</p>
            </div>

            {/* Core Wound & Gift */}
            {(pathway.coreWound || pathway.coreGift) && (
              <div className="bg-white/60 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-sage-900 mb-3">Healing Focus</h3>
                {pathway.coreWound && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-sage-600 mb-1">Addresses:</div>
                    <div className="text-sage-800">{pathway.coreWound}</div>
                  </div>
                )}
                {pathway.coreGift && (
                  <div>
                    <div className="text-sm font-medium text-sage-600 mb-1">Cultivates:</div>
                    <div className="text-sage-800">{pathway.coreGift}</div>
                  </div>
                )}
              </div>
            )}

            {/* Trigger Warnings */}
            {pathway.triggerWarnings && pathway.triggerWarnings.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">⚠️ Trigger Warnings</h3>
                <p className="text-sm text-orange-700 mb-3">
                  This pathway may touch on sensitive topics:
                </p>
                <ul className="text-sm text-orange-600 space-y-1">
                  {pathway.triggerWarnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  isAccessible: boolean;
  isNext: boolean;
  pathwayColor: string;
  onClick: () => void;
}

function LessonCard({ lesson, isAccessible, isNext, pathwayColor, onClick }: LessonCardProps) {
  return (
    <div 
      className={`
        bg-white/60 rounded-xl p-6 border border-sage-200 transition-all duration-300
        ${isAccessible 
          ? 'cursor-pointer hover:shadow-lg hover:bg-white/80' 
          : 'opacity-50 cursor-not-allowed'
        }
        ${isNext ? 'ring-2 ring-offset-2 ring-opacity-50' : ''}
        ${lesson.isCompleted ? 'bg-green-50 border-green-200' : ''}
      `}
      onClick={onClick}
      style={isNext ? { ringColor: pathwayColor } : {}}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold
              ${lesson.isCompleted ? 'bg-green-500 text-white' : isAccessible ? 'text-white' : 'bg-gray-200 text-gray-500'}
            `}
            style={lesson.isCompleted ? {} : isAccessible ? { backgroundColor: pathwayColor } : {}}
          >
            {lesson.isCompleted ? '✓' : lesson.order}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-sage-900">{lesson.title}</h3>
            <p className="text-sm text-sage-600">{lesson.subtitle}</p>
          </div>
        </div>

        {isNext && (
          <div className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
            Next
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-sage-600">
        <div className="flex items-center gap-4">
          <span className={`px-2 py-1 rounded-full ${getStageColor(lesson.stage)}`}>
            {lesson.stage}
          </span>
          <span>{lesson.minimumTimeMinutes} min</span>
          <span>{lesson.type}</span>
        </div>
        
        {lesson.triggerWarning && (
          <span className="text-orange-600">⚠️ TW</span>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getPathwayIcon(icon: string) {
  const iconMap: Record<string, string> = {
    wave: '🌊',
    moon: '🌙',
    sprout: '🌱',
    body: '💫',
    link: '🔗',
    'heart-hands': '💚',
    compass: '🧭',
    river: '🌊',
    shield: '🛡️'
  };
  return iconMap[icon] || '✨';
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'gentle': return 'bg-green-100 text-green-800';
    case 'moderate': return 'bg-yellow-100 text-yellow-800';
    case 'intensive': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'awakening': return 'bg-yellow-100 text-yellow-800';
    case 'deepening': return 'bg-blue-100 text-blue-800';
    case 'descent': return 'bg-indigo-100 text-indigo-800';
    case 'threshold': return 'bg-purple-100 text-purple-800';
    case 'integration': return 'bg-green-100 text-green-800';
    case 'emergence': return 'bg-pink-100 text-pink-800';
    case 'embodiment': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Arrow Left Icon
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H6m0 0l6-6m-6 6l6 6"/>
  </svg>
);