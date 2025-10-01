'use client';

import { useState } from 'react';
import { useStreaks } from '@/lib/useStreaks';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPause: (reason: string, days: number) => Promise<void>;
}

function PauseModal({ isOpen, onClose, onPause }: PauseModalProps) {
  const [reason, setReason] = useState('processing');
  const [plannedDays, setPlannedDays] = useState(7);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePause = async () => {
    setLoading(true);
    try {
      await onPause(reason, plannedDays);
      onClose();
    } catch (error) {
      console.error('Error requesting pause:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '100%',
        padding: '2rem'
      }}>
        <h3 style={{
          color: '#8ea876',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🤗 Taking a Kindness Break
        </h3>
        
        <p style={{
          color: '#2e2e2e',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          Sometimes we need to pause. Your streak will be safely preserved, 
          and you'll get bonus XP when you return.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            display: 'block'
          }}>
            What's happening for you?
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5',
              fontSize: '0.9rem'
            }}
          >
            <option value="processing">Processing something difficult</option>
            <option value="overwhelmed">Feeling overwhelmed</option>
            <option value="busy">Life is really busy right now</option>
            <option value="grief">Working through grief or loss</option>
            <option value="other">Other reason</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            display: 'block'
          }}>
            How long do you think you'll need?
          </label>
          <select
            value={plannedDays}
            onChange={(e) => setPlannedDays(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5',
              fontSize: '0.9rem'
            }}
          >
            <option value={3}>A few days (3 days)</option>
            <option value={7}>About a week (7 days)</option>
            <option value={14}>A couple weeks (14 days)</option>
            <option value={30}>About a month (30 days)</option>
          </select>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#666',
              border: '1px solid #e5e5e5',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Not now
          </button>
          
          <button
            onClick={handlePause}
            disabled={loading}
            style={{
              background: '#8ea876',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Setting up...' : 'Take a pause'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StreakDisplay() {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeConfirm, setShowResumeConfirm] = useState(false);
  
  const {
    streakData,
    recentXP,
    loading,
    error,
    pauseStreak,
    resumeStreak,
    getStreakMessage,
    getGraceTokenMessage,
    isRecoveryMultiplierActive,
    getRecoveryTimeLeft
  } = useStreaks();

  const handlePause = async (reason: string, days: number) => {
    try {
      await pauseStreak(reason, days);
    } catch (error) {
      console.error('Error pausing streak:', error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeStreak();
      setShowResumeConfirm(false);
    } catch (error) {
      console.error('Error resuming streak:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-sanctuary-white rounded-2xl p-8 border border-sanctuary-gray-200 mb-8 shadow-whisper">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 bg-sage-400 rounded-full animate-gentle-pulse"></div>
          <span className="text-sanctuary-gray-700 font-medium">Loading your journey...</span>
        </div>
      </div>
    );
  }

  if (error || !streakData) {
    return (
      <div className="bg-gentle-rose/10 rounded-2xl p-8 border-2 border-gentle-rose/30 mb-8">
        <div className="flex items-center justify-center space-x-3 text-gentle-rose">
          <div className="w-8 h-8 bg-gentle-rose/20 rounded-full flex items-center justify-center">
            <span className="text-sm">⚠️</span>
          </div>
          <span className="font-medium">Unable to load your journey data</span>
        </div>
      </div>
    );
  }

  const isRecoveryActive = isRecoveryMultiplierActive(streakData);
  const recoveryDaysLeft = getRecoveryTimeLeft(streakData);

  return (
    <div className={`
      ${streakData.streakFrozen 
        ? 'bg-sage-50 border-2 border-sage-400' 
        : 'bg-sanctuary-white border border-sanctuary-gray-200'
      }
      rounded-3xl p-8 mb-8 shadow-soft transition-all duration-400
    `}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center
            ${streakData.streakFrozen 
              ? 'bg-sage-100' 
              : 'bg-sanctuary-gray-50'
            }
          `}>
            <span className="text-2xl">
              {streakData.streakFrozen ? '🤗' : '🔥'}
            </span>
          </div>
          <h3 className="text-2xl font-light text-sanctuary-gray-900 m-0">
            {streakData.streakFrozen ? 'Gentle Pause' : 'Your Journey'}
          </h3>
        </div>
        
        {!streakData.streakFrozen ? (
          <button
            onClick={() => setShowPauseModal(true)}
            className="
              bg-transparent text-sage-600 border border-sage-300 
              px-6 py-3 rounded-xl text-sm font-medium
              hover:bg-sage-50 hover:border-sage-400
              transition-all duration-300 
              focus:outline-none focus:ring-2 focus:ring-sage-400/25
            "
          >
            Pause if needed
          </button>
        ) : (
          <button
            onClick={() => setShowResumeConfirm(true)}
            className="
              bg-sage-400 text-white border-none
              px-6 py-3 rounded-xl text-sm font-medium
              hover:bg-sage-500 shadow-soft
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-sage-400/25
            "
          >
            Ready to return
          </button>
        )}
      </div>

      {streakData.streakFrozen ? (
        /* Paused State */
        <div className="text-center py-16">
          <div className="space-y-8">
            <div className="w-24 h-24 bg-sage-100 rounded-full mx-auto flex items-center justify-center mb-8">
              <span className="text-4xl">🌱</span>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <h4 className="text-xl font-medium text-sanctuary-gray-900 m-0">
                Rest is sacred
              </h4>
              <p className="text-sanctuary-gray-600 leading-relaxed">
                Your {streakData.current}-day journey is safely held. When you return, 
                you'll receive welcome-back energy to honor your self-compassion.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Active State */
        <div>
          {/* Current Streak */}
          <div className="text-center py-12 space-y-6">
            <div className="space-y-4">
              <div className="text-7xl font-extralight text-sage-500 tracking-tight">
                {streakData.current}
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <p className="text-lg text-sanctuary-gray-800 font-medium">
                  {getStreakMessage(streakData)}
                </p>
                {streakData.longest > streakData.current && (
                  <p className="text-sm text-sanctuary-gray-500">
                    Your longest journey: {streakData.longest} days
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recovery Multiplier */}
          {isRecoveryActive && (
            <div className="bg-warm-amber/10 border-2 border-warm-amber/30 rounded-2xl p-6 mb-8 text-center">
              <div className="w-16 h-16 bg-warm-amber/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div className="space-y-2">
                <p className="text-warm-amber font-semibold">
                  Welcome back energy active
                </p>
                <p className="text-sanctuary-gray-700 text-sm">
                  1.5× strength for the next {recoveryDaysLeft} day{recoveryDaysLeft !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}

          {/* Grace Tokens */}
          <div className="bg-sanctuary-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h5 className="text-sanctuary-gray-900 font-medium m-0">
                  Grace Days
                </h5>
                <p className="text-sanctuary-gray-600 text-sm m-0">
                  {getGraceTokenMessage(streakData.graceTokens)}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {[0, 1].map(i => (
                  <div
                    key={i}
                    className={`
                      w-4 h-4 rounded-full transition-all duration-300
                      ${i < streakData.graceTokens 
                        ? 'bg-sage-400 shadow-soft' 
                        : 'bg-sanctuary-gray-200'
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentXP.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sanctuary-gray-900 font-medium m-0">
            Recent Growth
          </h4>
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {recentXP.slice(0, 3).map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-sanctuary-gray-50 rounded-xl"
              >
                <span className="text-sanctuary-gray-700 text-sm">
                  {event.description}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sage-600 font-semibold text-sm">
                    +{event.amount}
                  </span>
                  {event.multiplier > 1 && (
                    <span className="bg-warm-amber text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {event.multiplier}×
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gentle Encouragement */}
      <div className="bg-sage-50/50 rounded-2xl p-6 mt-8 text-center border border-sage-100">
        <div className="space-y-3">
          <div className="w-8 h-8 bg-sage-100 rounded-full mx-auto flex items-center justify-center">
            <span className="text-sage-600 text-sm">✨</span>
          </div>
          <p className="text-sanctuary-gray-800 font-medium m-0">
            {streakData.streakFrozen 
              ? 'Rest is sacred growth'
              : 'Each moment of care matters'
            }
          </p>
          <p className="text-sanctuary-gray-600 text-sm m-0 max-w-xs mx-auto leading-relaxed">
            {streakData.streakFrozen
              ? 'Honoring your rhythm is the highest form of self-wisdom.'
              : 'Your gentle consistency is transforming you in ways you cannot yet see.'
            }
          </p>
        </div>
      </div>

      {/* Pause Modal */}
      <PauseModal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onPause={handlePause}
      />

      {/* Resume Confirmation */}
      {showResumeConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌟</div>
            <h3 style={{
              color: '#8ea876',
              marginBottom: '1rem'
            }}>
              Ready to return?
            </h3>
            <p style={{
              color: '#2e2e2e',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              Welcome back. Your next entries will get bonus XP, 
              and your grace days are refreshed.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={() => setShowResumeConfirm(false)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #e5e5e5',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Not yet
              </button>
              
              <button
                onClick={handleResume}
                style={{
                  background: '#8ea876',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                I'm ready ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}