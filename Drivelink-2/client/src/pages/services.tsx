import { useQuery } from "@tanstack/react-query";
import { Calendar, Wrench, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import IOSCard from "@/components/ui/ios-card";
import { formatCurrency, formatDate, getDaysUntil, getStatusColor } from "@/lib/utils";
import type { ServiceRecord } from "@shared/schema";

export default function Services() {
  const { data: serviceRecords = [] } = useQuery<ServiceRecord[]>({
    queryKey: ["/api/vehicles/1/service-records"],
  });

  const { data: nextService } = useQuery<ServiceRecord>({
    queryKey: ["/api/vehicles/1/next-service"],
  });

  const daysUntilNextService = nextService?.nextServiceDue
    ? getDaysUntil(nextService.nextServiceDue)
    : null;

  const handleBookService = () => {
    console.log("Book service clicked");
  };

  const handleViewServiceDetails = (serviceId: number) => {
    console.log("View service details:", serviceId);
  };

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-4 text-white">
        <h1 className="text-2xl font-bold">Services</h1>
      </div>

      <div className="px-4 py-6">
        {/* Next Service Due */}
        {nextService && (
          <IOSCard className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Next Service Due</h3>
              <Calendar className="text-blue-500 w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {daysUntilNextService !== null ? `${daysUntilNextService} days` : "Overdue"}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              {nextService.serviceType} - {nextService.provider}
            </p>
            <Button
              onClick={handleBookService}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600"
            >
              Book Now
            </Button>
          </IOSCard>
        )}

        {/* Service History */}
        <h3 className="font-semibold text-white mb-4">Service History</h3>
        
        <div className="space-y-3">
          {serviceRecords.map((service) => (
            <IOSCard key={service.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{service.serviceType}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(service.status)}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {service.provider} • {formatDate(service.serviceDate)}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(service.cost)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleViewServiceDetails(service.id)}
                  className="text-blue-500 text-sm p-2"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </IOSCard>
          ))}
        </div>
      </div>
    </div>
  );
}
