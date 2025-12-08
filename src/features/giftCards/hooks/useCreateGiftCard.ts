import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { giftCardService } from '../services/giftCardService';
import { CreateGiftCardData } from '../types/giftCard.types';

export const useCreateGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGiftCardData) => giftCardService.createGiftCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['giftCards']);
      toast.success('Gift card created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create gift card';
      toast.error(message);
    },
  });
};