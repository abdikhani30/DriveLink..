import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  Shield, 
  Info, 
  LogOut,
  ChevronRight,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import IOSCard from "@/components/ui/ios-card";
import type { User as UserType } from "@shared/schema";

export default function More() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  const menuItems = [
    {
      title: "Driver Management",
      icon: Users,
      color: "text-blue-500",
      action: () => console.log("Driver management"),
    },
    {
      title: "Payment Methods",
      icon: CreditCard,
      color: "text-blue-500",
      action: () => console.log("Payment methods"),
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "text-blue-500",
      action: () => console.log("Notifications"),
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      color: "text-blue-500",
      action: () => console.log("Help & support"),
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      color: "text-blue-500",
      action: () => console.log("Privacy & security"),
    },
    {
      title: "About DriveLink",
      icon: Info,
      color: "text-blue-500",
      action: () => console.log("About DriveLink"),
    },
  ];

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  const handleSignOut = () => {
    console.log("Sign out");
  };

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-4 text-white">
        <h1 className="text-2xl font-bold">More</h1>
      </div>

      <div className="px-4 py-6">
        {/* Profile Section */}
        <IOSCard className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user?.firstName?.charAt(0) || "J"}{user?.lastName?.charAt(0) || "D"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : "John Doe"}
              </h3>
              <p className="text-sm text-gray-600">
                {user?.email || "john.doe@email.com"}
              </p>
              <p className="text-sm text-gray-600">Member since 2023</p>
            </div>
          </div>
          <Button
            onClick={handleEditProfile}
            variant="outline"
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
          >
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </IOSCard>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant="ghost"
                onClick={item.action}
                className="w-full p-0 h-auto"
              >
                <IOSCard className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${item.color}`} />
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </div>
                    <ChevronRight className="text-gray-400 w-5 h-5" />
                  </div>
                </IOSCard>
              </Button>
            );
          })}
        </div>

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full bg-red-50 border-red-200 text-red-600 py-3 rounded-xl font-medium mt-8 hover:bg-red-100"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
