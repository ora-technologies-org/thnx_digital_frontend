// src/features/purchase/services/QRRedemptionHistoryService.ts
import api from "@/shared/utils/api";
import {
  RedemptionHistoryParams,
  RedemptionHistoryResponse,
} from "../types/redeem.types";

// Fetch redemption history with flexible filtering options
export const fetchRedemptionHistory = async (
  params: RedemptionHistoryParams,
): Promise<RedemptionHistoryResponse> => {
  try {
    // Build URL path based on what parameters are provided
    let endpoint = "/purchases/redemptions/history";

    // If qrCode is provided, add it to the path
    if (params.qrCode) {
      endpoint = `/purchases/qr/${params.qrCode}`;
    }
    // If purchaseId is provided (and no qrCode), add it to the path
    else if (params.purchaseId) {
      endpoint = `/purchases/redemptions/history/purchase/${params.purchaseId}`;
    }

    // Remaining parameters go as query params (pagination, filters, etc.)
    const queryParams = Object.fromEntries(
      Object.entries({
        page: params.page || 1,
        limit: params.limit || 10,
        startDate: params.startDate,
        endDate: params.endDate,
        status: params.status,
      }).filter(([, value]) => value !== undefined && value !== null),
    );

    console.log("Endpoint:", endpoint);
    console.log("Query params being sent:", queryParams);

    const response = await api.get(endpoint, {
      params: queryParams,
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

// Fetch paginated redemption history for a specific QR code
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

// Fetch recent redemptions for a QR code (useful for dashboards)
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

// Fetch redemption history for a specific purchase ID
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

export default {
  fetchRedemptionHistory,
  fetchRedemptionHistoryByQRCode,
  fetchRecentRedemptionsByQRCode,
  fetchRedemptionHistoryByPurchaseId,
};
