'use client';

import { useState, useRef, useEffect } from 'react';
import { DESIGN } from '@/utils/design';
import { AppText } from '@/components/ui/AppText';
import type { BodyMapping, SomaticEntryModeProps, SomaticJournalData } from '@/types/journal';

function isBreathPattern(value: string): value is SomaticJournalData['breathPattern'] {
  return value === 'shallow' || value === 'deep' || value === 'irregular' || value === 'held';
}

const BODY_AREAS = [
  { id: 'head', label: 'Head', emoji: '🧠' },
  { id: 'throat', label: 'Throat', emoji: '🗣️' },
  { id: 'chest', label: 'Chest', emoji: '❤️' },
  { id: 'stomach', label: 'Stomach', emoji: '🔥' },
  { id: 'shoulders', label: 'Shoulders', emoji: '💪' },
  { id: 'arms', label: 'Arms', emoji: '🤲' },
  { id: 'back', label: 'Back', emoji: '🏔️' },
  { id: 'legs', label: 'Legs', emoji: '🦵' },
];

const SENSATIONS = [
  'tight', 'open', 'heavy', 'light', 'warm', 'cold', 'buzzing', 'numb', 'flowing'
];

export function SomaticEntryMode({ onSubmit, onCancel, prompt }: SomaticEntryModeProps): React.JSX.Element | null {
  const [phase, setPhase] = useState<'ground' | 'scan' | 'map' | 'breathe' | 'reflect' | 'integrate'>('ground');
  const [startTime] = useState(Date.now());
  const [content, setContent] = useState('');
  const [bodyMappings, setBodyMappings] = useState<BodyMapping[]>([]);
  const [breathPattern, setBreathPattern] = useState<SomaticJournalData['breathPattern']>('shallow');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [groundingRating, setGroundingRating] = useState(5);
  const [tensionAreas, setTensionAreas] = useState<string[]>([]);
  const [somaticInsights] = useState<string[]>([]);
  
  const [currentBodyArea, setCurrentBodyArea] = useState<string>('');
  const [currentSensation, setCurrentSensation] = useState<string>('');
  const [currentIntensity, setCurrentIntensity] = useState(3);
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'hold' | 'out' | 'rest'>('in');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing timer effect
  useEffect(() => {
    if (phase === 'breathe') {
      const cycles: Array<{ phase: 'in' | 'hold' | 'out' | 'rest'; duration: number; text: string }> = [
        { phase: 'in', duration: 4000, text: 'Breathe in slowly...' },
        { phase: 'hold', duration: 2000, text: 'Hold gently...' },
        { phase: 'out', duration: 6000, text: 'Breathe out completely...' },
        { phase: 'rest', duration: 2000, text: 'Rest...' }
      ];
      
      let currentCycle = 0;
      
      timerRef.current = setInterval(() => {
        const cycle = cycles[currentCycle % cycles.length];
        setBreathingPhase(cycle.phase);
        currentCycle++;
      }, 3500); // Total cycle time
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase]);

  const addBodyMapping = () => {
    if (!currentBodyArea || !currentSensation) return;
    
    const mapping: BodyMapping = {
      area: currentBodyArea as BodyMapping['area'],
      sensation: currentSensation as BodyMapping['sensation'],
      intensity: currentIntensity
    };
    
    setBodyMappings(prev => [...prev.filter(m => m.area !== currentBodyArea), mapping]);
    setCurrentBodyArea('');
    setCurrentSensation('');
    setCurrentIntensity(3);
  };

  const handleSubmit = () => {
    const somaticData: SomaticJournalData = {
      bodyMappings,
      breathPattern,
      energyLevel,
      tensionAreas,
      groundingRating,
      somaticInsights,
      sessionDuration: Date.now() - startTime
    };
    
    onSubmit(content, somaticData);
  };

  const phaseStyles = {
    ground: { background: 'var(--surface-color)', border: '1px solid var(--border-divider)' },
    scan: { background: 'var(--surface-color)', border: '1px solid var(--border-divider)' },
    map: { background: 'var(--surface-elevated)', border: '1px solid var(--border-divider)' },
    breathe: { background: 'var(--surface-elevated)', border: '1px solid var(--border-divider)' },
    reflect: { background: 'var(--surface-elevated)', border: '1px solid var(--border-divider)' },
    integrate: { background: 'var(--surface-elevated)', border: '1px solid var(--border-divider)' }
  };

  if (phase === 'ground') {
    return (
      <div className="screen-gradient" style={{ minHeight: '100vh', padding: DESIGN.spacing.lg }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-emerge" style={{ marginBottom: DESIGN.spacing.xl }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.md }}>
              Arriving in Your Body
            </AppText>
            <AppText variant="caption" style={{ color: DESIGN.colors.textSecondary, lineHeight: '1.6' }}>
              Let's begin with three breaths to settle into this moment of noticing.
            </AppText>
          </div>

          <div style={{ 
            ...phaseStyles.ground,
            borderRadius: DESIGN.radius.lg,
            padding: DESIGN.spacing.xl,
            marginBottom: DESIGN.spacing.lg
          }}>
            <AppText variant="body" style={{ 
              fontStyle: 'italic',
              lineHeight: '1.8',
              marginBottom: DESIGN.spacing.md
            }}>
              "Your body holds wisdom that your mind hasn't yet discovered. 
              This is an invitation to listen."
            </AppText>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: DESIGN.spacing.sm,
              marginBottom: DESIGN.spacing.lg 
            }}>
              <span style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>
                Starting energy level:
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                style={{ width: '120px' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{energyLevel}/10</span>
            </div>
          </div>

          <button
            onClick={() => setPhase('scan')}
            className="btn-primary"
            style={{ minWidth: '200px' }}
          >
            Begin body scan
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'scan') {
    return (
      <div className="screen-gradient" style={{ minHeight: '100vh', padding: DESIGN.spacing.lg }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div className="section-emerge" style={{ marginBottom: DESIGN.spacing.lg, textAlign: 'center' }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              Gentle Body Scan
            </AppText>
            <AppText variant="caption" style={{ color: DESIGN.colors.textSecondary }}>
              Notice without changing. What is your body telling you right now?
            </AppText>
          </div>

          <div style={{
            ...phaseStyles.scan,
            borderRadius: DESIGN.radius.lg,
            padding: DESIGN.spacing.lg,
            marginBottom: DESIGN.spacing.lg
          }}>
            <AppText variant="body" style={{ 
              lineHeight: '1.7',
              marginBottom: DESIGN.spacing.md,
              textAlign: 'center'
            }}>
              Start at the top of your head. Slowly move your attention down through your body. 
              Notice areas that feel tense, relaxed, warm, cool, heavy, or light.
            </AppText>

            <AppText variant="caption" style={{ 
              color: DESIGN.colors.textSecondary,
              marginBottom: DESIGN.spacing.lg,
              fontWeight: '500',
              textAlign: 'center'
            }}>
              Which areas are calling for attention today?
            </AppText>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: DESIGN.spacing.xs }}>
              {BODY_AREAS.map(area => (
                <label key={area.id} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: DESIGN.spacing.xs,
                  padding: DESIGN.spacing.sm,
                  cursor: 'pointer',
                  fontSize: DESIGN.typography.sizes.sm
                }}>
                  <input
                    type="checkbox"
                    checked={tensionAreas.includes(area.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTensionAreas(prev => [...prev, area.id]);
                      } else {
                        setTensionAreas(prev => prev.filter(a => a !== area.id));
                      }
                    }}
                  />
                  <span>{area.emoji}</span>
                  <span>{area.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPhase('map')}
            className="btn-primary"
            disabled={tensionAreas.length === 0}
            style={{ width: '100%', opacity: tensionAreas.length === 0 ? 0.5 : 1 }}
          >
            Map these sensations
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'map') {
    return (
      <div className="screen-gradient" style={{ minHeight: '100vh', padding: DESIGN.spacing.lg }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div className="section-emerge" style={{ marginBottom: DESIGN.spacing.lg, textAlign: 'center' }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              Mapping Sensations
            </AppText>
            <AppText variant="caption" style={{ color: DESIGN.colors.textSecondary }}>
              Describe what you notice in each area that called for attention.
            </AppText>
          </div>

          {bodyMappings.length > 0 && (
            <div style={{ marginBottom: DESIGN.spacing.lg }}>
              <AppText variant="caption" style={{ 
                color: DESIGN.colors.textKhepera,
                marginBottom: DESIGN.spacing.sm,
                textTransform: "none",
                letterSpacing: 0
              }}>
                Your Body Map
              </AppText>
              {bodyMappings.map((mapping, index) => (
                <div key={index} style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: DESIGN.radius.md,
                  padding: DESIGN.spacing.sm,
                  marginBottom: DESIGN.spacing.xs,
                  fontSize: DESIGN.typography.sizes.sm
                }}>
                  <strong>{mapping.area}</strong>: {mapping.sensation} ({mapping.intensity}/5)
                </div>
              ))}
            </div>
          )}

          <div style={{
            ...phaseStyles.map,
            borderRadius: DESIGN.radius.lg,
            padding: DESIGN.spacing.lg,
            marginBottom: DESIGN.spacing.lg
          }}>
            <div style={{ marginBottom: DESIGN.spacing.md }}>
              <select
                value={currentBodyArea}
                onChange={(e) => setCurrentBodyArea(e.target.value)}
                style={{
                  width: '100%',
                  padding: DESIGN.spacing.sm,
                  border: `1px solid ${DESIGN.colors.border}`,
                  borderRadius: DESIGN.radius.md,
                  background: DESIGN.colors.cardBg,
                  color: DESIGN.colors.textPrimary,
                  marginBottom: DESIGN.spacing.sm
                }}
              >
                <option value="">Choose body area...</option>
                {tensionAreas.map(areaId => {
                  const area = BODY_AREAS.find(a => a.id === areaId);
                  return (
                    <option key={areaId} value={areaId}>
                      {area?.emoji} {area?.label}
                    </option>
                  );
                })}
              </select>

              <select
                value={currentSensation}
                onChange={(e) => setCurrentSensation(e.target.value)}
                style={{
                  width: '100%',
                  padding: DESIGN.spacing.sm,
                  border: `1px solid ${DESIGN.colors.border}`,
                  borderRadius: DESIGN.radius.md,
                  background: DESIGN.colors.cardBg,
                  color: DESIGN.colors.textPrimary,
                  marginBottom: DESIGN.spacing.sm
                }}
              >
                <option value="">How does it feel...</option>
                {SENSATIONS.map(sensation => (
                  <option key={sensation} value={sensation}>{sensation}</option>
                ))}
              </select>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: DESIGN.spacing.sm,
                marginBottom: DESIGN.spacing.sm 
              }}>
                <span style={{ fontSize: DESIGN.typography.sizes.sm }}>Intensity:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={currentIntensity}
                  onChange={(e) => setCurrentIntensity(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: '500' }}>{currentIntensity}/5</span>
              </div>

              <button
                onClick={addBodyMapping}
                disabled={!currentBodyArea || !currentSensation}
                className="btn-primary"
                style={{
                  width: '100%',
                  background: (!currentBodyArea || !currentSensation) ? 'var(--surface-color)' : 'var(--accent-primary)',
                  border: `1px solid ${(!currentBodyArea || !currentSensation) ? 'var(--border-divider)' : 'var(--accent-primary)'}`,
                  opacity: (!currentBodyArea || !currentSensation) ? 0.5 : 1,
                }}
              >
                Add mapping
              </button>
            </div>
          </div>

          <button
            onClick={() => setPhase('breathe')}
            className="btn-primary"
            disabled={bodyMappings.length === 0}
            style={{ width: '100%', opacity: bodyMappings.length === 0 ? 0.5 : 1 }}
          >
            Continue to breathwork
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'breathe') {
    return (
      <div className="screen-gradient" style={{ minHeight: '100vh', padding: DESIGN.spacing.lg }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-emerge" style={{ marginBottom: DESIGN.spacing.xl }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              Breath Awareness
            </AppText>
            <AppText variant="caption" style={{ color: DESIGN.colors.textSecondary }}>
              Three conscious breaths to integrate what you've noticed.
            </AppText>
          </div>

          <div style={{
            ...phaseStyles.breathe,
            borderRadius: DESIGN.radius.lg,
            padding: DESIGN.spacing.xl,
            marginBottom: DESIGN.spacing.lg,
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '64px',
              marginBottom: DESIGN.spacing.lg,
              opacity: breathingPhase === 'in' ? 1 : breathingPhase === 'hold' ? 0.8 : 0.4
            }}>
              🫁
            </div>
            
            <AppText variant="body" style={{ 
              fontSize: '18px',
              marginBottom: DESIGN.spacing.md,
              fontWeight: '300'
            }}>
              {breathingPhase === 'in' && 'Breathe in slowly...'}
              {breathingPhase === 'hold' && 'Hold gently...'}
              {breathingPhase === 'out' && 'Breathe out completely...'}
              {breathingPhase === 'rest' && 'Rest...'}
            </AppText>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: DESIGN.spacing.sm,
              marginBottom: DESIGN.spacing.md
            }}>
              <label style={{ 
                fontSize: DESIGN.typography.sizes.sm,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <input
                  type="radio"
                  name="breathPattern"
                  value="shallow"
                  checked={breathPattern === 'shallow'}
                  onChange={(e) => {
                    if (isBreathPattern(e.target.value)) {
                      setBreathPattern(e.target.value);
                    }
                  }}
                />
                Shallow
              </label>
              <label style={{ 
                fontSize: DESIGN.typography.sizes.sm,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <input
                  type="radio"
                  name="breathPattern"
                  value="deep"
                  checked={breathPattern === 'deep'}
                  onChange={(e) => {
                    if (isBreathPattern(e.target.value)) {
                      setBreathPattern(e.target.value);
                    }
                  }}
                />
                Deep
              </label>
              <label style={{ 
                fontSize: DESIGN.typography.sizes.sm,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <input
                  type="radio"
                  name="breathPattern"
                  value="irregular"
                  checked={breathPattern === 'irregular'}
                  onChange={(e) => {
                    if (isBreathPattern(e.target.value)) {
                      setBreathPattern(e.target.value);
                    }
                  }}
                />
                Irregular
              </label>
            </div>
          </div>

          <button
            onClick={() => setPhase('reflect')}
            className="btn-primary"
            style={{ minWidth: '200px' }}
          >
            Move to reflection
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'reflect') {
    return (
      <div className="screen-gradient" style={{ minHeight: '100vh', padding: DESIGN.spacing.lg }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div className="section-emerge" style={{ marginBottom: DESIGN.spacing.lg, textAlign: 'center' }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              What Emerged?
            </AppText>
            <AppText variant="caption" style={{ color: DESIGN.colors.textSecondary }}>
              Capture what your body scan revealed, without judgment.
            </AppText>
          </div>

          <div style={{ marginBottom: DESIGN.spacing.lg }}>
            <textarea
              className="journal-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you notice? What surprised you? What wants to be acknowledged?"
              style={{
                width: '100%',
                minHeight: '120px',
                border: '1px solid var(--border-divider)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'var(--font-family-body)',
                lineHeight: 'var(--line-height-base)',
                background: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          {prompt && (
            <div style={{
              ...phaseStyles.reflect,
              borderRadius: DESIGN.radius.md,
              padding: DESIGN.spacing.md,
              marginBottom: DESIGN.spacing.lg
            }}>
              <AppText variant="caption" style={{ 
                color: DESIGN.colors.textKhepera,
                marginBottom: DESIGN.spacing.xs,
                textTransform: "none",
                letterSpacing: 0
              }}>
                Today's Prompt
              </AppText>
              <AppText variant="body" style={{ fontStyle: 'italic' }}>
                {prompt}
              </AppText>
            </div>
          )}

          <button
            onClick={() => setPhase('integrate')}
            className="btn-primary"
            disabled={!content.trim()}
            style={{ width: '100%', opacity: !content.trim() ? 0.5 : 1 }}
          >
            Complete session
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'integrate') {
    return (
      <div className="screen-gradient" style={{ minHeight: '100vh', padding: DESIGN.spacing.lg }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div className="section-emerge" style={{ marginBottom: DESIGN.spacing.lg, textAlign: 'center' }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              Integration
            </AppText>
            <AppText variant="caption" style={{ color: DESIGN.colors.textSecondary }}>
              Before you go, how connected do you feel to your body right now?
            </AppText>
          </div>

          <div style={{
            ...phaseStyles.integrate,
            borderRadius: DESIGN.radius.lg,
            padding: DESIGN.spacing.lg,
            marginBottom: DESIGN.spacing.lg,
            textAlign: 'center'
          }}>
            <AppText variant="caption" style={{ 
              marginBottom: DESIGN.spacing.md,
              color: DESIGN.colors.textKhepera 
            }}>
              Grounding rating (1-10):
            </AppText>
            <input
              type="range"
              min="1"
              max="10"
              value={groundingRating}
              onChange={(e) => setGroundingRating(Number(e.target.value))}
              style={{ width: '200px', marginBottom: DESIGN.spacing.sm }}
            />
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '500',
              marginBottom: DESIGN.spacing.lg
            }}>
              {groundingRating}/10
            </div>

            <AppText variant="body" style={{ 
              fontStyle: 'italic',
              lineHeight: '1.6',
              color: DESIGN.colors.textSecondary
            }}>
              "Your body is always communicating. This practice of listening 
              builds trust between your conscious awareness and your somatic wisdom."
            </AppText>
          </div>

          <div style={{ 
            display: 'flex',
            gap: DESIGN.spacing.sm
          }}>
            <button
              onClick={onCancel}
              className="btn-ghost"
              style={{
                flex: 1,
                color: DESIGN.colors.textSecondary,
              }}
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{ flex: 2 }}
            >
              Save somatic entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
