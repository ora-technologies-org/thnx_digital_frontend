// src/features/admin/api/createMerchant.ts - CREATE MERCHANT API! 🚀

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  merchantData: CreateMerchantRequest
): Promise<CreateMerchantResponse> => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_URL}/auth/admin/create-merchant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(merchantData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create merchant');
  }

  return response.json();
};