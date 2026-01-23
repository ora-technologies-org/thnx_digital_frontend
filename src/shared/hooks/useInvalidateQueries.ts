// src/shared/hooks/useInvalidateQueries.ts
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Custom hook that provides query invalidation utilities
 * Eliminates repetitive useQueryClient() calls in mutation hooks
 *
 * @returns Object containing queryClient instance and utility functions for invalidating queries
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate merchant-related queries
   */
  const invalidateMerchants = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["admin", "merchants"],
      refetchType: "active",
    });
  }, [queryClient]);

  /**
   * Invalidate pending merchant queries
   */
  const invalidatePendingMerchants = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["admin", "pending-merchants"],
      refetchType: "active",
    });
  }, [queryClient]);

  /**
   * Invalidate both merchants and pending merchants queries
   */
  const invalidateMerchantsAndPending = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["admin", "merchants"],
      refetchType: "active",
    });
    queryClient.invalidateQueries({
      queryKey: ["admin", "pending-merchants"],
      refetchType: "active",
    });
  }, [queryClient]);

  /**
   * Refetch merchant queries immediately
   */
  const refetchMerchants = useCallback(() => {
    queryClient.refetchQueries({
      queryKey: ["admin", "merchants"],
      type: "active",
    });
  }, [queryClient]);

  /**
   * Refetch pending merchant queries immediately
   */
  const refetchPendingMerchants = useCallback(() => {
    queryClient.refetchQueries({
      queryKey: ["admin", "pending-merchants"],
      type: "active",
    });
  }, [queryClient]);

  /**
   * Refetch both merchants and pending merchants queries immediately
   */
  const refetchMerchantsAndPending = useCallback(() => {
    queryClient.refetchQueries({
      queryKey: ["admin", "merchants"],
      type: "active",
    });
    queryClient.refetchQueries({
      queryKey: ["admin", "pending-merchants"],
      type: "active",
    });
  }, [queryClient]);

  /**
   * Update merchant data in cache
   * Accepts both readonly and mutable arrays as query keys
   */
  const updateMerchantInCache = useCallback(
    <T>(
      queryKey: readonly unknown[] | unknown[], // ✅ Accept both readonly and mutable
      updater: (oldData: T | undefined) => T | undefined,
    ) => {
      queryClient.setQueryData<T>(queryKey as unknown[], updater);
    },
    [queryClient],
  );

  return {
    queryClient, // Expose for custom operations
    invalidateMerchants,
    invalidatePendingMerchants,
    invalidateMerchantsAndPending,
    refetchMerchants,
    refetchPendingMerchants,
    refetchMerchantsAndPending,
    updateMerchantInCache,
  };
};
