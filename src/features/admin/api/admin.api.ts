import api from "../../../shared/utils/api";

export interface MerchantUser {
  id: string;
  userId: string;
  businessName: string;
  businessRegistrationNumber: string | null;
  taxId: string | null;
  businessType: string | null;
  businessCategory: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  businessPhone: string | null;
  businessEmail: string | null;
  website: string | null;
  registrationDocument: string | null;
  taxDocument: string | null;
  identityDocument: string | null;
  additionalDocuments: string[];
  bankName: string | null;
  accountNumber: string | null;
  accountHolderName: string | null;
  ifscCode: string | null;
  swiftCode: string | null;
  profileStatus:
    | "INCOMPLETE"
    | "PENDING_VERIFICATION"
    | "VERIFIED"
    | "REJECTED";
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedById: string | null;
  verificationNotes: string | null;
  rejectionReason: string | null;
  rejectedAt: string | null;
  description: string | null;
  logo: string | null;
  giftCardLimit: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    createdAt: string;
    isActive: boolean;
  };
}

export interface CreateMerchantRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  businessName: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  businessType?: string;
  businessCategory?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatusCounts {
  PENDING_VERIFICATION: number;
  VERIFIED: number;
  REJECTED: number;
  INCOMPLETE: number;
}

export interface GetMerchantsParams {
  page?: number;
  limit?: number;
  status?: "VERIFIED" | "PENDING_VERIFICATION" | "REJECTED" | "INCOMPLETE";
  search?: string;
  sortBy?: "createdAt" | "updatedAt";
  order?: "asc" | "desc";
}

export interface MerchantsResponse {
  merchants: MerchantUser[];
  pagination: PaginationInfo;
  statusCounts: StatusCounts;
}

export interface MerchantsListResponse {
  merchants: MerchantUser[];
  count: number;
}

export const adminApi = {
  // ==================== GET ALL MERCHANTS WITH PAGINATION ====================
  // GET /api/merchants?page=1&limit=10&status=VERIFIED&search=...&sortBy=createdAt&order=desc
  // getAllMerchants: async (
  //   params: GetMerchantsParams = {},
  // ): Promise<MerchantsResponse> => {
  //   const {
  //     page = 1,
  //     limit = 12,
  //     status,
  //     search,
  //     sortBy = "createdAt",
  //     order = "desc",
  //   } = params;

  //   // Build query parameters
  //   const queryParams = new URLSearchParams({
  //     page: page.toString(),
  //     limit: limit.toString(),
  //     order,
  //   });

  //   if (status) {
  //     queryParams.append("status", status);
  //   }

  //   if (search && search.trim()) {
  //     queryParams.append("search", search.trim());
  //   }

  //   if (sortBy) {
  //     queryParams.append("sortBy", sortBy);
  //   }

  //   const response = await api.get<ApiResponse<MerchantsResponse>>(
  //     `/merchants?${queryParams.toString()}`,
  //   );

  //   return response.data.data;
  // },

  // ==================== GET PENDING MERCHANTS ====================
  // GET /api/merchants/pending
  getPendingMerchants: async (
    params: GetMerchantsParams = {},
  ): Promise<MerchantsResponse> => {
    const {
      page = 1,
      limit = 12,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = params;

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      order,
    });

    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }

    console.log(
      "🚀 Pending Merchants API Call:",
      `/merchants/pending?${queryParams.toString()}`,
    );

    const response = await api.get<ApiResponse<MerchantsResponse>>(
      `/merchants/pending?${queryParams.toString()}`,
    );

    return response.data.data;
  },

  // ==================== CREATE MERCHANT ====================
  // POST /api/merchants
  createMerchant: async (
    data: CreateMerchantRequest,
  ): Promise<ApiResponse<{ user: MerchantUser }>> => {
    const response = await api.post<ApiResponse<{ user: MerchantUser }>>(
      "/merchants",
      data,
    );
    return response.data;
  },

  // ==================== APPROVE MERCHANT ====================
  // POST /api/merchants/:merchantId/verify
  approveMerchant: async (
    merchantId: string,
    notes?: string,
  ): Promise<ApiResponse<{ profile: MerchantUser }>> => {
    const response = await api.post<ApiResponse<{ profile: MerchantUser }>>(
      `/merchants/${merchantId}/verify`,
      {
        action: "approve",
        verificationNotes: notes || "",
      },
    );
    return response.data;
  },

  // ==================== REJECT MERCHANT ====================
  // POST /api/merchants/:merchantId/verify
  rejectMerchant: async (
    merchantId: string,
    reason: string,
    notes?: string,
  ): Promise<ApiResponse<{ profile: MerchantUser }>> => {
    if (!reason) {
      throw new Error("Rejection reason is required");
    }

    const response = await api.post<ApiResponse<{ profile: MerchantUser }>>(
      `/merchants/${merchantId}/verify`,
      {
        action: "reject",
        rejectionReason: reason,
        verificationNotes: notes || "",
      },
    );
    return response.data;
  },

  // ==================== DELETE MERCHANT (SOFT) ====================
  // DELETE /api/merchants/:merchantId
  deleteMerchant: async (
    merchantId: string,
    hardDelete: boolean = false,
  ): Promise<ApiResponse<{ merchantId: string; email: string }>> => {
    const response = await api.delete<
      ApiResponse<{ merchantId: string; email: string }>
    >(`/merchants/${merchantId}`, {
      data: {
        hardDelete,
      },
    });
    return response.data;
  },

  // ==================== DEACTIVATE MERCHANT ====================
  // DELETE /api/merchants/:merchantId (soft delete)
  deactivateMerchant: async (
    merchantId: string,
  ): Promise<ApiResponse<{ merchantId: string; email: string }>> => {
    return adminApi.deleteMerchant(merchantId, false);
  },

  // ==================== PERMANENTLY DELETE MERCHANT ====================
  // DELETE /api/merchants/:merchantId (hard delete)
  permanentlyDeleteMerchant: async (
    merchantId: string,
  ): Promise<ApiResponse<{ merchantId: string; email: string }>> => {
    return adminApi.deleteMerchant(merchantId, true);
  },
};

export default adminApi;
