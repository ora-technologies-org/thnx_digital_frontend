// src/hooks/useGiftCardSettings.ts
import { useState } from "react";
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

  const { settings, isExistingSettings } = useSelector(
    (state: RootState) => state.giftCardSettings,
  );

  // Track if settings have been initialized from API
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch existing settings FROM GIFT CARDS ENDPOINT
  const { isLoading, error } = useQuery({
    queryKey: ["giftCards"],
    queryFn: async () => {
      console.log("🔍 Fetching gift cards (which includes settings)...");
      try {
        const response = await giftCardService.getMyGiftCards();
        console.log("🔍 Gift Cards Response:", response);

        if (
          response.success &&
          response.data.settings &&
          response.data.settings.length > 0
        ) {
          const firstSettings = response.data.settings[0];
          console.log("✅ Found existing settings:", firstSettings);

          dispatch(
            setAllSettings({
              id: firstSettings.id,
              primaryColor: firstSettings.primaryColor,
              secondaryColor: firstSettings.secondaryColor,
              gradientDirection:
                firstSettings.gradientDirection as GradientDirection,
              fontFamily: firstSettings.fontFamily,
              amount: settings.amount || 500,
            }),
          );

          dispatch(setIsExistingSettings(true));
          setIsInitialized(true); // Mark as initialized
          console.log("✅ Settings loaded with ID:", firstSettings.id);
        } else {
          console.log("🔍 No settings found in gift cards response");
          dispatch(setIsExistingSettings(false));
          setIsInitialized(true); // Still mark as initialized (no settings exist)
        }
        return response;
      } catch (error) {
        console.error("🔍 Error fetching gift cards:", error);
        dispatch(setIsExistingSettings(false));
        setIsInitialized(true); // Mark as initialized even on error
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnMount: true,
  });
  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (settingsData: GiftCardSettingsPayload) =>
      giftCardSettingsService.createSettings(settingsData),
    onSuccess: (response) => {
      console.log("✅ Create successful:", response);

      if (response.data) {
        dispatch(
          setAllSettings({
            id: response.data.id,
            primaryColor: response.data.primaryColor,
            secondaryColor: response.data.secondaryColor,
            gradientDirection: response.data
              .gradientDirection as GradientDirection,
            fontFamily: response.data.fontFamily,
            amount: settings.amount,
          }),
        );
        dispatch(setIsExistingSettings(true));
      }

      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
      queryClient.invalidateQueries({ queryKey: GIFT_CARD_SETTINGS_QUERY_KEY });

      toast.success("Gift card settings created successfully!");
    },
    onError: (error: unknown) => {
      console.error("❌ Create error:", error);
      let message = "Failed to create settings";

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        message = err.response?.data?.message || message;
      }

      toast.error(message);
    },
  });
  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (settingsData: GiftCardSettingsPayload) => {
      if (!settings.id) {
        console.error("❌ No settings ID found:", settings);
        throw new Error("Cannot update: No settings ID found");
      }
      console.log("🔄 Updating settings with ID:", settings.id);
      return giftCardSettingsService.updateSettings(settings.id, settingsData);
    },
    onSuccess: (response) => {
      console.log("✅ Update successful:", response);

      if (response.data) {
        dispatch(
          setAllSettings({
            id: response.data.id,
            primaryColor: response.data.primaryColor,
            secondaryColor: response.data.secondaryColor,
            gradientDirection: response.data
              .gradientDirection as GradientDirection,
            fontFamily: response.data.fontFamily,
            amount: settings.amount,
          }),
        );
      }

      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
      queryClient.invalidateQueries({ queryKey: GIFT_CARD_SETTINGS_QUERY_KEY });

      toast.success("Gift card settings updated successfully!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("❌ Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update settings");
    },
  });
  // Save Settings Function
  const saveSettings = (settingsData: GiftCardSettingsPayload) => {
    console.log("💾 Saving settings...", {
      isExistingSettings,
      settingsId: settings.id,
      hasId: !!settings.id,
      settingsData,
    });

    if (settings.id) {
      console.log("🔄 Calling UPDATE mutation with ID:", settings.id);
      updateMutation.mutate(settingsData);
    } else {
      console.log("🆕 Calling CREATE mutation (no ID found)");
      createMutation.mutate(settingsData);
    }
  };

  return {
    settings,
    isLoading: isLoading || !isInitialized, // Loading until initialized
    error,
    saveSettings,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isExistingSettings: !!settings.id,
  };
};
