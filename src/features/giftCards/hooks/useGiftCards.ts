import { useQuery } from '@tanstack/react-query';
import { giftCardService } from '../services/giftCardService';

export const useGiftCards = () => {
  return useQuery({
    queryKey: ['giftCards'],
    queryFn: giftCardService.getMyGiftCards,
  });
};

export const useGiftCard = (id: string) => {
  return useQuery({
    queryKey: ['giftCard', id],
    queryFn: () => giftCardService.getGiftCard(id),
    enabled: !!id,
  });
};

export const useActiveGiftCards = () => {
  return useQuery({
    queryKey: ['activeGiftCards'],
    queryFn: giftCardService.getActiveGiftCards,
  });
};