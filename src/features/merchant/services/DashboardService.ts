// src/services/DashboardService.ts
import axios, { AxiosError } from "axios";
import api from "@/shared/utils/api";
// ==================== TYPE DEFINITIONS ====================

/**
 * Dashboard statistics data structure
 */
export interface DashboardStats {
  totalSales: string;
  activeGiftCards: number;
  redemptions: number;
  revenue: string;
}

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Service response structure
 */
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthMeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    avatar: string | null;
    bio: string;
    emailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    merchantProfile?: {
      id: string;
      businessName: string;
      profileStatus: string;
      isVerified: boolean;
      verifiedAt: string;
      rejectionReason: string | null;
      rejectedAt: string | null;
      address: string;
      city: string;
      country: string;
      businessPhone: string;
      businessEmail: string;
      website: string | null;
      logo: string | null;
      description: string | null;
    };
  };
}

export interface UserData {
  name: string;
  phone: string;
  bio: string;
}

// ==================== API FUNCTIONS ====================
/**
 * Authentication related services
 */
export const authService = {
  /**
   * Fetches the authenticated user's data
   */
  getAuthMe: async (): Promise<UserData> => {
    const response = await api.get<AuthMeResponse>("/auth/me");
    const user = response.data.data;

    return {
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
    };
  },
};

/**
 * Fetch dashboard statistics for the authenticated merchant
 * @returns {Promise<ServiceResponse<DashboardStats>>} Dashboard statistics
 */
export const getDashboardStats = async (): Promise<
  ServiceResponse<DashboardStats>
> => {
  try {
    const response = await api.get<ApiResponse<DashboardStats>>(
      "/merchants/dashboard",
    );

    console.log("📊 [Dashboard Service] Stats fetched successfully");

    // Extract data from response (handle both nested and direct data)
    const statsData = response.data.data || response.data;

    return {
      success: true,
      data: {
        totalSales: statsData.totalSales || "0",
        activeGiftCards: statsData.activeGiftCards || 0,
        redemptions: statsData.redemptions || 0,
        revenue: statsData.revenue || "0",
      },
    };
  } catch (error) {
    console.error("❌ [Dashboard Service] Error fetching stats:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<DashboardStats>>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "Failed to fetch dashboard stats",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats",
    };
  }
};

// ==================== DEFAULT EXPORT ====================

/**
 * Export all functions as a single object for backward compatibility
 */
const DashboardService = {
  getDashboardStats,
};

export default DashboardService;
