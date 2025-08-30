// src/App.tsx
import { useEffect, useState } from "react";
import { requestNotificationPermission, messaging } from "./lib/firebase";
import { onMessage } from "firebase/messaging";
import HospitalDashboard from "./components/HospitalDashboard";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  async function enableNotifications() {
    const t = await requestNotificationPermission();
    setToken(t);
  }

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received:", payload);
      alert(
        (payload.notification?.title || "Notification") +
          ": " +
          (payload.notification?.body || ""),
      );
      setMessages((prev) => [payload, ...prev]);
    });

    return () => {
      // Cleanup listener
      unsubscribe && unsubscribe();
    };
  }, []);

  return <HospitalDashboard />;
}

// <div style={{ padding: "1rem" }}>
//   <h1>FCM Demo</h1>
//   <button onClick={enableNotifications}>Enable Notifications</button>

//   {token && (
//     <>
//       <h3>FCM Token</h3>
//       <textarea
//         readOnly
//         value={token}
//         style={{ width: "100%", height: "120px" }}
//       />
//     </>
//   )}

//   <h3>Foreground Messages</h3>
//   <ul>
//     {messages.map((msg, i) => (
//       <li key={i}>
//         {msg.notification?.title} - {msg.notification?.body}
//       </li>
//     ))}
//   </ul>
// </div>
