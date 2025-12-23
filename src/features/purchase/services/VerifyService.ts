// src/services/VerifyService.ts
import { getToken } from "@/shared/utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "/api";

// ==================== TYPE DEFINITIONS ====================
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

// ==================== API FUNCTIONS ====================

/**
 * Verify QR code and fetch purchase details
 * NO AUTH required - Public endpoint for merchants to scan
 */
export const verifyQRCode = async (
  qrCode: string,
): Promise<{
  success: boolean;
  data?: PurchaseData;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}purchases/qr/${qrCode.trim()}`);

    if (!response.ok) {
      throw new Error("QR code not found");
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data.purchase,
    };
  } catch (error) {
    console.error("QR Verification Error:", error);
    return {
      success: false,
      message: "Invalid QR code or purchase not found",
    };
  }
};

/**
 * Get purchase details by ID
 * AUTH required - Used for authenticated merchant access
 */
export const getPurchaseById = async (
  purchaseId: string,
): Promise<{
  success: boolean;
  data?: PurchaseData;
  message?: string;
}> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}purchases/${purchaseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Purchase not found");
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data.purchase,
    };
  } catch (error) {
    console.error("Get Purchase Error:", error);
    return {
      success: false,
      message: "Failed to fetch purchase details",
    };
  }
};

// ==================== DEFAULT EXPORT ====================
// Export all functions as a single object for backward compatibility
const VerifyService = {
  verifyQRCode,
  getPurchaseById,
};

export default VerifyService;
