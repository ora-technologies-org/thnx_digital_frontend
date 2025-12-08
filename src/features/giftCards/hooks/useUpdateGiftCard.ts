import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { giftCardService } from '../services/giftCardService';
import { UpdateGiftCardData } from '../types/giftCard.types';

export const useUpdateGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGiftCardData }) =>
      giftCardService.updateGiftCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['giftCards']);
      toast.success('Gift card updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update gift card';
      toast.error(message);
    },
  });
};