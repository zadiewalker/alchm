// saveJournalEntry.ts

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// Update the import path below if your firebaseConfig file is in a different location
import { db, auth } from '../app/firebaseConfig' // adjust path as needed
// If you do not have this file, create it with your Firebase config and export 'db' as shown below:

// Example: src/firebase/firebaseConfig.ts
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// const firebaseConfig = { /* your config */ };
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
import { getAuth } from 'firebase/auth';

/**
 * Saves a journal entry to Firestore.
 * @param text - The user's written reflection.
 * @param emotion - The emotion tag selected by the user.
 */
const saveJournalEntry = async ({ text, emotion }: { text: string; emotion: string }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  // 🧠 Soft fallback: User is not authenticated
  if (!user) {
    return {
      success: false,
      error: "Not authenticated",
      message: "Please sign in to begin reflecting with Khepera."
    };
  }

  try {
    // 📝 Attempt to save to Firestore
    await addDoc(collection(db, 'entries'), {
      userId: user.uid,
      text,
      emotion,
      timestamp: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    // 🔐 Handle permission-related errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const err = error as { code: string };

      if (err.code === 'permission-denied') {
        return {
          success: false,
          error: err.code,
          message: "🔒 Hmm… your reflection couldn’t be saved. Check your login and try again."
        };
      } else {
        return {
          success: false,
          error: err.code,
          message: "Something went wrong on our end. Try again or reach out to support."
        };
      }
    }

    // 🧯 Catch-all fallback
    return {
      success: false,
      error: "unknown",
      message: "Something went wrong on our end. Try again or reach out to support."
    };
  }
};

export default saveJournalEntry;
