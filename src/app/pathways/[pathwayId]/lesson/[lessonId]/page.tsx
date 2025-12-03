'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/useAuth';

interface Practice {
  type: 'meditation' | 'journaling' | 'breathwork' | 'bodywork' | 'visualization' | 'movement' | 'art' | 'music' | 'voice' | 'ritual' | 'reading';
  title: string;
  duration?: number;
  intention?: string;
  guidance?: string;
  materials?: string[];
  script?: string;
}

interface Lesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  stage: string;
  type: string;
  minimumTimeMinutes: number;
  xpReward: number;
  triggerWarning?: string;
  grounding?: {
    title: string;
    guidance: string;
  };
  introduction: string;
  teaching: string;
  practices: Practice[];
  journalPrompts: string[];
  reflection: string;
  completionAffirmation: string;
  recommendedBreakAfter?: boolean;
  isCompleted?: boolean;
  completion?: any;
}

interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  archetypeGuide: string;
  color: string;
  totalLessons: number;
}

interface LessonData {
  pathway: Pathway;
  lesson: Lesson;
  userProgress: {
    currentLessonOrder: number;
    completedLessons: number;
    percentComplete: number;
  };
}

export default function LessonPage({ params }: { params: { pathwayId: string; lessonId: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lesson progress state
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [practicesCompleted, setPracticesCompleted] = useState<string[]>([]);
  const [journalEntry, setJournalEntry] = useState('');
  const [currentSection, setCurrentSection] = useState<'introduction' | 'teaching' | 'practices' | 'journaling' | 'reflection' | 'completion'>('introduction');
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);

  const timeSpentRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    loadLesson();
  }, [user, authLoading, params.pathwayId, params.lessonId]);

  useEffect(() => {
    // Start tracking time when lesson loads
    if (lessonData && !startTime) {
      setStartTime(new Date());
      intervalRef.current = setInterval(() => {
        timeSpentRef.current += 1;
      }, 60000); // Update every minute
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [lessonData, startTime]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError(null);

      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = await getFirebaseAuth();
      
      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }

      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/pathways/${params.pathwayId}/lessons/${params.lessonId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to load lesson');
      }

      const data = await response.json();
      setLessonData(data);

      // If lesson is already completed, show completion immediately
      if (data.lesson.isCompleted) {
        setShowCompletion(true);
      }

    } catch (err: any) {
      console.error('Failed to load lesson:', err);
      setError(err.message || 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const markPracticeCompleted = (practiceTitle: string) => {
    if (!practicesCompleted.includes(practiceTitle)) {
      setPracticesCompleted([...practicesCompleted, practiceTitle]);
    }
  };

  const completeLesson = async () => {
    if (!lessonData || isCompleting) return;

    const timeSpent = Math.max(timeSpentRef.current, 1); // At least 1 minute
    
    if (timeSpent < lessonData.lesson.minimumTimeMinutes) {
      alert(`Please spend at least ${lessonData.lesson.minimumTimeMinutes} minutes with this lesson.`);
      return;
    }

    setIsCompleting(true);

    try {
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = await getFirebaseAuth();
      
      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }

      const idToken = await auth.currentUser.getIdToken();
      
      // Save journal entry if provided
      let journalEntryId = null;
      if (journalEntry.trim()) {
        const journalResponse = await fetch('/api/journal/save', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: journalEntry,
            mood: 'reflective',
            tags: [lessonData.pathway.title, lessonData.lesson.title],
            pathwayLessonId: lessonData.lesson.id
          })
        });

        if (journalResponse.ok) {
          const journalData = await journalResponse.json();
          journalEntryId = journalData.entryId;
        }
      }

      // Complete the lesson
      const response = await fetch(`/api/pathways/${params.pathwayId}/lessons/${params.lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeSpentMinutes: timeSpent,
          practicesCompleted,
          journalEntryId,
          notes: journalEntry.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete lesson');
      }

      const result = await response.json();
      setCompletionData(result);
      setShowCompletion(true);

    } catch (err: any) {
      console.error('Failed to complete lesson:', err);
      alert(err.message || 'Failed to complete lesson');
    } finally {
      setIsCompleting(false);
    }
  };

  const goToNextLesson = () => {
    if (completionData?.nextLesson) {
      router.push(`/pathways/${params.pathwayId}/lesson/${completionData.nextLesson.id}`);
    } else {
      router.push(`/pathways/${params.pathwayId}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
        <div className="text-sage-600">Loading lesson...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/pathways/${params.pathwayId}`)}
            className="px-4 py-2 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors"
          >
            Back to Pathway
          </button>
        </div>
      </div>
    );
  }

  if (!lessonData) return null;

  const { pathway, lesson } = lessonData;

  if (showCompletion) {
    return (
      <CompletionView 
        lesson={lesson}
        pathway={pathway}
        completionData={completionData}
        onContinue={goToNextLesson}
        onBackToPathway={() => router.push(`/pathways/${params.pathwayId}`)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/pathways/${params.pathwayId}`)}
                className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                {pathway.title}
              </button>
              
              <div className="h-6 w-px bg-sage-300"></div>
              
              <div>
                <h1 className="text-lg font-semibold text-sage-900">{lesson.title}</h1>
                <p className="text-sm text-sage-600">Lesson {lesson.order}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-sage-600">
                {Math.max(timeSpentRef.current, 1)} / {lesson.minimumTimeMinutes} min
              </div>
              
              {currentSection === 'completion' && (
                <button
                  onClick={completeLesson}
                  disabled={isCompleting}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isCompleting ? 'Completing...' : 'Complete Lesson'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <LessonNavigation 
              currentSection={currentSection}
              onSectionChange={setCurrentSection}
              practicesCount={lesson.practices.length}
              practicesCompleted={practicesCompleted.length}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {lesson.triggerWarning && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">⚠️ Trigger Warning</h3>
                <p className="text-orange-700">{lesson.triggerWarning}</p>
                
                {lesson.grounding && (
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">{lesson.grounding.title}</h4>
                    <p className="text-orange-700 text-sm">{lesson.grounding.guidance}</p>
                  </div>
                )}
              </div>
            )}

            <LessonContent 
              lesson={lesson}
              pathway={pathway}
              currentSection={currentSection}
              practicesCompleted={practicesCompleted}
              onPracticeComplete={markPracticeCompleted}
              journalEntry={journalEntry}
              onJournalChange={setJournalEntry}
              onSectionComplete={(section) => {
                // Auto-advance through sections
                const sections: typeof currentSection[] = ['introduction', 'teaching', 'practices', 'journaling', 'reflection', 'completion'];
                const currentIndex = sections.indexOf(section);
                if (currentIndex < sections.length - 1) {
                  setCurrentSection(sections[currentIndex + 1]);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LessonNavigationProps {
  currentSection: string;
  onSectionChange: (section: any) => void;
  practicesCount: number;
  practicesCompleted: number;
}

function LessonNavigation({ currentSection, onSectionChange, practicesCount, practicesCompleted }: LessonNavigationProps) {
  const sections = [
    { id: 'introduction', label: 'Introduction', icon: '🌱' },
    { id: 'teaching', label: 'Teaching', icon: '📖' },
    { id: 'practices', label: `Practices (${practicesCompleted}/${practicesCount})`, icon: '🧘' },
    { id: 'journaling', label: 'Journaling', icon: '✍️' },
    { id: 'reflection', label: 'Reflection', icon: '🔮' },
    { id: 'completion', label: 'Complete', icon: '✨' }
  ];

  return (
    <div className="bg-white/60 rounded-xl p-6 sticky top-24">
      <h3 className="font-semibold text-sage-900 mb-4">Lesson Sections</h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
              ${currentSection === section.id 
                ? 'bg-sage-100 text-sage-800 font-medium' 
                : 'text-sage-600 hover:bg-sage-50'
              }
            `}
          >
            <span>{section.icon}</span>
            <span className="text-sm">{section.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

interface LessonContentProps {
  lesson: Lesson;
  pathway: Pathway;
  currentSection: string;
  practicesCompleted: string[];
  onPracticeComplete: (title: string) => void;
  journalEntry: string;
  onJournalChange: (value: string) => void;
  onSectionComplete: (section: string) => void;
}

function LessonContent({ 
  lesson, 
  pathway, 
  currentSection, 
  practicesCompleted, 
  onPracticeComplete, 
  journalEntry, 
  onJournalChange, 
  onSectionComplete 
}: LessonContentProps) {
  return (
    <div className="bg-white/60 rounded-xl p-8">
      {currentSection === 'introduction' && (
        <div>
          <h2 className="text-2xl font-light text-sage-900 mb-4">{lesson.title}</h2>
          <p className="text-lg text-sage-700 mb-6">{lesson.subtitle}</p>
          <div className="prose prose-sage max-w-none">
            <p className="text-sage-800 leading-relaxed">{lesson.introduction}</p>
          </div>
          <button
            onClick={() => onSectionComplete('introduction')}
            className="mt-8 px-6 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors"
          >
            Continue to Teaching
          </button>
        </div>
      )}

      {currentSection === 'teaching' && (
        <div>
          <h2 className="text-2xl font-light text-sage-900 mb-6">Teaching</h2>
          <div className="prose prose-sage max-w-none">
            <p className="text-sage-800 leading-relaxed whitespace-pre-wrap">{lesson.teaching}</p>
          </div>
          <button
            onClick={() => onSectionComplete('teaching')}
            className="mt-8 px-6 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors"
          >
            Continue to Practices
          </button>
        </div>
      )}

      {currentSection === 'practices' && (
        <div>
          <h2 className="text-2xl font-light text-sage-900 mb-6">Practices</h2>
          <div className="space-y-6">
            {lesson.practices.map((practice, index) => (
              <PracticeCard 
                key={index}
                practice={practice}
                isCompleted={practicesCompleted.includes(practice.title)}
                onComplete={() => onPracticeComplete(practice.title)}
                pathwayColor={pathway.color}
              />
            ))}
          </div>
          <button
            onClick={() => onSectionComplete('practices')}
            className="mt-8 px-6 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors"
          >
            Continue to Journaling
          </button>
        </div>
      )}

      {currentSection === 'journaling' && (
        <div>
          <h2 className="text-2xl font-light text-sage-900 mb-6">Journal Reflection</h2>
          
          <div className="space-y-4 mb-6">
            {lesson.journalPrompts.map((prompt, index) => (
              <div key={index} className="bg-sage-50 rounded-lg p-4">
                <p className="text-sage-800 font-medium">{prompt}</p>
              </div>
            ))}
          </div>

          <textarea
            value={journalEntry}
            onChange={(e) => onJournalChange(e.target.value)}
            placeholder="Write your thoughts and reflections here..."
            className="w-full h-64 p-4 border border-sage-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white/80"
          />

          <button
            onClick={() => onSectionComplete('journaling')}
            className="mt-6 px-6 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors"
          >
            Continue to Reflection
          </button>
        </div>
      )}

      {currentSection === 'reflection' && (
        <div>
          <h2 className="text-2xl font-light text-sage-900 mb-6">Reflection</h2>
          <div className="prose prose-sage max-w-none">
            <p className="text-sage-800 leading-relaxed whitespace-pre-wrap">{lesson.reflection}</p>
          </div>
          <button
            onClick={() => onSectionComplete('reflection')}
            className="mt-8 px-6 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors"
          >
            Ready to Complete
          </button>
        </div>
      )}

      {currentSection === 'completion' && (
        <div className="text-center">
          <h2 className="text-3xl font-light text-sage-900 mb-6">Ready to Complete</h2>
          <p className="text-lg text-sage-700 mb-8">
            You've worked through all sections of this lesson. Take a moment to integrate what you've learned.
          </p>
          
          <div className="bg-sage-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-sage-900 mb-4">Lesson Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-sage-600">Practices Completed:</span>
                <span className="ml-2 font-medium">{practicesCompleted.length} / {lesson.practices.length}</span>
              </div>
              <div>
                <span className="text-sage-600">Journal Entry:</span>
                <span className="ml-2 font-medium">{journalEntry.trim() ? 'Completed' : 'Optional'}</span>
              </div>
            </div>
          </div>

          <p className="text-sage-600 mb-6">
            Completing this lesson will award you <strong>{lesson.xpReward} XP</strong>
          </p>
        </div>
      )}
    </div>
  );
}

interface PracticeCardProps {
  practice: Practice;
  isCompleted: boolean;
  onComplete: () => void;
  pathwayColor: string;
}

function PracticeCard({ practice, isCompleted, onComplete, pathwayColor }: PracticeCardProps) {
  return (
    <div className={`border rounded-xl p-6 transition-all ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-sage-200'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-sage-900">{practice.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-sage-600 capitalize">{practice.type}</span>
            {practice.duration && (
              <span className="text-sm text-sage-600">{practice.duration} min</span>
            )}
          </div>
        </div>
        
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isCompleted 
              ? 'bg-green-500 text-white' 
              : 'border-2 text-white hover:opacity-90'
          }`}
          style={isCompleted ? {} : { backgroundColor: pathwayColor, borderColor: pathwayColor }}
        >
          {isCompleted ? '✓ Done' : 'Mark Complete'}
        </button>
      </div>

      {practice.intention && (
        <p className="text-sage-700 italic mb-3">Intention: {practice.intention}</p>
      )}

      {practice.guidance && (
        <div className="text-sage-800 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
          {practice.guidance}
        </div>
      )}

      {practice.materials && practice.materials.length > 0 && (
        <div className="text-sm text-sage-600">
          <strong>Materials needed:</strong> {practice.materials.join(', ')}
        </div>
      )}
    </div>
  );
}

interface CompletionViewProps {
  lesson: Lesson;
  pathway: Pathway;
  completionData: any;
  onContinue: () => void;
  onBackToPathway: () => void;
}

function CompletionView({ lesson, pathway, completionData, onContinue, onBackToPathway }: CompletionViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg">
          <div className="text-6xl mb-6">✨</div>
          
          <h1 className="text-3xl font-light text-sage-900 mb-4">Lesson Complete</h1>
          
          <div className="bg-sage-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-sage-900 mb-3">Completion Affirmation</h2>
            <p className="text-sage-800 italic leading-relaxed">{lesson.completionAffirmation}</p>
          </div>

          {completionData && (
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Rewards Earned</h3>
              <div className="flex justify-center items-center gap-8 text-green-700">
                <div>
                  <div className="text-2xl font-bold">+{completionData.xpAwarded}</div>
                  <div className="text-sm">XP</div>
                </div>
                {completionData.newProgress && (
                  <div>
                    <div className="text-2xl font-bold">{completionData.newProgress.percentComplete}%</div>
                    <div className="text-sm">Complete</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {completionData?.recommendBreak && (
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🛁 Integration Time</h3>
              <p className="text-blue-700">Consider taking a break to integrate this lesson before continuing.</p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {completionData?.nextLesson && !completionData?.pathwayComplete ? (
              <button
                onClick={onContinue}
                className="px-8 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors font-medium"
              >
                Next Lesson: {completionData.nextLesson.title}
              </button>
            ) : completionData?.pathwayComplete ? (
              <button
                onClick={onBackToPathway}
                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                🎉 Pathway Complete!
              </button>
            ) : null}

            <button
              onClick={onBackToPathway}
              className="px-8 py-3 border border-sage-600 text-sage-600 rounded-xl hover:bg-sage-50 transition-colors"
            >
              Back to Pathway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Arrow Left Icon
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H6m0 0l6-6m-6 6l6 6"/>
  </svg>
);