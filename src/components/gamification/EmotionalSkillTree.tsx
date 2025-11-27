'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';
import { EmotionalSkill, EmotionalExercise, DuolingoStyleHealingEngine } from '@/lib/gamification/duolingo-style-healing-engine';
import { useMobileOptimization } from '../MobileOptimizationProvider';

interface SkillTreeProps {
  skills: EmotionalSkill[];
  onSkillSelect: (skill: EmotionalSkill) => void;
  onExerciseStart: (exercise: EmotionalExercise) => void;
  userPreferences?: {
    celebrationStyle: 'gentle' | 'enthusiastic' | 'wise';
    traumaInformed: boolean;
  };
}

interface SkillNode {
  skill: EmotionalSkill;
  x: number;
  y: number;
  connections: string[];
}

const SKILL_CATEGORIES = {
  self_awareness: {
    name: 'Self-Awareness',
    icon: '🧠',
    color: '#8ea876',
    description: 'Understanding your emotional landscape'
  },
  regulation: {
    name: 'Emotional Regulation',
    icon: '⚖️',
    color: '#a4b792',
    description: 'Managing emotions with wisdom and grace'
  },
  empathy: {
    name: 'Empathy',
    icon: '💚',
    color: '#7a8c6a',
    description: 'Connecting with others\' emotional experiences'
  },
  social_skills: {
    name: 'Social Skills',
    icon: '🤝',
    color: '#93a682',
    description: 'Navigating relationships with emotional intelligence'
  },
  motivation: {
    name: 'Inner Motivation',
    icon: '🔥',
    color: '#667a5c',
    description: 'Finding purpose and drive from within'
  }
};

