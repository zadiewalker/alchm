import { getEntries } from '@/lib/journal';

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function useDashboardEngagement() {
  const entries = getEntries();
  const recentEntry = entries[0] || null;
  return {
    state: 'ready' as const,
    entries,
    recentEntry,
    greetingTitle: 'Something brought you here.',
    greetingSubtitle: 'Khepera has something for you.',
    beginLabel: "Write what's heavy",
    ctaSubtext: "You don't have to carry it alone.",
    secondaryLabel: 'Just a check-in →',
    prefillFromTodayCheckIn: () => {},
    saveQuickCheckIn: () => {},
  };
}
