// Represents a single redemption transaction
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

  transactionId?: string;
  paymentMethod?: string;
}
export interface PurchaseWithRedemptions {
  purchase: {
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
    recentRedemptions: RedemptionHistoryItem[];
    redemptionCount: number;
  };
}
// API response structure for redemption history
export interface RedemptionHistoryResponse {
  success: boolean;
  message: string;
  data: PurchaseWithRedemptions | RedemptionHistoryItem[]; // Can be either structure
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Query parameters for filtering redemption history
export interface RedemptionHistoryParams {
  qrCode?: string;
  purchaseId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: "active" | "inactive" | "expired";
}

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
