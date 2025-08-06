import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IOSCardProps {
  children: ReactNode;
  className?: string;
}

export default function IOSCard({ children, className }: IOSCardProps) {
  return (
    <div className={cn("ios-card p-4 ios-shadow", className)}>
      {children}
    </div>
  );
}
