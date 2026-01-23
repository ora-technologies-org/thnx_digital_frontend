// src/services/giftCardSettingsService.ts
import {
  GiftCardSettings,
  GiftCardSettingsResponse,
} from "@/shared/types/giftCard.types";
import api from "@/shared/utils/api";

interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}
export type GiftCardSettingsPayload = Omit<GiftCardSettings, "id" | "amount">;
export const giftCardSettingsService = {
  // Create new settings
  createSettings: async (
    settings: GiftCardSettings,
  ): Promise<GiftCardSettingsResponse> => {
    const response = await api.post<GiftCardSettingsResponse>(
      "/gift-cards/settings",
      settings,
    );
    return response.data;
  },

  // Update existing settings
  updateSettings: async (
    settings: GiftCardSettings,
  ): Promise<GiftCardSettingsResponse> => {
    const response = await api.put<GiftCardSettingsResponse>(
      `/gift-cards/card/settings`,
      settings,
    );
    return response.data;
  },

  // Get settings (returns null if not found)
  getSettings: async (): Promise<GiftCardSettingsResponse> => {
    try {
      const response = await api.get<GiftCardSettingsResponse>(
        "/gift-cards/card/settings",
      );

      console.log("🔍 getSettings response:", response.data);

      return response.data; // ✅ Just return it
    } catch (error: unknown) {
      const err = error as ApiError;

      console.error("🔍 getSettings error:", err.response?.data || err.message);

      if (err.response?.status === 404) {
        return {
          success: true,
          data: null,
          message: "No settings found",
        };
      }

      return {
        success: false,
        data: null,
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch settings",
      };
    }
  },
};
