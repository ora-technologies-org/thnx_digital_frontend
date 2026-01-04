import axios from "axios";
import { CreateMerchantForm } from "../slices/MerchantCreateSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// ==================== INTERFACES ====================

export interface GiftCard {
  id: string;
  merchantId: string;
  title: string;
  description?: string;
  price: string;
  balance?: number;
  cardNumber?: string;
  status: string;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    purchases: number;
  };
  merchant?: {
    id: string;
    name: string;
    merchantProfile: {
      businessName: string;
      businessLogo?: string;
    };
  };
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  businessLogo?: string;
  businessRegistrationNumber: string;
  taxId?: string;
  businessType?: string;
  businessCategory?: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website?: string;
  registrationDocument?: string;
  taxDocument?: string;
  identityDocument?: string;
  additionalDocuments?: string[];
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode?: string;
  swiftCode?: string;
  profileStatus:
    | "PENDING_VERIFICATION"
    | "VERIFIED"
    | "REJECTED"
    | "INCOMPLETE";
  isVerified: boolean;
  verifiedAt?: string;
  verifiedById?: string;
  verificationNotes?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  description?: string;
  logo?: string;
  giftCardLimit: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    createdAt: string;
    isActive: boolean;
  };
}

export interface MerchantSetting {
  merchantId: string;
  primaryColor?: string;
  secondaryColor?: string;
  gradientDirection?: string;
  fontFamily?: string;
  [key: string]: unknown;
}

export interface MerchantsResponse {
  merchants: Merchant[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    search: string | null;
    sortBy: string;
    sortOrder: string;
    profileStatus: string | null;
    active: boolean | null;
  };
  statusCounts: {
    PENDING_VERIFICATION: number;
    VERIFIED: number;
    REJECTED: number;
    INCOMPLETE: number;
  };
}

export interface GetMerchantsParams {
  page?: number;
  limit?: number;
  search?: string;
  profileStatus?:
    | "PENDING_VERIFICATION"
    | "VERIFIED"
    | "REJECTED"
    | "INCOMPLETE";
  active?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateMerchantResponse {
  success: boolean;
  data: {
    merchantId: string;
    email: string;
    name: string;
    businessName: string;
  };
  message: string;
}

export interface UpdateMerchantResponse {
  success: boolean;
  data: {
    merchantId: string;
    email: string;
    name: string;
    businessName: string;
  };
  message: string;
}

export interface VerifyMerchantRequest {
  verificationNotes?: string;
}

export interface RejectMerchantRequest {
  rejectionReason: string;
  verificationNotes?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==================== MERCHANT SERVICES ====================

export const merchantService = {
  // Get all merchants with filters and pagination
  getMerchants: async (
    params?: GetMerchantsParams,
  ): Promise<MerchantsResponse> => {
    const token = getAuthToken();

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.profileStatus)
      queryParams.append("profileStatus", params.profileStatus);
    if (params?.active !== undefined)
      queryParams.append("active", params.active.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${API_BASE_URL}merchants/?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch merchants");

    const data = await response.json();
    return data.data;
  },

  // Get merchant by ID
  getMerchantById: async (merchantId: string): Promise<Merchant> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}merchants/${merchantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch merchant");

    const data = await response.json();
    return data.data.merchant;
  },

