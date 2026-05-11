
import { ErrorState } from '@/components/ErrorState';
import { TypewriterText } from '@/components/TypewriterText';
import { DESIGN } from '@/lib/design';
import type { CrisisCheck } from '@/lib/crisis';

export function NewEntryReflection(props: {
  visible: boolean;
  isReflecting: boolean;
  reflection: string;
  reflectionError: string;
  crisis: CrisisCheck | null;
  onReflect: () => void;
  onReflectionComplete?: () => void;
}) {
  if (!props.visible) return null;

  return (
    <div style={{ marginTop: '18px' }}>
      {props.crisis?.detected ? (
        <div
          className="card"
          aria-label="Crisis support card"
          style={{
            padding: '16px',
            borderLeft: `3px solid ${DESIGN.colors.gold}`,
            background: DESIGN.gradients.cardWarm,
            marginBottom: '14px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: DESIGN.typography.weights.semibold, color: DESIGN.colors.textPrimary }}>
            You&apos;re not alone in this.
          </div>
          <div style={{ marginTop: '10px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
            If you&apos;re in crisis or having thoughts of self-harm:
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="tel:988"
              aria-label="Call 988"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                borderRadius: DESIGN.radius.full,
                fontFamily: DESIGN.typography.sansSerif,
                padding: '10px 14px',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              📞 Call 988
            </a>
            <a
              href="sms:741741"
              aria-label="Text 741741"
              className="btn-secondary"
              style={{
                textDecoration: 'none',
                borderRadius: DESIGN.radius.full,
                fontFamily: DESIGN.typography.sansSerif,
                padding: '10px 14px',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              💬 Text 741741
            </a>
          </div>
          <div style={{ marginTop: '12px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
            These are free, confidential, and available 24/7. Your entry has been saved safely.
          </div>
        </div>
      ) : null}

      <div style={{ fontSize: '14px', fontWeight: DESIGN.typography.weights.semibold }}>Khepera</div>
      <div style={{ marginTop: '10px' }}>
        <button
          type="button"
          onClick={props.onReflect}
          aria-label="Request a Khepera reflection"
          disabled={props.isReflecting}
          style={{
            minHeight: '44px',
            padding: '10px 14px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid rgba(232, 197, 109, 0.30)`,
            backgroundColor: 'rgba(232, 197, 109, 0.10)',
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: props.isReflecting ? 'default' : 'pointer',
            opacity: props.isReflecting ? 0.7 : 1,
          }}
        >
          {props.isReflecting ? 'Reflecting…' : 'Reflect'}
        </button>
      </div>

      {props.reflectionError ? (
        <div style={{ marginTop: '12px' }}>
          <ErrorState title="Khepera couldn't reflect" message={props.reflectionError} />
        </div>
      ) : null}
      {props.reflection ? (
        <div
          style={{
            marginTop: '12px',
            backgroundColor: 'rgba(232, 197, 109, 0.06)',
            border: `1px solid rgba(232, 197, 109, 0.18)`,
            borderRadius: DESIGN.radius.lg,
            padding: '14px',
          }}
        >
          <TypewriterText text={props.reflection} onComplete={props.onReflectionComplete} />
          <div className="khepera-attribution" aria-label="Khepera disclosure">
            ─── Khepera · AI companion · not a therapist ───
          </div>
        </div>
      ) : null}
    </div>
  );
}
