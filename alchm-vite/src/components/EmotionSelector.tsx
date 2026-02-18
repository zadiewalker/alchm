import { useMemo, useState } from 'react';
import { DESIGN } from '@/lib/design';
import type { EmotionFamily } from '@/lib/emotions';
import { EMOTION_MAP, FAMILY_LABELS } from '@/lib/emotions';

export interface EmotionSelection {
  familyId: EmotionFamily;
  specificId: string | null;
  label: string;
}

function familyOrder(): EmotionFamily[] {
  return ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'trust', 'anticipation'];
}

export function EmotionSelector(props: {
  value: EmotionSelection | null;
  onChange: (sel: EmotionSelection) => void;
}) {
  const [family, setFamily] = useState<EmotionFamily | null>(props.value?.familyId ?? null);

  const specifics = useMemo(() => (family ? EMOTION_MAP[family] : []), [family]);

  const selectFamily = (f: EmotionFamily) => {
    setFamily(f);
    // If user only taps the family and continues, we'll store the family label.
    const label = FAMILY_LABELS[f];
    props.onChange({ familyId: f, specificId: null, label });
  };

  const selectSpecific = (e: (typeof specifics)[number]) => {
    setFamily(e.family);
    props.onChange({ familyId: e.family, specificId: e.id, label: e.label });
  };

  const activeFamily = props.value?.familyId ?? family;
  const activeSpecific = props.value?.specificId ?? null;

  return (
    <div aria-label="Emotion selection">
      <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, marginBottom: '10px' }}>
        How are you feeling?
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {familyOrder().map((f) => {
          const isActive = activeFamily === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => selectFamily(f)}
              aria-label={`Select emotion family: ${FAMILY_LABELS[f]}`}
              style={{
                minHeight: '44px',
                borderRadius: '20px',
                padding: '10px 14px',
                border: `1px solid ${isActive ? 'rgba(232, 200, 122, 0.50)' : 'rgba(164, 180, 148, 0.25)'}`,
                backgroundColor: isActive ? DESIGN.colors.sage500 : DESIGN.colors.bgSurface,
                color: isActive ? DESIGN.colors.textPrimary : DESIGN.colors.textSecondary,
                fontFamily: DESIGN.typography.sansSerif,
                fontSize: '14px',
                fontWeight: isActive ? DESIGN.typography.weights.semibold : DESIGN.typography.weights.medium,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {FAMILY_LABELS[f]}
            </button>
          );
        })}
      </div>

      {activeFamily ? (
        <div style={{ marginTop: '14px' }} aria-label="Specific emotion selection">
          <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, marginBottom: '10px' }}>
            What kind of {FAMILY_LABELS[activeFamily].toLowerCase()}?
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {specifics.map((e) => {
              const isActive = activeSpecific === e.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => selectSpecific(e)}
                  aria-label={`Select specific emotion: ${e.label}`}
                  style={{
                    minHeight: '36px',
                    borderRadius: '18px',
                    padding: '8px 12px',
                    border: `1px solid ${isActive ? 'rgba(232, 200, 122, 0.70)' : 'rgba(164, 180, 148, 0.25)'}`,
                    backgroundColor: isActive ? 'rgba(232, 200, 122, 0.12)' : 'rgba(164, 180, 148, 0.08)',
                    color: isActive ? DESIGN.colors.textPrimary : DESIGN.colors.textSecondary,
                    fontFamily: DESIGN.typography.sansSerif,
                    fontSize: '13px',
                    fontWeight: isActive ? DESIGN.typography.weights.semibold : DESIGN.typography.weights.medium,
                    cursor: 'pointer',
                  }}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => selectFamily(activeFamily)}
            aria-label={`Use broad emotion: ${FAMILY_LABELS[activeFamily]}`}
            style={{
              marginTop: '10px',
              border: 'none',
              background: 'transparent',
              color: DESIGN.colors.textMuted,
              fontFamily: DESIGN.typography.sansSerif,
              fontSize: '12px',
              minHeight: '32px',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            Just “{FAMILY_LABELS[activeFamily]}” is enough
          </button>
        </div>
      ) : null}
    </div>
  );
}
