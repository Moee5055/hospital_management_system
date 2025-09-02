import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Flame, Shield, Wind, Zap } from "lucide-react";

// Disaster Monitoring Data
let disasterObj = {
  gasLevel: 0,
  flameDetected: "No",
  vibrationDetected: "No",
};

export default function DiasterMgmt() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disasterData, setDisasterData] = useState(disasterObj);

  const getGasStatus = () => {
    return disasterData.gasLevel > 350 ? "Danger" : "Safe";
  };

  useEffect(() => {
    setLoading(true);

    // Reference to the attendance collection
    const docRef = doc(db, "diaster_mgmt", "hospital-01");

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisasterData({
            ...disasterData,
          });
          setDisasterData((prev) => ({
            ...prev,
            flameDetected: data.isFlame,
            vibrationDetected: data.isVibration,
          }));
          setError(null);
        } else {
          setError("No such document.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching disaster data:", err);
        setError("Failed to fetch disaster data");
        setLoading(false);
      },
    );

    const docRef2 = doc(db, "room_mgmt", "room-01");

    // Subscribe to real-time updates
    const unsubscribe2 = onSnapshot(
      docRef2,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisasterData((prev) => ({ ...prev, gasLevel: data.airQuality }));
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
    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  if (loading)
    return <div className="text-white">Loading attendance data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="w-5 h-5 text-red-400" />
          Disaster Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <Flame
              className={`w-8 h-8 mx-auto mb-2 ${disasterData.flameDetected ? "text-red-400" : "text-gray-500"}`}
            />
            <div className="text-sm font-medium text-white">Flame</div>
            <div
              className={`text-xs ${disasterData.flameDetected ? "text-red-400" : "text-green-400"}`}
            >
              {disasterData.flameDetected ? "Detected" : "No"}
            </div>
          </div>

          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <Wind
              className={`w-8 h-8 mx-auto mb-2 ${getGasStatus() === "Danger" ? "text-red-400" : "text-green-400"}`}
            />
            <div className="text-sm font-medium text-white">Gas Level</div>
            <div className="text-xs text-gray-400">{disasterData.gasLevel}</div>
            <div
              className={`text-xs ${getGasStatus() === "Danger" ? "text-red-400" : "text-green-400"}`}
            >
              {getGasStatus()}
            </div>
          </div>

          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <Zap
              className={`w-8 h-8 mx-auto mb-2 ${disasterData.vibrationDetected ? "text-red-400" : "text-gray-500"}`}
            />
            <div className="text-sm font-medium text-white">Vibration</div>
            <div
              className={`text-xs ${disasterData.vibrationDetected ? "text-red-400" : "text-green-400"}`}
            >
              {disasterData.vibrationDetected ? "Yes" : "No"}
            </div>
          </div>
        </div>

        {(disasterData.flameDetected ||
          getGasStatus() === "Danger" ||
          disasterData.vibrationDetected) && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">DANGER DETECTED!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
