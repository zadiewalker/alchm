'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useContainer } from '@/hooks/useContainer';
import { useAuth } from '@/hooks/useAuth';
import { useMirrorData } from '@/hooks/useMirrorData';
import { BackButton } from '@/components/ui/BackButton';
import {
  generateCompletionAcknowledgment,
  generateClosingSeed,
} from '@/services/containers/arcGeneration';

type CeremonyPart = 'arrival' | 'carry_forward' | 'closing';

export function CompletionCeremonyClient(): React.JSX.Element | null {
  useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeContainer, complete } = useContainer();
  const { userId } = useAuth();
  const mirrorData = useMirrorData(userId || '');
  const fromJournal = searchParams.get('from') === 'journal';

  const [part, setPart] = useState<CeremonyPart>('arrival');
  const [acknowledgment, setAcknowledgment] = useState('');
  const [closingSeed, setClosingSeed] = useState('');
  const [carryForward, setCarryForward] = useState('');
  const [leavingBehind, setLeavingBehind] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const definition = activeContainer?.definition;

  // Generate ceremony content on mount
  useEffect(() => {
    if (!definition) return;

    const dominantTone = mirrorData.dominantTone ?? 'processing';
    const themes = mirrorData.recurringThemes.map(t => t.label);

    Promise.all([
      generateCompletionAcknowledgment(
        definition.name,
        definition.totalDays,
        dominantTone,
        themes
      ),
      generateClosingSeed(definition.name),
    ])
      .then(([ack, seed]) => {
        setAcknowledgment(ack);
        setClosingSeed(seed);
      })
      .catch(() => {
        setAcknowledgment(
          `Something real happened here. What you brought to "${definition.name}" belongs to you now in a different way.`
        );
        setClosingSeed('What has changed in how you see yourself?');
      })
      .finally(() => setLoading(false));
  }, [definition, mirrorData]);

  const handleComplete = async (): Promise<void> => {
    setSaving(true);
    try {
      await complete(carryForward, leavingBehind);
      setPart('closing');
    } finally {
      setSaving(false);
    }
  };

  if (!definition) {
    router.replace('/containers');
    return null;
  }

  const backControl = (
    <BackButton
      navigation={{ fallback: `/containers/${definition.id}` }}
      label="Back"
      style={{
        position: 'absolute',
        top: 'calc(var(--safe-top) + var(--space-4))',
        left: 'var(--space-4)',
      }}
    />
  );

  // ── PART 1: THE ARRIVAL ────────────────────────────────────────────────────
  if (part === 'arrival') {
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
        onClick={() => setPart('carry_forward')}
        role="button"
        aria-label="Tap to continue to the next part of the ceremony"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setPart('carry_forward')}
      >
        {backControl}

        <h1 style={{
          fontFamily: 'var(--font-family-heading)',
          fontSize: '38px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 28px',
          lineHeight: 1.1,
        }}>
          This container can rest here.
        </h1>

        {fromJournal ? (
          <div style={arrivalBridgeStyle}>
            <p style={arrivalBridgeEyebrowStyle}>
              From your entry
            </p>
            <p style={arrivalBridgeBodyStyle}>
              This ceremony opens from what you just brought through the container.
            </p>
          </div>
        ) : null}

        {loading ? (
          <p style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: '19px',
            fontStyle: 'normal',
            color: 'var(--text-tertiary)',
            lineHeight: 1.7,
            maxWidth: '320px',
          }}>
            Something from this container is settling here...
          </p>
        ) : (
          <p style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: '19px',
            fontStyle: 'normal',
            fontWeight: 400,
            color: 'var(--khepera-text)',
            lineHeight: 1.75,
            maxWidth: '340px',
            margin: '0 0 48px',
            whiteSpace: 'pre-line',
          }}>
            {acknowledgment}
          </p>
        )}

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          letterSpacing: 0,
        }}>
          Tap when you're ready
        </p>
      </div>
    );
  }

  // ── PART 2: THE CARRY-FORWARD ─────────────────────────────────────────────
  if (part === 'carry_forward') {
    return (
      <div
        data-container-atmosphere={definition.atmosphere}
        style={{ minHeight: '100vh', padding: '60px 24px 100px', position: 'relative' }}
      >
        {backControl}

        <h2 style={{
          fontFamily: 'var(--font-family-heading)',
          fontSize: '28px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          margin: '0 0 24px',
        }}>
          What are you carrying forward?
        </h2>

        <textarea
          value={carryForward}
          onChange={e => setCarryForward(e.target.value)}
          placeholder="Something from this container..."
          aria-label="What you are carrying forward from this container"
          style={{
            width: '100%',
            minHeight: '100px',
            background: 'var(--bg-inset)',
            border: '0.5px solid var(--border-normal)',
            borderRadius: '14px',
            padding: '16px',
            fontFamily: "'Jost', sans-serif",
            fontSize: '16px',
            fontWeight: 300,
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            resize: 'none',
            outline: 'none',
            caretColor: 'var(--text-primary)',
            boxSizing: 'border-box',
            marginBottom: '32px',
          }}
        />

        <h2 style={{
          fontFamily: 'var(--font-family-heading)',
          fontSize: '28px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          margin: '0 0 24px',
        }}>
          What are you leaving here?
        </h2>

        <textarea
          value={leavingBehind}
          onChange={e => setLeavingBehind(e.target.value)}
          placeholder="Something this container can hold..."
          aria-label="What you are leaving behind in this container"
          style={{
            width: '100%',
            minHeight: '100px',
            background: 'var(--bg-inset)',
            border: '0.5px solid var(--border-normal)',
            borderRadius: '14px',
            padding: '16px',
            fontFamily: "'Jost', sans-serif",
            fontSize: '16px',
            fontWeight: 300,
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            resize: 'none',
            outline: 'none',
            caretColor: 'var(--text-primary)',
            boxSizing: 'border-box',
            marginBottom: '36px',
          }}
        />

        <button
          className="btn-primary"
          onClick={handleComplete}
          disabled={saving}
          style={{ opacity: saving ? 0.5 : 1 }}
          aria-label="Let these words rest here"
        >
          {saving ? 'Holding this here...' : 'Let this rest here'}
        </button>

      </div>
    );
  }

  // ── PART 3: THE CLOSING ───────────────────────────────────────────────────
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
      {backControl}

      <h2 style={{
        fontFamily: 'var(--font-family-heading)',
        fontSize: '32px',
        fontWeight: 500,
        color: 'var(--text-primary)',
        margin: '0 0 40px',
        lineHeight: 1.2,
      }}>
        This container can rest here.
      </h2>

      <p style={{
        fontFamily: 'var(--font-family-heading)',
        fontSize: '22px',
        fontStyle: 'normal',
        fontWeight: 400,
        color: 'var(--khepera-text)',
        lineHeight: 1.65,
        maxWidth: '320px',
        margin: '0 0 28px',
      }}>
        {closingSeed}
      </p>

      {/* Gold divider */}
      <div style={{
        width: '48px',
        height: '0.5px',
        background: 'var(--text-secondary)',
        margin: '0 0 48px',
      }} />

      <p style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '14px',
        fontWeight: 300,
        color: 'var(--text-tertiary)',
        margin: '0 0 36px',
      }}>
        {`What from ${definition.name} will travel with you now?`}
      </p>

      {/* Two ghost buttons — no primary CTA. The choice is theirs. */}
      <button
        className="btn-ghost"
        onClick={() => router.push('/containers')}
        style={{ marginBottom: '8px' }}
        aria-label="Enter another container"
      >
        Enter another container
      </button>

      <button
        className="btn-ghost"
        onClick={() => router.push('/dashboard')}
        aria-label="Rest for now and return to dashboard"
      >
        Rest for now
      </button>

    </div>
  );
}

const arrivalBridgeStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '340px',
  margin: '0 0 24px',
  padding: '16px',
  borderRadius: '16px',
  background: 'var(--surface-color)',
  border: '1px solid var(--border-divider)',
};

const arrivalBridgeEyebrowStyle: React.CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  margin: '0 0 8px',
};

const arrivalBridgeBodyStyle: React.CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: '14px',
  fontWeight: 300,
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  margin: 0,
};
