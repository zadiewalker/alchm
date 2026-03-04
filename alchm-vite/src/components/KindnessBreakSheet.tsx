export function KindnessBreakSheet(props: { open: boolean; onClose: () => void; onConfirm: (returnDate: string) => void }) {
  if (!props.open) return null;
  return (
    <div className="confirmation-overlay" onClick={props.onClose}>
      <div className="confirmation-card" onClick={(e) => e.stopPropagation()}>
        <p className="confirmation-title">Take a kindness break</p>
        <p className="confirmation-body">No pressure. ALCHM will be here.</p>
        <button type="button" className="btn-primary" onClick={() => props.onConfirm(new Date(Date.now() + 3 * 86400000).toISOString())}>Start break</button>
      </div>
    </div>
  );
}
