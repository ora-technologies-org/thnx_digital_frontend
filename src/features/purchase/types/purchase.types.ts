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

// ADD THIS NEW INTERFACE:
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
