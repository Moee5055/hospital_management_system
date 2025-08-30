import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Droplets, Thermometer, Wind } from "lucide-react";
import { useEffect, useState } from "react";

export default function RoomMgmt() {
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // Reference to the attendance collection
    const docRef = doc(db, "room_mgmt", "room-01");

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setRoom({ airQuality: 85, ...docSnap.data() });
          setError(null);
        } else {
          setError("No such document.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching room data:", err);
        setError("Failed to fetch room data");
        setLoading(false);
      },
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const getRoomStatus = (airQuality: number) => {
    if (airQuality >= 80) return "Good";
    if (airQuality >= 60) return "Warning";
    return "Poor";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "text-green-400";
      case "Warning":
        return "text-yellow-400";
      case "Poor":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading)
    return <div className="text-white">Loading attendance data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-600">
        <div className="text-center">
          <Thermometer className="w-4 h-4 mx-auto mb-1 text-red-400" />
          <div className="text-sm font-medium text-white">
            {room.temperature}°C
          </div>
          <div className="text-xs text-gray-400">Temp</div>
        </div>
        <div className="text-center">
          <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-400" />
          <div className="text-sm font-medium text-white">{room.humidity}%</div>
          <div className="text-xs text-gray-400">Humidity</div>
        </div>
        <div className="text-center">
          <Wind className="w-4 h-4 mx-auto mb-1 text-green-400" />
          <div className="text-sm font-medium text-white">
            {room.airQuality}
          </div>
          <div className="text-xs text-gray-400">Air Quality</div>
        </div>
      </div>
      {/* Room Status */}
      <div className="mt-3 p-2 bg-gray-600 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white">Room Status:</span>
          <span
            className={`text-xs font-medium ${getStatusColor(getRoomStatus(room.airQuality))}`}
          >
            {getRoomStatus(room.airQuality)}
          </span>
        </div>
      </div>
    </>
  );
}
