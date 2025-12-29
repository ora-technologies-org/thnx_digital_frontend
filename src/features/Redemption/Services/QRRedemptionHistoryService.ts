// src/features/purchase/services/QRRedemptionHistoryService.ts
import api from "@/shared/utils/api";

export interface RedemptionHistoryItem {
  id: string;
  purchaseId?: string;
  qrCode?: string;
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  locationName?: string;
  locationAddress?: string;
  notes?: string;
  redeemedAt: string;
  redeemedBy?: {
    id: string;
    name: string;
    email: string;
  };
  status?: "completed" | "failed" | "pending";
  transactionId?: string;
  paymentMethod?: string;
}

export interface RedemptionHistoryResponse {
  success: boolean;
  message: string;
  data: RedemptionHistoryItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RedemptionHistoryParams {
  qrCode?: string;
  purchaseId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// Send data in request body using POST method
export const fetchRedemptionHistory = async (
  params: RedemptionHistoryParams,
): Promise<RedemptionHistoryResponse> => {
  try {
    const response = await api({
      method: "POST",
      url: "/purchases/redemptions/history",
      data: {
        qrCode: params.qrCode,
        purchaseId: params.purchaseId,
        page: params.page || 1,
        limit: params.limit || 10,
        startDate: params.startDate,
        endDate: params.endDate,
        status: params.status,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    console.error("Error fetching redemption history:", error);
    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch redemption history",
      data: [],
    };
  }
};

export const fetchRedemptionHistoryByQRCode = async (
  qrCode: string,
  page: number = 1,
  limit: number = 10,
): Promise<RedemptionHistoryResponse> => {
  return fetchRedemptionHistory({
    qrCode,
    page,
    limit,
  });
};

export const fetchRecentRedemptionsByQRCode = async (
  qrCode: string,
  limit: number = 5,
): Promise<RedemptionHistoryResponse> => {
  return fetchRedemptionHistory({
    qrCode,
    page: 1,
    limit,
  });
};

export const fetchRedemptionHistoryByPurchaseId = async (
  purchaseId: string,
  page: number = 1,
  limit: number = 10,
): Promise<RedemptionHistoryResponse> => {
  return fetchRedemptionHistory({
    purchaseId,
    page,
    limit,
  });
};

// Export all functions
export default {
  fetchRedemptionHistory,
  fetchRedemptionHistoryByQRCode,
  fetchRecentRedemptionsByQRCode,
  fetchRedemptionHistoryByPurchaseId,
};
