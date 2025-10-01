'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/useAuth';

/**
 * COMMUNITY HEALING CIRCLES
 * Revolutionary anonymous peer support through shared milestones
 * 
 * Core Principles:
 * - Complete anonymity (no usernames, just gentle souls)
 * - Collective progress visualization without individual exposure
 * - Sacred witness model (seeing without fixing)
 * - Always optional, always pauseable
 * - Encouragement without pressure
 */

interface HealingCircle {
  id: string;
  name: string;
  theme: string;
  description: string;
  totalParticipants: number;
  collectiveProgress: number;
  targetProgress: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  circleType: 'boundaries' | 'self_compassion' | 'courage' | 'healing' | 'identity';
  anonymousMessages: {
    id: string;
    message: string;
    timestamp: Date;
    messageType: 'encouragement' | 'wisdom' | 'celebration' | 'support';
    hearts: number;
  }[];
  collectiveEnergy: {
    current: number;
    description: string;
  };
}

interface AnonymousContribution {
  circleId: string;
  contributionType: 'progress' | 'encouragement' | 'wisdom';
  isCompleted: boolean;
  timestamp: Date;
}

interface CommunityHealingCirclesProps {
  userContributions: AnonymousContribution[];
  onJoinCircle: (circleId: string) => Promise<void>;
  onLeaveCircle: (circleId: string) => Promise<void>;
  onSendEncouragement: (circleId: string, message: string) => Promise<void>;
  className?: string;
}

const SAGE_COLORS = {
  whisper: '#f4f6f2',
  breath: '#e8ede4',
  gentle: '#d4dbc9',
  presence: '#c0c9b4',
  wisdom: '#a4b792',
  strength: '#8ea876',
  depth: '#7a9b69',
  mystery: '#667a5c',
  earth: '#4a5a44'
} as const;

const circleAnimations = {
  gentleFloat: {
    initial: { y: 0 },
    animate: { y: [-2, 2, -2] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  },
  collectiveGlow: {
    initial: { scale: 1, opacity: 0.7 },
    animate: { scale: [1, 1.02, 1], opacity: [0.7, 0.9, 0.7] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  },
  heartPulse: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 0.3 }
  }
};

