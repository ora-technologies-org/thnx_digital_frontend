// src/features/orders/components/CreateOrderModal.tsx
import React, { useState, useEffect } from "react";
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
import type {
  CreateOrderData,
  CreateOrderResponse,
} from "../types/order.types";
import { motion } from "framer-motion";
import { AxiosError } from "axios";

// Interface for order form data structure
interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  giftCardId: string;
  paymentMethod: "CASH" | "CARD" | "ONLINE" | "ESEWA" | "KHALTI" | "IME_PAY";
  transactionId: string;
}

// Interface for API error response structure
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Props interface for CreateOrderModal component
interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrderData) => Promise<CreateOrderResponse>;
  isLoading?: boolean;
}

// Interface for form validation errors
interface ValidationErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  giftCardId?: string;
  transactionId?: string;
  general?: string;
}

// Interface for response modal data
interface ResponseModalData {
  isOpen: boolean;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

// Array of available payment methods with icons
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
  // Fetch active gift cards using custom hook
  const { data: giftCardsData } = useGiftCards();
  const giftCards =
    giftCardsData?.data.giftCards.filter((card) => card.isActive) || [];

  // State for form data with initial values
  const [formData, setFormData] = useState<CreateOrderData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    giftCardId: "",
    paymentMethod: "CASH",
    transactionId: "",
  });

  // State for form validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});

  // State to track which fields have been touched (for validation timing)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // State to track form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for response modal (success/error messages)
  const [responseModal, setResponseModal] = useState<ResponseModalData>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Get details of the currently selected gift card
  const selectedGiftCard = giftCards.find(
    (card) => card.id === formData.giftCardId,
  );

  // Check if selected payment method is cash
  const isCashPayment = formData.paymentMethod === "CASH";

  // Effect to clear transaction ID when switching to cash payment
  useEffect(() => {
    if (isCashPayment && formData.transactionId) {
      setFormData((prev) => ({ ...prev, transactionId: "" }));

      // Clear any transaction ID errors
      if (errors.transactionId) {
        setErrors((prev) => ({ ...prev, transactionId: undefined }));
      }
    }
  }, [isCashPayment, formData.transactionId, errors.transactionId]);

  // Helper function to open response modal
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

  // Helper function to close response modal
  const closeResponseModal = () => {
    setResponseModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Handler for form field changes
  const handleChange = (field: keyof CreateOrderData, value: string) => {
    // Special handling for payment method changes
    if (field === "paymentMethod") {
      const newPaymentMethod = value as typeof formData.paymentMethod;

      setFormData((prev) => {
        const updatedData = { ...prev, [field]: newPaymentMethod };

        // Clear transaction ID when switching to cash
        if (newPaymentMethod === "CASH") {
          updatedData.transactionId = "";
        }

        return updatedData;
      });

      // Clear transaction ID error if switching to cash
      if (newPaymentMethod === "CASH" && errors.transactionId) {
        setErrors((prev) => ({ ...prev, transactionId: undefined }));
      }
    } else {
      // Prevent changes to transaction ID when cash payment is selected
      if (field === "transactionId" && isCashPayment) {
        return; // Transaction ID is disabled for cash payments
      }

      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Mark the field as touched for validation purposes
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handler for field blur events (triggers validation)
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Skip transaction ID validation for cash payments
    if (field === "transactionId" && isCashPayment) {
      return;
    }

    // Field-specific validation logic
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

    if (field === "transactionId" && formData.transactionId && !isCashPayment) {
      if (formData.transactionId.length < 3) {
        setErrors((prev) => ({
          ...prev,
          transactionId: "Transaction ID is too short",
        }));
      }
    }
  };

  // Comprehensive form validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate customer name
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = "Name must be at least 2 characters";
    }

    // Validate email
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address";
    }

    // Validate phone number
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!/^[+]?[0-9\s\-().]{10,15}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = "Please enter a valid phone number";
    }

    // Validate gift card selection
    if (!formData.giftCardId) {
      newErrors.giftCardId = "Please select a gift card";
    }

    // Validate transaction ID only for non-cash payments
    if (!isCashPayment) {
      if (!formData.transactionId.trim()) {
        newErrors.transactionId = "Transaction ID is required";
      } else if (formData.transactionId.length < 3) {
        newErrors.transactionId = "Transaction ID is too short";
      }
    }

    // Update errors state and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Mark all fields as touched to show all errors
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

    // Validate form before submission
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Call parent onSubmit function (API call)
      const response = await onSubmit(formData);

      console.log("ORDER RESPONSE 👉", response);

      // Show success modal
      openResponseModal(
        "success",
        "Order Created Successfully!",
        response?.message || "Your order has been created successfully!",
      );

      // Reset form state
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
      // Handle API errors
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Error creating order:", axiosError);

      // Show error modal with appropriate message
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

  // Handler for closing the create order modal
  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form state
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
      onClose(); // Call parent's onClose function
    }
  };

  // Handler for closing the response modal
  const handleModalClose = () => {
    if (responseModal.type === "success") {
      // Close both modals on success
      closeResponseModal();
      onClose();
    } else {
      closeResponseModal(); // Only close response modal for errors
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
          {/* Customer Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="space-y-4">
              {/* Customer Name Field */}
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
                  {/* Show checkmark when field is valid */}
                  {formData.customerName &&
                    !errors.customerName &&
                    touched.customerName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                </div>
                {/* Show validation error */}
                {errors.customerName && touched.customerName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Email Field */}
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
                    className={`w-full px-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.customerEmail && touched.customerEmail
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {/* Email icon */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                {/* Show validation error */}
                {errors.customerEmail && touched.customerEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerEmail}
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
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
                  {/* Phone icon */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
                {/* Show validation error */}
                {errors.customerPhone && touched.customerPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gift Card Selection Section */}
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
              {/* Show validation error */}
              {errors.giftCardId && touched.giftCardId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.giftCardId}
                </p>
              )}
            </div>

            {/* Display selected gift card details */}
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

          {/* Payment Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Payment Details
            </h3>

            {/* Payment Method Selection */}
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

            {/* Transaction ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID{" "}
                {!isCashPayment && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    isCashPayment
                      ? "Not required for cash payments"
                      : "TXN123456789"
                  }
                  value={formData.transactionId}
                  onChange={(e) =>
                    handleChange("transactionId", e.target.value)
                  }
                  onBlur={() => handleBlur("transactionId")}
                  disabled={isSubmitting || isCashPayment}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all ${
                    isCashPayment
                      ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                      : errors.transactionId && touched.transactionId
                        ? "border-red-500 ring-1 ring-red-500 focus:ring-2 focus:ring-blue-500"
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {/* Show checkmarks based on field state */}
                {formData.transactionId &&
                  !errors.transactionId &&
                  touched.transactionId &&
                  !isCashPayment && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                {isCashPayment && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
              {/* Show validation error for non-cash payments */}
              {errors.transactionId &&
                touched.transactionId &&
                !isCashPayment && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.transactionId}
                  </p>
                )}
              <p className="mt-1 text-sm text-gray-500">
                {isCashPayment
                  ? "Transaction ID is not required for cash payments"
                  : "Enter the transaction ID from your payment gateway"}
              </p>
            </div>
          </div>

          {/* Form Action Buttons */}
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

      {/* Response Modal (for success/error messages) */}
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
