// src/features/merchant/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  profileService,
  type UpdateProfilePayload,
  type UpdateProfileResponse,
} from "../services/ProfileMerchantService";

// Define interface for error response structure
interface UpdateProfileError {
  message: string;
}

/**
 * Custom hook for updating merchant profile information
 *
 * This hook:
 * - Handles profile update mutations
 * - Invalidates relevant queries on success to refresh cached data
 * - Provides error handling and logging
 *
 * @returns Mutation object with mutate function and status properties
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Mutation function that delegates to the profile service
     *
     * @param data - Profile update payload containing name, phone, and bio
     * @returns Promise resolving to the update response
     */
    mutationFn: async (
      data: UpdateProfilePayload,
    ): Promise<UpdateProfileResponse> => {
      return await profileService.updateProfile(data);
    },

    /**
     * Success handler - invalidates related queries to refresh data
     * This ensures the UI shows the latest profile information
     */
    onSuccess: () => {
      // Invalidate auth-me query to update user context
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      // Invalidate merchant-profile query to refresh profile data
      queryClient.invalidateQueries({ queryKey: ["merchant-profile"] });
    },

    /**
     * Error handler - logs errors for debugging
     */
    onError: (error: AxiosError<UpdateProfileError>) => {
      console.error("Failed to update profile:", error);
    },
  });
};

export default useUpdateProfile;

// Re-export types for consumers
export type {
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "../services/ProfileMerchantService";
