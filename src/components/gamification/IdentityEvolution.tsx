'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IDENTITY EVOLUTION VISUALIZATION
 * Revolutionary system for tracking personal growth and archetype development
 * 
 * Core Concepts:
 * - Growth constellation showing interconnected identity development
 * - Archetype evolution (Survivor → Thriver → Guide → Sage)
 * - Personal mythology development
 * - Wisdom pattern recognition
 * - No linear progression - spiral healing honored
 */

interface IdentityArchetype {
  id: string;
  name: string;
  description: string;
  stage: 'emerging' | 'developing' | 'embodying' | 'mastering';
  traits: {
    name: string;
    strength: number; // 0-100
    growthArea?: string;
  }[];
  evolutionPath: string[];
  wisdom: {
    gained: string[];
    practicing: string[];
    integrating: string[];
  };
  constellation: {
    x: number;
    y: number;
    connections: string[]; // IDs of connected archetypes
  };
}

interface IdentityMilestone {
  id: string;
  date: Date;
  title: string;
  description: string;
  category: 'courage' | 'wisdom' | 'compassion' | 'authenticity' | 'boundaries' | 'healing';
  archetypeImpact: {
    archetypeId: string;
    growthAmount: number;
  }[];
  mythologyEntry: string; // Personal story/meaning
  celebrationLevel: 'gentle' | 'meaningful' | 'profound';
}

interface PersonalMythology {
  heroJourneyPhase: 'calling' | 'threshold' | 'trials' | 'abyss' | 'transformation' | 'return' | 'mastery';
  coreNarrative: string;
  growthThemes: string[];
  healingPatterns: string[];
  wisdomGained: string[];
  futureSelf: {
    vision: string;
    values: string[];
    gifts: string[];
  };
}

interface IdentityEvolutionProps {
  archetypes: IdentityArchetype[];
  milestones: IdentityMilestone[];
  mythology: PersonalMythology;
  onArchetypeExplore: (archetypeId: string) => void;
  onMilestoneReflect: (milestoneId: string) => void;
  className?: string;
}

const ARCHETYPE_COLORS = {
  survivor: '#8B4513',    // Earth brown - grounding
  thriver: '#228B22',     // Forest green - growing
  healer: '#4169E1',      // Royal blue - wisdom
  guide: '#9370DB',       // Purple - transformation
  sage: '#FFD700',        // Gold - enlightenment
  creator: '#FF6347',     // Coral - expression
  mystic: '#9932CC',      // Dark orchid - mystery
  warrior: '#DC143C'      // Crimson - courage
} as const;

const EVOLUTION_ANIMATIONS = {
  constellation: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 1, ease: "easeOut" }
  },
  archetype_pulse: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  },
  connection_flow: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 0.6 },
    transition: { duration: 2, ease: "easeInOut" }
  },
  milestone_emerge: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

function ArchetypeNode({ 
  archetype, 
  onExplore, 
  isActive 
}: { 
  archetype: IdentityArchetype; 
  onExplore: () => void;
  isActive: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const getArchetypeColor = (name: string) => {
    const colorKey = name.toLowerCase() as keyof typeof ARCHETYPE_COLORS;
    return ARCHETYPE_COLORS[colorKey] || '#a4b792';
  };
  
  const getStageGlow = (stage: string) => {
    const glows = {
      emerging: '0 0 8px',
      developing: '0 0 12px',
      embodying: '0 0 16px',
      mastering: '0 0 20px'
    };
    return glows[stage] || glows.emerging;
  };
  
  const getArchetypeIcon = (name: string) => {
    const icons = {
      survivor: '🏔️',
      thriver: '🌲',
      healer: '🌿',
      guide: '🧭',
      sage: '🦉',
      creator: '🎨',
      mystic: '🔮',
      warrior: '⚔️'
    };
    const iconKey = name.toLowerCase() as keyof typeof icons;
    return icons[iconKey] || '✨';
  };
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${archetype.constellation.x}%`,
        top: `${archetype.constellation.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer'
      }}
      variants={EVOLUTION_ANIMATIONS.constellation}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.1 }}
      onClick={onExplore}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.div
        style={{
          width: isActive ? '80px' : '60px',
          height: isActive ? '80px' : '60px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${getArchetypeColor(archetype.name)}dd, ${getArchetypeColor(archetype.name)}99)`,
          border: `3px solid ${getArchetypeColor(archetype.name)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isActive ? '2rem' : '1.5rem',
          boxShadow: `${getStageGlow(archetype.stage)} ${getArchetypeColor(archetype.name)}80`,
          transition: 'all 0.3s ease'
        }}
        variants={EVOLUTION_ANIMATIONS.archetype_pulse}
        animate={archetype.stage === 'mastering' ? 'animate' : 'initial'}
      >
        {getArchetypeIcon(archetype.name)}
      </motion.div>
      
      {/* Archetype Label */}
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '8px',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          color: 'var(--sanctuary-white)',
          marginBottom: 'var(--space-whisper)'
        }}>
          {archetype.name}
        </div>
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'rgba(254, 252, 251, 0.7)',
          textTransform: 'capitalize'
        }}>
          {archetype.stage}
        </div>
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '120%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${getArchetypeColor(archetype.name)}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-pause)',
              minWidth: '200px',
              zIndex: 100
            }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--sanctuary-white)',
              margin: '0 0 var(--space-breath) 0',
              lineHeight: 'var(--leading-relaxed)'
            }}>
              {archetype.description}
            </p>
            
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(254, 252, 251, 0.8)'
            }}>
              Top Traits: {archetype.traits.slice(0, 2).map(trait => trait.name).join(', ')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ConstellationConnections({ archetypes }: { archetypes: IdentityArchetype[] }) {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {archetypes.map(archetype => 
        archetype.constellation.connections.map(connectionId => {
          const connectedArchetype = archetypes.find(a => a.id === connectionId);
          if (!connectedArchetype) return null;
          
          const startX = (archetype.constellation.x / 100) * 400; // Assuming 400px width
          const startY = (archetype.constellation.y / 100) * 400;
          const endX = (connectedArchetype.constellation.x / 100) * 400;
          const endY = (connectedArchetype.constellation.y / 100) * 400;
          
          return (
            <motion.path
              key={`${archetype.id}-${connectionId}`}
              d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 30} ${endX} ${endY}`}
              stroke="rgba(164, 183, 146, 0.4)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              variants={EVOLUTION_ANIMATIONS.connection_flow}
              initial="initial"
              animate="animate"
            />
          );
        })
      )}
    </svg>
  );
}

