import { useQuery } from "@tanstack/react-query";
import { giftCardService } from "../services/giftCardService";

export const useGiftCards = () => {
  return useQuery({
    queryKey: ["giftCards"],
    queryFn: giftCardService.getMyGiftCards,
  });
};

export const useGiftCard = (id: string) => {
  return useQuery({
    queryKey: ["giftCard", id],
    queryFn: () => giftCardService.getGiftCard(id),
    enabled: !!id,
  });
};

export const MerchantGiftCard = (userId) => {
  return useQuery({
    queryKey: ["giftCards", userId],
    queryFn: () => merchantService.getGiftCards(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveGiftCards = () => {
  return useQuery({
    queryKey: ["activeGiftCards"],
    queryFn: giftCardService.getActiveGiftCards,
  });
};
