'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

// ============================================
// DESIGN TOKENS
// ============================================
const COLORS = {
  sage: '#a4b792',
  sageDark: '#8fa07d',
  sageLight: '#c8d4bc',
  terracotta: '#cb997e',
  charcoal: '#2e2e2e',
  offWhite: '#f7f7f2',
  blush: '#eeddd3',
};

// ============================================
// CUSTOM ICONS (No Emojis)
// ============================================
const ScarabIcon = ({ size = 32, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4C12 4 8 7 8 12C8 16 10 20 12 22L16 28L20 22C22 20 24 16 24 12C24 7 20 4 16 4Z" fill={color}/>
    <ellipse cx="16" cy="14" rx="6" ry="4" fill="white" fillOpacity="0.3"/>
    <circle cx="14" cy="12" r="1.5" fill="white" fillOpacity="0.8"/>
    <circle cx="18" cy="12" r="1.5" fill="white" fillOpacity="0.8"/>
  </svg>
);

const JournalIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="17" x2="12" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PathwayIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12C3 12 7 4 12 4C17 4 21 12 21 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M3 12C3 12 7 20 12 20C17 20 21 12 21 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
    <circle cx="6" cy="12" r="1" fill={color} fillOpacity="0.6"/>
    <circle cx="18" cy="12" r="1" fill={color} fillOpacity="0.6"/>
  </svg>
);

const InsightsIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 18V12C3 12 5 10 8 10C11 10 13 12 13 12C13 12 15 8 18 8C21 8 21 12 21 12V18" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="8" cy="15" r="1.5" fill={color}/>
    <circle cx="16" cy="14" r="1.5" fill={color}/>
  </svg>
);

const BreatheIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
    <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.8"/>
    <path d="M12 4V8M12 16V20M20 12H16M8 12H4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

const HeartIcon = ({ size = 24, color = COLORS.sage }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20.84 4.61C19.32 3.08 17.16 2.84 15.54 3.84C14.84 4.25 14.12 4.92 12 7.58C9.88 4.92 9.16 4.25 8.46 3.84C6.84 2.84 4.68 3.08 3.16 4.61C0.32 7.45 3.26 12.44 12 21.35C20.74 12.44 23.68 7.45 20.84 4.61Z" fill={color}/>
  </svg>
);

