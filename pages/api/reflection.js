import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { cert } from "firebase-admin/app";

// Initialize Firebase Admin SDK (for secure server operations)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

// Initialize Firebase Client SDK (optional if using client features)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, prompt, response, shared } = req.body;

  if (!userId || !prompt || !response) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const reflectionRef = collection(db, "users", userId, "reflections");
    const newReflection = await addDoc(reflectionRef, {
      prompt,
      response,
      shared: shared ?? false,
      createdAt: serverTimestamp(),
    });

    return res
      .status(200)
      .json({ message: "Reflection saved", id: newReflection.id });
  } catch (error) {
    console.error("Error saving reflection:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
