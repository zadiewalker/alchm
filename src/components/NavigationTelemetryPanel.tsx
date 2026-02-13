'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  clearRecentNavigationEvents,
  getRecentNavigationEvents,
  NavigationEvent,
} from '@/lib/navigationTelemetry';

const panelStyle: CSSProperties = {
  position: 'fixed',
  right: 12,
  bottom: 12,
  zIndex: 99999,
  width: 360,
  maxHeight: '45vh',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.15)',
  color: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 10,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 11,
};

export default function NavigationTelemetryPanel() {
  const [events, setEvents] = useState<NavigationEvent[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEvents(getRecentNavigationEvents());

    const onEvent = (event: Event) => {
      const custom = event as CustomEvent<NavigationEvent>;
      if (!custom.detail) return;
      setEvents((prev) => [...prev, custom.detail].slice(-50));
    };

    window.addEventListener('alchm:navigation-event', onEvent as EventListener);
    return () => {
      window.removeEventListener('alchm:navigation-event', onEvent as EventListener);
    };
  }, []);

  const recent = useMemo(() => [...events].reverse().slice(0, 20), [events]);

  const clearEvents = () => {
    clearRecentNavigationEvents();
    setEvents([]);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          right: 12,
          bottom: 12,
          zIndex: 99999,
          background: 'rgba(255, 255, 255, 0.15)',
          color: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 9999,
          padding: '8px 12px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11,
        }}
        aria-label="Open navigation telemetry"
      >
        NAV {events.length}
      </button>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <strong>Navigation Telemetry (Dev)</strong>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={clearEvents} style={{ background: 'transparent', color: '#E5C97D', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 6, padding: '2px 6px' }}>
            Clear
          </button>
          <button type="button" onClick={() => setOpen(false)} style={{ background: 'transparent', color: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 6, padding: '2px 6px' }}>
            Hide
          </button>
        </div>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: 'calc(45vh - 38px)', padding: '6px 8px' }}>
        {recent.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No events yet</div>
        ) : (
          recent.map((evt, index) => (
            <div key={`${evt.timestamp}-${index}`} style={{ marginBottom: 6, padding: 6, border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 6 }}>
              <div>
                <strong>{evt.phase.toUpperCase()}</strong> {evt.fromPath || '?'} -&gt; {evt.toPath}
              </div>
              <div style={{ opacity: 0.8 }}>
                src={evt.source || 'n/a'} {typeof evt.durationMs === 'number' ? `dur=${evt.durationMs}ms` : ''}
              </div>
              <div style={{ opacity: 0.6 }}>{evt.timestamp}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
