import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function WastManagement() {
  const [currentWardIndex, setCurrentWardIndex] = useState(0);
  const [wardWasteBins, setWardWasteBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // Reference to the waste management collection
    const colRef = collection(db, "waste_mgmt"); // assuming your collection is named "wards"

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id, // wardId
            wardName: data.wardName,
            bins: data.bins.map((bin) => ({
              id: bin.id,
              type: bin.type,
              level: bin.level,
              lastEmpty: bin.lastEmpty,
            })),
          };
        });

        setWardWasteBins(items); // update state with all wards
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching ward data:", err);
        setError("Failed to fetch ward data");
        setLoading(false);
      },
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const nextWard = () => {
    setCurrentWardIndex((prev) => (prev + 1) % wardWasteBins.length);
  };

  const prevWard = () => {
    setCurrentWardIndex(
      (prev) => (prev - 1 + wardWasteBins.length) % wardWasteBins.length,
    );
  };

  // Get total critical bins across all wards
  const getCriticalBinsCount = () => {
    return wardWasteBins.reduce((count, ward) => {
      return count + ward.bins.filter((bin) => bin.level > 90).length;
    }, 0);
  };

  if (loading) return <div>Loading attendance data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Trash2 className="w-5 h-5 text-green-400" />
          Ward Waste Management
          <Badge className="bg-orange-600 text-white ml-auto">
            {currentWardIndex + 1} of {wardWasteBins.length}
          </Badge>
          {getCriticalBinsCount() > 0 && (
            <Badge className="bg-red-600 text-white">
              {getCriticalBinsCount()} Critical
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-4">
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={prevWard}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <div className="text-sm font-medium text-white">
                {wardWasteBins[currentWardIndex]?.wardName}
              </div>
              <div className="text-xs text-gray-400">
                {wardWasteBins[currentWardIndex]?.wardId}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              onClick={nextWard}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Ward's Bins Display */}
          <div className="grid grid-cols-2 gap-6">
            {wardWasteBins[currentWardIndex].bins.map((bin, binIndex) => (
              <div key={binIndex} className="text-center">
                {/* Bin Visual */}
                <div className="relative mx-auto w-20 h-24 mb-4">
                  <div className="absolute bottom-0 w-full h-20 bg-gray-600 rounded-b-lg border-2 border-gray-500">
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-1000 ${
                        bin.level > 90
                          ? "bg-red-500"
                          : bin.level > 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ height: `${(bin.level / 100) * 100}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {bin.level}%
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 w-full h-4 bg-gray-500 rounded-t-lg border-2 border-gray-400"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-400 rounded-full"></div>
                </div>

                {/* Bin Info */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white">
                    {bin.type}
                  </div>
                  <div className="text-xs text-gray-400">{bin.id}</div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    Last emptied: {bin.lastEmpty}
                  </div>

                  {bin.level > 90 && (
                    <div className="flex items-center justify-center gap-1 text-sm text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      Bin Full!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ward Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {wardWasteBins.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentWardIndex ? "bg-blue-400" : "bg-gray-600"}`}
              ></div>
            ))}
          </div>

          {/* Ward Summary */}
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Ward Status:</span>
              <div className="flex items-center gap-4">
                <span className="text-green-400">
                  {
                    wardWasteBins[currentWardIndex].bins.filter(
                      (bin) => bin.level <= 70,
                    ).length
                  }{" "}
                  Normal
                </span>
                <span className="text-yellow-400">
                  {
                    wardWasteBins[currentWardIndex].bins.filter(
                      (bin) => bin.level > 70 && bin.level <= 90,
                    ).length
                  }{" "}
                  Warning
                </span>
                <span className="text-red-400">
                  {
                    wardWasteBins[currentWardIndex].bins.filter(
                      (bin) => bin.level > 90,
                    ).length
                  }{" "}
                  Critical
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
