// types.ts or types/index.ts

import { GradientDirection } from "@/shared/types/giftCard.types";

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// MERCHANT TYPES
// ============================================

export type MerchantStatus =
  | "VERIFIED"
  | "PENDING_VERIFICATION"
  | "REJECTED"
  | "INCOMPLETE";

export interface MerchantProfile {
  businessName: string;
  businessLogo?: string;
  logo?: string;
}

export interface Merchant {
  id: string;
  userId: string;
  businessName?: string | null;
  businessEmail?: string | null;
  businessCategory?: string | null;
  description?: string | null;
  profileStatus?: MerchantStatus;
  user?: User;
  merchantProfile?: MerchantProfile;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// GIFT CARD TYPES
// ============================================

export interface GiftCard {
  id: string;
  merchantId: string;
  title: string;
  description?: string;
  price: number;
  expiryDate: string;
  isActive: boolean;
  imageUrl?: string | null;
  merchantLogo?: string | null;
  status?: string;
  createdAt: string;
  updatedAt: string;
  merchant?: Merchant;
  _count?: {
    purchases: number;
  };
}

export interface CreateGiftCardData {
  title: string;
  description?: string;
  price: number;
  expiryDate: string;
  isActive?: boolean;
}

export interface UpdateGiftCardData {
  title?: string;
  description?: string;
  price?: number;
  expiryDate?: string;
  isActive?: boolean;
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface GiftCardSettings {
  id: string;
  merchantId: string;
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: GradientDirection;
  fontFamily: string;
  createdAt: string;
  updatedAt: string;
}

export interface GiftCardDisplaySettings {
  primaryColor: string;
  secondaryColor: string;
  gradientDirection?: GradientDirection;
  fontFamily?: string;
}

// MerchantSetting type (from API response)
// FIXED: Changed gradientDirection from string to GradientDirection
export interface MerchantSetting {
  id?: string;
  merchantId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  gradientDirection?: GradientDirection; // ✅ Changed from string to GradientDirection
  fontFamily?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Filters {
  search: string | null;
  sortBy: string;
  sortOrder: string;
}

export interface StatusCounts {
  VERIFIED: number;
  PENDING_VERIFICATION: number;
  REJECTED: number;
  INCOMPLETE: number;
}

export type StatsDataKey =
  | "total"
  | "verified"
  | "pending"
  | "rejected"
  | "incomplete";

export interface StatsData {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  incomplete: number;
}

export interface MerchantsResponse {
  success: boolean;
  message: string;
  merchants: Merchant[];
  pagination: Pagination;
  statusCounts: StatusCounts;
}

export interface MerchantGiftCardsResponse {
  success: boolean;
  message: string;
  giftCards: GiftCard[];
  setting: MerchantSetting | null;
}

export interface GiftCardsResponse {
  success: boolean;
  message: string;
  data: {
    giftCards: GiftCard[];
    settings: GiftCardSettings[];
    pagination: Pagination;
    filters: Filters;
    totalGiftCards: number;
    activeCards: number;
    totalValue: string;
    expiringSoon: number;
    limitAllowed: number;
    remaining: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export type CreateGiftCardResponse = ApiResponse<GiftCard>;
export type UpdateGiftCardResponse = ApiResponse<GiftCard>;
export type DeleteGiftCardResponse = ApiResponse<{ id: string }>;

// ============================================
// STATE TYPES
// ============================================

export interface GiftCardState {
  giftCards: GiftCard[];
  selectedGiftCard: GiftCard | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: "all" | "active" | "inactive" | "expired";
  };
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface GiftCardDisplayProps {
  giftCard: GiftCard;
  settings?: GiftCardSettings | GiftCardDisplaySettings | MerchantSetting;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  showActions?: boolean;
  clickable?: boolean;
  className?: string;
}

export interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: GiftCard | null;
  settings?: GiftCardSettings | GiftCardDisplaySettings | MerchantSetting;
}

export interface MerchantCardProps {
  merchant: Merchant;
  onClick?: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface StatsCardsProps {
  statusCounts: StatusCounts;
  total: number;
}
