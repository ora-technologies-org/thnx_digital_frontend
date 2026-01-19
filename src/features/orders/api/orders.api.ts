// src/features/orders/api/orders.api.ts - FIXED VERSION WITH AXIOS

import axios from "axios";
import type {
  OrdersResponse,
  Order,
  PurchaseVerification,
  CreateOrderData,
} from "../types/order.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("accessToken") || "";
};

// Query parameters interface
export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

interface ApiOrder {
  id: string;
  giftCardId: string;
  qrCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purchaseAmount: string;
  currentBalance: string;
  status: "ACTIVE" | "USED" | "EXPIRED";
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  purchasedAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  giftCard: {
    id: string;
    title: string;
    price: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data:
    | {
        data: ApiOrder[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
        filters: {
          search: string | null;
          sortBy: string;
          sortOrder: string;
        };
      }
    | ApiOrder[]; // Support both nested and flat array structures
}

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

export const ordersApi = {
  // Get all purchases/orders with pagination and filters
  getOrders: async (params?: OrdersQueryParams): Promise<OrdersResponse> => {
    try {
      // Build query params object
      const queryParams: Record<string, string> = {};

      if (params?.page) queryParams.page = params.page.toString();
      if (params?.limit) queryParams.limit = params.limit.toString();
      if (params?.search) queryParams.search = params.search;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
      if (params?.status && params.status !== "all") {
        queryParams.status = params.status;
      }

      // Set default sortOrder if no params
      if (!params || Object.keys(queryParams).length === 0) {
        queryParams.sortOrder = "desc";
      }

      const url = `${API_BASE_URL}merchants/orders`;

      console.log("Fetching orders from:", url);

      const response = await axios.get<ApiResponse>(url, {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const apiResponse = response.data;

      console.log("API Response:", apiResponse);
      console.log("API Response.data type:", typeof apiResponse.data);
      console.log(
        "Is API Response.data an array?",
        Array.isArray(apiResponse.data),
      );

      // Check if response has the expected structure
      if (!apiResponse.data) {
        throw new Error("Invalid API response structure - missing data");
      }

      // Handle different possible response structures
      let ordersArray: ApiOrder[] = [];
      let paginationData = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      // Check if data is directly an array
      if (Array.isArray(apiResponse.data)) {
        ordersArray = apiResponse.data;
        paginationData.total = ordersArray.length;
      }
      // Check if data has nested data property
      else if (
        typeof apiResponse.data === "object" &&
        "data" in apiResponse.data
      ) {
        ordersArray = apiResponse.data.data || [];
        paginationData = {
          total: apiResponse.data.pagination?.total || ordersArray.length,
          page: apiResponse.data.pagination?.page || 1,
          limit: apiResponse.data.pagination?.limit || 10,
          totalPages: apiResponse.data.pagination?.totalPages || 1,
        };
      }

      if (!Array.isArray(ordersArray)) {
        console.error("Orders data is not an array:", ordersArray);
        throw new Error("Invalid API response - data is not an array");
      }

      console.log("Orders array length:", ordersArray.length);

      // Transform API response to match our Order type
      const orders: Order[] = ordersArray.map((item: ApiOrder) => ({
        id: item.id,
        orderId: item.qrCode,

        customer: {
          id: item.id,
          name: item.customerName,
          email: item.customerEmail,
          phone: item.customerPhone,
        },

        giftCard: {
          id: item.giftCardId,
          title: item.giftCard.title,
          description: undefined,
          price: parseFloat(item.giftCard.price),
          code: item.qrCode,
        },

        quantity: 1,
        amount: parseFloat(item.purchaseAmount),
        currentBalance: parseFloat(item.currentBalance),
        status: item.status,

        paymentMethod: item.paymentMethod,
        paymentStatus: item.paymentStatus,
        transactionId: item.transactionId,

        createdAt: item.purchasedAt,
        updatedAt: item.purchasedAt,
        expiresAt: item.expiresAt,
        completedAt: item.lastUsedAt,
      }));

      return {
        orders,
        total: paginationData.total,
        page: paginationData.page,
        limit: paginationData.limit,
        totalPages: paginationData.totalPages,
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Verify purchase by QR code
  verifyPurchase: async (qrCode: string): Promise<PurchaseVerification> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}purchases/qr/${qrCode}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data;

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
            title: data.giftCard?.title || "Gift Card",
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
      console.error("Error verifying purchase:", error);

      // Check if it's a 404 error
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          isValid: false,
          error: "Purchase not found",
        };
      }

      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }
  },

  createOrder: async (data: CreateOrderData): Promise<CreateOrderResponse> => {
    try {
      const response = await axios.post<CreateOrderResponse>(
        `${API_BASE_URL}purchases/gift-cards/${data.giftCardId}`,
        {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Mark purchase as redeemed
  redeemPurchase: async (purchaseId: string): Promise<void> => {
    try {
      await axios.post(
        `${API_BASE_URL}purchases/${purchaseId}/redeem`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Error redeeming purchase:", error);
      throw error;
    }
  },
};
