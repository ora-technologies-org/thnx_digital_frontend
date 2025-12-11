// src/features/admin/api/admin.api.ts - ADMIN API! 🔌

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  profileStatus: 'INCOMPLETE' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedById: string | null;
  verificationNotes: string | null;
  rejectionReason: string | null;
  rejectedAt: string | null;
  description: string | null;
  logo: string | null;
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

export interface MerchantsListResponse {
  merchants: MerchantUser[];
  count: number;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function for API calls
const apiCall = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
  }

  return result;
};

export const adminApi = {
  // ==================== GET ALL MERCHANTS ====================
  // GET /api/merchants
  getAllMerchants: async (): Promise<MerchantUser[]> => {
    const result = await apiCall<ApiResponse<MerchantsListResponse>>(
      `${API_URL}/merchants`
    );
    return result.data.merchants;
  },

  // ==================== GET PENDING MERCHANTS ====================
  // GET /api/merchants/pending
  getPendingMerchants: async (): Promise<MerchantUser[]> => {
    const result = await apiCall<ApiResponse<MerchantsListResponse>>(
      `${API_URL}/merchants/pending`
    );
    return result.data.merchants;
  },

  // ==================== CREATE MERCHANT ====================
  // POST /api/merchants
  createMerchant: async (data: CreateMerchantRequest): Promise<ApiResponse<{ user: MerchantUser }>> => {
    const result = await apiCall<ApiResponse<{ user: MerchantUser }>>(
      `${API_URL}/merchants`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result;
  },

  // ==================== APPROVE MERCHANT ====================
  // POST /api/merchants/:merchantId/verify
  approveMerchant: async (
    merchantId: string,
    notes?: string
  ): Promise<ApiResponse<{ profile: MerchantUser }>> => {
    const result = await apiCall<ApiResponse<{ profile: MerchantUser }>>(
      `${API_URL}/merchants/${merchantId}/verify`,
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'approve',
          verificationNotes: notes || '',
        }),
      }
    );
    return result;
  },

  // ==================== REJECT MERCHANT ====================
  // POST /api/merchants/:merchantId/verify
  rejectMerchant: async (
    merchantId: string,
    reason: string,
    notes?: string
  ): Promise<ApiResponse<{ profile: MerchantUser }>> => {
    if (!reason) {
      throw new Error('Rejection reason is required');
    }

    const result = await apiCall<ApiResponse<{ profile: MerchantUser }>>(
      `${API_URL}/merchants/${merchantId}/verify`,
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'reject',
          rejectionReason: reason,
          verificationNotes: notes || '',
        }),
      }
    );
    return result;
  },

  // ==================== DELETE MERCHANT (SOFT) ====================
  // DELETE /api/merchants/:merchantId
  deleteMerchant: async (
    merchantId: string,
    hardDelete: boolean = false
  ): Promise<ApiResponse<{ merchantId: string; email: string }>> => {
    const result = await apiCall<ApiResponse<{ merchantId: string; email: string }>>(
      `${API_URL}/merchants/${merchantId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          hardDelete,
        }),
      }
    );
    return result;
  },

  // ==================== DEACTIVATE MERCHANT ====================
  // DELETE /api/merchants/:merchantId (soft delete)
  deactivateMerchant: async (
    merchantId: string
  ): Promise<ApiResponse<{ merchantId: string; email: string }>> => {
    return adminApi.deleteMerchant(merchantId, false);
  },

  // ==================== PERMANENTLY DELETE MERCHANT ====================
  // DELETE /api/merchants/:merchantId (hard delete)
  permanentlyDeleteMerchant: async (
    merchantId: string
  ): Promise<ApiResponse<{ merchantId: string; email: string }>> => {
    return adminApi.deleteMerchant(merchantId, true);
  },
};

export default adminApi;