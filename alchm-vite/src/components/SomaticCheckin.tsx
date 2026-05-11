import { useMemo, useState } from 'react';
import { DESIGN } from '@/lib/design';
import type { BodyRegionId, BodySensation } from '@/lib/somatic';
import { BODY_REGIONS } from '@/lib/somatic';

export function SomaticCheckin(props: {
  hintRegion?: BodyRegionId | null;
  value: BodySensation | null;
  onChange: (s: BodySensation) => void;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const [region, setRegion] = useState<BodyRegionId | null>(props.value?.region ?? null);
  const [desc, setDesc] = useState(props.value?.description ?? '');

  const selected = useMemo(() => BODY_REGIONS.find((r) => r.id === region) || null, [region]);

  const select = (r: BodyRegionId) => {
    setRegion(r);
    props.onChange({ region: r, description: desc.trim() ? desc.trim() : null });
  };

  return (
    <div aria-label="Body check-in" style={{ marginTop: '14px' }}>
      <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, marginBottom: '10px' }}>
        Where do you feel it?
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {BODY_REGIONS.map((r) => {
          const isActive = region === r.id;
          const isHint = !isActive && !!props.hintRegion && props.hintRegion === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => select(r.id)}
              aria-label={`Select body region: ${r.label}`}
              style={{
                minHeight: '44px',
                borderRadius: '18px',
                padding: '10px 10px',
                border: `1px solid ${isActive ? 'rgba(232, 200, 122, 0.50)' : isHint ? 'rgba(232, 200, 122, 0.35)' : 'rgba(164, 180, 148, 0.25)'}`,
                backgroundColor: isActive ? DESIGN.colors.sage500 : DESIGN.colors.bgSurface,
                color: isActive ? DESIGN.colors.textPrimary : DESIGN.colors.textSecondary,
                fontFamily: DESIGN.typography.sansSerif,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {selected ? (
        <div style={{ marginTop: '12px' }} aria-label="Describe the sensation">
          <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, fontStyle: 'italic' }}>
            {selected.label} — {selected.prompt}
          </div>
          <input
            value={desc}
            onChange={(e) => {
              const v = e.target.value.slice(0, 60);
              setDesc(v);
              if (region) props.onChange({ region, description: v.trim() ? v.trim() : null });
            }}
            aria-label="Describe the sensation (optional)"
            placeholder="Describe it in a word or two (optional)"
            className="input"
            style={{
              marginTop: '10px',
              width: '100%',
              borderRadius: DESIGN.radius.lg,
              fontFamily: DESIGN.typography.sansSerif,
              fontSize: '16px',
              outline: 'none',
            }}
          />
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={props.onContinue}
              aria-label="Continue to writing"
              className="btn-secondary"
              style={{ borderRadius: DESIGN.radius.full, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}
            >
              Continue →
            </button>
            <button
              type="button"
              onClick={props.onSkip}
              aria-label="Skip body check-in"
              style={{
                border: 'none',
                background: 'transparent',
                color: DESIGN.colors.textMuted,
                fontFamily: DESIGN.typography.sansSerif,
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Skip ↓
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            onClick={props.onSkip}
            aria-label="Skip body check-in"
            style={{
              border: 'none',
              background: 'transparent',
              color: DESIGN.colors.textMuted,
              fontFamily: DESIGN.typography.sansSerif,
              cursor: 'pointer',
              minHeight: '44px',
              padding: 0,
            }}
          >
            Skip ↓
          </button>
        </div>
      )}
    </div>
  );
}

