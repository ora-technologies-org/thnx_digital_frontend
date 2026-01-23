import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  CreditCard,
  Calendar,
  DollarSign,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  FileText,
} from "lucide-react";
import { Order } from "../types/order.types";
import { getOrderStatusColor } from "@/shared/utils/helpers";

// ============================================================================
// Type Definitions
// ============================================================================

/** Props interface for the OrderDetailModal component */
interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// Component: OrderDetailModal
// ============================================================================

/**
 * OrderDetailModal Component
 *
 * A comprehensive modal dialog that displays detailed information about an order.
 * Features:
 * - Clean, modern design with subtle animations
 * - Organized sections for different types of information
 * - Responsive layout that works on all screen sizes
 * - Visual status indicators with icons
 * - Proper formatting for dates and currency
 *
 * @param order - The order object containing all details
 * @param isOpen - Boolean controlling modal visibility
 * @param onClose - Function to close the modal
 */
export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  // Guard clause: return null if no order is provided
  if (!order) return null;

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Returns the appropriate icon for a given order status
   * @param status - The order status string
   * @returns React element with status icon
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "USED":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "EXPIRED":
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  /**
   * Returns Tailwind CSS classes for payment status badge styling
   * @param status - The payment status string
   * @returns String of Tailwind CSS classes
   */
  // const getPaymentStatusColor = (status: string) => {
  //   switch (status) {
  //     case "COMPLETED":
  //       return "bg-green-50 text-green-700 border border-green-200";
  //     case "PENDING":
  //       return "bg-amber-50 text-amber-700 border border-amber-200";
  //     case "FAILED":
  //       return "bg-rose-50 text-rose-700 border border-rose-200";
  //     default:
  //       return "bg-gray-50 text-gray-700 border border-gray-200";
  //   }
  // };

  /**
   * Formats currency values with INR symbol and proper formatting
   * @param value - The amount to format (string or number)
   * @returns Formatted currency string
   */
  const formatCurrency = (value: number | string | undefined) => {
    const num = parseFloat(value as string) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  /**
   * Formats date strings into a readable format with time
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with subtle blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Modal Card with spring animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-100"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Order Icon */}
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-white" />
                    </div>

                    {/* Order Title and ID */}
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Order Details
                      </h2>
                      <p className="text-gray-300 text-sm font-medium mt-1">
                        ID: {order.orderId || order.id}
                        {order.orderNumber && ` • ${order.orderNumber}`}
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Area with scrolling */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {/* Order Status Card */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="text-xs text-gray-600 font-medium mb-1">
                          Order Status
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    Customer Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Name Field */}
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        Full Name
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName ||
                          order.customer?.name ||
                          "Not provided"}
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        Phone Number
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerPhone ||
                          order.customer?.phone ||
                          "Not provided"}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        Email Address
                      </div>
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {order.customerEmail ||
                          order.customer?.email ||
                          "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    Financial Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Purchase Amount */}
                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-600 mb-2">
                        Purchase Amount
                      </div>
                      <div className="text-xl font-semibold text-gray-900">
                        {formatCurrency(order.purchaseAmount || order.amount)}
                      </div>
                    </div>

                    {/* Current Balance */}
                    <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                      <div className="text-xs text-green-600 mb-2">
                        Current Balance
                      </div>
                      <div className="text-xl font-semibold text-green-700">
                        {formatCurrency(order.currentBalance || order.amount)}
                      </div>
                    </div>

                    {/* Bonus Amount (conditional) */}
                    {order.bonusAmount &&
                      parseFloat(order.bonusAmount as string) > 0 && (
                        <div className="p-4 bg-white rounded-lg border border-amber-200 shadow-sm">
                          <div className="text-xs text-amber-600 mb-2">
                            Bonus Amount
                          </div>
                          <div className="text-xl font-semibold text-amber-700">
                            {formatCurrency(order.bonusAmount)}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Payment and Timeline Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Payment Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      Payment Information
                    </h3>

                    <div className="space-y-3">
                      {/* Payment Method */}
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1">
                          Payment Method
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.paymentMethod || "Not specified"}
                        </div>
                      </div>

                      {/* Transaction ID (conditional) */}
                      {order.transactionId && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xs text-blue-600 mb-1">
                            Transaction ID
                          </div>
                          <div className="font-mono text-xs text-gray-800 break-all">
                            {order.transactionId}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      Order Timeline
                    </h3>

                    <div className="space-y-3">
                      {/* Created Date */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <div className="text-xs text-gray-600">Created</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </div>

                      {/* Purchased Date (conditional) */}
                      {order.purchasedAt && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div>
                            <div className="text-xs text-blue-600">
                              Purchased
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(order.purchasedAt)}
                            </div>
                          </div>
                          <Receipt className="w-4 h-4 text-blue-400" />
                        </div>
                      )}

                      {/* Expiry Date (conditional) */}
                      {order.expiresAt && (
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <div className="text-xs text-amber-600">
                              Expires
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(order.expiresAt)}
                            </div>
                          </div>
                          <Clock className="w-4 h-4 text-amber-400" />
                        </div>
                      )}

                      {/* Used Date (conditional) */}
                      {order.usedAt && (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <div className="text-xs text-green-600">Used</div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(order.usedAt)}
                            </div>
                          </div>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Code Section (conditional) */}
                {order.qrCode && (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-600" />
                      QR Code
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-mono text-xs text-gray-700 break-all bg-white p-3 rounded border">
                        {order.qrCode}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes Section (conditional) */}
                {order.notes && (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      Additional Notes
                    </h3>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {order.notes}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Close Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
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