  // Create new merchant
  async createMerchant(
    formData: CreateMerchantForm,
  ): Promise<CreateMerchantResponse> {
    const multiPartData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !(key === "website" && value === "")
      ) {
        if (value instanceof File) {
          multiPartData.append(key, value);
        } else if (Array.isArray(value) && value[0] instanceof File) {
          value.forEach((file) => multiPartData.append(key, file));
        } else {
          multiPartData.append(key, String(value));
        }
      }
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}merchants/`,
        multiPartData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to create merchant",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Update merchant
  async updateMerchant(
    merchantId: string,
    formData: CreateMerchantForm,
  ): Promise<UpdateMerchantResponse> {
    const multiPartData = new FormData();
    const excludedFields = ["email", "password", "name", "phone"];

    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !excludedFields.includes(key) &&
        !(key === "website" && value === "")
      ) {
        if (value instanceof File) {
          multiPartData.append(key, value);
        } else if (Array.isArray(value) && value[0] instanceof File) {
          value.forEach((file) => multiPartData.append(key, file));
        } else {
          multiPartData.append(key, String(value));
        }
      }
    });

    try {
      const response = await axios.put(
        `${API_BASE_URL}merchants/${merchantId}`,
        multiPartData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to update merchant",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Delete merchant
  async deleteMerchant(merchantId: string): Promise<ApiResponse<void>> {
    const token = getAuthToken();

    try {
      const response = await axios.delete(
        `${API_BASE_URL}merchants/${merchantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to delete merchant",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Verify merchant
  async verifyMerchant(
    merchantId: string,
    data: VerifyMerchantRequest,
  ): Promise<ApiResponse<Merchant>> {
    const token = getAuthToken();

    try {
      const response = await axios.post(
        `${API_BASE_URL}merchants/${merchantId}/verify`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to verify merchant",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Reject merchant
  async rejectMerchant(
    merchantId: string,
    data: RejectMerchantRequest,
  ): Promise<ApiResponse<Merchant>> {
    const token = getAuthToken();

    try {
      const response = await axios.post(
        `${API_BASE_URL}merchants/${merchantId}/reject`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to reject merchant",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Toggle merchant active status
  async toggleMerchantStatus(
    merchantId: string,
  ): Promise<ApiResponse<Merchant>> {
    const token = getAuthToken();

    try {
      const response = await axios.patch(
        `${API_BASE_URL}merchants/${merchantId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to toggle merchant status",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // ==================== GIFT CARD SERVICES ====================

  // Get merchant's gift cards
  MerchantGiftCard: async (
    userId: string,
  ): Promise<{ giftCards: GiftCard[]; setting: MerchantSetting }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}merchants/cards/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch gift cards");

    const data = await response.json();
    return data.data;
  },

  // Get gift card details
  getGiftCardDetails: async (cardId: string): Promise<GiftCard> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}cards/${cardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch gift card details");

    const data = await response.json();
    return data.data;
  },

  // Create gift card
  async createGiftCard(giftCardData: {
    merchantId: string;
    title: string;
    description?: string;
    price: string;
    expiryDate: string;
    isActive: boolean;
  }): Promise<ApiResponse<GiftCard>> {
    const token = getAuthToken();

    try {
      const response = await axios.post(`${API_BASE_URL}cards/`, giftCardData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to create gift card",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Update gift card
  async updateGiftCard(
    cardId: string,
    giftCardData: Partial<{
      title: string;
      description?: string;
      price: string;
      expiryDate: string;
      isActive: boolean;
    }>,
  ): Promise<ApiResponse<GiftCard>> {
    const token = getAuthToken();

    try {
      const response = await axios.put(
        `${API_BASE_URL}cards/${cardId}`,
        giftCardData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to update gift card",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Delete gift card
  async deleteGiftCard(cardId: string): Promise<ApiResponse<void>> {
    const token = getAuthToken();

    try {
      const response = await axios.delete(`${API_BASE_URL}cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to delete gift card",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Duplicate gift card
  async duplicateGiftCard(cardId: string): Promise<ApiResponse<GiftCard>> {
    const token = getAuthToken();

    try {
      const response = await axios.post(
        `${API_BASE_URL}cards/${cardId}/duplicate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to duplicate gift card",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Toggle gift card active status
  async toggleGiftCardStatus(cardId: string): Promise<ApiResponse<GiftCard>> {
    const token = getAuthToken();

    try {
      const response = await axios.patch(
        `${API_BASE_URL}cards/${cardId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to toggle gift card status",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // Get all gift cards (admin view)
  async getAllGiftCards(params?: {
    page?: number;
    limit?: number;
    search?: string;
    merchantId?: string;
    isActive?: boolean;
  }): Promise<{
    giftCards: GiftCard[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const token = getAuthToken();

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.merchantId) queryParams.append("merchantId", params.merchantId);
    if (params?.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());

    const url = `${API_BASE_URL}cards/?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch gift cards");

    const data = await response.json();
    return data.data;
  },

  // ==================== MERCHANT SETTINGS SERVICES ====================

  // Get merchant settings
  async getMerchantSettings(merchantId: string): Promise<MerchantSetting> {
    const token = getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}merchants/${merchantId}/settings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) throw new Error("Failed to fetch merchant settings");

    const data = await response.json();
    return data.data;
  },

  // Update merchant settings
  async updateMerchantSettings(
    merchantId: string,
    settings: Partial<MerchantSetting>,
  ): Promise<ApiResponse<MerchantSetting>> {
    const token = getAuthToken();

    try {
      const response = await axios.put(
        `${API_BASE_URL}merchants/${merchantId}/settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to update merchant settings",
          errors: data?.errors,
          statusCode: error.response?.status || 500,
        } as ApiError;
      } else {
        throw {
          message: "An unexpected error occurred",
          statusCode: 500,
        } as ApiError;
      }
    }
  },

  // ==================== ANALYTICS SERVICES ====================

  // Get merchant statistics
  async getMerchantStats(merchantId: string): Promise<{
    totalGiftCards: number;
    activeGiftCards: number;
    totalSales: number;
    totalRevenue: number;
  }> {
    const token = getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}merchants/${merchantId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) throw new Error("Failed to fetch merchant statistics");

    const data = await response.json();
    return data.data;
  },

  // Get dashboard analytics (admin)
  async getDashboardAnalytics(): Promise<{
    totalMerchants: number;
    activeMerchants: number;
    totalGiftCards: number;
    totalRevenue: number;
    recentActivity: unknown[];
  }> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}admin/analytics/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch dashboard analytics");

    const data = await response.json();
    return data.data;
  },
};
