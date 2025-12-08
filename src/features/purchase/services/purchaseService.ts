import api from '../../../shared/utils/api';
import type {
  PurchaseData,
  PurchasedGiftCard,
  RedeemData,
  RedemptionResponse,
} from '../types/purchase.types';

export const purchaseService = {
  // Purchase a gift card
  purchaseGiftCard: async (giftCardId: string, data: PurchaseData): Promise<PurchasedGiftCard> => {
    const response = await api.post<{
      success: boolean;
      data: { purchase: PurchasedGiftCard };
    }>(`/purchases/gift-cards/${giftCardId}`, data);
    return response.data.data.purchase;
  },

  // Get gift card by QR code
  getGiftCardByQR: async (qrCode: string): Promise<any> => {
    const response = await api.get<{ success: boolean; data: { purchase: any } }>(
      `/purchases/qr/${qrCode}`
    );
    return response.data.data.purchase;
  },

  // Redeem gift card
  redeemGiftCard: async (data: RedeemData): Promise<RedemptionResponse> => {
    const response = await api.post<RedemptionResponse>('/purchases/redeem', data);
    return response.data;
  },

  // Get redemption history
  getRedemptionHistory: async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: { redemptions: any[] } }>(
      '/purchases/redemptions'
    );
    return response.data.data.redemptions;
  },

  // Get customer purchases
  getCustomerPurchases: async (email: string): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: { purchases: any[] } }>(
      `/purchases/customer/${email}`
    );
    return response.data.data.purchases;
  },
};