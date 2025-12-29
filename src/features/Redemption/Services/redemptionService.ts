import api from "@/shared/utils/api";

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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Filters {
  search: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface Stats {
  totalRedemptions: number;
  totalRevenue: string;
  averageRedemption: string;
  pageRedemptions: number;
  pageRevenue: string;
}

export interface RedemptionsResponse {
  data: RedemptionHistory[];
  pagination: Pagination;
  filters: Filters;
  stats: Stats;
}

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
  async fetchRedemptions(
    params: FetchRedemptionsParams = {},
  ): Promise<RedemptionsResponse> {
    const response = await api.get("/purchases/redemptions", { params });
    return response.data.data;
  },

  async exportRedemptions(params: FetchRedemptionsParams = {}): Promise<Blob> {
    const response = await api.get("/purchases/redemptions/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
