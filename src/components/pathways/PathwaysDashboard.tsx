'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Design System
const COLORS = {
  sage: '#a4b792',
  sageLight: '#b8c7a6',
  sageDark: '#8fa078',
  cream: '#f7f5f0',
  charcoal: '#2d2d2d',
  warmWhite: '#fefdfb'
};

// Custom SVG Icons
const ScarabIcon = ({ size = 32, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4C12 4 8 7 8 12C8 16 10 20 12 22L16 28L20 22C22 20 24 16 24 12C24 7 20 4 16 4Z" fill={color}/>
    <ellipse cx="16" cy="14" rx="6" ry="4" fill="white" fillOpacity="0.3"/>
    <circle cx="14" cy="12" r="1.5" fill="white" fillOpacity="0.8"/>
    <circle cx="18" cy="12" r="1.5" fill="white" fillOpacity="0.8"/>
  </svg>
);

const TreeIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L8 8H16L12 2Z" fill={color}/>
    <path d="M9 8L5 14H13L9 8Z" fill={color} fillOpacity="0.7"/>
    <path d="M15 8L11 14H19L15 8Z" fill={color} fillOpacity="0.7"/>
    <rect x="11" y="14" width="2" height="8" fill={color}/>
  </svg>
);

const CrystalIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L6 8L12 14L18 8L12 2Z" fill={color}/>
    <path d="M6 8L12 14L12 22L6 16L6 8Z" fill={color} fillOpacity="0.6"/>
    <path d="M18 8L12 14L12 22L18 16L18 8Z" fill={color} fillOpacity="0.6"/>
  </svg>
);

const FlowerIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="3" fill={color}/>
    <circle cx="7" cy="12" r="3" fill={color} fillOpacity="0.8"/>
    <circle cx="17" cy="12" r="3" fill={color} fillOpacity="0.8"/>
    <circle cx="12" cy="17" r="3" fill={color} fillOpacity="0.8"/>
    <circle cx="12" cy="12" r="2" fill="white"/>
  </svg>
);

const CompassIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M12 2L14 10L12 12L10 10L12 2Z" fill={color}/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
);

// Pathway data structure
interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  progress: number;
  isLocked: boolean;
  estimatedTime: string;
  description: string;
  sessions: number;
  completedSessions: number;
  nextSession?: {
    title: string;
    duration: string;
  };
}

interface UserProgress {
  userId: string;
  pathwayProgress: Record<string, number>;
  completedPathways: string[];
  currentPathway?: string;
  lastActivityDate?: Date;
}

