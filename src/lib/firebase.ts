import {
  getFirebaseAppOrNull,
  getFirebaseAuthOrNull,
  getFirebaseFunctionsOrNull,
  getFirestoreDbOrNull,
} from '@/services/firebase/firebaseService';

const app = getFirebaseAppOrNull();
const auth = getFirebaseAuthOrNull();
const db = getFirestoreDbOrNull();
const functions = getFirebaseFunctionsOrNull();

export { auth, db, functions };
export default app;
