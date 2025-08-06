import { ReactNode } from "react";
import { X, CreditCard, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string | number;
  description: string;
  onPaymentMethod: (method: string) => void;
}

export default function PaymentModal({
  open,
  onOpenChange,
  amount,
  description,
  onPaymentMethod,
}: PaymentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto bottom-0 top-auto translate-y-0 rounded-t-xl border-0">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Payment Options
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="mb-6">
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(amount)}
            </p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          <div className="space-y-3">
            {/* Apple Pay */}
            <Button
              onClick={() => onPaymentMethod('apple-pay')}
              className="w-full bg-black text-white rounded-xl py-4 hover:bg-gray-800"
            >
              <Apple className="w-5 h-5 mr-3" />
              Pay with Apple Pay
            </Button>

            {/* Klarna */}
            <Button
              onClick={() => onPaymentMethod('klarna')}
              variant="outline"
              className="w-full bg-pink-50 border-pink-200 text-pink-800 rounded-xl py-4 hover:bg-pink-100"
            >
              <span className="font-bold mr-3">K</span>
              Pay later with Klarna
            </Button>

            {/* Card Payment */}
            <Button
              onClick={() => onPaymentMethod('card')}
              variant="outline"
              className="w-full bg-gray-50 text-gray-900 rounded-xl py-4 hover:bg-gray-100"
            >
              <CreditCard className="w-5 h-5 mr-3" />
              Pay with Card
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
