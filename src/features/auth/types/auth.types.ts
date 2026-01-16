export interface User {
  avatar: string | undefined;
  id: string;
  email: string;
  name: string;
  role: "USER" | "MERCHANT" | "ADMIN";
  isVerified: boolean;
  merchantProfile?: MerchantProfile;
  isFirstTime?: boolean;
}

export interface MerchantProfile {
  id: string;
  businessName: string;
  businessType?: string;
  businessCategory?: string;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  businessName: string;
  businessType?: string;
  businessCategory?: string;
  city?: string;
  country?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface PendingMerchant extends User {
  merchantProfile: MerchantProfile & {
    isVerified: false;
  };
}
