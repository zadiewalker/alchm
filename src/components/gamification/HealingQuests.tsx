'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HEALING QUEST FRAMEWORK
 * Self-guided pathways for inner exploration and growth
 * 
 * Core Principles:
 * - No rigid requirements - only invitations
 * - Multiple valid approaches to each quest
 * - Always pauseable, always resumable
 * - Choose-your-own-adventure healing journeys
 * - Integration with journaling, habits, and creative expression
 * - Trauma-informed design throughout
 */

interface HealingQuest {
  id: string;
  title: string;
  description: string;
  theme: 'self_discovery' | 'healing_trauma' | 'building_boundaries' | 'finding_purpose' | 'cultivating_joy' | 'inner_child';
  difficulty: 'gentle' | 'moderate' | 'deep';
  estimatedTime: string;
  pathways: QuestPathway[];
  rewards: {
    type: 'badge' | 'insight' | 'tool' | 'celebration';
    value: string;
    description: string;
  }[];
  prerequisites?: string[];
  isUnlocked: boolean;
  isFavorited: boolean;
  completionStatus: 'not_started' | 'in_progress' | 'paused' | 'completed';
  personalNotes?: string;
}

interface QuestPathway {
  id: string;
  name: string;
  description: string;
  approach: 'journaling' | 'creative' | 'somatic' | 'reflection' | 'action' | 'ritual';
  steps: QuestStep[];
  estimatedDuration: string;
  traumaInformed: boolean;
}

interface QuestStep {
  id: string;
  title: string;
  instruction: string;
  type: 'prompt' | 'exercise' | 'reflection' | 'practice' | 'checkpoint';
  optional: boolean;
  helpText?: string;
  resources?: {
    type: 'video' | 'audio' | 'article' | 'guided_meditation';
    url: string;
    title: string;
  }[];
  adaptations: {
    forAnxiety: string;
    forDepression: string;
    forTrauma: string;
    forLowEnergy: string;
  };
  escapeHatch: {
    message: string;
    alternatives: string[];
  };
}

interface QuestProgress {
  questId: string;
  pathwayId: string;
  currentStepId: string;
  completedSteps: string[];
  responses: Record<string, string>;
  startedAt: Date;
  lastActivityAt: Date;
  pausedAt?: Date;
  pauseReason?: string;
  personalInsights: string[];
  celebrationMoments: {
    stepId: string;
    message: string;
    timestamp: Date;
  }[];
}

interface HealingQuestsProps {
  availableQuests: HealingQuest[];
  questProgress: QuestProgress[];
  onStartQuest: (questId: string, pathwayId: string) => void;
  onResumeQuest: (questId: string) => void;
  onPauseQuest: (questId: string, reason?: string) => void;
  onCompleteStep: (questId: string, stepId: string, response?: string) => void;
  onFavoriteQuest: (questId: string) => void;
  className?: string;
}

const QUEST_COLORS = {
  self_discovery: '#9370DB',    // Purple - introspection
  healing_trauma: '#228B22',    // Green - healing
  building_boundaries: '#8B4513', // Brown - earth/grounding
  finding_purpose: '#FFD700',   // Gold - illumination
  cultivating_joy: '#FF69B4',   // Pink - joy/love
  inner_child: '#87CEEB'        // Sky blue - playfulness
} as const;

const questAnimations = {
  questCard: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  pathwaySelect: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  },
  stepProgress: {
    initial: { width: 0 },
    animate: { width: '100%' },
    transition: { duration: 1, ease: "easeOut" }
  },
  celebration: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    exit: { scale: 0, rotate: 180 },
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

