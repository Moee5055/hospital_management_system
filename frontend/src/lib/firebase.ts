// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyARV19Oe2BLNMdcg6mQG45Z64R3rKSOtcU",
  authDomain: "hospital-managment-syste-fcca9.firebaseapp.com",
  databaseURL:
    "https://hospital-managment-syste-fcca9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hospital-managment-syste-fcca9",
  storageBucket: "hospital-managment-syste-fcca9.firebasestorage.app",
  messagingSenderId: "254556294695",
  appId: "1:254556294695:web:27a104faa21ef0798c8802",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Request notification permission + get token
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted.");
      return null;
    }

    // Register your service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // 👇 Use your Web Push cert (VAPID key) from Firebase console
    const vapidKey =
      "BNDfAGUQ3-BxF1Ns9kKU_F-FHvKZrf2f4tkq0i3998w1HqDh1VTEmW5L9QFLY4tD2YPig6Pqp7X53dqOCL9tzdA";

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    console.log("✅ FCM token:", token);
    return token;
  } catch (err) {
    console.error("❌ Error getting FCM token:", err);
    return null;
  }
}

// Foreground messages
export function onForegroundMessage() {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground message received:", payload);
    alert(payload.notification?.title + ": " + payload.notification?.body);
  });
}
