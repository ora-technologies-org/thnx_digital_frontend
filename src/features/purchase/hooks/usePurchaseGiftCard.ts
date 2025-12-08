
// ============================================
// src/features/purchases/hooks/usePurchaseGiftCard.ts - PURCHASE HOOK!
// ============================================

import { useMutation } from '@tanstack/react-query';
import { purchasesApi } from '../api/purchases.api';
import type { PurchaseRequest } from '../types/purchase.types';

export const usePurchaseGiftCard = () => {
  return useMutation({
    mutationFn: (data: PurchaseRequest) => purchasesApi.purchaseGiftCard(data),
    onSuccess: (data) => {
      console.log('Purchase successful:', data);
    },
    onError: (error) => {
      console.error('Purchase failed:', error);
    },
  });
};