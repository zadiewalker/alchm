'use client';

import React, { useState } from 'react';
import { GraceStreakManager, CompassionateDisplay, StreakData, KindnessBreak } from '@/lib/gamification/grace-streaks';

interface StreakDisplayProps {
  streakData: StreakData;
  onGraceTokenUse: (reason?: string) => void;
  onKindnessBreak: (reason: KindnessBreak['reason'], note?: string) => void;
  className?: string;
}

export default function StreakDisplay({ 
  streakData, 
  onGraceTokenUse, 
  onKindnessBreak,
  className = '' 
}: StreakDisplayProps) {
  const [showGraceModal, setShowGraceModal] = useState(false);
  const [showKindnessModal, setShowKindnessModal] = useState(false);
  const [graceReason, setGraceReason] = useState('');
  const [kindnessReason, setKindnessReason] = useState<KindnessBreak['reason']>('mental_health');
  const [kindnessNote, setKindnessNote] = useState('');

  const display = CompassionateDisplay.formatStreakDisplay(streakData);
  const { streak, isGraceProtected, message } = GraceStreakManager.calculateCurrentStreak(streakData);

  const handleGraceUse = () => {
    onGraceTokenUse(graceReason || 'Needed grace today');
    setShowGraceModal(false);
    setGraceReason('');
  };

  const handleKindnessBreak = () => {
    onKindnessBreak(kindnessReason, kindnessNote || undefined);
    setShowKindnessModal(false);
    setKindnessNote('');
  };

  return (
    <>
      <div className={`card-sanctuary streak-sanctuary ${className}`} style={{
        background: 'rgba(168, 181, 160, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(168, 181, 160, 0.2)',
        padding: 'var(--space-sanctuary)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Gentle background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 20%, rgba(168, 181, 160, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(168, 181, 160, 0.05) 0%, transparent 50%)`,
          pointerEvents: 'none'
        }} />

        {/* Streak Status */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            marginBottom: 'var(--space-rest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-breath)'
          }}>
            {/* Gentle rhythm indicator */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isGraceProtected 
                ? 'linear-gradient(135deg, var(--sage-400), var(--sage-500))'
                : 'linear-gradient(135deg, var(--sage-300), var(--sage-400))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-sm)',
              animation: 'breathe 4s ease-in-out infinite'
            }}>
              🌿
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--sanctuary-white)',
                marginBottom: 'var(--space-whisper)',
                letterSpacing: 'var(--tracking-wide)'
              }}>
                {display.primaryText}
              </h3>
              
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'rgba(254, 252, 251, 0.8)',
                lineHeight: 'var(--leading-relaxed)',
                margin: 0
              }}>
                {display.secondaryText}
              </p>
            </div>
          </div>

          {/* Grace Tokens Display */}
          {display.showGraceTokens && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-pause)',
              marginBottom: 'var(--space-rest)',
              padding: 'var(--space-pause)',
              background: 'rgba(254, 252, 251, 0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(254, 252, 251, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                gap: 'var(--space-breath)'
              }}>
                {[...Array(display.graceCount)].map((_, i) => (
                  <div key={i} style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--sage-400), var(--sage-500))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-xs)'
                  }}>
                    💝
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sanctuary-white)',
                  margin: 0
                }}>
                  {display.graceCount} grace token{display.graceCount !== 1 ? 's' : ''} available
                </p>
                <p style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(254, 252, 251, 0.7)',
                  margin: 0
                }}>
                  Protection when you need it most
                </p>
              </div>
            </div>
          )}

          {/* Compassionate Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-breath)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {display.showGraceTokens && (
              <button
                onClick={() => setShowGraceModal(true)}
                className="btn-base btn-secondary"
                style={{
                  fontSize: 'var(--text-sm)',
                  padding: 'var(--space-breath) var(--space-pause)',
                  background: 'rgba(168, 181, 160, 0.2)',
                  border: '1px solid rgba(168, 181, 160, 0.3)',
                  color: 'var(--sanctuary-white)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}
              >
                Use Grace Token
              </button>
            )}
            
            <button
              onClick={() => setShowKindnessModal(true)}
              className="btn-base btn-tertiary"
              style={{
                fontSize: 'var(--text-sm)',
                padding: 'var(--space-breath) var(--space-pause)',
                background: 'transparent',
                border: '1px solid rgba(254, 252, 251, 0.2)',
                color: 'rgba(254, 252, 251, 0.8)',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.2s var(--ease-sanctuary)'
              }}
            >
              I need a kindness break
            </button>
          </div>
        </div>
      </div>

      {/* Grace Token Modal */}
      {showGraceModal && (
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
            border: '1px solid rgba(168, 181, 160, 0.3)',
            padding: 'var(--space-sanctuary)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--sanctuary-white)',
              marginBottom: 'var(--space-rest)',
              textAlign: 'center'
            }}>
              Grace flows freely here
            </h3>
            
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'rgba(254, 252, 251, 0.8)',
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 'var(--space-rest)',
              textAlign: 'center'
            }}>
              {CompassionateDisplay.getGraceTokenExplanation()}
            </p>
            
            <textarea
              value={graceReason}
              onChange={(e) => setGraceReason(e.target.value)}
              placeholder="Why do you need grace today? (optional)"
              style={{
                width: '100%',
                minHeight: '80px',
                padding: 'var(--space-pause)',
                background: 'rgba(254, 252, 251, 0.1)',
                border: '1px solid rgba(254, 252, 251, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--sanctuary-white)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                marginBottom: 'var(--space-rest)',
                resize: 'vertical'
              }}
            />
            
            <div style={{
              display: 'flex',
              gap: 'var(--space-breath)',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowGraceModal(false)}
                className="btn-base btn-tertiary"
                style={{
                  padding: 'var(--space-breath) var(--space-pause)',
                  background: 'transparent',
                  border: '1px solid rgba(254, 252, 251, 0.2)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                Not now
              </button>
              
              <button
                onClick={handleGraceUse}
                className="btn-base btn-primary"
                style={{
                  padding: 'var(--space-breath) var(--space-pause)',
                  background: 'var(--sage-600)',
                  border: '1px solid var(--sage-500)',
                  color: 'var(--sanctuary-white)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)'
                }}
              >
                Receive grace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kindness Break Modal */}
      {showKindnessModal && (
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
            border: '1px solid rgba(168, 181, 160, 0.3)',
            padding: 'var(--space-sanctuary)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--sanctuary-white)',
              marginBottom: 'var(--space-rest)',
              textAlign: 'center'
            }}>
              Take all the time you need
            </h3>
            
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'rgba(254, 252, 251, 0.8)',
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 'var(--space-rest)',
              textAlign: 'center'
            }}>
              Your progress is safe. Your streak is protected. Come back when you're ready.
            </p>
            
            <div style={{ marginBottom: 'var(--space-rest)' }}>
              <label style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--sanctuary-white)',
                marginBottom: 'var(--space-breath)',
                display: 'block'
              }}>
                What brings you to this pause?
              </label>
              
              <select
                value={kindnessReason}
                onChange={(e) => setKindnessReason(e.target.value as KindnessBreak['reason'])}
                style={{
                  width: '100%',
                  padding: 'var(--space-pause)',
                  background: 'rgba(254, 252, 251, 0.1)',
                  border: '1px solid rgba(254, 252, 251, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--sanctuary-white)',
                  fontSize: 'var(--text-sm)',
                  marginBottom: 'var(--space-rest)'
                }}
              >
                <option value="mental_health">Taking care of my mental health</option>
                <option value="life_event">Life event or transition</option>
                <option value="burnout">Feeling burned out</option>
                <option value="celebration">Celebrating something special</option>
                <option value="other">Something else</option>
              </select>
            </div>
            
            <textarea
              value={kindnessNote}
              onChange={(e) => setKindnessNote(e.target.value)}
              placeholder="A note of self-compassion (optional)"
              style={{
                width: '100%',
                minHeight: '60px',
                padding: 'var(--space-pause)',
                background: 'rgba(254, 252, 251, 0.1)',
                border: '1px solid rgba(254, 252, 251, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--sanctuary-white)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-relaxed)',
                marginBottom: 'var(--space-rest)',
                resize: 'vertical'
              }}
            />
            
            <div style={{
              display: 'flex',
              gap: 'var(--space-breath)',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowKindnessModal(false)}
                className="btn-base btn-tertiary"
                style={{
                  padding: 'var(--space-breath) var(--space-pause)',
                  background: 'transparent',
                  border: '1px solid rgba(254, 252, 251, 0.2)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                Not yet
              </button>
              
              <button
                onClick={handleKindnessBreak}
                className="btn-base btn-primary"
                style={{
                  padding: 'var(--space-breath) var(--space-pause)',
                  background: 'var(--sage-600)',
                  border: '1px solid var(--sage-500)',
                  color: 'var(--sanctuary-white)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)'
                }}
              >
                Begin kindness break
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}