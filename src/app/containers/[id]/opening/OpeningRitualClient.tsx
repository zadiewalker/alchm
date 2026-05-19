'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useContainer } from '@/hooks/useContainer';
import { MoonPhaseIndicator } from '@/components/MoonPhaseIndicator';
import { BackButton } from '@/components/ui/BackButton';
import { getContainerDefinition } from '@/config/containerDefinitions';

export default function OpeningRitualClient() {
  const params = useParams();
  const router = useRouter();
  const containerId = typeof params.id === 'string' ? params.id : '';
  const { begin } = useContainer();
  const [loading, setLoading] = useState(false);

  const definition = getContainerDefinition(containerId);
  if (!definition) { router.replace('/containers'); return null; }

  const handleEnter = async () => {
    setLoading(true);
    try {
      await begin(containerId);
      router.replace(`/containers/${containerId}/today`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div
      data-container-atmosphere={definition.atmosphere}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <BackButton
        navigation={{ fallback: `/containers/${containerId}` }}
        label="Back"
        style={{
          position: 'absolute',
          top: 'calc(var(--safe-top) + var(--space-4))',
          left: 'var(--space-4)',
        }}
      />

      {/* Container name */}
      <p style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.10em',
        color: 'var(--text-tertiary)',
        margin: '0 0 12px',
      }}>
        {definition.name}
      </p>

      {/* Opening ritual text — Khepera speaking */}
      <p style={{
        fontFamily: 'var(--font-family-heading)',
        fontSize: '20px',
        fontStyle: 'normal',
        fontWeight: 400,
        color: 'var(--khepera-text)',
        lineHeight: 1.75,
        margin: '0 0 40px',
        maxWidth: '320px',
        whiteSpace: 'pre-line',
      }}>
        {definition.openingRitual}
      </p>

      {/* Moon — new crescent, the beginning */}
      <div style={{ marginBottom: '40px' }}>
        <MoonPhaseIndicator
          phase="new_moon"
          metaphorText="Something beginning"
          size={20}
        />
      </div>

      <button
        className="btn-primary"
        style={{ width: '220px' }}
        onClick={handleEnter}
        disabled={loading}
        aria-label="Enter the container and begin writing"
      >
        {loading ? 'Entering...' : 'Enter the container'}
      </button>

    </div>
  );
}
