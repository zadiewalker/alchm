// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (replace these if needed)
const firebaseConfig = {
  apiKey: "AIzaSyAOCGu_cg08W5a2eRFKg03J_YeQDGjEXiw",
  authDomain: "alchm-463017.firebaseapp.com",
  projectId: "alchm-463017",
  storageBucket: "alchm-463017.appspot.com",
  messagingSenderId: "10211111067",
  appId: "1:10211111067:web:4f23562b8a1f63cd8c963e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);
