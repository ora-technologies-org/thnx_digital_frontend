// src/features/admin/api/createMerchant.ts - CREATE MERCHANT API! 🚀

import api from "@/shared/utils/api";

export interface CreateMerchantRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  businessName: string;
  businessRegistrationNumber: string;
  businessType: string;
  businessCategory: string;
  city: string;
  country: string;
  businessEmail: string;
}

export interface CreateMerchantResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
}

/**
 * Create a new merchant (Admin only)
 * POST /api/auth/admin/create-merchant
 */
export const createMerchant = async (
  merchantData: CreateMerchantRequest,
): Promise<CreateMerchantResponse> => {
  const response = await api.post<CreateMerchantResponse>(
    "/auth/admin/create-merchant",
    merchantData,
  );

  return response.data;
};
