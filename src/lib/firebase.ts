
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "studio-6296861389-aca6c",
  appId: "1:291759077301:web:8e63695f25c0f6b2524bfc",
  apiKey: "AIzaSyBccnQPTBu_bf3GpLvbsl3rbtCCvPrd6FM",
  authDomain: "studio-6296861389-aca6c.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "291759077301",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
