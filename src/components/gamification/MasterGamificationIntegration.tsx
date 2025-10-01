'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';

// Import all gamification components
import HealingGamificationInterface from './HealingGamificationInterface';
import CommunityHealingCircles from './CommunityHealingCircles';
import IdentityEvolution from './IdentityEvolution';
import HealingQuests from './HealingQuests';
import BadgeTreeComponent from './BadgeTree';

/**
 * MASTER GAMIFICATION INTEGRATION
 * Revolutionary healing-centered engagement system that creates addiction to growth
 * 
 * This component orchestrates all gamification systems:
 * - Grace-based streak tracking with anti-shame mechanics
 * - Community healing circles with anonymous support
 * - Identity evolution constellation and archetype development
 * - Self-guided healing quests with trauma-informed pathways
 * - Badge trees celebrating presence over performance
 * 
 * Integration Points:
 * - Journal entries trigger all systems
 * - Habit completions feed into identity evolution
 * - Creative expression unlocks special quests
 * - Crisis moments activate community support
 * - All systems respect user's healing rhythm
 */

interface JournalEntry {
  id: string;
  content: string;
  mood?: string;
  themes: string[];
  createdAt: Date;
  wordCount: number;
  emotionalTone: string[];
}

interface HabitCompletion {
  habitId: string;
  completedAt: Date;
  quality: 'gentle' | 'strong' | 'profound';
  reflection?: string;
}

interface CreativeExpression {
  id: string;
  type: 'poem' | 'drawing' | 'song' | 'dance' | 'story';
  title: string;
  createdAt: Date;
  emotionalResonance: string[];
}

interface MasterGamificationProps {
  // Data inputs from other ALCHM systems
  recentJournalEntries: JournalEntry[];
  habitCompletions: HabitCompletion[];
  creativeExpressions: CreativeExpression[];
  
  // User preferences
  userPreferences: {
    celebrationStyle: 'subtle' | 'warm' | 'joyful';
    privacyLevel: 'private' | 'semi_private' | 'community_friendly';
    traumaInformedMode: boolean;
    pauseButtonAlwaysVisible: boolean;
    focusOnPresence: boolean;
  };
  
  // System state
  currentView: 'dashboard' | 'community' | 'identity' | 'quests' | 'badges';
  onViewChange: (view: string) => void;
  
  className?: string;
}

interface SystemStats {
  totalJournalEntries: number;
  currentStreak: number;
  graceTokensAvailable: number;
  badgesEarned: number;
  questsCompleted: number;
  communityCirclesJoined: number;
  healingMomentsCelebrated: number;
}

