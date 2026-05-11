export function generateNudge() { return 'Still here.'; }
export function nextOccurrence(hour: number, minute: number) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d;
}
