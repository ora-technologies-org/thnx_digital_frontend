// giftCardService.js
// Service file for handling all Gift Card API calls

const GiftCardService = {
  // Base API URL - Update this to match your backend API
  baseURL: "https://g820v4kp-5000.inc1.devtunnels.ms/api/users/myRedemptions",

  /**
   * Fetch gift card data by QR code
   * @param {string} qrCode - The QR code of the gift card
   * @returns {Promise} - Promise resolving to the gift card data
   */
  async fetchByQRCode(qrCode) {
    try {
      const url = `${this.baseURL}/${qrCode}`;
      console.log("Fetching gift card data from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching gift card data:", error);
      throw error;
    }
  },

  /**
   * You can add more API methods here as needed
   * For example:
   *
   * async redeemGiftCard(qrCode, amount) {
   *   // Implementation
   * }
   *
   * async cancelGiftCard(qrCode) {
   *   // Implementation
   * }
   */
};

export default GiftCardService;
