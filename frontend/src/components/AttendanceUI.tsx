import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserCheck } from "lucide-react";

// Define the data structure
interface AttendanceData {
  uid: string;
  id: string;
  checkedIn: boolean;
  name: string;
  time: Date; // Converted from Firebase timestamp
}

export default function AttendanceUI() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let totalPresentToday = 0;
  attendanceData.forEach((staff) => staff.checkedIn && totalPresentToday++);

  useEffect(() => {
    setLoading(true);

    // Reference to the attendance collection
    const colRef = collection(db, "attendance_mgmt");

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: AttendanceData[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            checkedIn: data["checked-in"] ?? false, // fallback if missing
            name: data.name ?? "",
            time: data.time?.toDate() ?? null,
            uid: data.uid ?? "",
          };
        });
        setAttendanceData(items);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching attendance data:", err);
        setError("Failed to fetch attendance data");
        setLoading(false);
      },
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading attendance data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5 text-blue-400" />
          Recent Staff Attendance
          <Badge className="bg-blue-600 text-white ml-auto">
            {totalPresentToday} Present Today
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {attendanceData.map((staff, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gray-600 text-white text-sm">
                {staff.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{staff.name}</div>
              <div className="text-xs text-gray-400">UID: {staff.uid}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {staff.time.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                {staff.checkedIn ? (
                  <UserCheck className="w-3 h-3 text-green-400" />
                ) : (
                  <UserCheck className="w-3 h-3 text-red-400" />
                )}
                <span
                  className={`text-xs ${staff.checkedIn ? "text-green-400" : "text-red-400"}`}
                >
                  {staff.checkedIn ? "IN" : "OUT"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
