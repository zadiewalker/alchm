import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "./firebase";

export async function upsertUser(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  const isNewUser = !snap.exists();
  const providerIds = u.providerData.map(p => p.providerId);
  const applePrivate = (u.email ?? "").endsWith("@privaterelay.appleid.com");
  
  const base = {
    uid: u.uid,
    email: u.email ?? null,
    displayName: u.displayName ?? null,
    photoURL: u.photoURL ?? null,
    providers: providerIds,
    applePrivateEmail: applePrivate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  if (isNewUser) {
    await setDoc(ref, base);
    console.log('Created new user:', u.uid);
  } else {
    await setDoc(ref, { ...base, createdAt: snap.data().createdAt }, { merge: true });
    console.log('Updated existing user:', u.uid);
  }
  
  return { isNew: isNewUser, user: base };
}