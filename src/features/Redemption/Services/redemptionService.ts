import api from "@/shared/utils/api";

// Complete redemption record with full gift card and user details
export interface RedemptionHistory {
  id: string;
  purchasedGiftCardId: string;
  redeemedById: string;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  locationName: string;
  locationAddress: string;
  notes: string;
  redeemedAt: string;
  purchasedGiftCard: {
    id: string;
    giftCardId: string;
    qrCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    purchaseAmount: string;
    currentBalance: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string;
    purchasedAt: string;
    expiresAt: string;
    lastUsedAt: string;
    giftCard: {
      id: string;
      title: string;
      price: string;
      description: string;
    };
  };
  redeemedBy: {
    id: string;
    name: string;
    email: string;
  };
}

// Pagination metadata for list responses
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Active filter state
export interface Filters {
  search: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Statistical summary of redemptions
export interface Stats {
  totalRedemptions: number;
  totalRevenue: string;
  averageRedemption: string;
  pageRedemptions: number;
  pageRevenue: string;
}

// Complete API response structure
export interface RedemptionsResponse {
  data: RedemptionHistory[];
  pagination: Pagination;
  filters: Filters;
  stats: Stats;
}

// Query parameters for filtering and pagination
export interface FetchRedemptionsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const redemptionService = {
  // Fetch paginated list of redemptions with optional filtering
  async fetchRedemptions(
    params: FetchRedemptionsParams = {},
  ): Promise<RedemptionsResponse> {
    const response = await api.get("/purchases/redemptions", { params });
    return response.data.data;
  },

  // Export redemptions data as CSV/Excel file
  async exportRedemptions(params: FetchRedemptionsParams = {}): Promise<Blob> {
    const response = await api.get("/purchases/redemptions/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
