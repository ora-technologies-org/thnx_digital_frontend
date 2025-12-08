import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { purchaseService } from '../services/purchaseService';
import type { RedeemData } from '../types/purchase.types';


export const useRedeemGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RedeemData) => purchaseService.redeemGiftCard(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['redemptions']);
      toast.success(`Redeemed ₹${data.data.redemption.amount}. Remaining: ₹${data.data.remainingBalance}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to redeem gift card';
      toast.error(message);
    },
  });
};