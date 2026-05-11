import { useState } from 'react';
import { BodyMap } from '@/components/BodyMap';

export default function QABodyMapPage() {
  const [selection, setSelection] = useState<string>('');

  return (
    <div style={{ padding: '22px 20px 120px' }}>
      <h1 className="page-header-title" style={{ marginTop: '8px' }}>QA Body Map</h1>
      <p className="page-header-subtitle" style={{ marginBottom: '10px' }}>
        Deterministic route for accessibility and viewport QA.
      </p>
      <BodyMap
        onSelect={(payload) => {
          setSelection(`${payload.location}:${payload.sensation}`);
        }}
        onSkip={() => setSelection('skipped')}
      />
      {selection ? (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Selected: {selection}
        </p>
      ) : null}
    </div>
  );
}
