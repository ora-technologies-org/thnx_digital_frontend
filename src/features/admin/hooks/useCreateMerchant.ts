// src/features/admin/hooks/useCreateMerchant.ts - REACT QUERY HOOK! 🎣
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMerchant, CreateMerchantRequest } from "../api/createMerchant";
import { toast } from "react-hot-toast";

/**
 * Custom hook for creating a new merchant using React Query
 *
 * This hook handles:
 * - Merchant creation via API mutation
 * - Cache invalidation for merchant lists
 * - Success/error toast notifications
 *
 * @returns Mutation object with mutate function and status
 *
 * @example
 * const { mutate, isPending } = useCreateMerchant();
 * mutate({ name: 'New Merchant', email: 'merchant@example.com' });
 */
export const useCreateMerchant = () => {
  // Access the query client to invalidate cached queries
  const queryClient = useQueryClient();

  return useMutation({
    // The mutation function that calls the API
    mutationFn: (merchantData: CreateMerchantRequest) =>
      createMerchant(merchantData),

    // Success callback - runs when mutation succeeds
    onSuccess: (data) => {
      // Invalidate merchants list queries to trigger a refetch
      // This ensures the UI shows the newly created merchant
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["pending-merchants"] });

      // Show success notification to user
      toast.success(data.message || "Merchant created successfully!");
    },

    // Error callback - runs when mutation fails
    onError: (error: Error) => {
      // Extract error message from response or use default
      // Type assertion needed as error structure depends on API client (axios/fetch)
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        apiError?.response?.data?.message || "Failed to create merchant";

      // Show error notification to user
      toast.error(errorMessage);
    },
  });
};
