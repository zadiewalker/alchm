export function PhaseTransition(props: { phaseId: string; onContinue: () => void }) {
  return (
    <div className="confirmation-overlay" role="dialog" aria-label="Growth phase">
      <div className="confirmation-card">
        <p className="confirmation-title">Khepera is evolving</p>
        <p className="confirmation-body">New phase: {props.phaseId}</p>
        <button type="button" className="btn-primary" onClick={props.onContinue}>Continue</button>
      </div>
    </div>
  );
}
