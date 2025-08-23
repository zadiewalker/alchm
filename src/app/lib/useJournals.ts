export function getAllJournals() {
  // Placeholder function
  return [
    {
      id: "1",
      title: "First Journal Entry",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function addJournalEntry(entry: { title: string; content: string }) {
  // Mock implementation - replace with Firestore logic later
  console.log("Journal entry added:", entry);
  return { success: true };
}
