// src/features/purchases/components/PurchaseModal.tsx - FIXED TYPES! 📝
import React, { useState } from "react";
import { User, CreditCard, ShoppingBag, CheckCircle } from "lucide-react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { usePurchaseGiftCard } from "../hooks/usePurchaseGiftCard";
import { PurchaseSuccessModal } from "./PurchaseSuccessModal";
import type { GiftCard } from "../../giftCards/types/giftCard.types";
import type { PurchaseFormData, Purchase } from "../types/purchase.types";

interface PurchaseModalProps {
  giftCard: GiftCard;
  isOpen: boolean;
  onClose: () => void;
}

const PAYMENT_METHODS = [
  { id: "ESEWA", name: "eSewa", icon: "🟢" },
  { id: "KHALTI", name: "Khalti", icon: "🟣" },
  { id: "IME_PAY", name: "IME Pay", icon: "🔵" },
  { id: "CREDIT_CARD", name: "Credit/Debit Card", icon: "💳" },
];

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  giftCard,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<PurchaseFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    paymentMethod: "ESEWA",
    transactionId: "",
  });

  const [errors, setErrors] = useState<Partial<PurchaseFormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<Purchase | null>(null);

  const purchaseMutation = usePurchaseGiftCard();

  const handleChange = (field: keyof PurchaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PurchaseFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Invalid email address";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (
      !/^\+?[0-9]{10,15}$/.test(formData.customerPhone.replace(/\s/g, ""))
    ) {
      newErrors.customerPhone = "Invalid phone number";
    }

    if (!formData.transactionId.trim()) {
      newErrors.transactionId = "Transaction ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await purchaseMutation.mutateAsync({
        giftCardId: giftCard.id,
        ...formData,
      });

      // Transform the API response to match the Purchase type
      // Purchase type only has: id, transactionId, amount, status, code, qrCode, createdAt
      const purchase: Purchase = {
        id: result.id,
        transactionId: result.transactionId,
        amount: parseFloat(result.amount),
        status: result.isRedeemed ? "completed" : "pending",
        code: result.code,
        qrCode: result.code || result.qrCode,
        createdAt: result.createdAt,
      };

      setPurchaseResult(purchase);
      setShowSuccess(true);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      paymentMethod: "ESEWA",
      transactionId: "",
    });
    setPurchaseResult(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showSuccess}
        onClose={onClose}
        title=""
        size="lg"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Purchase Gift Card
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
              <span className="text-gray-700">{giftCard.title}</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{giftCard.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Your Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  error={errors.customerName}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    handleChange("customerEmail", e.target.value)
                  }
                  error={errors.customerEmail}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+977 9876543210"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    handleChange("customerPhone", e.target.value)
                  }
                  error={errors.customerPhone}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => handleChange("paymentMethod", method.id)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.paymentMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium text-gray-900">
                        {method.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Payment Confirmation
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong>
                  <br />
                  1. Complete payment using{" "}
                  {
                    PAYMENT_METHODS.find((m) => m.id === formData.paymentMethod)
                      ?.name
                  }
                  <br />
                  2. Copy the Transaction ID from your payment confirmation
                  <br />
                  3. Enter it below to complete your purchase
                </p>
              </div>
              <Input
                label="Transaction ID"
                placeholder="e.g., TXN123456789 or ESEWA-ABC123"
                value={formData.transactionId}
                onChange={(e) => handleChange("transactionId", e.target.value)}
                error={errors.transactionId}
                required
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Order Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gift Card</span>
                  <span className="font-medium text-gray-900">
                    {giftCard.title}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">
                    {
                      PAYMENT_METHODS.find(
                        (m) => m.id === formData.paymentMethod,
                      )?.name
                    }
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{giftCard.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={purchaseMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                isLoading={purchaseMutation.isPending}
                disabled={purchaseMutation.isPending}
              >
                {purchaseMutation.isPending
                  ? "Processing..."
                  : "Complete Purchase"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Success Modal */}
      {purchaseResult && (
        <PurchaseSuccessModal
          isOpen={showSuccess}
          onClose={handleSuccessClose}
          purchase={purchaseResult}
          giftCard={giftCard}
        />
      )}
    </>
  );
};
