// src/features/admin/api/admin.api.ts - ADMIN API! 🔌
const API_URL = 'http://localhost:4001/api';

export interface MerchantUser {
  id: string;
  userId: string;
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
  registrationDocument: string;
  taxDocument: string;
  identityDocument: string;
  additionalDocuments: string[];
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  swiftCode: string;
  profileStatus: string;
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedById: string | null;
  verificationNotes: string | null;
  rejectionReason: string | null;
  rejectedAt: string | null;
  description: string;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    createdAt: string;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const adminApi = {
  // Get pending merchants
  getPendingMerchants: async (): Promise<MerchantUser[]> => {
    const response = await fetch(`${API_URL}/auth/admin/merchants/pending`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending merchants');
    }

    const result = await response.json();
    return result.data.merchants;
  },

  // Get all merchants
  getAllMerchants: async (): Promise<MerchantUser[]> => {
    const response = await fetch(`${API_URL}/auth/admin/merchants`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch merchants');
    }

    const result = await response.json();
    return result.data.merchants;
  },

  // Approve merchant
  approveMerchant: async (merchantId: string, notes: string) => {
    const response = await fetch(
      `${API_URL}/auth/admin/merchants/${merchantId}/verify`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'approve',
          verificationNotes: notes,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to approve merchant');
    }

    return response.json();
  },

  // Reject merchant
  rejectMerchant: async (merchantId: string, reason: string, notes: string) => {
    const response = await fetch(
      `${API_URL}/auth/admin/merchants/${merchantId}/verify`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'reject',
          rejectionReason: reason,
          verificationNotes: notes,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reject merchant');
    }

    return response.json();
  },
};