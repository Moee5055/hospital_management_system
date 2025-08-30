import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { useEffect, useState } from "react";
import { rtdb } from "@/lib/firebase";
import { get, onValue, ref } from "firebase/database";

export default function ParkingMgmt() {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const snapShot = await get(ref(rtdb, "parking"));
  //     const arr = Object.entries(snapShot.val()).map(([key, value]) => ({
  //       id: key,
  //       ...(value as object),
  //     }));
  //     console.log("data: ", arr);
  //     setParkingSlots(arr);
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    setLoading(true);
    const slotsRef = ref(rtdb, "parking"); // adjust path

    const unsubscribe = onValue(slotsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Convert object → array
        const arr = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as object),
        }));

        setParkingSlots(arr);
      } else {
        setError("Error getting parkings data");
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, []);

  if (loading)
    return <div className="text-white">Loading attendance data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Car className="w-5 h-5 text-purple-400" />
          Smart Parking System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {parkingSlots.map((slot) => (
            <div key={slot.id} className="text-center">
              <div className="relative w-full h-20 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center mb-2">
                {slot.status.toLowerCase() === "occupied" ? (
                  <Car className="w-8 h-8 text-red-400" />
                ) : slot.status === "reserved" ? (
                  <div className="text-yellow-400">
                    <Car className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-gray-500">
                    {slot.id}
                  </div>
                )}

                <div
                  className={`absolute top-1 right-1 w-3 h-3 rounded-full ${
                    slot.status.toLowerCase() === "empty"
                      ? "bg-green-400"
                      : slot.status === "reserved"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                  }`}
                ></div>
              </div>

              <div className="text-xs text-gray-400 mb-1">Slot {slot.id}</div>

              {slot.status.toLowerCase() === "empty" ? (
                <div className="text-xs text-green-600">Available</div>
              ) : (
                <div className="text-xs text-red-400">Occupied</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
