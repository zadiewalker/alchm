export function CheckInSheet(props: { open: boolean; onClose: () => void; onDone: (mood: string) => void }) {
  if (!props.open) return null;
  const moods = ['Heavy', 'Anxious', 'Neutral', 'Hopeful', 'Peaceful'];
  return (
    <div className="confirmation-overlay" onClick={props.onClose}>
      <div className="confirmation-card" onClick={(e) => e.stopPropagation()}>
        <p className="confirmation-title">Quick check-in</p>
        <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
          {moods.map((m) => (
            <button key={m} type="button" className="btn-secondary" onClick={() => props.onDone(m)}>{m}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
