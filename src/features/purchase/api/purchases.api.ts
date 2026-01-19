// ============================================
// src/features/purchases/api/purchases.api.ts - PURCHASE API!
// ============================================
import axios from "axios";
import type {
  PurchaseRequest,
  PurchaseResponse,
} from "../types/purchase.types";

const API = import.meta.env.VITE_API_URL || "/api";

export const purchasesApi = {
  // Purchase a gift card
  purchaseGiftCard: async (
    data: PurchaseRequest,
  ): Promise<PurchaseResponse> => {
    const response = await axios.post<PurchaseResponse>(
      `${API}/purchases/gift-cards/${data.giftCardId}`,
      {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  },
};
