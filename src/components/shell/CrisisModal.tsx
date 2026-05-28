import type { CrisisModalProps } from '@/types/shell';

interface CrisisResource {
  name: string;
  description: string;
  primary: string;
  primaryLabel: string;
  secondary?: string;
  secondaryLabel?: string;
}

const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: '988 Suicide & Crisis Lifeline',
    description: 'Call or text for immediate support. Available 24/7. Free and confidential.',
    primary: 'tel:988',
    primaryLabel: 'Call 988',
    secondary: 'sms:988',
    secondaryLabel: 'Text 988',
  },
  {
    name: '988 by text',
    description: 'Text 988 for immediate support. Available 24/7. Free and confidential.',
    primary: 'sms:988',
    primaryLabel: 'Text 988',
  },
  {
    name: 'International Association for Suicide Prevention',
    description: 'Find crisis centers worldwide.',
    primary: 'https://www.iasp.info/resources/Crisis_Centres/',
    primaryLabel: 'Find a crisis center',
  },
];

export function CrisisModal({ onClose }: CrisisModalProps): React.JSX.Element {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--color-bg-overlay)',
          zIndex: 500,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 501,
          background: 'var(--background-primary)',
          borderTop: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: 'var(--space-5) var(--space-6) calc(env(safe-area-inset-bottom) + var(--space-8))',
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            background: 'var(--border-divider)',
            borderRadius: 'var(--radius-sm)',
            margin: '0 auto var(--space-6)',
          }}
        />

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              letterSpacing: 'var(--letter-spacing-tight)',
              margin: '0 0 var(--space-3)',
            }}
          >
            If you need support right now.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--line-height-relaxed)',
              margin: 0,
            }}
          >
            ALCHM is a space to process — it is not a crisis tool. If you are in danger or in pain right now, the people below
            are trained to help.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {CRISIS_RESOURCES.map((resource) => (
            <CrisisResourceCard key={resource.name} resource={resource} />
          ))}
        </div>

        <button
          className="btn-ghost"
          onClick={onClose}
          style={{
            width: '100%',
            height: 52,
            color: 'var(--text-secondary)',
          }}
        >
          Close
        </button>

        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginTop: 'var(--space-4)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          These resources are provided as a public service. ALCHM is not affiliated with any of them.
        </p>
      </div>
    </>
  );
}

function CrisisResourceCard({ resource }: { resource: CrisisResource }) {
  return (
    <div
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-divider)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-base)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-2)',
        }}
      >
        {resource.name}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--line-height-relaxed)',
          margin: '0 0 var(--space-4)',
        }}
      >
        {resource.description}
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <a
          href={resource.primary}
          style={{
            background: 'var(--accent-primary)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-pill)',
            padding: 'var(--space-2) var(--space-4)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          {resource.primaryLabel}
        </a>

        {resource.secondary && resource.secondaryLabel ? (
          <a
            href={resource.secondary}
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-pill)',
              padding: 'var(--space-2) var(--space-4)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-regular)',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {resource.secondaryLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