export function PathwaysDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize pathways data
  const initializePathways = (): Pathway[] => [
    {
      id: 'foundation',
      title: 'Foundation of Self',
      subtitle: 'Begin your inner journey',
      icon: ScarabIcon,
      progress: 0,
      isLocked: false,
      estimatedTime: '2-3 weeks',
      description: 'Establish a foundation of self-awareness and emotional safety. Learn grounding techniques and build your inner sanctuary.',
      sessions: 8,
      completedSessions: 0,
      nextSession: {
        title: 'Creating Sacred Space',
        duration: '15 minutes'
      }
    },
    {
      id: 'emotional-alchemy',
      title: 'Emotional Alchemy',
      subtitle: 'Transform pain into wisdom',
      icon: CrystalIcon,
      progress: 0,
      isLocked: true,
      estimatedTime: '3-4 weeks',
      description: 'Explore the depths of emotional experience and learn to transform difficult feelings into sources of strength.',
      sessions: 12,
      completedSessions: 0
    },
    {
      id: 'growth-mindset',
      title: 'Growth & Resilience',
      subtitle: 'Cultivate inner strength',
      icon: TreeIcon,
      progress: 0,
      isLocked: true,
      estimatedTime: '4-5 weeks',
      description: 'Build resilience and develop a growth mindset that supports your continued evolution.',
      sessions: 10,
      completedSessions: 0
    },
    {
      id: 'authentic-expression',
      title: 'Authentic Expression',
      subtitle: 'Find your true voice',
      icon: FlowerIcon,
      progress: 0,
      isLocked: true,
      estimatedTime: '3-4 weeks',
      description: 'Learn to express your authentic self with confidence and create meaningful connections.',
      sessions: 9,
      completedSessions: 0
    },
    {
      id: 'life-design',
      title: 'Life Design',
      subtitle: 'Create your intentional life',
      icon: CompassIcon,
      progress: 0,
      isLocked: true,
      estimatedTime: '5-6 weeks',
      description: 'Design a life aligned with your values and create a roadmap for your continued growth.',
      sessions: 15,
      completedSessions: 0
    }
  ];

  useEffect(() => {
    if (user?.uid) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user?.uid) return;

    try {
      // Load journal entries to calculate progress
      const journalsRef = collection(db, 'journals');
      const q = query(
        journalsRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const entryCount = snapshot.size;
      
      // Initialize pathways
      const initialPathways = initializePathways();
      
      // Calculate progress based on journal entries and other factors
      const progressData: UserProgress = {
        userId: user.uid,
        pathwayProgress: {},
        completedPathways: [],
        lastActivityDate: new Date()
      };

      // Basic progress calculation
      let foundationProgress = Math.min((entryCount * 12.5), 100); // 8 sessions = 100%
      
      initialPathways[0].progress = foundationProgress;
      initialPathways[0].completedSessions = Math.floor(foundationProgress / 12.5);
      
      // Unlock next pathway when previous is 75% complete
      if (foundationProgress >= 75) {
        initialPathways[1].isLocked = false;
        initialPathways[1].progress = Math.max(0, (foundationProgress - 75) * 4);
      }
      
      if (foundationProgress >= 100 && initialPathways[1].progress >= 75) {
        initialPathways[2].isLocked = false;
      }

      setPathways(initialPathways);
      setUserProgress(progressData);
      
    } catch (error) {
      console.error('Error loading user progress:', error);
      setPathways(initializePathways());
    } finally {
      setLoading(false);
    }
  };

  const handlePathwaySelect = async (pathway: Pathway) => {
    if (pathway.isLocked) return;
    
    try {
      // Update user's current pathway
      if (userProgress) {
        const progressRef = doc(db, 'userProgress', user!.uid);
        await setDoc(progressRef, {
          ...userProgress,
          currentPathway: pathway.id,
          lastActivityDate: new Date()
        }, { merge: true });
      }

      // Navigate to pathway session
      router.push(`/pathway/${pathway.id}`);
      
    } catch (error) {
      console.error('Error updating pathway selection:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/10 rounded-xl h-64 mb-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-white mb-4">
          Your Healing Pathways
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Each pathway is designed to guide your growth with intention and care. 
          Progress at your own pace through these transformative journeys.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-white">Your Journey</h2>
          <div className="text-white/80">
            {pathways.filter(p => p.progress > 0).length} of {pathways.length} pathways started
          </div>
        </div>
        
        <div className="space-y-3">
          {pathways.map(pathway => (
            <div key={pathway.id} className="flex items-center gap-4">
              <pathway.icon size={20} color={pathway.progress > 0 ? COLORS.sage : '#ffffff40'} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/90 font-medium">{pathway.title}</span>
                  <span className="text-white/60 text-sm">{pathway.progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sage-400 to-sage-500 transition-all duration-500"
                    style={{ width: `${pathway.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pathways.map((pathway, index) => (
          <div
            key={pathway.id}
            className={`group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
              pathway.isLocked 
                ? 'border-white/10 opacity-60 cursor-not-allowed' 
                : 'border-white/20 hover:border-white/40 hover:bg-white/15 cursor-pointer transform hover:scale-105'
            }`}
            onClick={() => handlePathwaySelect(pathway)}
          >
            {/* Lock indicator */}
            {pathway.isLocked && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="7" r="4"/>
                  <path d="m8 11v-4a4 4 0 0 1 8 0"/>
                </svg>
              </div>
            )}

            {/* Icon */}
            <div className="mb-6">
              <pathway.icon size={48} color={pathway.isLocked ? '#ffffff40' : COLORS.sage} />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {pathway.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {pathway.subtitle}
                </p>
              </div>

              <p className="text-white/80 text-sm leading-relaxed">
                {pathway.description}
              </p>

              {/* Progress bar */}
              {!pathway.isLocked && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs">
                      {pathway.completedSessions}/{pathway.sessions} sessions
                    </span>
                    <span className="text-white/60 text-xs">
                      {pathway.progress.toFixed(0)}% complete
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sage-400 to-sage-500 transition-all duration-500"
                      style={{ width: `${pathway.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Session info */}
              <div className="pt-2 border-t border-white/10">
                {pathway.nextSession && !pathway.isLocked ? (
                  <div className="space-y-1">
                    <p className="text-white/90 text-sm font-medium">
                      Next: {pathway.nextSession.title}
                    </p>
                    <p className="text-white/60 text-xs">
                      {pathway.nextSession.duration} • {pathway.estimatedTime} total
                    </p>
                  </div>
                ) : pathway.isLocked ? (
                  <p className="text-white/50 text-sm">
                    Complete previous pathway to unlock
                  </p>
                ) : (
                  <p className="text-white/60 text-sm">
                    {pathway.estimatedTime} estimated completion
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wisdom footer */}
      <div className="text-center mt-16 py-8">
        <div className="max-w-2xl mx-auto">
          <ScarabIcon size={32} color="#ffffff60" />
          <p className="text-white/60 mt-4 italic">
            "The journey of transformation begins with a single step into the unknown. 
            Each pathway reveals new aspects of your authentic self."
          </p>
        </div>
      </div>
    </div>
  );
}

// Default export for compatibility
export default PathwaysDashboard;