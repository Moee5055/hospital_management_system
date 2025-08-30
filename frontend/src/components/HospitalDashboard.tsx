import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Activity,
  Home,
  Settings,
  Flame,
  Wind,
  Zap,
  Wifi,
  WifiOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Bed,
  User,
  Calendar,
  TrendingUp,
  Battery,
} from "lucide-react";
import AttendanceUI from "./AttendanceUI";
import WastManagement from "./WasteMgmt";
import RoomMgmt from "./RoomMgmt";
import ParkingMgmt from "./ParkingMgmt";

export default function HospitalDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [firebaseConnected, setFirebaseConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Smart Parking Data
  const [parkingSlots, setParkingSlots] = useState([
    { id: 1, status: "available", reservedBy: null },
    { id: 2, status: "occupied", reservedBy: null },
    { id: 3, status: "reserved", reservedBy: "You" },
    { id: 4, status: "available", reservedBy: null },
    { id: 5, status: "occupied", reservedBy: null },
    { id: 6, status: "available", reservedBy: null },
  ]);

  const reserveSlot = (slotId: number) => {
    setParkingSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId && slot.status === "available"
          ? { ...slot, status: "reserved", reservedBy: "You" }
          : slot,
      ),
    );
  };

  // Disaster Monitoring Data
  const disasterData = {
    gasLevel: 245,
    flameDetected: false,
    vibrationDetected: false,
    gasStatus: 245 > 400 ? "Danger" : "Safe",
  };

  // Multiple Room Data with Beds
  const roomsData = [
    {
      id: "ICU-01",
      name: "Intensive Care Unit 1",
      totalBeds: 6,
      occupiedBeds: 4,
      beds: [
        { id: 1, status: "occupied", patient: "John Doe" },
        { id: 2, status: "occupied", patient: "Jane Smith" },
        { id: 3, status: "available", patient: null },
        { id: 4, status: "occupied", patient: "Mike Johnson" },
        { id: 5, status: "occupied", patient: "Sarah Wilson" },
        { id: 6, status: "available", patient: null },
      ],
    },
  ];

  // Hospital Statistics Data
  const hospitalStats = {
    totalPatients: 156,
    criticalPatients: 8,
    dischargedToday: 12,
    newAdmissions: 7,
    availableBeds: roomsData.reduce(
      (acc, room) => acc + (room.totalBeds - room.occupiedBeds),
      0,
    ),
    totalBeds: roomsData.reduce((acc, room) => acc + room.totalBeds, 0),
    occupancyRate: Math.round(
      (roomsData.reduce((acc, room) => acc + room.occupiedBeds, 0) /
        roomsData.reduce((acc, room) => acc + room.totalBeds, 0)) *
        100,
    ),
    emergencyAlerts: 3,
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Smart Hospital Dashboard
              </h1>
              <p className="text-xs text-gray-400">
                {currentTime.toLocaleDateString()} •{" "}
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {firebaseConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs text-gray-400">
                {firebaseConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                {hospitalStats.emergencyAlerts}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 pb-24">
        {/* Attendance System */}
        <AttendanceUI />

        {/* Smart Parking System */}
        <ParkingMgmt />

        {/* Ward-based Waste Management - Carousel */}
        <WastManagement />

        {/* Disaster Monitoring */}
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
                  className={`w-8 h-8 mx-auto mb-2 ${disasterData.gasStatus === "Danger" ? "text-red-400" : "text-green-400"}`}
                />
                <div className="text-sm font-medium text-white">Gas Level</div>
                <div className="text-xs text-gray-400">
                  {disasterData.gasLevel}
                </div>
                <div
                  className={`text-xs ${disasterData.gasStatus === "Danger" ? "text-red-400" : "text-green-400"}`}
                >
                  {disasterData.gasStatus}
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
              disasterData.gasStatus === "Danger" ||
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

        {/* Multiple Room Monitoring */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bed className="w-5 h-5 text-blue-400" />
              Room & Bed Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomsData.map((room, roomIndex) => (
              <div key={roomIndex} className="p-4 bg-gray-700 rounded-lg">
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-white">{room.name}</div>
                    <div className="text-sm text-gray-400">{room.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {room.totalBeds - room.occupiedBeds}/{room.totalBeds}{" "}
                      Available
                    </div>
                    <div className="text-xs text-gray-400">
                      {room.occupiedBeds} Occupied
                    </div>
                  </div>
                </div>

                {/* Bed Layout */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {room.beds.map((bed) => (
                    <div key={bed.id} className="text-center">
                      <div
                        className={`relative w-full h-12 rounded-lg border-2 border-dashed flex items-center justify-center mb-1 ${
                          bed.status === "occupied"
                            ? "bg-red-900/30 border-red-600"
                            : "bg-green-900/30 border-green-600"
                        }`}
                      >
                        {bed.status === "occupied" ? (
                          <User className="w-4 h-4 text-red-400" />
                        ) : (
                          <Bed className="w-4 h-4 text-green-400" />
                        )}
                        <div
                          className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
                            bed.status === "occupied"
                              ? "bg-red-400"
                              : "bg-green-400"
                          }`}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400">Bed {bed.id}</div>
                      {bed.patient && (
                        <div className="text-xs text-white truncate">
                          {bed.patient}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Room Environmental Data */}
                <RoomMgmt />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hospital Statistics & Analytics */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Hospital Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Patient Statistics */}
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">
                    Patients
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-medium">
                      {hospitalStats.totalPatients}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Critical:</span>
                    <span className="text-red-400 font-medium">
                      {hospitalStats.criticalPatients}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bed Occupancy */}
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">
                    Bed Occupancy
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Available:</span>
                    <span className="text-green-400 font-medium">
                      {hospitalStats.availableBeds}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rate:</span>
                    <span className="text-white font-medium">
                      {hospitalStats.occupancyRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Daily Activity */}
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    Today's Activity
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Admissions:</span>
                    <span className="text-green-400 font-medium">
                      {hospitalStats.newAdmissions}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Discharged:</span>
                    <span className="text-blue-400 font-medium">
                      {hospitalStats.dischargedToday}
                    </span>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">
                    System Status
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Firebase:</span>
                    <span
                      className={`font-medium ${firebaseConnected ? "text-green-400" : "text-red-400"}`}
                    >
                      {firebaseConnected ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Alerts:</span>
                    <span className="text-red-400 font-medium">
                      {hospitalStats.emergencyAlerts}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-1">
            <Home className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Alerts</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
