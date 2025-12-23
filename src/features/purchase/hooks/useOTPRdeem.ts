// src/hooks/useOTPRedeem.ts - Custom Hook for OTP-based Redemption Flow
import { useState, useCallback } from "react";
import OTPService from "../services/otpService";
import VerifyService from "../services/VerifyService";
import { purchaseService } from "../services/purchaseService";
import type { RedeemData } from "../types/purchase.types";

interface Redemption {
  id: string;
  itemName: string;
  date: string;
  amount: string;
  status: "success" | "failed";
}
interface PurchaseData {
  balance: number;
  recentRedemptions: Redemption[];
}
interface UseOTPRedeemReturn {
  // OTP States
  isRequestingOTP: boolean;
  isVerifyingOTP: boolean;
  isRedeeming: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  redeemSuccess: boolean;
  otpError: string;
  redeemError: string;

  // Methods
  requestOTP: (purchaseId: string) => Promise<void>;
  verifyOTP: (otp: string, purchaseId: string) => Promise<boolean>;
  redeemGiftCard: (
    qrCode: string,
    amount: string,
    locationName: string,
    locationAddress: string,
    notes: string,
  ) => Promise<{ success: boolean; message?: string }>;
  resetOTPFlow: () => void;

  // Refresh purchase data
  refreshPurchaseData: (qrCode: string) => Promise<PurchaseData | null>;
}

export const useOTPRedeem = (): UseOTPRedeemReturn => {
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Flow states
  const [otpSent, setOtpSent] = useState(false); // OTP has been sent to user
  const [otpVerified, setOtpVerified] = useState(false); // OTP successfully verified
  const [redeemSuccess, setRedeemSuccess] = useState(false); // Redemption completed

  // Error states
  const [otpError, setOtpError] = useState(""); // OTP request/verify errors
  const [redeemError, setRedeemError] = useState(""); // Redemption errors

  // ==================== OTP REQUEST ====================
  /**
   * Request OTP to be sent to customer
   * @param purchaseId - The purchase ID to request OTP for
   */
  const requestOTP = useCallback(async (purchaseId: string) => {
    setIsRequestingOTP(true);
    setOtpError("");

    try {
      const result = await OTPService.requestOTP(purchaseId);

      if (result.success) {
        setOtpSent(true);
      } else {
        setOtpError(result.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Request OTP error:", error);
      setOtpError("Network error. Please try again.");
    } finally {
      setIsRequestingOTP(false);
    }
  }, []);

  // ==================== OTP VERIFICATION ====================
  /**
   * Verify the OTP entered by user
   * @param otp - 6-digit OTP code
   * @param purchaseId - The purchase ID to verify OTP against
   * @returns boolean - True if OTP is valid, false otherwise
   */
  const verifyOTP = useCallback(
    async (otp: string, purchaseId: string): Promise<boolean> => {
      setIsVerifyingOTP(true);
      setOtpError("");

      try {
        const result = await OTPService.verifyOTP(otp, purchaseId);

        if (result.success) {
          setOtpVerified(true);
          return true;
        } else {
          setOtpError(result.message || "Invalid OTP");
          return false;
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        setOtpError("Network error. Please try again.");
        return false;
      } finally {
        setIsVerifyingOTP(false);
      }
    },
    [],
  );

  // ==================== REDEMPTION ====================
  /**
   * Complete redemption using the redeemGiftCard endpoint
   */
  const redeemGiftCard = useCallback(
    async (
      qrCode: string,
      amount: string,
      locationName: string,
      locationAddress: string,
      notes: string,
    ): Promise<{ success: boolean; message?: string }> => {
      setIsRedeeming(true);
      setRedeemError("");

      try {
        const payload: RedeemData = {
          qrCode,
          amount: parseFloat(amount),
          locationName,
          locationAddress,
          notes,
        };

        const result = await purchaseService.redeemGiftCard(payload);

        if (result.success) {
          setRedeemSuccess(true);
          return { success: true, message: result.message };
        } else {
          const errorMsg = result.message || "Redemption failed";
          setRedeemError(errorMsg);
          return { success: false, message: errorMsg };
        }
      } catch (error: unknown) {
        console.error("Redemption error:", error);

        let errorMessage = "Network error. Please try again.";

        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as {
            response?: { data?: { message?: string } };
          };
          errorMessage = apiError.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setRedeemError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setIsRedeeming(false);
      }
    },
    [],
  );

  // ==================== REFRESH PURCHASE DATA ====================
  /**
   * Refresh purchase data after redemption
   * Used to update balance and redemption history
   * @param qrCode - QR code to fetch fresh purchase data
   * @returns Updated purchase data or null on error
   */
  const refreshPurchaseData = useCallback(
    async (qrCode: string): Promise<unknown> => {
      try {
        const result = await VerifyService.verifyQRCode(qrCode);
        return result.data;
      } catch (error) {
        console.error("Refresh error:", error);
        return null;
      }
    },
    [],
  );

  // ==================== RESET FLOW ====================
  /**
   * Reset all OTP flow states
   * Called when closing modal or starting new redemption
   */
  const resetOTPFlow = useCallback(() => {
    setOtpSent(false);
    setOtpVerified(false);
    setRedeemSuccess(false);
    setOtpError("");
    setRedeemError("");
  }, []);

  // ==================== RETURN ====================
  return {
    // States
    isRequestingOTP,
    isVerifyingOTP,
    isRedeeming,
    otpSent,
    otpVerified,
    redeemSuccess,
    otpError,
    redeemError,

    // Methods
    requestOTP,
    verifyOTP,
    redeemGiftCard,
    resetOTPFlow,
    refreshPurchaseData,
  };
};
