export type NotificationType =
  | "MERCHANT_REGISTERED"
  | "PROFILE_SUBMITTED_FOR_VERIFICATION"
  | "PURCHASE_MADE"
  | "REDEMPTION_MADE"
  | "PROFILE_VERIFIED"
  | "PROFILE_REJECTED"
  | "GIFT_CARD_PURCHASED"
  | "GIFT_CARD_REDEEMED";

export type RecipientType = "ADMIN" | "MERCHANT";

export interface Notification {
  id: string;
  createdAt: string;
  recipientId: string;
  recipientType: RecipientType;
  type: NotificationType;
  title: string;
  message: string;
  resourceType: string | null;
  resourceId: string | null;
  isRead: boolean;
  readAt: string | null;
  actorId: string | null;
  actorName: string | null;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  pagination: NotificationPagination;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  merchantRegistered: boolean;
  profileSubmittedForVerification: boolean;
  purchaseMade: boolean;
  redemptionMade: boolean;
  profileVerified: boolean;
  profileRejected: boolean;
  giftCardPurchased: boolean;
  giftCardRedeemed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferencesResponse {
  success: boolean;
  data: NotificationPreferences;
}

export interface UpdatePreferencesPayload {
  merchantRegistered?: boolean;
  profileSubmittedForVerification?: boolean;
  purchaseMade?: boolean;
  redemptionMade?: boolean;
  profileVerified?: boolean;
  profileRejected?: boolean;
  giftCardPurchased?: boolean;
  giftCardRedeemed?: boolean;
}

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  MERCHANT_REGISTERED: {
    label: "New Merchant",
    icon: "👤",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  PROFILE_SUBMITTED_FOR_VERIFICATION: {
    label: "Profile Submitted",
    icon: "📋",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  PURCHASE_MADE: {
    label: "New Purchase",
    icon: "💳",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  REDEMPTION_MADE: {
    label: "Redemption",
    icon: "🎁",
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
  },
  PROFILE_VERIFIED: {
    label: "Profile Verified",
    icon: "✅",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  PROFILE_REJECTED: {
    label: "Profile Rejected",
    icon: "❌",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  GIFT_CARD_PURCHASED: {
    label: "Gift Card Sold",
    icon: "🛒",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
  },
  GIFT_CARD_REDEEMED: {
    label: "Gift Card Redeemed",
    icon: "🎫",
    color: "text-teal-700",
    bgColor: "bg-teal-100",
  },
};
