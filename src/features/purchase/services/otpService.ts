// src/services/otpService.ts
import { getToken } from "@/shared/utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// ==================== TYPE DEFINITIONS ====================
export interface OTPRequestPayload {
  purchaseId: string;
}
export interface RedeemResponseData {
  transactionId: string;
  redeemedAmount: number;
  remainingBalance: number;
  redeemedAt: string;
}
export interface OTPVerifyPayload {
  otp: string;
  purchaseId: string;
}

export interface OTPResponse {
  success: boolean;
  message?: string;
  data?: {
    expiresAt?: string;
  };
}

export interface RedeemPayload {
  qrCode: string;
  amount: number;
  locationName: string;
  locationAddress: string;
  notes: string;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Extract purchase ID from QR code
 */
const extractPurchaseIdFromQR = (qrCode: string): string => {
  console.log("🔍 [OTP Service] Extracting purchaseId from QR:", qrCode);
  const parts = qrCode.split("-");
  const purchaseId = parts[parts.length - 1] || qrCode;
  console.log("🔍 [OTP Service] Extracted purchaseId:", purchaseId);
  return purchaseId;
};

// ==================== API FUNCTIONS ====================

/**
 * Request OTP to be sent to customer
 * Sends OTP via email and SMS
 */
export const requestOTP = async (purchaseId: string): Promise<OTPResponse> => {
  console.log("📤 [OTP Service] Requesting OTP for purchase:", purchaseId);

  try {
    const token = getToken();
    console.log("🔑 [OTP Service] Token:", token ? "Present" : "Missing");

    const url = `${API_URL}purchases/otp/request-otp`;
    console.log("🌐 [OTP Service] URL:", url);
    console.log("📦 [OTP Service] Payload:", { purchaseId });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ purchaseId }),
    });

    console.log("📥 [OTP Service] Response status:", response.status);

    const data = await response.json();
    console.log("📥 [OTP Service] Response data:", data);

    if (!response.ok) {
      console.error("❌ [OTP Service] Request failed:", data.message);
      return {
        success: false,
        message: data.message || "Failed to request OTP",
      };
    }

    console.log("✅ [OTP Service] OTP sent successfully");
    return {
      success: true,
      message: data.message || "OTP sent successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("💥 [OTP Service] Request Error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

/**
 * Verify OTP entered by user
 * Validates OTP against purchase ID
 */
export const verifyOTP = async (
  otp: string,
  purchaseId: string,
): Promise<OTPResponse> => {
  console.log(
    "📤 [OTP Service] Verifying OTP:",
    otp,
    "for purchase:",
    purchaseId,
  );

  try {
    const token = getToken();
    const url = `${API_URL}purchases/otp/verify-otp`;

    console.log("🌐 [OTP Service] URL:", url);
    console.log("📦 [OTP Service] Payload:", { otp, purchaseId });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otp, purchaseId }),
    });

    console.log("📥 [OTP Service] Response status:", response.status);

    const data = await response.json();
    console.log("📥 [OTP Service] Response data:", data);

    if (!response.ok) {
      console.error("❌ [OTP Service] Verification failed:", data.message);
      return {
        success: false,
        message: data.message || "OTP verification failed",
      };
    }

    console.log("✅ [OTP Service] OTP verified successfully");
    return {
      success: true,
      message: data.message || "OTP verified successfully",
    };
  } catch (error) {
    console.error("💥 [OTP Service] Verification Error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

/**
 * Complete redemption with OTP verification
 * Two-step process: Verify OTP, then redeem amount
 */
export const redeemWithOTP = async (
  redeemPayload: RedeemPayload,
  otp: string,
): Promise<{
  success: boolean;
  message: string;
  data?: RedeemResponseData;
}> => {
  console.log("📤 [OTP Service] Redeeming with OTP:", otp);
  console.log("📦 [OTP Service] Redeem payload:", redeemPayload);

  try {
    const token = getToken();

    //  Verify OTP
    const purchaseId = extractPurchaseIdFromQR(redeemPayload.qrCode);
    console.log("🔍 [OTP Service] Extracted purchaseId:", purchaseId);

    const otpResponse = await verifyOTP(otp, purchaseId);

    if (!otpResponse.success) {
      console.error("❌ [OTP Service] OTP verification failed during redeem");
      return {
        success: false,
        message: otpResponse.message || "OTP verification failed",
      };
    }

    //  Proceed with redemption
    const url = `${API_URL}purchases/redeem`;
    console.log("🌐 [OTP Service] Redeem URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(redeemPayload),
    });

    console.log("📥 [OTP Service] Redeem response status:", response.status);

    const data = await response.json();
    console.log("📥 [OTP Service] Redeem response data:", data);

    if (!response.ok) {
      console.error("❌ [OTP Service] Redemption failed:", data.message);
      return {
        success: false,
        message: data.message || "Failed to redeem",
      };
    }

    console.log("✅ [OTP Service] Redeemed successfully");
    return {
      success: true,
      message: "Amount redeemed successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("💥 [OTP Service] Redeem Error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

// ==================== DEFAULT EXPORT ====================
// Export all functions as a single object for backward compatibility
const OTPService = {
  requestOTP,
  verifyOTP,
  redeemWithOTP,
};

export default OTPService;