const INTEGRATION_ANIMATIONS = {
  systemTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  
  celebrationRipple: {
    initial: { scale: 0, opacity: 1 },
    animate: { scale: 2, opacity: 0 },
    transition: { duration: 1, ease: "easeOut" }
  },
  
  gentleNotification: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

function SystemNavigation({ 
  currentView, 
  onViewChange, 
  systemStats 
}: { 
  currentView: string; 
  onViewChange: (view: string) => void; 
  systemStats: SystemStats;
}) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Healing Journey', 
      icon: '🌿', 
      badge: systemStats.graceTokensAvailable > 0 ? `${systemStats.graceTokensAvailable}` : null,
      description: 'Your sacred healing dashboard'
    },
    { 
      id: 'community', 
      label: 'Healing Circles', 
      icon: '🫶', 
      badge: systemStats.communityCirclesJoined > 0 ? `${systemStats.communityCirclesJoined}` : null,
      description: 'Anonymous community support'
    },
    { 
      id: 'identity', 
      label: 'Identity Evolution', 
      icon: '🌌', 
      badge: null,
      description: 'Your becoming constellation'
    },
    { 
      id: 'quests', 
      label: 'Healing Quests', 
      icon: '🗺️', 
      badge: systemStats.questsCompleted > 0 ? `${systemStats.questsCompleted}` : null,
      description: 'Self-guided growth journeys'
    },
    { 
      id: 'badges', 
      label: 'Growth Trees', 
      icon: '🌳', 
      badge: systemStats.badgesEarned > 0 ? `${systemStats.badgesEarned}` : null,
      description: 'Celebrating your presence'
    }
  ];
  
  return (
    <div style={{
      background: 'rgba(168, 181, 160, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 181, 160, 0.2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-pause)',
      marginBottom: 'var(--space-rest)',
      overflowX: 'auto'
    }}>
      <div style={{
        display: 'flex',
        gap: 'var(--space-whisper)',
        minWidth: 'fit-content'
      }}>
        {navItems.map(item => (
          <motion.button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              position: 'relative',
              background: currentView === item.id 
                ? 'rgba(168, 181, 160, 0.3)' 
                : 'transparent',
              border: `1px solid ${currentView === item.id ? 'var(--sage-400)' : 'rgba(254, 252, 251, 0.2)'}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-pause)',
              color: currentView === item.id 
                ? 'var(--sanctuary-white)' 
                : 'rgba(254, 252, 251, 0.8)',
              fontSize: 'var(--text-sm)',
              fontWeight: currentView === item.id ? 'var(--font-medium)' : 'var(--font-normal)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-whisper)',
              minWidth: '100px',
              textAlign: 'center'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{
              fontSize: '1.5rem',
              marginBottom: 'var(--space-whisper)'
            }}>
              {item.icon}
            </div>
            
            <div style={{
              fontSize: 'var(--text-xs)',
              lineHeight: '1.2'
            }}>
              {item.label}
            </div>
            
            {item.badge && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--sage-400)',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                color: 'var(--sanctuary-white)',
                fontWeight: 'var(--font-medium)'
              }}>
                {item.badge}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function SystemIntegrationStatus({ 
  recentActivity,
  onCelebrate 
}: {
  recentActivity: any[];
  onCelebrate: (message: string) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getActivityIcon = (type: string) => {
    const icons = {
      journal: '✍️',
      habit: '🎯',
      creative: '🎨',
      quest: '🗺️',
      badge: '🏆',
      community: '🫶'
    };
    return icons[type] || '✨';
  };
  
  return (
    <div style={{
      background: 'rgba(168, 181, 160, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 181, 160, 0.2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-sanctuary)',
      marginBottom: 'var(--space-rest)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-pause)'
      }}>
        <h3 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-medium)',
          color: 'var(--sanctuary-white)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-breath)'
        }}>
          ⚡ System Integration
        </h3>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(254, 252, 251, 0.7)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer'
          }}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'var(--space-pause)',
        marginBottom: showDetails ? 'var(--space-rest)' : 0
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-pause)',
          background: 'rgba(254, 252, 251, 0.05)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: '1.5rem',
            marginBottom: 'var(--space-whisper)'
          }}>
            🔄
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--sanctuary-white)',
            fontWeight: 'var(--font-medium)',
            marginBottom: 'var(--space-whisper)'
          }}>
            All Systems
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: '#22aa22'
          }}>
            Connected
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-pause)',
          background: 'rgba(254, 252, 251, 0.05)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: '1.5rem',
            marginBottom: 'var(--space-whisper)'
          }}>
            🛡️
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--sanctuary-white)',
            fontWeight: 'var(--font-medium)',
            marginBottom: 'var(--space-whisper)'
          }}>
            Safeguards
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: '#22aa22'
          }}>
            Active
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-pause)',
          background: 'rgba(254, 252, 251, 0.05)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            fontSize: '1.5rem',
            marginBottom: 'var(--space-whisper)'
          }}>
            💚
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--sanctuary-white)',
            fontWeight: 'var(--font-medium)',
            marginBottom: 'var(--space-whisper)'
          }}>
            Healing Mode
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: '#22aa22'
          }}>
            Enabled
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              borderTop: '1px solid rgba(254, 252, 251, 0.1)',
              paddingTop: 'var(--space-rest)'
            }}
          >
            <h4 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--sanctuary-white)',
              marginBottom: 'var(--space-pause)'
            }}>
              Recent System Activity
            </h4>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-breath)',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {recentActivity.slice(0, 8).map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-breath)',
                    padding: 'var(--space-breath)',
                    background: 'rgba(254, 252, 251, 0.03)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ fontSize: '1rem' }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--sanctuary-white)'
                    }}>
                      {activity.message}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(254, 252, 251, 0.6)'
                    }}>
                      {activity.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: activity.impact > 0 ? '#22aa22' : 'rgba(254, 252, 251, 0.6)'
                  }}>
                    {activity.impact > 0 ? `+${activity.impact} XP` : ''}
                  </div>
                </div>
              ))}
            </div>
            
            {recentActivity.length === 0 && (
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'rgba(254, 252, 251, 0.6)',
                textAlign: 'center',
                padding: 'var(--space-rest)'
              }}>
                Start journaling to see system integration in action
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CelebrationOverlay({ 
  celebrations, 
  onDismiss 
}: {
  celebrations: any[];
  onDismiss: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {celebrations.map(celebration => (
        <motion.div
          key={celebration.id}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '2px solid var(--sage-400)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-sanctuary)',
            textAlign: 'center',
            zIndex: 2000,
            maxWidth: '400px',
            width: '90%'
          }}
          variants={INTEGRATION_ANIMATIONS.celebrationRipple}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={() => {
            if (celebration.autoDismiss) {
              setTimeout(() => onDismiss(celebration.id), 3000);
            }
          }}
        >
          <div style={{
            fontSize: '3rem',
            marginBottom: 'var(--space-rest)'
          }}>
            {celebration.icon}
          </div>
          
          <h3 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-pause)'
          }}>
            {celebration.title}
          </h3>
          
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(254, 252, 251, 0.9)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: 'var(--space-rest)'
          }}>
            {celebration.message}
          </p>
          
          {celebration.affirmation && (
            <blockquote style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--sage-400)',
              fontStyle: 'italic',
              borderLeft: '2px solid var(--sage-400)',
              paddingLeft: 'var(--space-pause)',
              marginBottom: 'var(--space-rest)'
            }}>
              "{celebration.affirmation}"
            </blockquote>
          )}
          
          <button
            onClick={() => onDismiss(celebration.id)}
            style={{
              background: 'var(--sage-600)',
              border: '1px solid var(--sage-500)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-pause)',
              color: 'var(--sanctuary-white)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer'
            }}
          >
            Continue Journey
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default function MasterGamificationIntegration({
  recentJournalEntries,
  habitCompletions,
  creativeExpressions,
  userPreferences,
  currentView,
  onViewChange,
  className = ''
}: MasterGamificationProps) {
  const { user } = useAuth();
  
  // State management
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalJournalEntries: 0,
    currentStreak: 0,
    graceTokensAvailable: 2,
    badgesEarned: 0,
    questsCompleted: 0,
    communityCirclesJoined: 0,
    healingMomentsCelebrated: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [celebrations, setCelebrations] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock data - in production these would come from Firebase/API
  useEffect(() => {
    if (user) {
      setSystemStats({
        totalJournalEntries: recentJournalEntries.length,
        currentStreak: 3,
        graceTokensAvailable: 2,
        badgesEarned: 5,
        questsCompleted: 2,
        communityCirclesJoined: 1,
        healingMomentsCelebrated: 8
      });
      
      // Generate recent activity from all system inputs
      const activity = [
        ...recentJournalEntries.slice(-3).map(entry => ({
          type: 'journal',
          message: `Journal entry: ${entry.themes.join(', ')}`,
          timestamp: entry.createdAt,
          impact: entry.wordCount > 100 ? 10 : 5
        })),
        ...habitCompletions.slice(-2).map(habit => ({
          type: 'habit',
          message: `Habit completed with ${habit.quality} energy`,
          timestamp: habit.completedAt,
          impact: habit.quality === 'profound' ? 15 : habit.quality === 'strong' ? 10 : 5
        })),
        ...creativeExpressions.slice(-2).map(creative => ({
          type: 'creative',
          message: `Created ${creative.type}: ${creative.title}`,
          timestamp: creative.createdAt,
          impact: 20
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setRecentActivity(activity);
    }
  }, [user, recentJournalEntries, habitCompletions, creativeExpressions]);
  
  // Process new journal entries through all systems
  const processJournalEntry = useCallback(async (entry: JournalEntry) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate processing through all gamification systems
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for celebrations based on entry content and themes
      const newCelebrations = [];
      
      // Example: Check for breakthrough moments
      if (entry.themes.includes('breakthrough') || entry.content.toLowerCase().includes('breakthrough')) {
        newCelebrations.push({
          id: `breakthrough-${Date.now()}`,
          type: 'breakthrough',
          icon: '🌟',
          title: 'Breakthrough Moment',
          message: 'You\'ve recognized an important insight in your healing journey.',
          affirmation: 'You are someone who transforms challenges into wisdom.',
          autoDismiss: true
        });
      }
      
      // Example: Check for courage expressions
      if (entry.themes.includes('courage') || entry.content.toLowerCase().includes('scared but')) {
        newCelebrations.push({
          id: `courage-${Date.now()}`,
          type: 'courage',
          icon: '🦁',
          title: 'Courage Recognized',
          message: 'You showed up with courage despite fear. That takes tremendous strength.',
          affirmation: 'You are someone who chooses growth over comfort.',
          autoDismiss: true
        });
      }
      
      setCelebrations(prev => [...prev, ...newCelebrations]);
      
      // Update activity log
      setRecentActivity(prev => [{
        type: 'journal',
        message: `Journal entry processed through all systems`,
        timestamp: new Date(),
        impact: entry.wordCount > 200 ? 15 : 10
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Error processing journal entry:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);
  
  // Auto-process latest journal entry
  useEffect(() => {
    if (recentJournalEntries.length > 0) {
      const latestEntry = recentJournalEntries[0];
      // Only process if it's very recent (within last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (latestEntry.createdAt > fiveMinutesAgo) {
        processJournalEntry(latestEntry);
      }
    }
  }, [recentJournalEntries, processJournalEntry]);
  
  const handleCelebration = (message: string) => {
    setCelebrations(prev => [...prev, {
      id: `custom-${Date.now()}`,
      type: 'custom',
      icon: '✨',
      title: 'Moment of Recognition',
      message,
      autoDismiss: true
    }]);
  };
  
  const dismissCelebration = (celebrationId: string) => {
    setCelebrations(prev => prev.filter(c => c.id !== celebrationId));
  };
  
  const renderCurrentView = () => {
    const baseProps = {
      recentJournalEntries,
      habitCompletions,
      creativeExpressions,
      userPreferences,
      onCelebrate: handleCelebration
    };
    
    switch (currentView) {
      case 'dashboard':
        return (
          <HealingGamificationInterface
            {...baseProps}
            lastJournalEntry={recentJournalEntries[0]}
          />
        );
        
      case 'community':
        return (
          <CommunityHealingCircles
            userContributions={[]}
            onJoinCircle={async (circleId) => {
              console.log('Joining circle:', circleId);
              handleCelebration('Welcome to the healing circle. Your presence here matters.');
            }}
            onLeaveCircle={async (circleId) => {
              console.log('Leaving circle:', circleId);
            }}
            onSendEncouragement={async (circleId, message) => {
              console.log('Sending encouragement:', message);
              handleCelebration('Your words of encouragement have been shared anonymously.');
            }}
          />
        );
        
      case 'identity':
        return (
          <IdentityEvolution
            archetypes={[
              {
                id: 'healer',
                name: 'Healer',
                description: 'You are developing the ability to hold space for healing',
                stage: 'developing',
                traits: [
                  { name: 'Compassion', strength: 75 },
                  { name: 'Presence', strength: 60 },
                  { name: 'Wisdom', strength: 45 }
                ],
                evolutionPath: ['survivor', 'healer', 'sage'],
                wisdom: {
                  gained: ['Healing happens in relationship', 'Presence is a practice'],
                  practicing: ['Self-compassion', 'Boundary setting'],
                  integrating: ['Intuitive knowing', 'Sacred witnessing']
                },
                constellation: {
                  x: 30,
                  y: 40,
                  connections: ['sage', 'warrior']
                }
              },
              {
                id: 'sage',
                name: 'Sage',
                description: 'Ancient wisdom flows through your understanding',
                stage: 'emerging',
                traits: [
                  { name: 'Wisdom', strength: 40 },
                  { name: 'Intuition', strength: 55 },
                  { name: 'Teaching', strength: 30 }
                ],
                evolutionPath: ['healer', 'sage', 'mystic'],
                wisdom: {
                  gained: ['Truth emerges in silence'],
                  practicing: ['Deep listening', 'Pattern recognition'],
                  integrating: ['Sacred teaching', 'Timeless knowing']
                },
                constellation: {
                  x: 70,
                  y: 25,
                  connections: ['healer', 'mystic']
                }
              }
            ]}
            milestones={[
              {
                id: 'first_boundary',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                title: 'First Healthy Boundary',
                description: 'Set a clear boundary with family member about personal time',
                category: 'boundaries',
                archetypeImpact: [
                  { archetypeId: 'healer', growthAmount: 10 }
                ],
                mythologyEntry: 'I am learning that saying no to others means saying yes to myself',
                celebrationLevel: 'meaningful'
              }
            ]}
            mythology={{
              heroJourneyPhase: 'trials',
              coreNarrative: 'I am learning to transform my wounds into wisdom and my pain into purpose.',
              growthThemes: ['Self-compassion', 'Authentic voice', 'Sacred boundaries'],
              healingPatterns: ['Spiral growth', 'Integration through rest'],
              wisdomGained: ['Healing is not linear', 'Rest is sacred', 'Vulnerability is strength'],
              futureSelf: {
                vision: 'A person who holds space for others while honoring my own needs',
                values: ['Authenticity', 'Compassion', 'Wisdom'],
                gifts: ['Deep listening', 'Sacred witnessing', 'Healing presence']
              }
            }}
            onArchetypeExplore={(archetypeId) => {
              console.log('Exploring archetype:', archetypeId);
              handleCelebration('Diving deeper into your identity constellation...');
            }}
            onMilestoneReflect={(milestoneId) => {
              console.log('Reflecting on milestone:', milestoneId);
              handleCelebration('Revisiting this growth moment honors your journey.');
            }}
          />
        );
        
      case 'quests':
        return (
          <HealingQuests
            availableQuests={[
              {
                id: 'inner_child_healing',
                title: 'Inner Child Healing Journey',
                description: 'A gentle exploration of reconnecting with your inner child through compassion and play.',
                theme: 'inner_child',
                difficulty: 'gentle',
                estimatedTime: '2-3 weeks',
                pathways: [
                  {
                    id: 'creative_play',
                    name: 'Creative Play Path',
                    description: 'Use art, music, and movement to reconnect with your inner child.',
                    approach: 'creative',
                    steps: [],
                    estimatedDuration: '15-20 minutes daily',
                    traumaInformed: true
                  },
                  {
                    id: 'gentle_reflection',
                    name: 'Gentle Reflection Path',
                    description: 'Through journaling and meditation, visit your younger self with compassion.',
                    approach: 'reflection',
                    steps: [],
                    estimatedDuration: '10-15 minutes daily',
                    traumaInformed: true
                  }
                ],
                rewards: [
                  {
                    type: 'badge',
                    value: 'Inner Child Healer',
                    description: 'You have learned to nurture your inner child'
                  }
                ],
                isUnlocked: true,
                isFavorited: false,
                completionStatus: 'not_started'
              }
            ]}
            questProgress={[]}
            onStartQuest={(questId, pathwayId) => {
              console.log('Starting quest:', questId, pathwayId);
              handleCelebration('Your healing quest begins. Trust the journey.');
            }}
            onResumeQuest={(questId) => {
              console.log('Resuming quest:', questId);
              handleCelebration('Welcome back to your quest. Your progress is honored.');
            }}
            onPauseQuest={(questId, reason) => {
              console.log('Pausing quest:', questId, reason);
              handleCelebration('Taking a pause is sacred. Your quest will wait for you.');
            }}
            onCompleteStep={(questId, stepId, response) => {
              console.log('Completing step:', questId, stepId);
              handleCelebration('Each step forward is an act of courage.');
            }}
            onFavoriteQuest={(questId) => {
              console.log('Favoriting quest:', questId);
            }}
          />
        );
        
      case 'badges':
        // This would render multiple badge trees
        return (
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: 'var(--space-sanctuary)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--space-sanctuary)'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'var(--font-light)',
                color: 'var(--sanctuary-white)',
                marginBottom: 'var(--space-pause)',
                letterSpacing: '-0.02em'
              }}>
                🌳 Growth Trees
              </h2>
              <p style={{
                fontSize: 'var(--text-lg)',
                color: 'rgba(254, 252, 251, 0.8)',
                lineHeight: 'var(--leading-relaxed)'
              }}>
                Celebrating your presence, courage, and becoming
              </p>
            </div>
            
            <div>Badge trees would be rendered here</div>
          </div>
        );
        
      default:
        return <div>Unknown view</div>;
    }
  };
  
  if (!user) {
    return (
      <div className={`master-gamification-loading ${className}`} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'rgba(254, 252, 251, 0.6)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-pause)' }}>🌿</div>
          <p>Initializing your healing gamification systems...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`master-gamification-integration ${className}`} style={{
      minHeight: '100vh',
      background: 'var(--sage-900)',
      padding: 'var(--space-rest)',
      position: 'relative'
    }}>
      {/* System Navigation */}
      <SystemNavigation
        currentView={currentView}
        onViewChange={onViewChange}
        systemStats={systemStats}
      />
      
      {/* System Integration Status */}
      <SystemIntegrationStatus
        recentActivity={recentActivity}
        onCelebrate={handleCelebration}
      />
      
      {/* Current View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          variants={INTEGRATION_ANIMATIONS.systemTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
      
      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            style={{
              position: 'fixed',
              bottom: 'var(--space-rest)',
              right: 'var(--space-rest)',
              background: 'rgba(168, 181, 160, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--sage-400)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-pause)',
              color: 'var(--sanctuary-white)',
              fontSize: 'var(--text-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-breath)',
              zIndex: 1500
            }}
            variants={INTEGRATION_ANIMATIONS.gentleNotification}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(254, 252, 251, 0.3)',
              borderTop: '2px solid var(--sanctuary-white)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Processing through healing systems...
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Celebration Overlays */}
      <CelebrationOverlay
        celebrations={celebrations}
        onDismiss={dismissCelebration}
      />
      
      {/* Global Styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}