function HeroJourneyProgress({ mythology }: { mythology: PersonalMythology }) {
  const journeyPhases = [
    { id: 'calling', name: 'The Calling', icon: '📞' },
    { id: 'threshold', name: 'Crossing Threshold', icon: '🚪' },
    { id: 'trials', name: 'Trials & Growth', icon: '⚔️' },
    { id: 'abyss', name: 'The Abyss', icon: '🌑' },
    { id: 'transformation', name: 'Transformation', icon: '🦋' },
    { id: 'return', name: 'The Return', icon: '🏠' },
    { id: 'mastery', name: 'Mastery', icon: '👑' }
  ];
  
  const currentPhaseIndex = journeyPhases.findIndex(p => p.id === mythology.heroJourneyPhase);
  
  return (
    <div style={{
      background: 'rgba(168, 181, 160, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 181, 160, 0.2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-sanctuary)',
      marginBottom: 'var(--space-rest)'
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--sanctuary-white)',
        marginBottom: 'var(--space-rest)',
        textAlign: 'center'
      }}>
        🌟 Your Hero's Journey
      </h3>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-rest)',
        overflowX: 'auto',
        padding: 'var(--space-pause) 0'
      }}>
        {journeyPhases.map((phase, index) => {
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;
          const isUpcoming = index > currentPhaseIndex;
          
          return (
            <div
              key={phase.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px',
                opacity: isUpcoming ? 0.4 : 1,
                position: 'relative'
              }}
            >
              <motion.div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted 
                    ? 'linear-gradient(135deg, var(--sage-400), var(--sage-500))'
                    : isCurrent
                    ? 'linear-gradient(135deg, var(--sage-300), var(--sage-400))'
                    : 'rgba(254, 252, 251, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  marginBottom: 'var(--space-breath)',
                  border: isCurrent ? '2px solid var(--sage-200)' : 'none',
                  boxShadow: isCurrent ? '0 0 12px rgba(164, 183, 146, 0.6)' : 'none'
                }}
                animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {phase.icon}
              </motion.div>
              
              <span style={{
                fontSize: 'var(--text-xs)',
                color: isCurrent ? 'var(--sanctuary-white)' : 'rgba(254, 252, 251, 0.7)',
                textAlign: 'center',
                fontWeight: isCurrent ? 'var(--font-medium)' : 'var(--font-normal)',
                lineHeight: '1.2'
              }}>
                {phase.name}
              </span>
              
              {/* Connection Line */}
              {index < journeyPhases.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '70%',
                  width: '20px',
                  height: '2px',
                  background: isCompleted 
                    ? 'var(--sage-400)' 
                    : 'rgba(254, 252, 251, 0.3)',
                  zIndex: -1
                }} />
              )}
            </div>
          );
        })}
      </div>
      
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-pause)',
        background: 'rgba(254, 252, 251, 0.05)',
        borderRadius: 'var(--radius-md)'
      }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(254, 252, 251, 0.9)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-breath)'
        }}>
          {mythology.coreNarrative}
        </p>
        
        {mythology.growthThemes.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-whisper)',
            justifyContent: 'center'
          }}>
            {mythology.growthThemes.slice(0, 3).map(theme => (
              <span
                key={theme}
                style={{
                  background: 'rgba(168, 181, 160, 0.3)',
                  border: '1px solid var(--sage-400)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-whisper) var(--space-breath)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--sanctuary-white)'
                }}
              >
                {theme}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MilestoneTimeline({ 
  milestones, 
  onReflect 
}: { 
  milestones: IdentityMilestone[]; 
  onReflect: (id: string) => void; 
}) {
  const recentMilestones = milestones
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  
  const getCategoryIcon = (category: string) => {
    const icons = {
      courage: '🦁',
      wisdom: '🦉',
      compassion: '💚',
      authenticity: '💎',
      boundaries: '🏔️',
      healing: '🌿'
    };
    return icons[category] || '✨';
  };
  
  const getCategoryColor = (category: string) => {
    const colors = {
      courage: '#DC143C',
      wisdom: '#4169E1',
      compassion: '#228B22',
      authenticity: '#9370DB',
      boundaries: '#8B4513',
      healing: '#a4b792'
    };
    return colors[category] || '#a4b792';
  };
  
  return (
    <div style={{
      background: 'rgba(168, 181, 160, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 181, 160, 0.2)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-sanctuary)'
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--sanctuary-white)',
        marginBottom: 'var(--space-rest)',
        textAlign: 'center'
      }}>
        🏆 Growth Milestones
      </h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-pause)'
      }}>
        {recentMilestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            style={{
              background: 'rgba(254, 252, 251, 0.05)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-pause)',
              border: `1px solid ${getCategoryColor(milestone.category)}40`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            variants={EVOLUTION_ANIMATIONS.milestone_emerge}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              backgroundColor: 'rgba(254, 252, 251, 0.1)'
            }}
            onClick={() => onReflect(milestone.id)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-pause)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: getCategoryColor(milestone.category),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0
              }}>
                {getCategoryIcon(milestone.category)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--space-breath)'
                }}>
                  <h4 style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--sanctuary-white)',
                    margin: 0
                  }}>
                    {milestone.title}
                  </h4>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: 'rgba(254, 252, 251, 0.7)',
                    flexShrink: 0,
                    marginLeft: 'var(--space-breath)'
                  }}>
                    {milestone.date.toLocaleDateString()}
                  </span>
                </div>
                
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  lineHeight: 'var(--leading-relaxed)',
                  marginBottom: 'var(--space-breath)'
                }}>
                  {milestone.description}
                </p>
                
                {milestone.mythologyEntry && (
                  <blockquote style={{
                    fontSize: 'var(--text-xs)',
                    color: getCategoryColor(milestone.category),
                    fontStyle: 'italic',
                    borderLeft: `2px solid ${getCategoryColor(milestone.category)}`,
                    paddingLeft: 'var(--space-breath)',
                    margin: 0
                  }}>
                    "{milestone.mythologyEntry}"
                  </blockquote>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function IdentityEvolution({ 
  archetypes,
  milestones,
  mythology,
  onArchetypeExplore,
  onMilestoneReflect,
  className = ''
}: IdentityEvolutionProps) {
  const [activeArchetype, setActiveArchetype] = useState<string | null>(null);
  
  return (
    <div className={`identity-evolution ${className}`} style={{
      maxWidth: '1000px',
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
          Identity Evolution
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
          Your journey of becoming. Watch your inner archetypes emerge, develop, and integrate 
          as you spiral through healing and growth.
        </motion.p>
      </div>
      
      {/* Hero's Journey Progress */}
      <HeroJourneyProgress mythology={mythology} />
      
      {/* Identity Constellation */}
      <div style={{
        background: 'rgba(168, 181, 160, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(168, 181, 160, 0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-sanctuary)',
        marginBottom: 'var(--space-rest)',
        position: 'relative',
        minHeight: '400px'
      }}>
        <h3 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-medium)',
          color: 'var(--sanctuary-white)',
          marginBottom: 'var(--space-rest)',
          textAlign: 'center'
        }}>
          🌌 Your Identity Constellation
        </h3>
        
        <div style={{
          position: 'relative',
          width: '100%',
          height: '300px',
          marginBottom: 'var(--space-rest)'
        }}>
          <ConstellationConnections archetypes={archetypes} />
          
          {archetypes.map(archetype => (
            <ArchetypeNode
              key={archetype.id}
              archetype={archetype}
              onExplore={() => {
                setActiveArchetype(archetype.id);
                onArchetypeExplore(archetype.id);
              }}
              isActive={activeArchetype === archetype.id}
            />
          ))}
        </div>
        
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(254, 252, 251, 0.7)',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Click any archetype to explore your development in that area
        </p>
      </div>
      
      {/* Recent Milestones */}
      <MilestoneTimeline
        milestones={milestones}
        onReflect={onMilestoneReflect}
      />
    </div>
  );
}