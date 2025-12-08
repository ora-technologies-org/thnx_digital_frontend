
// ============================================
// src/features/purchases/api/purchases.api.ts - PURCHASE API!
// ============================================
// import { API_CONFIG, getAuthHeaders } from '../../../config/api.config';
import type { PurchaseRequest, PurchaseResponse } from '../types/purchase.types';

const API = import.meta.env.VITE_API_URL || '/api';

export const purchasesApi = {
  // Purchase a gift card
  purchaseGiftCard: async (data: PurchaseRequest): Promise<PurchaseResponse> => {
    const response = await fetch(
      `${API}/purchases/gift-cards/${data.giftCardId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to purchase gift card');
    }

    return response.json();
  },
};