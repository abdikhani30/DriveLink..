import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Car, ParkingCircle, Receipt, Wrench, Users } from "lucide-react";
import { useLocation } from "wouter";
import IOSCard from "@/components/ui/ios-card";
import { Button } from "../../components/ui/button";
import { useVehicle } from "@/contexts/vehicle-context";
import VehicleSelector from "@/components/vehicle-selector";
import type { Vehicle, Driver } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { selectedVehicle, setVehicles, setSelectedVehicle } = useVehicle();

  const { data: vehicles } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  // Update vehicles in context when data loads
  useEffect(() => {
    if (vehicles) {
      setVehicles(vehicles);
      if (!selectedVehicle && vehicles.length > 0) {
        setSelectedVehicle(vehicles[0]);
      }
    }
  }, [vehicles, selectedVehicle, setVehicles, setSelectedVehicle]);

  const { data: activeDriver } = useQuery<Driver>({
    queryKey: ["/api/vehicles", selectedVehicle?.id || 1, "active-driver"],
    enabled: !!selectedVehicle,
  });

  const vehicle = selectedVehicle;

  const quickActions = [
    {
      title: "Quick Park",
      subtitle: "Find nearby spots",
      icon: ParkingCircle,
      color: "text-blue-500",
      path: "/parking",
    },
    {
      title: "Pay Fine",
      subtitle: "2 pending",
      icon: Receipt,
      color: "text-red-500",
      path: "/fines",
    },
    {
      title: "Service",
      subtitle: "Next: 2 weeks",
      icon: Wrench,
      color: "text-green-500",
      path: "/services",
    },
    {
      title: "Switch Driver",
      subtitle: "3 authorized",
      icon: Users,
      color: "text-purple-500",
      path: "/more",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">DriveLink</h1>
            <p className="text-white/80">Smart Mobility</p>
          </div>
          <div className="w-10 h-10 glass-effect rounded-full flex items-center justify-center">
            <Car className="text-white w-5 h-5" />
          </div>
        </div>
        
        {/* Vehicle Selector */}
        <VehicleSelector />
      </div>

      {/* Active Driver Section */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Active Users</h2>
        <IOSCard className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {activeDriver?.name?.charAt(0) || "M"}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {activeDriver?.name || "Marcus (son)"}
              </p>
              <p className="text-sm text-gray-600">Currently in car park P-127</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </IOSCard>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                onClick={() => setLocation(action.path)}
                className="h-auto p-0"
              >
                <IOSCard className="w-full hover:scale-105 transition-transform">
                  <div className="text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${action.color}`} />
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-600">{action.subtitle}</p>
                  </div>
                </IOSCard>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
