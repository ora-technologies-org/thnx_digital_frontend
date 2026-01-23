// src/features/orders/types/order.types.ts - UPDATED FOR REAL API! 📦

// Customer information structure
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

// Gift card details
export interface GiftCardInfo {
  id: string;
  title: string;
  description?: string;
  price: string;
  code?: string; // QR code for the purchased gift card
}

// Data required to create a new order
export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  giftCardId: string;
  paymentMethod: string;
  transactionId: string;
}

export type OrderStatus =
  | "ACTIVE"
  | "USED"
  | "EXPIRED"
  | "pending"
  | "completed"
  | "failed"
  | "refunded";

export interface Order {
  id: string;
  orderId?: string;
  orderNumber?: string;
  qrCode?: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  purchaseAmount?: number | string;
  currentBalance?: number | string;
  bonusAmount?: number | string;
  amount?: number | string;
  totalAmount?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customer?: Customer;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  purchasedAt?: string;
  expiresAt?: string;
  usedAt?: string;
  notes?: string;
  items?: OrderItem[];
}

// Response structure for fetching orders list
export interface OrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Response structure for creating an order
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    code: string;
    amount: number;
    isRedeemed: boolean;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: string;
    transactionId: string;
    giftCardId: string;
    createdAt: string;
    updatedAt: string;
  };
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

// QR verification response
export interface PurchaseVerification {
  isValid: boolean;
  purchase?: PurchaseData;
  error?: string;
}

/** Payment status types */
export type PaymentStatus = "COMPLETED" | "PENDING" | "FAILED";

/** Order item interface for detailed line items */
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
