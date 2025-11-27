'use client';

import { useState, useEffect } from 'react';
import { BADGE_DEFINITIONS, getEarnedBadges, BadgeTree as BadgeTreeType } from '@/lib/badges';

interface Badge {
  key: string;
  level: number;
  earnedAt: any;
  name: string;
  description: string;
  tree: string;
  celebrationMessage?: string;
  xpAwarded: number;
}

interface BadgeTreeData {
  name: string;
  description: string;
  tree: string;
  levels: {
    level: number;
    name: string;
    description: string;
    isEarned: boolean;
    earnedAt?: any;
    celebrationMessage?: string;
    progress?: number; // 0-100
  }[];
  totalLevels: number;
  completedLevels: number;
}

const BADGE_TREES: Record<string, BadgeTreeData> = {
  presence: {
    name: 'Presence',
    description: 'The art of showing up for yourself',
    tree: 'presence',
    levels: [
      {
        level: 1,
        name: 'Still Here I',
        description: 'You showed up. That\'s the win.',
        isEarned: false,
        progress: 0
      },
      {
        level: 2,
        name: 'Still Here II', 
        description: 'Three days of showing up for yourself.',
        isEarned: false,
        progress: 0
      },
      {
        level: 3,
        name: 'Still Here III',
        description: 'A week of presence. Consistency is your superpower.',
        isEarned: false,
        progress: 0
      }
    ],
    totalLevels: 3,
    completedLevels: 0
  },
  insight: {
    name: 'Insight',
    description: 'Finding patterns and meaning in chaos',
    tree: 'insight',
    levels: [
      {
        level: 1,
        name: 'Chaos → Clarity I',
        description: 'Found signal in the noise.',
        isEarned: false,
        progress: 0
      },
      {
        level: 2,
        name: 'Chaos → Clarity II',
        description: 'Patterns emerging from the storm.',
        isEarned: false,
        progress: 0
      },
      {
        level: 3,
        name: 'Chaos → Clarity III',
        description: 'Master of making sense from chaos.',
        isEarned: false,
        progress: 0
      }
    ],
    totalLevels: 3,
    completedLevels: 0
  },
  resilience: {
    name: 'Resilience',
    description: 'Gentle power and authentic strength',
    tree: 'resilience',
    levels: [
      {
        level: 1,
        name: 'Soft but Strong I',
        description: 'Vulnerability as strength discovered.',
        isEarned: false,
        progress: 0
      },
      {
        level: 2,
        name: 'Soft but Strong II',
        description: 'Compassion for self, boundaries with others.',
        isEarned: false,
        progress: 0
      },
      {
        level: 3,
        name: 'Soft but Strong III',
        description: 'Embodying gentle power.',
        isEarned: false,
        progress: 0
      }
    ],
    totalLevels: 3,
    completedLevels: 0
  }
};

