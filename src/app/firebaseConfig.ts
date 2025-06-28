import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOCGu_cgO8W5a2eRFKg83J_YeQdEjXiw",
  authDomain: "alchm-463017.firebaseapp.com",
  projectId: "alchm-463017",
  storageBucket: "alchm-463017.appspot.com",
  messagingSenderId: "10211111067",
  appId: "1:10211111067:web:4f23562b8a1f63cd8c963e",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
