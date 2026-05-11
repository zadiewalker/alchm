export function LayerBreadcrumb(props: { family: string; specificLabel: string | null }) {
  return <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{props.specificLabel || props.family}</div>;
}
