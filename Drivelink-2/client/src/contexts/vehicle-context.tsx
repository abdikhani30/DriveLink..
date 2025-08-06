import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle } from '@shared/schema';

interface VehicleContextType {
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  vehicles: Vehicle[];
  setVehicles: (vehicles: Vehicle[]) => void;
  isLoading: boolean;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved vehicle selection from localStorage
  useEffect(() => {
    const savedVehicleId = localStorage.getItem('selectedVehicleId');
    const savedVehicles = localStorage.getItem('vehicles');
    
    if (savedVehicles) {
      const parsedVehicles = JSON.parse(savedVehicles);
      setVehicles(parsedVehicles);
      
      if (savedVehicleId) {
        const vehicle = parsedVehicles.find((v: Vehicle) => v.id === parseInt(savedVehicleId));
        if (vehicle) {
          setSelectedVehicle(vehicle);
        } else if (parsedVehicles.length > 0) {
          setSelectedVehicle(parsedVehicles[0]);
        }
      } else if (parsedVehicles.length > 0) {
        setSelectedVehicle(parsedVehicles[0]);
      }
    }
    setIsLoading(false);
  }, []);

  // Save selected vehicle to localStorage when it changes
  useEffect(() => {
    if (selectedVehicle) {
      localStorage.setItem('selectedVehicleId', selectedVehicle.id.toString());
    }
  }, [selectedVehicle]);

  // Save vehicles to localStorage when they change
  useEffect(() => {
    if (vehicles.length > 0) {
      localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles]);

  return (
    <VehicleContext.Provider value={{
      selectedVehicle,
      setSelectedVehicle,
      vehicles,
      setVehicles,
      isLoading
    }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
}