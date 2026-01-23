import { useQuery, useQueryClient } from "@tanstack/react-query";
import { merchantService } from "../services/merchantService";

/**
 * Hook to fetch all merchants
 * @returns Query result with merchants list, cached for 5 minutes
 */
export const useMerchants = () => {
  return useQuery({
    queryKey: ["merchants"],
    queryFn: () => merchantService.getMerchants(),
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache persists for 10 minutes
  });
};

/**
 * Hook to fetch a single merchant by ID
 * @param merchantId - The merchant's unique identifier
 * @returns Query result with merchant details, only runs if merchantId is provided
 */
export const useMerchant = (merchantId: string) => {
  return useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () => merchantService.getMerchantById(merchantId),
    enabled: !!merchantId, // Only fetch if merchantId is truthy
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch gift cards for a specific user
 * @param userId - The user's unique identifier
 * @returns Query result with user's gift cards, cached for 3 minutes
 */
export const useMerchantGiftCards = (userId: string) => {
  return useQuery({
    queryKey: ["merchant-gift-cards", userId],
    queryFn: () => merchantService.MerchantGiftCard(userId),
    enabled: !!userId, // Only fetch if userId is truthy
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Hook to fetch detailed information about a specific gift card
 * @param cardId - The gift card's unique identifier
 * @returns Query result with gift card details
 */
export const useGiftCard = (cardId: string) => {
  return useQuery({
    queryKey: ["gift-card", cardId],
    queryFn: () => merchantService.getGiftCardDetails(cardId),
    enabled: !!cardId, // Only fetch if cardId is truthy
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Hook to prefetch merchant gift cards data
 * Useful for optimistic data loading before navigation or user interaction
 * @returns Function that accepts userId and prefetches their gift cards
 */
export const usePrefetchMerchantGiftCards = () => {
  const queryClient = useQueryClient();

  return (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["merchant-gift-cards", userId],
      queryFn: () => merchantService.MerchantGiftCard(userId),
    });
  };
};