function CollectiveProgressVisualization({ 
  progress, 
  target, 
  participants, 
  theme 
}: { 
  progress: number; 
  target: number; 
  participants: number; 
  theme: string; 
}) {
  const progressPercentage = Math.min((progress / target) * 100, 100);
  
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: 'var(--space-rest)'
    }}>
      {/* Collective Energy Visualization */}
      <motion.div
        style={{
          width: '120px',
          height: '120px',
          margin: '0 auto var(--space-pause) auto',
          position: 'relative'
        }}
        variants={circleAnimations.collectiveGlow}
        initial="initial"
        animate="animate"
      >
        {/* Outer circle - representing community */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `3px solid ${SAGE_COLORS.gentle}`,
          position: 'absolute',
          top: 0,
          left: 0
        }} />
        
        {/* Progress arc */}
        <svg
          width="120"
          height="120"
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke={SAGE_COLORS.wisdom}
            strokeWidth="4"
            strokeDasharray={`${(2 * Math.PI * 55 * progressPercentage) / 100} ${2 * Math.PI * 55}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 1s ease-out',
              filter: 'drop-shadow(0 0 8px rgba(164, 183, 146, 0.4))'
            }}
          />
        </svg>
        
        {/* Center content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            marginBottom: 'var(--space-whisper)'
          }}>
            🫶
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: SAGE_COLORS.mystery,
            fontWeight: 'var(--font-medium)'
          }}>
            {participants} souls
          </div>
        </div>
      </motion.div>
      
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-medium)',
        color: SAGE_COLORS.depth,
        marginBottom: 'var(--space-whisper)'
      }}>
        Collective Progress: {Math.round(progressPercentage)}%
      </h3>
      
      <p style={{
        fontSize: 'var(--text-sm)',
        color: SAGE_COLORS.mystery,
        opacity: 0.8
      }}>
        {progress} / {target} {theme} shared
      </p>
    </div>
  );
}

function AnonymousMessage({ 
  message, 
  onHeart 
}: { 
  message: HealingCircle['anonymousMessages'][0]; 
  onHeart: () => void; 
}) {
  const [hasHearted, setHasHearted] = useState(false);
  
  const getMessageIcon = (type: string) => {
    const icons = {
      encouragement: '🌿',
      wisdom: '💫',
      celebration: '✨',
      support: '🤗'
    };
    return icons[type] || '💚';
  };
  
  const handleHeart = () => {
    if (!hasHearted) {
      setHasHearted(true);
      onHeart();
    }
  };
  
  return (
    <motion.div
      style={{
        background: 'rgba(254, 252, 251, 0.05)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-pause)',
        marginBottom: 'var(--space-breath)',
        border: '1px solid rgba(254, 252, 251, 0.1)'
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-breath)'
      }}>
        <div style={{
          fontSize: 'var(--text-lg)',
          marginTop: 'var(--space-whisper)'
        }}>
          {getMessageIcon(message.messageType)}
        </div>
        
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(254, 252, 251, 0.9)',
            lineHeight: 'var(--leading-relaxed)',
            margin: '0 0 var(--space-breath) 0'
          }}>
            {message.message}
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(254, 252, 251, 0.6)'
            }}>
              Anonymous Soul • {message.timestamp.toLocaleDateString()}
            </span>
            
            <motion.button
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-whisper)',
                cursor: hasHearted ? 'default' : 'pointer',
                padding: 'var(--space-whisper)',
                borderRadius: 'var(--radius-sm)',
                opacity: hasHearted ? 0.6 : 1
              }}
              onClick={handleHeart}
              disabled={hasHearted}
              variants={circleAnimations.heartPulse}
              whileTap="animate"
            >
              <span style={{
                color: hasHearted ? SAGE_COLORS.wisdom : 'rgba(254, 252, 251, 0.7)',
                transition: 'color 0.2s ease'
              }}>
                💚
              </span>
              <span style={{
                fontSize: 'var(--text-xs)',
                color: 'rgba(254, 252, 251, 0.7)'
              }}>
                {message.hearts + (hasHearted ? 1 : 0)}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HealingCircleCard({ 
  circle, 
  isParticipating, 
  onJoin, 
  onLeave, 
  onSendEncouragement 
}: {
  circle: HealingCircle;
  isParticipating: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onSendEncouragement: (message: string) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  
  const getCircleIcon = (type: string) => {
    const icons = {
      boundaries: '🏔️',
      self_compassion: '🌸',
      courage: '🦋',
      healing: '🌿',
      identity: '🦢'
    };
    return icons[type] || '💚';
  };
  
  const handleSendEncouragement = () => {
    if (encouragementMessage.trim()) {
      onSendEncouragement(encouragementMessage.trim());
      setEncouragementMessage('');
      setShowMessageForm(false);
    }
  };
  
  return (
    <motion.div
      style={{
        background: 'rgba(168, 181, 160, 0.1)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${SAGE_COLORS.gentle}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-sanctuary)',
        marginBottom: 'var(--space-rest)'
      }}
      variants={circleAnimations.gentleFloat}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.01 }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-pause)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-pause)'
        }}>
          <div style={{
            fontSize: '2rem',
            filter: 'drop-shadow(0 2px 4px rgba(168, 181, 160, 0.3))'
          }}>
            {getCircleIcon(circle.circleType)}
          </div>
          
          <div>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--sanctuary-white)',
              marginBottom: 'var(--space-whisper)'
            }}>
              {circle.name}
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'rgba(254, 252, 251, 0.8)'
            }}>
              {circle.theme}
            </p>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'rgba(254, 252, 251, 0.7)'
        }}>
          <div>{circle.totalParticipants}</div>
          <div>participants</div>
        </div>
      </div>
      
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'rgba(254, 252, 251, 0.9)',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-rest)'
      }}>
        {circle.description}
      </p>
      
      <CollectiveProgressVisualization
        progress={circle.collectiveProgress}
        target={circle.targetProgress}
        participants={circle.totalParticipants}
        theme={circle.theme}
      />
      
      <div style={{
        display: 'flex',
        gap: 'var(--space-breath)',
        marginBottom: 'var(--space-rest)'
      }}>
        {!isParticipating ? (
          <button
            onClick={onJoin}
            style={{
              flex: 1,
              background: SAGE_COLORS.wisdom,
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
            Join Circle
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              style={{
                flex: 1,
                background: 'transparent',
                border: `1px solid ${SAGE_COLORS.gentle}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-pause)',
                color: 'rgba(254, 252, 251, 0.9)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Send Encouragement
            </button>
            <button
              onClick={onLeave}
              style={{
                background: 'transparent',
                border: `1px solid rgba(254, 252, 251, 0.3)`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-pause)',
                color: 'rgba(254, 252, 251, 0.7)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer'
              }}
            >
              Leave Quietly
            </button>
          </>
        )}
      </div>
      
      {/* Encouragement Message Form */}
      <AnimatePresence>
        {showMessageForm && isParticipating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 'var(--space-rest)' }}
          >
            <textarea
              value={encouragementMessage}
              onChange={(e) => setEncouragementMessage(e.target.value)}
              placeholder="Share a gentle word of encouragement... (completely anonymous)"
              style={{
                width: '100%',
                minHeight: '80px',
                background: 'rgba(254, 252, 251, 0.1)',
                border: '1px solid rgba(254, 252, 251, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-pause)',
                color: 'rgba(254, 252, 251, 0.9)',
                fontSize: 'var(--text-sm)',
                resize: 'vertical',
                marginBottom: 'var(--space-breath)'
              }}
              maxLength={280}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                color: 'rgba(254, 252, 251, 0.6)'
              }}>
                {encouragementMessage.length}/280 • Sent anonymously
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-breath)' }}>
                <button
                  onClick={() => setShowMessageForm(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(254, 252, 251, 0.7)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEncouragement}
                  disabled={!encouragementMessage.trim()}
                  style={{
                    background: encouragementMessage.trim() ? SAGE_COLORS.wisdom : 'rgba(254, 252, 251, 0.2)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-whisper) var(--space-breath)',
                    color: 'var(--sanctuary-white)',
                    fontSize: 'var(--text-sm)',
                    cursor: encouragementMessage.trim() ? 'pointer' : 'not-allowed',
                    opacity: encouragementMessage.trim() ? 1 : 0.5
                  }}
                >
                  Send Love
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recent Anonymous Messages */}
      {isParticipating && circle.anonymousMessages.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(254, 252, 251, 0.1)',
          paddingTop: 'var(--space-rest)'
        }}>
          <h4 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'rgba(254, 252, 251, 0.9)',
            marginBottom: 'var(--space-pause)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-breath)'
          }}>
            <span>💬</span>
            Circle Encouragement
          </h4>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {circle.anonymousMessages.slice(0, 5).map(message => (
              <AnonymousMessage
                key={message.id}
                message={message}
                onHeart={() => console.log('Heart added')}
              />
            ))}
          </div>
          
          {circle.anonymousMessages.length > 5 && (
            <button
              onClick={() => setShowDetails(true)}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(254, 252, 251, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-breath)',
                color: 'rgba(254, 252, 251, 0.7)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                marginTop: 'var(--space-breath)'
              }}
            >
              View More Messages ({circle.anonymousMessages.length - 5})
            </button>
          )}
        </div>
      )}
      
      {/* Participation Status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 'var(--space-pause)',
        borderTop: '1px solid rgba(254, 252, 251, 0.1)',
        fontSize: 'var(--text-xs)',
        color: 'rgba(254, 252, 251, 0.6)'
      }}>
        <span>
          {isParticipating ? 'You are part of this healing circle' : 'Invitation open'}
        </span>
        <span>
          Ends {circle.endDate.toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}

export default function CommunityHealingCircles({ 
  userContributions,
  onJoinCircle,
  onLeaveCircle,
  onSendEncouragement,
  className = ''
}: CommunityHealingCirclesProps) {
  const { user } = useAuth();
  
  // Mock data - in production this would come from Firebase
  const [circles] = useState<HealingCircle[]>([
    {
      id: 'boundaries_season',
      name: 'Boundaries Season',
      theme: 'Healthy Boundaries',
      description: 'A gentle exploration of setting and maintaining healthy boundaries in relationships, work, and self-care. We witness each other\'s growth without judgment.',
      totalParticipants: 127,
      collectiveProgress: 342,
      targetProgress: 500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isActive: true,
      circleType: 'boundaries',
      anonymousMessages: [
        {
          id: 'msg1',
          message: 'Setting my first boundary with family felt scary but so necessary. You all inspired me to try.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          messageType: 'celebration',
          hearts: 12
        },
        {
          id: 'msg2',
          message: 'Reminder: saying no to others means saying yes to yourself. Your needs matter too.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          messageType: 'wisdom',
          hearts: 8
        }
      ],
      collectiveEnergy: {
        current: 68,
        description: 'Strong and supportive'
      }
    },
    {
      id: 'self_compassion',
      name: 'Self-Compassion Circle',
      theme: 'Inner Kindness',
      description: 'Learning to treat ourselves with the same kindness we would offer a dear friend. Small acts of self-compassion create ripples of healing.',
      totalParticipants: 89,
      collectiveProgress: 234,
      targetProgress: 400,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      circleType: 'self_compassion',
      anonymousMessages: [
        {
          id: 'msg3',
          message: 'Today I spoke to myself like I would to my best friend going through a hard time. It felt revolutionary.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          messageType: 'celebration',
          hearts: 15
        }
      ],
      collectiveEnergy: {
        current: 72,
        description: 'Gentle and nurturing'
      }
    }
  ]);
  
  const [participatingCircles] = useState<string[]>(['boundaries_season']);
  
  const handleJoinCircle = async (circleId: string) => {
    try {
      await onJoinCircle(circleId);
    } catch (error) {
      console.error('Error joining circle:', error);
    }
  };
  
  const handleLeaveCircle = async (circleId: string) => {
    try {
      await onLeaveCircle(circleId);
    } catch (error) {
      console.error('Error leaving circle:', error);
    }
  };
  
  const handleSendEncouragement = async (circleId: string, message: string) => {
    try {
      await onSendEncouragement(circleId, message);
    } catch (error) {
      console.error('Error sending encouragement:', error);
    }
  };
  
  if (!user) {
    return (
      <div className={`community-healing-loading ${className}`} style={{
        textAlign: 'center',
        padding: 'var(--space-sanctuary)',
        color: 'rgba(254, 252, 251, 0.6)'
      }}>
        <div style={{ marginBottom: 'var(--space-pause)' }}>🫶</div>
        <p>Loading healing circles...</p>
      </div>
    );
  }
  
  return (
    <div className={`community-healing-circles ${className}`} style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'var(--space-sanctuary)'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-sanctuary)',
        padding: 'var(--space-rest) 0'
      }}>
        <motion.h2
          style={{
            fontSize: '2rem',
            fontWeight: 'var(--font-light)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-pause)',
            letterSpacing: '-0.02em'
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Healing Circles
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
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Anonymous spaces for mutual support and shared healing. No names, no judgment, just gentle souls witnessing each other's growth.
        </motion.p>
      </div>
      
      {/* Sacred Privacy Notice */}
      <motion.div
        style={{
          background: 'rgba(168, 181, 160, 0.2)',
          border: `1px solid ${SAGE_COLORS.wisdom}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-rest)',
          marginBottom: 'var(--space-sanctuary)',
          textAlign: 'center'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div style={{
          fontSize: '1.5rem',
          marginBottom: 'var(--space-breath)'
        }}>
          🛡️
        </div>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(254, 252, 251, 0.9)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-breath)'
        }}>
          <strong>Sacred Anonymity Promise:</strong> Your identity is never revealed. 
          Messages appear as "Anonymous Soul." You can leave anytime without explanation.
        </p>
        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'rgba(254, 252, 251, 0.7)'
        }}>
          Always pause-friendly • No pressure • Pure mutual support
        </p>
      </motion.div>
      
      {/* Active Circles */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-rest)'
      }}>
        {circles.filter(circle => circle.isActive).map((circle, index) => (
          <motion.div
            key={circle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          >
            <HealingCircleCard
              circle={circle}
              isParticipating={participatingCircles.includes(circle.id)}
              onJoin={() => handleJoinCircle(circle.id)}
              onLeave={() => handleLeaveCircle(circle.id)}
              onSendEncouragement={(message) => handleSendEncouragement(circle.id, message)}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        paddingTop: 'var(--space-sanctuary)',
        borderTop: '1px solid rgba(254, 252, 251, 0.1)',
        marginTop: 'var(--space-sanctuary)'
      }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(254, 252, 251, 0.6)',
          fontStyle: 'italic'
        }}>
          "We heal in relationship with others. Your presence here matters."
        </p>
      </div>
    </div>
  );
}