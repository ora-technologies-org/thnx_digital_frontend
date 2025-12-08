// src/features/admin/api/createMerchant.ts - CREATE MERCHANT API! 🚀

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
 * POST http://localhost:4001/api/auth/admin/create-merchant
 */
export const createMerchant = async (
  merchantData: CreateMerchantRequest
): Promise<CreateMerchantResponse> => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:4001/api/auth/admin/create-merchant', {
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