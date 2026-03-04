export function WeeklyReflectionCard(props: { text?: string }) {
  if (!props.text) return null;
  return <div className="card" style={{ marginTop: '12px', fontStyle: 'italic' }}>{props.text}</div>;
}