export default function BadgeTree() {
  const [badgeTrees, setBadgeTrees] = useState<Record<string, BadgeTreeData>>(BADGE_TREES);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTree, setSelectedTree] = useState<string>('presence');
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(!navigator.onLine);
  const { user } = useAuth();
  
  // Mobile optimization and analytics
  const {
    isCrisisMode,
    isOffline,
    deviceTier,
    isLowBattery,
    enableCrisisMode
  } = useMobileOptimization();
  
  const { trackUser, trackNavigation } = useAnalytics();
  
  // Handle double-tap protection for tremor compensation
  const handleTouchSafeAction = useCallback((action: () => void) => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      return; // Prevent double-tap within 300ms
    }
    setLastTapTime(currentTime);
    
    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate && !isLowBattery) {
      navigator.vibrate(30);
    }
    
    action();
  }, [lastTapTime, isLowBattery]);
  
  // Load badges from local storage when offline
  const loadOfflineBadges = useCallback(() => {
    try {
      const offlineBadges = localStorage.getItem(`alchm_badges_${user?.uid}`);
      if (offlineBadges) {
        const badges = JSON.parse(offlineBadges) as Badge[];
        setEarnedBadges(badges);
        updateBadgeTrees(badges);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load offline badges:', error);
    }
  }, [user?.uid]);
  
  // Save badges to local storage
  const saveOfflineBadges = useCallback((badges: Badge[]) => {
    if (!user?.uid) return;
    
    try {
      localStorage.setItem(`alchm_badges_${user.uid}`, JSON.stringify(badges));
      localStorage.setItem(`alchm_badges_${user.uid}_timestamp`, Date.now().toString());
    } catch (error) {
      console.error('Failed to save badges offline:', error);
    }
  }, [user?.uid]);
  
  // Update badge trees with earned status
  const updateBadgeTrees = useCallback((badges: Badge[]) => {
    const updatedTrees = { ...BADGE_TREES };
    
    // Reset all trees first
    Object.keys(updatedTrees).forEach(treeKey => {
      updatedTrees[treeKey]?.levels?.forEach(level => {
        level.isEarned = false;
        level.earnedAt = null;
        level.celebrationMessage = '';
      });
      if (updatedTrees[treeKey]) {
        updatedTrees[treeKey].completedLevels = 0;
      }
    });

    // Mark earned badges
    badges.forEach(badge => {
      const tree = updatedTrees[badge.tree];
      if (tree) {
        const levelIndex = badge.level - 1;
        if (tree.levels[levelIndex]) {
          tree.levels[levelIndex].isEarned = true;
          tree.levels[levelIndex].earnedAt = badge.earnedAt;
          tree.levels[levelIndex].celebrationMessage = badge.celebrationMessage;
        }
      }
    });

    // Calculate completed levels
    Object.keys(updatedTrees).forEach(treeKey => {
      const tree = updatedTrees[treeKey];
      if (tree) {
        tree.completedLevels = tree.levels.filter(level => level.isEarned).length;
      }
    });

    setBadgeTrees(updatedTrees);
  }, []);
  
  // Handle network changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOfflineMode(false);
      // TODO: Sync any queued badge updates
      if (syncQueue.length > 0) {
        console.log('Syncing queued badge updates:', syncQueue.length);
        // Process sync queue when back online
        setSyncQueue([]);
      }
    };
    
    const handleOffline = () => {
      setIsOfflineMode(true);
      loadOfflineBadges();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue, loadOfflineBadges]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    
    // Track page view
    trackNavigation.pageView('/badges', document.referrer);
    
    // If offline, load from localStorage
    if (isOfflineMode) {
      loadOfflineBadges();
      return;
    }

    // Listen to earned badges when online
    const badgesRef = collection(db, `users/${user.uid}/badges`);
    const unsubscribe = onSnapshot(badgesRef, (snapshot) => {
      const badges = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          key: data.key || doc.id,
          level: data.level || 1,
          earnedAt: data.earnedAt,
          name: data.name || 'Unknown Badge',
          description: data.description || '',
          tree: data.tree || 'general',
          celebrationMessage: data.celebrationMessage,
          xpAwarded: data.xpAwarded || 0,
          ...data
        };
      }) as Badge[];
      
      setEarnedBadges(badges);
      updateBadgeTrees(badges);
      
      // Save to localStorage for offline use
      saveOfflineBadges(badges);
      
      setLoading(false);
    }, (error) => {
      console.error('Error loading badges:', error);
      // Fallback to offline data
      loadOfflineBadges();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, isOfflineMode, trackNavigation, loadOfflineBadges, saveOfflineBadges, updateBadgeTrees]);

  const getTreeIcon = (treeKey: string): string => {
    const icons: Record<string, string> = {
      presence: '🌱',
      insight: '🧠', 
      resilience: '💪'
    };
    return icons[treeKey] || '🏆';
  };

  const getTreeColor = (treeKey: string): string => {
    // Jony Ive Constraint: Single color family with meaningful variations
    const colors: Record<string, string> = {
      presence: '#a4b792',      // Primary sage
      insight: '#93a682',       // Sage hover
      resilience: '#7a8c6a'     // Sage active
    };
    return colors[treeKey] || '#a4b792';
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Crisis mode style overrides
  const touchTargetClass = isCrisisMode 
    ? 'min-h-[60px] min-w-[60px] text-lg font-medium border-2 border-red-400' 
    : 'min-h-[52px] min-w-[52px]';
    
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};

  if (loading) {
    return (
      <div className={`trauma-informed-mobile-ux ${isCrisisMode ? 'crisis-active' : ''}`} style={{
        background: 'white',
        borderRadius: isCrisisMode ? '8px' : '12px',
        padding: isCrisisMode ? '2.5rem' : '2rem',
        border: isCrisisMode ? '2px solid #a4b792' : '1px solid #e5e5e5',
        textAlign: 'center',
        ...crisisStyles
      }}>
        <div style={{ fontSize: isCrisisMode ? '2rem' : '1.5rem', marginBottom: '1rem' }}>🏆</div>
        <p style={{ 
          color: isCrisisMode ? '#2e2e2e' : '#666', 
          margin: 0,
          fontSize: isCrisisMode ? '18px' : '16px',
          fontWeight: isCrisisMode ? '600' : 'normal'
        }}>
          {isCrisisMode ? 'Your achievements are loading...' : 'Loading your growth...'}
        </p>
        {isOfflineMode && (
          <div style={{
            marginTop: '1rem',
            padding: '8px 12px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            fontSize: '14px',
            color: 'rgba(245, 158, 11, 0.8)'
          }}>
            📡 Loading offline data
          </div>
        )}
      </div>
    );
  }

  const selectedTreeData = badgeTrees[selectedTree];

  return (
    <div className={`trauma-informed-mobile-ux ${isCrisisMode ? 'crisis-active' : ''} ${isLowBattery ? 'battery-saver-mode' : ''}`} style={{
      background: 'white',
      borderRadius: isCrisisMode ? '8px' : '12px',
      padding: isCrisisMode ? '2rem' : '1.5rem',
      border: isCrisisMode ? '2px solid #a4b792' : '1px solid #e5e5e5',
      marginBottom: '2rem',
      ...crisisStyles
    }}>
      {/* Mobile-optimized header */}
      <h3 style={{
        margin: '0 0 1.5rem 0',
        color: isCrisisMode ? '#2e2e2e' : '#2e2e2e',
        fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
        fontWeight: isCrisisMode ? '700' : 'normal',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: isCrisisMode ? '1.8rem' : '1.3rem' }}>🌳</span>
        {isCrisisMode ? 'Your Growth Journey' : 'Badge Trees'}
      </h3>
      
      {/* Offline indicator */}
      {(isOffline || isOfflineMode) && (
        <div style={{
          marginBottom: '1rem',
          padding: '12px 16px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          fontSize: '14px',
          color: 'rgba(245, 158, 11, 0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📡 <span>Your progress is saved offline and will sync when reconnected</span>
        </div>
      )}

      {/* Simplified tree selector - Progressive disclosure */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '2rem'
      }}>
        {Object.entries(badgeTrees).map(([treeKey, tree]) => (
          <button
            key={treeKey}
            onClick={() => handleTouchSafeAction(() => {
              setSelectedTree(treeKey);
              trackUser.preferencesChanged('badge_tree_selected', treeKey);
            })}
            className={`${touchTargetClass} touch-target`}
            style={{
              background: selectedTree === treeKey ? getTreeColor(treeKey) : 'transparent',
              color: selectedTree === treeKey ? 'white' : isCrisisMode ? '#2e2e2e' : '#666',
              border: `${isCrisisMode ? '3px' : '2px'} solid ${selectedTree === treeKey ? getTreeColor(treeKey) : '#e5e5e5'}`,
              padding: isCrisisMode ? '16px 20px' : '12px 16px',
              borderRadius: isCrisisMode ? '12px' : '20px',
              fontSize: isCrisisMode ? '1rem' : '0.9rem',
              fontWeight: isCrisisMode ? '700' : '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: isLowBattery ? 'none' : 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: isCrisisMode ? '1.2rem' : '1rem' }}>{getTreeIcon(treeKey)}</span>
            <span style={{ 
              fontSize: isCrisisMode ? '1.1rem' : '1rem',
              fontWeight: selectedTree === treeKey ? '600' : '400',
              lineHeight: '1.4'
            }}>
              {tree.name}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Tree */}
      {selectedTreeData && (
        <div>
          <div style={{
            backgroundColor: `${getTreeColor(selectedTree)}${isCrisisMode ? '20' : '10'}`,
            border: `${isCrisisMode ? '3px' : '2px'} solid ${getTreeColor(selectedTree)}`,
            borderRadius: isCrisisMode ? '8px' : '12px',
            padding: isCrisisMode ? '2rem' : '1.5rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{
              color: getTreeColor(selectedTree),
              marginBottom: '0.5rem',
              fontSize: isCrisisMode ? '1.4rem' : '1.2rem',
              fontWeight: isCrisisMode ? '700' : 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: isCrisisMode ? '1.6rem' : '1.2rem' }}>{getTreeIcon(selectedTree)}</span>
              {selectedTreeData.name}
            </h4>
            <p style={{
              color: '#2e2e2e',
              fontSize: isCrisisMode ? '1.1rem' : '0.9rem',
              fontWeight: isCrisisMode ? '500' : 'normal',
              margin: '0 0 1rem 0',
              lineHeight: '1.5'
            }}>
              {selectedTreeData.description}
            </p>
            
            {/* Progress Bar */}
            <div style={{
              backgroundColor: '#e5e5e5',
              borderRadius: '10px',
              height: isCrisisMode ? '12px' : '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: getTreeColor(selectedTree),
                height: '100%',
                width: `${(selectedTreeData.completedLevels / selectedTreeData.totalLevels) * 100}%`,
                transition: isLowBattery ? 'none' : 'width 0.3s ease'
              }} />
            </div>
            
            <p style={{
              color: '#666',
              fontSize: isCrisisMode ? '1rem' : '0.8rem',
              fontWeight: isCrisisMode ? '500' : 'normal',
              margin: '0.5rem 0 0 0'
            }}>
              {selectedTreeData.completedLevels} of {selectedTreeData.totalLevels} levels complete
            </p>
          </div>

          {/* Mobile-optimized badge levels */}
          <div style={{
            display: 'grid',
            gap: isCrisisMode ? '1.5rem' : '1rem'
          }}>
            {selectedTreeData.levels.map((level, index) => (
              <div
                key={level.level}
                className="touch-target"
                style={{
                  border: level.isEarned 
                    ? `${isCrisisMode ? '3px' : '2px'} solid ${getTreeColor(selectedTree)}` 
                    : `${isCrisisMode ? '2px' : '2px'} solid #e5e5e5`,
                  borderRadius: isCrisisMode ? '8px' : '12px',
                  padding: isCrisisMode ? '1.75rem' : '1.25rem',
                  backgroundColor: level.isEarned 
                    ? `${getTreeColor(selectedTree)}${isCrisisMode ? '15' : '05'}` 
                    : isCrisisMode ? '#f9f9f9' : '#fafafa',
                  position: 'relative',
                  opacity: level.isEarned ? 1 : (isCrisisMode ? 0.8 : 0.7),
                  minHeight: isCrisisMode ? '120px' : 'auto'
                }}
              >
                {/* Level Number */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '1rem',
                  backgroundColor: level.isEarned ? getTreeColor(selectedTree) : '#ccc',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {level.isEarned ? '✓' : level.level}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <div>
                    <h5 style={{
                      margin: 0,
                      color: level.isEarned ? getTreeColor(selectedTree) : '#666',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      {level.name}
                    </h5>
                  </div>
                  
                  {level.isEarned && (
                    <div style={{
                      backgroundColor: getTreeColor(selectedTree),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      EARNED
                    </div>
                  )}
                </div>

                <p style={{
                  color: '#2e2e2e',
                  fontSize: '0.9rem',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.4'
                }}>
                  {level.description}
                </p>

                {level.celebrationMessage && (
                  <div style={{
                    backgroundColor: 'white',
                    border: `1px solid ${getTreeColor(selectedTree)}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <p style={{
                      color: getTreeColor(selectedTree),
                      fontSize: '0.85rem',
                      margin: 0,
                      fontStyle: 'italic'
                    }}>
                      💬 "{level.celebrationMessage}"
                    </p>
                  </div>
                )}

                {level.earnedAt && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: isCrisisMode ? '1rem' : '0.8rem',
                    color: '#666',
                    fontWeight: isCrisisMode ? '500' : 'normal'
                  }}>
                    <span>🗓️ Earned {formatDate(level.earnedAt)}</span>
                  </div>
                )}

                {!level.isEarned && (
                  <p style={{
                    color: '#667a5c',
                    fontSize: '0.85rem',
                    margin: 0,
                    fontStyle: 'italic',
                    opacity: 0.8
                  }}>
                    Your growth is already happening. This recognition will come when it's time.
                  </p>
                )}
                
                {level.isEarned && level.celebrationMessage && (
                  <motion.button
                    style={{
                      background: 'transparent',
                      border: `1px solid ${getTreeColor(selectedTree)}`,
                      borderRadius: '8px',
                      padding: '6px 12px',
                      color: getTreeColor(selectedTree),
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                    whileHover={{ backgroundColor: `${getTreeColor(selectedTree)}10` }}
                    onClick={() => celebrateBadge(level as any)}
                  >
                    Celebrate Growth ✨
                  </motion.button>
                )}
              </div>
            ))}
          </div>

          {/* Motivational Footer */}
          <div style={{
            backgroundColor: '#f0f7ff',
            border: '2px solid #8ea876',
            borderRadius: '12px',
            padding: '1.5rem',
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌟</div>
            <p style={{
              color: '#2e2e2e',
              fontSize: '0.9rem',
              margin: '0 0 0.5rem 0',
              fontWeight: '600'
            }}>
              {selectedTreeData.completedLevels === 0 
                ? 'Your journey begins with a single step'
                : selectedTreeData.completedLevels === selectedTreeData.totalLevels
                ? `You've mastered the art of ${selectedTreeData.name.toLowerCase()}!`
                : `You're building your ${selectedTreeData.name.toLowerCase()} tree`
              }
            </p>
            <p style={{
              color: '#666',
              fontSize: '0.8rem',
              margin: 0
            }}>
              {isCrisisMode 
                ? 'Every step forward matters. You\'re doing great.' 
                : 'Badges aren\'t about perfection. They\'re about showing up.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}