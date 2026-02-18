
import { DESIGN } from '@/lib/design';

export function CrisisFooter() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        paddingTop: DESIGN.spacing.lg,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        textAlign: 'center',
        fontFamily: DESIGN.typography.sansSerif,
      }}
    >
      <div
        aria-label="Crisis support resources"
        style={{
          display: 'inline-flex',
          gap: '8px',
          alignItems: 'baseline',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: DESIGN.typography.sizes.sm,
            fontFamily: DESIGN.typography.sansSerif,
          }}
        >
          Crisis support available ·
        </span>
        <a
          href="tel:988"
          aria-label="Call 988 Suicide and Crisis Lifeline"
          style={{ color: DESIGN.colors.gold, fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}
        >
          Call 988
        </a>
        <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.32)' }}>
          ·
        </span>
        <a
          href="sms:741741"
          aria-label="Text 741741 to reach Crisis Text Line"
          style={{ color: DESIGN.colors.gold, fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}
        >
          Text 741741
        </a>
      </div>
    </footer>
  );
}
