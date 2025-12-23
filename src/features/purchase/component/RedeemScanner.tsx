// src/features/purchase/component/RedeemScanner.tsx
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, AlertCircle, Receipt, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";
import { Input } from "@/shared/components/ui/Input";
import { Badge } from "@/shared/components/ui/Badge";
import { Modal } from "@/shared/components/ui/Modal";
import { OTPModal } from "@/features/purchase/component/OtpModal";
import { useOTPRedeem } from "@/features/purchase/hooks/useOTPRdeem";
import VerifyService from "@/features/purchase/services/VerifyService";
import { formatCurrency, formatDateTime } from "@/shared/utils/helpers";

interface PurchaseData {
  id: string;
  qrCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purchaseAmount: string;
  currentBalance: string;
  totalRedeemed: string;
  status: string;
  purchasedAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  giftCard: {
    id: string;
    title: string;
    description: string;
  };
  merchant: {
    businessName: string;
    businessPhone: string;
    address: string;
    city: string;
  };
  recentRedemptions: Array<{
    id: string;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    locationName: string;
    locationAddress: string;
    notes: string;
    redeemedAt: string;
    redeemedBy: {
      name: string;
      email: string;
    };
  }>;
  redemptionCount: number;
}
interface Redemption {
  id: string;
  itemName: string;
  date: string;
  amount: string;
  status: "success" | "failed";
}
interface RedemptionResponse {
  success: boolean;
  message: string;
  data?: {
    transactionId?: string;
    amountRedeemed?: string;
    newBalance?: string;
    timestamp?: string;
  };
}

