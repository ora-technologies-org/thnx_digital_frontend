// src/hooks/useGiftCardSettings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import type { RootState } from "@/app/store";
import { AxiosError } from "axios";
import {
  GradientDirection,
  setAllSettings,
  setIsExistingSettings,
} from "../slices/giftCardSlice";
import { giftCardService } from "@/features/giftCards/services/giftCardService";
import {
  giftCardSettingsService,
  GiftCardSettingsPayload,
} from "../services/gitCardService";

export const GIFT_CARD_SETTINGS_QUERY_KEY = ["giftCardSettings"];

export const useGiftCardSettings = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Get the current settings from Redux state
  const { settings, isExistingSettings } = useSelector(
    (state: RootState) => state.giftCardSettings,
  );

  console.log("🔍 Hook - Current Redux state:", {
    isExistingSettings,
    settings,
    hasId: !!settings.id,
  });

  // Fetch existing settings FROM GIFT CARDS ENDPOINT
  const { isLoading, error } = useQuery({
    queryKey: ["giftCards"], // Use giftCards query key since settings come from there
    queryFn: async () => {
      console.log("🔍 Fetching gift cards (which includes settings)...");
      try {
        const response = await giftCardService.getMyGiftCards();
        console.log("🔍 Gift Cards Response:", response);

        // Check if we have settings in the response
        if (
          response.success &&
          response.data.settings &&
          response.data.settings.length > 0
        ) {
          const firstSettings = response.data.settings[0]; // Get first settings object
          console.log("✅ Found existing settings:", firstSettings);

          dispatch(
            setAllSettings({
              id: firstSettings.id,
              primaryColor: firstSettings.primaryColor,
              secondaryColor: firstSettings.secondaryColor,
              gradientDirection:
                firstSettings.gradientDirection as GradientDirection,
              fontFamily: firstSettings.fontFamily,
              amount: settings.amount || 500, // Keep existing amount
            }),
          );
          dispatch(setIsExistingSettings(true));
        } else {
          // No settings found
          console.log("🔍 No settings found in gift cards response");
          dispatch(setIsExistingSettings(false));
        }
        return response;
      } catch (error) {
        console.error("🔍 Error fetching gift cards:", error);
        dispatch(setIsExistingSettings(false));
        throw error;
      }
    },
    retry: false,
  });

  // Rest of the code remains the same...
  const createMutation = useMutation({
    mutationFn: (settingsData: GiftCardSettingsPayload) =>
      giftCardSettingsService.createSettings(settingsData),
    onSuccess: (response) => {
      console.log("✅ Create successful:", response);
      queryClient.invalidateQueries({ queryKey: ["giftCards"] }); // Invalidate giftCards query
      queryClient.invalidateQueries({ queryKey: GIFT_CARD_SETTINGS_QUERY_KEY });
      toast.success("Gift card settings created successfully!");
      if (response.data) {
        dispatch(setAllSettings(response.data));
        dispatch(setIsExistingSettings(true));
      }
    },
    onError: (error: unknown) => {
      console.error("❌ Create error:", error);

      let message = "Failed to create settings";

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = err.response?.data?.message || message;
      }

      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (settingsData: GiftCardSettingsPayload) => {
      if (!settings.id) {
        throw new Error("Cannot update: No settings ID found");
      }
      return giftCardSettingsService.updateSettings(settings.id, settingsData);
    },
    onSuccess: (response) => {
      console.log("✅ Update successful:", response);
      queryClient.invalidateQueries({ queryKey: ["giftCards"] }); // Invalidate giftCards query
      queryClient.invalidateQueries({ queryKey: GIFT_CARD_SETTINGS_QUERY_KEY });
      toast.success("Gift card settings updated successfully!");
      if (response.data) {
        dispatch(setAllSettings(response.data));
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("❌ Update error:", error);

      toast.error(error.response?.data?.message || "Failed to update settings");
    },
  });

  const saveSettings = (settingsData: GiftCardSettingsPayload) => {
    console.log("💾 Saving settings...", {
      isExistingSettings,
      settingsId: settings.id,
      hasId: !!settings.id,
      settingsData,
    });

    if (isExistingSettings && settings.id) {
      console.log("🔄 Calling UPDATE mutation");
      updateMutation.mutate(settingsData);
    } else {
      console.log("🆕 Calling CREATE mutation");
      createMutation.mutate(settingsData);
    }
  };

  return {
    settings,
    isLoading,
    error,
    saveSettings,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isExistingSettings,
  };
};
