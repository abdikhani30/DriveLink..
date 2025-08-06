import { useState } from "react";
import { useVehicle } from "@/contexts/vehicle-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Car, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VehicleSelector() {
  const { selectedVehicle, vehicles, setSelectedVehicle } = useVehicle();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!selectedVehicle || vehicles.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
              <Car className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500">No vehicles found</p>
              <p className="text-sm text-gray-400">Add a vehicle to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur border-white/20">
      <CardContent className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {selectedVehicle.make.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">
                    {selectedVehicle.registration}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur border-white/20">
            {vehicles.map((vehicle) => (
              <DropdownMenuItem
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={cn(
                  "flex items-center space-x-3 p-3",
                  selectedVehicle.id === vehicle.id && "bg-blue-50"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {vehicle.make.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{vehicle.registration}</p>
                  <p className="text-sm text-gray-600">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-xs text-gray-500">{vehicle.color}</p>
                </div>
                {selectedVehicle.id === vehicle.id && (
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="flex items-center space-x-3 p-3 border-t border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-gray-600">Add new vehicle</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}