export default function EmotionalSkillTree({ 
  skills, 
  onSkillSelect, 
  onExerciseStart,
  userPreferences 
}: SkillTreeProps) {
  const [selectedSkill, setSelectedSkill] = useState<EmotionalSkill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('self_awareness');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<EmotionalExercise | null>(null);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  
  const { user } = useAuth();
  const { 
    isCrisisMode, 
    isLowBattery, 
    deviceTier,
    isOffline 
  } = useMobileOptimization();

  // Handle double-tap protection
  const handleTouchSafeAction = useCallback((action: () => void) => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) return;
    setLastTapTime(currentTime);
    
    if (typeof navigator !== 'undefined' && navigator.vibrate && !isLowBattery) {
      navigator.vibrate(20);
    }
    
    action();
  }, [lastTapTime, isLowBattery]);

  // Calculate skill tree layout
  useEffect(() => {
    const categorySkills = skills.filter(skill => skill.category === selectedCategory);
    const nodes: SkillNode[] = [];
    
    // Arrange skills in a tree-like structure
    categorySkills.forEach((skill, index) => {
      const level = skill.level === 0 ? 0 : Math.ceil(skill.level / 2);
      const position = index % 3;
      
      nodes.push({
        skill,
        x: position * 120 + 60, // Horizontal spacing
        y: level * 100 + 60,    // Vertical spacing based on level
        connections: skill.prerequisites
      });
    });
    
    setSkillNodes(nodes);
  }, [skills, selectedCategory]);

  const getCategoryProgress = (categoryId: string): number => {
    const categorySkills = skills.filter(skill => skill.category === categoryId);
    if (categorySkills.length === 0) return 0;
    
    const totalLevels = categorySkills.reduce((sum, skill) => sum + skill.level, 0);
    const maxPossibleLevels = categorySkills.length * 10; // Assuming max level 10
    return Math.round((totalLevels / maxPossibleLevels) * 100);
  };

  const getSkillIcon = (skill: EmotionalSkill): string => {
    const icons: { [key: string]: string } = {
      emotional_awareness: '🎯',
      self_compassion: '💝',
      boundary_setting: '🛡️',
      stress_management: '🧘',
      mindful_listening: '👂',
      emotional_expression: '🎨',
      conflict_resolution: '🕊️',
      inner_motivation: '⭐',
      resilience_building: '🌳'
    };
    return icons[skill.id] || '✨';
  };

  const getSkillBorderColor = (skill: EmotionalSkill): string => {
    if (!skill.isUnlocked) return '#e5e5e5';
    if (skill.level === 0) return '#f59e0b'; // Orange for available
    if (skill.level < 3) return '#10b981'; // Green for beginner
    if (skill.level < 6) return '#3b82f6'; // Blue for intermediate
    if (skill.level < 9) return '#8b5cf6'; // Purple for advanced
    return '#f59e0b'; // Gold for mastery
  };

  const getSkillProgress = (skill: EmotionalSkill): number => {
    if (skill.level === 0) return 0;
    return Math.round((skill.xp / skill.xpToNext) * 100);
  };

  const handleSkillClick = (skill: EmotionalSkill) => {
    if (!skill.isUnlocked) {
      // Show what prerequisites are needed
      return;
    }
    
    setSelectedSkill(skill);
    onSkillSelect(skill);
  };

  const handleExerciseClick = (exercise: EmotionalExercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const startExercise = () => {
    if (selectedExercise) {
      onExerciseStart(selectedExercise);
      setShowExerciseModal(false);
      setSelectedExercise(null);
    }
  };

  // Crisis mode styles
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};

  const touchTargetClass = isCrisisMode 
    ? 'min-h-[60px] min-w-[60px] text-lg font-medium border-3 border-red-400' 
    : 'min-h-[48px] min-w-[48px]';

  return (
    <div className={`trauma-informed-mobile-ux ${isCrisisMode ? 'crisis-active' : ''}`} style={{
      background: 'white',
      borderRadius: isCrisisMode ? '8px' : '12px',
      padding: isCrisisMode ? '2rem' : '1.5rem',
      border: isCrisisMode ? '2px solid #a4b792' : '1px solid #e5e5e5',
      marginBottom: '2rem',
      ...crisisStyles
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        <span style={{ fontSize: isCrisisMode ? '2rem' : '1.5rem' }}>🌳</span>
        <div>
          <h3 style={{
            margin: 0,
            color: isCrisisMode ? '#2e2e2e' : '#2e2e2e',
            fontSize: isCrisisMode ? '1.5rem' : '1.3rem',
            fontWeight: isCrisisMode ? '700' : 'normal'
          }}>
            {isCrisisMode ? 'Your Emotional Skills' : 'Emotional Skill Tree'}
          </h3>
          <p style={{
            margin: '0.25rem 0 0 0',
            color: '#666',
            fontSize: isCrisisMode ? '1rem' : '0.9rem',
            fontWeight: isCrisisMode ? '500' : 'normal'
          }}>
            {isCrisisMode ? 'Building emotional wellness step by step' : 'Develop emotional intelligence through practice'}
          </p>
        </div>
      </div>

      {/* Offline indicator */}
      {isOffline && (
        <div style={{
          marginBottom: '1.5rem',
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
          📡 <span>Skills progress will sync when reconnected</span>
        </div>
      )}

      {/* Category Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isCrisisMode ? '1fr 1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: isCrisisMode ? '1rem' : '0.75rem',
        marginBottom: '2rem'
      }}>
        {Object.entries(SKILL_CATEGORIES).map(([categoryId, category]) => {
          const progress = getCategoryProgress(categoryId);
          const isSelected = selectedCategory === categoryId;
          
          return (
            <button
              key={categoryId}
              onClick={() => handleTouchSafeAction(() => setSelectedCategory(categoryId))}
              className={`${touchTargetClass} touch-target`}
              style={{
                background: isSelected ? category.color : 'transparent',
                color: isSelected ? 'white' : isCrisisMode ? '#2e2e2e' : '#666',
                border: `${isCrisisMode ? '3px' : '2px'} solid ${isSelected ? category.color : '#e5e5e5'}`,
                borderRadius: isCrisisMode ? '8px' : '12px',
                padding: isCrisisMode ? '1rem' : '0.75rem',
                cursor: 'pointer',
                transition: isLowBattery ? 'none' : 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: isCrisisMode ? '1.5rem' : '1.2rem' }}>
                {category.icon}
              </span>
              <div>
                <div style={{
                  fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                  fontWeight: isCrisisMode ? '700' : '600',
                  marginBottom: '0.25rem'
                }}>
                  {category.name}
                </div>
                <div style={{
                  fontSize: isCrisisMode ? '0.8rem' : '0.7rem',
                  opacity: 0.8
                }}>
                  {progress}% complete
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Info */}
      {selectedCategory && SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES] && (
        <div style={{
          backgroundColor: `${SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].color}10`,
          border: `2px solid ${SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].color}`,
          borderRadius: isCrisisMode ? '8px' : '12px',
          padding: isCrisisMode ? '1.5rem' : '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: isCrisisMode ? '1.8rem' : '1.5rem' }}>
              {SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].icon}
            </span>
            <h4 style={{
              margin: 0,
              color: SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].color,
              fontSize: isCrisisMode ? '1.3rem' : '1.1rem',
              fontWeight: isCrisisMode ? '700' : '600'
            }}>
              {SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].name}
            </h4>
          </div>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: isCrisisMode ? '1rem' : '0.9rem',
            lineHeight: '1.4'
          }}>
            {SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].description}
          </p>
        </div>
      )}

      {/* Skills Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isCrisisMode ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isCrisisMode ? '1.5rem' : '1rem'
      }}>
        {skills
          .filter(skill => skill.category === selectedCategory)
          .map(skill => (
            <div
              key={skill.id}
              className="touch-target"
              style={{
                border: `${isCrisisMode ? '3px' : '2px'} solid ${getSkillBorderColor(skill)}`,
                borderRadius: isCrisisMode ? '8px' : '12px',
                padding: isCrisisMode ? '1.5rem' : '1.25rem',
                backgroundColor: skill.isUnlocked 
                  ? (skill.level > 0 ? 'rgba(168, 183, 150, 0.05)' : 'white')
                  : '#f9f9f9',
                opacity: skill.isUnlocked ? 1 : 0.6,
                cursor: skill.isUnlocked ? 'pointer' : 'default',
                position: 'relative',
                transition: isLowBattery ? 'none' : 'all 0.2s ease',
                minHeight: isCrisisMode ? '200px' : 'auto'
              }}
              onClick={() => skill.isUnlocked && handleTouchSafeAction(() => handleSkillClick(skill))}
            >
              {/* Skill Level Badge */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '1rem',
                backgroundColor: getSkillBorderColor(skill),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {skill.isUnlocked ? (skill.level === 0 ? 'NEW' : `LV ${skill.level}`) : 'LOCKED'}
              </div>

              {/* Skill Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <span style={{ 
                  fontSize: isCrisisMode ? '2rem' : '1.5rem',
                  opacity: skill.isUnlocked ? 1 : 0.5 
                }}>
                  {getSkillIcon(skill)}
                </span>
                <div>
                  <h5 style={{
                    margin: 0,
                    color: skill.isUnlocked ? '#2e2e2e' : '#999',
                    fontSize: isCrisisMode ? '1.2rem' : '1rem',
                    fontWeight: isCrisisMode ? '700' : '600'
                  }}>
                    {skill.name}
                  </h5>
                  {skill.isUnlocked && skill.level > 0 && (
                    <div style={{
                      fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem'
                    }}>
                      {skill.xp} / {skill.xpToNext} XP
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar for unlocked skills */}
              {skill.isUnlocked && skill.level > 0 && (
                <div style={{
                  backgroundColor: '#e5e5e5',
                  borderRadius: '6px',
                  height: isCrisisMode ? '10px' : '6px',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: getSkillBorderColor(skill),
                    height: '100%',
                    width: `${getSkillProgress(skill)}%`,
                    transition: isLowBattery ? 'none' : 'width 0.3s ease'
                  }} />
                </div>
              )}

              {/* Prerequisites for locked skills */}
              {!skill.isUnlocked && skill.prerequisites.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(156, 163, 175, 0.1)',
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                    color: '#666',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    Prerequisites needed:
                  </div>
                  {skill.prerequisites.map(prereqId => {
                    const prereqSkill = skills.find(s => s.id === prereqId);
                    return (
                      <div key={prereqId} style={{
                        fontSize: isCrisisMode ? '0.8rem' : '0.75rem',
                        color: '#666'
                      }}>
                        • {prereqSkill?.name || prereqId} (Level 2+)
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Available exercises for unlocked skills */}
              {skill.isUnlocked && skill.exercises.length > 0 && (
                <div>
                  <div style={{
                    fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '0.5rem'
                  }}>
                    Practice exercises:
                  </div>
                  <div style={{
                    display: 'grid',
                    gap: '0.5rem'
                  }}>
                    {skill.exercises.slice(0, 2).map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTouchSafeAction(() => handleExerciseClick(exercise));
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #e5e5e5',
                          borderRadius: '6px',
                          padding: isCrisisMode ? '0.75rem' : '0.5rem',
                          fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                          color: '#666',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: isLowBattery ? 'none' : 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isLowBattery) {
                            e.currentTarget.style.backgroundColor = 'rgba(168, 183, 150, 0.1)';
                            e.currentTarget.style.borderColor = '#a4b792';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLowBattery) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#e5e5e5';
                          }
                        }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {exercise.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          {exercise.estimatedTime} min • {exercise.difficulty}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Encouragement for locked skills */}
              {!skill.isUnlocked && (
                <div style={{
                  fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                  color: '#667a5c',
                  fontStyle: 'italic',
                  marginTop: '1rem'
                }}>
                  This skill will unlock as you continue your emotional growth journey.
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {showExerciseModal && selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              zIndex: 1000
            }}
            onClick={() => setShowExerciseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'white',
                borderRadius: isCrisisMode ? '8px' : '12px',
                padding: isCrisisMode ? '2rem' : '1.5rem',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                border: isCrisisMode ? '3px solid #a4b792' : '1px solid #e5e5e5'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4 style={{
                margin: '0 0 1rem 0',
                color: '#2e2e2e',
                fontSize: isCrisisMode ? '1.3rem' : '1.1rem',
                fontWeight: isCrisisMode ? '700' : '600'
              }}>
                {selectedExercise.name}
              </h4>
              
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
                fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                color: '#666'
              }}>
                <span>⏱️ {selectedExercise.estimatedTime} min</span>
                <span>📈 {selectedExercise.difficulty}</span>
                <span>🔄 {selectedExercise.completions} completed</span>
              </div>

              <p style={{
                color: '#666',
                fontSize: isCrisisMode ? '1rem' : '0.9rem',
                lineHeight: '1.5',
                marginBottom: '1.5rem'
              }}>
                {selectedExercise.description}
              </p>

              {selectedExercise.trauma_informed.triggerWarnings.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
                    fontWeight: '600',
                    color: 'rgba(245, 158, 11, 0.8)',
                    marginBottom: '0.5rem'
                  }}>
                    ⚠️ Gentle reminder:
                  </div>
                  <div style={{
                    fontSize: isCrisisMode ? '0.8rem' : '0.75rem',
                    color: 'rgba(245, 158, 11, 0.7)'
                  }}>
                    This exercise may bring up emotions around: {selectedExercise.trauma_informed.triggerWarnings.join(', ')}
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1.5rem'
              }}>
                <button
                  onClick={startExercise}
                  className={touchTargetClass}
                  style={{
                    backgroundColor: '#a4b792',
                    color: 'white',
                    border: 'none',
                    borderRadius: isCrisisMode ? '6px' : '8px',
                    padding: isCrisisMode ? '1rem 1.5rem' : '0.75rem 1.25rem',
                    fontSize: isCrisisMode ? '1rem' : '0.9rem',
                    fontWeight: isCrisisMode ? '700' : '600',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Start Exercise
                </button>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className={touchTargetClass}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#666',
                    border: '2px solid #e5e5e5',
                    borderRadius: isCrisisMode ? '6px' : '8px',
                    padding: isCrisisMode ? '1rem 1.5rem' : '0.75rem 1.25rem',
                    fontSize: isCrisisMode ? '1rem' : '0.9rem',
                    fontWeight: isCrisisMode ? '700' : '600',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Footer */}
      <div style={{
        backgroundColor: '#f0f7ff',
        border: '2px solid #8ea876',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌱</div>
        <p style={{
          color: '#2e2e2e',
          fontSize: isCrisisMode ? '1rem' : '0.9rem',
          margin: '0 0 0.5rem 0',
          fontWeight: isCrisisMode ? '600' : '500'
        }}>
          {isCrisisMode 
            ? 'Every skill you develop makes you stronger'
            : 'Your emotional intelligence grows with every practice'
          }
        </p>
        <p style={{
          color: '#666',
          fontSize: isCrisisMode ? '0.9rem' : '0.8rem',
          margin: 0
        }}>
          {isCrisisMode 
            ? 'Take your time. Healing happens at your pace.' 
            : 'Skills aren\'t about perfection. They\'re about growth.'
          }
        </p>
      </div>
    </div>
  );
}