import api from "@/shared/utils/api";
import { AxiosResponse } from "axios";

// ===== TYPES =====
export interface CreateMerchantData {
  email: string;
  password: string;
  name: string;
  phone: string;
  businessName: string;
  businessRegistrationNumber: string;
  taxId: string;
  businessType: string;
  businessCategory: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website: string;
  description: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  swiftCode: string;
}

export interface MerchantResponse {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  isVerified: boolean;
  businessProfile: {
    businessName: string;
    businessRegistrationNumber: string;
    taxId: string;
    businessType: string;
    businessCategory: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    businessPhone: string;
    businessEmail: string;
    website: string;
    description: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    ifscCode: string;
    swiftCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ===== SERVICE =====
export const merchantService = {
  /**
   * Create a new merchant
   * @param data - Merchant creation data
   * @returns Promise with merchant response
   */
  createMerchant: async (
    data: CreateMerchantData,
  ): Promise<ApiResponse<MerchantResponse>> => {
    const response: AxiosResponse<ApiResponse<MerchantResponse>> =
      await api.post("/merchants", data);
    return response.data;
  },

  /**
   * Get merchant by ID
   * @param id - Merchant ID
   * @returns Promise with merchant response
   */
  getMerchantById: async (
    id: string,
  ): Promise<ApiResponse<MerchantResponse>> => {
    const response: AxiosResponse<ApiResponse<MerchantResponse>> =
      await api.get(`/merchants/${id}`);
    return response.data;
  },

  /**
   * Update merchant
   * @param id - Merchant ID
   * @param data - Partial merchant data to update
   * @returns Promise with merchant response
   */
  updateMerchant: async (
    id: string,
    data: Partial<CreateMerchantData>,
  ): Promise<ApiResponse<MerchantResponse>> => {
    const response: AxiosResponse<ApiResponse<MerchantResponse>> =
      await api.put(`/merchants/${id}`, data);
    return response.data;
  },

  /**
   * Delete merchant
   * @param id - Merchant ID
   * @returns Promise with success response
   */
  deleteMerchant: async (id: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(
      `/merchants/${id}`,
    );
    return response.data;
  },

  /**
   * Get all merchants with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with paginated merchants
   */
  getAllMerchants: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      merchants: MerchantResponse[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > => {
    const response = await api.get("/admin/merchants", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Verify merchant account
   * @param id - Merchant ID
   * @returns Promise with merchant response
   */
  verifyMerchant: async (
    id: string,
  ): Promise<ApiResponse<MerchantResponse>> => {
    const response: AxiosResponse<ApiResponse<MerchantResponse>> =
      await api.post(`/admin/merchants/${id}/verify`);
    return response.data;
  },

  /**
   * Suspend merchant account
   * @param id - Merchant ID
   * @returns Promise with merchant response
   */
  suspendMerchant: async (
    id: string,
  ): Promise<ApiResponse<MerchantResponse>> => {
    const response: AxiosResponse<ApiResponse<MerchantResponse>> =
      await api.post(`/admin/merchants/${id}/suspend`);
    return response.data;
  },
};
