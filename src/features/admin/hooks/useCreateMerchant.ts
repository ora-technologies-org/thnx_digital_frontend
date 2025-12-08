// src/features/admin/hooks/useCreateMerchant.ts - REACT QUERY HOOK! 🎣
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMerchant, CreateMerchantRequest } from '../api/createMerchant';
import { toast } from 'react-hot-toast';

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (merchantData: CreateMerchantRequest) => createMerchant(merchantData),
    onSuccess: (data) => {
      // Invalidate merchants list to refresh data
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      queryClient.invalidateQueries({ queryKey: ['pending-merchants'] });
      
      toast.success(data.message || 'Merchant created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create merchant';
      toast.error(errorMessage);
    },
  });
};