import { useState } from 'react';

export type BodyLocation =
  | 'head' | 'throat' | 'chest' | 'stomach' | 'jaw'
  | 'shoulders_left' | 'shoulders_right' | 'whole_body' | 'nowhere_specific';

export const BODY_MAP_REGIONS = [
  { id: 'head', label: 'Head' },
  { id: 'throat', label: 'Throat' },
  { id: 'chest', label: 'Chest' },
  { id: 'stomach', label: 'Stomach' },
  { id: 'jaw', label: 'Jaw' },
  { id: 'shoulders_left', label: 'Shoulders' },
  { id: 'whole_body', label: 'Whole body' },
] as const;

const DOT_LAYOUT: Record<BodyLocation, { top: string; left: string }> = {
  head: { top: '13%', left: '50%' },
  throat: { top: '25%', left: '50%' },
  chest: { top: '37%', left: '50%' },
  stomach: { top: '51%', left: '50%' },
  jaw: { top: '18%', left: '50%' },
  shoulders_left: { top: '34%', left: '36%' },
  shoulders_right: { top: '34%', left: '64%' },
  whole_body: { top: '73%', left: '50%' },
  nowhere_specific: { top: '88%', left: '50%' },
};

export function BodyMap(props: { onSelect: (payload: { location: BodyLocation; sensation: string; intensity: number }) => void; onSkip?: () => void }) {
  const [selected, setSelected] = useState<BodyLocation | null>(null);
  const sensations = ['tight', 'heavy', 'warm', 'numb'];
  return (
    <div style={{ marginTop: '12px' }}>
      <div className="body-map-figure-wrap">
        <svg className="body-map-figure" viewBox="0 0 120 260" role="img" aria-label="Body map silhouette">
          <circle cx="60" cy="24" r="14" />
          <rect x="51" y="40" width="18" height="66" rx="9" />
          <rect x="28" y="56" width="16" height="68" rx="8" />
          <rect x="76" y="56" width="16" height="68" rx="8" />
          <rect x="50" y="104" width="9" height="95" rx="4.5" />
          <rect x="61" y="104" width="9" height="95" rx="4.5" />
        </svg>
        {BODY_MAP_REGIONS.map((region) => {
          const isSelected = selected === region.id;
          const pos = DOT_LAYOUT[region.id as BodyLocation];
          return (
            <button
              key={region.id}
              type="button"
              className={`body-tap-dot${isSelected ? ' selected' : ''}`}
              style={{ top: pos.top, left: pos.left }}
              aria-label={`Select ${region.label} body region`}
              onClick={() => setSelected(region.id)}
            />
          );
        })}
      </div>

      <div className="sensation-chips body-sensation-grid">
        {BODY_MAP_REGIONS.map((region) => (
          <button key={region.id} type="button" className={`sensation-chip ${selected === region.id ? 'sensation-chip--selected' : ''}`} onClick={() => setSelected(region.id)} aria-label={`Choose ${region.label}`}>
            {region.label}
          </button>
        ))}
      </div>
      {selected ? (
        <div className="sensation-chips body-sensation-grid" style={{ marginTop: '10px' }}>
          {sensations.map((s) => (
            <button key={s} type="button" className="sensation-chip" onClick={() => props.onSelect({ location: selected, sensation: s, intensity: 5 })} aria-label={`Mark sensation as ${s}`}>
              {s}
            </button>
          ))}
        </div>
      ) : null}
      {props.onSkip ? <button type="button" className="bodymap-escape-link" onClick={props.onSkip}>I don’t feel it in my body →</button> : null}
    </div>
  );
}
