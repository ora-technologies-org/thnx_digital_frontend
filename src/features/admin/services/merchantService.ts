import axios from "axios";
// import { CreateMerchantForm } from "../slices/MerchantCreateSlice";
import {
  ApiError,
  ApiResponse,
  CreateMerchantResponse,
  GetMerchantsParams,
  GiftCard,
  Merchant,
  MerchantSetting,
  MerchantsResponse,
  RejectMerchantRequest,
  UpdateMerchantResponse,
  VerifyMerchantRequest,
} from "../types/merchant.types";
import { CreateMerchantForm } from "@/shared/types/Form.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

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

    try {
      const response = await axios.get(
        `${API_BASE_URL}merchants/?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch merchants",
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

  // Get merchant by ID
  getMerchantById: async (merchantId: string): Promise<Merchant> => {
    const token = getAuthToken();

    try {
      const response = await axios.get(
        `${API_BASE_URL}merchants/${merchantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data.merchant;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch merchant",
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
    params?: { page?: number; limit?: number },
  ): Promise<{ giftCards: GiftCard[]; setting: MerchantSetting }> => {
    const token = getAuthToken();

    const queryParams = new URLSearchParams();
    queryParams.append("page", (params?.page || 1).toString());
    queryParams.append("limit", (params?.limit || 100).toString());

    try {
      const response = await axios.get(
        `${API_BASE_URL}merchants/cards/${userId}?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch gift cards",
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

  // Get gift card details
  getGiftCardDetails: async (cardId: string): Promise<GiftCard> => {
    const token = getAuthToken();

    try {
      const response = await axios.get(`${API_BASE_URL}cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch gift card details",
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

    try {
      const response = await axios.get(
        `${API_BASE_URL}cards/?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch gift cards",
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

  // ==================== MERCHANT SETTINGS SERVICES ====================

  // Get merchant settings
  async getMerchantSettings(merchantId: string): Promise<MerchantSetting> {
    const token = getAuthToken();

    try {
      const response = await axios.get(
        `${API_BASE_URL}merchants/${merchantId}/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch merchant settings",
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

    try {
      const response = await axios.get(
        `${API_BASE_URL}merchants/${merchantId}/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch merchant statistics",
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

  // Get dashboard analytics (admin)
  async getDashboardAnalytics(): Promise<{
    totalMerchants: number;
    activeMerchants: number;
    totalGiftCards: number;
    totalRevenue: number;
    recentActivity: unknown[];
  }> {
    const token = getAuthToken();

    try {
      const response = await axios.get(
        `${API_BASE_URL}admin/analytics/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        throw {
          message: data?.message || "Failed to fetch dashboard analytics",
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
};
