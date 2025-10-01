'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

interface QuestTheme {
  id: 'name-feel-reframe' | 'past-present-future' | 'fear-courage-action';
  name: string;
  description: string;
  steps: {
    title: string;
    prompt: string;
    placeholder: string;
  }[];
}

interface QuestProgress {
  questId: string;
  theme: string;
  stepsDone: number;
  totalSteps: number;
  responses: Record<string, string>;
  isComplete: boolean;
}

const QUEST_THEMES: QuestTheme[] = [
  {
    id: 'name-feel-reframe',
    name: 'Name → Feel → Reframe',
    description: 'Transform difficult experiences through conscious reflection',
    steps: [
      {
        title: 'Name It',
        prompt: 'What\'s happening right now? Name the situation or feeling without judgment.',
        placeholder: 'I\'m feeling... The situation is...'
      },
      {
        title: 'Feel It',
        prompt: 'Where do you feel this in your body? What sensations do you notice?',
        placeholder: 'In my chest... My shoulders... I notice...'
      },
      {
        title: 'Reframe It',
        prompt: 'What would you tell a dear friend experiencing this same thing?',
        placeholder: 'I would tell them... This means... I can...'
      }
    ]
  },
  {
    id: 'past-present-future',
    name: 'Past → Present → Future',
    description: 'Connect your timeline with wisdom and intention',
    steps: [
      {
        title: 'Honor the Past',
        prompt: 'What from your past is influencing this moment? Acknowledge without judgment.',
        placeholder: 'This reminds me of... I learned... That experience taught me...'
      },
      {
        title: 'Ground in Present',
        prompt: 'What is actually true right now? What resources do you have?',
        placeholder: 'Right now, I have... I can see... I\'m capable of...'
      },
      {
        title: 'Vision the Future',
        prompt: 'How do you want to feel tomorrow? What small step moves you there?',
        placeholder: 'Tomorrow I want to feel... One thing I can do is...'
      }
    ]
  },
  {
    id: 'fear-courage-action',
    name: 'Fear → Courage → Action',
    description: 'Transform fear into fuel for meaningful action',
    steps: [
      {
        title: 'Face the Fear',
        prompt: 'What are you afraid of? Be specific and gentle with yourself.',
        placeholder: 'I\'m afraid that... What scares me is...'
      },
      {
        title: 'Find the Courage',
        prompt: 'When have you been brave before? What strengths can you draw on?',
        placeholder: 'I was brave when... I have the strength to... I remember...'
      },
      {
        title: 'Choose the Action',
        prompt: 'What\'s the smallest brave thing you could do today?',
        placeholder: 'I could try... A small step would be... I will...'
      }
    ]
  }
];

