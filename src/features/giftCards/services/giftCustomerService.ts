// giftCardService.ts
// Service file for handling all Gift Card API calls

import axios from "axios";
import api from "@/shared/utils/api";

interface GiftCardData {
  // Define your gift card data structure here
  // Update based on your actual API response
  qrCode: string;
  // Add other fields as needed
}

const GiftCardService = {
  /**
   * Fetch gift card data by QR code
   * @param {string} qrCode - The QR code of the gift card
   * @returns {Promise} - Promise resolving to the gift card data
   */
  async fetchByQRCode(qrCode: string): Promise<GiftCardData> {
    try {
      const url = `users/myRedemptions/${qrCode}`;
      console.log("Fetching gift card data from:", url);

      const response = await api.get<GiftCardData>(url);

      return response.data;
    } catch (error) {
      console.error("Error fetching gift card data:", error);

      // Handle axios errors with better error messages
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          `HTTP error! status: ${error.response?.status}`;
        throw new Error(errorMessage);
      }

      throw error;
    }
  },

  /**
   * You can add more API methods here as needed
   * For example:
   *
   * async redeemGiftCard(qrCode: string, amount: number): Promise<void> {
   *   const response = await api.post(`users/myRedemptions/${qrCode}/redeem`, {
   *     amount
   *   });
   *   return response.data;
   * }
   *
   * async cancelGiftCard(qrCode: string): Promise<void> {
   *   const response = await api.post(`users/myRedemptions/${qrCode}/cancel`, {});
   *   return response.data;
   * }
   */
};

export default GiftCardService;
