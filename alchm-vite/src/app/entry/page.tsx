import { useRouter } from '@/router';
import { JournalDetail } from '@/app/journal/JournalDetail';
import { getEntries } from '@/lib/journal';
import { readString, STORAGE_KEYS } from '@/lib/storage';

export default function EntryPage() {
  const router = useRouter();
  const id = readString(STORAGE_KEYS.selectedEntryId, '');
  const entry = getEntries().find((e) => e.id === id) || getEntries()[0];
  if (!entry) return <div style={{ padding: 24 }}>No entry selected.</div>;
  return <JournalDetail entry={entry} onClose={() => router.back()} />;
}
