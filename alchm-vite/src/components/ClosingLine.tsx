import { DESIGN } from '@/lib/design';

export function ClosingLine(props: { text: string | null; visible: boolean }) {
  if (!props.visible || !props.text) return null;
  return (
    <div style={{ marginTop: '16px' }} aria-label="Closing thought">
      <div
        style={{
          borderTop: '1px dashed rgba(164, 180, 148, 0.25)',
          borderBottom: '1px dashed rgba(164, 180, 148, 0.25)',
          paddingTop: '12px',
          paddingBottom: '12px',
          textAlign: 'center',
          color: DESIGN.colors.textSecondary,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: '15px',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}
      >
        “{props.text}”
      </div>
    </div>
  );
}

