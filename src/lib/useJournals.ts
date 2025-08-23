// src/lib/useJournals.ts
import { useEffect, useState } from "react";

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

export function useJournals() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // TODO: Replace with Firestore fetch logic
    setEntries([
      {
        id: "1",
        title: "First Journal",
        content: "...",
        createdAt: new Date(),
      },
    ]);
  }, []);

  return entries;
}
