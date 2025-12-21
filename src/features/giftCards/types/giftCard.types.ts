export interface GiftCard {
  id: string;
  merchantId: string;
  title: string;
  description?: string;
  price: string;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  merchant?: {
    id: string;
    name: string;
    merchantProfile?: {
      businessName: string;
      logo?: string;
    };
  };
}

export interface CreateGiftCardData {
  title: string;
  description?: string;
  price: number;
  expiryDate: string;
}

export interface UpdateGiftCardData {
  title?: string;
  description?: string;
  price?: number;
  expiryDate?: string;
  isActive?: boolean;
}
export interface GiftCardSettings {
  id: string;
  merchantId: string;
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: string;
  fontFamily: string;
  createdAt: string;
  updatedAt: string;
}
export interface GiftCardsResponse {
  success: boolean;
  data: {
    giftCards: GiftCard[];
    settings: GiftCardSettings[];
    total: number;
    limit: number;
    remaining: number;
  };
}