export const RedeemScanner: React.FC = () => {
  // ==================== STATE MANAGEMENT ====================
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [redemptionResponse, setRedemptionResponse] =
    useState<RedemptionResponse | null>(null);
  const [isProcessingRedemption, setIsProcessingRedemption] = useState(false);

  // ==================== OTP HOOK ====================
  const {
    isRequestingOTP,
    isVerifyingOTP,
    otpSent,
    otpVerified,
    otpError,
    requestOTP,
    verifyOTP,
    redeemGiftCard,
    resetOTPFlow,
    refreshPurchaseData,
  } = useOTPRedeem();

  // ==================== QR CODE VERIFICATION ====================
  const handleSearch = async () => {
    if (!qrCodeInput.trim()) {
      setError("Please enter QR code");
      return;
    }

    setIsLoading(true);
    setError("");
    setPurchaseData(null);

    try {
      const result = await VerifyService.verifyQRCode(qrCodeInput.trim());

      if (result.success) {
        setPurchaseData(result.data!);
        setError("");
      } else {
        setError(result.message || "Invalid QR code");
      }
    } catch (err) {
      console.error("QR code verification error:", err);
      setError("Failed to verify QR code");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== REDEEM FLOW ====================
  const handleRedeemClick = async () => {
    if (!purchaseData) return;

    console.log("🎯 Opening OTP Modal for purchase:", purchaseData.id);
    setShowOTPModal(true);
    await requestOTP(purchaseData.id);
  };

  // ==================== PROCESS REDEMPTION ====================
  const processRedemption = useCallback(
    async (
      amount: string,
      locationName: string,
      locationAddress: string,
      notes: string,
    ) => {
      if (!purchaseData) return;

      setIsProcessingRedemption(true);

      try {
        console.log("🎯 Starting redemption process...");

        // Call redemption API
        const result = await redeemGiftCard(
          purchaseData.qrCode,
          amount,
          locationName,
          locationAddress,
          notes,
        );

        console.log("🔍 Redemption API result:", result);

        // Prepare response data
        const responseData: RedemptionResponse = {
          success: result.success,
          message:
            result.message ||
            (result.success
              ? "Gift card redeemed successfully"
              : "Failed to redeem gift card"),
          data: {
            transactionId: result.data?.transactionId,
            amountRedeemed: amount,
            newBalance: result.data?.newBalance || purchaseData.currentBalance,
            timestamp: new Date().toISOString(),
          },
        };

        console.log("📦 Setting redemption response:", responseData);
        setRedemptionResponse(responseData);

        // Refresh purchase data on success
        if (result.success) {
          console.log("🔄 Refreshing purchase data...");
          const refreshedData = await refreshPurchaseData(purchaseData.qrCode);
          if (refreshedData) {
            console.log("✅ Purchase data refreshed");
            setPurchaseData(refreshedData);
          }
        }

        // Close OTP modal
        setShowOTPModal(false);

        // Wait a moment to ensure OTP modal is fully closed
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Show response modal
        console.log("🚀 Showing response modal");
        setShowResponseModal(true);
      } catch (error) {
        console.error("❌ Redemption process error:", error);
        setRedemptionResponse({
          success: false,
          message: "An unexpected error occurred. Please try again.",
        });
        setShowResponseModal(true);
      } finally {
        setIsProcessingRedemption(false);
        resetOTPFlow();
      }
    },
    [purchaseData, redeemGiftCard, refreshPurchaseData, resetOTPFlow],
  );

  // ==================== OTP VERIFIED HANDLER ====================
  const handleOTPVerified = (
    amount: string,
    locationName: string,
    locationAddress: string,
    notes: string,
  ) => {
    console.log("✅ OTP Verified, starting redemption...");
    processRedemption(amount, locationName, locationAddress, notes);
  };

  // ==================== RESET HANDLER ====================
  const handleReset = () => {
    setQrCodeInput("");
    setPurchaseData(null);
    setError("");
    setShowOTPModal(false);
    setShowResponseModal(false);
    setRedemptionResponse(null);
    resetOTPFlow();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ==================== QR CODE SEARCH ==================== */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-6 w-6 mr-2" />
            Scan or Enter QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter QR code (e.g., THNX-DIGITAL-...)"
              value={qrCodeInput}
              onChange={(e) => {
                setQrCodeInput(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSearch}
              disabled={!qrCodeInput.trim() || isLoading}
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Search Error */}
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================== GIFT CARD DETAILS ==================== */}
      <AnimatePresence>
        {purchaseData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Card Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{purchaseData.giftCard.title}</CardTitle>
                    <p className="text-gray-600 mt-1">
                      {purchaseData.merchant.businessName}
                    </p>
                  </div>
                  <Badge
                    variant={
                      purchaseData.status === "ACTIVE"
                        ? "success"
                        : purchaseData.status === "EXPIRED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {purchaseData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Balance Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(purchaseData.currentBalance)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Original Amount
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(purchaseData.purchaseAmount)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Customer</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {purchaseData.customerName}
                    </p>
                  </div>
                </div>

                {/* Customer & Purchase Details */}
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="break-all">
                      {purchaseData.customerEmail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{purchaseData.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchased:</span>
                    <span>{formatDateTime(purchaseData.purchasedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span>{formatDateTime(purchaseData.expiresAt)}</span>
                  </div>
                  {purchaseData.lastUsedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Used:</span>
                      <span>{formatDateTime(purchaseData.lastUsedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Search Another
                  </Button>
                  <Button
                    onClick={handleRedeemClick}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={
                      purchaseData.status !== "ACTIVE" ||
                      parseFloat(purchaseData.currentBalance) <= 0
                    }
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Redeem Amount
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Redemptions */}
            {purchaseData.recentRedemptions &&
              purchaseData.recentRedemptions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Redemptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {purchaseData.recentRedemptions.map(
                        (redemption: Redemption) => (
                          <div
                            key={redemption.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {formatCurrency(redemption.amount)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {redemption.locationName || "Store"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {formatDateTime(redemption.redeemedAt)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {redemption.redeemedBy.name}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== OTP MODAL ==================== */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          resetOTPFlow();
        }}
        purchaseId={purchaseData?.id || ""}
        qrCode={purchaseData?.qrCode || ""}
        customerEmail={purchaseData?.customerEmail}
        customerPhone={purchaseData?.customerPhone}
        currentBalance={purchaseData?.currentBalance || "0"}
        onOTPVerified={handleOTPVerified}
        onRequestOTP={requestOTP}
        onVerifyOTP={verifyOTP}
        isRequestingOTP={isRequestingOTP}
        isVerifyingOTP={isVerifyingOTP}
        otpSent={otpSent}
        otpVerified={otpVerified}
        otpError={otpError}
      />

      {/* ==================== REDEMPTION LOADING ==================== */}
      {isProcessingRedemption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className=" rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
              <span className="font-medium"></span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RESPONSE MODAL ==================== */}
      {showResponseModal && redemptionResponse && (
        <Modal
          isOpen={showResponseModal}
          onClose={() => {
            console.log("🔴 Closing response modal");
            setShowResponseModal(false);
            if (redemptionResponse.success) {
              handleReset();
            }
          }}
          title={
            redemptionResponse.success
              ? "Redemption Successful"
              : "Redemption Failed"
          }
          type={redemptionResponse.success ? "success" : "error"}
          size="md"
          showCloseButton={true}
        >
          <div className="text-center">
            {/* Main Message */}
            <div className="mb-6">
              <h3
                className={`text-lg font-semibold mb-4 ${redemptionResponse.success ? "text-green-700" : "text-red-700"}`}
              >
                {redemptionResponse.message}
              </h3>

              {/* Transaction Details */}
              {redemptionResponse.data && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <div className="space-y-3">
                    {redemptionResponse.data.transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Transaction ID:
                        </span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {redemptionResponse.data.transactionId}
                        </span>
                      </div>
                    )}

                    {redemptionResponse.data.amountRedeemed && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Amount Redeemed:
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(
                            redemptionResponse.data.amountRedeemed,
                          )}
                        </span>
                      </div>
                    )}

                    {purchaseData && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">
                            Customer:
                          </span>
                          <span className="font-medium">
                            {purchaseData.customerName}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">
                            New Balance:
                          </span>
                          <span className="font-semibold text-blue-600">
                            {formatCurrency(purchaseData.currentBalance)}
                          </span>
                        </div>
                      </>
                    )}

                    {redemptionResponse.data.timestamp && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Time:</span>
                        <span className="text-sm">
                          {formatDateTime(redemptionResponse.data.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => {
                setShowResponseModal(false);
                if (redemptionResponse.success) {
                  handleReset();
                }
              }}
              className={`w-full ${redemptionResponse.success ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {redemptionResponse.success ? "Scan Another Card" : "Try Again"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
