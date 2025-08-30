// public/firebase-messaging-sw.js
// Must be plain JS, no ES imports here!

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARV19Oe2BLNMdcg6mQG45Z64R3rKSOtcU",
  authDomain: "hospital-managment-syste-fcca9.firebaseapp.com",
  projectId: "hospital-managment-syste-fcca9",
  storageBucket: "hospital-managment-syste-fcca9.firebasestorage.app",
  messagingSenderId: "254556294695",
  appId: "1:254556294695:web:27a104faa21ef0798c8802",
};

// Initialize Firebase in compat mode
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const title = payload.notification?.title || "Background Notification";
  const options = {
    body: payload.notification?.body || "You have a new message",
  };
  self.registration.showNotification(title, options);
});