const ChevronRight = ({ size = 20, color = COLORS.charcoal }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M7.5 5L12.5 10L7.5 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============================================
// KHEPERA AI COMPONENT
// ============================================
type KheperaMode = 'sage' | 'coach' | 'poet';

interface KheperaMessage {
  mode: KheperaMode;
  message: string;
  prompt?: string;
}

const KHEPERA_GREETINGS: Record<string, KheperaMessage[]> = {
  morning: [
    { mode: 'sage', message: "A new day offers new perspective. What truth are you sitting with this morning?", prompt: "What's one thing you're noticing about yourself today?" },
    { mode: 'coach', message: "You showed up today. That's the first victory. What's one small thing you can do for yourself?", prompt: "What would make today feel complete?" },
    { mode: 'poet', message: "The light returns, as it always does. As you will, too.", prompt: "What does the morning light remind you of?" },
  ],
  afternoon: [
    { mode: 'sage', message: "The middle of the day is a threshold. How are you carrying what you've gathered so far?", prompt: "What has surprised you today?" },
    { mode: 'coach', message: "Check in with yourself. Not to judge—just to notice. How are you, really?", prompt: "On a scale of stillness to storm, where are you right now?" },
    { mode: 'poet', message: "Afternoon light is forgiving. It softens edges. Perhaps you can soften too.", prompt: "What would you tell your morning self?" },
  ],
  evening: [
    { mode: 'sage', message: "The day is completing its arc. What did it teach you?", prompt: "What's one thing you'd like to release before sleep?" },
    { mode: 'coach', message: "You made it through another day. That's not small. What are you proud of?", prompt: "Name one thing you did well today." },
    { mode: 'poet', message: "Night comes not to end, but to hold. Let it hold you.", prompt: "What does rest mean to you tonight?" },
  ],
};

const KheperaCompanion = ({ 
  onPromptSelect 
}: { 
  onPromptSelect: (prompt: string) => void;
}) => {
  const [currentMessage, setCurrentMessage] = useState<KheperaMessage | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    const messages = KHEPERA_GREETINGS[timeOfDay];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  if (!currentMessage) return null;

  const modeColors = {
    sage: COLORS.sage,
    coach: COLORS.terracotta,
    poet: '#8b9dc3',
  };

  const modeLabels = {
    sage: 'The Sage',
    coach: 'The Coach',
    poet: 'The Poet',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${modeColors[currentMessage.mode]}20` }}
          >
            <ScarabIcon size={20} color={modeColors[currentMessage.mode]} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${modeColors[currentMessage.mode]}15`,
                  color: modeColors[currentMessage.mode]
                }}
              >
                {modeLabels[currentMessage.mode]}
              </span>
              <span className="text-sm text-gray-500 font-medium">Khepera</span>
            </div>
            <div className="text-gray-700 leading-relaxed">
              "{currentMessage.message}"
            </div>
          </div>
        </div>
      </button>

      {/* Expanded State with Prompt */}
      {isExpanded && currentMessage.prompt && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="pt-4">
            <div className="text-sm font-medium text-gray-600 mb-2">Reflection prompt:</div>
            <div className="text-sm text-gray-700 italic mb-4">
              "{currentMessage.prompt}"
            </div>
            <button
              onClick={() => {
                onPromptSelect(currentMessage.prompt!);
                setIsExpanded(false);
              }}
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: modeColors[currentMessage.mode],
                color: 'white',
              }}
            >
              Write about this
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// RECENT ENTRIES COMPONENT
// ============================================
const RecentEntries = ({ entries }: { entries: any[] }) => {
  const router = useRouter();
  
  if (entries.length === 0) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp?.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Entries</h3>
        <button 
          onClick={() => router.push('/entries')}
          className="text-xs text-[#a4b792] hover:underline"
        >
          View all
        </button>
      </div>
      <div className="space-y-3">
      {entries.slice(0, 3).map((entry, index) => (
        <button
          key={entry.id || index}
          onClick={() => router.push(`/entries/${entry.id}`)}
          className="w-full text-left p-4 bg-white rounded-xl hover:shadow-md transition-all"
        >
          <div className="text-sm text-gray-700 line-clamp-2 mb-2">
            {entry.content}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(entry.createdAt)}
          </div>
        </button>
      ))}
      </div>
    </div>
  );
};

