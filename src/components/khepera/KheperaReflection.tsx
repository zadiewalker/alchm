'use client';

import type { KheperaReflectionProps } from '@/types/components';

type LegacyPerspective = {
  lens: string;
  insight: string;
  question?: string;
};

type LegacyOffering = {
  type: string;
  title: string;
  description: string;
  duration?: string;
};

const toneAccent: Record<string, string> = {
  tender: 'var(--accent-primary)',
  grounding: 'var(--surface-elevated)',
  energizing: 'var(--accent-primary)',
  exploratory: 'var(--border-divider)',
  holding: 'var(--surface-elevated)',
  celebratory: 'var(--accent-primary)',
};

const offeringIcon: Record<string, string> = {
  somatic: '◎',
  reflective: '⟡',
  creative: '◇',
  relational: '○',
  grounding: '▽',
};

export function KheperaReflection({ response, onContinue }: KheperaReflectionProps): React.JSX.Element {
  const legacyResponse = response as typeof response & {
    tone?: string;
    witness?: string;
    perspectives?: LegacyPerspective[];
    somaticInvitation?: string;
    offerings?: LegacyOffering[];
    closingQuestion?: string;
  };
  const accent = toneAccent[legacyResponse.tone || 'exploratory'] ?? toneAccent.exploratory;
  const witness = legacyResponse.witness || response.witness;
  const perspectives = legacyResponse.perspectives || [];
  const somaticInvitation = legacyResponse.somaticInvitation;
  const offerings = legacyResponse.offerings || [];
  const closingQuestion = legacyResponse.closingQuestion || response.seed;

  const divider = (
    <div
      style={{
        width: 32,
        height: 1,
        background: accent,
        margin: 'var(--space-8) auto',
      }}
    />
  );

  return (
    <div
      className="section-emerge"
      style={{
        width: '100%',
        maxWidth: 420,
        margin: '0 auto',
        padding: '0 var(--space-1) var(--space-6)',
      }}
    >
      <div className="sequential-reveal reveal-1">
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-regular)',
            lineHeight: 1.75,
            color: 'var(--text-primary)',
            letterSpacing: 'var(--letter-spacing-base)',
            margin: 0,
          }}
        >
          {witness}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-regular)',
            lineHeight: 1.75,
            color: 'var(--text-primary)',
            letterSpacing: 'var(--letter-spacing-base)',
            margin: 'var(--space-4) 0 0',
          }}
        >
          {response.perspective}
        </p>
      </div>

      {perspectives.length ? divider : null}

      {perspectives.length ? <div className="sequential-reveal reveal-2">
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
            letterSpacing: 'var(--letter-spacing-base)',
            color: 'var(--text-secondary)',
            textTransform: "none",
            marginBottom: 'var(--space-5)',
          }}
        >
          Perspectives
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {perspectives.map((perspective: LegacyPerspective, index: number) => (
            <div
              key={`${perspective.lens}-${index}`}
              style={{
                background: 'var(--surface-color)',
                border: `1px solid ${accent}`,
                borderLeft: `2px solid ${accent}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  letterSpacing: 'var(--letter-spacing-base)',
                  color: 'var(--text-secondary)',
                  textTransform: "none",
                  marginBottom: 'var(--space-2)',
                }}
              >
                {perspective.lens}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 1.70,
                  color: 'var(--text-primary)',
                  marginBottom: perspective.question ? 'var(--space-3)' : 0,
                }}
              >
                {perspective.insight}
              </p>
              {perspective.question ? (
                <p
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-regular)',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    margin: 0,
                  }}
                >
                  {perspective.question}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div> : null}

      {somaticInvitation ? divider : null}

      {somaticInvitation ? <div className="sequential-reveal reveal-3">
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
            letterSpacing: 'var(--letter-spacing-base)',
            color: 'var(--text-secondary)',
            textTransform: "none",
            marginBottom: 'var(--space-3)',
          }}
        >
          Your Body
        </p>
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-regular)',
            lineHeight: 1.70,
            color: 'var(--text-primary)',
            fontStyle: 'italic',
          }}
        >
          {somaticInvitation}
        </p>
      </div> : null}

      {offerings.length ? divider : null}

      {offerings.length ? <div className="sequential-reveal reveal-4">
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
            letterSpacing: 'var(--letter-spacing-base)',
            color: 'var(--text-secondary)',
            textTransform: "none",
            marginBottom: 'var(--space-5)',
          }}
        >
          If You Want to Go Deeper
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {offerings.map((offering: LegacyOffering, index: number) => (
            <div
              key={`${offering.title}-${index}`}
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-divider)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {offeringIcon[offering.type] ?? '◎'}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-family-body)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {offering.title}
                </p>
                {offering.duration ? (
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-secondary)',
                      marginLeft: 'auto',
                      fontStyle: 'italic',
                    }}
                  >
                    {offering.duration}
                  </span>
                ) : null}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-regular)',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {offering.description}
              </p>
            </div>
          ))}
        </div>
      </div> : null}

      {divider}

      <div className="sequential-reveal reveal-5">
        <p
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-regular)',
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '0 var(--space-2)',
          }}
        >
          {closingQuestion}
        </p>
      </div>

      <p
        className="sequential-reveal reveal-5"
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 'var(--line-height-relaxed)',
          padding: '0 var(--space-6)',
          marginTop: 'var(--space-6)',
        }}
      >
        Khepera&apos;s reflections are generated by AI and are not a substitute for professional support.
      </p>

      {onContinue ? (
        <div
          style={{
            marginTop: 'var(--space-10)',
            opacity: 1,
            transform: 'translateY(0)',
            animation: 'element-rise 420ms ease-out both',
          }}
        >
          <button onClick={onContinue} className="btn-primary">
            Return to sanctuary
          </button>
        </div>
      ) : null}
    </div>
  );
}
