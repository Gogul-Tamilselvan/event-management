
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQIoyXKbxfyN7any0CZc8DGU5rHbFXads",
  authDomain: "zenith-official.firebaseapp.com",
  projectId: "zenith-official",
  storageBucket: "zenith-official.appspot.com",
  messagingSenderId: "71589870265",
  appId: "1:71589870265:web:039590946e1e1b9c53b968"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
