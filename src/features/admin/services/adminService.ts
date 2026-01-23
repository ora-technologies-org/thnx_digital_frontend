import api from "../../../shared/utils/api";
import { User } from "../../auth/types/auth.types";

// Define the verification response type
interface VerifyMerchantResponse {
  success: boolean;
  message?: string;
  data?: {
    merchant?: User;
  };
}

export const adminService = {
  // Get pending merchants
  getPendingMerchants: async (): Promise<User[]> => {
    try {
      const response = await api.get<{
        success: boolean;
        data: { merchants: User[] };
      }>("/auth/admin/merchants/pending");

      return response.data.data.merchants;
    } catch (error: unknown) {
      console.error("Failed to fetch pending merchants:", error);
      throw error; // Re-throw so the caller knows there was an error
    }
  },

  // Verify/reject merchant
  verifyMerchant: async (
    merchantId: string,
    approved: boolean,
    notes?: string,
  ): Promise<VerifyMerchantResponse> => {
    try {
      const response = await api.post<VerifyMerchantResponse>(
        `/auth/admin/merchants/${merchantId}/verify`,
        { approved, notes },
      );

      return response.data;
    } catch (error: unknown) {
      console.error(`Failed to verify merchant ${merchantId}:`, error);
      throw error;
    }
  },
};
