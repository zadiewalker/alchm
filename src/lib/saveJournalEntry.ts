import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore } from "../app/firebaseConfig";

/**
 * Type definition for a journal entry.
 */
interface JournalEntry {
  reflection: string;
  pathwayId: string;
  microcopyTone?: string;
  tags?: string[];
}

export async function saveJournalEntry(entry: JournalEntry) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated. Please sign in to save reflections.");
  }

  try {
    const userJournalRef = collection(firestore, "users", user.uid, "journalEntries");

    await addDoc(userJournalRef, {
      ...entry,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    console.log("Reflection saved successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error saving reflection:", error);
    throw new Error("Failed to save reflection. Please try again.");
  }
}

