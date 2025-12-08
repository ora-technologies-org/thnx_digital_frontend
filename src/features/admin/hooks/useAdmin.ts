// src/features/admin/hooks/useAdmin.ts - ADMIN HOOKS! 🎣
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';

export const usePendingMerchants = () => {
  return useQuery({
    queryKey: ['admin', 'pending-merchants'],
    queryFn: adminApi.getPendingMerchants,
  });
};

export const useAllMerchants = () => {
  return useQuery({
    queryKey: ['admin', 'merchants'],
    queryFn: adminApi.getAllMerchants,
  });
};

export const useApproveMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, notes }: { merchantId: string; notes: string }) =>
      adminApi.approveMerchant(merchantId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-merchants'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'merchants'] });
    },
  });
};

export const useRejectMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      merchantId, 
      reason, 
      notes 
    }: { 
      merchantId: string; 
      reason: string; 
      notes: string;
    }) => adminApi.rejectMerchant(merchantId, reason, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-merchants'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'merchants'] });
    },
  });
};