import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Navigation, Clock, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import IOSCard from "@/components/ui/ios-card";
import PaymentModal from "@/components/ui/payment-modal";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import type { CarPark } from "@shared/schema";

export default function Parking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<string>("Fetching location...");
  const [selectedPark, setSelectedPark] = useState<CarPark | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { data: carParks = [] } = useQuery<CarPark[]>({
    queryKey: ["/api/car-parks"],
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding for demo
          setCurrentLocation("123 Main Street, London");
        },
        (error) => {
          setCurrentLocation("Location unavailable");
        }
      );
    } else {
      setCurrentLocation("Location not supported");
    }
  }, []);

  const filteredCarParks = carParks.filter(park =>
    park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    park.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPark = (park: CarPark) => {
    setSelectedPark(park);
    setPaymentModalOpen(true);
  };

  const handlePaymentMethod = (method: string) => {
    console.log("Payment method selected:", method, "for park:", selectedPark?.name);
    setPaymentModalOpen(false);
    setSelectedPark(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-4 text-white">
        <h1 className="text-2xl font-bold">Parking</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search car park number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 backdrop-blur rounded-xl py-3 px-4 pl-10 border-0 text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
        </div>
      </div>

      {/* Current Location */}
      <div className="px-4 mb-6">
        <IOSCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Your Current Location</h3>
            <Navigation className="text-blue-500 w-5 h-5" />
          </div>
          {/* Interactive map view */}
          <div className="bg-blue-50 rounded-xl h-40 mb-3 relative overflow-hidden border">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-100"></div>
            {/* Mock map elements */}
            <div className="absolute inset-0 p-4">
              <div className="w-full h-full relative">
                {/* Current location marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="w-8 h-8 bg-blue-600/30 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                </div>
                {/* Nearby parking markers */}
                <div className="absolute top-1/4 right-1/4">
                  <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                </div>
                <div className="absolute bottom-1/4 left-1/4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                </div>
                <div className="absolute top-3/4 right-1/3">
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1">
              <p className="text-xs text-gray-700 font-medium">Live Location</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-600">{currentLocation}</p>
          </div>
        </IOSCard>
      </div>

      {/* Nearby Car Parks */}
      <div className="px-4">
        <h3 className="font-semibold text-white mb-4">Nearby Car Parks</h3>
        
        <div className="space-y-3">
          {filteredCarParks.map((park) => (
            <IOSCard key={park.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{park.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(park.status)}`}>
                      {park.status.charAt(0).toUpperCase() + park.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {park.location} • {park.availableSpaces} spaces available
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(park.hourlyRate)}/hour
                      </span>
                    </div>
                    <Button
                      onClick={() => handleSelectPark(park)}
                      disabled={park.status === "full"}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 flex items-center space-x-1"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{park.status === "full" ? "Waitlist" : "Quick Pay"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </IOSCard>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        amount={selectedPark?.hourlyRate || "0"}
        description={selectedPark ? `Parking at ${selectedPark.name}` : ""}
        onPaymentMethod={handlePaymentMethod}
      />
    </div>
  );
}
