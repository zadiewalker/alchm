export function StatChips({ streak, last, privateLabel = "Private & encrypted" }: {
  streak: number; last: string; privateLabel?: string;
}) {
  const Chip = ({ t, d }: { t: string; d: string }) => (
    <div className="rounded-xl bg-white border border-[var(--line)] shadow-sm px-3 py-2">
      <div className="text-[13px] font-medium text-[var(--ink)]">{t}</div>
      <div className="text-xs text-[var(--ink-mute)]">{d}</div>
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Chip t="Streak" d={`Still here: ${streak} days`} />
      <Chip t="Last entry" d={last} />
      <Chip t="Privacy" d={privateLabel} />
    </div>
  );
}