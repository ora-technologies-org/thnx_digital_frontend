import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  CreditCard,
  MapPin,
  DollarSign,
  Mail,
  Phone,
  Package,
  X,
  CheckCircle,
} from "lucide-react";
import { RedemptionHistory } from "@/features/Redemption/Services/redemptionService";
import { getOrderStatusColor } from "@/shared/utils/helpers";

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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    return `Rs. ${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusIcon = () => {
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Redemption Details
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {redemption.purchasedGiftCard.qrCode
                        .split("-")
                        .slice(-2)
                        .join("-")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
                {/* Status Section */}
                <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                      <div className="text-sm text-gray-600">
                        Gift Card Status
                      </div>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${getOrderStatusColor(redemption.purchasedGiftCard.status)}`}
                      >
                        {redemption.purchasedGiftCard.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Redemption Date</div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">
                      {new Date(redemption.redeemedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </div>
                </div>

                {/* Redemption Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Redemption Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Amount Redeemed
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(redemption.amount)}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Balance After
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(redemption.balanceAfter)}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                      <div className="text-sm text-gray-600 mb-1">
                        Balance Change
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(redemption.balanceBefore)} →{" "}
                        {formatCurrency(redemption.balanceAfter)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redeemed By */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Redeemed By
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        Staff Name
                      </div>
                      <div className="font-semibold text-gray-900">
                        {redemption.redeemedBy.name}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Mail className="w-4 h-4" />
                        Staff Email
                      </div>
                      <div className="font-semibold text-gray-900">
                        {redemption.redeemedBy.email}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        Redemption Time
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatDate(redemption.redeemedAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                {redemption.locationName && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      Location Details
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Location Name
                      </div>
                      <div className="font-semibold text-gray-900 mb-3">
                        {redemption.locationName}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Address</div>
                      <div className="text-gray-700">
                        {redemption.locationAddress}
                      </div>
                    </div>
                  </div>
                )}

                {/* Gift Card Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    Gift Card Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Gift Card Title
                      </div>
                      <div className="font-semibold text-gray-900">
                        {redemption.purchasedGiftCard.giftCard.title}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">QR Code</div>
                      <div className="font-mono text-sm text-gray-900 break-all">
                        {redemption.purchasedGiftCard.qrCode}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Original Amount
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          redemption.purchasedGiftCard.purchaseAmount,
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Current Balance
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(
                          redemption.purchasedGiftCard.currentBalance,
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        Customer Name
                      </div>
                      <div className="font-semibold text-gray-900">
                        {redemption.purchasedGiftCard.customerName}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </div>
                      <div className="font-semibold text-gray-900">
                        {redemption.purchasedGiftCard.customerPhone}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </div>
                      <div className="font-semibold text-gray-900">
                        {redemption.purchasedGiftCard.customerEmail}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                      <div className="text-sm text-gray-600 mb-1">
                        Payment Method
                      </div>
                      <div className="font-semibold text-gray-900">
                        {redemption.purchasedGiftCard.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {redemption.notes && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-700 mb-2 font-semibold">
                      Notes
                    </div>
                    <div className="text-gray-700">{redemption.notes}</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
