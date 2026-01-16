// src/features/merchant/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/utils/api";
import { AxiosError } from "axios";

// Define interface for the update profile request payload
interface UpdateProfilePayload {
  name: string;
  phone: string;
  bio: string;
}

// Define interface for error response structure
interface UpdateProfileError {
  message: string;
}

/**
 * Custom hook for updating merchant profile information
 * Handles profile update mutation with proper cache invalidation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  // Create and return the mutation hook
  return useMutation({
    // Mutation function that makes the API call
    mutationFn: async (data: UpdateProfilePayload) => {
      const response = await api.put("/merchants/update/profile", data);
      return response.data;
    },
    // Success handler: invalidate related queries to refresh data
    onSuccess: () => {
      // Invalidate auth-me query to update user context
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      // Invalidate merchant-profile query to refresh profile data
      queryClient.invalidateQueries({ queryKey: ["merchant-profile"] });
    },
    // Error handler: log errors for debugging
    onError: (error: AxiosError<UpdateProfileError>) => {
      console.error("Failed to update profile:", error);
    },
  });
};

export default useUpdateProfile;
