import { DESIGN } from '@/lib/design';

const THERAPEUTIC_LENSES: Record<string, string> = {
  cbt: 'Cognitive Reframing',
  ifs: 'Parts Work',
  somatic: 'Somatic Awareness',
  narrative: 'Story Perspective',
  existential: 'Existential Inquiry',
};

function pickLens(args: { preferred: string | null; usedSomatic: boolean; emotionFamily: string | null }): string {
  if (args.usedSomatic) return 'somatic';
  if (args.preferred && THERAPEUTIC_LENSES[args.preferred]) return args.preferred;
  switch (args.emotionFamily) {
    case 'fear':
      return 'somatic';
    case 'anger':
      return 'ifs';
    case 'sadness':
      return 'narrative';
    case 'anticipation':
      return 'existential';
    default:
      return 'cbt';
  }
}

export function PromptCard(props: {
  prompt: string;
  emotionFamily: string | null;
  usedSomatic: boolean;
  preferredFramework: string | null;
}) {
  const lensKey = pickLens({ preferred: props.preferredFramework, usedSomatic: props.usedSomatic, emotionFamily: props.emotionFamily });
  const lensLabel = THERAPEUTIC_LENSES[lensKey] || 'Perspective';

  return (
    <div
      className="card"
      aria-label="Khepera writing prompt"
      style={{
        padding: '16px',
        borderLeft: `3px solid ${DESIGN.colors.gold}`,
        background: DESIGN.gradients.cardWarm,
      }}
    >
      <div style={{ fontSize: '12px', letterSpacing: '0.10em', textTransform: 'uppercase', color: DESIGN.colors.textMuted }}>
        Viewing through: {lensLabel}
      </div>
      <div style={{ marginTop: '10px', fontSize: '15px', lineHeight: 1.7, color: DESIGN.colors.textPrimary, fontStyle: 'italic' }}>
        “{props.prompt}”
      </div>
      <div style={{ marginTop: '12px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
        ─── Khepera
      </div>
    </div>
  );
}

