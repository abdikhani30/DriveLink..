
import { useLocation } from "wouter";
import { Home, Car, Wrench, Receipt, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Parking",
    path: "/parking",
    icon: Car,
  },
  {
    name: "Services",
    path: "/services",
    icon: Wrench,
  },
  {
    name: "Fines",
    path: "/fines",
    icon: Receipt,
  },
  {
    name: "Felix",
    path: "/felix",
    icon: null,
    isProfile: true,
  },
];

export default function BottomTabs() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm">
      <div className="bg-white/95 backdrop-blur border-t border-gray-200 rounded-t-3xl px-4 py-2">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location === tab.path;
            
            return (
              <button
                key={tab.name}
                onClick={() => setLocation(tab.path)}
                className={cn(
                  "flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all",
                  isActive
                    ? "text-green-700 bg-green-100"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                {tab.isProfile ? (
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center overflow-hidden",
                    isActive ? "bg-green-600" : "bg-green-500"
                  )}>
                    <div className="w-5 h-5 bg-orange-400 rounded-lg flex items-center justify-center relative">
                      <div className="w-4 h-4 bg-orange-600 rounded-sm relative">
                        <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                        <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                        <div className="w-2 h-0.5 bg-white rounded absolute bottom-0.5 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  Icon && <Icon className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
