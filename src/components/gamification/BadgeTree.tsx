'use client';

import React, { useState } from 'react';
import { 
  Badge, 
  BadgeTree as BadgeTreeType, 
  BadgeEvolutionEngine,
  CelebrationMoment,
  UserActivity 
} from '@/lib/gamification/badge-evolution';

interface BadgeTreeProps {
  tree: BadgeTreeType;
  userActivity: UserActivity;
  onBadgeEvolution: (badge: Badge, celebration: CelebrationMoment) => void;
  className?: string;
}

interface BadgeCardProps {
  badge: Badge;
  userActivity: UserActivity;
  onEvolution: (badge: Badge, celebration: CelebrationMoment) => void;
  isLocked?: boolean;
  connectsTo?: 'next' | 'none';
}

function BadgeCard({ badge, userActivity, onEvolution, isLocked = false, connectsTo = 'none' }: BadgeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const { progress, readyForEvolution, evolutionMessage } = 
    BadgeEvolutionEngine.calculateProgress(badge, userActivity);
  
  const isUnlocked = badge.unlockedAt || progress.currentValue > 0;
  const progressPercentage = Math.min((progress.currentValue / progress.targetValue) * 100, 100);
  
  const handleEvolution = () => {
    if (readyForEvolution) {
      const result = BadgeEvolutionEngine.evolveBadge(badge, userActivity);
      if (result.success && result.evolvedBadge) {
        onEvolution(result.evolvedBadge, result.celebrationMoment);
      }
    }
  };
  
  const getRarityGlow = (rarity: string) => {
    const glows = {
      common: 'rgba(168, 181, 160, 0.2)',
      meaningful: 'rgba(168, 181, 160, 0.4)',
      profound: 'rgba(168, 181, 160, 0.6)',
      sacred: 'rgba(168, 181, 160, 0.8)'
    };
    return glows[rarity] || glows.common;
  };
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Connection Line to Next Badge */}
      {connectsTo === 'next' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-24px',
          width: '48px',
          height: '2px',
          background: isUnlocked 
            ? 'linear-gradient(90deg, var(--sage-400), var(--sage-300))' 
            : 'rgba(254, 252, 251, 0.2)',
          zIndex: 0,
          transform: 'translateY(-50%)'
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            right: '-6px',
            top: '-4px',
            width: 0,
            height: 0,
            borderLeft: `6px solid ${isUnlocked ? 'var(--sage-400)' : 'rgba(254, 252, 251, 0.2)'}`,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent'
          }} />
        </div>
      )}
      
      {/* Badge Card */}
      <div
        onClick={() => setShowDetails(!showDetails)}
        style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          background: isLocked 
            ? 'rgba(254, 252, 251, 0.1)' 
            : `linear-gradient(135deg, ${getRarityGlow(badge.rarity)}, rgba(254, 252, 251, 0.1))`,
          backdropFilter: 'blur(20px)',
          border: readyForEvolution 
            ? `2px solid var(--sage-400)` 
            : `1px solid ${isLocked ? 'rgba(254, 252, 251, 0.2)' : 'rgba(168, 181, 160, 0.3)'}`,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLocked ? 'default' : 'pointer',
          transition: 'all 0.3s var(--ease-sanctuary)',
          opacity: isLocked ? 0.5 : 1,
          boxShadow: readyForEvolution 
            ? `0 0 20px ${getRarityGlow(badge.rarity)}` 
            : 'none',
          animation: readyForEvolution ? 'badgePulse 2s ease-in-out infinite' : 'none'
        }}
      >
        {/* Evolution Ready Indicator */}
        {readyForEvolution && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            background: 'var(--sage-400)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            animation: 'bounce 1s ease-in-out infinite'
          }}>
            ✨
          </div>
        )}
        
        {/* Badge Icon */}
        <div style={{
          fontSize: '2rem',
          marginBottom: '8px',
          filter: isLocked ? 'grayscale(100%)' : 'none'
        }}>
          {isLocked ? '🔒' : badge.icon}
        </div>
        
        {/* Badge Name */}
        <div style={{
          fontSize: '12px',
          fontWeight: 'var(--font-medium)',
          color: isLocked ? 'rgba(254, 252, 251, 0.5)' : 'var(--sanctuary-white)',
          textAlign: 'center',
          lineHeight: '1.2',
          padding: '0 8px'
        }}>
          {badge.stage.name}
        </div>
        
        {/* Progress Bar (if unlocked) */}
        {isUnlocked && !isLocked && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            right: '8px',
            height: '3px',
            background: 'rgba(254, 252, 251, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, var(--sage-400), var(--sage-500))`,
              transition: 'width 0.5s var(--ease-sanctuary)'
            }} />
          </div>
        )}
      </div>
      
      {/* Detailed View Modal */}
      {showDetails && !isLocked && (
        <div style={{
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
        }}>
          <div className="card-sanctuary" style={{
            background: 'var(--sage-800)',
            border: `1px solid ${getRarityGlow(badge.rarity)}`,
            padding: 'var(--space-sanctuary)',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {/* Badge Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-pause)',
              marginBottom: 'var(--space-rest)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem' }}>{badge.icon}</div>
              <div>
                <h3 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sanctuary-white)',
                  marginBottom: 'var(--space-whisper)'
                }}>
                  {badge.name}
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {badge.description}
                </p>
              </div>
            </div>
            
            {/* Progress Section */}
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
                  Progress
                </span>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(254, 252, 251, 0.8)'
                }}>
                  {progress.currentValue} / {progress.targetValue} {progress.unit}
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(254, 252, 251, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: 'var(--space-breath)'
              }}>
                <div style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, var(--sage-400), var(--sage-500))`,
                  transition: 'width 0.5s var(--ease-sanctuary)'
                }} />
              </div>
              
              {/* Milestones */}
              {progress.milestones.length > 0 && (
                <div>
                  <h4 style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--sanctuary-white)',
                    marginBottom: 'var(--space-breath)'
                  }}>
                    Journey Markers
                  </h4>
                  {progress.milestones.map((milestone, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-breath)',
                      marginBottom: 'var(--space-whisper)',
                      opacity: milestone.isReached ? 1 : 0.6
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: milestone.isReached 
                          ? 'var(--sage-400)' 
                          : 'rgba(254, 252, 251, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px'
                      }}>
                        {milestone.isReached ? '✓' : '○'}
                      </div>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        color: milestone.isReached 
                          ? 'var(--sanctuary-white)' 
                          : 'rgba(254, 252, 251, 0.7)',
                        textDecoration: milestone.isReached ? 'none' : 'none'
                      }}>
                        {milestone.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Evolution Ready */}
            {readyForEvolution && evolutionMessage && (
              <div style={{
                background: 'rgba(168, 181, 160, 0.2)',
                border: '1px solid var(--sage-400)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-pause)',
                marginBottom: 'var(--space-rest)',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--sanctuary-white)',
                  marginBottom: 'var(--space-breath)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  {evolutionMessage}
                </p>
                <button
                  onClick={handleEvolution}
                  style={{
                    padding: 'var(--space-breath) var(--space-pause)',
                    background: 'var(--sage-600)',
                    border: '1px solid var(--sage-500)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--sanctuary-white)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    cursor: 'pointer',
                    transition: 'all 0.2s var(--ease-sanctuary)'
                  }}
                >
                  Embrace Evolution ✨
                </button>
              </div>
            )}
            
            {/* Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: 'var(--space-breath) var(--space-pause)',
                  background: 'transparent',
                  border: '1px solid rgba(254, 252, 251, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes badgePulse {
          0%, 100% { 
            box-shadow: 0 0 20px ${getRarityGlow(badge.rarity)};
          }
          50% { 
            box-shadow: 0 0 30px ${getRarityGlow(badge.rarity)}, 0 0 40px ${getRarityGlow(badge.rarity)};
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

export default function BadgeTreeComponent({ tree, userActivity, onBadgeEvolution, className = '' }: BadgeTreeProps) {
  const [expandedTree, setExpandedTree] = useState(false);
  
  // Determine which badges are unlocked
  const unlockedStages = tree.stages.filter(badge => 
    badge.unlockedAt || BadgeEvolutionEngine.calculateProgress(badge, userActivity).progress.currentValue > 0
  );
  
  const nextUnlockableBadge = tree.stages.find((badge, index) => {
    if (badge.unlockedAt) return false;
    if (index === 0) return true; // First badge is always unlockable
    return unlockedStages.length >= index; // Previous badge must be unlocked
  });

  return (
    <div className={`badge-tree-sanctuary ${className}`} style={{
      background: 'rgba(168, 181, 160, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 181, 160, 0.2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-sanctuary)',
      marginBottom: 'var(--space-sanctuary)'
    }}>
      {/* Tree Header */}
      <div 
        onClick={() => setExpandedTree(!expandedTree)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: expandedTree ? 'var(--space-rest)' : 0,
          cursor: 'pointer',
          padding: 'var(--space-pause)',
          borderRadius: 'var(--radius-md)',
          transition: 'all 0.2s var(--ease-sanctuary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-pause)' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, var(--sage-400), var(--sage-500))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-lg)'
          }}>
            {tree.stages[0]?.icon || '🌟'}
          </div>
          
          <div>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--sanctuary-white)',
              marginBottom: 'var(--space-whisper)'
            }}>
              {tree.name}
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'rgba(254, 252, 251, 0.8)',
              lineHeight: 'var(--leading-relaxed)'
            }}>
              {tree.description}
            </p>
          </div>
        </div>
        
        <div style={{
          fontSize: 'var(--text-lg)',
          color: 'rgba(254, 252, 251, 0.6)',
          transform: expandedTree ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s var(--ease-sanctuary)'
        }}>
          ↓
        </div>
      </div>
      
      {/* Tree Philosophy */}
      {expandedTree && (
        <div style={{
          background: 'rgba(254, 252, 251, 0.05)',
          border: '1px solid rgba(254, 252, 251, 0.1)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-pause)',
          marginBottom: 'var(--space-rest)'
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(254, 252, 251, 0.9)',
            lineHeight: 'var(--leading-relaxed)',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            "{tree.philosophy}"
          </p>
        </div>
      )}
      
      {/* Badge Evolution Path */}
      {expandedTree && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '48px',
          overflowX: 'auto',
          padding: 'var(--space-pause)',
          minHeight: '140px'
        }}>
          {tree.stages.map((badge, index) => {
            const isLocked = index > 0 && 
              !unlockedStages.some(u => u.id === tree.stages[index - 1]?.id) &&
              badge.id !== nextUnlockableBadge?.id;
            
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                userActivity={userActivity}
                onEvolution={onBadgeEvolution}
                isLocked={isLocked}
                connectsTo={index < tree.stages.length - 1 ? 'next' : 'none'}
              />
            );
          })}
        </div>
      )}
      
      {/* Compact View - Show current progress */}
      {!expandedTree && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-pause)',
          padding: 'var(--space-pause) 0'
        }}>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(254, 252, 251, 0.8)'
          }}>
            {unlockedStages.length} / {tree.stages.length} stages unlocked
          </div>
          
          {/* Mini progress indicator */}
          <div style={{
            flex: 1,
            height: '4px',
            background: 'rgba(254, 252, 251, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(unlockedStages.length / tree.stages.length) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, var(--sage-400), var(--sage-500))`,
              transition: 'width 0.5s var(--ease-sanctuary)'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}