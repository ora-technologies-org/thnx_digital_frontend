// src/features/orders/types/order.types.ts - UPDATED FOR REAL API! 📦

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface GiftCardInfo {
  id: string;
  title: string;
  description?: string;
  price: string;
  code?: string; // QR code for the purchased gift card
}


export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  giftCardId: string;
  paymentMethod: string;
  transactionId: string;
}

export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderId: string; // QR code or purchase ID
  customer: Customer;
  giftCard: GiftCardInfo;
  quantity: number;
  amount: string;
  discount?: string;
  tax?: string;
  status: OrderStatus;
  paymentMethod?: string; // e.g., "ESEWA", "KHALTI", "CREDIT_CARD"
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string; // redeemedAt
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// For QR verification
export interface PurchaseData {
  id: string;
  code: string; // QR code like "THNX-DIGITAL-MI7DLDHC-FE4C3267AB391E80"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  giftCard: {
    id: string;
    title: string;
    price: string;
  };
  amount: string;
  paymentMethod: string; // "ESEWA", etc.
  transactionId: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  createdAt: string;
}

export interface PurchaseVerification {
  isValid: boolean;
  purchase?: PurchaseData;
  error?: string;
}