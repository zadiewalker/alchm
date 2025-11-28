'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

const COLORS = {
  sage: '#a4b792',
  sageLight: '#c8d4bc',
  sageDark: '#8fa07d',
  terracotta: '#cb997e',
  charcoal: '#2e2e2e',
  offWhite: '#f7f7f2',
};

// ============================================
// CUSTOM ICONS (No stock emojis!)
// ============================================

const ScarabIcon = ({ size = 48, color = 'white' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="18" r="8" fill={color} opacity="0.9"/>
    <ellipse cx="24" cy="30" rx="12" ry="16" fill={color}/>
    <path d="M12 22 Q8 24 10 32 Q12 28 12 32" fill={color} opacity="0.8"/>
    <path d="M36 22 Q40 24 38 32 Q36 28 36 32" fill={color} opacity="0.8"/>
  </svg>
);

const PenIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="m18 2 4 4-14 14-4 0 0-4 14-14z"/>
    <path d="m14.5 5.5 3 3"/>
  </svg>
);

const BookIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const PathIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M14 9a2 2 0 0 1-2 2H6l-4-4 4-4h6a2 2 0 0 1 2 2v4z"/>
    <path d="m22 15-4-4-4 4 4 4 4-4z"/>
  </svg>
);

const ChartIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M3 3v18h18"/>
    <path d="m7 12 4-4 4 4 4-4"/>
  </svg>
);

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSaved = searchParams.get('saved') === 'true';
  
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    lastEntryDate: null as Date | null,
  });
  const [recentEntry, setRecentEntry] = useState<any>(null);
  const [showSavedToast, setShowSavedToast] = useState(justSaved);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      loadUserData(user.uid);
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (showSavedToast) {
      const timer = setTimeout(() => setShowSavedToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSavedToast]);

  const loadUserData = async (uid: string) => {
    try {
      // Get entries count and recent entry
      const entriesRef = collection(db, 'users', uid, 'entries');
      const entriesQuery = query(entriesRef, orderBy('createdAt', 'desc'), limit(1));
      const entriesSnapshot = await getDocs(entriesQuery);
      
      // Get all entries for count
      const allEntriesSnapshot = await getDocs(entriesRef);
      
      // Get user data for streak
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data();

      setStats({
        totalEntries: allEntriesSnapshot.size,
        currentStreak: userData?.gamification?.streak?.current || 0,
        lastEntryDate: entriesSnapshot.docs[0]?.data()?.createdAt?.toDate() || null,
      });

      if (entriesSnapshot.docs[0]) {
        const data = entriesSnapshot.docs[0].data();
        setRecentEntry({
          id: entriesSnapshot.docs[0].id,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt?.toDate(),
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.sage }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
            <ScarabIcon size={32} color="white" />
          </div>
          <p className="text-white text-lg">Preparing your sanctuary...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.offWhite }}>
      {/* ============================================ */}
      {/* HEADER - Sage background, white text */}
      {/* ============================================ */}
      <header className="px-6 py-8" style={{ backgroundColor: COLORS.sage }}>
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-light text-white mb-1">
                {getGreeting()}
              </h1>
              <p className="text-white/80">
                {user?.isAnonymous ? 'Welcome to your sanctuary' : 'Your sanctuary awaits'}
              </p>
            </div>
            
            {/* Scarab Avatar */}
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <ScarabIcon size={32} color="white" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-light text-white">Entries</div>
              <div className="text-3xl font-medium text-white">{stats.totalEntries}</div>
            </div>
            {stats.currentStreak > 0 && (
              <div className="text-center">
                <div className="text-2xl font-light text-white">Streak</div>
                <div className="text-3xl font-medium text-white flex items-center gap-2">
                  {stats.currentStreak}
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="white">
                    <path d="M12 2c3.866 0 7 3.134 7 7 0 5.523-4.477 10-10 10S6 14.523 6 9c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.105-.895 2-2 2s-2-.895-2-2"/>
                    <path d="M12 15c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" fill="rgba(255,255,255,0.8)"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* ============================================ */}
        {/* PRIMARY ACTION - Write New Entry */}
        {/* This is THE most important element */}
        {/* ============================================ */}
        <div>
          <button
            onClick={() => router.push('/journal/new')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg text-left transition-all active:scale-[0.98] hover:shadow-xl border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.sage + '20' }}>
                  <PenIcon size={24} color={COLORS.sage} />
                </div>
                <div>
                  <h2 className="text-xl font-medium mb-1" style={{ color: COLORS.charcoal }}>
                    Write Now
                  </h2>
                  <p className="text-gray-600">
                    {stats.lastEntryDate 
                      ? `Last entry ${getTimeAgo(stats.lastEntryDate)}`
                      : 'Start your healing journey'
                    }
                  </p>
                </div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
            </div>
          </button>
        </div>

        {/* ============================================ */}
        {/* RECENT ENTRY (if exists) */}
        {/* ============================================ */}
        {recentEntry && (
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: COLORS.charcoal }}>
              Continue where you left off
            </h3>
            <button
              onClick={() => router.push(`/entry/${recentEntry.id}`)}
              className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-sm text-gray-500 mb-2">
                {recentEntry.createdAt ? getTimeAgo(recentEntry.createdAt) : 'Recent'}
              </div>
              <h4 className="font-medium mb-2" style={{ color: COLORS.charcoal }}>{recentEntry.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {recentEntry.content?.substring(0, 100)}...
              </p>
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* SECONDARY ACTIONS - Smaller, less prominent */}
        {/* ============================================ */}
        <div>
          <h3 className="text-lg font-medium mb-3" style={{ color: COLORS.charcoal }}>
            Explore
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Past Entries */}
            <button
              onClick={() => router.push('/entries')}
              className="bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.sage + '20' }}>
                <BookIcon size={20} color={COLORS.sage} />
              </div>
              <h4 className="font-medium mb-1" style={{ color: COLORS.charcoal }}>Past Entries</h4>
              <p className="text-sm text-gray-600">
                {stats.totalEntries} {stats.totalEntries === 1 ? 'entry' : 'entries'}
              </p>
            </button>

            {/* Pathways */}
            <button
              onClick={() => router.push('/pathways')}
              className="bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.sage + '20' }}>
                <PathIcon size={20} color={COLORS.sage} />
              </div>
              <h4 className="font-medium mb-1" style={{ color: COLORS.charcoal }}>Pathways</h4>
              <p className="text-sm text-gray-600">Guided journeys</p>
            </button>

            {/* Insights - Only show if user has entries */}
            {stats.totalEntries > 0 && (
              <button
                onClick={() => router.push('/insights')}
                className="bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.sage + '20' }}>
                  <ChartIcon size={20} color={COLORS.sage} />
                </div>
                <h4 className="font-medium mb-1" style={{ color: COLORS.charcoal }}>Insights</h4>
                <p className="text-sm text-gray-600">Your patterns</p>
              </button>
            )}

            {/* Settings */}
            <button
              onClick={() => router.push('/settings')}
              className="bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.sage + '20' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.sage} strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="m12 1 0 6m0 6 0 6m11-7-6 0m-6 0-6 0"/>
                </svg>
              </div>
              <h4 className="font-medium mb-1" style={{ color: COLORS.charcoal }}>Settings</h4>
              <p className="text-sm text-gray-600">
                {user?.isAnonymous ? 'Create account' : 'Preferences'}
              </p>
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* GUEST PROMPT (if anonymous) */}
        {/* ============================================ */}
        {user?.isAnonymous && stats.totalEntries > 2 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-medium mb-2" style={{ color: COLORS.charcoal }}>
              Save your progress
            </h3>
            <p className="text-gray-600 mb-4">
              Create an account to keep your entries safe and sync across devices.
            </p>
            <button
              onClick={() => router.push('/settings')}
              className="text-sm font-medium"
              style={{ color: COLORS.terracotta }}
            >
              Create Account →
            </button>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* SAVED TOAST */}
      {/* ============================================ */}
      {showSavedToast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✓ Entry saved
        </div>
      )}

      {/* ============================================ */}
      {/* BOTTOM NAVIGATION */}
      {/* ============================================ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div className="flex items-center justify-around w-full max-w-lg">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-6 h-6 rounded" style={{ color: COLORS.sage }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span className="text-xs text-gray-600">Home</span>
            </button>
            
            <button 
              onClick={() => router.push('/entries')}
              className="flex flex-col items-center gap-1"
            >
              <BookIcon size={24} color={COLORS.sage} />
              <span className="text-xs text-gray-600">Entries</span>
            </button>
            
            {/* Center Write Button */}
            <button 
              onClick={() => router.push('/journal/new')}
              className="w-14 h-14 -mt-6 rounded-full flex items-center justify-center shadow-lg text-white text-2xl"
              style={{ backgroundColor: COLORS.sage }}
            >
              +
            </button>
            
            <button 
              onClick={() => router.push('/pathways')}
              className="flex flex-col items-center gap-1"
            >
              <PathIcon size={24} color={COLORS.sage} />
              <span className="text-xs text-gray-600">Pathways</span>
            </button>
            
            <button 
              onClick={() => router.push('/settings')}
              className="flex flex-col items-center gap-1"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.sage} strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="m12 1 0 6m0 6 0 6m11-7-6 0m-6 0-6 0"/>
              </svg>
              <span className="text-xs text-gray-600">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Crisis Support */}
      <div className="fixed bottom-20 right-6">
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