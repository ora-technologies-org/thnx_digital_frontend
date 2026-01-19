// src/features/purchases/types/purchase.types.ts - PURCHASE TYPES! 📦

export interface PurchaseFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  transactionId: string;
}

export interface PurchaseRequest extends PurchaseFormData {
  giftCardId: string;
}

export interface PurchaseResponse {
  id: string;
  code: string; // QR code
  qrCode?: string; // Alternative field name
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  giftCardId: string;
  amount: string;
  paymentMethod: string;
  transactionId: string;
  isRedeemed: boolean;
  createdAt: string;
}

export interface PurchasedGiftCard {
  id: string;
  qrCode: string;
  qrCodeImage: string; // Base64 image data
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  currentBalance: number;
  initialAmount: number;
  expiresAt: string;
  isRedeemed: boolean;
  createdAt: string;
  giftCard: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  merchant: {
    id: string;
    businessName: string;
  };
}

// ✅ ADD THESE NEW INTERFACES BELOW:

// Alias for PurchaseFormData (used in purchaseService)
export type PurchaseData = PurchaseFormData;

// Redeem gift card request - UPDATED to include all fields from your hook
export interface RedeemData {
  qrCode: string;
  otp: string;
  amount: number;
  locationName: string;
  locationAddress: string;
  notes: string;
}

// Redemption response
export interface RedemptionResponse {
  success: boolean;
  message?: string;
  data?: {
    redemption: {
      id: string;
      purchaseId: string;
      merchantId: string;
      redeemedAmount: number;
      remainingBalance: number;
      redeemedAt: string;
      amount?: number; // Added based on your mutation
    };
    purchase?: PurchasedGiftCard;
    remainingBalance?: number; // Added based on your mutation
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
