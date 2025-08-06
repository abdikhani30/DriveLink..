import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Eye, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import IOSCard from "@/components/ui/ios-card";
import PaymentModal from "@/components/ui/payment-modal";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Fine } from "@shared/schema";

export default function Fines() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fines = [] } = useQuery<Fine[]>({
    queryKey: ["/api/vehicles/1/fines"],
  });

  const { data: outstandingFines = [] } = useQuery<Fine[]>({
    queryKey: ["/api/vehicles/1/outstanding-fines"],
  });

  const payFineMutation = useMutation({
    mutationFn: async ({ fineId, paymentMethod }: { fineId: number; paymentMethod: string }) => {
      const response = await apiRequest("PATCH", `/api/fines/${fineId}/pay`, { paymentMethod });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles/1/fines"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles/1/outstanding-fines"] });
      toast({
        title: "Payment Successful",
        description: "Your fine has been paid successfully.",
      });
      setPaymentModalOpen(false);
      setSelectedFine(null);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive",
      });
    },
  });

  const appealFineMutation = useMutation({
    mutationFn: async ({ fineId, reason }: { fineId: number; reason: string }) => {
      const response = await apiRequest("PATCH", `/api/fines/${fineId}/appeal`, { reason });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles/1/fines"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles/1/outstanding-fines"] });
      toast({
        title: "Appeal Submitted",
        description: "Your appeal has been submitted for review.",
      });
    },
    onError: () => {
      toast({
        title: "Appeal Failed",
        description: "There was an error submitting your appeal.",
        variant: "destructive",
      });
    },
  });

  const totalOutstanding = outstandingFines.reduce(
    (sum, fine) => sum + parseFloat(fine.amount),
    0
  );

  const handlePayFine = (fine: Fine) => {
    setSelectedFine(fine);
    setPaymentModalOpen(true);
  };

  const handlePayAllFines = () => {
    if (outstandingFines.length > 0) {
      setSelectedFine({
        id: 0,
        amount: totalOutstanding.toString(),
        description: `${outstandingFines.length} outstanding fines`,
      } as Fine);
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentMethod = (method: string) => {
    if (selectedFine) {
      if (selectedFine.id === 0) {
        // Pay all fines
        toast({
          title: "Payment Processing",
          description: "Processing payment for all fines...",
        });
      } else {
        payFineMutation.mutate({ fineId: selectedFine.id, paymentMethod: method });
      }
    }
  };

  const handleAppealFine = (fine: Fine) => {
    appealFineMutation.mutate({ fineId: fine.id, reason: "Disputing the violation" });
  };

  const handleViewEvidence = (fine: Fine) => {
    console.log("View evidence for fine:", fine.id);
  };

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-4 text-white">
        <h1 className="text-2xl font-bold">Fines & Violations</h1>
      </div>

      <div className="px-4 py-6">
        {/* Outstanding Fines Summary */}
        {outstandingFines.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-red-500 w-6 h-6" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">
                  {outstandingFines.length} Outstanding Fines
                </h3>
                <p className="text-sm text-red-700">
                  Total amount: {formatCurrency(totalOutstanding)}
                </p>
              </div>
              <Button
                onClick={handlePayAllFines}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600"
              >
                Pay All
              </Button>
            </div>
          </div>
        )}

        {/* Individual Fines */}
        <div className="space-y-4">
          {fines.map((fine) => (
            <IOSCard key={fine.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{fine.fineType}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(fine.status)}`}>
                      {fine.status === "pending" && new Date(fine.dueDate) < new Date() ? "Overdue" : 
                       fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {fine.location} • {formatDate(fine.issueDate)}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{fine.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-bold ${fine.status === "paid" ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(fine.amount)}
                    </span>
                    <span className={`text-xs ${fine.status === "paid" ? "text-green-600" : "text-red-600"}`}>
                      {fine.status === "paid" ? `Paid: ${formatDate(fine.paymentDate!)}` : `Due: ${formatDate(fine.dueDate)}`}
                    </span>
                  </div>
                </div>
              </div>
              
              {fine.status === "paid" ? (
                <Button
                  variant="outline"
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium"
                  onClick={() => console.log("View receipt")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handlePayFine(fine)}
                    className="flex-1 bg-blue-500 text-white py-2 px-2 rounded-xl text-sm font-medium hover:bg-blue-600 flex items-center justify-center min-w-0"
                  >
                    <CreditCard className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Pay Fine</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleViewEvidence(fine)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-2 rounded-xl text-sm font-medium flex items-center justify-center min-w-0"
                  >
                    <Eye className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Evidence</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAppealFine(fine)}
                    disabled={appealFineMutation.isPending}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-2 rounded-xl text-sm font-medium flex items-center justify-center min-w-0"
                  >
                    <span className="truncate">Appeal</span>
                  </Button>
                </div>
              )}
            </IOSCard>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        amount={selectedFine?.amount || "0"}
        description={selectedFine?.id === 0 ? 
          `${outstandingFines.length} outstanding fines` : 
          `${selectedFine?.fineType} - ${selectedFine?.location}` || ""
        }
        onPaymentMethod={handlePaymentMethod}
      />
    </div>
  );
}
