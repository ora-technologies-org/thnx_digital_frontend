import { GradientDirection } from "@/shared/types/giftCard.types";

export interface GiftCard {
  id: string;
  merchantId: string;
  title: string;
  description?: string;
  price: number;
  balance?: number;
  cardNumber?: string;
  status: string;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    purchases: number;
  };
  merchant?: {
    id: string;
    name: string;
    merchantProfile: {
      businessName: string;
      businessLogo?: string;
    };
  };
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  businessLogo?: string;
  businessRegistrationNumber: string;
  taxId?: string;
  businessType?: string;
  businessCategory?: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  website?: string;
  registrationDocument?: string;
  taxDocument?: string;
  identityDocument?: string;
  additionalDocuments?: string[];
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode?: string;
  swiftCode?: string;
  profileStatus:
    | "PENDING_VERIFICATION"
    | "VERIFIED"
    | "REJECTED"
    | "INCOMPLETE";
  isVerified: boolean;
  verifiedAt?: string;
  verifiedById?: string;
  verificationNotes?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  description?: string;
  logo?: string;
  giftCardLimit: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    createdAt: string;
    isActive: boolean;
  };
}

export interface MerchantSetting {
  merchantId: string;
  primaryColor?: string;
  secondaryColor?: string;
  gradientDirection?: GradientDirection;
  fontFamily?: string;
  [key: string]: unknown;
}

export interface MerchantsResponse {
  merchants: Merchant[];
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
    profileStatus: string | null;
    active: boolean | null;
  };
  statusCounts: {
    PENDING_VERIFICATION: number;
    VERIFIED: number;
    REJECTED: number;
    INCOMPLETE: number;
  };
}

export interface GetMerchantsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | "INCOMPLETE";
  active?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateMerchantResponse {
  success: boolean;
  data: {
    merchantId: string;
    email: string;
    name: string;
    businessName: string;
  };
  message: string;
}

export interface UpdateMerchantResponse {
  success: boolean;

  data: {
    merchantId: string;
    email: string;
    name: string;
    businessName: string;
  };
  message: string;
}

export interface VerifyMerchantRequest {
  verificationNotes?: string;
}

export interface RejectMerchantRequest {
  rejectionReason: string;
  verificationNotes?: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  statusCode: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
