export function Chip({ 
  t, 
  d 
}: { 
  t: string; 
  d?: string; 
}) {
  return (
    <div className="rounded-xl bg-white border border-[var(--line)] shadow-sm px-3 py-2">
      <div className="text-[13px] font-medium text-[var(--ink)]">{t}</div>
      {d && <div className="text-xs text-[var(--ink-mute)]">{d}</div>}
    </div>
  );
}