'use client';

import React, { useState, useEffect } from 'react';
import { 
  ReflectionQuest, 
  ReflectionQuestEngine, 
  EscapeHatch, 
  AlternativePrompt,
  QuestProgress 
} from '@/lib/gamification/reflection-quests';

interface QuestRunnerProps {
  quest: ReflectionQuest;
  onComplete: (response: string, mood?: string, rating?: number) => void;
  onSkip: (reason: string) => void;
  onEscapeHatch: (hatch: EscapeHatch) => void;
  className?: string;
}

export default function QuestRunner({ 
  quest, 
  onComplete, 
  onSkip, 
  onEscapeHatch,
  className = '' 
}: QuestRunnerProps) {
  const [response, setResponse] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(quest.prompt);
  const [currentTitle, setCurrentTitle] = useState(quest.title);
  const [showEscapeHatches, setShowEscapeHatches] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativePrompt | null>(null);
  const [mood, setMood] = useState<string>('');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  
  const [isWriting, setIsWriting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  useEffect(() => {
    const words = response.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [response]);
  
  const handleResponseChange = (value: string) => {
    setResponse(value);
    setIsWriting(true);
    
    // Auto-hide escape options when user starts writing
    if (value.length > 20) {
      setShowEscapeHatches(false);
    }
  };
  
  const handleAlternativeSelect = (alternative: AlternativePrompt) => {
    setCurrentPrompt(alternative.prompt);
    setCurrentTitle(alternative.title);
    setSelectedAlternative(alternative);
    setShowAlternatives(false);
    setShowEscapeHatches(false);
  };
  
  const handleComplete = () => {
    onComplete(response, mood || undefined, undefined);
  };
  
  const handleQuickSkip = () => {
    onSkip('not_ready');
  };
  
  const getCategoryIcon = (category: string) => {
    const icons = {
      healing: '🌿',
      growth: '🦋',
      connection: '🤝',
      purpose: '✨',
      celebration: '🎉'
    };
    return icons[category] || '💭';
  };
  
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      gentle: 'rgba(168, 181, 160, 0.3)',
      moderate: 'rgba(168, 181, 160, 0.5)',
      deep: 'rgba(168, 181, 160, 0.7)'
    };
    return colors[difficulty] || colors.gentle;
  };
  
  const moodOptions = [
    { value: 'peaceful', emoji: '😌', label: 'Peaceful' },
    { value: 'curious', emoji: '🤔', label: 'Curious' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful' },
    { value: 'hopeful', emoji: '🌅', label: 'Hopeful' },
    { value: 'processing', emoji: '💭', label: 'Processing' },
    { value: 'overwhelmed', emoji: '🌊', label: 'Overwhelmed' },
    { value: 'tender', emoji: '🌸', label: 'Tender' }
  ];

  return (
    <div className={`card-sanctuary quest-sanctuary ${className}`} style={{
      background: 'rgba(168, 181, 160, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 181, 160, 0.2)',
      padding: 'var(--space-sanctuary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Quest Header */}
      <header style={{ marginBottom: 'var(--space-rest)' }}>
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
            background: getDifficultyColor(quest.difficulty),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-lg)'
          }}>
            {getCategoryIcon(quest.category)}
          </div>
          
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--sanctuary-white)',
              marginBottom: 'var(--space-whisper)'
            }}>
              {currentTitle}
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-pause)',
              fontSize: 'var(--text-xs)',
              color: 'rgba(254, 252, 251, 0.7)'
            }}>
              <span>{quest.estimatedTime}</span>
              <span>•</span>
              <span>{quest.difficulty} reflection</span>
              <span>•</span>
              <span>{quest.category}</span>
            </div>
          </div>
        </div>
        
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(254, 252, 251, 0.9)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-rest)'
        }}>
          {quest.description}
        </p>
        
        {/* Always-visible escape options */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-breath)',
          marginBottom: 'var(--space-rest)'
        }}>
          {!isWriting && (
            <>
              <button
                onClick={handleQuickSkip}
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: 'var(--space-whisper) var(--space-breath)',
                  background: 'transparent',
                  border: '1px solid rgba(254, 252, 251, 0.3)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}
              >
                Skip this one
              </button>
              
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: 'var(--space-whisper) var(--space-breath)',
                  background: 'transparent',
                  border: '1px solid rgba(254, 252, 251, 0.3)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}
              >
                Different approach
              </button>
              
              <button
                onClick={() => setShowEscapeHatches(!showEscapeHatches)}
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: 'var(--space-whisper) var(--space-breath)',
                  background: 'transparent',
                  border: '1px solid rgba(254, 252, 251, 0.3)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}
              >
                I need help
              </button>
            </>
          )}
        </div>
      </header>

      {/* Alternatives Panel */}
      {showAlternatives && (
        <div style={{
          background: 'rgba(254, 252, 251, 0.05)',
          border: '1px solid rgba(254, 252, 251, 0.1)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-pause)',
          marginBottom: 'var(--space-rest)'
        }}>
          <h4 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-breath)'
          }}>
            Try a different approach:
          </h4>
          
          <div style={{
            display: 'grid',
            gap: 'var(--space-breath)'
          }}>
            {quest.alternatives.map((alternative) => (
              <button
                key={alternative.id}
                onClick={() => handleAlternativeSelect(alternative)}
                style={{
                  padding: 'var(--space-pause)',
                  background: 'rgba(254, 252, 251, 0.05)',
                  border: '1px solid rgba(254, 252, 251, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}
              >
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sanctuary-white)',
                  marginBottom: 'var(--space-whisper)'
                }}>
                  {alternative.title}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {alternative.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Escape Hatches Panel */}
      {showEscapeHatches && (
        <div style={{
          background: 'rgba(254, 252, 251, 0.05)',
          border: '1px solid rgba(254, 252, 251, 0.1)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-pause)',
          marginBottom: 'var(--space-rest)'
        }}>
          <h4 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--sanctuary-white)',
            marginBottom: 'var(--space-breath)'
          }}>
            It's okay to need something different:
          </h4>
          
          <div style={{
            display: 'grid',
            gap: 'var(--space-breath)'
          }}>
            {quest.escapeHatches.map((hatch) => (
              <button
                key={hatch.id}
                onClick={() => onEscapeHatch(hatch)}
                style={{
                  padding: 'var(--space-pause)',
                  background: 'rgba(254, 252, 251, 0.05)',
                  border: '1px solid rgba(254, 252, 251, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}
              >
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sanctuary-white)',
                  marginBottom: 'var(--space-whisper)'
                }}>
                  {hatch.title}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(254, 252, 251, 0.8)',
                  lineHeight: 'var(--leading-relaxed)'
                }}>
                  {hatch.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Prompt */}
      <div style={{ marginBottom: 'var(--space-rest)' }}>
        <div style={{
          background: 'rgba(254, 252, 251, 0.05)',
          border: '1px solid rgba(254, 252, 251, 0.1)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-pause)',
          marginBottom: 'var(--space-rest)'
        }}>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--sanctuary-white)',
            lineHeight: 'var(--leading-relaxed)',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            "{currentPrompt}"
          </p>
        </div>

        {/* Writing Area */}
        <div style={{ position: 'relative' }}>
          <textarea
            value={response}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Let your thoughts flow... There's no wrong way to respond."
            style={{
              width: '100%',
              minHeight: '200px',
              padding: 'var(--space-pause)',
              background: 'rgba(254, 252, 251, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(254, 252, 251, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--sanctuary-white)',
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-relaxed)',
              resize: 'vertical',
              transition: 'all 0.3s var(--ease-sanctuary)'
            }}
          />
          
          {/* Gentle writing feedback */}
          {response.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: 'var(--space-breath)',
              right: 'var(--space-pause)',
              fontSize: 'var(--text-xs)',
              color: 'rgba(254, 252, 251, 0.6)',
              pointerEvents: 'none'
            }}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </div>
          )}
        </div>
      </div>

      {/* Mood Check (optional) */}
      {response.length > 50 && (
        <div style={{ marginBottom: 'var(--space-rest)' }}>
          <button
            onClick={() => setShowMoodSelector(!showMoodSelector)}
            style={{
              fontSize: 'var(--text-sm)',
              color: 'rgba(254, 252, 251, 0.8)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 'var(--space-breath)'
            }}
          >
            How are you feeling right now? (optional) {showMoodSelector ? '−' : '+'}
          </button>
          
          {showMoodSelector && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-breath)'
            }}>
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setMood(mood === option.value ? '' : option.value);
                  }}
                  style={{
                    padding: 'var(--space-breath) var(--space-pause)',
                    background: mood === option.value 
                      ? 'rgba(168, 181, 160, 0.3)' 
                      : 'rgba(254, 252, 251, 0.1)',
                    border: '1px solid rgba(254, 252, 251, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--sanctuary-white)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s var(--ease-sanctuary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-whisper)'
                  }}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completion Actions */}
      {response.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 'var(--space-breath)',
          justifyContent: 'center',
          paddingTop: 'var(--space-rest)',
          borderTop: '1px solid rgba(254, 252, 251, 0.1)'
        }}>
          <button
            onClick={handleComplete}
            style={{
              padding: 'var(--space-pause) var(--space-sanctuary)',
              background: 'var(--sage-600)',
              border: '1px solid var(--sage-500)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--sanctuary-white)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s var(--ease-sanctuary)'
            }}
          >
            Complete Reflection
          </button>
        </div>
      )}
    </div>
  );
}