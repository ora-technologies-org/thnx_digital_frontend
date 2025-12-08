// src/features/orders/api/orders.api.ts - REAL API INTEGRATION! 🔌
import type { OrdersResponse, Order, PurchaseVerification, CreateOrderData } from '../types/order.types';

const API_BASE_URL = 'http://localhost:4001/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

export const ordersApi = {
  // Get all purchases/orders for the merchant
  getOrders: async (): Promise<OrdersResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/merchant/purchases`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Transform API response to match our Order type
      const orders: Order[] = data.purchases?.map((purchase: any) => ({
        id: purchase.id,
        orderId: purchase.code || purchase.id, // Use QR code as order ID
        customer: {
          id: purchase.customerId || purchase.id,
          name: purchase.customerName,
          email: purchase.customerEmail,
          phone: purchase.customerPhone,
        },
        giftCard: {
          id: purchase.giftCardId,
          title: purchase.giftCard?.title || 'Gift Card',
          description: purchase.giftCard?.description,
          price: purchase.amount || purchase.giftCard?.price,
          code: purchase.code, // QR code
        },
        quantity: 1, // Assuming 1 per purchase
        amount: purchase.amount || purchase.giftCard?.price,
        status: purchase.isRedeemed ? 'completed' : 'pending',
        paymentMethod: purchase.paymentMethod,
        transactionId: purchase.transactionId,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
        completedAt: purchase.redeemedAt,
      })) || [];

      return {
        orders,
        total: orders.length,
        page: 1,
        limit: 100,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Verify purchase by QR code
  verifyPurchase: async (qrCode: string): Promise<PurchaseVerification> => {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases/qr/${qrCode}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Purchase not found');
        }
        throw new Error('Failed to verify purchase');
      }

      const data = await response.json();
      
      return {
        isValid: true,
        purchase: {
          id: data.id,
          code: data.code,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          giftCard: {
            id: data.giftCardId,
            title: data.giftCard?.title || 'Gift Card',
            price: data.amount || data.giftCard?.price,
          },
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          isRedeemed: data.isRedeemed,
          redeemedAt: data.redeemedAt,
          createdAt: data.createdAt,
        },
      };
    } catch (error) {
      console.error('Error verifying purchase:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  },



  createOrder: async (data: CreateOrderData): Promise<any> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchases/gift-cards/${data.giftCardId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
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
        throw new Error('Failed to create order');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },



  // Mark purchase as redeemed
  redeemPurchase: async (purchaseId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases/${purchaseId}/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to redeem purchase');
      }
    } catch (error) {
      console.error('Error redeeming purchase:', error);
      throw error;
    }
  },
};