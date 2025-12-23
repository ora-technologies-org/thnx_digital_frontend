// src/routes/routePaths.ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  CHANGE: "/change-password",

  // Customer
  BROWSE: "/browse",
  PURCHASE: "/purchase/:id",

  // Merchant - ALL paths defined
  MERCHANT_DASHBOARD: "/merchant/dashboard",
  MERCHANT_GIFT_CARDS: "/merchant/gift-cards",
  MERCHANT_ORDERS: "/merchant/orders",
  MERCHANT_SCAN: "/merchant/scan",
  MERCHANT_ANALYTICS: "/merchant/analytics",
  MERCHANT_PAYOUTS: "/merchant/payouts",
  MERCHANT_REDEMPTIONS: "/merchant/redemptions",
  MERCHANT_SETTINGS: "/merchant/settings",
  COMPLETE_PROFILE: "/merchant/complete-profile",
} as const;
