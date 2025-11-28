'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc 
} from 'firebase/firestore';
import {
  ScarabIcon,
  JournalIcon,
  FlameIcon,
  CalendarIcon,
  PathwayIcon,
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

interface RealInsights {
  totalEntries: number;
  currentStreak: number;
  totalWords: number;
  averageWordsPerEntry: number;
  longestEntry: number;
  activePathways: number;
  completedPathways: number;
  daysActive: number;
  firstEntryDate?: Date;
  lastEntryDate?: Date;
  weeklyAverage: number;
  monthlyAverage: number;
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [insights, setInsights] = useState<RealInsights>({
    totalEntries: 0,
    currentStreak: 0,
    totalWords: 0,
    averageWordsPerEntry: 0,
    longestEntry: 0,
    activePathways: 0,
    completedPathways: 0,
    daysActive: 0,
    weeklyAverage: 0,
    monthlyAverage: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user) {
      loadRealInsights();
    }
  }, [loading, user, router]);

  const loadRealInsights = async () => {
    if (!user) return;

    try {
      // Load all journal entries to calculate real metrics
      const entriesRef = collection(db, 'users', user.uid, 'entries');
      const entriesQuery = query(entriesRef, orderBy('createdAt', 'desc'));
      const entriesSnapshot = await getDocs(entriesQuery);

      // Load pathways progress
      const pathwaysRef = collection(db, 'users', user.uid, 'pathways');
      const pathwaysSnapshot = await getDocs(pathwaysRef);

      // Load user data for streak info
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      // Calculate real metrics
      const entries = entriesSnapshot.docs.map(doc => doc.data());
      const totalEntries = entries.length;
      
      // Word count calculations
      const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
      const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
      const longestEntry = Math.max(...entries.map(entry => entry.wordCount || 0), 0);
      
      // Pathway calculations
      let activePathways = 0;
      let completedPathways = 0;
      
      pathwaysSnapshot.docs.forEach(doc => {
        const pathwayData = doc.data();
        const completedLessons = pathwayData.completedLessons?.length || 0;
        const totalLessons = pathwayData.totalLessons || 7; // Default pathway length
        
        if (completedLessons === totalLessons) {
          completedPathways++;
        } else if (completedLessons > 0) {
          activePathways++;
        }
      });

      // Date calculations
      const dates = entries
        .map(entry => entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt))
        .filter(date => date)
        .sort((a, b) => a.getTime() - b.getTime());
      
      const firstEntryDate = dates.length > 0 ? dates[0] : undefined;
      const lastEntryDate = dates.length > 0 ? dates[dates.length - 1] : undefined;
      
      // Calculate days active (unique days with entries)
      const uniqueDays = new Set(
        dates.map(date => date.toDateString())
      );
      const daysActive = uniqueDays.size;
      
      // Calculate averages
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const weeklyEntries = entries.filter(entry => {
        const entryDate = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
        return entryDate >= oneWeekAgo;
      }).length;
      
      const monthlyEntries = entries.filter(entry => {
        const entryDate = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt);
        return entryDate >= oneMonthAgo;
      }).length;
      
      const weeklyAverage = Math.round(weeklyEntries / 7 * 10) / 10; // Round to 1 decimal
      const monthlyAverage = Math.round(monthlyEntries / 30 * 10) / 10;

      setInsights({
        totalEntries,
        currentStreak: userData?.gamification?.streak?.current || 0,
        totalWords,
        averageWordsPerEntry,
        longestEntry,
        activePathways,
        completedPathways,
        daysActive,
        firstEntryDate,
        lastEntryDate,
        weeklyAverage,
        monthlyAverage,
      });
    } catch (error) {
      console.error('Error loading real insights:', error);
    }
    
    setLoadingData(false);
  };

  const formatJourneyDuration = () => {
    if (!insights.firstEntryDate) return null;
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - insights.firstEntryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'}`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'}`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) === 1 ? '' : 's'}`;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.offWhite }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <ScarabIcon size={32} color={colors.sage} />
          </div>
          <p className="text-lg" style={{ color: colors.charcoal }}>Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Empty state - honest about having no data
  if (insights.totalEntries === 0) {
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
            <h1 className="text-lg font-medium" style={{ color: colors.charcoal }}>Your Insights</h1>
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
              No insights yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Your insights will appear after you've written your first journal entry.
            </p>
            <button
              onClick={() => router.push('/journal')}
              className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: colors.sage }}
            >
              Write First Entry
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
              Real data only
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-light mb-2" style={{ color: colors.charcoal }}>
              Your Insights
            </h1>
            <p className="text-gray-600">
              Real patterns from your journaling journey
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Stats */}
        <div>
          <h2 className="text-lg font-medium mb-4" style={{ color: colors.charcoal }}>
            WRITING SUMMARY
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div style={statCardStyle}>
              <div className="flex items-center justify-center mb-2">
                <JournalIcon size={20} color={colors.sage} />
              </div>
              <div className="text-2xl font-light mb-1" style={{ color: colors.charcoal }}>
                {insights.totalEntries}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            
            {insights.currentStreak > 0 && (
              <div style={statCardStyle}>
                <div className="flex items-center justify-center mb-2">
                  <FlameIcon size={20} color={colors.terracotta} />
                </div>
                <div className="text-2xl font-light mb-1" style={{ color: colors.charcoal }}>
                  {insights.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            )}
            
            {insights.daysActive > 0 && (
              <div style={statCardStyle}>
                <div className="flex items-center justify-center mb-2">
                  <CalendarIcon size={20} color={colors.sage} />
                </div>
                <div className="text-2xl font-light mb-1" style={{ color: colors.charcoal }}>
                  {insights.daysActive}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            )}

            {(insights.activePathways > 0 || insights.completedPathways > 0) && (
              <div style={statCardStyle}>
                <div className="flex items-center justify-center mb-2">
                  <PathwayIcon size={20} color={colors.sage} />
                </div>
                <div className="text-2xl font-light mb-1" style={{ color: colors.charcoal }}>
                  {insights.activePathways + insights.completedPathways}
                </div>
                <div className="text-sm text-gray-600">Pathways</div>
              </div>
            )}
          </div>
        </div>

        {/* Writing Patterns */}
        {insights.totalWords > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ color: colors.charcoal }}>
              WRITING PATTERNS
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div style={cardStyle}>
                <h3 className="font-medium mb-4" style={{ color: colors.charcoal }}>
                  Word Count Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total words written</span>
                    <span className="font-medium" style={{ color: colors.charcoal }}>
                      {insights.totalWords.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average per entry</span>
                    <span className="font-medium" style={{ color: colors.charcoal }}>
                      {insights.averageWordsPerEntry} words
                    </span>
                  </div>
                  {insights.longestEntry > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Longest entry</span>
                      <span className="font-medium" style={{ color: colors.charcoal }}>
                        {insights.longestEntry} words
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={cardStyle}>
                <h3 className="font-medium mb-4" style={{ color: colors.charcoal }}>
                  Frequency Patterns
                </h3>
                <div className="space-y-3">
                  {insights.weeklyAverage > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Weekly average</span>
                      <span className="font-medium" style={{ color: colors.charcoal }}>
                        {insights.weeklyAverage} entries/day
                      </span>
                    </div>
                  )}
                  {insights.monthlyAverage > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly average</span>
                      <span className="font-medium" style={{ color: colors.charcoal }}>
                        {insights.monthlyAverage} entries/day
                      </span>
                    </div>
                  )}
                  {insights.firstEntryDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Journey length</span>
                      <span className="font-medium" style={{ color: colors.charcoal }}>
                        {formatJourneyDuration()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pathway Progress */}
        {(insights.activePathways > 0 || insights.completedPathways > 0) && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ color: colors.charcoal }}>
              PATHWAY PROGRESS
            </h2>
            <div style={cardStyle}>
              <div className="grid md:grid-cols-2 gap-6">
                {insights.activePathways > 0 && (
                  <div>
                    <div className="text-3xl font-light mb-2" style={{ color: colors.sage }}>
                      {insights.activePathways}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Active pathways</div>
                    <button
                      onClick={() => router.push('/pathways')}
                      className="text-sm px-4 py-2 rounded-lg border transition-colors hover:opacity-80"
                      style={{ 
                        borderColor: colors.sage,
                        color: colors.sage 
                      }}
                    >
                      Continue Learning
                    </button>
                  </div>
                )}
                
                {insights.completedPathways > 0 && (
                  <div>
                    <div className="text-3xl font-light mb-2" style={{ color: colors.sage }}>
                      {insights.completedPathways}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Completed pathways</div>
                    <button
                      onClick={() => router.push('/pathways')}
                      className="text-sm px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                      style={{ 
                        backgroundColor: colors.sage,
                        color: 'white'
                      }}
                    >
                      View Achievements
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {insights.firstEntryDate && (
          <div>
            <h2 className="text-lg font-medium mb-4" style={{ color: colors.charcoal }}>
              JOURNEY TIMELINE
            </h2>
            <div style={cardStyle}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Started writing</div>
                  <div className="font-medium" style={{ color: colors.charcoal }}>
                    {insights.firstEntryDate.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                {insights.lastEntryDate && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Last entry</div>
                    <div className="font-medium" style={{ color: colors.charcoal }}>
                      {insights.lastEntryDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Continue Writing CTA */}
        <div className="text-center py-8">
          <div style={cardStyle}>
            <h3 className="text-xl font-light mb-4" style={{ color: colors.charcoal }}>
              Keep Growing
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              Each entry adds to your understanding of yourself. Your insights become richer with time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/journal')}
                className="px-6 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: colors.sage }}
              >
                Write New Entry
              </button>
              <button
                onClick={() => router.push('/journals')}
                className="px-6 py-3 rounded-xl font-medium border transition-colors hover:opacity-80"
                style={{ 
                  borderColor: colors.sage,
                  color: colors.sage 
                }}
              >
                Review Past Entries
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
          <svg width={20} height={20} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}