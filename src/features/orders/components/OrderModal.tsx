import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  DollarSign,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Order {
  orderId?: string;
  qrCode?: string;
  status?: string;
  paymentStatus?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  purchaseAmount?: string | number;
  amount?: string | number;
  currentBalance?: string | number;
  bonusAmount?: string | number;
  paymentMethod?: string;
  transactionId?: string;
  purchasedAt?: string;
  createdAt?: string;
  expiresAt?: string;
  usedAt?: string;
  notes?: string;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "USED":
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
      case "EXPIRED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "USED":
        return "bg-gray-100 text-gray-800";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Order Details
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {order.qrCode?.split("-").slice(-2).join("-") ||
                        order.orderId ||
                        "N/A"}
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
                    {getStatusIcon(order.status || "ACTIVE")}
                    <div>
                      <div className="text-sm text-gray-600">Order Status</div>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(order.status || "ACTIVE")}`}
                      >
                        {order.status || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Payment Status</div>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${getPaymentStatusColor(order.paymentStatus || "PENDING")}`}
                    >
                      {order.paymentStatus || "PENDING"}
                    </span>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        Full Name
                      </div>
                      <div className="font-semibold text-gray-900">
                        {order.customerName || order.customer?.name || "N/A"}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </div>
                      <div className="font-semibold text-gray-900">
                        {order.customerPhone || order.customer?.phone || "N/A"}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </div>
                      <div className="font-semibold text-gray-900">
                        {order.customerEmail || order.customer?.email || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Order Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Purchase Amount
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        Rs.{" "}
                        {parseFloat(
                          String(order.purchaseAmount || order.amount || 0),
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Current Balance
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        Rs.{" "}
                        {parseFloat(
                          String(order.currentBalance || order.amount || 0),
                        ).toLocaleString()}
                      </div>
                    </div>
                    {order.bonusAmount &&
                      parseFloat(String(order.bonusAmount)) > 0 && (
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                          <div className="text-sm text-orange-700 mb-1">
                            Bonus Amount
                          </div>
                          <div className="text-xl font-bold text-orange-600">
                            Rs.{" "}
                            {parseFloat(
                              String(order.bonusAmount),
                            ).toLocaleString()}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Payment Method
                      </div>
                      <div className="font-semibold text-gray-900">
                        {order.paymentMethod || "N/A"}
                      </div>
                    </div>
                    {order.transactionId && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">
                          Transaction ID
                        </div>
                        <div className="font-mono text-sm text-gray-900">
                          {order.transactionId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code & Dates */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">QR Code</div>
                      <div className="font-mono text-sm text-gray-900 break-all">
                        {order.qrCode || "N/A"}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">
                        Purchase Date
                      </div>
                      <div className="font-semibold text-gray-900">
                        {new Date(
                          order.purchasedAt || order.createdAt || "",
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {order.expiresAt && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">
                          Expiry Date
                        </div>
                        <div className="font-semibold text-gray-900">
                          {new Date(order.expiresAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    )}
                    {order.usedAt && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">
                          Used Date
                        </div>
                        <div className="font-semibold text-gray-900">
                          {new Date(order.usedAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-700 mb-2 font-semibold">
                      Notes
                    </div>
                    <div className="text-gray-700">{order.notes}</div>
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
