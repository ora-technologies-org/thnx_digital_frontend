// src/features/purchases/types/purchase.types.ts - PURCHASE TYPES! 📦

export interface PurchaseFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  transactionId: string;
}
// Add this interface to your purchase.types.ts file
// Add these interfaces to your purchase.types.ts file

// Redemption history item
export interface RedemptionHistoryItem {
  id: string;
  purchaseId: string;
  merchantId: string;
  redeemedAmount: number;
  remainingBalance: number;
  locationName: string;
  locationAddress: string;
  notes?: string;
  redeemedAt: string;
  purchase?: {
    id: string;
    qrCode: string;
    customerName: string;
    giftCard: {
      title: string;
      description: string;
    };
  };
}

// Customer purchase (for merchant view of customer purchases)
export interface CustomerPurchase {
  id: string;
  qrCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  currentBalance: number;
  initialAmount: number;
  expiresAt: string;
  isRedeemed: boolean;
  createdAt: string;
  giftCard: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  redemptions?: RedemptionHistoryItem[];
}
export interface GiftCardQRData {
  id: string;
  qrCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  currentBalance: number;
  initialAmount: number;
  expiresAt: string;
  isRedeemed: boolean;
  createdAt: string;
  giftCard: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  merchant: {
    id: string;
    businessName: string;
    address?: string;
    city?: string;
  };
}
export interface PurchaseRequest extends PurchaseFormData {
  giftCardId: string;
}
export interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId: string;
  qrCode: string;
  customerEmail?: string;
  customerPhone?: string;
  currentBalance: string;
  merchantAddress?: string; // NEW: merchant address
  merchantCity?: string; // NEW: merchant city
  onOTPVerified: (
    amount: string,
    locationName: string,
    locationAddress: string,
    notes: string,
  ) => void;
  onRequestOTP: (purchaseId: string) => Promise<void>;
  onVerifyOTP: (otp: string, purchaseId: string) => Promise<boolean>;
  isRequestingOTP: boolean;
  isVerifyingOTP: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  otpError: string;
}
export interface PurchaseResponse {
  id: string;
  code: string; // QR code
  qrCode?: string; // Alternative field name
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  giftCardId: string;
  amount: string;
  paymentMethod: string;
  transactionId: string;
  isRedeemed: boolean;
  createdAt: string;
}

export interface PurchasedGiftCard {
  id: string;
  qrCode: string;
  qrCodeImage: string; // Base64 image data
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  currentBalance: number;
  initialAmount: number;
  expiresAt: string;
  isRedeemed: boolean;
  createdAt: string;
  giftCard: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  merchant: {
    id: string;
    businessName: string;
  };
}

// ✅ ADD THESE NEW INTERFACES BELOW:

// Alias for PurchaseFormData (used in purchaseService)
export type PurchaseData = PurchaseFormData;

// Redeem gift card request - UPDATED to include all fields from your hook
export interface RedeemData {
  qrCode: string;
  otp: string;
  amount: number;
  locationName: string;
  locationAddress: string;
  notes: string;
}

// Redemption response
export interface RedemptionResponse {
  success: boolean;
  message?: string;
  data?: {
    redemption: {
      id: string;
      purchaseId: string;
      merchantId: string;
      redeemedAmount: number;
      remainingBalance: number;
      redeemedAt: string;
      amount?: number; // Added based on your mutation
    };
    purchase?: PurchasedGiftCard;
    remainingBalance?: number; // Added based on your mutation
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
// Define a proper interface for the purchase object
export interface Purchase {
  id: string;
  transactionId: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  code?: string;
  qrCode?: string;
  createdAt: string | Date;
}
interface Redemption {
  id: string;
  itemName: string;
  date: string;
  amount: string;
  status: "success" | "failed";
}

export interface PurchasesData {
  balance: number;
  recentRedemptions: Redemption[];
}

export interface UseOTPRedeemReturn {
  // OTP States
  isRequestingOTP: boolean;
  isVerifyingOTP: boolean;
  isRedeeming: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  redeemSuccess: boolean;
  otpError: string;
  redeemError: string;

  // Methods
  requestOTP: (purchaseId: string) => Promise<void>;
  verifyOTP: (otp: string, purchaseId: string) => Promise<boolean>;
  redeemGiftCard: (
    qrCode: string,
    amount: string,
    locationName: string,
    locationAddress: string,
    notes: string,
  ) => Promise<{ success: boolean; message?: string }>;
  resetOTPFlow: () => void;

  // Refresh purchase data
  refreshPurchaseData: (qrCode: string) => Promise<PurchasesData | null>;
}
