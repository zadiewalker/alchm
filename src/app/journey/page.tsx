'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  doc,
  getDoc 
} from 'firebase/firestore';

interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'entry' | 'pathway' | 'streak' | 'reflection' | 'breakthrough';
  data?: any;
}

interface JourneyStats {
  totalDays: number;
  entriesWritten: number;
  pathwaysCompleted: number;
  longestStreak: number;
  currentStreak: number;
  wordsWritten: number;
  firstEntry?: Date;
  lastEntry?: Date;
}

export default function JourneyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [milestones, setMilestones] = useState<JourneyMilestone[]>([]);
  const [stats, setStats] = useState<JourneyStats>({
    totalDays: 0,
    entriesWritten: 0,
    pathwaysCompleted: 0,
    longestStreak: 0,
    currentStreak: 0,
    wordsWritten: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user) {
      loadJourneyData();
    }
  }, [loading, user, router]);

  const loadJourneyData = async () => {
    if (!user) return;

    try {
      // Load journal entries
      const entriesRef = collection(db, 'users', user.uid, 'entries');
      const entriesQuery = query(entriesRef, orderBy('createdAt', 'desc'));
      const entriesSnapshot = await getDocs(entriesQuery);

      // Load pathways progress
      const pathwaysRef = collection(db, 'users', user.uid, 'pathways');
      const pathwaysSnapshot = await getDocs(pathwaysRef);

      // Load user data
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      // Process entries data
      const entries = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
      }));

      // Process pathways data
      const pathways = pathwaysSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate stats
      const totalEntries = entries.length;
      const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
      const completedPathways = pathways.filter(p => p.status === 'completed').length;
      
      const dates = entries.map(e => e.createdAt).sort((a, b) => a.getTime() - b.getTime());
      const firstEntry = dates.length > 0 ? dates[0] : undefined;
      const lastEntry = dates.length > 0 ? dates[dates.length - 1] : undefined;
      
      const uniqueDays = new Set(entries.map(e => e.createdAt.toDateString())).size;
      const totalDays = firstEntry && lastEntry ? 
        Math.ceil((lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

      setStats({
        totalDays,
        entriesWritten: totalEntries,
        pathwaysCompleted: completedPathways,
        longestStreak: userData?.gamification?.streak?.longest || 0,
        currentStreak: userData?.gamification?.streak?.current || 0,
        wordsWritten: totalWords,
        firstEntry,
        lastEntry,
      });

      // Create milestones
      const journeyMilestones: JourneyMilestone[] = [];

      // First entry milestone
      if (firstEntry) {
        journeyMilestones.push({
          id: 'first-entry',
          title: 'Journey Begins',
          description: 'You wrote your very first journal entry and began your healing journey',
          date: firstEntry,
          type: 'entry',
          data: { isFirst: true }
        });
      }

      // Significant entries (every 10th entry)
      entries.forEach((entry, index) => {
        const entryNumber = totalEntries - index; // Since they're in desc order
        if (entryNumber % 10 === 0 && entryNumber > 1) {
          journeyMilestones.push({
            id: `entry-${entryNumber}`,
            title: `${entryNumber} Entries Milestone`,
            description: `You've written ${entryNumber} journal entries - a testament to your commitment to growth`,
            date: entry.createdAt,
            type: 'reflection',
            data: { entryCount: entryNumber }
          });
        }
      });

      // Pathway completions
      pathways.forEach(pathway => {
        if (pathway.status === 'completed' && pathway.completedAt) {
          journeyMilestones.push({
            id: `pathway-${pathway.id}`,
            title: 'Pathway Completed',
            description: `Completed the ${pathway.title || 'healing pathway'} - a significant step in your growth`,
            date: pathway.completedAt.toDate ? pathway.completedAt.toDate() : new Date(pathway.completedAt),
            type: 'pathway',
            data: { pathwayId: pathway.id, pathwayTitle: pathway.title }
          });
        }
      });

      // Streak milestones
      if (userData?.gamification?.streak?.milestones) {
        userData.gamification.streak.milestones.forEach((milestone: any) => {
          journeyMilestones.push({
            id: `streak-${milestone.day}`,
            title: `${milestone.day}-Day Streak`,
            description: `Achieved a ${milestone.day}-day writing streak - consistency is transformation`,
            date: milestone.achievedAt.toDate ? milestone.achievedAt.toDate() : new Date(milestone.achievedAt),
            type: 'streak',
            data: { streakLength: milestone.day }
          });
        });
      }

      // Sort milestones by date
      journeyMilestones.sort((a, b) => b.date.getTime() - a.date.getTime());
      setMilestones(journeyMilestones);

    } catch (error) {
      console.error('Error loading journey data:', error);
    }
    
    setLoadingData(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getJourneyDuration = () => {
    if (!stats.firstEntry) return 'Just started';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - stats.firstEntry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'}`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'}`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) === 1 ? '' : 's'}`;
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'entry': return '📝';
      case 'pathway': return '🌱';
      case 'streak': return '🔥';
      case 'reflection': return '✨';
      case 'breakthrough': return '🌟';
      default: return '💎';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <span className="text-2xl">🌿</span>
          </div>
          <p className="text-lg text-sage-600">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Empty state
  if (stats.entriesWritten === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-sage-200">
            <div className="w-20 h-20 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🌱</span>
            </div>
            <h1 className="text-3xl font-light text-sage-900 mb-4">
              Your Journey Awaits
            </h1>
            <p className="text-sage-600 mb-8 max-w-md mx-auto leading-relaxed">
              Your healing journey will be documented here as you write entries and complete pathways.
            </p>
            <button
              onClick={() => router.push('/journal')}
              className="px-8 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors font-medium"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-light text-sage-900 mb-2">
              Your Healing Journey
            </h1>
            <p className="text-sage-700 text-lg">
              {getJourneyDuration()} of growth and self-discovery
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Journey Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-sage-200">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-light text-sage-900">{stats.entriesWritten}</div>
            <div className="text-sm text-sage-600">Entries Written</div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-sage-200">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-2xl font-light text-sage-900">{stats.pathwaysCompleted}</div>
            <div className="text-sm text-sage-600">Pathways Completed</div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-sage-200">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-light text-sage-900">{stats.currentStreak}</div>
            <div className="text-sm text-sage-600">Current Streak</div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-sage-200">
            <div className="text-3xl mb-2">📖</div>
            <div className="text-2xl font-light text-sage-900">{Math.round(stats.wordsWritten / 1000)}k</div>
            <div className="text-sm text-sage-600">Words Written</div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-sage-200">
          <h2 className="text-2xl font-light text-sage-900 mb-6 text-center">
            Journey Milestones
          </h2>
          
          {milestones.length > 0 ? (
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-sage-200">
                    <span className="text-lg">{getMilestoneIcon(milestone.type)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-sage-900">{milestone.title}</h3>
                        <p className="text-sage-700 mt-1 leading-relaxed">{milestone.description}</p>
                      </div>
                      <div className="text-sm text-sage-500 flex-shrink-0 ml-4">
                        {formatDate(milestone.date)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline connector */}
                  {index < milestones.length - 1 && (
                    <div className="absolute left-[2.25rem] mt-12 w-px h-6 bg-sage-200"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-sage-600">Your milestones will appear here as you continue your journey.</p>
            </div>
          )}
        </div>

        {/* Continue Journey CTA */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-sage-500 to-sage-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-light mb-4">Continue Your Growth</h3>
            <p className="text-sage-100 mb-6 max-w-2xl mx-auto">
              Every entry is a step forward. Every pathway completed is a breakthrough. 
              Your journey of healing continues with each moment you choose growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/journal')}
                className="px-6 py-3 bg-white text-sage-600 rounded-xl hover:bg-sage-50 transition-colors font-medium"
              >
                Write Next Entry
              </button>
              <button
                onClick={() => router.push('/pathways')}
                className="px-6 py-3 border border-white text-white rounded-xl hover:bg-white/10 transition-colors font-medium"
              >
                Explore Pathways
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Support */}
      <div className="fixed bottom-6 right-6">
        <a 
          href="tel:988" 
          className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Crisis support - Call 988"
        >
          📞
        </a>
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