export default function QuestRunner() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<QuestTheme | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [questProgress, setQuestProgress] = useState<QuestProgress | null>(null);
  const { user } = useAuth();

  // Cloud Functions
  const completeQuestStep = httpsCallable(functions, 'completeQuestStep');
  const pauseQuest = httpsCallable(functions, 'pauseQuest');

  const startRandomQuest = () => {
    const randomTheme = QUEST_THEMES[Math.floor(Math.random() * QUEST_THEMES.length)];
    if (randomTheme) {
      setCurrentQuest(randomTheme);
      setCurrentStep(0);
      setResponses({});
      setCurrentResponse('');
      setIsPaused(false);
      setIsOpen(true);
    }
  };

  const handleStepComplete = async () => {
    if (!currentQuest || !user?.uid || !currentResponse.trim()) return;

    setLoading(true);
    try {
      const questId = `quest_${Date.now()}_${currentQuest?.id}`;
      const stepNumber = currentStep + 1;

      const result = await completeQuestStep({
        userId: user.uid,
        questId,
        stepNumber,
        response: currentResponse.trim()
      });

      const data = result.data as any;

      // Update local state
      const newResponses = {
        ...responses,
        [`step${stepNumber}`]: currentResponse.trim()
      };
      setResponses(newResponses);

      if (data.questComplete) {
        // Quest completed!
        setQuestProgress({
          questId,
          theme: currentQuest?.name || '',
          stepsDone: 3,
          totalSteps: 3,
          responses: newResponses,
          isComplete: true
        });
        
        // Show completion state for a moment
        setTimeout(() => {
          setIsOpen(false);
          resetQuest();
        }, 3000);
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
        setCurrentResponse('');
      }

    } catch (error: any) {
      console.error('Error completing quest step:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseQuest = async () => {
    if (!user?.uid || !currentQuest) return;

    try {
      const questId = `quest_${Date.now()}_${currentQuest?.id}`;
      
      await pauseQuest({
        userId: user.uid,
        questId,
        reason: 'user_pause'
      });

      setIsPaused(true);
      
      // Auto-close after showing pause message
      setTimeout(() => {
        setIsOpen(false);
        resetQuest();
      }, 2000);

    } catch (error: any) {
      console.error('Error pausing quest:', error);
    }
  };

  const resetQuest = () => {
    setCurrentQuest(null);
    setCurrentStep(0);
    setResponses({});
    setCurrentResponse('');
    setIsPaused(false);
    setQuestProgress(null);
  };

  const closeQuest = () => {
    setIsOpen(false);
    resetQuest();
  };

  if (!isOpen) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #e5e5e5',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              color: '#2e2e2e',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🧭 Reflection Quests
            </h3>
            <p style={{
              color: '#666',
              fontSize: '0.9rem',
              margin: '0 0 1rem 0'
            }}>
              5-minute guided reflections to transform your inner landscape
            </p>
          </div>
          <button
            onClick={startRandomQuest}
            style={{
              background: '#8ea876',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ✨ Start Quest
          </button>
        </div>
      </div>
    );
  }

  if (isPaused) {
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
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤗</div>
          <h3 style={{ color: '#8ea876', marginBottom: '1rem' }}>
            Taking a pause is self-care
          </h3>
          <p style={{ color: '#666', margin: 0 }}>
            Your progress is saved. Return whenever you're ready.
          </p>
        </div>
      </div>
    );
  }

  if (questProgress?.isComplete) {
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
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ color: '#8ea876', marginBottom: '1rem' }}>
            Quest Complete!
          </h3>
          <p style={{ color: '#2e2e2e', marginBottom: '1rem' }}>
            You went deep with {questProgress.theme}. 
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Micro-badge unlocked • +75 XP
          </p>
        </div>
      </div>
    );
  }

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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#8ea876',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem'
          }}>
            <div>
              <h2 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.3rem',
                fontWeight: 'bold'
              }}>
                {currentQuest?.name}
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                {currentQuest?.description}
              </p>
            </div>
            <button
              onClick={closeQuest}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Progress Pill */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              Step {currentStep + 1} of 3
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              ~5 minutes
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {currentQuest && (
            <div>
              <h3 style={{
                color: '#2e2e2e',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  backgroundColor: '#8ea876',
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
                  {currentStep + 1}
                </span>
                {currentQuest?.steps?.[currentStep]?.title}
              </h3>

              <p style={{
                color: '#2e2e2e',
                marginBottom: '1.5rem',
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                {currentQuest?.steps?.[currentStep]?.prompt}
              </p>

              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder={currentQuest?.steps?.[currentStep]?.placeholder}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #e5e5e5',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '1.5rem'
                }}
                disabled={loading}
              />

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={handlePauseQuest}
                  disabled={loading}
                  style={{
                    background: 'transparent',
                    color: '#666',
                    border: '1px solid #e5e5e5',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  I need a pause
                </button>

                <button
                  onClick={handleStepComplete}
                  disabled={loading || !currentResponse.trim()}
                  style={{
                    background: currentResponse.trim() ? '#8ea876' : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: currentResponse.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? (
                    '⏳ Processing...'
                  ) : currentStep === 2 ? (
                    '✨ Complete Quest'
                  ) : (
                    '→ Next Step'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}