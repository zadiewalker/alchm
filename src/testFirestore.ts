// src/testFirestore.ts

import { saveJournalEntry } from "./lib/firestore";

async function testSave() {
  try {
    const id = await saveJournalEntry("grateful", "I felt grateful for the guidance I received today.");
    console.log(`✅ Test succeeded. Entry saved with ID: ${id}`);
  } catch (error) {
    console.error("❌ Test failed. Could not save journal entry:", error);
  }
}

testSave();
