// types.ts or types/index.ts

export interface GiftCard {
  id: string;
  merchantId: string;
  title: string;
  description?: string;
  price: string;
  expiryDate: string;
  isActive: boolean;
  merchantLogo?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  merchant?: {
    id: string;
    name: string;
    merchantProfile?: {
      businessName: string;
      logo?: string;
    };
  };
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

export interface GiftCardSettings {
  id: string;
  merchantId: string;
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: string;
  fontFamily: string;
  createdAt: string;
  updatedAt: string;
}

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
export interface MerchantProfile {
  businessName: string;
  businessLogo?: string;
}

export interface Merchant {
  id: string;
  name: string;
  merchantProfile: MerchantProfile;
}

export interface GiftCardType {
  id: string;
  title: string;
  price: string;
  expiryDate: string;
  isActive: boolean;
  merchant?: Merchant;
  _count?: {
    purchases: number;
  };
}

export interface GiftCardDisplaySettings {
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: string;
  fontFamily: string;
}

export interface GiftCardDisplayProps {
  giftCard: GiftCardType;
  settings?: GiftCardSettings;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  showActions?: boolean;
  clickable?: boolean;
  className?: string;
}
