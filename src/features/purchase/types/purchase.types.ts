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

