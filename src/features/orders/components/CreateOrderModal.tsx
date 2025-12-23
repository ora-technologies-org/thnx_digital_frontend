// src/features/orders/components/CreateOrderModal.tsx - ENHANCED ⚡
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Gift,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Modal } from "../../../shared/components/ui/Modal";

import { Button } from "../../../shared/components/ui/Button";
import { useGiftCards } from "../../giftCards/hooks/useGiftCards";
import type { CreateOrderData } from "../types/order.types";
import { motion } from "framer-motion";
import { AxiosError } from "axios";

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  giftCardId: string;
  paymentMethod: "CASH" | "CARD" | "ONLINE";
  transactionId: string;
}

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrderData) => Promise<CreateOrderResponse>;
  isLoading?: boolean;
}
interface Order {
  id: string;
  orderNumber: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
}

interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

interface ValidationErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  giftCardId?: string;
  transactionId?: string;
  general?: string;
}

interface ResponseModalData {
  isOpen: boolean;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

const PAYMENT_METHODS = [
  { id: "ESEWA", name: "eSewa", icon: "🏦" },
  { id: "KHALTI", name: "Khalti", icon: "💳" },
  { id: "IME_PAY", name: "IME Pay", icon: "📱" },
  { id: "CASH", name: "Cash", icon: "💵" },
  { id: "CARD", name: "Card", icon: "💳" },
];

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { data: giftCardsData } = useGiftCards();
  const giftCards =
    giftCardsData?.data.giftCards.filter((card) => card.isActive) || [];

  const [formData, setFormData] = useState<CreateOrderData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    giftCardId: "",
    paymentMethod: "CASH",
    transactionId: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Response modal state
  const [responseModal, setResponseModal] = useState<ResponseModalData>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Selected gift card details
  const selectedGiftCard = giftCards.find(
    (card) => card.id === formData.giftCardId,
  );

  // Open response modal
  const openResponseModal = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message: string,
  ) => {
    setResponseModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  // Close response modal
  const closeResponseModal = () => {
    setResponseModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleChange = (field: keyof CreateOrderData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate specific field on blur
    if (field === "customerName" && formData.customerName.trim()) {
      if (formData.customerName.trim().length < 2) {
        setErrors((prev) => ({
          ...prev,
          customerName: "Name must be at least 2 characters",
        }));
      }
    }

    if (field === "customerEmail" && formData.customerEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
        setErrors((prev) => ({
          ...prev,
          customerEmail: "Please enter a valid email",
        }));
      }
    }

    if (field === "customerPhone" && formData.customerPhone) {
      const phoneRegex = /^[+]?[0-9\s\-().]{10,15}$/;
      if (!phoneRegex.test(formData.customerPhone)) {
        setErrors((prev) => ({
          ...prev,
          customerPhone: "Please enter a valid phone number",
        }));
      }
    }

    if (field === "transactionId" && formData.transactionId) {
      if (formData.transactionId.length < 3) {
        setErrors((prev) => ({
          ...prev,
          transactionId: "Transaction ID is too short",
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = "Name must be at least 2 characters";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!/^[+]?[0-9\s\-().]{10,15}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = "Please enter a valid phone number";
    }

    if (!formData.giftCardId) {
      newErrors.giftCardId = "Please select a gift card";
    }

    if (!formData.transactionId.trim()) {
      newErrors.transactionId = "Transaction ID is required";
    } else if (formData.transactionId.length < 3) {
      newErrors.transactionId = "Transaction ID is too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const allFields: (keyof OrderFormData)[] = [
      "customerName",
      "customerEmail",
      "customerPhone",
      "giftCardId",
      "transactionId",
    ];

    allFields.forEach((field) =>
      setTouched((prev) => ({ ...prev, [field]: true })),
    );

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await onSubmit(formData);

      console.log("ORDER RESPONSE 👉", response);
      openResponseModal(
        "success",
        "Order Created Successfully!",
        response?.message,
      );

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        giftCardId: "",
        paymentMethod: "CASH",
        transactionId: "",
      });

      setErrors({});
      setTouched({});
    } catch (error: unknown) {
      // Type-safe error handling
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Error creating order:", axiosError);

      openResponseModal(
        "error",
        "Error Creating Order",
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to create order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        giftCardId: "",
        paymentMethod: "CASH",
        transactionId: "",
      });
      setErrors({});
      setTouched({});
      onClose();
    }
  };

  const handleModalClose = () => {
    if (responseModal.type === "success") {
      // Close both modals on success
      closeResponseModal();
      onClose();
    } else {
      closeResponseModal();
    }
  };

  return (
    <>
      {/* Create Order Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create New Order"
        size="lg"
        type="default"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Kritim Prasad Kafle"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleChange("customerName", e.target.value)
                    }
                    onBlur={() => handleBlur("customerName")}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.customerName && touched.customerName
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formData.customerName &&
                    !errors.customerName &&
                    touched.customerName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                </div>
                {errors.customerName && touched.customerName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="kritimprasadk@gmail.com"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      handleChange("customerEmail", e.target.value)
                    }
                    onBlur={() => handleBlur("customerEmail")}
                    disabled={isSubmitting}
                    className={`w-full px-12 py-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.customerEmail && touched.customerEmail
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                {errors.customerEmail && touched.customerEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+977 9876543210"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      handleChange("customerPhone", e.target.value)
                    }
                    onBlur={() => handleBlur("customerPhone")}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pl-12 ${
                      errors.customerPhone && touched.customerPhone
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
                {errors.customerPhone && touched.customerPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gift Card Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              Gift Card Selection
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Gift Card <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.giftCardId}
                onChange={(e) => handleChange("giftCardId", e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.giftCardId && touched.giftCardId
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">-- Select a Gift Card --</option>
                {giftCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title} - ₹{parseFloat(card.price).toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.giftCardId && touched.giftCardId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.giftCardId}
                </p>
              )}
            </div>

            {selectedGiftCard && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {selectedGiftCard.title}
                    </p>
                    {selectedGiftCard.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedGiftCard.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                      {selectedGiftCard.validityDays && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {selectedGiftCard.validityDays} days validity
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{parseFloat(selectedGiftCard.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">Gift Card Price</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Payment Details
            </h3>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => handleChange("paymentMethod", method.id)}
                    disabled={isSubmitting}
                    className={`p-4 border rounded-xl transition-all duration-200 flex flex-col items-center gap-2 ${
                      formData.paymentMethod === method.id
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Selected:{" "}
                <span className="font-semibold text-blue-600">
                  {
                    PAYMENT_METHODS.find((m) => m.id === formData.paymentMethod)
                      ?.name
                  }
                </span>
              </p>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="TXN123456789"
                  value={formData.transactionId}
                  onChange={(e) =>
                    handleChange("transactionId", e.target.value)
                  }
                  onBlur={() => handleBlur("transactionId")}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.transactionId && touched.transactionId
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formData.transactionId &&
                  !errors.transactionId &&
                  touched.transactionId && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
              </div>
              {errors.transactionId && touched.transactionId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.transactionId}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter the transaction ID from your payment gateway
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              size="lg"
            >
              {isSubmitting ? "Creating Order..." : "Create Order"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Response Modal */}
      <Modal
        isOpen={responseModal.isOpen}
        onClose={handleModalClose}
        title={responseModal.title}
        type={responseModal.type}
        showActions={true}
        onConfirm={handleModalClose}
        confirmText={responseModal.type === "success" ? "Done" : "Try Again"}
        size="sm"
      >
        <div className="text-center py-4">
          <p className="text-gray-700">{responseModal.message}</p>
        </div>
      </Modal>
    </>
  );
};