// ============================================
// QUICK ACTIONS COMPONENT
// ============================================
const QuickActions = () => {
  const router = useRouter();

  const actions = [
    {
      id: 'pathways',
      icon: PathwayIcon,
      label: 'Pathways',
      description: 'Guided healing',
      route: '/pathways',
      color: COLORS.sage,
    },
    {
      id: 'breathe',
      icon: BreatheIcon,
      label: 'Breathe',
      description: 'Find calm',
      route: '/breathe',
      color: COLORS.terracotta,
    },
    {
      id: 'insights',
      icon: InsightsIcon,
      label: 'Insights',
      description: 'Your patterns',
      route: '/insights',
      color: COLORS.sage,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => router.push(action.route)}
          className="flex flex-col items-center p-4 bg-white rounded-2xl hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${action.color}15` }}
          >
            <action.icon size={24} color={action.color} />
          </div>
          <div className="text-sm font-medium text-gray-900">{action.label}</div>
          <div className="text-xs text-gray-500">{action.description}</div>
        </button>
      ))}
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function Dashboard() {
  const router = useRouter();
  
  // State
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState({
    streak: 0,
    graceTokens: 2,
    totalEntries: 0,
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auth & Data Loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/');
        return;
      }

      try {
        // Load user profile
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          uid: firebaseUser.uid,
          ...userData,
        });

        // Load entries
        const entriesQuery = query(
          collection(db, 'journals', firebaseUser.uid, 'entries'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        const entriesSnapshot = await getDocs(entriesQuery);
        const entriesData = entriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(entriesData);

        // Calculate stats
        setStats({
          streak: userData?.gamification?.currentStreak || 0,
          graceTokens: userData?.gamification?.graceTokens?.available || 2,
          totalEntries: entriesData.length,
        });

      } catch (error) {
        console.error('Error loading data:', error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [journalText]);

  // Save entry
  const handleSave = async () => {
    if (!journalText.trim() || !user) return;

    setIsSaving(true);
    try {
      const newEntry = {
        content: journalText.trim(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, 'journals', user.uid, 'entries'),
        newEntry
      );

      // Update local state
      setEntries(prev => [{
        id: docRef.id,
        ...newEntry,
        createdAt: new Date(),
      }, ...prev]);

      setJournalText('');
      setStats(prev => ({
        ...prev,
        totalEntries: prev.totalEntries + 1,
      }));

    } catch (error) {
      console.error('Error saving:', error);
    }
    setIsSaving(false);
  };

  // Handle Khepera prompt selection
  const handlePromptSelect = (prompt: string) => {
    setJournalText(prompt + '\n\n');
    textareaRef.current?.focus();
  };

  // Get greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#a4b792] to-[#8fa07d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-breathe">
            <ScarabIcon size={64} color="white" />
          </div>
          <div className="text-white text-lg font-light">Opening your sanctuary...</div>
        </div>
        <style jsx>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-breathe {
            animation: breathe 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a4b792] to-[#8fa07d] text-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4">
          <div className="w-8 h-8">
            <ScarabIcon size={32} color="white" />
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-white/70 text-sm hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Greeting */}
        <div className="px-6 pb-2">
          <h1 className="text-2xl font-light mb-1">{getGreeting()}</h1>
        </div>
        <div className="px-6 pb-6">
          <p className="text-white/80">Your sanctuary is ready</p>
        </div>

        {/* Stats Row */}
        {(stats.streak > 0 || stats.totalEntries > 0) && (
          <div className="px-6 pb-6 flex gap-4">
            {stats.streak > 0 && (
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full">
                </div>
                <span className="text-sm">{stats.streak} day streak</span>
              </div>
            )}
            {stats.totalEntries > 0 && (
              <div className="text-white/90 text-sm">
                {stats.totalEntries} entries
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 pb-20">
        
        {/* Khepera AI Companion */}
        <KheperaCompanion onPromptSelect={handlePromptSelect} />

        {/* Journal Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#a4b792]/10 rounded-xl flex items-center justify-center">
              <JournalIcon size={20} color={COLORS.sage} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Journal</h3>
              <p className="text-sm text-gray-500">Private & encrypted</p>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none bg-gray-50 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a4b792]/30 transition-all min-h-[100px]"
          />

          {journalText.trim() && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-4 px-6 py-3 bg-[#a4b792] text-white rounded-xl font-medium hover:bg-[#8fa07d] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Entries */}
        <RecentEntries entries={entries} />

        {/* Journey Progress Teaser */}
        <button
          onClick={() => router.push('/journey')}
          className="w-full p-5 rounded-2xl text-left transition-all hover:shadow-md"
          style={{ backgroundColor: `${COLORS.blush}50` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.blush}80` }}
              >
                <ScarabIcon size={20} color={COLORS.sage} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Your Journey</h3>
                <p className="text-sm text-gray-600">View progress & milestones</p>
              </div>
            </div>
            <ChevronRight />
          </div>
        </button>
      </div>

      {/* Crisis Support — Redesigned (No Red) */}
      <button
        onClick={() => router.push('/crisis-support')}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all active:scale-95"
        aria-label="Get support"
      >
        <HeartIcon size={24} color={COLORS.sage} />
      </button>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}