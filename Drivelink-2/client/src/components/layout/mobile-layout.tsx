import { ReactNode } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import BottomTabs from "./bottom-tabs";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();
  const isFelix = location === "/felix";

  return (
    <div className="max-w-sm mx-auto gradient-bg min-h-screen relative overflow-hidden">
      {/* Status Bar */}
      <div className="px-4 pt-2 pb-1 text-white">
        <div className="flex justify-between items-center text-sm font-medium">
          <span>9:41</span>
          <div className="flex items-center space-x-1 text-xs">
            <span>•••</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("", isFelix ? "" : "pb-20")}>
        {children}
      </div>

      {/* Bottom Navigation - Hidden on Felix page */}
      {!isFelix && <BottomTabs />}
    </div>
  );
}
