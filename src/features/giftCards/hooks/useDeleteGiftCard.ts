import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { giftCardService } from '../services/giftCardService';

export const useDeleteGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => giftCardService.deleteGiftCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['giftCards']);
      toast.success('Gift card deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete gift card';
      toast.error(message);
    },
  });
};