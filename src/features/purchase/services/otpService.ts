// src/services/otpService.ts
import axios, { AxiosError } from "axios";
import { getToken } from "@/shared/utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// ==================== TYPE DEFINITIONS ====================

/**
 * OTP request payload structure
 */
export interface OTPRequestPayload {
  purchaseId: string;
}

/**
 * Redeem response data structure
 */
export interface RedeemResponseData {
  transactionId: string;
  redeemedAmount: number;
  remainingBalance: number;
  redeemedAt: string;
}

/**
 * OTP verify payload structure
 */
export interface OTPVerifyPayload {
  otp: string;
  purchaseId: string;
}

/**
 * OTP response structure
 */
export interface OTPResponse {
  success: boolean;
  message?: string;
  data?: {
    expiresAt?: string;
  };
}

/**
 * Redeem payload structure
 */
export interface RedeemPayload {
  qrCode: string;
  amount: number;
  locationName: string;
  locationAddress: string;
  notes: string;
}

/**
 * Redeem service response structure
 */
export interface RedeemServiceResponse {
  success: boolean;
  message: string;
  data?: RedeemResponseData;
}

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  message: string;
  data?: T;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Extract purchase ID from QR code
 * @param {string} qrCode - The QR code string
 * @returns {string} Extracted purchase ID
 */
const extractPurchaseIdFromQR = (qrCode: string): string => {
  console.log("🔍 [OTP Service] Extracting purchaseId from QR:", qrCode);
  const parts = qrCode.split("-");
  const purchaseId = parts[parts.length - 1] || qrCode;
  console.log("🔍 [OTP Service] Extracted purchaseId:", purchaseId);
  return purchaseId;
};

/**
 * Handle Axios errors and return formatted response
 * @param {unknown} error - The error object
 * @param {string} defaultMessage - Default error message
 * @returns {OTPResponse} Formatted error response
 */
const handleAxiosError = (
  error: unknown,
  defaultMessage: string,
): OTPResponse => {
  console.error("💥 [OTP Service] Error:", error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    return {
      success: false,
      message: axiosError.response?.data?.message || defaultMessage,
    };
  }

  return {
    success: false,
    message: "Network error. Please try again.",
  };
};

// ==================== API FUNCTIONS ====================

/**
 * Request OTP to be sent to customer
 * Sends OTP via email and SMS
 * @param {string} purchaseId - The purchase ID to request OTP for
 * @returns {Promise<OTPResponse>} Response indicating success or failure
 */
export const requestOTP = async (purchaseId: string): Promise<OTPResponse> => {
  console.log("📤 [OTP Service] Requesting OTP for purchase:", purchaseId);

  try {
    const token = getToken();
    console.log("🔑 [OTP Service] Token:", token ? "Present" : "Missing");

    const url = `${API_URL}purchases/otp/request-otp`;
    console.log("🌐 [OTP Service] URL:", url);
    console.log("📦 [OTP Service] Payload:", { purchaseId });

    const response = await axios.post<ApiResponse<{ expiresAt?: string }>>(
      url,
      { purchaseId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("📥 [OTP Service] Response status:", response.status);
    console.log("📥 [OTP Service] Response data:", response.data);
    console.log("✅ [OTP Service] OTP sent successfully");

    return {
      success: true,
      message: response.data.message || "OTP sent successfully",
      data: response.data.data,
    };
  } catch (error) {
    return handleAxiosError(error, "Failed to request OTP");
  }
};

/**
 * Verify OTP entered by user
 * Validates OTP against purchase ID
 * @param {string} otp - The OTP code to verify
 * @param {string} purchaseId - The purchase ID associated with the OTP
 * @returns {Promise<OTPResponse>} Response indicating verification success or failure
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

    const response = await axios.post<ApiResponse<unknown>>(
      url,
      { otp, purchaseId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("📥 [OTP Service] Response status:", response.status);
    console.log("📥 [OTP Service] Response data:", response.data);
    console.log("✅ [OTP Service] OTP verified successfully");

    return {
      success: true,
      message: response.data.message || "OTP verified successfully",
    };
  } catch (error) {
    return handleAxiosError(error, "OTP verification failed");
  }
};

/**
 * Complete redemption with OTP verification
 * Two-step process: Verify OTP, then redeem amount
 * @param {RedeemPayload} redeemPayload - The redemption details
 * @param {string} otp - The OTP code for verification
 * @returns {Promise<RedeemServiceResponse>} Response with redemption details
 */
export const redeemWithOTP = async (
  redeemPayload: RedeemPayload,
  otp: string,
): Promise<RedeemServiceResponse> => {
  console.log("📤 [OTP Service] Redeeming with OTP:", otp);
  console.log("📦 [OTP Service] Redeem payload:", redeemPayload);

  try {
    const token = getToken();

    // Step 1: Verify OTP
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

    // Step 2: Proceed with redemption
    const url = `${API_URL}purchases/redeem`;
    console.log("🌐 [OTP Service] Redeem URL:", url);

    const response = await axios.post<ApiResponse<RedeemResponseData>>(
      url,
      redeemPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("📥 [OTP Service] Redeem response status:", response.status);
    console.log("📥 [OTP Service] Redeem response data:", response.data);
    console.log("✅ [OTP Service] Redeemed successfully");

    return {
      success: true,
      message: "Amount redeemed successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("💥 [OTP Service] Redeem Error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to redeem",
      };
    }

    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

// ==================== DEFAULT EXPORT ====================

/**
 * Export all functions as a single object for backward compatibility
 */
const OTPService = {
  requestOTP,
  verifyOTP,
  redeemWithOTP,
};

export default OTPService;
