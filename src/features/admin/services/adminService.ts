import api from '../../../shared/utils/api';
import { User } from '../../auth/types/auth.types';

export const adminService = {
  // Get pending merchants
  getPendingMerchants: async () => {
    const response = await api.get<{ success: boolean; data: { merchants: User[] } }>(
      '/auth/admin/merchants/pending'
    );
    return response.data.data.merchants;
  },

  // Verify/reject merchant
  verifyMerchant: async (merchantId: string, approved: boolean, notes?: string) => {
    const response = await api.post(`/auth/admin/merchants/${merchantId}/verify`, {
      approved,
      notes,
    });
    return response.data;
  },

  // Get all merchants
  getAllMerchants: async () => {
    const response = await api.get<{ success: boolean; data: { merchants: User[] } }>(
      '/auth/admin/merchants'
    );
    return response.data.data.merchants;
  },
};