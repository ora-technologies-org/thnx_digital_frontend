import { useQuery, useQueryClient } from "@tanstack/react-query";
import { merchantService } from "../services/merchantService";

export const useMerchants = () => {
  return useQuery({
    queryKey: ["merchants"],
    queryFn: () => merchantService.getMerchants(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMerchant = (merchantId: string) => {
  return useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () => merchantService.getMerchantById(merchantId),
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMerchantGiftCards = (userId: string) => {
  return useQuery({
    queryKey: ["merchant-gift-cards", userId],
    queryFn: () => merchantService.MerchantGiftCard(userId),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000,
  });
};

export const useGiftCard = (cardId: string) => {
  return useQuery({
    queryKey: ["gift-card", cardId],
    queryFn: () => merchantService.getGiftCardDetails(cardId),
    enabled: !!cardId,
    staleTime: 3 * 60 * 1000,
  });
};

export const usePrefetchMerchantGiftCards = () => {
  const queryClient = useQueryClient();

  return (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["merchant-gift-cards", userId],
      queryFn: () => merchantService.MerchantGiftCard(userId),
    });
  };
};
