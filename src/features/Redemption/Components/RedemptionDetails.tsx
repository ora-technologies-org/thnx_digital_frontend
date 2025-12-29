import React from "react";

import {
  Calendar,
  User,
  CreditCard,
  MapPin,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Package,
} from "lucide-react";

import { format } from "date-fns";
import { Modal } from "@/shared/components/ui/Modal";
import { RedemptionHistory } from "../Services/redemptionService";

interface RedemptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  redemption: RedemptionHistory | null;
}

export const RedemptionDetailsModal: React.FC<RedemptionDetailsModalProps> = ({
  isOpen,
  onClose,
  redemption,
}) => {
  if (!redemption) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP p");
  };

  const formatCurrency = (amount: string) => {
    return `Rs. ${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Redemption Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Redemption Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Redemption Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Amount Redeemed</p>
              <p className="font-semibold text-lg">
                {formatCurrency(redemption.amount)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Balance Before/After</p>
              <p className="font-semibold text-lg">
                {formatCurrency(redemption.balanceBefore)} →{" "}
                {formatCurrency(redemption.balanceAfter)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Date & Time</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="font-medium">
                  {formatDate(redemption.redeemedAt)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Redeemed By</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium">{redemption.redeemedBy.name}</p>
                  <p className="text-sm text-gray-600">
                    {redemption.redeemedBy.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Info */}
        {redemption.locationName && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location Details
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{redemption.locationName}</p>
              <p className="text-gray-600">{redemption.locationAddress}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {redemption.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Notes
            </h3>
            <p className="text-gray-700">{redemption.notes}</p>
          </div>
        )}

        {/* Gift Card Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Gift Card Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Gift Card Title</span>
              <span className="font-medium">
                {redemption.purchasedGiftCard.giftCard.title}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">QR Code</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {redemption.purchasedGiftCard.qrCode}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Original Amount</span>
              <span className="font-medium">
                {formatCurrency(redemption.purchasedGiftCard.purchaseAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Balance</span>
              <span className="font-medium">
                {formatCurrency(redemption.purchasedGiftCard.currentBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  redemption.purchasedGiftCard.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : redemption.purchasedGiftCard.status === "FULLY_REDEEMED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {redemption.purchasedGiftCard.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Customer Name</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="font-medium">
                  {redemption.purchasedGiftCard.customerName}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="font-medium">
                  {redemption.purchasedGiftCard.customerEmail}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="font-medium">
                  {redemption.purchasedGiftCard.customerPhone}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium">
                {redemption.purchasedGiftCard.paymentMethod}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
