import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

// NOTE: These values should be provided by the user and stored in .env
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging: Messaging | undefined;

try {
    messaging = getMessaging(app);
} catch (error) {
    console.error("Firebase Messaging failed to initialize:", error);
}

export { app, messaging };
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
