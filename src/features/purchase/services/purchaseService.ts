import api from "../../../shared/utils/api";
import type {
  PurchaseData,
  PurchasedGiftCard,
  RedeemData,
  RedemptionResponse,
  GiftCardQRData,
  RedemptionHistoryItem,
  CustomerPurchase,
} from "../types/purchase.types";

export const purchaseService = {
  // Purchase a gift card
  purchaseGiftCard: async (
    giftCardId: string,
    data: PurchaseData,
  ): Promise<PurchasedGiftCard> => {
    const response = await api.post<{
      success: boolean;
      data: { purchase: PurchasedGiftCard };
    }>(`/purchases/gift-cards/${giftCardId}`, data);
    return response.data.data.purchase;
  },

  // Get gift card by QR code
  getGiftCardByQR: async (qrCode: string): Promise<GiftCardQRData> => {
    const response = await api.get<{
      success: boolean;
      data: { purchase: GiftCardQRData };
    }>(`/purchases/qr/${qrCode}`);
    return response.data.data.purchase;
  },

  // Redeem gift card
  redeemGiftCard: async (data: RedeemData): Promise<RedemptionResponse> => {
    const response = await api.post<RedemptionResponse>(
      "/purchases/redeem",
      data,
    );
    return response.data;
  },

  // Get redemption history
  getRedemptionHistory: async (): Promise<RedemptionHistoryItem[]> => {
    const response = await api.get<{
      success: boolean;
      data: { redemptions: RedemptionHistoryItem[] };
    }>("/purchases/redemptions");
    return response.data.data.redemptions;
  },

  // Get customer purchases
  getCustomerPurchases: async (email: string): Promise<CustomerPurchase[]> => {
    const response = await api.get<{
      success: boolean;
      data: { purchases: CustomerPurchase[] };
    }>(`/purchases/customer/${email}`);
    return response.data.data.purchases;
  },
};
