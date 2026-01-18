// src/services/VerifyService.ts
import axios, { AxiosError } from "axios";
import { getToken } from "@/shared/utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// ==================== TYPE DEFINITIONS ====================

/**
 * Purchase data structure returned from API
 */
export interface PurchaseData {
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

/**
 * API response wrapper interface
 */
interface ApiResponse<T> {
  data: {
    purchase: T;
  };
}

/**
 * Service response interface
 */
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ==================== API FUNCTIONS ====================

/**
 * Verify QR code and fetch purchase details
 * NO AUTH required - Public endpoint for merchants to scan
 * @param {string} qrCode - The QR code to verify
 * @returns {Promise<ServiceResponse<PurchaseData>>} Purchase data if valid
 */
export const verifyQRCode = async (
  qrCode: string,
): Promise<ServiceResponse<PurchaseData>> => {
  try {
    const response = await axios.get<ApiResponse<PurchaseData>>(
      `${API_URL}purchases/qr/${qrCode.trim()}`,
    );

    return {
      success: true,
      data: response.data.data.purchase,
    };
  } catch (error) {
    console.error("QR Verification Error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        message:
          axiosError.response?.status === 404
            ? "QR code not found"
            : "Invalid QR code or purchase not found",
      };
    }

    return {
      success: false,
      message: "Invalid QR code or purchase not found",
    };
  }
};

/**
 * Get purchase details by ID
 * AUTH required - Used for authenticated merchant access
 * @param {string} purchaseId - The purchase ID to fetch
 * @returns {Promise<ServiceResponse<PurchaseData>>} Purchase data if found
 */
export const getPurchaseById = async (
  purchaseId: string,
): Promise<ServiceResponse<PurchaseData>> => {
  try {
    const token = getToken();

    const response = await axios.get<ApiResponse<PurchaseData>>(
      `${API_URL}purchases/${purchaseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      success: true,
      data: response.data.data.purchase,
    };
  } catch (error) {
    console.error("Get Purchase Error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        message:
          axiosError.response?.status === 404
            ? "Purchase not found"
            : "Failed to fetch purchase details",
      };
    }

    return {
      success: false,
      message: "Failed to fetch purchase details",
    };
  }
};

// ==================== DEFAULT EXPORT ====================

/**
 * Export all functions as a single object for backward compatibility
 */
const VerifyService = {
  verifyQRCode,
  getPurchaseById,
};

export default VerifyService;
