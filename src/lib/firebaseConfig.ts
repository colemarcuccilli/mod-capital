import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import other services like getStorage if needed
// import { getStorage } from "firebase/storage";

// --- Use the CORRECT config object from the Firebase Console --- 
const firebaseConfig = {
  apiKey: "AIzaSyBKkkFq_iZoeX8jnVpW7JS_rG2hvbCKOuk", // <-- CORRECT Key from Firebase console screenshot
  authDomain: "domentrathedealroom.firebaseapp.com",
  projectId: "domentrathedealroom",
  storageBucket: "domentrathedealroom.firebasestorage.app",
  messagingSenderId: "651705791703",
  appId: "1:651705791703:web:e746c6c2ec9fbbdc902c92",
  measurementId: "G-DBJDC87PDF" // Optional
};

// Initialize Firebase (ensure it's only initialized once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize and export services
const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app);

export { app, auth, db /*, storage */ }; 