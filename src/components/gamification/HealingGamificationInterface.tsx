'use client';

/**
 * HEALING GAMIFICATION INTERFACE - JONY IVE INSPIRED
 * "Simplicity is the ultimate sophistication. Healing deserves beautiful design."
 * 
 * Revolutionary Design Principles:
 * 🎨 Sage Green Ecosystem (#a4b792 family)
 * 🌊 Organic Animations (breathing, growing, flowing)
 * 🤲 Minimal Cognitive Load (purposeful white space)
 * 💫 Therapeutic Visual Language (no aggressive elements)
 * 🌱 Growth Metaphors (seeds, rivers, crystals)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';
import type { Badge, Streak, UserProfile } from '@/types/gamification';

interface HealingGamificationInterfaceProps {
  userProfile: UserProfile;
  currentStreak: Streak;
  recentBadges: Badge[];
  presenceScore: number;
  wisdomLevel: number;
  gentlePowerLevel: number;
  onPauseRequest: () => void;
  onGraceTokenUse: () => void;
  preferences: {
    celebrationStyle: 'subtle' | 'warm' | 'joyful';
    visualComplexity: 'minimal' | 'balanced' | 'rich';
    sageGreenIntensity: 'whisper' | 'embrace' | 'radiance';
  };
}

// Sage Green Ecosystem - Jony Ive inspired color system
const SAGE_PALETTE = {
  whisper: '#f4f6f2',      // Almost white, barely green
  breath: '#e8ede4',       // Soft background
  gentle: '#d4dbc9',       // Gentle accent
  presence: '#c0c9b4',     // Present moment
  wisdom: '#a4b792',       // Core sage - wisdom
  strength: '#8ea876',     // Gentle strength
  depth: '#7a9b69',        // Deep growth
  mystery: '#667a5c',      // Shadow work
  earth: '#4a5a44'         // Grounding
} as const;

// Healing Animation Variants
const healingAnimations = {
  gentle_breath: {
    initial: { scale: 1, opacity: 0.7 },
    animate: { 
      scale: [1, 1.02, 1], 
      opacity: [0.7, 0.9, 0.7] 
    },
    transition: { 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  },
  
  organic_growth: {
    initial: { scale: 0.95, y: 2 },
    animate: { 
      scale: [0.95, 1, 0.98, 1], 
      y: [2, 0, 1, 0] 
    },
    transition: { 
      duration: 6, 
      repeat: Infinity, 
      ease: [0.23, 1, 0.32, 1] 
    }
  },
  
  flowing_energy: {
    initial: { backgroundPosition: '0% 50%' },
    animate: { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] },
    transition: { 
      duration: 8, 
      repeat: Infinity, 
      ease: "linear" 
    }
  },
  
  crystallizing_wisdom: {
    initial: { rotate: 0, scale: 1 },
    animate: { 
      rotate: [0, 1, -1, 0], 
      scale: [1, 1.01, 0.99, 1] 
    },
    transition: { 
      duration: 5, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

export default function HealingGamificationInterface({
  lastJournalEntry,
  className = ''
}: HealingGamificationProps) {
  const { user } = useAuth();
  const [gamificationState, setGamificationState] = useState<HealingGamificationState | null>(null);
  const [responses, setResponses] = useState<GamificationResponse[]>([]);
  const [insights, setInsights] = useState<HealingJourneyInsight[]>([]);
  const [celebrationMoments, setCelebrationMoments] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock initial state - in production this would come from Firebase
  useEffect(() => {
    if (user) {
      const mockState: HealingGamificationState = {
        streakData: {
          currentStreak: 3,
          longestStreak: 7,
          graceTokens: 2,
          graceTokenRenewalDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          recoveryMultiplier: 1,
          totalEntries: 12,
          lastEntryDate: new Date()
        },
        availableQuests: [],
        questProgress: [],
        badgeTrees: [
          {
            id: 'presence',
            name: 'Presence Tree',
            description: 'Celebrating the courage to show up',
            philosophy: 'Your presence is a gift to your healing journey',
            stages: [
              {
                id: 'still_here_1',
                name: 'Still Here I',
                description: 'You showed up when it mattered',
                icon: '🌱',
                rarity: 'common',
                stage: { name: 'Seedling', level: 1 },
                requirements: { totalReflections: 1 },
                unlockedAt: new Date()
              },
              {
                id: 'still_here_2',
                name: 'Still Here II',
                description: 'Consistency is becoming sacred',
                icon: '🌿',
                rarity: 'meaningful',
                stage: { name: 'Growth', level: 2 },
                requirements: { totalReflections: 5 }
              }
            ]
          }
        ],
        unlockedBadges: [],
        pendingEvolutions: [],
        activeChallenges: [
          {
            id: 'boundaries_szn',
            name: 'Boundaries Season',
            description: 'A gentle exploration of healthy boundaries in relationships and self-care',
            totalParticipants: 127,
            category: 'boundaries'
          }
        ],
        communityParticipation: [],
        archetypeProfile: {
          preferredArchetypes: ['sage', 'coach'],
          recentInteractions: [],
          traumaInformedSettings: {
            gentleApproach: true,
            crisisDetection: true,
            autonomyRespect: true
          }
        },
        healingJourneyPhase: {
          phase: 'deepening',
          description: 'Building consistent healing practices',
          focusAreas: ['presence', 'self_compassion', 'boundaries'],
          availableFeatures: [],
          protectionsActive: ['grace_tokens', 'pause_buttons', 'anonymous_community']
        },
        antiManipulationSafeguards: {
          streakProtection: true,
          questEscapeHatches: true,
          badgeNonCompetitive: true,
          communityAnonymous: true,
          archetypeConsent: true
        },
        purposeResume: []
      };
      
      setGamificationState(mockState);
    }
  }, [user]);

  // Process journal entry when it changes
  useEffect(() => {
    if (lastJournalEntry && gamificationState && !isProcessing) {
      setIsProcessing(true);
      
      const entryContext: JournalEntryContext = {
        content: lastJournalEntry.content,
        mood: lastJournalEntry.mood,
        timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'evening' : 'late_night',
        wordCount: lastJournalEntry.content.split(' ').length,
        emotionalTone: lastJournalEntry.themes || [],
        themes: lastJournalEntry.themes || []
      };
      
      // Simulate processing - in production this would be async
      setTimeout(async () => {
        try {
          const result = await HealingGamificationEngine.processJournalEntry(
            user?.uid || '',
            entryContext,
            gamificationState
          );
          
          setGamificationState(result.updatedState);
          setResponses(result.responses);
          setInsights(result.insights);
          setCelebrationMoments(result.celebrationMoments);
        } catch (error) {
          console.error('Error processing journal entry:', error);
        } finally {
          setIsProcessing(false);
        }
      }, 1000);
    }
  }, [lastJournalEntry, gamificationState, user, isProcessing]);

  if (!user || !gamificationState) {
    return (
      <div className={`healing-gamification-loading ${className}`} style={{
        padding: 'var(--space-sanctuary)',
        textAlign: 'center',
        color: 'rgba(254, 252, 251, 0.6)'
      }}>
        <div style={{ marginBottom: 'var(--space-pause)' }}>🌿</div>
        <p>Preparing your healing journey...</p>
      </div>
    );
  }

  const handleBadgeEvolution = (badge: any, celebration: any) => {
    // Handle badge evolution
    setCelebrationMoments(prev => [...prev, celebration]);
  };

  const handleJoinChallenge = (challengeId: string) => {
    // Handle joining community challenge
    console.log('Joining challenge:', challengeId);
  };

  const handleUseGrace = () => {
    if (gamificationState.streakData.graceTokens > 0) {
      setGamificationState(prev => prev ? {
        ...prev,
        streakData: {
          ...prev.streakData,
          graceTokens: prev.streakData.graceTokens - 1
        }
      } : null);
    }
  };

  // Determine sage green intensity based on user preference
  const getSageColor = (intensity: 'light' | 'medium' | 'deep') => {
    const baseIntensity = preferences.sageGreenIntensity;
    
    if (baseIntensity === 'whisper') {
      return {
        light: SAGE_PALETTE.breath,
        medium: SAGE_PALETTE.gentle,
        deep: SAGE_PALETTE.presence
      }[intensity];
    } else if (baseIntensity === 'embrace') {
      return {
        light: SAGE_PALETTE.presence,
        medium: SAGE_PALETTE.wisdom,
        deep: SAGE_PALETTE.strength
      }[intensity];
    } else {
      return {
        light: SAGE_PALETTE.wisdom,
        medium: SAGE_PALETTE.strength,
        deep: SAGE_PALETTE.depth
      }[intensity];
    }
  };

  // Get healing message based on current state
  const getHealingMessage = () => {
    if (currentStreak.streakFrozen) {
      return "Rest is sacred. Your healing continues in stillness.";
    } else if (currentStreak.recoveryMultiplierUntil) {
      return "Welcome back. Your return is celebrated with gentle bonus energy.";
    } else {
      return `Presence day ${currentStreak.current}. Your journey of becoming continues.`;
    }
  };

  // Render Grace Tokens with Jony Ive minimalism
  const renderGraceTokens = () => {
    if (!graceTokensVisible) return null;

    return (
      <motion.div
        className="grace-tokens-container"
        variants={healingAnimations.gentle_breath}
        initial="initial"
        animate="animate"
        style={{
          background: getSageColor('light'),
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: `1px solid ${getSageColor('medium')}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle flowing background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${getSageColor('light')} 0%, ${getSageColor('medium')}20 100%)`,
            opacity: 0.3,
            zIndex: 0
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '500',
              color: getSageColor('deep'),
              margin: 0
            }}>
              Grace Available
            </h3>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              {[0, 1].map(i => (
                <motion.div
                  key={i}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: i < currentStreak.graceTokens 
                      ? getSageColor('deep') 
                      : SAGE_PALETTE.gentle,
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>
          </div>
          
          <p style={{
            fontSize: '0.9rem',
            color: SAGE_PALETTE.mystery,
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            {currentStreak.graceTokens === 2 
              ? "You have full grace available. Self-compassion is always an option."
              : currentStreak.graceTokens === 1 
              ? "One grace token remains. Use it wisely and without guilt."
              : "Grace tokens renew Monday. You are still worthy of compassion."
            }
          </p>
          
          {currentStreak.graceTokens > 0 && (
            <motion.button
              style={{
                background: 'transparent',
                border: `1px solid ${getSageColor('medium')}`,
                borderRadius: '8px',
                padding: '8px 16px',
                color: getSageColor('deep'),
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              whileHover={{ 
                backgroundColor: getSageColor('medium'),
                scale: 1.02
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onGraceTokenUse}
            >
              Use Grace Token
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  // Render Presence Dashboard with organic growth metaphor
  const renderPresenceDashboard = () => {
    return (
      <motion.div
        className="presence-dashboard"
        variants={healingAnimations.organic_growth}
        initial="initial"
        animate="animate"
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '24px',
          border: `2px solid ${getSageColor('light')}`,
          boxShadow: `0 4px 20px ${getSageColor('light')}40`
        }}
      >
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          {/* Organic presence visualization */}
          <motion.div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${getSageColor('medium')} 0%, ${getSageColor('light')} 100%)`,
              margin: '0 auto 16px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
            variants={healingAnimations.gentle_breath}
            initial="initial"
            animate="animate"
          >
            {/* Inner presence indicator */}
            <div style={{
              width: `${Math.max(20, presenceScore)}%`,
              height: `${Math.max(20, presenceScore)}%`,
              borderRadius: '50%',
              background: getSageColor('deep'),
              opacity: 0.8
            }} />
            
            {/* Gentle ripple effect */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: `2px solid ${getSageColor('medium')}`,
              borderRadius: '50%',
              opacity: 0.3,
              animation: 'gentle-pulse 3s ease-in-out infinite'
            }} />
          </motion.div>
          
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '300',
            color: getSageColor('deep'),
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em'
          }}>
            {currentStreak.streakFrozen ? 'Sacred Pause' : `${currentStreak.current} Days`}
          </h2>
          
          <p style={{
            fontSize: '1rem',
            color: SAGE_PALETTE.mystery,
            margin: 0,
            fontWeight: '400'
          }}>
            {getHealingMessage()}
          </p>
        </div>

        {/* Healing progress indicators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: getSageColor('deep'),
              marginBottom: '4px'
            }}>
              {presenceScore}%
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: SAGE_PALETTE.mystery,
              opacity: 0.8
            }}>
              Presence Quality
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: getSageColor('deep'),
              marginBottom: '4px'
            }}>
              {wisdomLevel}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: SAGE_PALETTE.mystery,
              opacity: 0.8
            }}>
              Wisdom Level
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: getSageColor('deep'),
              marginBottom: '4px'
            }}>
              {gentlePowerLevel}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: SAGE_PALETTE.mystery,
              opacity: 0.8
            }}>
              Gentle Power
            </div>
          </div>
        </div>

        {/* Pause button - always visible for trauma-informed design */}
        <motion.button
          style={{
            width: '100%',
            background: 'transparent',
            border: `1px solid ${getSageColor('medium')}`,
            borderRadius: '12px',
            padding: '12px',
            marginTop: '20px',
            color: getSageColor('deep'),
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          whileHover={{ 
            backgroundColor: getSageColor('light'),
            scale: 1.01
          }}
          whileTap={{ scale: 0.99 }}
          onClick={onPauseRequest}
        >
          <span style={{ fontSize: '1.1rem' }}>🤗</span>
          I need a gentle pause
        </motion.button>
      </motion.div>
    );
  };

  // Render Badge Trees with organic growth visualization
  const renderBadgeTrees = () => {
    const trees = [
      { 
        name: 'Still Here', 
        description: 'Presence Tree',
        color: getSageColor('medium'),
        progress: 40,
        icon: '🌱'
      },
      { 
        name: 'Chaos → Clarity', 
        description: 'Insight Tree',
        color: SAGE_PALETTE.wisdom,
        progress: 25,
        icon: '🧠'
      },
      { 
        name: 'Soft but Strong', 
        description: 'Resilience Tree',
        color: getSageColor('deep'),
        progress: 60,
        icon: '💪'
      }
    ];

    return (
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '24px',
        border: `2px solid ${getSageColor('light')}`,
        boxShadow: `0 4px 20px ${getSageColor('light')}40`
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '500',
          color: getSageColor('deep'),
          margin: '0 0 24px 0',
          textAlign: 'center'
        }}>
          Sacred Growth Trees
        </h3>

        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {trees.map((tree, index) => (
            <motion.div
              key={tree.name}
              style={{
                background: `${tree.color}10`,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${tree.color}40`,
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{tree.icon}</span>
                  <div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: tree.color,
                      marginBottom: '2px'
                    }}>
                      {tree.name}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: SAGE_PALETTE.mystery,
                      opacity: 0.7
                    }}>
                      {tree.description}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  fontSize: '0.9rem',
                  color: tree.color,
                  fontWeight: '500'
                }}>
                  {tree.progress}%
                </div>
              </div>
              
              {/* Organic progress visualization */}
              <div style={{
                height: '4px',
                background: `${tree.color}20`,
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: tree.color,
                    borderRadius: '2px',
                    width: `${tree.progress}%`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${tree.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Render recent celebrations with healing aesthetics
  const renderRecentCelebrations = () => {
    if (recentBadges.length === 0) return null;

    return (
      <motion.div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '24px',
          border: `2px solid ${getSageColor('light')}`,
          boxShadow: `0 4px 20px ${getSageColor('light')}40`
        }}
        variants={healingAnimations.gentle_breath}
        initial="initial"
        animate="animate"
      >
        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '500',
          color: getSageColor('deep'),
          margin: '0 0 20px 0',
          textAlign: 'center'
        }}>
          Recent Growth Celebrations
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {recentBadges.slice(0, 3).map((badge, index) => (
            <motion.div
              key={badge.key}
              style={{
                background: `${getSageColor('medium')}15`,
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${getSageColor('medium')}30`
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: getSageColor('medium'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  ✨
                </div>
                
                <div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: getSageColor('deep'),
                    marginBottom: '2px'
                  }}>
                    {badge.name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: SAGE_PALETTE.mystery,
                    opacity: 0.8
                  }}>
                    {badge.healingMessage || badge.description}
                  </div>
                </div>
              </div>
              
              {badge.identityAffirmation && (
                <div style={{
                  fontSize: '0.85rem',
                  color: getSageColor('deep'),
                  fontStyle: 'italic',
                  padding: '8px 12px',
                  background: 'white',
                  borderRadius: '8px',
                  border: `1px solid ${getSageColor('light')}`
                }}>
                  "{badge.identityAffirmation}"
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: SAGE_PALETTE.whisper,
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes gentle-pulse {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        
        .grace-tokens-container {
          position: relative;
        }
        
        .grace-tokens-container::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(45deg, transparent, ${getSageColor('medium')}40, transparent);
          border-radius: 17px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .grace-tokens-container:hover::before {
          opacity: 1;
        }
      `}</style>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Header with healing intention */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          padding: '24px 0'
        }}>
          <motion.h1
            style={{
              fontSize: '2.2rem',
              fontWeight: '300',
              color: getSageColor('deep'),
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Healing Journey
          </motion.h1>
          
          <motion.p
            style={{
              fontSize: '1.1rem',
              color: SAGE_PALETTE.mystery,
              margin: 0,
              fontWeight: '400',
              opacity: 0.8
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Growth is sacred. Progress is not linear. You are exactly where you need to be.
          </motion.p>
        </div>

        {/* Core interface elements */}
        {renderGraceTokens()}
        {renderPresenceDashboard()}
        {renderBadgeTrees()}
        {renderRecentCelebrations()}

        {/* Footer with gentle reminder */}
        <div style={{
          textAlign: 'center',
          padding: '24px 0',
          borderTop: `1px solid ${getSageColor('light')}`,
          marginTop: '32px'
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: SAGE_PALETTE.mystery,
            margin: 0,
            opacity: 0.6,
            fontStyle: 'italic'
          }}>
            "The most revolutionary thing you can do is be gentle with yourself."
          </p>
        </div>
      </div>
    </div>
  );
}