function QuestCard({ 
  quest, 
  progress, 
  onStart, 
  onResume, 
  onPause, 
  onFavorite 
}: {
  quest: HealingQuest;
  progress?: QuestProgress;
  onStart: (pathwayId: string) => void;
  onResume: () => void;
  onPause: (reason?: string) => void;
  onFavorite: () => void;
}) {
  const [showPathways, setShowPathways] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  
  const getThemeColor = (theme: string) => {
    return QUEST_COLORS[theme as keyof typeof QUEST_COLORS] || '#a4b792';
  };
  
  const getThemeIcon = (theme: string) => {
    const icons = {
      self_discovery: '🔍',
      healing_trauma: '🌿',
      building_boundaries: '🏔️',
      finding_purpose: '🌟',
      cultivating_joy: '🌈',
      inner_child: '🧸'
    };
    return icons[theme as keyof typeof icons] || '✨';
  };
  
  const getDifficultyInfo = (difficulty: string) => {
    const info = {
      gentle: { color: '#90EE90', text: 'Gentle exploration' },
      moderate: { color: '#FFD700', text: 'Moderate depth' },
      deep: { color: '#FF6347', text: 'Deep inner work' }
    };
    return info[difficulty as keyof typeof info] || info.gentle;
  };
  
  const getProgressPercentage = () => {
    if (!progress) return 0;
    const totalSteps = quest.pathways
      .find(p => p.id === progress.pathwayId)?.steps.length || 1;
    return (progress.completedSteps.length / totalSteps) * 100;
  };
  
  const handleStartQuest = (pathwayId: string) => {
    setSelectedPathway(pathwayId);
    onStart(pathwayId);
    setShowPathways(false);
  };
  
  return (
    <motion.div
      style={{
        background: 'rgba(168, 181, 160, 0.1)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${getThemeColor(quest.theme)}40`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-sanctuary)',
        marginBottom: 'var(--space-rest)',
        position: 'relative'
      }}
      variants={questAnimations.questCard}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.01 }}
    >
      {/* Quest Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-pause)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-pause)',
          flex: 1
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${getThemeColor(quest.theme)}, ${getThemeColor(quest.theme)}dd)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            {getThemeIcon(quest.theme)}
          </div>
          
          <div>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--sanctuary-white)',
              marginBottom: 'var(--space-whisper)'
            }}>
              {quest.title}
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-breath)',
              marginBottom: 'var(--space-whisper)'
            }}>
              <span style={{
                background: getDifficultyInfo(quest.difficulty).color + '20',
                color: getDifficultyInfo(quest.difficulty).color,
                border: `1px solid ${getDifficultyInfo(quest.difficulty).color}40`,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-whisper) var(--space-breath)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-medium)'
              }}>
                {getDifficultyInfo(quest.difficulty).text}
              </span>
              
              <span style={{
                fontSize: 'var(--text-xs)',
                color: 'rgba(254, 252, 251, 0.7)'
              }}>
                ~{quest.estimatedTime}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-breath)' }}>
          <button
            onClick={onFavorite}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              opacity: quest.isFavorited ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
          >
            {quest.isFavorited ? '⭐' : '☆'}
          </button>
          
          {progress?.pausedAt && (
            <div style={{
              background: 'rgba(255, 165, 0, 0.2)',
              border: '1px solid rgba(255, 165, 0, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-whisper) var(--space-breath)',
              fontSize: 'var(--text-xs)',
              color: '#FFA500'
            }}>
              Paused
            </div>
          )}
        </div>
      </div>
      
      {/* Quest Description */}
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'rgba(254, 252, 251, 0.9)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-rest)'
      }}>
        {quest.description}
      </p>
      
      {/* Progress Bar (if quest is in progress) */}
      {progress && (
        <div style={{ marginBottom: 'var(--space-rest)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-breath)'
          }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--sanctuary-white)',
              fontWeight: 'var(--font-medium)'
            }}>
              Progress: {Math.round(getProgressPercentage())}%
            </span>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(254, 252, 251, 0.7)'
            }}>
              {progress.completedSteps.length} steps completed
            </span>
          </div>
          
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(254, 252, 251, 0.2)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${getThemeColor(quest.theme)}, ${getThemeColor(quest.theme)}dd)`,
                width: `${getProgressPercentage()}%`
              }}
              variants={questAnimations.stepProgress}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>
      )}
      
      {/* Quest Actions */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-breath)',
        marginBottom: 'var(--space-pause)'
      }}>
        {quest.completionStatus === 'not_started' && (
          <button
            onClick={() => setShowPathways(true)}
            style={{
              flex: 1,
              background: getThemeColor(quest.theme),
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-pause)',
              color: 'var(--sanctuary-white)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Begin Quest
          </button>
        )}
        
        {quest.completionStatus === 'in_progress' && (
          <>
            <button
              onClick={onResume}
              style={{
                flex: 1,
                background: getThemeColor(quest.theme),
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-pause)',
                color: 'var(--sanctuary-white)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer'
              }}
            >
              Continue Quest
            </button>
            <button
              onClick={() => onPause()}
              style={{
                background: 'transparent',
                border: '1px solid rgba(254, 252, 251, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-pause)',
                color: 'rgba(254, 252, 251, 0.8)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer'
              }}
            >
              Pause
            </button>
          </>
        )}
        
        {quest.completionStatus === 'paused' && (
          <button
            onClick={onResume}
            style={{
              flex: 1,
              background: getThemeColor(quest.theme),
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-pause)',
              color: 'var(--sanctuary-white)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer'
            }}
          >
            Resume Quest
          </button>
        )}
        
        {quest.completionStatus === 'completed' && (
          <div style={{
            flex: 1,
            background: 'rgba(34, 139, 34, 0.2)',
            border: '1px solid rgba(34, 139, 34, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-pause)',
            textAlign: 'center',
            color: '#22aa22',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)'
          }}>
            ✨ Quest Complete ✨
          </div>
        )}
      </div>
      
      {/* Pathway Selection Modal */}
      <AnimatePresence>
        {showPathways && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--space-rest)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'var(--sage-800)',
                border: `1px solid ${getThemeColor(quest.theme)}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-sanctuary)',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
              variants={questAnimations.pathwaySelect}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h3 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--sanctuary-white)',
                marginBottom: 'var(--space-rest)',
                textAlign: 'center'
              }}>
                Choose Your Path
              </h3>
              
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'rgba(254, 252, 251, 0.8)',
                lineHeight: 'var(--leading-relaxed)',
                marginBottom: 'var(--space-rest)',
                textAlign: 'center'
              }}>
                Each path leads to the same destination through different approaches. 
                Choose what feels right for you today.
              </p>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-pause)'
              }}>
                {quest.pathways.map(pathway => (
                  <div
                    key={pathway.id}
                    style={{
                      background: 'rgba(254, 252, 251, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-pause)',
                      border: '1px solid rgba(254, 252, 251, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleStartQuest(pathway.id)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-pause)',
                      marginBottom: 'var(--space-breath)'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: getThemeColor(quest.theme),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem'
                      }}>
                        {pathway.approach === 'journaling' && '✍️'}
                        {pathway.approach === 'creative' && '🎨'}
                        {pathway.approach === 'somatic' && '🫁'}
                        {pathway.approach === 'reflection' && '🤔'}
                        {pathway.approach === 'action' && '🚀'}
                        {pathway.approach === 'ritual' && '🕯️'}
                      </div>
                      
                      <div>
                        <h4 style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-medium)',
                          color: 'var(--sanctuary-white)',
                          marginBottom: 'var(--space-whisper)'
                        }}>
                          {pathway.name}
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-breath)'
                        }}>
                          <span style={{
                            fontSize: 'var(--text-xs)',
                            color: 'rgba(254, 252, 251, 0.7)'
                          }}>
                            {pathway.estimatedDuration}
                          </span>
                          {pathway.traumaInformed && (
                            <span style={{
                              background: 'rgba(34, 139, 34, 0.2)',
                              color: '#22aa22',
                              border: '1px solid rgba(34, 139, 34, 0.3)',
                              borderRadius: 'var(--radius-sm)',
                              padding: 'var(--space-whisper)',
                              fontSize: 'var(--text-xs)'
                            }}>
                              Trauma-Informed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(254, 252, 251, 0.8)',
                      lineHeight: 'var(--leading-relaxed)'
                    }}>
                      {pathway.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 'var(--space-rest)'
              }}>
                <button
                  onClick={() => setShowPathways(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(254, 252, 251, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-pause)',
                    color: 'rgba(254, 252, 251, 0.8)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer'
                  }}
                >
                  Not today
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quest Rewards Preview */}
      {quest.rewards.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(254, 252, 251, 0.1)',
          paddingTop: 'var(--space-pause)',
          fontSize: 'var(--text-xs)',
          color: 'rgba(254, 252, 251, 0.7)'
        }}>
          <div style={{ marginBottom: 'var(--space-whisper)' }}>
            Quest rewards:
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-whisper)'
          }}>
            {quest.rewards.map((reward, index) => (
              <span
                key={index}
                style={{
                  background: 'rgba(254, 252, 251, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-whisper)',
                  fontSize: 'var(--text-xs)'
                }}
              >
                {reward.type === 'badge' && '🏆'} 
                {reward.type === 'insight' && '💡'} 
                {reward.type === 'tool' && '🛠️'} 
                {reward.type === 'celebration' && '🎉'} 
                {reward.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function HealingQuests({
  availableQuests,
  questProgress,
  onStartQuest,
  onResumeQuest,
  onPauseQuest,
  onCompleteStep,
  onFavoriteQuest,
  className = ''
}: HealingQuestsProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Filter quests based on current selection
  const filteredQuests = availableQuests.filter(quest => {
    if (showFavoritesOnly && !quest.isFavorited) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress') return quest.completionStatus === 'in_progress';
    if (activeFilter === 'completed') return quest.completionStatus === 'completed';
    return quest.theme === activeFilter;
  });
  
  // Group quests by status for better organization
  const questsByStatus = {
    in_progress: filteredQuests.filter(q => q.completionStatus === 'in_progress'),
    paused: filteredQuests.filter(q => q.completionStatus === 'paused'),
    not_started: filteredQuests.filter(q => q.completionStatus === 'not_started'),
    completed: filteredQuests.filter(q => q.completionStatus === 'completed')
  };
  
  return (
    <div className={`healing-quests ${className}`} style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'var(--space-sanctuary)'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-sanctuary)'
      }}>
        <motion.h2
          style={{
            fontSize: '2.5rem',
            fontWeight: 'var(--font-light)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-pause)',
            letterSpacing: '-0.02em'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🗺️ Healing Quests
        </motion.h2>
        
        <motion.p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(254, 252, 251, 0.8)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '600px',
            margin: '0 auto'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Self-guided journeys of exploration and growth. Choose your own path, 
          pause anytime, and discover what wants to emerge.
        </motion.p>
      </div>
      
      {/* Filter Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-breath)',
        justifyContent: 'center',
        marginBottom: 'var(--space-sanctuary)',
        padding: 'var(--space-rest)',
        background: 'rgba(168, 181, 160, 0.1)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {[
          { id: 'all', label: 'All Quests', icon: '🗺️' },
          { id: 'in_progress', label: 'In Progress', icon: '🏃‍♀️' },
          { id: 'self_discovery', label: 'Self Discovery', icon: '🔍' },
          { id: 'healing_trauma', label: 'Healing', icon: '🌿' },
          { id: 'building_boundaries', label: 'Boundaries', icon: '🏔️' },
          { id: 'finding_purpose', label: 'Purpose', icon: '🌟' },
          { id: 'completed', label: 'Completed', icon: '✅' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            style={{
              background: activeFilter === filter.id 
                ? 'var(--sage-600)' 
                : 'transparent',
              border: `1px solid ${activeFilter === filter.id ? 'var(--sage-500)' : 'rgba(254, 252, 251, 0.3)'}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-breath) var(--space-pause)',
              color: activeFilter === filter.id 
                ? 'var(--sanctuary-white)' 
                : 'rgba(254, 252, 251, 0.8)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-whisper)'
            }}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
        
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{
            background: showFavoritesOnly 
              ? 'var(--sage-600)' 
              : 'transparent',
            border: `1px solid ${showFavoritesOnly ? 'var(--sage-500)' : 'rgba(254, 252, 251, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-breath) var(--space-pause)',
            color: showFavoritesOnly 
              ? 'var(--sanctuary-white)' 
              : 'rgba(254, 252, 251, 0.8)',
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-whisper)'
          }}
        >
          <span>{showFavoritesOnly ? '⭐' : '☆'}</span>
          Favorites Only
        </button>
      </div>
      
      {/* Active Quests */}
      {questsByStatus.in_progress.length > 0 && (
        <div style={{ marginBottom: 'var(--space-sanctuary)' }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-rest)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-breath)'
          }}>
            🏃‍♀️ Continue Your Journey
          </h3>
          
          {questsByStatus.in_progress.map(quest => {
            const progress = questProgress.find(p => p.questId === quest.id);
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={progress}
                onStart={(pathwayId) => onStartQuest(quest.id, pathwayId)}
                onResume={() => onResumeQuest(quest.id)}
                onPause={(reason) => onPauseQuest(quest.id, reason)}
                onFavorite={() => onFavoriteQuest(quest.id)}
              />
            );
          })}
        </div>
      )}
      
      {/* Paused Quests */}
      {questsByStatus.paused.length > 0 && (
        <div style={{ marginBottom: 'var(--space-sanctuary)' }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-rest)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-breath)'
          }}>
            ⏸️ Paused Journeys
          </h3>
          
          {questsByStatus.paused.map(quest => {
            const progress = questProgress.find(p => p.questId === quest.id);
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={progress}
                onStart={(pathwayId) => onStartQuest(quest.id, pathwayId)}
                onResume={() => onResumeQuest(quest.id)}
                onPause={(reason) => onPauseQuest(quest.id, reason)}
                onFavorite={() => onFavoriteQuest(quest.id)}
              />
            );
          })}
        </div>
      )}
      
      {/* Available Quests */}
      {questsByStatus.not_started.length > 0 && (
        <div style={{ marginBottom: 'var(--space-sanctuary)' }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-rest)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-breath)'
          }}>
            ✨ New Adventures
          </h3>
          
          {questsByStatus.not_started.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onStart={(pathwayId) => onStartQuest(quest.id, pathwayId)}
              onResume={() => onResumeQuest(quest.id)}
              onPause={(reason) => onPauseQuest(quest.id, reason)}
              onFavorite={() => onFavoriteQuest(quest.id)}
            />
          ))}
        </div>
      )}
      
      {/* Completed Quests */}
      {questsByStatus.completed.length > 0 && activeFilter === 'completed' && (
        <div>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-rest)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-breath)'
          }}>
            🏆 Completed Journeys
          </h3>
          
          {questsByStatus.completed.map(quest => {
            const progress = questProgress.find(p => p.questId === quest.id);
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={progress}
                onStart={(pathwayId) => onStartQuest(quest.id, pathwayId)}
                onResume={() => onResumeQuest(quest.id)}
                onPause={(reason) => onPauseQuest(quest.id, reason)}
                onFavorite={() => onFavoriteQuest(quest.id)}
              />
            );
          })}
        </div>
      )}
      
      {/* Empty State */}
      {filteredQuests.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-sanctuary)',
          color: 'rgba(254, 252, 251, 0.6)'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: 'var(--space-pause)'
          }}>
            🌱
          </div>
          <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-breath)' }}>
            No quests match your current filter
          </p>
          <p style={{ fontSize: 'var(--text-sm)' }}>
            Try adjusting your filters or check back soon for new adventures
          </p>
        </div>
      )}
    </div>
  );
}