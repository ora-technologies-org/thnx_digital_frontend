import api from "../../../shared/utils/api";
import {
  GiftCard,
  CreateGiftCardData,
  UpdateGiftCardData,
  GiftCardsResponse,
} from "../types/giftCard.types";

// Type for notify merchant request
interface NotifyMerchantData {
  name: string;
  email: string;
  phone: string;
  merchantId: string;
  giftCardId: string;
}

export const giftCardService = {
  // Get all merchant's gift cards
  getMyGiftCards: async (): Promise<GiftCardsResponse> => {
    const response = await api.get<GiftCardsResponse>("/gift-cards");
    return response.data;
  },

  // Get single gift card
  getGiftCard: async (id: string): Promise<GiftCard> => {
    const response = await api.get<{
      success: boolean;
      data: { giftCard: GiftCard };
    }>(`/gift-cards/${id}`);
    return response.data.data.giftCard;
  },

  // Get gift cards by merchant/user ID
  getGiftCards: async (userId: string): Promise<GiftCard[]> => {
    const response = await api.get<{
      success: boolean;
      data: { giftCards: GiftCard[] };
    }>(`/gift-cards/merchant/${userId}`);
    return response.data.data.giftCards;
  },

  // Get active gift cards (public)
  getActiveGiftCards: async (): Promise<GiftCard[]> => {
    const response = await api.get<{
      success: boolean;
      data: { giftCards: GiftCard[] };
    }>("/gift-cards/public/active");
    return response.data.data.giftCards;
  },

  // Create gift card
  createGiftCard: async (data: CreateGiftCardData): Promise<GiftCard> => {
    const response = await api.post<{
      success: boolean;
      data: { giftCard: GiftCard };
    }>("/gift-cards", data);
    return response.data.data.giftCard;
  },

  // Update gift card
  updateGiftCard: async (
    id: string,
    data: UpdateGiftCardData,
  ): Promise<GiftCard> => {
    const response = await api.put<{
      success: boolean;
      data: { giftCard: GiftCard };
    }>(`/gift-cards/${id}`, data);
    return response.data.data.giftCard;
  },

  // Delete gift card
  deleteGiftCard: async (id: string): Promise<void> => {
    await api.delete(`/gift-cards/${id}`);
  },

  // Notify merchant about purchase interest
  notifyMerchant: async (
    data: NotifyMerchantData,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/users/notify-merchant",
      data,
    );
    return response.data;
  },
};
