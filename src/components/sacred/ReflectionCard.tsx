'use client';

// ALCHM Sacred Component: ReflectionCard
// Sacred mirror for inner contemplation
// Replaces: JournalEntry

import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { KheperaOracle } from './KheperaOracle';
import { IntentionGem } from './IntentionGem';
import { SoulCanvas } from './SoulCanvas';

export interface ReflectionEntry {
  id: string;
  date: Date;
  content: string;
  mood?: 'challenging' | 'neutral' | 'hopeful' | 'mixed' | 'celebrating';
  energy?: number; // 1-5
  gratitude?: string[];
  intentions?: string[];
  growth_moments?: string[];
  ai_reflection?: string;
  sacred_themes?: string[];
}

export interface ReflectionCardProps {
  entry?: ReflectionEntry;
  isEditing?: boolean;
  onSave?: (entry: Partial<ReflectionEntry>) => void;
  onEdit?: () => void;
  onArchive?: () => void;
  showKheperaGuidance?: boolean;
  className?: string;
}

export function ReflectionCard({
  entry,
  isEditing = false,
  onSave,
  onEdit,
  onArchive,
  showKheperaGuidance = true,
  className = ''
}: ReflectionCardProps) {
  const [editingEntry, setEditingEntry] = useState<Partial<ReflectionEntry>>(
    entry || { content: '', date: new Date() }
  );
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editingEntry.content?.trim()) {
      onSave?.(editingEntry);
    }
  };

  const getMoodEmoji = (mood?: string) => {
    const moodEmojis = {
      challenging: '🌊', // Waves - navigating difficulty  
      neutral: '🌿',     // Leaves - steady presence
      hopeful: '🌻',     // Sunflower - turning toward light
      mixed: '🌈',       // Rainbow - complexity and beauty
      celebrating: '✨'  // Sparkles - joy and achievement
    };
    return moodEmojis[mood as keyof typeof moodEmojis] || '🌱';
  };

  const cardClasses = [
    'reflection-card',
    `reflection-${entry?.mood || 'neutral'}`,
    isEditing && 'card-editing',
    className
  ].filter(Boolean).join(' ');

  if (isEditing) {
    return (
      <div className={cardClasses}>
        <div className="reflection-header">
          <h3 className="reflection-title">Sacred Reflection</h3>
          <div className="reflection-date">
            {formatDistanceToNow(new Date(), { addSuffix: true })}
          </div>
        </div>

        <div className="reflection-body">
          <SoulCanvas
            ref={contentRef}
            value={editingEntry.content || ''}
            onChange={(content) => setEditingEntry(prev => ({ ...prev, content }))}
            placeholder="What is your soul sharing today? Let your authentic voice flow..."
            className="reflection-soul-canvas"
            rows={8}
            sacred
          />

          {/* Mood Selection */}
          <div className="reflection-mood-selector">
            <h4>How is your heart today?</h4>
            <div className="mood-options">
              {['challenging', 'neutral', 'hopeful', 'mixed', 'celebrating'].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  className={`mood-option ${editingEntry.mood === mood ? 'selected' : ''}`}
                  onClick={() => setEditingEntry(prev => ({ ...prev, mood: mood as any }))}
                  aria-label={`Feeling ${mood}`}
                >
                  <span className="mood-emoji">{getMoodEmoji(mood)}</span>
                  <span className="mood-label">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Khepera AI Guidance Toggle */}
          {showKheperaGuidance && (
            <div className="khepera-guidance-section">
              <IntentionGem
                intent="wisdom"
                energy="gentle"
                onClick={() => setShowAIGuidance(!showAIGuidance)}
                className="guidance-toggle"
              >
                {showAIGuidance ? 'Hide' : 'Ask'} Khepera for Reflection Guidance
              </IntentionGem>
              
              {showAIGuidance && (
                <KheperaOracle
                  prompt={editingEntry.content || ''}
                  mode="reflection_guidance"
                  onInsight={(insight) => {
                    setEditingEntry(prev => ({ 
                      ...prev, 
                      ai_reflection: insight 
                    }));
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="reflection-actions">
          <IntentionGem
            intent="healing"
            energy="gentle"
            onClick={handleSave}
            disabled={!editingEntry.content?.trim()}
            sacred
          >
            Sacred Offering
          </IntentionGem>
          
          <IntentionGem
            intent="wisdom"
            energy="gentle"
            onClick={() => setEditingEntry(entry || {})}
          >
            Release Changes
          </IntentionGem>
        </div>
      </div>
    );
  }

  // Display mode
  if (!entry) {
    return (
      <div className="reflection-card reflection-empty">
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>Your Reflection Garden Awaits</h3>
          <p>Begin your sacred journey of inner contemplation</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <div className="reflection-header">
        <div className="reflection-mood">
          <span className="mood-emoji" aria-label={`Mood: ${entry.mood}`}>
            {getMoodEmoji(entry.mood)}
          </span>
        </div>
        
        <div className="reflection-meta">
          <div className="reflection-date">
            {formatDistanceToNow(entry.date, { addSuffix: true })}
          </div>
          
          {entry.energy && (
            <div className="reflection-energy" aria-label={`Energy level: ${entry.energy} out of 5`}>
              <div className="energy-dots">
                {Array.from({ length: 5 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`energy-dot ${i < entry.energy! ? 'filled' : 'empty'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="reflection-content">
        <div className="reflection-text">
          {entry.content}
        </div>

        {/* Sacred Themes */}
        {entry.sacred_themes && entry.sacred_themes.length > 0 && (
          <div className="sacred-themes">
            <h4>Sacred Themes Emerged</h4>
            <div className="themes-list">
              {entry.sacred_themes.map((theme, index) => (
                <span key={index} className="theme-tag">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Growth Moments */}
        {entry.growth_moments && entry.growth_moments.length > 0 && (
          <div className="growth-moments">
            <h4>Moments of Growth</h4>
            <ul className="growth-list">
              {entry.growth_moments.map((moment, index) => (
                <li key={index} className="growth-item">
                  <span className="growth-icon">✨</span>
                  {moment}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gratitude */}
        {entry.gratitude && entry.gratitude.length > 0 && (
          <div className="gratitude-section">
            <h4>Sacred Gratitude</h4>
            <div className="gratitude-list">
              {entry.gratitude.map((item, index) => (
                <div key={index} className="gratitude-item">
                  <span className="gratitude-icon">🙏</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Reflection */}
        {entry.ai_reflection && (
          <div className="khepera-reflection">
            <div className="ai-reflection-header">
              <span className="khepera-icon">𓆣</span>
              <span className="ai-reflection-title">Khepera's Sacred Mirror</span>
            </div>
            <div className="ai-reflection-content">
              {entry.ai_reflection}
            </div>
          </div>
        )}
      </div>

      <div className="reflection-actions">
        <IntentionGem
          intent="growth"
          energy="gentle"
          onClick={onEdit}
          className="edit-reflection"
        >
          Tend This Reflection
        </IntentionGem>
        
        <IntentionGem
          intent="wisdom"
          energy="gentle"
          onClick={onArchive}
          className="archive-reflection"
        >
          Archive Sacred Memory
        </IntentionGem>
      </div>

      {/* Reflection aura */}
      <div className="reflection-aura" aria-hidden="true" />
    </div>
  );
}

export default ReflectionCard;