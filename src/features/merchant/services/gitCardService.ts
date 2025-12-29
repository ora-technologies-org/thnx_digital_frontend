// src/services/giftCardSettingsService.ts
import api from "@/shared/utils/api";
import { GradientDirection } from "../slices/giftCardSlice";

export interface GiftCardSettingsPayload {
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: GradientDirection;
  fontFamily: string;
}

export interface GiftCardSettingsResponse {
  success: boolean;
  data: {
    id: string;
    primaryColor: string;
    secondaryColor: string;
    gradientDirection: GradientDirection;
    fontFamily: string;
  } | null;
  message?: string;
}

interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export const giftCardSettingsService = {
  // Create new settings
  createSettings: async (
    settings: GiftCardSettingsPayload,
  ): Promise<GiftCardSettingsResponse> => {
    const response = await api.post<GiftCardSettingsResponse>(
      "/gift-cards/settings",
      settings,
    );
    return response.data;
  },

  // Update existing settings
  updateSettings: async (
    id: string,
    settings: GiftCardSettingsPayload,
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

      if (response.data && typeof response.data === "object") {
        return {
          success: true,
          data: response.data.data || response.data,
          message: response.data.message,
        };
      }

      return {
        success: true,
        data: null,
        message: "Invalid response format",
      };
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
