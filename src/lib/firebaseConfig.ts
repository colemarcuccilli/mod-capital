import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import other services like getStorage if needed
import { getStorage } from "firebase/storage";

// --- Use the CORRECT config object from the Firebase Console ---
// Switched to the new DomentraAI project config as the original had connection issues
const firebaseConfig = {
  apiKey: "AIzaSyAXGkCMiPUMudycJQzinxc_Fhnn3kOUNbs", // DomentraAI Key
  authDomain: "domentraai-2e1b7.firebaseapp.com",     // DomentraAI Domain
  projectId: "domentraai-2e1b7",                 // DomentraAI Project ID
  storageBucket: "domentraai-2e1b7.firebasestorage.app", // Use the .firebasestorage.app domain
  messagingSenderId: "851490848478",             // DomentraAI Sender ID
  appId: "1:851490848478:web:5dbcb0ce8898696ec9cc4f",   // DomentraAI App ID
  measurementId: "G-W5PF0PZ829"                 // DomentraAI Measurement ID (Optional)
};

// Initialize Firebase (ensure it's only initialized once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize and export services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 