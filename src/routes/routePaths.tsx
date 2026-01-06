// src/routes/routePaths.ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Customer
  BROWSE: "/browse",
  PURCHASE: "/purchase/:id",

  // Auth & Password Reset
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",

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
  MERCHANT_BASE: "/merchant",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PENDING: "/admin/pending",
  ADMIN_MERCHANTS: "/admin/merchants",
  ADMIN_CREATE_MERCHANT: "/admin/create-merchant",
  ADMIN_GIFTCARDS: "/admin/giftcards",
  ADMIN_REVENUE: "/admin/revenue",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_ACTIVITY: "/admin/activity",
  ADMIN_SETTINGS: "/admin/settings",
} as const;
