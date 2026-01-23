// src/routes/routePaths.ts
export const ROUTES = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  BROWSE: "/browse",
  PURCHASE: "/purchase/:id",
  MERCHANTS: "/merchants",
  BALANCE: "/balance/:qrCode",

  // Password Reset Routes
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",
  CHANGE_PASSWORD: "/change-password",

  // Merchant Routes
  MERCHANT_DASHBOARD: "/merchant/dashboard",
  MERCHANT_GIFT_CARDS: "/merchant/gift-cards",
  MERCHANT_ORDERS: "/merchant/orders",
  MERCHANT_SCAN: "/merchant/scan",
  MERCHANT_SCAN_QR: "/merchant/scan/:qrCode",
  MERCHANT_ANALYTICS: "/merchant/analytics",
  MERCHANT_PAYOUTS: "/merchant/payouts",
  MERCHANT_REDEMPTIONS: "/merchant/redemptions",
  MERCHANT_SETTINGS: "/merchant/settings",
  MERCHANT_COMPLETE_PROFILE: "/merchant/complete-profile",
  MERCHANT_NOTIFICATIONS: "/merchant/notifications",
  MERCHANT_SUPPORT: "/merchant/support",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_UPDATE: "/admin/update",
  ADMIN_CREATE_MERCHANT: "/admin/create-merchant",
  ADMIN_EDIT_MERCHANT: "/admin/merchants/edit/:id",
  ADMIN_PENDING: "/admin/pending",
  ADMIN_MERCHANTS: "/admin/merchants",
  ADMIN_GIFT_CARDS: "/admin/giftcards",
  ADMIN_REVENUE: "/admin/revenue",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_ACTIVITY: "/admin/activity",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_SUPPORT_TICKETS: "/admin/support-tickets",
  ADMIN_CONTACT_US: "/admin/contact-us",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
} as const;
